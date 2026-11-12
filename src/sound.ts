import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import type { Lang } from './i18n';

const SOURCES = {
  coin: require('../assets/sounds/coin.wav'),
  good: require('../assets/sounds/good.wav'),
  wrong: require('../assets/sounds/wrong.wav'),
  tap: require('../assets/sounds/tap.wav'),
  win: require('../assets/sounds/win.wav'),
};
export type Sfx = keyof typeof SOURCES;

const players: Partial<Record<Sfx, AudioPlayer>> = {};
let musicPlayer: AudioPlayer | null = null;

/** Background music bed: soft, looping, low volume. */
export function setMusic(on: boolean) {
  try {
    if (on) {
      musicPlayer ??= createAudioPlayer(require('../assets/sounds/music.wav'));
      musicPlayer.loop = true;
      musicPlayer.volume = 0.18;
      musicPlayer.play();
    } else musicPlayer?.pause();
  } catch {}
}
let enabled = true;
export const setSoundsEnabled = (on: boolean) => { enabled = on; };

export function play(name: Sfx) {
  if (!enabled) return;
  try {
    const p = (players[name] ??= createAudioPlayer(SOURCES[name]));
    p.seekTo(0);
    // vary the pitch a little so repeats don't grate
    if (name === 'coin' || name === 'tap') p.playbackRate = 0.92 + Math.random() * 0.16;
    p.play();
  } catch {
    // sound is a nice-to-have; never crash the game
  }
}

export function buzz(kind: 'good' | 'wrong' | 'tap') {
  if (Platform.OS === 'web') return;
  try {
    if (kind === 'good') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (kind === 'wrong') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {}
}

/** Emoji and symbols are read out as their names ("globe", "party popper"): drop them. */
const clean = (t: string) => t.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}\u{2066}-\u{2069}]/gu, '').replace(/\s+/g, ' ').trim();
const voice = (lang: Lang) => ({ language: lang === 'ar' ? 'ar-EG' : 'en-US', rate: 0.85, pitch: 1.1 });
let seq = 0;

export function say(text: string, lang: Lang) {
  seq++;
  const t = clean(text);
  if (!t) return;
  try {
    Speech.stop();
    Speech.speak(t, voice(lang));
  } catch {}
}

/** Reads several lines one after another; onLine(i) fires as line i starts, onLine(-1) at the end. */
export function sayLines(lines: string[], lang: Lang, onLine?: (i: number) => void) {
  const my = ++seq;
  try { Speech.stop(); } catch {}
  const step = (i: number) => {
    if (my !== seq) return;
    if (i >= lines.length) { onLine?.(-1); return; }
    onLine?.(i);
    try {
      Speech.speak(clean(lines[i]), { ...voice(lang), onDone: () => step(i + 1), onStopped: () => { if (my === seq) onLine?.(-1); }, onError: () => step(i + 1) });
    } catch { onLine?.(-1); }
  };
  step(0);
}
export const hush = () => { seq++; try { Speech.stop(); } catch {} };
