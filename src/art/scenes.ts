import type { BgId } from './Backgrounds';
import { CharacterLook, Mood, SKINS } from './Character';
import type { PropId } from './Props';

export type CastId =
  | 'omar' | 'salma' | 'karim' | 'jana' | 'ziad' | 'hamza' | 'laila' | 'farida' | 'adam'
  | 'bully' | 'bully2' | 'kid1' | 'kid2' | 'teacher' | 'mom' | 'dad' | 'grandma' | 'oldman'
  | 'brother' | 'sister' | 'stranger' | 'guard';

export const CAST: Record<CastId, CharacterLook> = {
  omar: { skin: SKINS[1], hair: '#1F1300', hairStyle: 'short', shirt: '#3B82F6', pants: '#1E3A8A', glasses: true },
  salma: { skin: SKINS[0], hair: '#6B3E1E', hairStyle: 'long', shirt: '#F472B6', pants: '#9D174D', dress: true },
  karim: { skin: SKINS[2], hair: '#111', hairStyle: 'curly', shirt: '#22C55E', pants: '#374151' },
  jana: { skin: SKINS[1], hair: '#3B1F0E', hairStyle: 'curly', shirt: '#FACC15', pants: '#CA8A04', dress: true },
  ziad: { skin: SKINS[1], hair: '#2B1B0E', hairStyle: 'spiky', shirt: '#FB923C', pants: '#1F2937' },
  hamza: { skin: SKINS[2], hair: '#111', hairStyle: 'short', shirt: '#EF4444', pants: '#1E40AF' },
  laila: { skin: SKINS[1], hair: '#8B5CF6', hairStyle: 'hijab', shirt: '#C4B5FD', pants: '#6D28D9', dress: true },
  farida: { skin: SKINS[0], hair: '#111', hairStyle: 'long', shirt: '#14B8A6', pants: '#0F766E', dress: true },
  adam: { skin: SKINS[0], hair: '#92400E', hairStyle: 'short', shirt: '#FDE047', pants: '#1D4ED8' },
  bully: { skin: SKINS[2], hair: '#111', hairStyle: 'spiky', shirt: '#7F1D1D', pants: '#111827' },
  bully2: { skin: SKINS[1], hair: '#3F2A1D', hairStyle: 'short', shirt: '#6B7280', pants: '#1F2937' },
  kid1: { skin: SKINS[1], hair: '#111', hairStyle: 'short', shirt: '#06B6D4', pants: '#1F2937' },
  kid2: { skin: SKINS[0], hair: '#F97316', hairStyle: 'hijab', shirt: '#FDBA74', pants: '#9A3412', dress: true },
  teacher: { skin: SKINS[1], hair: '#1E3A8A', hairStyle: 'hijab', shirt: '#60A5FA', pants: '#1E3A8A', dress: true, age: 'adult', glasses: true },
  mom: { skin: SKINS[1], hair: '#BE185D', hairStyle: 'hijab', shirt: '#F9A8D4', pants: '#831843', dress: true, age: 'adult' },
  dad: { skin: SKINS[2], hair: '#111', hairStyle: 'short', shirt: '#2563EB', pants: '#374151', age: 'adult', mustache: true },
  grandma: { skin: SKINS[1], hair: '#E5E7EB', hairStyle: 'hijab', shirt: '#A16207', pants: '#713F12', dress: true, age: 'old' },
  oldman: { skin: SKINS[2], hair: '#D4D4D8', hairStyle: 'bald', shirt: '#D6D3D1', pants: '#57534E', age: 'old', mustache: true, glasses: true },
  brother: { skin: SKINS[1], hair: '#2B1B0E', hairStyle: 'short', shirt: '#A3E635', pants: '#365314', age: 'small' },
  sister: { skin: SKINS[1], hair: '#2B1B0E', hairStyle: 'long', shirt: '#F0ABFC', pants: '#86198F', dress: true, age: 'small' },
  stranger: { skin: SKINS[1], hair: '#111', hairStyle: 'short', shirt: '#334155', pants: '#0F172A', hood: true, age: 'adult' },
  guard: { skin: SKINS[2], hair: '#111', hairStyle: 'short', shirt: '#1E293B', pants: '#0F172A', age: 'adult', mustache: true },
};

