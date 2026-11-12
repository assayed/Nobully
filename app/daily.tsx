import { Redirect, router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import Play from '../src/components/Play';
import { dailyScenarioId, dayKey } from '../src/game/rules';
import { useApp } from '../src/store';
import { BigButton, HeroAvatar, Screen, TopBar, Txt } from '../src/ui';

export default function Daily() {
  const { active, t } = useApp();
  const doneAtOpen = useMemo(() => active?.daily.last === dayKey(), []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!active) return <Redirect href="/profiles" />;
  if (doneAtOpen) {
    return (
      <Screen>
        <TopBar title={t('daily')} coins={active.coins} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
          <HeroAvatar look={active.look} size={130} />
          <Txt w="black" center style={{ fontSize: 24 }}>✅ {t('dailyDone')}</Txt>
          <BigButton label={t('backHome')} icon="🏠" onPress={() => router.replace('/home')} style={{ alignSelf: 'stretch' }} />
        </View>
      </Screen>
    );
  }
  return <Play ids={[dailyScenarioId()]} mode="daily" title={`📅 ${t('daily')}`} color="#7C3AED" />;
}
