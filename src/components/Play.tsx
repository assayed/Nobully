import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import Character from '../art/Character';
import Prop from '../art/Props';
import { OPTION_ICONS, SCENES } from '../art/scenes';
import { scenarioById } from '../content/scenarios';
import { heroToLook } from '../game/hero';
import { applyAnswer, BADGES, dayKey } from '../game/rules';
import { buzz, hush, play, say, sayLines } from '../sound';
import { signed } from '../i18n';
import { useApp } from '../store';
import { C, shadow } from '../theme';
import { BigButton, Bouncy, Card, Loop, Pop, Screen, TopBar, Txt } from '../ui';
import SceneView, { Outcome } from './SceneView';

const OPTION_COLORS = ['#3B82F6', '#F59E0B', '#A855F7'];

export default function Play({ ids, mode, title, color }: { ids: string[]; mode: 'world' | 'daily'; title: string; color: string }) {
  const app = useApp();
  const { active: profile, lang, t, n, readAloud, L } = app;
  // Play the unfinished situations (all of them once a world is complete), but show every
  // situation of the world in the progress dots so the count matches the home card.
  const queue = useMemo(() => {
    const todo = ids.filter((id) => mode === 'daily' || !profile?.answers[id]?.done);
    return todo.length ? todo : ids;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [idx, setIdx] = useState(0);
  const [wrongs, setWrongs] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<Outcome>('none');
  const [okey, setOkey] = useState(0);
  const [delta, setDelta] = useState(0);
  const [finished, setFinished] = useState(false);
  const [firstTries, setFirstTries] = useState(0);
  const [badge, setBadge] = useState<string | null>(null);

  const sc = scenarioById(queue[idx]);
  const practiceRef = useRef(false);
  const startRef = useRef('');
  if (sc && startRef.current !== sc.id + idx) {
    startRef.current = sc.id + idx;
    practiceRef.current =
      mode === 'world' ? !!profile?.answers[sc.id]?.done : profile?.daily.last === dayKey();
  }
  const practice = practiceRef.current;

  // shuffle the answers once per situation
  const order = useMemo(() => {
    if (!sc) return [];
    const o = sc.options.map((_, i) => i);
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return o;
  }, [sc]);

  // which line is being read (-1 none, 0 question, 1..3 answers) and which answer is picked
  const [reading, setReading] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const NUMS = [t('one'), t('two'), t('three')];
  const readAll = () => {
    if (!sc) return;
    sayLines([L(sc.question), ...order.map((i, pos) => `${NUMS[pos]}. ${L(sc.options[i].text)}`)], lang, setReading);
  };
  useEffect(() => {
    setPicked(null);
    if (!sc || !readAloud) return;
    const id = setTimeout(readAll, 500);
    return () => { clearTimeout(id); hush(); };
  }, [sc, order, lang, readAloud]); // eslint-disable-line react-hooks/exhaustive-deps

  // floating "+20" / "−30"
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!okey) return;
    float.setValue(0);
    Animated.timing(float, { toValue: 1, duration: 1300, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [okey, float]);

  // feedback card slide-in
  const panel = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    panel.setValue(0);
    if (outcome !== 'none') Animated.spring(panel, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [outcome, okey, panel]);

  if (!profile) return null;
  if (finished || !sc) return <Finished title={title} firstTries={firstTries} total={queue.length} mode={mode} />;

  const spec = SCENES[sc.id];
  const icons = OPTION_ICONS[sc.id] ?? [];

  // first tap: hear it; second tap (or the check button): choose it
  const tapOption = (i: number) => {
    if (outcome === 'good' || wrongs.includes(i)) return;
    if (picked === i) { choose(i); return; }
    play('tap'); buzz('tap');
    setPicked(i); setReading(-1);
    say(L(sc.options[i].text), lang);
  };

  const choose = (i: number) => {
    if (outcome === 'good' || wrongs.includes(i)) return;
    setPicked(null); setReading(-1);
    const good = sc.options[i].good;
    const res = applyAnswer(profile, { scenarioId: sc.id, option: i, good, hadWrong: wrongs.length > 0, practice, daily: mode === 'daily' });
    app.upsertProfile(res.profile);
    setDelta(res.delta);
    setOkey((x) => x + 1);
    if (good) {
      setOutcome('good');
      if (wrongs.length === 0) setFirstTries((x) => x + 1);
      play('good');
      setTimeout(() => play('coin'), 350);
      buzz('good');
      if (readAloud) say(`${t('great')} ${L(sc.lesson)}`, lang);
      if (res.newBadges.length) setTimeout(() => { setBadge(res.newBadges[0]); play('win'); }, 900);
    } else {
      setOutcome('wrong');
      setWrongs((w) => [...w, i]);
      play('wrong');
      buzz('wrong');
      if (readAloud) say(`${t('oops')}. ${sc.options[i].why ? L(sc.options[i].why!) : ''}`, lang);
    }
  };

  const next = () => {
    hush();
    setWrongs([]);
    setOutcome('none');
    if (idx + 1 >= queue.length) { play('win'); setFinished(true); } else setIdx(idx + 1);
  };

  const lastWrong = wrongs[wrongs.length - 1];
  const lastWhy = sc.options[lastWrong]?.why;
  const feedbackText = outcome === 'good' ? L(sc.lesson) : outcome === 'wrong' && lastWhy ? L(lastWhy) : '';

  return (
    <Screen bg={C.bg}>
      <TopBar title={title} coins={profile.coins} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12, paddingBottom: 40 }}>
        {/* progress dots */}
        <View style={styles.dots}>
          {ids.map((id) => {
            const current = id === sc.id;
            const done = !!profile.answers[id]?.done;
            return <View key={id} style={[styles.dot, { backgroundColor: current ? C.primary : done ? color : '#E5E7EB', width: current ? 26 : 12 }]} />;
          })}
        </View>
        {practice && <Txt center style={{ color: C.muted }}>🔁 {t('practice')}</Txt>}

        <View>
          {spec && <SceneView spec={spec} hero={profile.look} outcome={outcome} outcomeKey={okey} />}
          {okey > 0 && delta !== 0 && (
            <Animated.View
              pointerEvents="none"
              style={[styles.float, {
                opacity: float.interpolate({ inputRange: [0, 0.15, 0.8, 1], outputRange: [0, 1, 1, 0] }),
                transform: [
                  { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [20, -60] }) },
                  { scale: float.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.5, 1.3, 1] }) },
                ],
              }]}
            >
              <Prop id="coin" size={40} />
              <Txt w="black" style={{ fontSize: 40, color: delta > 0 ? C.good : C.bad }}>{signed(lang, delta)}</Txt>
            </Animated.View>
          )}
        </View>

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 3, borderColor: reading === 0 ? C.primary : 'transparent' }}>
          <Txt w="bold" style={{ flex: 1, fontSize: 19, lineHeight: 30 }}>{L(sc.question)}</Txt>
          <Bouncy label={t('listen')} onPress={readAll} style={[styles.speaker, reading >= 0 && { backgroundColor: '#FDE68A' }]}>
            <Txt style={{ fontSize: 28 }} center>🔊</Txt>
          </Bouncy>
        </Card>

        {outcome !== 'none' ? (
          <Animated.View style={{ opacity: panel, transform: [{ scale: panel.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }}>
            <Card style={{ backgroundColor: outcome === 'good' ? C.goodSoft : C.badSoft, borderWidth: 3, borderColor: outcome === 'good' ? C.good : C.bad, gap: 10, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Loop kind={outcome === 'good' ? 'spin' : 'swing'} ms={outcome === 'good' ? 2500 : 1600}><Txt style={{ fontSize: 56, lineHeight: 76 }}>{outcome === 'good' ? '🎉' : '🤔'}</Txt></Loop>
                <Loop kind={outcome === 'good' ? 'bob' : 'swing'} ms={outcome === 'good' ? 600 : 2000}>
                  <Character look={heroToLook(profile.look)} mood={outcome === 'good' ? 'happy' : 'sad'} arms={outcome === 'good' ? 'up' : 'down'} size={110} />
                </Loop>
                <Loop kind="pulse" ms={outcome === 'good' ? 700 : 1600}><Txt style={{ fontSize: 56, lineHeight: 76 }}>{outcome === 'good' ? '⭐' : '💭'}</Txt></Loop>
              </View>
              <Txt w="black" center style={{ fontSize: 26, color: outcome === 'good' ? C.good : C.bad }}>
                {outcome === 'good' ? t('great') : t('oops')}
              </Txt>
              <Bouncy label={feedbackText} onPress={() => say(feedbackText, lang)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Txt style={{ fontSize: 24 }}>🔊</Txt>
                <Txt center style={{ fontSize: 18, lineHeight: 30, flexShrink: 1 }}>{feedbackText}</Txt>
              </Bouncy>
              {outcome === 'good' ? (
                <BigButton label={idx + 1 >= queue.length ? t('finish') : t('next')} icon="⭐" color={C.good} onPress={next} style={{ alignSelf: 'stretch' }} />
              ) : (
                <BigButton label={t('tryAgain')} icon="🔄" color={C.primary} onPress={() => setOutcome('none')} style={{ alignSelf: 'stretch' }} />
              )}
            </Card>
          </Animated.View>
        ) : (
          <View style={{ gap: 10 }}>
            {order.map((i, pos) => {
              const o = sc.options[i];
              const used = wrongs.includes(i);
              const isPicked = picked === i;
              const lit = isPicked || reading === pos + 1;
              const col = OPTION_COLORS[pos];
              return (
                <Pop key={i} k={sc.id + idx} delay={200 + pos * 150}>
                <Bouncy label={L(o.text)} onPress={() => tapOption(i)} disabled={used} silent
                  style={[styles.option, { borderColor: used ? '#E5E7EB' : col, opacity: used ? 0.45 : 1, backgroundColor: lit ? col + '1F' : '#fff' }, isPicked && { borderWidth: 5 }]}>
                  <View style={[styles.optPic, { backgroundColor: used ? '#F3F4F6' : col + '26' }]}>
                    <View style={[styles.num, { backgroundColor: used ? '#A1A1AA' : col }]}><Txt w="black" center style={{ color: '#fff', fontSize: 18, lineHeight: 30 }}>{n(pos + 1)}</Txt></View>
                    <Character look={heroToLook(profile.look)} mood={isPicked ? 'surprised' : 'neutral'} arms={isPicked ? 'up' : 'down'} size={66} />
                    <Loop kind={lit && !used ? 'pulse' : 'bob'} ms={lit && !used ? 700 : 2000 + pos * 250}>
                      <Txt center style={{ fontSize: 46, lineHeight: 62, marginStart: -10 }}>{used ? '❌' : icons[i] ?? '❓'}</Txt>
                    </Loop>
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Txt w="bold" style={{ fontSize: 18, lineHeight: 28, textDecorationLine: used ? 'line-through' : 'none' }}>{lit && !used ? '🔊 ' : ''}{L(o.text)}</Txt>
                    {isPicked && (
                      <Loop kind="pulse" ms={900} style={{ alignSelf: 'flex-start' }}>
                      <Bouncy label={t('pickThis')} onPress={() => choose(i)} silent style={[styles.pick, { backgroundColor: col }]}>
                        <Txt w="black" center style={{ color: '#fff', fontSize: 18 }}>✓ {t('pickThis')}</Txt>
                      </Bouncy>
                      </Loop>
                    )}
                  </View>
                </Bouncy>
                </Pop>
              );
            })}
            <Txt center style={{ color: C.muted, fontSize: 13 }}>{t('tapAnswer')}</Txt>
          </View>
        )}
      </ScrollView>
      {badge && <BadgePopup id={badge} onClose={() => setBadge(null)} />}
    </Screen>
  );
}

function BadgePopup({ id, onClose }: { id: string; onClose: () => void }) {
  const { lang, t } = useApp();
  const b = BADGES.find((x) => x.id === id);
  const s = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();
  }, [s, spin]);
  if (!b) return null;
  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.badgeCard, { transform: [{ scale: s }] }]}>
        <Animated.View style={{ position: 'absolute', top: 10, transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Txt style={{ fontSize: 120, opacity: 0.15 }}>✨</Txt>
        </Animated.View>
        <Txt w="black" center style={{ fontSize: 24, color: C.purple }}>{t('newBadge')}</Txt>
        <Txt center style={{ fontSize: 80, lineHeight: 110 }}>{b.icon}</Txt>
        <Txt w="bold" center style={{ fontSize: 22 }}>{b[lang]}</Txt>
        <BigButton label="👍" onPress={onClose} color={C.purple} style={{ alignSelf: 'stretch', marginTop: 8 }} />
      </Animated.View>
    </View>
  );
}

