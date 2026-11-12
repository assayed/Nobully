import { SCENARIOS, WorldId, scenariosOf } from '../content/scenarios';

/** Coin rules agreed with the product owner. Change them here only. */
export const RULES = {
  START_COINS: 100, // the baseline every new hero starts with
  GOOD_FIRST_TRY: 20, // good choice on the first try
  WRONG: -30, // every wrong choice
  GOOD_ON_RETRY: 15, // good choice after a wrong one (so a mistake costs a net -15)
  DAILY_BONUS: 10, // extra for the daily challenge on the first try
  MIN_COINS: 0, // the balance never goes below this
};

export type Answer = { done: boolean; firstTry: boolean; wrong: number };
export type Mistake = { scenarioId: string; option: number; at: number };

export type Profile = {
  id: string;
  name: string;
  look: HeroLook;
  coins: number;
  earned: number; // lifetime coins won (drives the level)
  answers: Record<string, Answer>;
  streak: number; // good first tries in a row
  bestStreak: number;
  owned: string[];
  badges: string[];
  daily: { last: string; streak: number };
  mistakes: Mistake[];
  createdAt: number;
};

export type HeroLook = {
  gender: 'boy' | 'girl' | 'hijab';
  skin: number;
  shirt: string;
  hat?: 'cap' | 'crown' | 'grad';
  cape?: string;
  mask?: boolean;
  star?: boolean;
  pet?: 'cat' | 'dog' | 'rabbit' | 'parrot' | 'camel';
};

export const LEVELS = [
  { min: 0, ar: 'صديق لطيف', en: 'Kind Friend', icon: '🌱' },
  { min: 150, ar: 'مساعد شجاع', en: 'Brave Helper', icon: '🌟' },
  { min: 400, ar: 'بطل صغير', en: 'Little Hero', icon: '🛡️' },
  { min: 800, ar: 'هيرو كيد', en: 'HeroKid', icon: '🦸' },
];
export const levelOf = (earned: number) => {
  let i = 0;
  LEVELS.forEach((l, idx) => { if (earned >= l.min) i = idx; });
  const next = LEVELS[i + 1];
  return { index: i, ...LEVELS[i], next, progress: next ? (earned - LEVELS[i].min) / (next.min - LEVELS[i].min) : 1 };
};

export const BADGES = [
  { id: 'first', icon: '🥇', ar: 'أول اختيار صح', en: 'First good choice' },
  { id: 'streak5', icon: '🔥', ar: '٥ صح ورا بعض', en: '5 in a row' },
  { id: 'world_school', icon: '🏫', ar: 'بطل المدرسة', en: 'School Hero' },
  { id: 'world_home', icon: '🏠', ar: 'بطل البيت', en: 'Home Hero' },
  { id: 'world_outside', icon: '🌳', ar: 'بطل الشارع', en: 'Street Hero' },
  { id: 'world_online', icon: '📱', ar: 'بطل النت', en: 'Online Hero' },
  { id: 'rich', icon: '💰', ar: '٣٠٠ عملة', en: '300 coins' },
  { id: 'shopper', icon: '🛍️', ar: 'أول شروة', en: 'First buy' },
  { id: 'daily3', icon: '📅', ar: '٣ أيام تحدي', en: '3-day challenge' },
];

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export function dailyScenarioId(d = new Date()) {
  const k = dayKey(d);
  let h = 0;
  for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return SCENARIOS[h % SCENARIOS.length].id;
}

export function newProfile(name: string, look: HeroLook): Profile {
  return {
    id: Math.random().toString(36).slice(2, 10),
    name,
    look,
    coins: RULES.START_COINS,
    earned: 0,
    answers: {},
    streak: 0,
    bestStreak: 0,
    owned: [],
    badges: [],
    daily: { last: '', streak: 0 },
    mistakes: [],
    createdAt: Date.now(),
  };
}

const clamp = (n: number) => Math.max(RULES.MIN_COINS, n);

export type AnswerInput = {
  scenarioId: string;
  option: number;
  good: boolean;
  hadWrong: boolean; // a wrong choice was already made on this situation this round
  practice: boolean; // replaying a finished situation: no coins
  daily: boolean;
};

/** Applies one tap on an answer. Returns the updated profile, the coin change, and any new badges. */
export function applyAnswer(p: Profile, a: AnswerInput): { profile: Profile; delta: number; newBadges: string[] } {
  if (a.practice) return { profile: p, delta: 0, newBadges: [] };
  const prev = p.answers[a.scenarioId] ?? { done: false, firstTry: false, wrong: 0 };
  let delta: number;
  const next: Profile = { ...p, answers: { ...p.answers } };

  if (a.good) {
    delta = a.hadWrong ? RULES.GOOD_ON_RETRY : RULES.GOOD_FIRST_TRY;
    if (a.daily && !a.hadWrong) delta += RULES.DAILY_BONUS;
    next.answers[a.scenarioId] = { done: true, firstTry: prev.done ? prev.firstTry : !a.hadWrong, wrong: prev.wrong };
    next.streak = a.hadWrong ? 0 : p.streak + 1;
    next.bestStreak = Math.max(p.bestStreak, next.streak);
    next.earned = p.earned + delta;
    if (a.daily) {
      const today = dayKey();
      const yesterday = dayKey(new Date(Date.now() - 864e5));
      next.daily = { last: today, streak: p.daily.last === yesterday ? p.daily.streak + 1 : 1 };
    }
  } else {
    delta = RULES.WRONG;
    next.answers[a.scenarioId] = { ...prev, wrong: prev.wrong + 1 };
    next.streak = 0;
    next.mistakes = [{ scenarioId: a.scenarioId, option: a.option, at: Date.now() }, ...p.mistakes].slice(0, 50);
  }
  const before = p.coins;
  next.coins = clamp(p.coins + delta);
  const realDelta = next.coins - before;
  const newBadges = checkBadges(next);
  next.badges = [...next.badges, ...newBadges];
  return { profile: next, delta: a.good ? delta : realDelta, newBadges };
}

