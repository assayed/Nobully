import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { scenarioById, scenariosOf, WORLDS } from '../src/content/scenarios';
import { levelOf, newProfile, Profile, RULES } from '../src/game/rules';
import { percent } from '../src/i18n';
import { buzz, play } from '../src/sound';
import { useApp } from '../src/store';
import { C, shadow } from '../src/theme';
import { Bar, Bouncy, Card, HeroAvatar, Screen, TopBar, Txt } from '../src/ui';

export default function Parent() {
  const { pin, t } = useApp();
  const [unlocked, setUnlocked] = useState(false);
  return (
    <Screen bg="#F0F9FF">
      <TopBar title={`👨‍👩‍👧 ${t('parentGate')}`} />
      {unlocked ? <Dashboard /> : <PinGate hasPin={!!pin} onOk={() => setUnlocked(true)} />}
    </Screen>
  );
}

function PinGate({ hasPin, onOk }: { hasPin: boolean; onOk: () => void }) {
  const { pin, set, t } = useApp();
  const [entry, setEntry] = useState('');
  const [first, setFirst] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const press = (d: string) => {
    if (d === '⌫') { setEntry((e) => e.slice(0, -1)); return; }
    const e = (entry + d).slice(0, 4);
    setEntry(e);
    if (e.length < 4) return;
    setTimeout(() => {
      setEntry('');
      if (hasPin) {
        if (e === pin) { play('good'); onOk(); } else { play('wrong'); buzz('wrong'); setErr(t('wrongPin')); }
      } else if (!first) { setFirst(e); setErr(null); }
      else if (first === e) { set({ pin: e }); play('good'); onOk(); }
      else { setFirst(null); play('wrong'); setErr(t('pinMismatch')); }
    }, 150);
  };

  const title = hasPin ? t('enterPin') : first ? t('confirmPin') : t('setPin');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }}>
      <Txt w="black" center style={{ fontSize: 22 }}>🔒 {title}</Txt>
      <View style={{ flexDirection: 'row', gap: 14, direction: 'ltr' }}>
        {[0, 1, 2, 3].map((i) => <View key={i} style={[styles.pinDot, i < entry.length && { backgroundColor: C.sky }]} />)}
      </View>
      {err && <Txt w="bold" center style={{ color: C.bad }}>{err}</Txt>}
      <View style={styles.pad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d, i) => (
          d ? (
            <Bouncy key={i} label={d === '⌫' ? 'delete' : d} onPress={() => press(d)} style={styles.key}>
              <Txt w="black" center style={{ fontSize: 26 }}>{d}</Txt>
            </Bouncy>
          ) : <View key={i} style={[styles.key, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />
        ))}
      </View>
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { t } = useApp();
  return (
    <View style={styles.row}>
      <Txt w="bold" style={{ flex: 1 }}>{label}</Txt>
      <Bouncy label={`${label}: ${value ? t('on') : t('off')}`} onPress={() => onChange(!value)} style={[styles.toggle, { backgroundColor: value ? C.good : C.off }]}>
        <Txt w="black" center style={{ color: '#fff' }}>{value ? t('on') : t('off')}</Txt>
      </Bouncy>
    </View>
  );
}

function Dashboard() {
  const app = useApp();
  const { t, n, lang, profiles } = app;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
      <Txt w="black" accessibilityRole="header" style={styles.section}>⚙️ {t('settings')}</Txt>
      <Card style={{ gap: 10 }}>
        <View style={styles.row}>
          <Txt w="bold" style={{ flex: 1 }}>🌐 Language / اللغة</Txt>
          <Bouncy label={t('language')} onPress={() => app.set({ lang: lang === 'ar' ? 'en' : 'ar' })} style={[styles.toggle, { backgroundColor: C.purple }]}>
            <Txt w="black" center style={{ color: '#fff' }}>{t('language')}</Txt>
          </Bouncy>
        </View>
        <Toggle label={`🔊 ${t('readAloud')}`} value={app.readAloud} onChange={(v) => app.set({ readAloud: v })} />
        <Toggle label={`🎵 ${t('music')}`} value={app.music} onChange={(v) => app.set({ music: v })} />
        <Toggle label={`🔔 ${t('sounds')}`} value={app.sounds} onChange={(v) => app.set({ sounds: v })} />
      </Card>

      <Card style={{ gap: 4 }}>
        <Txt w="black">🪙 {t('rules')}</Txt>
        <Txt style={{ lineHeight: 26 }}>{t('rulesText')}</Txt>
        <Txt style={{ color: C.muted, fontSize: 13 }}>{lang === 'ar' ? `كل بطل بيبدأ بـ ${n(RULES.START_COINS)} عملة.` : `Every hero starts with ${RULES.START_COINS} coins.`}</Txt>
      </Card>

      <Txt w="black" accessibilityRole="header" style={styles.section}>👧👦 {t('children')}</Txt>
      {profiles.map((p, i) => <ChildReport key={p.id} p={p} startOpen={i === 0} />)}

      <Card style={{ gap: 6, backgroundColor: '#FEF3C7' }}>
        <Txt w="black">☎️ {t('helpline')}</Txt>
        <Txt style={{ fontSize: 14, lineHeight: 24 }}>{t('tellAdult')}</Txt>
      </Card>
      <Txt center style={{ color: C.muted, fontSize: 13, lineHeight: 22 }}>🔐 {t('privacy')}</Txt>
      <Txt w="bold" center style={{ color: C.muted, fontSize: 13 }}>🏫 {t('credit')}</Txt>
    </ScrollView>
  );
}

