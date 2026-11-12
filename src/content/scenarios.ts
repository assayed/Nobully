/**
 * HeroKid situations. Arabic (Egyptian, simple) first, English second.
 * To add a situation: copy one block, give it a new unique id, keep exactly one `good: true` option.
 */

export type L = { ar: string; en: string };
export type WorldId = 'school' | 'home' | 'outside' | 'online';

export type Option = { text: L; good: boolean; why?: L };
export type Scenario = {
  id: string;
  world: WorldId;
  scene: string;
  question: L;
  lesson: L;
  options: Option[];
};

export type World = {
  id: WorldId;
  emoji: string;
  color: string;
  soft: string;
  title: L;
  subtitle: L;
  parentTip: L;
};

export const WORLDS: World[] = [
  {
    id: 'school',
    emoji: '🏫',
    color: '#3B82F6',
    soft: '#DBEAFE',
    title: { ar: 'المدرسة: لا للتنمّر', en: 'School: No Bullying' },
    subtitle: { ar: 'إزاي أكون صاحب جدع', en: 'How to be a true friend' },
    parentTip: {
      ar: 'اسأل طفلك كل يوم: مين لعبت معاه النهارده؟ هل حد زعّلك؟ خليه يحس إنه يقدر يحكيلك أي حاجة.',
      en: 'Ask your child daily: who did you play with today? Did anyone upset you? Make it safe to tell you anything.',
    },
  },
  {
    id: 'home',
    emoji: '🏠',
    color: '#F97316',
    soft: '#FFEDD5',
    title: { ar: 'البيت والعيلة', en: 'Home & Family' },
    subtitle: { ar: 'احترام ومساعدة', en: 'Respect and helping' },
    parentTip: {
      ar: 'امدح التصرف الكويس قدّام العيلة، وادّي طفلك مهمة صغيرة كل يوم في البيت.',
      en: 'Praise good behaviour in front of the family, and give your child one small home task every day.',
    },
  },
  {
    id: 'outside',
    emoji: '🌳',
    color: '#16A34A',
    soft: '#DCFCE7',
    title: { ar: 'النادي والشارع', en: 'Club & Street' },
    subtitle: { ar: 'أخلاقنا برّه البيت', en: 'Good manners outside' },
    parentTip: {
      ar: 'كون قدوة: طفلك بيتعلم منك وأنت بتقف في الطابور وبتساعد الكبير وبترمي الزبالة في مكانها.',
      en: 'Be the example: your child learns from how you queue, help elders and use the bin.',
    },
  },
  {
    id: 'online',
    emoji: '📱',
    color: '#8B5CF6',
    soft: '#EDE9FE',
    title: { ar: 'الأمان على النت', en: 'Online Safety' },
    subtitle: { ar: 'الموبايل والألعاب', en: 'Phones and games' },
    parentTip: {
      ar: 'اتفق مع طفلك: أي رسالة غريبة أو حد مش نعرفه يقولّك على طول، ومفيش عقاب لما يحكي.',
      en: 'Agree with your child: any strange message or unknown person, tell you straight away, with no punishment for telling.',
    },
  },
];

type O = [ar: string, en: string, good: boolean, whyAr?: string, whyEn?: string];
const sc = (
  id: string,
  world: WorldId,
  scene: string,
  q: [string, string],
  lesson: [string, string],
  opts: O[],
): Scenario => ({
  id,
  world,
  scene,
  question: { ar: q[0], en: q[1] },
  lesson: { ar: lesson[0], en: lesson[1] },
  options: opts.map(([ar, en, good, whyAr, whyEn]) => ({
    text: { ar, en },
    good,
    why: whyAr ? { ar: whyAr, en: whyEn ?? '' } : undefined,
  })),
});

