import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { SceneSpec } from '../src/art/scenes';
import SceneView from '../src/components/SceneView';
import { play } from '../src/sound';
import { useApp } from '../src/store';
import { C } from '../src/theme';
import { Bouncy, Loop, Pop, Screen, Txt } from '../src/ui';

const TITLE_SCENE: SceneSpec = {
  bg: 'yard',
  cast: [
    { c: 'hero', x: 200, mood: 'happy', role: 'hero' },
    { c: 'laila', x: 110, mood: 'happy', role: 'other' },
    { c: 'omar', x: 290, mood: 'happy', role: 'other' },
    { c: 'karim', x: 50, mood: 'happy', role: 'other', s: 0.9 },
    { c: 'jana', x: 355, mood: 'happy', role: 'other', s: 0.9 },
  ],
  props: [{ p: 'ball', x: 240, y: 255, s: 0.6 }],
};

/** Title screen: the live game world as backdrop, the name, and a pulsing prompt. */
export default function Title() {
  const { t, lang, set } = useApp();
  const pop = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.5, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, [pop, pulse]);

  return (
    <Screen bg="#BAE6FD">
      <View style={styles.langRow}>
        <Bouncy speak label={t('language')} onPress={() => set({ lang: lang === 'ar' ? 'en' : 'ar' })} style={styles.lang}>
          <Txt w="bold" center>🌐 {t('language')}</Txt>
        </Bouncy>
      </View>
      <Pressable style={{ flex: 1 }} onPress={() => { play('good'); router.push('/profiles'); }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 16, gap: 18 }}>
          <Animated.View style={{ alignItems: 'center', transform: [{ scale: pop }, { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['-12deg', '-3deg'] }) }] }}>
            <Loop kind="swing" ms={3000}>
              <View style={styles.logo}>
                <Txt w="black" center style={styles.logoText}>{t('appName')}</Txt>
              </View>
            </Loop>
            <Txt w="bold" center style={{ fontSize: 18, color: '#0C4A6E', marginTop: 8 }}>{t('tagline')}</Txt>
          </Animated.View>
          <SceneView spec={TITLE_SCENE} hero={{ gender: 'boy', skin: 1, shirt: '#F97316', cape: '#DC2626' }} outcome="none" outcomeKey={0} />
          <Pop delay={700} style={{ alignItems: 'center' }}>
            <Loop kind="bob" ms={2400}>
              <View style={styles.credit}>
                <Txt w="bold" center style={{ fontSize: 15, color: '#0C4A6E' }}>🏫 {t('credit')} ✨</Txt>
              </View>
            </Loop>
          </Pop>
          <Animated.View style={{ opacity: pulse, alignItems: 'center' }}>
            <View style={styles.prompt}>
              <Txt w="black" center style={{ fontSize: 22, color: '#fff' }}>{t('tapPrompt')}</Txt>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 8 },
  lang: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  logo: { backgroundColor: C.primary, // white 48px bold = 5.18:1
    paddingHorizontal: 28, paddingVertical: 6, borderRadius: 28, borderBottomWidth: 8, borderBottomColor: C.primaryDark },
  logoText: { fontSize: 48, color: '#fff', lineHeight: 72, textShadowColor: '#7C2D12', textShadowRadius: 0, textShadowOffset: { width: 3, height: 3 } },
  credit: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 6, borderWidth: 2, borderColor: '#7DD3FC' },
  prompt: { backgroundColor: C.purple, borderRadius: 30, paddingHorizontal: 26, paddingVertical: 8 },
});