export type Role = 'hero' | 'victim' | 'bully' | 'other';
export type CastSlot = { c: CastId | 'hero'; x: number; y?: number; s?: number; mood: Mood; role?: Role };
export type PropSlot = { p: PropId; x: number; y: number; s?: number };
export type SceneSpec = { bg: BgId; cast: CastSlot[]; props?: PropSlot[] };

const H = (x: number, mood: Mood = 'neutral', role: Role = 'hero'): CastSlot => ({ c: 'hero', x, mood, role });

export const SCENES: Record<string, SceneSpec> = {
  s1: { bg: 'yard', cast: [H(70), { c: 'omar', x: 200, mood: 'sad', role: 'victim' }, { c: 'bully', x: 285, mood: 'mean', role: 'bully' }, { c: 'bully2', x: 350, mood: 'mean', role: 'bully' }] },
  s2: { bg: 'yard', cast: [H(80), { c: 'salma', x: 250, mood: 'sad', role: 'victim' }, { c: 'kid1', x: 350, mood: 'happy', role: 'other' }], props: [{ p: 'sandwich', x: 290, y: 250, s: 0.8 }] },
  s3: { bg: 'yard', cast: [H(70), { c: 'karim', x: 175, mood: 'crying', role: 'victim' }, { c: 'bully', x: 265, mood: 'mean', role: 'bully' }, { c: 'teacher', x: 360, mood: 'neutral', role: 'other' }], props: [{ p: 'sandwich', x: 300, y: 205, s: 0.8 }] },
  s4: { bg: 'yard', cast: [H(70), { c: 'kid1', x: 170, mood: 'mean', role: 'bully' }, { c: 'kid2', x: 230, mood: 'mean', role: 'bully' }, { c: 'jana', x: 345, mood: 'sad', role: 'victim' }], props: [{ p: 'ball', x: 120, y: 252, s: 0.7 }] },
  s5: { bg: 'yard', cast: [H(110, 'angry'), { c: 'ziad', x: 240, mood: 'crying', role: 'victim' }] },
  s6: { bg: 'classroom', cast: [H(80), { c: 'hamza', x: 220, s: 1.1, mood: 'sad', role: 'victim' }, { c: 'bully', x: 325, mood: 'mean', role: 'bully' }] },
  s7: { bg: 'classroom', cast: [H(140, 'sad', 'victim'), { c: 'bully', x: 270, mood: 'mean', role: 'bully' }] },
  s8: { bg: 'classroom', cast: [H(70), { c: 'laila', x: 200, mood: 'shy', role: 'victim' }, { c: 'bully', x: 300, mood: 'mean', role: 'bully' }, { c: 'bully2', x: 360, mood: 'mean', role: 'bully' }], props: [{ p: 'book', x: 240, y: 200, s: 0.8 }] },
  s9: { bg: 'pitch', cast: [H(90), { c: 'hamza', x: 240, s: 1.1, mood: 'sad', role: 'victim' }, { c: 'kid1', x: 330, mood: 'neutral', role: 'other' }], props: [{ p: 'ball', x: 160, y: 252, s: 0.8 }] },
  s10: { bg: 'classroom', cast: [H(80), { c: 'farida', x: 210, mood: 'crying', role: 'victim' }, { c: 'bully', x: 340, mood: 'mean', role: 'bully' }], props: [{ p: 'pencils', x: 265, y: 250, s: 0.9 }] },
  s11: { bg: 'classroom', cast: [H(70), { c: 'bully2', x: 180, mood: 'mean', role: 'bully' }, { c: 'adam', x: 345, mood: 'neutral', role: 'victim' }], props: [{ p: 'bag', x: 270, y: 250, s: 0.9 }] },
  s12: { bg: 'classroom', cast: [H(90, 'happy'), { c: 'kid1', x: 270, mood: 'sad', role: 'victim' }], props: [{ p: 'paper', x: 160, y: 200, s: 0.8 }] },

  h1: { bg: 'living', cast: [H(80), { c: 'mom', x: 230, mood: 'sad', role: 'victim' }], props: [{ p: 'shopping', x: 290, y: 252, s: 1 }, { p: 'tablet', x: 130, y: 252, s: 0.7 }] },
  h2: { bg: 'living', cast: [H(80, 'angry'), { c: 'brother', x: 240, s: 0.8, mood: 'surprised', role: 'victim' }], props: [{ p: 'teddy', x: 165, y: 252, s: 0.8 }] },
  h3: { bg: 'living', cast: [H(140, 'surprised')], props: [{ p: 'vase', x: 230, y: 252, s: 0.9 }, { p: 'cat', x: 330, y: 252, s: 0.9 }] },
  h4: { bg: 'living', cast: [H(110), { c: 'grandma', x: 300, mood: 'happy', role: 'victim' }], props: [{ p: 'book', x: 220, y: 200, s: 0.8 }] },
  h5: { bg: 'living', cast: [H(110, 'sad'), { c: 'dad', x: 290, mood: 'neutral', role: 'victim' }], props: [{ p: 'tablet', x: 185, y: 220, s: 0.8 }] },
  h6: { bg: 'living', cast: [H(80), { c: 'sister', x: 240, s: 0.85, mood: 'crying', role: 'victim' }], props: [{ p: 'dice', x: 165, y: 252, s: 0.7 }] },

  o1: { bg: 'metro', cast: [H(110), { c: 'oldman', x: 230, mood: 'sad', role: 'victim' }, { c: 'kid2', x: 340, mood: 'neutral', role: 'other' }] },
  o2: { bg: 'street', cast: [H(120)], props: [{ p: 'juice', x: 175, y: 220, s: 0.7 }, { p: 'bin', x: 330, y: 252, s: 1 }] },
  o3: { bg: 'club', cast: [H(70), { c: 'kid1', x: 170, mood: 'neutral', role: 'victim' }, { c: 'kid2', x: 225, mood: 'neutral', role: 'victim' }, { c: 'adam', x: 280, mood: 'neutral', role: 'victim' }], props: [{ p: 'icecream', x: 345, y: 200, s: 0.8 }] },
  o4: { bg: 'pool', cast: [H(80), { c: 'karim', x: 230, y: 245, mood: 'crying', role: 'victim' }, { c: 'bully', x: 330, mood: 'mean', role: 'bully' }] },
  o5: { bg: 'mall', cast: [H(110, 'surprised'), { c: 'guard', x: 320, mood: 'neutral', role: 'other' }], props: [{ p: 'wallet', x: 210, y: 252, s: 0.8 }] },
  o6: { bg: 'street', cast: [H(80), { c: 'bully', x: 300, mood: 'mean', role: 'bully' }, { c: 'bully2', x: 360, mood: 'mean', role: 'bully' }], props: [{ p: 'cat', x: 190, y: 252, s: 1 }, { p: 'stone', x: 240, y: 252, s: 0.6 }] },

  n1: { bg: 'bedroom', cast: [H(100, 'surprised'), { c: 'stranger', x: 320, mood: 'mean', role: 'bully' }], props: [{ p: 'phone', x: 210, y: 200, s: 1.4 }] },
  n2: { bg: 'bedroom', cast: [H(90), { c: 'kid1', x: 320, mood: 'crying', role: 'victim' }], props: [{ p: 'phone', x: 205, y: 200, s: 1.4 }] },
  n3: { bg: 'bedroom', cast: [H(110, 'surprised')], props: [{ p: 'phone', x: 220, y: 210, s: 1.3 }, { p: 'gift', x: 300, y: 170, s: 1.1 }] },
  n4: { bg: 'bedroom', cast: [H(120, 'sad', 'victim'), { c: 'stranger', x: 330, mood: 'mean', role: 'bully' }], props: [{ p: 'chat', x: 230, y: 150, s: 1.2 }] },
  n5: { bg: 'bedroom', cast: [H(110), { c: 'stranger', x: 310, mood: 'mean', role: 'bully' }], props: [{ p: 'lock', x: 210, y: 180, s: 1 }] },
  n6: { bg: 'living', cast: [H(120), { c: 'dad', x: 320, mood: 'neutral', role: 'victim' }], props: [{ p: 'phone', x: 200, y: 220, s: 1 }, { p: 'coin', x: 240, y: 170, s: 0.7 }] },
};

