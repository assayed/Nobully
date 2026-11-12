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
let voices: Speech.Voice[] = [];
Speech.getAvailableVoicesAsync().then((v) => { voices = v; }).catch(() => {});
/** Prefer an Egyptian / US voice, else any voice of the language, else let the phone choose. */
const voice = (lang: Lang): Speech.SpeechOptions => {
  const want = lang === 'ar' ? ['ar-EG', 'ar'] : ['en-US', 'en'];
  const norm = (x: string) => x.replace('_', '-').toLowerCase();
  const v = voices.find((x) => norm(x.language) === want[0].toLowerCase())
    ?? voices.find((x) => norm(x.language).startsWith(want[1]));
  return { language: v?.language ?? want[1], voice: v?.identifier, rate: 0.85, pitch: 1.1 };
};
let seq = 0;

/** Android drops a new utterance sent right after stop(), so wait for stop to finish first. */
async function speakAfterStop(text: string, opts: Speech.SpeechOptions, my: number) {
  try { await Speech.stop(); } catch {}
  if (Platform.OS === 'android') await new Promise((r) => setTimeout(r, 120));
  if (my !== seq) return;
  try { Speech.speak(text, opts); } catch { opts.onError?.(new Error('speak failed')); }
}

export function say(text: string, lang: Lang) {
  const my = ++seq;
  const t = clean(text);
  if (t) speakAfterStop(t, voice(lang), my);
}

/** Reads several lines one after another; onLine(i) fires as line i starts, onLine(-1) at the end. */
export function sayLines(lines: string[], lang: Lang, onLine?: (i: number) => void) {
  const my = ++seq;
  const step = (i: number, first: boolean) => {
    if (my !== seq) return;
    if (i >= lines.length) { onLine?.(-1); return; }
    onLine?.(i);
    const opts: Speech.SpeechOptions = { ...voice(lang), onDone: () => step(i + 1, false), onStopped: () => { if (my === seq) onLine?.(-1); }, onError: () => step(i + 1, false) };
    if (first) speakAfterStop(clean(lines[i]), opts, my);
    else try { Speech.speak(clean(lines[i]), opts); } catch { onLine?.(-1); }
  };
  step(0, true);
}
export const hush = () => { seq++; try { Speech.stop(); } catch {} };
