export type Lang = 'ar' | 'en';

type Entry = { ar: string; en: string; arF?: string };

const S = {
  appName: { ar: 'هيرو كيد', en: 'HeroKid' },
  tagline: { ar: 'الاختيار الصح بيعمل أبطال!', en: 'Good choices make heroes!' },
  whoPlays: { ar: 'مين هيلعب النهارده؟', en: 'Who is playing today?' },
  newHero: { ar: 'بطل جديد', en: 'New hero' },
  createHero: { ar: 'يلا نعمل البطل', en: 'Create your hero' },
  yourName: { ar: 'اسمك إيه؟', en: 'What is your name?' },
  namePlaceholder: { ar: 'الاسم هنا', en: 'Type your name' },
  pickLook: { ar: 'شكل البطل', en: 'Choose your look' },
  boy: { ar: 'ولد', en: 'Boy' },
  girl: { ar: 'بنت', en: 'Girl' },
  hijab: { ar: 'بنت بطرحة', en: 'Girl with hijab' },
  skin: { ar: 'لون البشرة', en: 'Skin colour' },
  start: { ar: 'يلا نبدأ!', en: 'Let’s go!' },
  coins: { ar: 'عملة', en: 'coins' },
  worlds: { ar: 'العوالم', en: 'Worlds' },
  daily: { ar: 'تحدي النهارده', en: 'Today’s challenge' },
  dailyDone: { ar: 'خلّصت تحدي النهارده! تعالى بكره', arF: 'خلّصتي تحدي النهارده! تعالي بكره', en: 'Today’s challenge done! Come back tomorrow' },
  dailyBonus: { ar: 'مكافأة \u2066+١٠\u2069 لو صح من أول مرة', en: '+10 bonus if right first time' },
  shop: { ar: 'المحل', en: 'Shop' },
  badges: { ar: 'الأوسمة', en: 'Badges' },
  parents: { ar: 'ركن الأهل', en: 'Parents' },
  whatDo: { ar: 'تعمل إيه؟', en: 'What do you do?' },
  tryAgain: { ar: 'حاول تاني', arF: 'حاولي تاني', en: 'Try again' },
  next: { ar: 'اللي بعده', en: 'Next' },
  finish: { ar: 'خلّصت!', en: 'Finish!' },
  great: { ar: 'برافو عليك!', arF: 'برافو عليكي!', en: 'Great job!' },
  oops: { ar: 'أوبس! فكّر تاني', arF: 'أوبس! فكّري تاني', en: 'Oops! Think again' },
  practice: { ar: 'تدريب (من غير عملات)', en: 'Practice (no coins)' },
  worldDone: { ar: 'خلّصت العالم ده!', arF: 'خلّصتي العالم ده!', en: 'You finished this world!' },
  firstTryCount: { ar: 'صح من أول مرة', en: 'Right first time' },
  backHome: { ar: 'الرئيسية', en: 'Home' },
  buy: { ar: 'اشتري', en: 'Buy' },
  wear: { ar: 'البس', arF: 'البسي', en: 'Wear' },
  remove: { ar: 'اقلع', arF: 'اقلعي', en: 'Take off' },
  notEnough: { ar: 'محتاج عملات أكتر', arF: 'محتاجة عملات أكتر', en: 'Need more coins' },
  level: { ar: 'المستوى', en: 'Level' },
  nextLevel: { ar: 'للمستوى الجاي', en: 'to next level' },
  newBadge: { ar: 'وسام جديد!', en: 'New badge!' },
  tapToPlay: { ar: 'دوس على أي حد في الصورة 👆', arF: 'دوسي على أي حد في الصورة 👆', en: 'Tap anyone in the picture 👆' },
  tellAdult: { ar: 'لو حد زعّلك أو خوّفك، احكي لماما أو بابا أو المُدرّسة. أنت مش لوحدك 💛', arF: 'لو حد زعّلك أو خوّفك، احكي لماما أو بابا أو المُدرّسة. إنتي مش لوحدك 💛', en: 'If anyone hurts or scares you, tell Mum, Dad or your teacher. You are not alone 💛' },
  parentGate: { ar: 'ركن الأهل', en: 'Parents’ corner' },
  setPin: { ar: 'اختار رقم سري من ٤ أرقام', en: 'Choose a 4-digit PIN' },
  confirmPin: { ar: 'اكتب الرقم السري تاني', en: 'Enter the PIN again' },
  enterPin: { ar: 'اكتب الرقم السري', en: 'Enter your PIN' },
  wrongPin: { ar: 'الرقم غلط', en: 'Wrong PIN' },
  pinMismatch: { ar: 'الرقمين مش زي بعض، جرّب تاني', en: 'PINs don’t match, try again' },
  progress: { ar: 'التقدّم', en: 'Progress' },
  accuracy: { ar: 'صح من أول مرة', en: 'First-try accuracy' },
  mistakesTitle: { ar: 'مواقف محتاجة كلام معاه', en: 'Situations to talk about' },
  noMistakes: { ar: 'مفيش غلطات لسه 👏', en: 'No mistakes yet 👏' },
  talkTip: { ar: 'نصيحة للأهل', en: 'Tip for parents' },
  helpline: { ar: 'خط نجدة الطفل في مصر: ١٦٠٠٠ (مجاني)', en: 'Egypt Child Helpline: 16000 (free)' },
  privacy: { ar: 'كل البيانات محفوظة على الموبايل ده بس. مفيش إعلانات ومفيش حاجة بتتبعت على النت.', en: 'All data stays on this phone only. No ads and nothing is sent online.' },
  resetProfile: { ar: 'إعادة من الأول', en: 'Reset progress' },
  deleteProfile: { ar: 'مسح البطل', en: 'Delete hero' },
  sure: { ar: 'متأكد؟ اضغط تاني للتأكيد', en: 'Sure? Tap again to confirm' },
  readAloud: { ar: 'القراءة بالصوت', en: 'Read aloud' },
  sounds: { ar: 'الأصوات', en: 'Sounds' },
  on: { ar: 'شغّال', en: 'On' },
  off: { ar: 'مقفول', en: 'Off' },
  rules: { ar: 'قواعد العملات', en: 'Coin rules' },
  rulesText: {
    ar: 'صح من أول مرة \u2066+٢٠\u2069 · غلط \u2066−٣٠\u2069 · صح بعد الغلط \u2066+١٥\u2069 · تحدي النهارده \u2066+١٠\u2069 زيادة',
    en: 'Right first time +20 · Wrong −30 · Right after a mistake +15 · Daily challenge +10 extra',
  },
  language: { ar: 'English', en: 'عربي' },
  or: { ar: 'ولا', en: 'or' },
  situations: { ar: 'موقف', en: 'situations' },
  situationsFew: { ar: 'مواقف', en: 'situations' },
  listen: { ar: 'اسمع السؤال', arF: 'اسمعي السؤال', en: 'Listen to the question' },
  nameFirst: { ar: 'اكتب اسم البطل الأول ✏️', en: 'Type the hero’s name first ✏️' },
  needMore: { ar: 'محتاج {n} كمان', arF: 'محتاجة {n} كمان', en: '{n} more needed' },
  tapPrompt: { ar: 'يلا نلعب 👆', en: 'Tap to start 👆' },
  back: { ar: 'رجوع', en: 'Back' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
  children: { ar: 'الأطفال', en: 'Children' },
  music: { ar: 'الموسيقى', en: 'Music' },
} satisfies Record<string, Entry>;

export type StrKey = keyof typeof S;
/** UI string; `female` picks the feminine Arabic form when one exists. */
export const tr = (lang: Lang, key: StrKey, female = false): string => {
  const e: Entry = S[key];
  return lang === 'ar' && female && e.arF ? e.arF : e[lang];
};

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const num = (lang: Lang, n: number) =>
  lang === 'ar' ? String(n).replace(/\d/g, (d) => AR_DIGITS[+d]) : String(n);
/** "+20" / "−30" with the sign kept on the left, also inside Arabic text. */
export const signed = (lang: Lang, n: number) => `\u2066${n >= 0 ? '+' : '−'}${num(lang, Math.abs(n))}\u2069`;

/** Arabic counted noun for a total. CLDR "few" (n % 100 in 3..10) takes the plural.
 *  Written out because Hermes on Android does not ship Intl.PluralRules. */
export const countNoun = (lang: Lang, total: number): StrKey =>
  lang === 'ar' && total % 100 >= 3 && total % 100 <= 10 ? 'situationsFew' : 'situations';

/** "75%" in English, "٧٥٪" in Arabic. */
export const percent = (lang: Lang, x: number) => (lang === 'ar' ? `${num(lang, x)}٪` : `${x}%`);
