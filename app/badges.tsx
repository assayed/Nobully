import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BADGES } from '../src/game/rules';
import { useApp } from '../src/store';
import { C, shadow } from '../src/theme';
import { Screen, TopBar, Txt } from '../src/ui';

export default function Badges() {
  const { active, t, lang, n } = useApp();
  if (!active) return <Redirect href="/profiles" />;
  return (
    <Screen>
      <TopBar title={`🏅 ${t('badges')}`} coins={active.coins} />
      <Txt center w="bold" style={{ color: C.muted }}>{n(active.badges.length)} / {n(BADGES.length)}</Txt>
      <ScrollView contentContainerStyle={styles.grid}>
        {BADGES.map((b) => {
          const has = active.badges.includes(b.id);
          return (
            <View key={b.id} style={[styles.badge, !has && styles.locked]}>
              <Txt center style={{ fontSize: 48, lineHeight: 64, opacity: has ? 1 : 0.25 }}>{has ? b.icon : '🔒'}</Txt>
              <Txt w="bold" center style={{ fontSize: 14 }}>{b[lang]}</Txt>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16, justifyContent: 'center' },
  badge: { width: 104, height: 130, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 6, borderWidth: 3, borderColor: '#FDE68A', ...shadow },
  locked: { backgroundColor: '#F5F5F4', borderColor: '#E7E5E4' },
});
