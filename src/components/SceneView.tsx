import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Background from '../art/Backgrounds';
import Character from '../art/Character';
import Prop from '../art/Props';
import { CAST, CAST_NAMES, CastSlot, reactMood, SceneSpec } from '../art/scenes';
import { useApp } from '../store';
import { heroToLook } from '../game/hero';
import { HeroLook } from '../game/rules';
import { play } from '../sound';

export type Outcome = 'none' | 'good' | 'wrong';

type Props = { spec: SceneSpec; hero: HeroLook; outcome: Outcome; outcomeKey: number };

const W0 = 400;
const H0 = 260;

/** The illustrated, animated picture for a situation. Characters react to the child's choice. */
export default function SceneView({ spec, hero, outcome, outcomeKey }: Props) {
  const [w, setW] = useState(0);
  const k = w / W0;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (outcome !== 'wrong') return;
    Animated.sequence([10, -10, 8, -8, 4, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 55, useNativeDriver: true }))).start();
  }, [outcome, outcomeKey, shake]);

  const cast = useMemo(() => [...spec.cast].sort((a, b) => (a.y ?? 250) - (b.y ?? 250)), [spec]);

  return (
    <Animated.View
      style={[styles.frame, { transform: [{ translateX: shake }] }]}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      <View style={StyleSheet.absoluteFill}><Background id={spec.bg} /></View>
      {w > 0 && (
        <>
          {spec.props?.map((p, i) => {
            const size = 60 * (p.s ?? 1) * k;
            return (
              <View key={'p' + i} pointerEvents="none" style={{ position: 'absolute', left: p.x * k - size / 2, top: p.y * k - size }}>
                <Prop id={p.p} size={size} />
              </View>
            );
          })}
          {cast.map((slot, i) => (
            <Actor key={i + slot.c} slot={slot} hero={hero} k={k} outcome={outcome} outcomeKey={outcomeKey} delay={i * 180} />
          ))}
          {outcome === 'good' && <Confetti key={outcomeKey} width={w} height={(w * H0) / W0} />}
        </>
      )}
    </Animated.View>
  );
}

function Actor({ slot, hero, k, outcome, outcomeKey, delay }: { slot: CastSlot; hero: HeroLook; k: number; outcome: Outcome; outcomeKey: number; delay: number }) {
  const { lang } = useApp();
  const look = slot.c === 'hero' ? heroToLook(hero) : CAST[slot.c];
  const scale = (slot.s ?? 1) * (look.age === 'adult' || look.age === 'old' ? 1.12 : look.age === 'small' ? 0.8 : 1);
  const width = 70 * scale * k;
  const height = width * 1.5;
  const baseY = (slot.y ?? 250) * k;
  const bob = useRef(new Animated.Value(0)).current;
  const jump = useRef(new Animated.Value(0)).current;
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(bob, { toValue: -3 * k, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [bob, k, delay]);

  const hop = (h: number, times = 1) => {
    const one = [
      Animated.timing(jump, { toValue: -h, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(jump, { toValue: 0, duration: 220, easing: Easing.bounce, useNativeDriver: true }),
    ];
    Animated.sequence(Array.from({ length: times }).flatMap(() => one)).start();
  };

  useEffect(() => {
    if (outcome === 'good' && slot.role !== 'bully') setTimeout(() => hop(22 * k, 2), delay / 2);
  }, [outcome, outcomeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const mood = tapped && outcome === 'none' ? 'surprised' : reactMood(slot, outcome);
  const arms = outcome === 'good' && (slot.role === 'hero' || slot.role === 'victim') ? 'up' : slot.c === 'hero' && outcome === 'none' ? 'wave' : 'down';

  return (
    <Animated.View style={{ position: 'absolute', left: slot.x * k - width / 2, top: baseY - height, transform: [{ translateY: Animated.add(bob, jump) }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={CAST_NAMES[slot.c][lang]}
        onPress={() => {
          play('tap');
          hop(16 * k);
          setTapped(true);
          setTimeout(() => setTapped(false), 700);
        }}
      >
        <Character look={look} mood={mood} arms={arms} size={width} />
      </Pressable>
    </Animated.View>
  );
}

const COLORS = ['#F43F5E', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7', '#FACC15'];
function Confetti({ width, height }: { width: number; height: number }) {
  const pieces = useMemo(
    () => Array.from({ length: 28 }).map((_, i) => ({
      x: Math.random() * width,
      rot: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 300,
      size: 6 + Math.random() * 6,
      v: new Animated.Value(0),
    })),
    [width],
  );
  useEffect(() => {
    Animated.parallel(pieces.map((p) => Animated.timing(p.v, { toValue: 1, duration: 1400, delay: p.delay, easing: Easing.in(Easing.quad), useNativeDriver: true }))).start();
  }, [pieces]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: -12,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            borderRadius: 2,
            opacity: p.v.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: p.v.interpolate({ inputRange: [0, 1], outputRange: [0, height + 20] }) },
              { rotate: p.v.interpolate({ inputRange: [0, 1], outputRange: [`${p.rot}deg`, `${p.rot + 540}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: W0 / H0, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E0F2FE', borderWidth: 4, borderColor: '#fff' },
});