export function checkBadges(p: Profile): string[] {
  const has = (id: string) => p.badges.includes(id);
  const out: string[] = [];
  const doneCount = Object.values(p.answers).filter((x) => x.done).length;
  if (!has('first') && doneCount >= 1) out.push('first');
  if (!has('streak5') && p.bestStreak >= 5) out.push('streak5');
  (['school', 'home', 'outside', 'online'] as WorldId[]).forEach((w) => {
    if (!has('world_' + w) && scenariosOf(w).every((s) => p.answers[s.id]?.done)) out.push('world_' + w);
  });
  if (!has('rich') && p.coins >= 300) out.push('rich');
  if (!has('shopper') && p.owned.length > 0) out.push('shopper');
  if (!has('daily3') && p.daily.streak >= 3) out.push('daily3');
  return out;
}

export type ShopItem = {
  id: string;
  kind: 'hat' | 'cape' | 'mask' | 'star' | 'pet' | 'shirt';
  value: string;
  price: number;
  ar: string;
  en: string;
};

export const SHOP: ShopItem[] = [
  { id: 'cape_red', kind: 'cape', value: '#DC2626', price: 120, ar: 'عباية أبطال حمرا', en: 'Red hero cape' },
  { id: 'cape_blue', kind: 'cape', value: '#2563EB', price: 120, ar: 'عباية أبطال زرقا', en: 'Blue hero cape' },
  { id: 'mask', kind: 'mask', value: '1', price: 80, ar: 'قناع البطل', en: 'Hero mask' },
  { id: 'star', kind: 'star', value: '1', price: 60, ar: 'نجمة على القميص', en: 'Shirt star' },
  { id: 'cap', kind: 'hat', value: 'cap', price: 50, ar: 'كاب', en: 'Cap' },
  { id: 'grad', kind: 'hat', value: 'grad', price: 150, ar: 'قبعة التخرج', en: 'Graduation hat' },
  { id: 'crown', kind: 'hat', value: 'crown', price: 250, ar: 'تاج', en: 'Crown' },
  { id: 'shirt_green', kind: 'shirt', value: '#16A34A', price: 30, ar: 'تيشيرت أخضر', en: 'Green shirt' },
  { id: 'shirt_purple', kind: 'shirt', value: '#9333EA', price: 30, ar: 'تيشيرت بنفسجي', en: 'Purple shirt' },
  { id: 'shirt_gold', kind: 'shirt', value: '#EAB308', price: 90, ar: 'تيشيرت دهبي', en: 'Gold shirt' },
  { id: 'pet_cat', kind: 'pet', value: 'cat', price: 100, ar: 'قطة', en: 'Cat' },
  { id: 'pet_dog', kind: 'pet', value: 'dog', price: 100, ar: 'كلب', en: 'Dog' },
  { id: 'pet_rabbit', kind: 'pet', value: 'rabbit', price: 120, ar: 'أرنب', en: 'Rabbit' },
  { id: 'pet_parrot', kind: 'pet', value: 'parrot', price: 150, ar: 'ببغاء', en: 'Parrot' },
  { id: 'pet_camel', kind: 'pet', value: 'camel', price: 220, ar: 'جمل', en: 'Camel' },
];

export function isEquipped(look: HeroLook, item: ShopItem) {
  switch (item.kind) {
    case 'hat': return look.hat === item.value;
    case 'cape': return look.cape === item.value;
    case 'mask': return !!look.mask;
    case 'star': return !!look.star;
    case 'pet': return look.pet === item.value;
    case 'shirt': return look.shirt === item.value;
  }
}

export function toggleEquip(look: HeroLook, item: ShopItem, defaultShirt: string): HeroLook {
  const on = isEquipped(look, item);
  const l = { ...look };
  switch (item.kind) {
    case 'hat': l.hat = on ? undefined : (item.value as HeroLook['hat']); break;
    case 'cape': l.cape = on ? undefined : item.value; break;
    case 'mask': l.mask = !on; break;
    case 'star': l.star = !on; break;
    case 'pet': l.pet = on ? undefined : (item.value as HeroLook['pet']); break;
    case 'shirt': l.shirt = on ? defaultShirt : item.value; break;
  }
  return l;
}
