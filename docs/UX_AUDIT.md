# HeroKid: UX/UI Audit

Scope: web build of commit `cbdf7f0` (same React Native code as the Android app) · 9 routes × 2 locales (ar, en) = 18 screens · viewport 390×844 touch · seeded child profile (4 situations done, 1 mistake, 1 purchase) · 2026-11-12
Method: `ux-ui-audit` probes (core, heuristics, perception, rtl, ltr, parity, focus) + screenshot pass + reading pass of all visible text and all 30 situations. Judged against WCAG 2.2 AA, Nielsen's heuristics, CLDR plural rules, and the project's own art bible (`docs/ART_BIBLE.md`).

## Summary
| Severity | Count |
|---|---|
| Critical | 0 |
| Major | 6 |
| Accessibility | 5 |
| Note | 5 |

No blockers: every flow completes, there are 0 runtime errors, and no layout overflows on any of the 18 screens. The problems are colour contrast on the brand orange and on three home tiles, Arabic addressing every child in the masculine, and a few progress and feedback inconsistencies.

Probe false positives (checked and excluded):
- `١٣٥` read as a plural error: the probe split the number's digits.
- "وش" read as Gulf dialect: it is inside "ماتخلّوش".
- "اقل"/"انا" read as misspellings: they are inside "اقلع" and "لأ، الكل".
- The 🎁 emoji flagged at 2.58:1: emoji glyphs are not text colour.
- The disabled "Start" button at 1.48:1: WCAG exempts inactive controls. It is still a usability problem, see 04.

## Findings

**01 · [Major + A11y 1.4.3] · title, every play screen, create hero**
The brand orange fails contrast behind white text, on the logo and on every primary button ("حاول تاني", "يلا نبدأ").
These are the most-tapped labels in the app, and a 7-year-old early reader needs them crisp.
```
#FFFFFF on #FF7A00 = 2.61:1   (large bold text needs 3:1)
```
FIX: Button and logo fill `#EA580C` (3.56:1), or `#C2410C` (5.18:1) for small text. Keep `#FF7A00` for decoration.

**02 · [Major + A11y 1.4.3] · /home action tiles**
Three of the home screen's six destinations have unreadable labels.
```
الأوسمة / Badges    #FFFFFF on #F59E0B = 2.15:1  (16px, needs 4.5)
ركن الأهل / Parents #FFFFFF on #0EA5E9 = 2.77:1
المحل / Shop        #FFFFFF on #EC4899 = 3.53:1
```
FIX: `#B45309` (5.02), `#0369A1` (5.93), `#BE185D` (6.04).

**03 · [Major] · every situation + create hero**
The game lets a child pick a girl or a girl-with-hijab hero, then speaks to every child in the masculine.
A girl hears and reads "تعمل إيه؟" 30 times per run. It undercuts the "this hero is me" promise of the avatar.
```
30/30 questions end with "تعمل إيه؟" (masc.)  ·  "اعمل البطل بتاعك"  ·  "اختار شكلك"
probe-rtl genderedImperatives: masculine ["اعمل","ابدأ"], feminine []
```
FIX: Pick the string by the hero's gender (`تعملي إيه؟`, `اختاري`, `اعملي`). The create screen comes before a gender is chosen, so use neutral wording there ("يلا نعمل البطل", "شكل البطل"). English is unaffected.

**04 · [Major] · /new-profile**
The "Start" button stays grey with no reason given until the name has 2 letters.
A child who types one letter (or nothing) taps, and nothing happens: no message, no sound.
```
"يلا نبدأ!" disabled while name.trim().length < 2 · no helper text · microcopy.submitBlockedWithoutExplanation
```
FIX: Keep the button active. On tap with a short name, shake the field, play the "wrong" sound, show "اكتب اسمك الأول ✏️", and focus the input.

**05 · [Major] · /world/[id] progress dots**
The dots count only the unfinished situations, so the same world shows two different totals.
```
home card: "٣ / ١٢ موقف"      world screen: 9 dots (s4…s12)
```
FIX: Render all 12 dots. Fill the finished ones in the world colour and start the marker at the first unfinished one.

**06 · [Major · Arabic grammar] · /home world cards, /parent**
The counter uses the singular noun for every total, which is wrong for 3–10.
```
"٠ / ٦ موقف"   → should be "٠ / ٦ مواقف"   (CLDR ar: few = 3–10 → plural)
"٣ / ١٢ موقف" ✓ (11–99 → singular)
```
FIX: Pick the noun with `new Intl.PluralRules('ar').select(total)`: `few` → مواقف, otherwise موقف.