function Finished({ title, firstTries, total, mode }: { title: string; firstTries: number; total: number; mode: 'world' | 'daily' }) {
  const { active, t, n } = useApp();
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }).start(); }, [s]);
  if (!active) return null;
  const stars = firstTries === total ? 3 : firstTries >= total / 2 ? 2 : 1;
  return (
    <Screen bg="#FEF3C7">
      <TopBar title={title} coins={active.coins} onBack={() => router.replace('/home')} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Animated.View style={{ flexDirection: 'row', gap: 6, transform: [{ scale: s }] }}>
          {[0, 1, 2].map((i) => <Txt key={i} style={{ fontSize: 54, opacity: i < stars ? 1 : 0.2 }}>⭐</Txt>)}
        </Animated.View>
        <Character look={heroToLook(active.look)} mood="happy" arms="up" size={140} />
        <Txt w="black" center style={{ fontSize: 28 }}>{mode === 'daily' ? t('great') : t('worldDone')}</Txt>
        <Txt center style={{ fontSize: 18 }}>{t('firstTryCount')}: {n(firstTries)} / {n(total)}</Txt>
        <Card style={{ alignSelf: 'stretch' }}><Txt center style={{ fontSize: 15, lineHeight: 24 }}>{t('tellAdult')}</Txt></Card>
        <BigButton label={t('backHome')} icon="🏠" onPress={() => router.replace('/home')} style={{ alignSelf: 'stretch' }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, flexWrap: 'wrap' },
  dot: { height: 12, borderRadius: 6 },
  float: { position: 'absolute', alignSelf: 'center', top: '30%', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 16, borderRadius: 30 },
  speaker: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 22, borderWidth: 3, borderBottomWidth: 6, padding: 10, ...shadow },
  optPic: { width: 128, height: 104, borderRadius: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4, overflow: 'hidden' },
  num: { position: 'absolute', top: 4, start: 4, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  pick: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 30 },
  badgeCard: { backgroundColor: '#fff', borderRadius: 30, padding: 24, alignItems: 'center', width: '100%', maxWidth: 360, overflow: 'hidden' },
});
