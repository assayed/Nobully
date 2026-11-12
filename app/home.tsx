import { Redirect, router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import Background from '../src/art/Backgrounds';
import { SCENES } from '../src/art/scenes';
import { scenariosOf, WORLDS } from '../src/content/scenarios';
import { dailyScenarioId, dayKey, levelOf } from '../src/game/rules';
import { play } from '../src/sound';
import { countNoun } from '../src/i18n';
import { useApp } from '../src/store';
import { C, shadow } from '../src/theme';
import { Bar, Bouncy, CoinPill, HeroAvatar, Screen, Txt } from '../src/ui';

export default function Home() {
  const { active, t, n, lang, set } = useApp();
  const wiggle = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(wiggle, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: -1, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.delay(1800),
    ])).start();
  }, [wiggle]);

  if (!active) return <Redirect href="/profiles" />;
  const lvl = levelOf(active.earned);
  const dailyDone = active.daily.last === dayKey();
  const dailySpec = SCENES[dailyScenarioId()];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {/* hero header */}
        <View style={[styles.header, shadow]}>
          <Bouncy label={active.name} onPress={() => { play('coin'); }} style={{ alignItems: 'center' }}>
            <HeroAvatar look={active.look} size={84} />
          </Bouncy>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
              <Txt w="black" style={{ fontSize: 24, flexShrink: 1 }} numberOfLines={1}>{active.name}</Txt>
              <CoinPill value={active.coins} big />
            </View>
            <Txt w="bold" style={{ color: C.purple }}>{lvl.icon} {lvl[lang]}</Txt>
            <Bar value={lvl.progress} color={C.purple} bg="#EDE9FE" height={12} />
            {lvl.next && <Txt style={{ fontSize: 12, color: C.muted }}>{n(lvl.next.min - active.earned)} {t('coins')} {t('nextLevel')} {lvl.next.icon}</Txt>}
          </View>
        </View>

        {/* daily challenge */}
        <Bouncy label={t('daily')} onPress={() => router.push('/daily')} style={[styles.daily, dailyDone && { opacity: 0.75 }]}>
          <View style={styles.dailyArt}>{dailySpec && <Background id={dailySpec.bg} />}</View>
          <View style={{ flex: 1, padding: 12, gap: 2 }}>
            <Txt w="black" style={{ fontSize: 20, color: '#fff' }}>📅 {t('daily')}</Txt>
            <Txt style={{ color: '#FEF9C3', fontSize: 13 }}>{dailyDone ? `✅ ${t('dailyDone')}` : `🎁 ${t('dailyBonus')}`}</Txt>
            {active.daily.streak > 0 && <Txt w="bold" style={{ color: '#fff' }}>🔥 × {n(active.daily.streak)}</Txt>}
          </View>
          {!dailyDone && (
            <Animated.View style={{ paddingHorizontal: 12, transform: [{ rotate: wiggle.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] }) }] }}>
              <Txt style={{ fontSize: 40 }}>🎁</Txt>
            </Animated.View>
          )}
        </Bouncy>

        {/* worlds */}
        <Txt w="black" style={{ fontSize: 22 }}>🗺️ {t('worlds')}</Txt>
        <View style={styles.worlds}>
          {WORLDS.map((w) => {
            const list = scenariosOf(w.id);
            const done = list.filter((s) => active.answers[s.id]?.done).length;
            const first = SCENES[list[0].id];
            return (
              <Bouncy key={w.id} label={`${w.title[lang]}, ${done} / ${list.length}`} onPress={() => router.push(`/world/${w.id}`)} style={[styles.world, { borderColor: w.color }]}>
                <View style={styles.worldArt}>
                  <Background id={first.bg} />
                  <View style={[styles.worldEmoji, { backgroundColor: w.color }]}><Txt style={{ fontSize: 26 }} center>{w.emoji}</Txt></View>
                  {done === list.length && <View style={styles.crown}><Txt style={{ fontSize: 26 }}>🏆</Txt></View>}
                </View>
                <View style={{ padding: 10, gap: 4 }}>
                  <Txt w="black" style={{ fontSize: 16, lineHeight: 24 }} numberOfLines={2}>{w.title[lang]}</Txt>
                  <Bar value={done / list.length} color={w.color} bg={w.soft} />
                  <Txt style={{ fontSize: 12, color: C.muted }}>{n(done)} / {n(list.length)} {t(countNoun(lang, list.length))}</Txt>
                </View>
              </Bouncy>
            );
          })}
        </View>

        {/* bottom actions */}
        <View style={styles.actions}>
          {[
            { icon: '🛍️', label: t('shop'), go: '/shop', color: '#BE185D' },
            { icon: '🏅', label: t('badges'), go: '/badges', color: '#B45309' },
            { icon: '👨‍👩‍👧', label: t('parents'), go: '/parent', color: '#0369A1' },
          ].map((a) => (
            <Bouncy key={a.go} label={a.label} onPress={() => router.push(a.go as never)} style={[styles.action, { backgroundColor: a.color }]}>
              <Txt center style={{ fontSize: 32, lineHeight: 44 }}>{a.icon}</Txt>
              <Txt w="black" center style={{ color: '#fff' }}>{a.label}</Txt>
            </Bouncy>
          ))}
        </View>

        <Bouncy onPress={() => { set({ activeId: null }); router.replace('/profiles'); }} style={styles.switch}>
          <Txt w="bold" center style={{ color: C.muted }}>🔄 {t('whoPlays')}</Txt>
        </Bouncy>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#fff', borderRadius: 26, padding: 14 },
  daily: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.purple, borderRadius: 24, overflow: 'hidden', borderBottomWidth: 6, borderBottomColor: '#5B21B6', ...shadow },
  dailyArt: { width: 90, alignSelf: 'stretch', minHeight: 90 },
  worlds: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  world: { width: '48%', backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden', borderWidth: 3, borderBottomWidth: 7, ...shadow },
  worldArt: { height: 90, overflow: 'hidden' },
  worldEmoji: { position: 'absolute', top: 8, start: 8, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  crown: { position: 'absolute', top: 6, end: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1, borderRadius: 22, paddingVertical: 10, borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.2)', ...shadow },
  switch: { padding: 10 },
});
