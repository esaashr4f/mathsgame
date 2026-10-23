// CHAPTER 2 "The Dark Lighthouse" — coordinate geometry, circles and trigonometry.
// Most problems here are real OCR H230/01 questions, re-told as the lighthouse's own problems.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;
  const Q = id => window.PAPER_Q[id];
  const steps = (...ids) => ids.flatMap(id => Q(id).steps);

  // ───────────────────────── problems ─────────────────────────
  P.net = {
    id: 'net', topic: 'trig', title: "Nell's Net", giver: 'nell', source: 'OCR H230/01 Oct 2021 Q1',
    context: 'My new net\'s a triangle of rope. Two ropes, 3 metres and 4 metres, tied at a stake with a 30° angle between them. I need to know how much net to buy, how long the third rope is, and what angle to set the far stake at.',
    diagram: '<svg class="graph" viewBox="0 0 260 150" width="260" height="150"><rect width="260" height="150" fill="#fffdf6"/><polygon points="40,120 220,120 120,40" fill="rgba(63,111,176,.12)" stroke="#3a3550" stroke-width="2"/><text x="28" y="134" font-size="12">B (stake)</text><text x="210" y="134" font-size="12">C</text><text x="112" y="34" font-size="12">A</text><text x="65" y="78" font-size="12">3 m</text><text x="125" y="135" font-size="12">4 m</text><text x="60" y="114" font-size="11">30°</text></svg>',
    prompt: R`In triangle $ABC$, $AB = 3$, $BC = 4$ and angle $ABC = 30°$. Find the area, the length $AC$, and the angle $ACB$.`,
    done: 'Area 3 m² of net, third rope 2.05 m, far-stake angle 46.9°.',
    steps: Q('o21-1').steps,
  };

  P.kite = {
    id: 'kite', topic: 'trig', title: "Pebble's Kite", giver: 'kid', source: 'OCR H230/01 June 2019 Q6',
    context: 'I\'m building a triangle kite! Two sticks, x cm and y cm, with a 60° angle between them. The kite shop man says the area has to be exactly (x + y)√3 cm² or it won\'t fly. And it has to fit in my round kite-bag with the long stick going right across the middle.',
    prompt: R`Triangle $ABC$: $AB = x$, $AC = y$, angle $BAC = 60°$, area $(x+y)\sqrt3$. (a) Show $4x + 4y = xy$. (b) The vertices lie on a circle with $AC$ as a diameter. Find $x$ and $y$.`,
    done: '$x = 6$ cm, $y = 12$ cm. A kite with a right angle at B — of course, the angle in a semicircle.',
    steps: steps('o19-6a', 'o19-6b'),
  };

  P.kingfisher = {
    id: 'kingfisher', topic: 'prob', title: "Old Jan's Kingfishers", giver: 'jan', source: 'OCR H230/01 June 2018 Q11',
    context: 'Forty years I\'ve watched for kingfishers off this point. Chance of seeing one on any given day: 0.3. I tally the days each week. Mira said there was a proper distribution for it. Binomial, she called it.',
    prompt: R`$X$ = number of days in a week on which Jan sees a kingfisher. (i) State a condition for $X$ to be binomial. (ii) Find $P(X = 2)$. (iii) Find the probability of exactly 2 sighting-days in at least 4 of 6 weeks.`,
    done: 'P(exactly 2 days) = 0.318; P(that happens in at least 4 of 6 weeks) = 0.0854.',
    steps: Q('o18-11').steps,
  };

  P.gears = {
    id: 'gears', topic: 'trig', title: 'The Clockwork', giver: 'ottoline', source: 'OCR H230/01 June 2019 Q3',
    context: 'The clockwork that turns the lens is keyed to a polynomial — the old engineers were fond of them. The gear polynomial is f(x) = 2x³ + 3x² − 8x + 3. The drum releases the lens whenever 2sin³θ + 3sin²θ − 8sinθ + 3 = 0. Find the release angles, or the lens won\'t turn.',
    diagram: Graph.svg({ w: 300, h: 180, x: [0, 360], y: [-3, 12], xstep: 90, ystep: 3, fns: [{ f: '2sin(x*pi/180)^3+3sin(x*pi/180)^2-8sin(x*pi/180)+3', color: '#b07fc8', label: 'drum' }], labels: { x: 'θ°', y: '' } }),
    prompt: R`(a) $f(x) = 2x^3 + 3x^2 - 8x + 3$. Show $f(1) = 0$ and solve $f(x) = 0$. (b) Hence solve $2\sin^3\theta + 3\sin^2\theta - 8\sin\theta + 3 = 0$ for $0° \le \theta < 360°$.`,
    done: 'Release angles 30°, 90°, 150°. Look at the graph: the drum curve hits zero at exactly those three angles (it only touches at 90°).',
    steps: steps('o19-3a', 'o19-3b'),
  };

  P.shutters = {
    id: 'shutters', topic: 'trig', title: 'The Three-Faced Lens', giver: 'ottoline', source: 'OCR H230/01 June 2018 Q3(ii)',
    context: 'The lens has three faces, so when the motor turns through φ, the lens turns through 3φ. The beam points at the harbour mouth whenever tan 3φ = √3. The motor sweeps from 0° to 90°. At which motor angles does the harbour get the light?',
    diagram: Graph.svg({ w: 300, h: 180, x: [0, 90], y: [-5, 5], xstep: 15, ystep: 1, fns: [{ f: 'tan(3x*pi/180)', color: '#3f6fb0', label: 'tan 3φ' }], hlines: [{ y: Math.sqrt(3), label: '√3', color: '#c0403a' }], labels: { x: 'φ°', y: '' } }),
    prompt: R`Solve $\tan 3\phi = \sqrt3$ for $0° \le \phi < 90°$.`,
    done: 'The harbour gets the beam at φ = 20° and 80° — the red line crosses the tan curve exactly twice.',
    steps: Q('o18-3ii').steps,
  };

  P.lensFrame = {
    id: 'lensFrame', topic: 'coord', title: 'The Lens Frame', giver: 'ottoline', source: 'OCR H230/01 June 2019 Q2',
    context: 'Mira\'s specification for the lens frame: the circle x² + y² − 4x + ky + 12 = 0, radius exactly 1 metre. The value of k got smudged by sea spray. There are two possibilities — the bracket fits either way up.',
    prompt: R`The circle $x^2 + y^2 - 4x + ky + 12 = 0$ has radius 1. Find the two possible values of $k$.`,
    done: '$k = \\pm 6$: the frame is centred at $(2, \\mp 3)$ either way up.',
    steps: Q('o19-2').steps,
  };

  P.mirrors = {
    id: 'mirrors', topic: 'coord', title: 'The Mirror Walls', giver: 'ottoline', source: 'OCR H230/01 June 2018 Q8',
    context: 'Two angled mirror walls run along y = ½x and y = −½x (metres, from the centre of the floor). The lamp housing must touch the right mirror at (2, 1) and the left at (−2, 1), so every ray is caught. The glazier needs its equation.',
    diagram: Graph.svg({ w: 300, h: 200, x: [-6, 6], y: [-1, 9], xstep: 1, ystep: 1, fns: [{ f: 'x/2', color: '#3f6fb0', label: 'mirror y = x/2' }, { f: '-x/2', color: '#3f6fb0' }], points: [{ x: 2, y: 1, label: '(2, 1)' }, { x: -2, y: 1, label: '(−2, 1)' }] }),
    prompt: R`The lines $y = \tfrac12x$ and $y = -\tfrac12x$ are tangents to a circle at $(2,1)$ and $(-2,1)$. Find the circle in the form $x^2 + y^2 + ax + by + c = 0$.`,
    done: 'Housing: $x^2 + y^2 - 10y + 5 = 0$ — centre $(0, 5)$, radius $\\sqrt{20}$. The normals from the two mirror points meet right at the centre.',
    steps: Q('o18-8').steps,
  };

  P.beam = {
    id: 'beam', topic: 'coord', title: 'The Beam', giver: null, source: 'OCR H230/01 June 2023 Q8',
    context: 'The lamp flame sits at (0, 1). The great lens is the circle x² + y² − 6x − 4y + 12 = 0. The light that reaches the lens is bounded by the two tangents from the flame to the lens. The angle between them is the beam\'s spread — get it right, and the beam cuts through any fog.',
    diagram: Graph.svg({ w: 300, h: 200, x: [-1, 5], y: [-0.5, 4], xstep: 1, ystep: 1, circles: [{ cx: 3, cy: 2, r: 1, color: '#c0403a' }], points: [{ x: 0, y: 1, label: 'flame (0, 1)' }] }),
    prompt: R`A circle has equation $x^2 + y^2 - 6x - 4y + 12 = 0$. Two tangents to it pass through $(0, 1)$. Find the angle between them.`,
    steps: Q('o23-8').steps.map((s, i) => Object.assign({}, s, { react: [
      [['enemy', '...three, two. That is where the lens sits. I know. I polished it every night for a hundred years.']],
      [['enemy', 'One metre. The lens is one metre across the middle... Mira measured it with her own hands.']],
      [['enemy', 'You are putting the beam into an equation. Mira did that. Then she walked into the dark.'], ['rook', 'She walked into the dark so she could find where it was coming FROM, Ottoline. Not to leave you.']],
      [['enemy', 'Nought, and three-quarters. One beam along the sea. One rising to the cliffs...']],
      [['enemy', 'Thirty-seven degrees. That was the old spread. My spread.'], ['enemy', 'It reached the harbour in 1923, the night I... the night the lamp failed. It would have reached.'], ['rook', 'It will reach now.']],
    ][i] })),
  };

  window.ENCOUNTERS.ottoline = {
    name: 'Ottoline', sprite: 'ottoline', scale: 9, atk: 3,
    intro: '* Ottoline rises over the lamp. The air goes cold enough to see your breath.',
    check: '* OTTOLINE — ATK 5 DEF 30. Keeper of Gull Point since 1923. Believes that whoever lights the lamp walks into the dark and never comes back.',
    flavor: ['* Ottoline flickers like a candle in a draught.', '* The glass of the lamp room fogs over with her breath.', '* Far below, waves hit the rocks in a slow 4/4 time.', '* Ottoline is counting the seconds between the beams. There are no beams.'],
    fightLine: 'You can\'t punch a ghost, {name}. Believe me, I\'ve tried. It\'s embarrassing.',
    talk: [
      [['enemy', 'Every keeper before me lit the lamp. Every one. And the sea took them anyway.'], ['rook', 'And every ship that saw it came home.']],
      [['enemy', 'Mira lit it with me. We laughed. Then the fog came up the cliff and ate the light like it was nothing.']],
      [['enemy', 'She said: "Keep the light, Ottoline. I\'ll be back before it\'s cold." It has been cold for six months.']],
      [['text', '* Ottoline is listening. Her outline is a little sharper.']],
    ],
    taunts: ['Get out of my light.', 'Everyone who lights it leaves.', 'She didn\'t come back.', 'Why should it reach now?', '...'],
    angry: ['LEAVE MY LAMP!', 'THE DARK TAKES THEM!', 'I SAID LEAVE!', 'DON\'T!', 'NO!'],
    attacks: [
      { pattern: 'sweep', bullets: ['LEAVE', '~', 'DARK'], speed: 60, every: 400 },
      { pattern: 'rain', bullets: ['~', '~', 'SALT'], speed: 65, every: 300 },
      { pattern: 'spiral', bullets: ['1923', 'STORM'], speed: 55, every: 280 },
      { pattern: 'sweep', bullets: ['SHE LEFT', 'COLD'], speed: 70, every: 360 },
      { pattern: 'arc', bullets: ['~', '~', '~'], speed: 60, every: 260 },
    ],
    spareHint: '* Ottoline stops shaking. She is looking at the lamp, not at you. (Ottoline can be SPARED.)',
    problem: P.beam,
  };

  // ───────────────────────── Gull Point ─────────────────────────
  SC.arriveGullPoint = async G => {
    G.set('gullPointSeen');
    await G.narr('* The cliff road opens onto a windy headland. Gulls wheel overhead.', '* Above it all stands the lighthouse at Gull Point. Its lamp is black.');
    await G.say('rook', 'Gull Point. Mira loved it up here. Said the lighthouse was the only building in Lowmarsh with honest angles.',
      'Nell fishes off the beach. Old Jan watches birds on the headland. And the lighthouse... the lighthouse has a keeper.', 'Sort of.');
    const c = await G.choose(['"Sort of?"', '"Let\'s go."']);
    if (c === 0) await G.say('rook', 'You\'ll see. Be polite. She\'s been dead since 1923 and she is NOT relaxed about it.');
    G.hud(); G.save();
  };

  SC.nell = async G => {
    if (!G.flag('nellDone')) {
      await G.say('nell', 'Is that Mira\'s crow? Then you\'ll be the student. Fen said you\'d come out this way eventually.',
        'You\'ve caught me mending. The storm tore my net to rags, so I\'m making a new one. A triangle of rope, staked on the sand.',
        'Two ropes from the corner stake: three metres and four metres, thirty degrees apart. I need to know how much netting to buy, how long the third rope must be, and what angle to set the far stake.',
        'Used to be easy. Now my head\'s full of fog.');
      const c = await G.choose(['"I\'ll work it out."', '"Later."']);
      if (c === 1) return G.say('nell', 'Net\'s not going anywhere. Neither am I.');
      await G.solve(P.net);
      await G.say('nell', 'Three square metres of net. Two-oh-five of rope. Forty-seven degrees, give or take. Beautiful.');
      await G.say('nell', 'Here — smoked mackerel. Don\'t tell Fen it\'s better than her flapjacks.');
      G.give('flapjack', 2);
      await G.say('nell', 'You\'re going up to the lighthouse? ...The night of the storm, I saw the lamp come on. Just for a minute. Two figures up in the glass.',
        'Then the fog came up the cliff like a wave, and the light went out. And I swear I heard someone shouting numbers.');
      await G.say('rook', '...Mira.');
      G.set('nellDone');
      return;
    }
    const lines = G.flag('lightOn') ? ['The light\'s back! I fished past dark for the first time in six months. Caught nothing. Best night ever.'] : ['Net\'s holding. Rope\'s the right length. You\'d think I\'d done the sums myself.', 'Gull says if the light comes back she can run the night tide and bring timber for Bramble\'s bridge.'];
    await G.say('nell', lines[Math.floor(Math.random() * lines.length)]);
  };

  SC.jan = async G => {
    if (!G.flag('janDone')) {
      await G.say('jan', 'Shh. Kingfisher weather.', 'Forty years I\'ve watched for kingfishers off this point. Three days in ten, on average, I see one. I tally the days each week.',
        'Mira said it was a binomial distribution. She was going to show me how to work out the chances properly. Then... well.');
      const c = await G.choose(['"I can show you."', '"Not now."']);
      if (c === 1) return G.say('jan', 'The birds will wait. They always do.');
      await G.solve(P.kingfisher);
      await G.say('jan', 'Point three one eight for exactly two days in a week. And less than one in ten for that to happen four weeks out of six. Marvellous.',
        'Here\'s something for you in return. The birds won\'t fly over the marsh any more. Not since the storm. They go the long way round.', 'Birds know where something is wrong. Mira asked me which way they avoided. I told her: north-west. The heart of the marsh.');
      G.page('prob');
      G.set('janDone');
      return;
    }
    await G.say('jan', G.flag('lightOn') ? 'Saw a kingfisher this morning, by the light of the lamp at dawn. First since the storm.' : 'North-west. They still won\'t fly north-west.');
  };

  SC.kidKite = async G => {
    if (!G.flag('kiteDone')) {
      await G.say('kid', 'I\'m Pebble. I\'m building a kite. It\'s a triangle. The kite shop man says the area has to be EXACTLY (x + y) root 3, or it won\'t fly. And it has to fit in my round kite bag with the long stick going right across the middle.');
      const c = await G.choose(['"Let\'s design it."', '"Maybe later, Pebble."']);
      if (c === 1) return;
      await G.solve(P.kite);
      await G.say('kid', 'Six and twelve! It\'s got a right angle in it! Why has it got a right angle in it?');
      await G.say('rook', 'Angle in a semicircle, Pebble. Always ninety degrees. Always.');
      G.set('kiteDone');
      return;
    }
    await G.say('kid', 'IT FLIES! It flies so well. Six and twelve. I\'m never forgetting six and twelve.');
  };

  SC.lighthouseDoor = async G => {
    if (!G.flag('eastOpen')) return G.narr('* The lighthouse door. Locked.');
    await G.go('lighthouse', 5, 8, 'up');
    if (!G.flag('ottolineMet')) await SC.ottoline(G);
  };

  SC.keeperLog = async G => {
    await G.narr('* The keeper\'s log. Dozens of years of neat entries, all in the same spidery hand.', '* "17th Nov 1923. Storm. Lamp failed at 2 a.m. Going up to relight. — O."', '* The handwriting continues after that date. It never changes. It never stops.');
    if (G.flag('ottolineMet')) await G.narr('* The most recent entry, in a different hand: "Lit with O. Fog came up the cliff — it MOVES. It has a source. Bearing 290° from here. Going to measure. Keep the light, O. — M.H."');
  };

  SC.ottoline = async G => {
    if (!G.flag('ottolineMet')) {
      G.set('ottolineMet');
      await G.narr('* The air goes cold. A pale woman in an old keeper\'s coat drifts out of the wall.');
      await G.say('ottoline', 'This light is not for you. Leave.');
      await G.say('rook', 'Ottoline. It\'s Rook. This is {name}. We\'ve come to light the lamp.');
      await G.say('ottoline', 'Rook? Mira\'s bird?', 'Mira lit it too. We lit it together, the night of the great storm. We laughed. And then the fog came up the cliff like a living thing and swallowed the beam whole.',
        'She told me to keep the light. And then she walked into the fog.', 'Everyone who touches that lamp walks into the dark, little one. I did, in 1923. Mira did. You won\'t.');
      const c = await G.choose(['"We just want to fix the clockwork."', '"Mira didn\'t walk away from you."']);
      if (c === 1) await G.say('ottoline', '...You didn\'t know her. Don\'t tell me what she did.');
      await G.say('rook', 'Just the clockwork, Ottoline. Let us start it turning. That\'s all.');
      await G.say('ottoline', 'Hmph. The clockwork is keyed to a polynomial, and the drum to a trigonometric equation. The old engineers loved riddles.', 'Fix it if you can. You won\'t.');
      return;
    }
    if (!G.flag('gearsDone')) return G.say('ottoline', 'The clockwork, then. Since you\'re so determined.');
  };

  SC.gears = async G => {
    if (G.flag('gearsDone')) return G.narr('* The clockwork ticks steadily. 30°, 90°, 150°. Click, click, click.');
    if (!G.flag('ottolineMet')) return SC.ottoline(G);
    await G.solve(P.gears);
    await G.narr('* You set the release pins at 30°, 90° and 150°. The clockwork shudders, coughs, and begins to tick.');
    await G.say('ottoline', '...It turns. It hasn\'t turned since...', 'Come up, then. See the lamp for yourself.');
    await G.narr('* Ottoline drifts up the stairs without another word.');
    G.set('gearsDone'); G.page('trig'); G.refresh();
  };

  SC.stairs = async G => {
    if (!G.flag('gearsDone')) { await G.say('ottoline', 'Not until the clockwork turns.'); return G.walk('player', 7, 3); }
    await G.go('lamproom', 6, 9, 'up');
    if (!G.flag('lampRoomSeen')) {
      G.set('lampRoomSeen');
      await G.narr('* The lamp room. Glass on every side, all of it white with fog. The great lamp sits cold in the middle.');
      await G.say('ottoline', 'The shutters. The lens frame. The mirror walls. All three are wrong since the storm.', 'Mira wrote the numbers on the glass. The fog wiped half of them away.');
      await G.say('rook', 'Three jobs. Then we light it.');
    }
  };

  const lampJobs = ['shuttersDone', 'frameDone', 'mirrorsDone'];
  const jobsLeft = G => lampJobs.filter(k => !G.flag(k)).length;

  SC.shutters = async G => {
    if (G.flag('shuttersDone')) return G.narr('* The shutters are set: twenty degrees, and eighty.');
    await G.solve(P.shutters);
    await G.narr('* You set the shutter stops at 20° and 80°.');
    G.set('shuttersDone');
    if (jobsLeft(G)) await G.say('rook', jobsLeft(G) + ' more to go.'); else await G.say('rook', 'That\'s all three. The lamp, {name}.');
  };
  SC.lensFrame = async G => {
    if (G.flag('frameDone')) return G.narr('* The lens frame sits true in its bracket. k = 6, or −6, depending which way you look at it.');
    await G.solve(P.lensFrame);
    await G.narr('* The frame drops into its bracket with a soft clunk. A perfect circle, radius one metre.');
    G.set('frameDone'); G.page('coord');
    if (jobsLeft(G)) await G.say('rook', jobsLeft(G) + ' more to go.'); else await G.say('rook', 'That\'s all three. The lamp, {name}.');
  };
  SC.mirrors = async G => {
    if (G.flag('mirrorsDone')) return G.narr('* The mirror walls gleam. Every ray will be caught.');
    await G.solve(P.mirrors);
    await G.narr('* You chalk the housing circle onto the floor for the glazier: centre (0, 5), radius √20.');
    G.set('mirrorsDone');
    if (jobsLeft(G)) await G.say('rook', jobsLeft(G) + ' more to go.'); else await G.say('rook', 'That\'s all three. The lamp, {name}.');
  };

  SC.ottolineTop = async G => {
    if (jobsLeft(G)) {
      const lines = ['You are very determined for someone so wet.', 'The shutters, the frame, the mirrors. Mira did them in an hour. Take your time. I have nothing but.', 'I used to sing up here, between the beams. I have not sung in a while.'];
      return G.say('ottoline', lines[Math.floor(Math.random() * lines.length)]);
    }
    return SC.lampCore(G);
  };

  SC.lampCore = async G => {
    if (G.flag('lightOn')) return G.narr('* The great lamp burns steady and gold. The beam sweeps out across the sea.');
    if (jobsLeft(G)) return G.narr('* The great lamp. Cold. The shutters, lens frame and mirror walls still need setting.');
    const c = await G.choose(['Light the lamp.', 'Not yet.']);
    if (c === 1) return;
    await G.narr('* You reach for the lamp.');
    G.shake();
    await G.say('ottoline', 'NO!', 'Every time this light is lit, someone walks into the dark! I WON\'T LET IT HAPPEN AGAIN!');
    const r = await G.battle(window.ENCOUNTERS.ottoline);
    if (r !== 'spared') return;
    await G.say('ottoline', '...Thirty-seven degrees.', 'Light it, then. Light it together. Like she did.');
    await G.narr('* You and the ghost of Ottoline lift the flame into the lens together.', '* The lamp catches. Gold light floods the glass —', '* — and the beam swings out over the sea, slicing straight through the fog.');
    G.set('lightOn'); G.set('ottolineSpared'); G.set('fogLevel', 0.35); G.refresh();
    await G.say('ottoline', 'Look at it. Look how far it goes.', 'The fog is not swallowing it. It\'s... backing away.');
    await G.say('rook', 'Ha! The fog doesn\'t like being looked at properly!');
    await G.say('ottoline', '{name}. Mira didn\'t walk away from me. She walked TOWARDS something.',
      'She measured where the fog was coming from. The beam lit it up for a moment — bearing two hundred and ninety degrees. The heart of the marsh.',
      'But she said something else, before she went. She said: "It\'s not just the fog. Somebody\'s been disappearing in the records. The census will show it."', 'I never understood what she meant.');
    await G.say('rook', 'The census. The Town Hall archive. The Mayor\'s had it locked since the storm.');
    await G.say('ottoline', 'Take my lens notes. And come back sometimes. I will keep the light.', 'Properly, this time.');
    G.give('lens');
    G.set('chapter', 3);
    await G.card('CHAPTER 2 COMPLETE', 'The lighthouse burns again. Boats can sail at night.');
    await G.card('CHAPTER 3', 'THE CENSUS');
    G.hud(); G.save();
  };

  SC.ottolineAfter = async G => {
    const lines = ['I\'ve started singing again, between the beams. The gulls hate it.', 'Bearing two hundred and ninety. Remember it.', 'Gull ran the night tide last night. I watched her lights all the way in.'];
    await G.say('ottoline', lines[Math.floor(Math.random() * lines.length)]);
  };
})();
