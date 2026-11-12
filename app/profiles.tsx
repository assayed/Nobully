import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useApp } from '../src/store';
import { C, shadow } from '../src/theme';
import { Bouncy, CoinPill, HeroAvatar, Screen, TopBar, Txt } from '../src/ui';

export const MAX_PROFILES = 4;

/** Who is playing? Up to four heroes per phone. */
export default function Profiles() {
  const { profiles, t, set } = useApp();
  return (
    <Screen>
      <TopBar title={t('whoPlays')} />
      <ScrollView contentContainerStyle={styles.grid}>
        {profiles.map((p) => (
          <Bouncy speak key={p.id} label={`${p.name}, ${p.coins}`} style={styles.card} onPress={() => { set({ activeId: p.id }); router.replace('/home'); }}>
            <HeroAvatar look={p.look} size={80} />
            <Txt w="black" center style={{ fontSize: 20 }} numberOfLines={1}>{p.name}</Txt>
            <CoinPill value={p.coins} />
          </Bouncy>
        ))}
        {profiles.length < MAX_PROFILES && (
          <Bouncy speak label={t('newHero')} style={[styles.card, styles.add]} onPress={() => router.push('/new-profile')}>
            <Txt center style={{ fontSize: 64, lineHeight: 90 }}>➕</Txt>
            <Txt w="black" center style={{ fontSize: 20, color: C.primaryDark }}>{t('newHero')}</Txt>
          </Bouncy>
        )}
      </ScrollView>
      <View style={{ padding: 16 }}>
        <Bouncy speak label={t('parents')} onPress={() => router.push('/parent')} style={styles.parent}>
          <Txt w="bold" center>👨‍👩‍👧 {t('parents')} 🔒</Txt>
        </Bouncy>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, padding: 16, justifyContent: 'center' },
  card: { width: 160, minHeight: 210, backgroundColor: '#fff', borderRadius: 26, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 6, borderBottomWidth: 6, borderBottomColor: C.border, ...shadow },
  add: { backgroundColor: '#FFEDD5', borderWidth: 3, borderStyle: 'dashed', borderColor: C.primary },
  parent: { backgroundColor: '#fff', borderRadius: 20, padding: 12, ...shadow },
});