/** Big picture icons for each answer (same order as the options in scenarios.ts). */
export const OPTION_ICONS: Record<string, string[]> = {
  s1: ['🛑', '😂', '🚶'], s2: ['👋', '🤫', '🙈'], s3: ['👩‍🏫', '😶', '🧃'], s4: ['🤝', '👍', '👉'],
  s5: ['🙏', '😤', '🏃'], s6: ['✋', '🗣️', '😂'], s7: ['✋', '👊', '😢'], s8: ['⏳', '😜', '😂'],
  s9: ['⚽', '👎', '🤷'], s10: ['✏️', '😂', '🤷'], s11: ['🙅', '🎒', '👀'], s12: ['📚', '😎', '👎'],
  h1: ['💪', '🎮', '🙅'], h2: ['🧸', '👊', '💥'], h3: ['🗣️', '🐱', '🛋️'], h4: ['👂', '🏃', '🥱'],
  h5: ['👌', '😫', '🙈'], h6: ['🤗', '😝', '🚶'],
  o1: ['🪑', '😴', '👜'], o2: ['🗑️', '⬇️', '🌊'], o3: ['🧍', '⏩', '🫸'], o4: ['👏', '💦', '😂'],
  o5: ['👮', '🤑', '🚶'], o6: ['🛑', '🪨', '👀'],
  n1: ['👨‍👩‍👧', '🏠', '📸'], n2: ['🗑️', '📤', '😂'], n3: ['🛑', '👆', '🔢'], n4: ['🚫', '🤬', '🤐'],
  n5: ['👨‍👩‍👧', '🤫', '🤝'], n6: ['🙋', '💳', '🔑'],
};

