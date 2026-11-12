import { router } from 'expo-router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Character from './art/Character';
import Prop from './art/Props';
import { heroToLook } from './game/hero';
import { HeroLook } from './game/rules';
import { buzz, play, say } from './sound';
import { useApp } from './store';
import { C, F, shadow } from './theme';

/** Text in the Cairo font, aligned for the current language. */
export function Txt({ style, w = 'regular', center, ...rest }: TextProps & { w?: 'regular' | 'bold' | 'black'; center?: boolean }) {
  const { rtl } = useApp();
  return (
    <Text
      {...rest}
      style={[{ fontFamily: F[w], color: C.ink, fontSize: 16, textAlign: center ? 'center' : rtl ? 'right' : 'left', writingDirection: rtl ? 'rtl' : 'ltr' }, style]}
    />
  );
}

export function Screen({ children, bg = C.bg, style }: { children: ReactNode; bg?: string; style?: StyleProp<ViewStyle> }) {
  const { rtl } = useApp();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top', 'bottom']}>
      {/* phones use the full width; tablets get a centred column so cards and drawings keep their size */}
      <View style={[{ flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center', direction: rtl ? 'rtl' : 'ltr' }, style]}>{children}</View>
    </SafeAreaView>
  );
}

const APressable = Animated.createAnimatedComponent(Pressable);

/** A pressable that squishes and springs back, with a tap sound. */
export function Bouncy({ onPress, children, style, disabled, silent, label, speak }: { onPress?: () => void; children: ReactNode; style?: StyleProp<ViewStyle>; disabled?: boolean; silent?: boolean; label?: string; speak?: boolean }) {
  const s = useRef(new Animated.Value(1)).current;
  const { readAloud, lang } = useApp();
  return (
    <APressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={() => Animated.spring(s, { toValue: 0.93, useNativeDriver: true, speed: 50 }).start()}
      onPressOut={() => Animated.spring(s, { toValue: 1, useNativeDriver: true, friction: 3 }).start()}
      onPress={() => { if (!silent) { play('tap'); buzz('tap'); } if (speak && readAloud && label) say(label, lang); onPress?.(); }}
      style={[style, { transform: [{ scale: s }] }]}
    >
      {children}
    </APressable>
  );
}

export function BigButton({ label, onPress, color = C.primary, icon, disabled, style }: { label: string; onPress: () => void; color?: string; icon?: string; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Bouncy label={label} speak onPress={onPress} disabled={disabled} style={[styles.big, { backgroundColor: disabled ? '#D4D4D8' : color, borderBottomColor: 'rgba(0,0,0,0.2)' }, style]}>
      {icon ? <Txt style={{ fontSize: 22 }}>{icon}</Txt> : null}
      <Txt w="black" center style={{ color: '#fff', fontSize: 20 }}>{label}</Txt>
    </Bouncy>
  );
}

/** Coin counter that pops and counts up/down when the value changes (numbers never snap). */
export function CoinPill({ value, big }: { value: number; big?: boolean }) {
  const { n } = useApp();
  const s = useRef(new Animated.Value(1)).current;
  const prev = useRef(value);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (prev.current === value) return;
    const from = prev.current;
    prev.current = value;
    Animated.sequence([
      Animated.timing(s, { toValue: 1.35, duration: 140, useNativeDriver: true }),
      Animated.spring(s, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 500);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (value - from) * e));
      if (p >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [value, s]);
  return (
    <Animated.View style={[styles.coin, big && { paddingHorizontal: 16, paddingVertical: 6 }, { transform: [{ scale: s }] }]}>
      <Prop id="coin" size={big ? 30 : 24} />
      <Txt w="black" style={{ fontSize: big ? 22 : 18, color: '#713F12' }}>{n(shown)}</Txt>
    </Animated.View>
  );
}

export function TopBar({ title, coins, onBack }: { title?: string; coins?: number; onBack?: () => void }) {
  const { rtl, t } = useApp();
  return (
    <View style={styles.top}>
      <Bouncy label={t('back')} onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))} style={styles.back}>
        <Txt w="black" center style={{ fontSize: 22, lineHeight: 28 }}>{rtl ? '→' : '←'}</Txt>
      </Bouncy>
      <Txt w="black" accessibilityRole="header" style={{ flex: 1, fontSize: 20, marginHorizontal: 10 }} numberOfLines={1}>{title}</Txt>
      {coins !== undefined && <CoinPill value={coins} />}
    </View>
  );
}

/** The child's hero, drawn, with a gentle idle bounce and an optional pet. */
export function HeroAvatar({ look, size = 90, mood = 'happy', still }: { look: HeroLook; size?: number; mood?: 'happy' | 'neutral'; still?: boolean }) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(y, { toValue: -4, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [y, still]);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <Character look={heroToLook(look)} mood={mood} arms={mood === 'happy' ? 'wave' : 'down'} size={size} />
      </Animated.View>
      {look.pet && <View style={{ marginStart: -size * 0.15 }}><Prop id={look.pet} size={size * 0.55} /></View>}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Progress bar whose fill tweens (OutCubic) instead of snapping. */
export function Bar({ value, color = C.good, bg = '#E5E7EB', height = 10 }: { value: number; color?: string; bg?: string; height?: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: Math.max(0, Math.min(1, value)), duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [value, v]);
  return (
    <View style={{ height, backgroundColor: bg, borderRadius: height, overflow: 'hidden' }}>
      <Animated.View style={{ width: v.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }), height: '100%', backgroundColor: color, borderRadius: height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  big: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 22, borderRadius: 22, borderBottomWidth: 5, ...shadow },
  coin: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', borderRadius: 30, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 2, borderColor: C.coin },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  back: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  card: { backgroundColor: C.card, borderRadius: 24, padding: 16, ...shadow },
});

/** Springs its children in (fade + rise + grow) after `delay` ms. Change `k` to replay. */
export function Pop({ children, delay = 0, style, k }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle>; k?: string | number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    v.setValue(0);
    Animated.sequence([Animated.delay(delay), Animated.spring(v, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true })]).start();
  }, [k, delay, v]);
  return (
    <Animated.View style={[style, { opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }), transform: [
      { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
    ] }]}>{children}</Animated.View>
  );
}

/** A gentle endless motion: 'bob' up and down, 'pulse' grow and shrink, 'swing' rock side to side, 'spin'. */
export function Loop({ children, kind = 'bob', ms = 1400, style }: { children: ReactNode; kind?: 'bob' | 'pulse' | 'swing' | 'spin'; ms?: number; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = kind === 'spin'
      ? Animated.loop(Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.linear, useNativeDriver: true }))
      : Animated.loop(Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: ms / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: ms / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]));
    a.start();
    return () => a.stop();
  }, [kind, ms, v]);
  const t = kind === 'bob' ? [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }]
    : kind === 'pulse' ? [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }]
    : kind === 'swing' ? [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] }) }]
    : [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }];
  return <Animated.View style={[style, { transform: t }]}>{children}</Animated.View>;
}