export const SCENARIOS: Scenario[] = [
  // ───────────── School: no bullying ─────────────
  sc('s1', 'school', '🏫👓😢',
    ['في الفسحة، شوية عيال بيضحكوا على عمر عشان نضارته. تعمل إيه؟', 'At break, some kids are laughing at Omar because of his glasses. What do you do?'],
    ['البطل بيقف جنب اللي بيتنمّروا عليه.', 'Heroes stand up for kids who are being bullied.'],
    [
      ['أقولهم: كفاية كده! وألعب مع عمر', 'Tell them: Stop it! Then play with Omar', true],
      ['أضحك معاهم', 'Laugh with them', false, 'الضحك على حد بيجرحه، وعمر هيزعل جدًا.', 'Laughing at someone hurts. Omar will feel very sad.'],
      ['أمشي وأعمل نفسي مش شايف', 'Walk away and pretend I didn’t see', false, 'لما نسكت، المتنمّر بيكمّل. البطل بيساعد.', 'When we stay silent, the bully keeps going. Heroes help.'],
    ]),
  sc('s2', 'school', '🧒🪑🍎',
    ['سلمى بنت جديدة في الفصل، وقاعدة لوحدها في الفسحة. تعمل إيه؟', 'Salma is new in class and sits alone at break. What do you do?'],
    ['كلمة حلوة بتخلّي الجديد يحس إنه في بيته.', 'A kind word makes a new kid feel at home.'],
    [
      ['أروح أسلّم عليها وأقولها تيجي تلعب معانا', 'Say hello and invite her to play with us', true],
      ['أوشوش صحابي عليها', 'Whisper about her with my friends', false, 'الوشوشة على حد بتخليه يحس إنه مرفوض.', 'Whispering about someone makes them feel left out.'],
      ['أسيبها، هي مش صاحبتي', 'Leave her, she’s not my friend', false, 'كل صاحب كان في يوم جديد. ممكن تبقى أحسن صاحبة ليك!', 'Every friend was new once. She could be your best friend!'],
    ]),
  sc('s3', 'school', '🥪😠🤫',
    ['ولد أخد ساندوتش كريم وقاله: لو قلت لحد هتشوف! وأنت شفت كل حاجة. تعمل إيه؟', 'A boy took Karim’s sandwich and said: tell anyone and you’ll see! You saw it all. What do you do?'],
    ['إنك تحكي لكبير مش "فتّان"، ده شجاعة وحماية لصاحبك.', 'Telling an adult is not tattling. It is brave and protects your friend.'],
    [
      ['أحكي للمُدرّسة أو المشرفة على طول', 'Tell the teacher or supervisor right away', true],
      ['أسكت عشان خايف', 'Stay quiet because I’m scared', false, 'الخوف طبيعي، بس السكوت بيخلّي التنمّر يكبر. الكبار يقدروا يساعدوا.', 'Fear is normal, but silence lets bullying grow. Adults can help.'],
      ['آخد أنا كمان العصير بتاعه', 'Take Karim’s juice too', false, 'كده بقيت بتتنمّر أنت كمان. البطل مايأذيش حد.', 'Now you are bullying too. Heroes never hurt others.'],
    ]),
  sc('s4', 'school', '👫🚫🧒',
    ['صحابك قالوا: "ماتخلّوش جنى تلعب معانا". تعمل إيه؟', 'Your friends say: "Don’t let Jana play with us." What do you do?'],
    ['اللعب أحلى لما الكل يكون معانا.', 'Games are more fun when everyone is included.'],
    [
      ['أقول: لأ، الكل يلعب معانا', 'Say: No, everyone can play with us', true],
      ['أوافقهم', 'Agree with them', false, 'إنك تبعد حد عن اللعب نوع من التنمّر.', 'Leaving someone out on purpose is a kind of bullying.'],
      ['أقول لجنى: امشي من هنا', 'Tell Jana: go away', false, 'الكلمة دي بتوجع. اتخيّل لو اتقالتلك أنت.', 'Those words hurt. Imagine someone saying them to you.'],
    ]),
  sc('s5', 'school', '😤🫸😣',
    ['كنت متعصّب وزقّيت زياد فوقع. تعمل إيه؟', 'You were angry and pushed Ziad, and he fell. What do you do?'],
    ['الاعتذار شجاعة، والبطل بيصلّح غلطه.', 'Saying sorry is brave, and heroes fix their mistakes.'],
    [
      ['أقوله آسف وأساعده يقوم', 'Say sorry and help him get up', true],
      ['أقول: يستاهل', 'Say: he deserved it', false, 'مفيش حد يستاهل يتأذي. لما تتعصّب خد نفس عميق وعدّ لـ ٥.', 'Nobody deserves to be hurt. When angry, take a deep breath and count to 5.'],
      ['أجري بسرعة', 'Run away quickly', false, 'الهروب مش بيصلّح حاجة. واجه غلطك واعتذر.', 'Running away fixes nothing. Face your mistake and apologise.'],
    ]),
  sc('s6', 'school', '🗣️😞🎒',
    ['ولد في الفصل بيقول لحمزة: "يا تخين!". تعمل إيه؟', 'A boy in class calls Hamza: "Hey fatty!" What do you do?'],
    ['بننادي كل واحد باسمه، والأسماء الوحشة ممنوعة.', 'We call everyone by their name. Mean nicknames are not OK.'],
    [
      ['أقول: إحنا مابنقولش كده، اسمه حمزة', 'Say: We don’t say that. His name is Hamza', true],
      ['أقول الكلمة زيه', 'Say the word too', false, 'تكرار الكلمة بيضاعف الوجع على حمزة.', 'Repeating the word doubles the hurt for Hamza.'],
      ['أضحك', 'Laugh', false, 'ضحكتك بتشجّع المتنمّر يكمّل.', 'Your laugh encourages the bully to keep going.'],
    ]),
  sc('s7', 'school', '😠➡️🧒',
    ['فيه ولد بيقولك كلام وحش كل يوم. تعمل إيه؟', 'A boy says mean things to you every day. What do you do?'],
    ['تقول "بطّل" بصوت واضح، وتحكي لماما وبابا والمُدرّسة. أنت مش لوحدك.', 'Say "Stop" clearly and tell your parents and teacher. You are not alone.'],
    [
      ['أقوله بثقة: "بطّل!" وأحكي لماما وبابا والمُدرّسة', 'Say firmly "Stop!" and tell my parents and teacher', true],
      ['أضربه', 'Hit him', false, 'الضرب بيخلّيك أنت اللي تتعاقب، وبيكبّر المشكلة.', 'Hitting gets you in trouble and makes things worse.'],
      ['أعيّط لوحدي ومحكيش لحد', 'Cry alone and tell no one', false, 'مش لازم تشيل الحمل لوحدك. الكبار موجودين عشان يحموك.', 'You don’t have to carry it alone. Adults are there to protect you.'],
    ]),
  sc('s8', 'school', '📖🗣️😳',
    ['ليلى بتتهته وهي بتقرا، وكام واحد بيضحكوا. تعمل إيه؟', 'Laila stutters while reading aloud and some kids giggle. What do you do?'],
    ['الصبر والتشجيع بيدّوا صاحبك ثقة.', 'Patience and encouragement give your friend confidence.'],
    [
      ['أستنّاها بهدوء وأقولها: برافو عليكي', 'Wait quietly and tell her: well done', true],
      ['أكمّل الكلام بدالها بتريقة', 'Finish her words to make fun of her', false, 'التريقة بتخليها تخاف تقرا تاني.', 'Mocking makes her afraid to read again.'],
      ['أضحك مع اللي بيضحكوا', 'Giggle with the others', false, 'كل واحد فينا عنده حاجة صعبة عليه. محدش يحب حد يضحك عليه.', 'Everyone finds something hard. Nobody likes being laughed at.'],
    ]),
  sc('s9', 'school', '⚽😔🧒',
    ['بتختاروا فريق الكورة، وحمزة دايمًا آخر واحد بيتختار وزعلان. تعمل إيه؟', 'You are picking football teams, and Hamza is always picked last and looks sad. What do you do?'],
    ['اللعب الحلو يعني الكل يحس إنه مهم.', 'Fair play means everyone feels important.'],
    [
      ['أختاره في فريقي وأشجّعه', 'Pick him for my team and cheer him on', true],
      ['أقول: هو بيلعب وحش', 'Say: he plays badly', false, 'الكلام ده بيكسر قلبه. كلنا بنتعلم.', 'That breaks his heart. We are all learning.'],
      ['مايهمّنيش', 'I don’t care', false, 'البطل بياخد باله من مشاعر صحابه.', 'Heroes notice how their friends feel.'],
    ]),
  sc('s10', 'school', '✏️💔🧒',
    ['حد كسر مقلمة فريدة بالقصد، ومعاك أقلام زيادة. تعمل إيه؟', 'Someone broke Farida’s pencil case on purpose, and you have extra pencils. What do you do?'],
    ['ساعدتها وحكيت للمُدرّسة. كده البطولة.', 'You helped her and told the teacher. That’s heroic.'],
    [
      ['أسلّفها قلم وأحكي للمُدرّسة', 'Lend her a pencil and tell the teacher', true],
      ['أضحك على شكل المقلمة', 'Laugh at the broken case', false, 'فريدة زعلانة، والضحك هيزعّلها أكتر.', 'Farida is upset. Laughing makes it worse.'],
      ['ماعملش حاجة', 'Do nothing', false, 'معاك حاجة تقدر تساعد بيها. البطل مابيتفرّجش.', 'You have something that can help. Heroes don’t just watch.'],
    ]),
  sc('s11', 'school', '🎒🙈😏',
    ['صاحبك قالك: "تعالى نخبّي شنطة آدم هزار". تعمل إيه؟', 'Your friend says: "Let’s hide Adam’s bag as a joke." What do you do?'],
    ['الهزار الحلو هو اللي الكل بيضحك فيه، مش واحد بس اللي بيزعل.', 'A good joke makes everyone laugh, not one person sad.'],
    [
      ['أقول: لأ، آدم هيقلق ويزعل', 'Say: No, Adam will get worried and upset', true],
      ['أساعده ونخبّيها', 'Help him hide it', false, 'ده مش هزار. آدم ممكن يتعاقب أو يعيّط.', 'That’s not a joke. Adam could get in trouble or cry.'],
      ['أتفرّج وأشوف هيحصل إيه', 'Watch and see what happens', false, 'التفرّج على الأذى زي المشاركة فيه.', 'Watching someone get hurt is like joining in.'],
    ]),
  sc('s12', 'school', '📝🌟😟',
    ['أخدت درجة عالية في الامتحان، وصاحبك رسب وزعلان. تعمل إيه؟', 'You got a high mark in the test, and your friend failed and is sad. What do you do?'],
    ['النجاح أحلى لما نساعد غيرنا ينجح.', 'Success is sweeter when we help others succeed.'],
    [
      ['أشجّعه وأقوله نذاكر سوا', 'Encourage him and offer to study together', true],
      ['أتباهى بدرجتي قدّامه', 'Show off my mark in front of him', false, 'التباهي بيخلّي صاحبك يحس إنه أقل.', 'Showing off makes your friend feel small.'],
      ['أقوله: أنت غبي', 'Tell him: you’re stupid', false, 'محدش غبي. كلنا بنتعلم بسرعات مختلفة.', 'Nobody is stupid. We all learn at different speeds.'],
    ]),

  // ───────────── Home & family ─────────────
  sc('h1', 'home', '🛍️👩😓',
    ['ماما راجعة من السوق وشايلة شنط تقيلة. تعمل إيه؟', 'Mum is back from the market carrying heavy bags. What do you do?'],
    ['مساعدة ماما من أحلى حاجات البطل.', 'Helping Mum is one of the best things a hero does.'],
    [
      ['أجري أشيل معاها', 'Run to help carry them', true],
      ['أكمّل لعب على التابلت', 'Keep playing on the tablet', false, 'ماما تعبانة ومحتاجة إيدك الصغيرة.', 'Mum is tired and needs your little hands.'],
      ['أقول: مش شغلي', 'Say: not my job', false, 'البيت بيتنا كلنا، وكلنا بنساعد.', 'Home belongs to all of us, so we all help.'],
    ]),
  sc('h2', 'home', '🧸💥👶',
    ['أخوك الصغير كسر لعبتك من غير قصد. تعمل إيه؟', 'Your little brother broke your toy by accident. What do you do?'],
    ['الهدوء والسماح بيخلّوا البيت سعيد.', 'Staying calm and forgiving keeps home happy.'],
    [
      ['أهدى، وأقوله ياخد باله، ونحاول نصلّحها سوا', 'Stay calm, ask him to be careful, and fix it together', true],
      ['أضربه', 'Hit him', false, 'هو صغير ومكانش قاصد. الضرب عمره ما بيصلّح حاجة.', 'He is little and didn’t mean it. Hitting never fixes anything.'],
      ['أكسر لعبته', 'Break his toy', false, 'كده بقى فيه لعبتين مكسورين بدل واحدة.', 'Now there are two broken toys instead of one.'],
    ]),
  sc('h3', 'home', '🏺💔🤭',
    ['كسرت الفازة ومحدش شافك. تعمل إيه؟', 'You broke the vase and nobody saw. What do you do?'],
    ['الصدق بيخلّي ماما وبابا يثقوا فيك أكتر.', 'Honesty makes your parents trust you even more.'],
    [
      ['أقول لماما وبابا الحقيقة', 'Tell Mum and Dad the truth', true],
      ['أقول القطة اللي كسرتها', 'Say the cat broke it', false, 'الكدب بيخلّي حد تاني يتظلم، حتى لو قطة.', 'Lying blames someone else unfairly, even a cat.'],
      ['أخبّي الحتت تحت الكنبة', 'Hide the pieces under the sofa', false, 'الحتت ممكن تعوّر حد. وكمان الحقيقة بتبان.', 'The pieces could cut someone, and the truth comes out anyway.'],
    ]),
  sc('h4', 'home', '👵📖🛋️',
    ['تيتة جاية تزورنا وبتحكي حدوتة. تعمل إيه؟', 'Grandma is visiting and telling a story. What do you do?'],
    ['احترام الكبير وسماعه بيفرّح قلبه.', 'Respecting and listening to elders makes them happy.'],
    [
      ['أقعد جنبها وأسمع باهتمام', 'Sit next to her and listen carefully', true],
      ['أقوم ألعب وأسيبها', 'Leave to go and play', false, 'تيتة جاية مخصوص تشوفك. وقتها معاك غالي.', 'Grandma came especially to see you. Her time with you is precious.'],
      ['أقول: دي حدوتة مملة', 'Say: this story is boring', false, 'الكلمة دي بتزعّل تيتة. ممكن تطلب حدوتة تانية بأدب.', 'That hurts Grandma’s feelings. You can politely ask for another story.'],
    ]),
  sc('h5', 'home', '📱⏰👨',
    ['بابا قالك وقت التابلت خلص. تعمل إيه؟', 'Dad says tablet time is over. What do you do?'],
    ['السمع والطاعة لبابا وماما بيخلّيك بطل حقيقي.', 'Listening to your parents makes you a real hero.'],
    [
      ['أقول حاضر وأقفله', 'Say "OK" and turn it off', true],
      ['أصرّخ وأعيّط', 'Scream and cry', false, 'الصريخ مش بيغيّر القاعدة. ممكن تسأل بهدوء على وقت بكره.', 'Screaming doesn’t change the rule. Ask calmly about tomorrow’s time.'],
      ['أخبّي التابلت وألعب في السر', 'Hide the tablet and play secretly', false, 'اللعب في السر نوع من الكدب.', 'Playing in secret is a kind of lying.'],
    ]),
  sc('h6', 'home', '👧😭🎲',
    ['أختك خسرت في لعبة وبتعيّط. تعمل إيه؟', 'Your sister lost a game and is crying. What do you do?'],
    ['الحضن والكلمة الحلوة بيخفّفوا الزعل.', 'A hug and a kind word ease sadness.'],
    [
      ['أحضنها وأقولها: نلعب تاني سوا', 'Hug her and say: let’s play again together', true],
      ['أقولها: هيه! خسرتي!', 'Say: Ha! You lost!', false, 'الشماتة بتجرح. البطل بيكسب بأدب.', 'Gloating hurts. Heroes win kindly.'],
      ['أسيبها', 'Leave her', false, 'أختك محتاجاك دلوقتي.', 'Your sister needs you right now.'],
    ]),

  // ───────────── Club & street ─────────────
  sc('o1', 'outside', '🚇👴🪑',
    ['في المترو، فيه راجل كبير واقف ومفيش كرسي فاضي. تعمل إيه؟', 'On the metro, an old man is standing and there are no free seats. What do you do?'],
    ['احترام الكبير من أخلاقنا الحلوة.', 'Respecting elders is part of our good manners.'],
    [
      ['أقوم وأقعّده مكاني', 'Stand up and give him my seat', true],
      ['أعمل نفسي نايم', 'Pretend to be asleep', false, 'الراجل الكبير رجليه بتتعب أسرع مننا.', 'Older people’s legs get tired faster than ours.'],
      ['أحط شنطتي على الكرسي اللي جنبي', 'Put my bag on the seat next to me', false, 'الكرسي للناس مش للشنط.', 'Seats are for people, not bags.'],
    ]),
  sc('o2', 'outside', '🧃🗑️🛣️',
    ['خلّصت العصير في الشارع ومفيش سلة زبالة قريبة. تعمل إيه؟', 'You finished your juice in the street and there’s no bin nearby. What do you do?'],
    ['بلدنا نضيفة بإيدينا.', 'We keep our country clean with our own hands.'],
    [
      ['أشيله معايا لحد ما ألاقي سلة', 'Keep it until I find a bin', true],
      ['أرميه على الأرض', 'Throw it on the ground', false, 'الزبالة في الشارع بتوسّخ بلدنا وبتأذي الحيوانات.', 'Litter makes our streets dirty and harms animals.'],
      ['أرميه في الترعة', 'Throw it in the canal', false, 'المية دي بيشرب منها ناس وحيوانات. لازم نحافظ عليها.', 'People and animals rely on that water. We must protect it.'],
    ]),
  sc('o3', 'outside', '🍦🧍🧍🧍',
    ['فيه طابور طويل على الآيس كريم في النادي. تعمل إيه؟', 'There’s a long queue for ice cream at the club. What do you do?'],
    ['الدور حق للكل.', 'Taking turns is fair for everyone.'],
    [
      ['أقف في دوري وأستنّى', 'Wait for my turn', true],
      ['أدخل قدّام الناس', 'Cut in front of people', false, 'الناس دي مستنية قبلك. ده مش عدل.', 'Those people waited before you. That isn’t fair.'],
      ['أزق اللي قدّامي', 'Push the person in front', false, 'الزق ممكن يوقّع حد ويعوّره.', 'Pushing can make someone fall and get hurt.'],
    ]),
  sc('o4', 'outside', '🏊😟💦',
    ['في حمّام السباحة، ولد مش عارف يعوم والعيال بيضحكوا عليه. تعمل إيه؟', 'At the pool, a boy can’t swim and other kids laugh at him. What do you do?'],
    ['التشجيع بيساعد الناس يتعلموا أسرع.', 'Encouragement helps people learn faster.'],
    [
      ['أشجّعه وأقوله: أنا كمان كنت بتعلم', 'Encourage him: I was learning too once', true],
      ['أرشّ عليه مية', 'Splash water at him', false, 'ده ممكن يخوّفه ويخلّيه يكره المية.', 'That can scare him and make him hate the water.'],
      ['أضحك مع العيال', 'Laugh with the kids', false, 'كلنا كان في حاجة ماكناش عارفينها.', 'There was a time we couldn’t do things either.'],
    ]),
  sc('o5', 'outside', '👛🏬👀',
    ['لقيت محفظة على الأرض في المول. تعمل إيه؟', 'You find a wallet on the floor at the mall. What do you do?'],
    ['الأمانة من صفات الأبطال.', 'Honesty is what heroes are made of.'],
    [
      ['أدّيها لبابا أو ماما أو الأمن', 'Give it to my parent or security', true],
      ['آخدها لنفسي', 'Keep it for myself', false, 'صاحبها زعلان ودوّار عليها. دي مش بتاعتنا.', 'Its owner is worried and searching. It isn’t ours.'],
      ['أسيبها مكانها', 'Leave it there', false, 'ممكن حد تاني ياخدها. الأحسن تساعد صاحبها يلاقيها.', 'Someone else might take it. Better to help the owner get it back.'],
    ]),
  sc('o6', 'outside', '🐱🪨😿',
    ['قطة جعانة في الشارع وفيه عيال بيحدفوها بالطوب. تعمل إيه؟', 'A hungry street cat, and some kids are throwing stones at it. What do you do?'],
    ['الرحمة بالحيوان من أخلاق الأبطال.', 'Being kind to animals is what heroes do.'],
    [
      ['أقولهم بطّلوا، وأطلب من كبير يدّيها أكل ومية', 'Tell them to stop and ask an adult to give it food and water', true],
      ['أحدف معاهم', 'Throw stones too', false, 'القطة بتحس بالوجع زينا بالظبط.', 'The cat feels pain just like us.'],
      ['أتفرّج بس', 'Just watch', false, 'القطة مش قادرة تدافع عن نفسها. أنت تقدر تساعدها.', 'The cat can’t defend itself, but you can help it.'],
    ]),

  // ───────────── Online safety ─────────────
  sc('n1', 'online', '🎮💬❓',
    ['في لعبة أونلاين، حد مش تعرفه سألك: ساكن فين؟ ومدرستك إيه؟ تعمل إيه؟', 'In an online game, a stranger asks: where do you live? Which school? What do you do?'],
    ['المعلومات دي سر، وماما وبابا لازم يعرفوا.', 'That information is private, and your parents must know.'],
    [
      ['ماردّش وأقول لماما أو بابا', 'Don’t answer and tell Mum or Dad', true],
      ['أقوله العنوان', 'Tell him my address', false, 'الغريب على النت ممكن يكون مش اللي بيقوله. عنوانك سر.', 'Strangers online may not be who they say. Your address is private.'],
      ['أبعتله صورتي', 'Send him my photo', false, 'صورك ماتتبعتش لحد مانعرفوش أبدًا.', 'Never send your photos to someone you don’t know.'],
    ]),
  sc('n2', 'online', '📸😂👥',
    ['في جروب الفصل، حد نزّل صورة لصاحبكم عشان يتريقوا عليه. تعمل إيه؟', 'In the class group chat, someone posts a photo of a friend to make fun of him. What do you do?'],
    ['التنمّر على النت تنمّر بالظبط، وأنت وقفته.', 'Online bullying is still bullying, and you stopped it.'],
    [
      ['ماشيّرهاش، وأقولهم امسحوها، وأقول لكبير', 'Don’t share it, ask them to delete it and tell an adult', true],
      ['أشيّرها لصحابي', 'Share it with my friends', false, 'كل شير بيزوّد الإحراج والوجع على صاحبك.', 'Every share adds more embarrassment and hurt.'],
      ['أبعت إيموجي ضحك 😂', 'Send a laughing emoji 😂', false, 'الإيموجي بيشجّع التريقة حتى لو مكتبتش كلام.', 'Even an emoji cheers on the mocking.'],
    ]),
  sc('n3', 'online', '🎁📲⚠️',
    ['ظهرتلك رسالة: "كسبت آيفون مجانًا! دوس هنا". تعمل إيه؟', 'A pop-up says: "You won a free iPhone! Click here." What do you do?'],
    ['الرسايل دي غالبًا نصب. شطور إنك سألت.', 'Messages like that are usually scams. Smart of you to ask.'],
    [
      ['مادوسش، وأوري ماما أو بابا', 'Don’t click; show Mum or Dad', true],
      ['أدوس بسرعة', 'Click quickly', false, 'اللينكات دي ممكن تسرق بيانات الموبايل.', 'Those links can steal what’s on the phone.'],
      ['أكتب رقم موبايل ماما', 'Type in Mum’s phone number', false, 'أرقامنا سر، ومحدش يكتبها من غير إذن.', 'Our numbers are private. Never type them without permission.'],
    ]),
  sc('n4', 'online', '💬😡🛡️',
    ['حد بيبعتلك رسايل وحشة في لعبة. تعمل إيه؟', 'Someone keeps sending you mean messages in a game. What do you do?'],
    ['اعمل بلوك ومتردّش، واحكي لكبير.', 'Block, don’t reply, and tell an adult.'],
    [
      ['أعمله بلوك ومارد عليهوش وأقول لبابا أو ماما', 'Block him, don’t reply, and tell my parents', true],
      ['أرد عليه بشتيمة', 'Reply with insults', false, 'الرد بالشتيمة بيكبّر المشكلة وبيخليك زيه.', 'Insulting back makes it worse and makes you like him.'],
      ['أخبّي الموضوع عن الكل', 'Hide it from everyone', false, 'مش لازم تستحمل لوحدك. احكي.', 'You don’t have to deal with it alone. Tell someone.'],
    ]),
  sc('n5', 'online', '🤫👤💻',
    ['"صاحب" جديد على النت بيقولك: خلّي كلامنا سر بينا وماتقولش لماما وبابا. تعمل إيه؟', 'A new online "friend" says: keep our chats a secret from your parents. What do you do?'],
    ['مفيش أسرار مع الغرباء. أي حد يطلب كده خطر.', 'No secrets with strangers. Anyone who asks that is dangerous.'],
    [
      ['أحكي لماما وبابا على طول', 'Tell my parents straight away', true],
      ['أحافظ على السر', 'Keep the secret', false, 'اللي بيطلب منك تخبّي عن أهلك مش صاحب حقيقي.', 'Someone who asks you to hide things from your family is not a real friend.'],
      ['أوافق أقابله', 'Agree to meet him', false, 'أبدًا مانقابلش حد من النت. ده خطر جدًا.', 'Never meet someone from the internet. It is very dangerous.'],
    ]),
  sc('n6', 'online', '🪙📱👨',
    ['عايز تشتري كوينز في لعبة من موبايل بابا. تعمل إيه؟', 'You want to buy game coins using Dad’s phone. What do you do?'],
    ['الاستئذان احترام وأمانة.', 'Asking first shows respect and honesty.'],
    [
      ['أستأذن بابا الأول', 'Ask Dad first', true],
      ['أشتري من غير ما أقول', 'Buy without telling him', false, 'دي فلوس بابا، والشرا من غير إذن غلط.', 'That’s Dad’s money. Buying without permission is wrong.'],
      ['آخد الباسورد في السر', 'Take the password secretly', false, 'الباسورد سر صاحبه. أخده من غير إذن زي السرقة.', 'A password belongs to its owner. Taking it is like stealing.'],
    ]),
];

export const scenariosOf = (world: WorldId) => SCENARIOS.filter((s) => s.world === world);
export const scenarioById = (id: string) => SCENARIOS.find((s) => s.id === id);
export const worldById = (id: string) => WORLDS.find((w) => w.id === id);