/** How each role reacts after a good or a wrong choice. */
export function reactMood(slot: CastSlot, outcome: 'none' | 'good' | 'wrong'): Mood {
  if (outcome === 'none') return slot.mood;
  const role = slot.role ?? 'other';
  if (outcome === 'good') return role === 'bully' ? 'shy' : 'happy';
  if (role === 'victim') return 'crying';
  if (role === 'bully') return 'mean';
  if (role === 'hero') return 'sad';
  return 'surprised';
}

/** Spoken names for screen readers (TalkBack). */
export const CAST_NAMES: Record<CastId | 'hero', { ar: string; en: string }> = {
  hero: { ar: 'البطل', en: 'Hero' },
  omar: { ar: 'عمر', en: 'Omar' }, salma: { ar: 'سلمى', en: 'Salma' }, karim: { ar: 'كريم', en: 'Karim' },
  jana: { ar: 'جنى', en: 'Jana' }, ziad: { ar: 'زياد', en: 'Ziad' }, hamza: { ar: 'حمزة', en: 'Hamza' },
  laila: { ar: 'ليلى', en: 'Laila' }, farida: { ar: 'فريدة', en: 'Farida' }, adam: { ar: 'آدم', en: 'Adam' },
  bully: { ar: 'ولد', en: 'A boy' }, bully2: { ar: 'ولد', en: 'A boy' }, kid1: { ar: 'صاحب', en: 'A friend' },
  kid2: { ar: 'صاحبة', en: 'A friend' }, teacher: { ar: 'المُدرّسة', en: 'Teacher' }, mom: { ar: 'ماما', en: 'Mum' },
  dad: { ar: 'بابا', en: 'Dad' }, grandma: { ar: 'تيتة', en: 'Grandma' }, oldman: { ar: 'راجل كبير', en: 'Old man' },
  brother: { ar: 'الأخ الصغير', en: 'Little brother' }, sister: { ar: 'الأخت', en: 'Sister' },
  stranger: { ar: 'شخص غريب', en: 'A stranger' }, guard: { ar: 'الأمن', en: 'Security guard' },
};
