// PROLOGUE "The Last Ferry" and CHAPTER 1 "Stranded" — algebra: surds, indices, quadratics, the discriminant, inequalities.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS = window.SCRIPTS || {};
  const P = window.STORY_PROBLEMS = window.STORY_PROBLEMS || {};

  // ───────────────────────── problems ─────────────────────────
  P.gangplank = {
    id: 'gangplank', topic: 'indices', title: 'The Gangplank', giver: 'gull',
    context: 'We\'re 4 metres out from the jetty, and the deck\'s 2 metres lower than it. Mira cut my planks to exact lengths. How long a plank do I need — exactly?',
    diagram: '<svg class="graph" viewBox="0 0 280 150" width="280" height="150"><rect width="280" height="150" fill="#fffdf6"/><rect x="200" y="20" width="70" height="14" fill="#8a6038"/><text x="208" y="16" font-size="11" fill="#3a3550">jetty</text><rect x="10" y="110" width="80" height="14" fill="#b08a5a"/><text x="18" y="140" font-size="11" fill="#3a3550">ferry deck</text><line x1="90" y1="110" x2="200" y2="34" stroke="#c0403a" stroke-width="3"/><line x1="90" y1="110" x2="200" y2="110" stroke="#3a3550" stroke-dasharray="4 3"/><line x1="200" y1="110" x2="200" y2="34" stroke="#3a3550" stroke-dasharray="4 3"/><text x="135" y="125" font-size="12" fill="#3a3550">4 m</text><text x="206" y="78" font-size="12" fill="#3a3550">2 m</text><text x="120" y="64" font-size="12" fill="#c0403a">plank?</text></svg>',
    prompt: R`The plank is the hypotenuse of a right-angled triangle with legs $4$ m and $2$ m. Find its exact length in simplest surd form, and decide whether Gull's $4.5$ m plank is long enough.`,
    done: 'The plank needs to be $2\\sqrt5 \\approx 4.47$ m. The 4.5 m plank reaches with 3 cm to spare.',
    steps: [
      { ask: R`By Pythagoras, plank$^2 = 4^2 + 2^2$. So the plank is $\sqrt{n}$ metres. What is $n$?`, type: 'num', answer: 20,
        hint: R`$4^2 + 2^2 = 16 + 4$`, explain: R`$\text{plank}^2 = 16 + 4 = 20$, so the plank is $\sqrt{20}$ m.`,
        rook: 'Hypotenuse squared equals the other two squared. Pythagoras. Older than me. Only just.' },
      { ask: R`Simplify $\sqrt{20}$ into the form $a\sqrt{b}$. (Type it like 2√5 or 2sqrt5.)`, type: 'num', exact: true, answer: '2sqrt5',
        hint: R`Find the biggest square number that goes into 20. $\sqrt{20} = \sqrt{4 \times 5}$.`, explain: R`$\sqrt{20} = \sqrt4 \times \sqrt5 = 2\sqrt5$`,
        rook: 'Exactly. Pull out the square factor. Mira called that "letting the root breathe".' },
      { ask: R`Gull's plank is $4.5$ m. Write $2\sqrt5$ as a decimal (3 s.f.).`, type: 'num', answer: '2sqrt5', sf: 3,
        hint: 'Use your calculator for √5, then double it.', explain: R`$2\sqrt5 = 4.47$ m (3 s.f.)` },
      { ask: 'Will the 4.5 m plank reach?', type: 'choice', choices: ['Yes — 4.5 > 4.47, with about 3 cm to spare.', 'No — it\'s too short.', 'Only if we round 4.47 up to 5.', 'Can\'t tell without a calculator.'], answer: 0,
        hint: R`Compare $4.5$ with $4.47$.`, explain: R`$4.5 > 2\sqrt5 \approx 4.47$, so yes, with about $3$ cm to spare.`,
        rook: 'And THAT is why you keep it exact until the end. Round too early and you\'d never know it was this close.' },
    ],
  };

  P.fen = {
    id: 'fen', topic: 'quadratics', title: 'The Price of Bread', giver: 'fen',
    context: 'Mira worked out that my daily profit is $P = -20x^2 + 200x - 300$ pounds when I charge £$x$ a loaf. What should I charge? And what\'s the lowest price that doesn\'t lose me money?',
    diagram: Graph.svg({ w: 300, h: 190, x: [0, 10], y: [-320, 260], xstep: 1, ystep: 100, fns: [{ f: '-20x^2+200x-300', color: '#c0403a', label: 'profit P' }], labels: { x: 'price £x', y: 'P' } }),
    prompt: R`Write $P = -20x^2 + 200x - 300$ in the form $-20(x - a)^2 + b$. Hence find the best price and maximum profit, then find the range of prices for which $P > 0$.`,
    done: 'Best price £5 (profit £200 a day). Any price between $5 - \\sqrt{10} \\approx$ £1.84 and $5 + \\sqrt{10} \\approx$ £8.16 makes a profit.',
    steps: [
      { ask: R`Factor out $-20$ from the $x$ terms: $-20(x^2 - 10x) - 300$. Completing the square, $x^2 - 10x = (x - a)^2 - a^2$. Find $a$.`, type: 'num', answer: 5,
        hint: R`Halve the coefficient of $x$: $-10 \div 2$.`, explain: R`$x^2 - 10x = (x - 5)^2 - 25$, so $a = 5$.` },
      { ask: R`So $P = -20\left[(x-5)^2 - 25\right] - 300 = -20(x-5)^2 + b$. Find $b$.`, type: 'num', answer: 200,
        hint: R`$-20 \times (-25) - 300$`, explain: R`$+500 - 300 = 200$, so $P = -20(x-5)^2 + 200$.`,
        rook: 'Careful with that minus. −20 times −25 is PLUS 500. That\'s where most people fall in.' },
      { ask: 'What price gives the maximum profit, and what is it? Give (price, profit).', type: 'point', answer: [5, 200],
        hint: R`$-20(x-5)^2$ is never positive. It's biggest (zero) when $x = 5$.`, explain: R`Maximum at $x = 5$: £5 a loaf gives £200 profit a day.` },
      { ask: R`She breaks even when $P = 0$: $(x-5)^2 = 10$. Find the LOWER break-even price exactly, in the form $a - \sqrt b$.`, type: 'num', exact: true, answer: '5-sqrt10',
        hint: R`$x - 5 = \pm\sqrt{10}$. Which sign gives the lower price?`, explain: R`$x = 5 \pm \sqrt{10}$. The lower one is $5 - \sqrt{10} \approx 1.84$.` },
      { ask: R`For which prices is she in profit ($P > 0$)?`, type: 'choice', choices: [R`$5 - \sqrt{10} < x < 5 + \sqrt{10}$`, R`$x < 5 - \sqrt{10}$ or $x > 5 + \sqrt{10}$`, R`$x > 5$`, R`$x < 5 + \sqrt{10}$`], answer: 0,
        hint: 'The curve is ∩-shaped. Where is it above the axis?', explain: R`∩-shaped, so positive <b>between</b> the roots: $5 - \sqrt{10} < x < 5 + \sqrt{10}$, roughly £1.84 to £8.16.`,
        rook: 'Look at the graph. The hill is above zero between the two roots. That\'s her safe zone.' },
    ],
  };

  P.wick = {
    id: 'wick', topic: 'indices', title: "Wick's Lantern Lens", giver: 'wick', source: 'OCR H230/01 June 2018 Q1',
    context: 'Mira left me the lantern figures. Brightness rating: three to the seven-halves — the glazier wants it as a whole number times a root. And the lens\'s focal factor: root two over one-minus-root-two. She said it would come out negative. A diverging lens, spreads the light wide.',
    prompt: R`(i) Express $3^{\frac72}$ in the form $a\sqrt{b}$, where $a$ is an integer and $b$ is prime. (ii) Express $\dfrac{\sqrt2}{1 - \sqrt2}$ in the form $c + d\sqrt e$, where $c$, $d$ are integers and $e$ is prime.`,
    done: 'Brightness $27\\sqrt3$; focal factor $-2 - \\sqrt2$ — negative, just like Mira said.',
    steps: window.PAPER_Q['o18-1i'].steps.concat(window.PAPER_Q['o18-1ii'].steps),
  };

  P.rope = {
    id: 'rope', topic: 'quadratics', title: "Moss's Rope", giver: 'moss',
    context: 'Mira measured the arch: it\'s $y = -0.5x^2 + 3x - 2.5$. My rope goes in a straight line $y = 0.5x + c$, where $c$ is how high I tie it on my post. I tied it at $c = 0.5$ and it snagged on the arch.',
    diagram: Graph.svg({ w: 300, h: 190, x: [0, 6], y: [-1, 4], xstep: 1, ystep: 1, fns: [{ f: '-0.5x^2+3x-2.5', color: '#6a6a76', label: 'arch' }, { f: '0.5x+0.5', color: '#c0403a', label: 'rope, c = 0.5', dash: true }], labels: { x: 'x (m)', y: 'height' } }),
    prompt: R`Find the value of $c$ for which the rope just touches the arch (is a tangent to it). Hence decide how high Moss must tie the rope.`,
    done: 'The rope just touches when $c = \\tfrac58$. Tie it higher than 0.625 m and it clears the arch completely.',
    steps: [
      { ask: R`Where they meet: $-0.5x^2 + 3x - 2.5 = 0.5x + c$. Multiply by $-2$ and rearrange. Which equation do you get?`, type: 'choice',
        choices: [R`$x^2 - 5x + 5 + 2c = 0$`, R`$x^2 - 5x + 5 - 2c = 0$`, R`$x^2 + 5x - 5 + 2c = 0$`, R`$-0.5x^2 + 2.5x = c$`], answer: 0,
        hint: R`First: $-0.5x^2 + 2.5x - 2.5 - c = 0$. Then multiply every term by $-2$.`, explain: R`$-0.5x^2 + 2.5x - 2.5 - c = 0 \Rightarrow x^2 - 5x + 5 + 2c = 0$` },
      { ask: 'The rope just TOUCHES the arch (one meeting point). So the discriminant is...', type: 'choice', choices: ['= 0', '> 0', '< 0', '= 1'], answer: 0,
        hint: 'One repeated root.', explain: R`Tangent $\iff$ one repeated root $\iff b^2 - 4ac = 0$.`,
        rook: 'Two roots: it cuts through. One root: it touches. No roots: it misses. Remember that and half of A level is easier.' },
      { ask: R`Write $b^2 - 4ac$ for $x^2 - 5x + (5 + 2c) = 0$, in terms of $c$.`, type: 'expr', vars: ['c'], answer: '25-4(5+2c)',
        hint: R`$a = 1$, $b = -5$, and the constant term is $(5 + 2c)$.`, explain: R`$(-5)^2 - 4(5 + 2c) = 25 - 20 - 8c = 5 - 8c$` },
      { ask: R`Solve $5 - 8c = 0$.`, type: 'num', answer: '5/8',
        hint: R`$8c = 5$`, explain: R`$c = \tfrac58 = 0.625$` },
      { ask: R`Moss tied it at $c = 0.5$. What happened, and what should he do?`, type: 'choice',
        choices: [R`$0.5 < 0.625$: discriminant $> 0$, two intersections — the rope cuts into the arch. Tie it higher than $0.625$ m.`,
          R`$0.5 < 0.625$: no intersections — it should have cleared.`,
          R`He should tie it lower, below $0.5$ m.`, R`The rope is fine; the arch moved.`], answer: 0,
        hint: R`Try $c = 0.5$ in $5 - 8c$. Is it positive or negative?`, explain: R`$c = 0.5$: $5 - 8(0.5) = 1 > 0$, so two intersections — it snags. Any $c > 0.625$ gives a negative discriminant: no contact.`,
        rook: 'There. The graph agrees: the dashed rope dips into the arch. Lift it past 0.625 and it floats clear.' },
    ],
  };

  P.tomas = {
    id: 'tomas', topic: 'graphs', title: "Tomas's Apples", giver: 'tomas', source: 'OCR H230/01 June 2018 Q2(ii)',
    context: 'Mira said my profit, in hundreds of pounds, is $6 + x - x^2$ when I order $x$ hundred apples. For which orders do I make any profit at all?',
    diagram: Graph.svg({ w: 280, h: 170, x: [-3, 4], y: [-4, 7], xstep: 1, ystep: 2, fns: [{ f: '6+x-x^2', color: '#2a9d6a', label: 'profit' }] }),
    prompt: R`Solve the inequality $6 + x - x^2 > 0$. What does this mean for Tomas?`,
    done: '$-2 < x < 3$. He can\'t order a negative number of apples, so any order under 300 apples makes a profit.',
    steps: window.PAPER_Q['o18-2ii'].steps.concat([
      { ask: 'Which orders actually make sense for Tomas?', type: 'choice', choices: [R`$0 < x < 3$: up to (not including) 300 apples`, R`$-2 < x < 3$`, R`$x > 3$`, R`Any order`], answer: 0,
        hint: 'Can he order −100 apples?', explain: R`In context $x \ge 0$, so $0 < x < 3$: fewer than 300 apples.`,
        rook: 'Always ask whether an answer makes sense in the real world. Negative apples do not.' },
    ]),
  };

  P.kidcode = {
    id: 'kidcode', topic: 'indices', title: "Mira's Strongbox Code", giver: 'kid',
    context: 'Mira told me the code for her old strongbox is the answer to $4^{x+1} = 8^x$. I\'ve been trying for WEEKS.',
    prompt: R`Solve $4^{x+1} = 8^x$.`,
    done: '$x = 2$. Possibly the least secure combination in history.',
    steps: window.QUESTIONS.find(q => q.id === 'sh-5').steps,
  };

  P.blueprint = {
    id: 'blueprint', topic: 'quadratics', title: 'Bridge No. 1 — the Blueprint', giver: null,
    context: 'Mira\'s original design: the bridge deck\'s height above the normal river level is $y = 0.02x^2 - 1.2x + 20$ metres, at $x$ metres from the west bank. On the night of the storm, the river rose by $2.5$ m.',
    diagram: Graph.svg({ w: 300, h: 190, x: [0, 60], y: [-1, 21], xstep: 10, ystep: 5, fns: [{ f: '0.02x^2-1.2x+20', color: '#8a6038', label: 'deck' }], hlines: [{ y: 0, label: 'normal river', color: '#3f6fb0' }, { y: 2.5, label: 'storm flood', color: '#c0403a' }], labels: { x: 'x (m)', y: 'height (m)' } }),
    prompt: R`Find the lowest point of the deck. Explain why the bridge fell, and find the smallest constant $c$ so that a new deck $y = 0.02x^2 - 1.2x + c$ stays at least $4$ m above the river.`,
    steps: [
      { ask: R`Complete the square: $0.02x^2 - 1.2x + 20 = 0.02(x - p)^2 + q$. Find $p$.`, type: 'num', answer: 30,
        hint: R`Factor out $0.02$: $0.02(x^2 - 60x) + 20$. Halve the 60.`, explain: R`$0.02(x^2 - 60x) + 20 = 0.02(x - 30)^2 - 18 + 20$, so $p = 30$.`,
        react: [['enemy', '...thirty. The middle of the span. Mira put the lowest point in the middle.'], ['rook', 'Keep going. He\'s listening.']] },
      { ask: R`Find $q$, the height of the lowest point above the normal river.`, type: 'num', answer: 2,
        hint: R`$0.02 \times 30^2 = 18$. So $q = 20 - 18$.`, explain: R`$q = 20 - 18 = 2$: the lowest point is $2$ m above the normal river.`,
        react: [['enemy', 'Two metres above the river. That was PLENTY. The river NEVER came up two metres.']] },
      { ask: 'The storm raised the river by 2.5 m. What happened to the deck?', type: 'choice',
        choices: ['The middle of the deck was 0.5 m underwater — the flood pushed it off its supports.', 'Nothing — 2 m is enough.', 'The deck was 2.5 m above the flood.', 'The numbers were wrong.'], answer: 0,
        hint: 'Compare 2 m with 2.5 m.', explain: R`$2 - 2.5 = -0.5$: the lowest part of the deck was half a metre <b>under</b> the flood.`,
        react: [['enemy', '...the storm. The river rose two and a half metres that night.'], ['enemy', 'The deck was under the water. It didn\'t fall because the numbers lied.'], ['enemy', 'It fell because we never asked: what if the river rises?']] },
      { ask: R`New deck: $y = 0.02(x - 30)^2 + (c - 18)$. For the lowest point to be at least $4$ m up, find the smallest $c$.`, type: 'num', answer: 22,
        hint: R`Lowest point $= c - 18$. Solve $c - 18 \ge 4$.`, explain: R`$c - 18 \ge 4 \Rightarrow c \ge 22$. With $c = 22$ the deck never comes within 4 m of the normal river — 1.5 m clear of a storm like that one.`,
        react: [['enemy', 'Twenty-two. Lowest point four metres up. Even THAT storm wouldn\'t touch it.'], ['rook', 'That\'s the thing about working, Bramble. When it\'s wrong, you can see WHERE it\'s wrong. And then you fix it.']] },
    ],
  };

  window.ENCOUNTERS = window.ENCOUNTERS || {};
  window.ENCOUNTERS.bramble = {
    name: 'Bramble', sprite: 'bramble', scale: 7, atk: 3,
    intro: '* Bramble blocks the way across the gorge. The ground shakes when he breathes.',
    check: '* BRAMBLE — ATK 4 DEF 99. Built Bridge No. 1 with Mira. Hasn\'t slept since it fell. Believes numbers lie.',
    flavor: ['* Bramble glares at the broken bridge.', '* Bramble cracks his knuckles. One of them sounds like a tree falling.', '* The wind smells of river and wet stone.', '* Somewhere below, the gorge river roars.'],
    fightLine: 'You can\'t punch a troll out of grief, {name}. Show him the WORKING.',
    talk: [
      [['enemy', 'GO. AWAY.'], ['rook', 'He built this bridge with Mira. He was standing on it when it fell.']],
      [['enemy', 'Every night I see it fall. Every night.'], ['text', '* Bramble\'s fists unclench, just slightly.']],
      [['enemy', 'Mira said the numbers were right. The numbers LIED.'], ['rook', 'Numbers don\'t lie. People forget to ask them the right question.']],
      [['enemy', '...'], ['text', '* Bramble is listening, even if he won\'t admit it.']],
    ],
    taunts: ['NO. MORE. BRIDGES.', 'Numbers LIE!', '...too low?', 'Why didn\'t we SEE it?'],
    angry: ['GET OFF MY GORGE!', 'YOU SOUND JUST LIKE HER!', 'STOP SHOWING ME!', 'I SAID STOP!'],
    attacks: [
      { pattern: 'rain', bullets: ['ROCK', 'PLANK', 'NO'], speed: 55, every: 420 },
      { pattern: 'sweep', bullets: ['NUMBERS LIE', 'GO AWAY'], speed: 60, every: 450 },
      { pattern: 'arc', bullets: ['TOO LOW', '2 m', 'FLOOD'], speed: 55, every: 380 },
      { pattern: 'spiral', bullets: ['WHY', 'WHY', 'WHY'], speed: 55, every: 260 },
    ],
    spareHint: '* Bramble lowers his fists. He isn\'t angry any more. (Bramble can be SPARED.)',
    problem: P.blueprint,
  };

  // ───────────────────────── prologue ─────────────────────────
  SC.prologueNarration = G => G.narrate([
    'April. The Easter holidays.',
    'Your OCR AS Maths exam is a few weeks away. Your textbook is in your bag. You haven\'t opened it since February.',
    '"Two weeks with Aunt Fen," your mum said. "Sea air. No phone signal. You\'ll come back a new person."',
    'The last ferry of the day crawls down the river Wend towards Lowmarsh.',
    'You don\'t know it yet, but somewhere in the fog ahead, a crow is waiting for you.',
  ]);

  SC.prologue = async G => {
    await G.wait(500);
    G.shake();
    await G.narr('* The ferry shudders. Then, with a long wooden groan, it stops.');
    await G.say('gull', 'Blast and barnacles. We\'ve run aground on the sandbar.', 'Tide\'s dropped faster than I reckoned. The jetty\'s RIGHT there and we can\'t reach it.');
    await G.narr('* A large black crow lands on the rail beside you. It looks you up and down.');
    await G.say('rook', '...Well. You took your time.');
    let c = await G.choose(['(Did that crow just talk?)', '(Say nothing. Crows don\'t talk.)']);
    if (c === 0) await G.say('rook', 'Yes. Rook. Delighted, I\'m sure.');
    else await G.say('rook', 'Strong, silent type. I respect it. Wrong, though — crows talk all the time. Name\'s Rook.');
    await G.say('rook', 'And before you ask: no, the captain can\'t hear me. Hardly anyone can, these days.', 'You\'re Fen\'s {name}, aren\'t you? The one with the maths book. She\'s told the whole village. Twice.');
    c = await G.choose(['"I\'m not really a maths person."', '"How do you know Aunt Fen?"']);
    if (c === 0) await G.say('rook', 'Hm. That\'s exactly the sort of thing the fog likes to hear. I\'d keep it to yourself round here.');
    else await G.say('rook', 'Everybody knows Fen. She bakes, she worries, she feeds stray crows. Usually in that order.');
    await G.say('rook', 'Right. Gull\'s stuck because she\'s lost the working. Everyone in Lowmarsh has, since the fog came.', 'Go and ask her what she needs. I\'ll be on your shoulder. Metaphorically. You\'re too bony.');
    G.set('rook'); G.refresh();
    G.hud();
  };

  SC.rookFirst = G => SC.prologue(G);

  SC.gull = async G => {
    if (!G.flag('plank')) {
      await G.say('gull', 'We\'re four metres out from the jetty, and our deck\'s two metres lower than it.',
        'I\'ve got planks. Exact lengths, cut by Mira back in the day. "Cut it exact or don\'t cut it at all," she always said.',
        'But how long does it NEED to be? I KNOW I used to know this. Every time I try, it\'s like... fog. Right in my head.');
      if (!G.flag('rookFogTalk')) {
        G.set('rookFogTalk');
        await G.say('rook', 'That\'s the Fog, all right. Grown-ups keep the answers they were told, but lose the reasons. And without the reasons they can\'t do anything new.',
          'You, on the other hand, are still learning. Still asking why. The fog doesn\'t stick to people like that. Not much, anyway.');
      }
      const c = await G.choose(['I\'ll give it a go.', 'Rook, can\'t you just do it?']);
      if (c === 1) await G.say('rook', 'I know HOW. I watched Mira do this for eleven years. But I\'ve got no thumbs, and numbers go slippery when I panic.', 'You write. I\'ll talk. That\'s the deal.');
      await G.solve(P.gangplank);
      await G.say('gull', 'Two root five... four point four seven. And this plank\'s four and a half. Ha! Three centimetres to spare!');
      await G.narr('* Gull slides the plank across the gap. It lands on the jetty with a satisfying clunk.');
      G.set('plank'); G.refresh();
      await G.say('gull', 'I\'ll be stuck here till the spring tide floats us off. Go on. Your aunt\'ll be fretting herself into a soufflé.');
      await G.say('rook', 'Not bad. Mira would\'ve said "show your working" about forty times by now. But not bad.');
      const c2 = await G.choose(['"Who\'s Mira?"', '"Thanks... I think?"']);
      if (c2 === 0) await G.say('rook', '...Later. Fen\'s waiting, and her bread is definitely burning.');
      else await G.say('rook', 'You\'re welcome. Now, the jetty. Fen\'s waiting.');
      G.hud();
      return;
    }
    const lines = [
      ['Mind how you go. That fog\'s thicker on land.'],
      ['I\'ve sailed this river thirty years. Never seen a fog that stays put like this one. It\'s like it\'s waiting for something.'],
      ['When the lighthouse was lit, I could run the river at night. Now it\'s daylight or nothing.'],
    ];
    await G.say('gull', ...lines[Math.floor(Math.random() * lines.length)]);
    if (G.flag('lightOn')) await G.say('gull', 'And — is that the Gull Point light? Burning again? Well, I\'ll be. I can run the night tide again!');
  };

  SC.arriveVillage = async G => {
    G.set('arrived'); G.set('chapter', 1);
    await G.narr('* The fog is thicker on land. Street lamps glow weakly along the path.');
    await G.say('rook', 'Welcome to Lowmarsh. Population: two hundred and six. Population that can still do maths: zero.',
      'Since the Great Storm last autumn, the bridge to the outside world fell down, the lighthouse at Gull Point went dark, the lock upriver jammed, and this fog rolled in and sat on everyone\'s brains.',
      'And Mira — Mira Hale, the town surveyor — walked out into it the night of the storm. She hasn\'t come back.',
      'I lived in her workshop. She did the sums. I supervised.');
    const c = await G.choose(['"I\'m sorry."', '"Why hasn\'t anyone gone looking for her?"']);
    if (c === 0) await G.say('rook', '...Yeah. Me too.');
    else await G.say('rook', 'They did. They couldn\'t work out where to look. Couldn\'t work out anything. That\'s what the fog does.');
    await G.say('rook', 'The Mayor will want to make a speech at you. He\'s in the square, straight up the path. Let\'s get it over with.');
    await G.card('CHAPTER 1', 'STRANDED');
    G.hud(); G.save();
  };

  // ───────────────────────── chapter 1: the village ─────────────────────────
  SC.mayor = async G => {
    if (!G.flag('metMayor')) {
      await G.say('mayor', 'A visitor! Through the fog! On the last ferry! Splendid. Pennywhistle. Mayor Pennywhistle. Ahem.',
        'You find Lowmarsh in, ah, a period of difficulty. The bridge is down. The lighthouse is dark. Supplies only come on Gull\'s ferry, and she can\'t sail at night.',
        'The council has decided that the bridge must be rebuilt! The council is me. I have decided.',
        'Only... old Bramble the troll won\'t let anyone near the gorge. And nobody can remember how bridges are, er... sum-ed.');
      await G.say('rook', 'He means "calculated".');
      const c = await G.ask('mayor', 'Your aunt tells me you study MATHEMATICS. Is it true?', ['"Yes. AS level."', '"Sort of. Badly."']);
      if (c === 0) await G.say('mayor', 'Marvellous! Marvellous.');
      else await G.say('mayor', 'Badly is infinitely better than not at all, young {name}. Infinitely! That\'s a maths word, you know.');
      const c2 = await G.ask('mayor', 'Will you help us? Rebuild the bridge, relight the lighthouse... perhaps even find out what became of Mira?', ['"I\'ll try."', '"I\'m only here for two weeks..."']);
      if (c2 === 1) await G.say('mayor', 'Then we shall have to be quick about it!');
      await G.say('mayor', 'First things first: a hero must be fed. Fen\'s bakery is just west of here — the one with the chimney.');
      G.set('metMayor'); G.hud();
      return;
    }
    if (G.flag('brambleSpared') && !G.flag('mayorCh2')) {
      G.set('mayorCh2');
      await G.say('mayor', 'You calmed BRAMBLE? With ALGEBRA? I shall have a statue made. Of the algebra.',
        'Timber by boat, steel from the lock... the boats won\'t come while Gull Point is dark. The east road is yours, {name}. Godspeed. Or whatever the mathematical equivalent is.');
      await G.say('rook', '"Q.E.D." Probably.');
      return;
    }
    const lines = G.flag('chapter') >= 3
      ? ['The archive is open, the records are in a frightful state. Pim will show you.']
      : ['The bridge, {name}! The bridge! And possibly also everything else.', 'I\'ve been practising my ribbon-cutting. For the bridge. Snip.', 'A mayor must lead from the front. I am leading from the... middle. Strategically.'];
    await G.say('mayor', lines[Math.floor(Math.random() * lines.length)]);
  };

  SC.fen = async G => {
    if (!G.flag('fenDone')) {
      await G.say('fen', '{name}! You made it! Oh, look at you, you\'re soaked, was it the fog, it\'s the fog, isn\'t it—',
        'Sit, sit. And Rook! You found my {name}. Good bird. Here, have a crust.');
      await G.narr('* Rook catches the crust and pretends he didn\'t want it.');
      await G.say('fen', 'Sorry about the mess, love. Ever since the bridge fell, flour costs twice as much, and I can\'t work out what to charge any more.',
        'Mira did it for me once. She said my daily profit is P equals minus twenty x squared, plus two hundred x, minus three hundred. When I charge x pounds a loaf.',
        'She wrote it out on a page of her notebook...', '...which I may have used to wedge the oven door shut.');
      await G.say('rook', 'Of COURSE you did.');
      await G.say('fen', 'Could you work it out? I don\'t want to rob anyone, but I can\'t keep losing money either.');
      await G.solve(P.fen);
      await G.say('fen', 'So anywhere between one pound eighty-four and eight pounds sixteen, I make a profit. And five pounds is the most I could make...', 'Five pounds for a loaf! In Lowmarsh! People are struggling, love.');
      const c = await G.choose(['"Charge £5. It\'s the maximum."', '"Charge less. You\'ll still be in profit."']);
      if (c === 0) await G.say('fen', 'Hmm. The maths says five is the most I can make. But it also says I can go lower and still be fine...');
      await G.say('fen', 'I\'ll charge three pounds fifty. Still in profit, and nobody goes hungry.');
      await G.say('rook', 'That\'s the bit people miss. The maths tells you what\'s possible. You still have to decide what\'s right.');
      await G.say('fen', 'Here — flapjacks, for the road. And take that soggy page out of my oven, it\'s no use to me.');
      G.give('flapjack', 3);
      await G.say('fen', 'Oh, and {name}... young Moss has been down at the stream every day trying to get across. Help him if you can, poor lamb.');
      G.set('fenDone'); G.hud();
      return;
    }
    const lines = [
      ['Three pounds fifty a loaf and the till\'s happy for the first time in months.'],
      ['Mira used to come in every morning for a cheese scone. I still bake one. Just in case.'],
      ['Eat something, love. You can\'t do sums on an empty stomach. That\'s science.'],
    ];
    await G.say('fen', ...lines[Math.floor(Math.random() * lines.length)]);
    if (!G.has('flapjack')) { await G.say('fen', 'Out of flapjacks already? Here.'); G.give('flapjack', 2); }
  };

  SC.ovenPage = async G => {
    if (!G.flag('fenDone')) return G.narr('* The oven door is wedged shut with a folded, floury page. Better ask Fen first.');
    await G.narr('* You ease the page out of the oven door. It\'s singed at the edges, but you can read Mira\'s neat handwriting.');
    G.page('quadratics'); G.set('pageQuadratics'); G.refresh();
    await G.say('rook', 'That\'s hers. "QUADRATICS — complete the square, then LOOK at it." She wrote that on everything.', 'Pages of her notebook are scattered all over town. Find them, and you\'ll have her notes on everything. Check them from the menu (C).');
  };

  SC.wick = async G => {
    if (!G.flag('wickDone')) {
      await G.say('wick', 'Evening. Or morning. Hard to tell, in this.', 'I light the lamps. Forty years I\'ve lit them. Every night they burn a little dimmer.',
        'Mira redesigned the lantern lenses, just before the storm. Left me the figures. Three to the power seven-halves, for the brightness. The glazier wants it as a whole number times a root.',
        'And the focal factor. Root two over one-minus-root-two. She said it\'d come out negative.', 'I look at it now and it\'s just... shapes.');
      const c = await G.choose(['"Let me have a look."', '"Maybe later."']);
      if (c === 1) return G.say('wick', 'The lamps will wait. They\'ve got nowhere to be.');
      await G.solve(P.wick);
      await G.say('wick', 'Twenty-seven root three. And minus two, minus root two. Negative! Just like she said. A diverging lens — spreads the light out wide.',
        'I\'ll take these to the glazier. Thank you, young {name}.');
      await G.say('wick', 'You know... I saw Mira, the night of the storm. Hurrying east along the cliff road, towards Gull Point.', 'Tripod over one shoulder. Lantern in the other hand. I called out. She didn\'t hear me. Or didn\'t stop.');
      await G.say('rook', '...Gull Point. The lighthouse.');
      G.page('indices');
      G.set('wickDone'); G.hud();
      return;
    }
    const lines = G.flag('lightOn')
      ? ['The new lenses are in. Look at that glow! Twenty-seven root three. I\'ll never forget it now.']
      : ['The glazier\'s cutting the new lenses. Twenty-seven root three, I told him. He looked at me like I\'d grown a second head.', 'If you go to Gull Point, mind the cliff path. It\'s narrow, and the fog lies about where the edge is.'];
    await G.say('wick', lines[Math.floor(Math.random() * lines.length)]);
  };

  SC.lamp = async G => G.narr(G.flag('wickDone') ? '* A street lamp. It burns a little brighter now.' : '* A street lamp. It flickers weakly in the fog, like it\'s trying to remember how.');

  SC.moss = async G => {
    if (!G.flag('ropeFixed')) {
      await G.say('moss', 'Don\'t talk to me. I\'m concentrating.', '...Okay, you can talk to me.',
        'I\'m trying to get a rope across to the far bank. Bramble\'s over there. He used to make me toys out of driftwood. Since the storm he won\'t come down from the gorge. I just want to take him some of Fen\'s scones.',
        'But every time I tie the rope it snags on the old stone arch. The arch is fenced off. It\'s cracked.',
        'Mira measured it all once. She said the arch is y = −0.5x² + 3x − 2.5, and my rope goes y = 0.5x + c, where c is how high I tie it on my post.', 'I tied it at half a metre. It snagged.');
      await G.say('rook', 'Ah. Line meets curve. Mira loved this one.');
      const c = await G.choose(['"Let\'s work out how high it needs to go."', '"Maybe later."']);
      if (c === 1) return G.say('moss', 'I\'ll be here. Concentrating.');
      await G.solve(P.rope);
      await G.say('moss', 'Higher than nought point six two five... so a whole metre is DEFINITELY safe!');
      await G.narr('* Moss scrambles up his post and reties the rope at a metre. It sails cleanly over the arch.', '* Together you lash a second rope beside it and lay planks across. It\'s wobbly. It\'s a crossing.');
      G.set('ropeFixed'); G.refresh();
      await G.say('moss', 'YES! Here — I found this in the river. It\'s an hourglass, but the sand falls slower than it should. Like, actually slower. You have it.');
      G.give('hourglass', 2);
      await G.say('moss', 'Will you tell Bramble I said hi? And that the scones are from me.');
      G.hud();
      return;
    }
    if (G.flag('brambleSpared')) return G.say('moss', 'Bramble came down! He sat on the bank and ate ALL the scones and then he cried a bit. Then he made me a boat. Best day ever.');
    await G.say('moss', 'The crossing\'s holding! Mind the third plank. It\'s more of a suggestion than a plank.');
  };

  SC.pots = async G => G.narr('* A flowerpot. Just soil and a very determined weed.');
  SC.flowerpot = async G => {
    if (G.has('key') || G.flag('workshopOpen')) return G.narr('* A flowerpot. You already took the key. The weed in it looks smug.');
    await G.narr('* The third flowerpot along. Underneath it — a brass key.');
    G.give('key');
    await G.say('rook', 'Third flowerpot. Every time. She could calculate the load on a suspension bridge, but she could NOT hide a key.');
  };

  SC.bench = async G => G.narr('* A bench. A small plaque reads: "For Mira, who never sat down."');
  SC.flowers = async G => G.narr('* Window boxes. The flowers are growing towards a sun they can\'t see.');
  SC.signGorge = async G => G.narr('* NORTH: The Gorge & Bridge No. 1. (The words "BRIDGE CLOSED" have been added in very angry chalk.)');
  SC.signEast = async G => G.narr('* EAST: The Cliff Road to Gull Point Lighthouse. Mind the edge.');
  SC.signWest = async G => G.narr('* WEST: The Meadows & Wend Lock. (A small sign underneath: "and the Marsh. Don\'t.")');
  SC.arch = async G => G.narr('* DANGER: ARCH UNSAFE. By order of the Council. (The Council is the Mayor.)');
  SC.crates = async G => G.narr('* Crates stamped "LOWMARSH — FRAGILE". One is labelled "SCONES — VERY FRAGILE".');
  SC.barrel = async G => G.narr('* A barrel. It smells of fish and old rope. Classic barrel.');
  SC.net = async G => G.narr('* A fishing net, drying. Someone has knotted it in a perfect grid. Coordinates, you think, without meaning to.');
  SC.duck = async G => G.narr(['* Quack.', '* The duck regards you with mild contempt.', '* The duck paddles in a perfect circle. Centre (a, b), radius: duck.'][Math.floor(Math.random() * 3)]);
  SC.cat = async G => { await G.narr('* A ginger cat. It looks at you as if you owe it money.'); await G.say('rook', 'That\'s Logarithm. He\'s the reason I don\'t nap on the windowsill any more. Don\'t trust him.'); };
  SC.kid1 = async G => {
    if (!G.flag('kidCode')) {
      await G.say('kid', 'Are you the maths person? Mira told me the code to her old strongbox is the answer to four to the x-plus-one equals eight to the x. I\'ve been trying for WEEKS.');
      const c = await G.choose(['"Let\'s crack it."', '"Not right now."']);
      if (c === 1) return;
      await G.solve(P.kidcode);
      await G.say('kid', 'TWO?! The code is TWO? That\'s the worst code in the history of codes!');
      await G.say('rook', 'She did say it was "for practice".');
      G.set('kidCode');
      return;
    }
    await G.say('kid', 'I opened the box. It had a note inside that said "Show your working." That\'s IT. That\'s the treasure.');
  };
  SC.kid2 = async G => G.say('kid', ['My teacher says the fog is "just weather". Weather doesn\'t make grown-ups forget how to tell the time.', 'I\'m practising my times tables so the fog can\'t get me. Seven eights are fifty-six. See? Still got it.'][Math.floor(Math.random() * 2)]);
  SC.villager2 = async G => G.say('villager', ['I used to know my times tables. Now I just know that seven eights are fifty-six. I don\'t know WHY.', 'My husband tried to put up a shelf yesterday. It\'s now a slope. He measured it "by feel".', 'Is it true you can do algebra? Out loud? In public?'][Math.floor(Math.random() * 3)]);
  SC.stall = async G => {
    if (!G.flag('tomasDone')) {
      await G.say('tomas', 'Apples! Well — I would sell apples, if I could work out whether it\'s worth it.', 'Mira said my profit, in hundreds of pounds, is six plus x minus x squared, when I order x hundred apples. For which orders do I make a profit at all?');
      const c = await G.choose(['"Let\'s solve it."', '"Not now."']);
      if (c === 1) return;
      await G.solve(P.tomas);
      await G.say('tomas', 'Under three hundred apples and I\'m in profit. And you can\'t order minus two hundred apples, ha! Brilliant. Here, have something for the road.');
      G.give('flapjack', 1);
      G.set('tomasDone');
      return;
    }
    await G.say('tomas', 'Two hundred apples ordered. Profit! Mira\'s numbers, your working. Lovely.');
  };
  SC.stall2 = async G => G.say('tomas', 'That stall\'s my sister\'s. She sells rope, string and "assorted knots". Business has been good since you fixed Moss\'s crossing.');

  SC.board = async G => {
    await G.narr('* THE LOWMARSH LEDGER — notice board.', '* "LOST: one surveyor. Answers to Mira. Reward: our everlasting gratitude."', '* "Evening classes CANCELLED due to fog (and nobody remembering what they were about)."', '* "THE DAILY DIVE: how deep can you go down the old well? Seven puzzles a day."');
    const c = await G.choose(['Take the Daily Dive', 'Practise a topic (Drills)', 'Try a past paper', 'Leave']);
    if (c === 3) return;
    await new Promise(res => [Game.daily, Game.drills, Game.papers][c](res));
  };

  SC.workshopDoor = async G => {};
  SC.mossDoor = async G => G.narr('* Moss\'s house. Someone inside is singing about turnips.');
  SC.cottageDoor = async G => G.narr('* A cottage. A note on the door: "GONE TO BED UNTIL THE FOG LIFTS."');

  // Mira's workshop
  SC.miraDesk = async G => {
    if (!G.flag('workshopSeen')) {
      G.set('workshopSeen');
      await G.narr('* Mira\'s desk. Everything is exactly where she left it, under a thin coat of dust.');
      await G.say('rook', '...It still smells like her pencil shavings.');
    }
    if (!G.flag('blueprint')) {
      await G.narr('* Her notebook lies open. Most of its pages have been removed — not torn. Carefully taken out.');
      await G.say('rook', 'She took pages with her the night of the storm. And she\'d been leaving notes all over town for weeks before that. Like she knew something was coming.');
      await G.narr('* Under the notebook: a rolled-up blueprint. "BRIDGE No. 1 — M. Hale & Bramble."');
      G.give('blueprint'); G.set('blueprint');
      G.page('graphs');
      await G.say('rook', 'The original bridge design. If anything will make Bramble listen, it\'s this.');
      G.hud();
      return;
    }
    await G.narr('* The notebook\'s first page, in Mira\'s handwriting: "SHOW YOUR WORKING. If you\'re wrong, it shows you where. If you\'re right, it shows you why."');
  };
  SC.photo = async G => {
    await G.narr('* A photo: Mira and an enormous troll, both covered in mud, both grinning, each holding one end of a bridge cable.', '* On the back: "Bridge No. 1. B. did the lifting. I did the sums. We both did the shouting."');
    await G.say('rook', 'Bramble. Mira\'s oldest friend. He\'s guarded the ruins since the storm. Won\'t let anyone near.');
  };
  SC.theodoliteStand = async G => {
    await G.narr('* An empty tripod. Something is missing from the top of it.');
    await G.say('rook', 'Her theodolite. For measuring angles. She took it with her that night.');
  };

  // the gorge
  SC.gorgeApproach = async G => {
    if (G.flag('brambleSpared')) return;
    if (!G.flag('blueprint')) {
      G.shake();
      await G.say('bramble', 'NO. MORE. BRIDGES.');
      await G.narr('* A rock the size of a sheep thuds into the grass in front of you.');
      await G.say('rook', 'Back, back, BACK. We\'re not ready.', 'We need something that\'ll make him listen. Mira\'s workshop — east of the square. She\'ll have the old plans.');
      await G.walk('player', 49, 9);
      return;
    }
    return SC.bramble(G);
  };

  SC.bramble = async G => {
    if (G.flag('brambleSpared')) {
      const lines = G.flag('bridgeBuilt') ? ['Look at her. Bridge No. 2. Four metres clear, like you said.'] : G.flag('chapter') >= 5 ? ['Got the cable? Good. Now we build.'] : ['Twenty-two on the constant. I\'ve carved it on my arm. Well. Scratched it.', 'Light that lighthouse, little one. I can\'t build without timber, and the boats won\'t come in the dark.', 'Moss brought me scones. I may have cried. Don\'t tell anyone.'];
      return G.say('bramble', lines[Math.floor(Math.random() * lines.length)]);
    }
    if (!G.flag('blueprint')) return SC.gorgeApproach(G);
    if (!G.flag('brambleIntro')) {
      G.set('brambleIntro');
      await G.narr('* A huge mossy troll sits on the stump of the old bridge, staring at the gap.');
      await G.say('bramble', '...Go home, little one. There\'s nothing for you here.');
      await G.say('rook', 'Bramble. It\'s me. This is {name}. We found Mira\'s blueprint.');
      await G.say('bramble', 'Rook? ...That blueprint is a LIE. We followed every number on it, and the bridge FELL.', 'NO. MORE. BRIDGES.');
    }
    const r = await G.battle(window.ENCOUNTERS.bramble);
    if (r !== 'spared') return;
    await G.say('bramble', 'Hrmph.', 'I thought if I didn\'t build anything, nothing else could fall down.', '...That\'s not how it works, is it.');
    const c = await G.choose(['"Will you build it again?"', '"Mira would want you to."']);
    if (c === 1) await G.say('bramble', 'Mira would want me to stop sulking on a stump. Yes. Yes, she would.');
    await G.say('bramble', 'I\'ll rebuild it. Higher. Twenty-two on the constant.', 'But I need two things. Steel cable — real steel, not rope. And timber. Lots of timber.',
      'The steel\'s at the old lock up the river, past the meadows. The timber has to come by boat.', 'And no captain will sail past Gull Point while that lighthouse is dark.');
    await G.say('rook', 'So: light a lighthouse. Get to the lock. Build a bridge. Easy.');
    await G.say('bramble', 'And... little one. The night of the storm. Before the bridge went. Mira came here.',
      'She was soaked through. Had her angle-measurer on her shoulder. She said the lighthouse would show her where the fog was coming from.',
      'Then she walked east. Into the fog. Towards Gull Point.', 'I should have stopped her. I was too busy holding up a bridge that was already falling.');
    await G.say('rook', '...Gull Point. Then that\'s where we\'re going.');
    G.set('brambleSpared'); G.set('chapter', 2); G.set('eastOpen'); G.set('fogLevel', 0.45);
    G.refresh();
    await G.card('CHAPTER 1 COMPLETE', 'The fog over the east road is thinning.');
    await G.card('CHAPTER 2', 'THE DARK LIGHTHOUSE');
    G.hud(); G.save();
  };

  SC.fogWall = async G => {
    await G.narr('* The fog here is a wall. You can\'t see your own hand.');
    await G.say('rook', 'Too thick. Nobody gets through that without a reason strong enough to push.', G.flag('brambleSpared') ? 'Wait — it\'s thinning. Try again.' : 'Let\'s sort the village out first. The bridge, Bramble. Then we\'ll have our reason.');
  };

  SC._missing = async G => G.narr('* (This part of Lowmarsh is still being written.)');
})();