**07 · [A11y 4.1.2] · all screens**
No tappable element exposes a role or label, so Android TalkBack reads nothing useful.
```
probe-focus: focusedElement {tag:"div", role:null, ariaLabel:null}
unnamed: speaker 🔊, character taps, world tiles, PIN keypad, option cards
```
FIX: In `Bouncy`, pass `accessibilityRole="button"` and an `accessibilityLabel`. Speaker: "اسمع السؤال" / "Listen". Characters: their name.

**08 · [A11y 1.3.1 / 4.1.2] · /new-profile**
The name field's only label is its placeholder, which disappears while typing.
```
forms: [{tag:"input", accessibleName:"", placeholder:"اكتب اسمك"}]
```
FIX: `accessibilityLabel={t('yourName')}` on the `TextInput`.

**09 · [A11y 1.4.3] · /parent toggles**
The "Off" state is nearly invisible.
```
"مقفول / Off"  #FFFFFF on #D4D4D8 = 1.48:1
```
FIX: Off fill `#71717A` (4.83:1).

**10 · [A11y 1.4.3] · /shop**
Prices the child can't afford yet are the hardest text to read. That is the exact number the child is saving towards.
```
#A8A29E on #F5F5F4 = 2.31:1 (13px)
```
FIX: `#57534E` (6.99:1), and add "محتاج ٤٥ كمان" (coins still needed).

**11 · [A11y 1.4.3] · /shop, /parent**
Green and red status text falls just short of contrast.
```
"✓ اقلع"  white on #16A34A = 3.30   ·  "✓ <right answer>" #16A34A on #F8FAFC = 3.15
"✗ <wrong answer>" #E11D48 on #F8FAFC = 4.49   ·  "🗑️ امسح البطل" #E11D48 on #FFE4E6 = 3.91
```
FIX: Use `#15803D` (5.02 / 4.79) and `#BE123C` (6.01 / 5.24) for text. Keep the bright tones for fills and borders.

**12 · [Note] · good-answer card**
Praise is said twice in a row.
```
"🎉 برافو عليك!"  then  "برافو! البطل بيقف جنب اللي بيتنمّروا عليه."
all 30 lessons open with برافو / ممتاز / صح / جميل
```
FIX: Drop the opening praise word from the lessons, so the lesson starts with the reason.

**13 · [Note] · /parent**
The Arabic percent sign doesn't match the digits.
```
"صح من أول مرة: ٧٥% (٣/٤)"
```
FIX: `Intl.NumberFormat('ar-EG',{style:'percent'})` gives "٧٥٪".

**14 · [Note] · /parent layout**
The page is flat: section titles and body text are almost the same size, and each child is one long card.
```
visualHierarchy headlineToBodyRatio = 1.25 (20px / 16px; < 1.5 gives the eye no entry point)
```
FIX: Section titles at 20px black weight. Make each child's card collapsible, with the summary line visible.

**15 · [Note] · /parent toggles**
The settings toggles are 42px tall.
```
4 targets between 24 and 44px (passes 2.5.8 AA; below the 48dp Android guideline)
```
FIX: Set `minHeight: 48`.

**16 · [Note · web only] · all**
The document language and direction never change.
```
<html lang="en" dir=""> on Arabic screens
```
FIX: On web, set `document.documentElement.lang` and `dir` when the language changes. The native app is unaffected.

## What works
| Area | Measurement |
|---|---|
| Tap targets | 0 below 24px across 18 screens; every child-facing control ≥ 44px; answer cards are 358×87px |
| Choice load | 3 answers per situation; 9 interactive targets on the play screen (Hick index 3.32, inside the 3.2–4.0 norm) |
| Layout | 0 horizontal overflow on all 18 screens; 1 screen of scroll on most |
| Numerals | Arabic-Indic only in Arabic (home: 44 Indic / 0 Western); Western only in English. No mixing |
| Bidi | After the `⁦+١٥⁩` isolate fix: 0 bidi hazards. Signed numbers read correctly |
| Language | One register (Egyptian) throughout; 0 untranslated strings in either locale; 0 truncation |
| Play screen | 0 contrast failures across 11 text elements; focus outline 16.58:1 |
| Stability | 0 runtime errors on 18 screens. The only console output is react-native-web's "native driver" warning, which is web-only |

## Where to start (impact ÷ effort)
1. **01 + 02 + 09 + 10 + 11:** a colour-token pass in `src/theme.ts` and 3 home tiles. Under an hour, and it fixes 10 of the 11 contrast failures.
2. **06:** a one-line plural fix.
3. **04:** an explained "Start" button. About 20 lines.
4. **05:** the full progress dots. About 10 lines.
5. **07 + 08:** accessibility labels in `Bouncy` plus about 6 call sites.
6. **03:** gendered strings. This is a content task: about 35 strings, and the voice reads them too.
7. **12, 13, 14, 15, 16:** polish.
