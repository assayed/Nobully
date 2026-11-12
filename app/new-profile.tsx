import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Character, { SKINS } from '../src/art/Character';
import { DEFAULT_SHIRT, heroToLook } from '../src/game/hero';
import { HeroLook, newProfile } from '../src/game/rules';
import { play } from '../src/sound';
import { useApp } from '../src/store';
import { C, F, shadow } from '../src/theme';
import { BigButton, Bouncy, Card, HeroAvatar, Screen, TopBar, Txt } from '../src/ui';

const GENDERS: HeroLook['gender'][] = ['boy', 'girl', 'hijab'];

export default function NewProfile() {
  const { t, rtl, upsertProfile, set } = useApp();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<HeroLook['gender']>('boy');
  const [skin, setSkin] = useState(1);
  const look: HeroLook = { gender, skin, shirt: DEFAULT_SHIRT[gender] };

  const create = () => {
    const p = newProfile(name.trim(), look);
    upsertProfile(p);
    set({ activeId: p.id });
    play('win');
    router.replace('/home');
  };

  return (
    <Screen>
      <TopBar title={t('createHero')} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <View style={{ alignItems: 'center' }}>
          <HeroAvatar look={look} size={130} />
        </View>

        <Card style={{ gap: 8 }}>
          <Txt w="bold" style={{ fontSize: 18 }}>✏️ {t('yourName')}</Txt>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('namePlaceholder')}
            maxLength={14}
            style={[styles.input, { textAlign: rtl ? 'right' : 'left' }]}
            placeholderTextColor="#A8A29E"
          />
        </Card>

        <Card style={{ gap: 10 }}>
          <Txt w="bold" style={{ fontSize: 18 }}>🎨 {t('pickLook')}</Txt>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
            {GENDERS.map((g) => (
              <Bouncy key={g} onPress={() => setGender(g)} style={[styles.choice, gender === g && styles.chosen]}>
                <Character look={heroToLook({ gender: g, skin, shirt: DEFAULT_SHIRT[g] })} mood="happy" size={62} />
                <Txt w="bold" center style={{ fontSize: 13 }}>{t(g)}</Txt>
              </Bouncy>
            ))}
          </View>
          <Txt w="bold" style={{ fontSize: 16 }}>{t('skin')}</Txt>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
            {SKINS.map((c, i) => (
              <Bouncy key={c} onPress={() => setSkin(i)} style={[styles.swatch, { backgroundColor: c }, skin === i && { borderColor: C.primary, borderWidth: 4 }]}>
                <View />
              </Bouncy>
            ))}
          </View>
        </Card>

        <BigButton label={t('start')} icon="🚀" onPress={create} disabled={name.trim().length < 2} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { fontFamily: F.bold, fontSize: 22, backgroundColor: '#FFF7ED', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 2, borderColor: C.border, color: C.ink },
  choice: { alignItems: 'center', padding: 6, borderRadius: 20, borderWidth: 3, borderColor: 'transparent', backgroundColor: '#F8FAFC', width: 96 },
  chosen: { borderColor: C.primary, backgroundColor: '#FFEDD5' },
  swatch: { width: 46, height: 46, borderRadius: 23, borderWidth: 2, borderColor: '#fff', ...shadow },
});
