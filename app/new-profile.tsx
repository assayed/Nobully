import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Character, { SKINS } from '../src/art/Character';
import { DEFAULT_SHIRT, heroToLook } from '../src/game/hero';
import { HeroLook, newProfile } from '../src/game/rules';
import { buzz, play } from '../src/sound';
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
  const [hint, setHint] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);
  const ok = name.trim().length >= 2;

  const create = () => {
    if (!ok) {
      // explain instead of a silent grey button
      setHint(true);
      play('wrong'); buzz('wrong');
      input.current?.focus();
      Animated.sequence([10, -10, 8, -8, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true }))).start();
      return;
    }
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
          <Animated.View style={{ transform: [{ translateX: shake }] }}>
          <TextInput
            ref={input}
            accessibilityLabel={t('yourName')}
            value={name}
            onChangeText={(v) => { setName(v); if (v.trim().length >= 2) setHint(false); }}
            placeholder={t('namePlaceholder')}
            maxLength={14}
            style={[styles.input, { textAlign: rtl ? 'right' : 'left' }]}
            placeholderTextColor="#78716C"
          />
          </Animated.View>
          {hint && <Txt w="bold" style={{ color: C.bad }}>{t('nameFirst')}</Txt>}
        </Card>

        <Card style={{ gap: 10 }}>
          <Txt w="bold" style={{ fontSize: 18 }}>🎨 {t('pickLook')}</Txt>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
            {GENDERS.map((g) => (
              <Bouncy key={g} label={t(g)} onPress={() => setGender(g)} style={[styles.choice, gender === g && styles.chosen]}>
                <Character look={heroToLook({ gender: g, skin, shirt: DEFAULT_SHIRT[g] })} mood="happy" size={62} />
                <Txt w="bold" center style={{ fontSize: 13 }}>{t(g)}</Txt>
              </Bouncy>
            ))}
          </View>
          <Txt w="bold" style={{ fontSize: 16 }}>{t('skin')}</Txt>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
            {SKINS.map((c, i) => (
              <Bouncy key={c} label={`${t('skin')} ${i + 1}`} onPress={() => setSkin(i)} style={[styles.swatch, { backgroundColor: c }, skin === i && { borderColor: C.primary, borderWidth: 4 }]}>
                <View />
              </Bouncy>
            ))}
          </View>
        </Card>

        <BigButton label={t('start')} icon="🚀" onPress={create} style={!ok && { opacity: 0.75 }} />
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
