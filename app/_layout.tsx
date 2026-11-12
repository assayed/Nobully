import { Cairo_400Regular } from '@expo-google-fonts/cairo/400Regular';
import { Cairo_700Bold } from '@expo-google-fonts/cairo/700Bold';
import { Cairo_900Black } from '@expo-google-fonts/cairo/900Black';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setMusic, setSoundsEnabled } from '../src/sound';
import { AppProvider, useApp } from '../src/store';
import { C } from '../src/theme';

// The app lays out Arabic/English itself, so the phone's own RTL setting must not flip it twice.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const { ready, sounds, music } = useApp();
  useEffect(() => { setSoundsEnabled(sounds); }, [sounds]);
  useEffect(() => { if (ready) setMusic(music); }, [ready, music]);
  useEffect(() => { if (ready) SplashScreen.hideAsync().catch(() => {}); }, [ready]);
  if (!ready) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: C.bg } }} />
    </>
  );
}

export default function RootLayout() {
  const [fonts] = useFonts({ Cairo_400Regular, Cairo_700Bold, Cairo_900Black });
  if (!fonts) return null;
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </SafeAreaProvider>
  );
}