function ChildReport({ p, startOpen }: { p: Profile; startOpen: boolean }) {
  const { t, n, lang, upsertProfile, removeProfile } = useApp();
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null);
  const [open, setOpen] = useState(startOpen);
  const answered = Object.values(p.answers).filter((a) => a.done);
  const first = answered.filter((a) => a.firstTry).length;
  const acc = answered.length ? first / answered.length : 0;
  const lvl = levelOf(p.earned);
  const recent = Array.from(new Map(p.mistakes.map((m) => [m.scenarioId, m])).values()).slice(0, 6);

  const act = (kind: 'reset' | 'delete') => {
    if (confirm !== kind) { setConfirm(kind); return; }
    if (kind === 'delete') removeProfile(p.id);
    else upsertProfile({ ...newProfile(p.name, { gender: p.look.gender, skin: p.look.skin, shirt: p.look.shirt }), id: p.id });
    setConfirm(null);
  };

  return (
    <Card style={{ gap: 10 }}>
      <Bouncy label={p.name} onPress={() => setOpen(!open)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <HeroAvatar look={p.look} size={56} still />
        <View style={{ flex: 1 }}>
          <Txt w="black" style={{ fontSize: 20 }}>{p.name}</Txt>
          <Txt style={{ color: C.muted }}>{lvl.icon} {lvl[lang]} · 🪙 {n(p.coins)} · 🏅 {n(p.badges.length)}</Txt>
          <Txt w="bold" style={{ fontSize: 14 }}>{t('accuracy')}: {percent(lang, Math.round(acc * 100))} ({n(first)}/{n(answered.length)})</Txt>
        </View>
        <Txt w="black" style={{ fontSize: 22 }}>{open ? '▲' : '▼'}</Txt>
      </Bouncy>
      {open && <>
      <Bar value={acc} color={C.good} />

      <Txt w="bold" style={{ marginTop: 4 }}>📊 {t('progress')}</Txt>
      {WORLDS.map((w) => {
        const list = scenariosOf(w.id);
        const done = list.filter((s) => p.answers[s.id]?.done).length;
        return (
          <View key={w.id} style={{ gap: 2 }}>
            <Txt style={{ fontSize: 14 }}>{w.emoji} {w.title[lang]} — {n(done)}/{n(list.length)}</Txt>
            <Bar value={done / list.length} color={w.color} bg={w.soft} height={8} />
          </View>
        );
      })}

      <Txt w="bold" style={{ marginTop: 6 }}>💬 {t('mistakesTitle')}</Txt>
      {recent.length === 0 ? <Txt style={{ color: C.muted }}>{t('noMistakes')}</Txt> : recent.map((m) => {
        const s = scenarioById(m.scenarioId);
        if (!s) return null;
        const w = WORLDS.find((x) => x.id === s.world)!;
        return (
          <View key={m.scenarioId} style={[styles.mistake, { borderColor: w.color }]}>
            <Txt w="bold" style={{ fontSize: 14, lineHeight: 22 }}>{s.question[lang]}</Txt>
            <Txt style={{ fontSize: 13, color: C.bad }}>✗ {s.options[m.option]?.text[lang]}</Txt>
            <Txt style={{ fontSize: 13, color: C.good }}>✓ {s.options.find((o) => o.good)?.text[lang]}</Txt>
            <Txt style={{ fontSize: 13, color: C.muted, lineHeight: 20 }}>💡 {t('talkTip')}: {w.parentTip[lang]}</Txt>
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
        <Bouncy onPress={() => act('reset')} style={[styles.danger, { backgroundColor: '#FEF3C7' }]}>
          <Txt w="bold" center style={{ fontSize: 13 }}>{confirm === 'reset' ? t('sure') : `🔄 ${t('resetProfile')}`}</Txt>
        </Bouncy>
        <Bouncy onPress={() => act('delete')} style={[styles.danger, { backgroundColor: C.badSoft }]}>
          <Txt w="bold" center style={{ fontSize: 13, color: C.bad }}>{confirm === 'delete' ? t('sure') : `🗑️ ${t('deleteProfile')}`}</Txt>
        </Bouncy>
      </View>
      </>}
    </Card>
  );
}

const styles = StyleSheet.create({
  pinDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: C.sky, backgroundColor: '#fff' },
  pad: { flexDirection: 'row', flexWrap: 'wrap', width: 270, gap: 12, justifyContent: 'center', direction: 'ltr' },
  key: { width: 78, height: 64, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggle: { borderRadius: 16, paddingHorizontal: 14, minHeight: 48, justifyContent: 'center', minWidth: 90 },
  section: { fontSize: 22, marginTop: 4 },
  mistake: { borderStartWidth: 5, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 10, gap: 2 },
  danger: { flex: 1, borderRadius: 14, padding: 10 },
});
