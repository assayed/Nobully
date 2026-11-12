import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Character from '../src/art/Character';
import Prop from '../src/art/Props';
import { DEFAULT_SHIRT, heroToLook } from '../src/game/hero';
import { checkBadges, HeroLook, isEquipped, SHOP, ShopItem, toggleEquip } from '../src/game/rules';
import { buzz, play } from '../src/sound';
import { useApp } from '../src/store';
import { C, shadow } from '../src/theme';
import { Bouncy, HeroAvatar, Screen, TopBar, Txt } from '../src/ui';

function preview(look: HeroLook, item: ShopItem): HeroLook {
  const base: HeroLook = { gender: look.gender, skin: look.skin, shirt: DEFAULT_SHIRT[look.gender] };
  return toggleEquip(base, item, base.shirt);
}

export default function Shop() {
  const { active, t, n, lang, upsertProfile } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  if (!active) return <Redirect href="/profiles" />;

  const tap = (item: ShopItem) => {
    const owned = active.owned.includes(item.id);
    if (!owned) {
      if (active.coins < item.price) { play('wrong'); buzz('wrong'); setMsg(t('notEnough')); return; }
      const next = { ...active, coins: active.coins - item.price, owned: [...active.owned, item.id], look: toggleEquip(active.look, item, DEFAULT_SHIRT[active.look.gender]) };
      next.badges = [...next.badges, ...checkBadges(next)];
      upsertProfile(next);
      play('coin'); setTimeout(() => play('good'), 200); buzz('good');
      setMsg(null);
      return;
    }
    upsertProfile({ ...active, look: toggleEquip(active.look, item, DEFAULT_SHIRT[active.look.gender]) });
  };

  return (
    <Screen bg="#FDF2F8">
      <TopBar title={`🛍️ ${t('shop')}`} coins={active.coins} />
      <View style={{ alignItems: 'center', paddingVertical: 6 }}>
        <HeroAvatar look={active.look} size={120} />
        {msg && <Txt w="bold" center style={{ color: C.bad }}>{msg} 💰</Txt>}
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {SHOP.map((item) => {
          const owned = active.owned.includes(item.id);
          const on = owned && isEquipped(active.look, item);
          const afford = active.coins >= item.price;
          return (
            <Bouncy speak key={item.id} label={`${item[lang]}, ${owned ? (on ? t('remove') : t('wear')) : item.price}`} onPress={() => tap(item)} style={[styles.item, on && styles.on]}>
              <View style={styles.art}>
                {item.kind === 'pet'
                  ? <Prop id={item.value as never} size={64} />
                  : <Character look={heroToLook(preview(active.look, item))} mood="happy" size={52} />}
              </View>
              <Txt w="bold" center style={{ fontSize: 13, lineHeight: 18, minHeight: 36 }} numberOfLines={2}>{item[lang]}</Txt>
              {owned ? (
                <View style={[styles.tag, { backgroundColor: on ? C.good : '#0EA5E9' }]}>
                  <Txt w="black" center style={{ color: '#fff', fontSize: 13 }}>{on ? `✓ ${t('remove')}` : t('wear')}</Txt>
                </View>
              ) : (
                <View style={[styles.tag, { backgroundColor: afford ? '#FEF3C7' : '#F5F5F4', flexDirection: 'row', gap: 4, justifyContent: 'center' }]}>
                  <Prop id="coin" size={16} />
                  <Txt w="black" style={{ fontSize: 13, color: afford ? '#713F12' : C.priceLocked }}>{n(item.price)}</Txt>
                </View>
              )}
              {!owned && !afford && (
                <Txt center style={{ fontSize: 11, lineHeight: 16, color: C.priceLocked }}>{t('needMore').replace('{n}', n(item.price - active.coins))}</Txt>
              )}
            </Bouncy>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 14, justifyContent: 'center', paddingBottom: 40 },
  item: { width: 104, backgroundColor: '#fff', borderRadius: 20, padding: 8, gap: 4, alignItems: 'center', borderWidth: 3, borderColor: '#FBCFE8', ...shadow },
  on: { borderColor: C.good, backgroundColor: C.goodSoft },
  art: { height: 84, justifyContent: 'center', alignItems: 'center' },
  tag: { alignSelf: 'stretch', borderRadius: 12, paddingVertical: 2, alignItems: 'center' },
});
