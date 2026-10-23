// CHAPTER 5 "The Lock" — mechanics: forces in equilibrium, F = ma, connected particles and pulleys,
// variable acceleration, constant acceleration. Then the bridge: vectors, data and moments.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;
  const Q = id => window.PAPER_Q[id];
  const fromPaper = (id, extra) => Object.assign({ id: extra.id, topic: Q(id).topic, title: extra.title, giver: extra.giver, source: Q(id).source, context: extra.context, prompt: Q(id).prompt, steps: Q(id).steps, done: extra.done, diagram: extra.diagram }, extra.prompt ? { prompt: extra.prompt } : {}, extra.steps ? { steps: extra.steps } : {});

  // ───────────────────────── the lock ─────────────────────────
  P.gateForces = fromPaper('m21-9', { id: 'gateForces', title: 'The Stuck Gate Leaf', giver: 'dilys',
    context: 'Before the storm Mira drew every force on the stuck gate leaf for me: two pushes up, one down, two to the left, two to the right. It\'s held perfectly still. If we know the two unknown forces, we know what Cog\'s been holding against.',
    done: 'F₁ = 42 N and F₂ = 4 N on Mira\'s scale drawing. At rest means every direction balances.' });
  P.counterweight = fromPaper('m20-9', { id: 'counterweight', title: 'Raising the Counterweight', giver: 'dilys',
    context: 'The storm knocked the gate counterweight off its chain and it\'s sitting at the bottom of the lock chamber. The crane lifts it in its cradle: cradle 55 kg, block 830 kg. The crane cable is rated to 9500 N. Lift it too hard and the cable goes.',
    done: 'No more than 0.934 m s⁻² going up. The block presses on the cradle floor with about 8910 N.' });
  P.chamber = fromPaper('m23-10', { id: 'chamber', title: 'Will the Boat Hit the Gates?', giver: 'dilys',
    context: 'Cog\'s big fear: when the sluices open, the surge will throw the boats in the chamber into the far gates. Mira timed the surge. The drift of a boat is $a = 4t - 9$ m s⁻², with $v = 2$ m s⁻¹ when $t = 1$. Boats stop drifting when the surge settles. The chamber leaves 8 metres of clear water.',
    done: 'The boat stops at t = 1.5 and t = 3. It travels 6.75 m in total, so it stays inside the 8 m of clear water.',
    steps: Q('m23-10').steps.concat([
      { ask: 'The chamber leaves 8 m of clear water. So:', type: 'choice',
        choices: [R`$6.75 < 8$: the boat never reaches the gates`, R`$6.75 > 8$: it hits them`, R`We need the boat's mass`, R`We can't tell without $g$`], answer: 0,
        hint: 'Compare the total distance with the clearance.', explain: R`Total distance $6.75$ m $< 8$ m: no collision. The surge is safe.`,
        rook: 'Write that on a card. In big letters. For a golem.' },
    ]) });

  P.cogTrial = {
    id: 'cogTrial', topic: 'forces', title: "Cog's Great Pulley", giver: null, source: Q('m18-10').source,
    context: 'Each lock gate rises on a chain over Cog\'s great pulley, balanced by the counterweight. Mira built a scale model in the lockhouse: a 3 kg gate and a 5 kg counterweight. The counterweight falls 2.5 m onto its buffer and stops. Cog is certain that the gate will then fly off the top of its guide rails, which allow 2 m of travel above that point.',
    diagram: Q('m18-10').diagram, prompt: Q('m18-10').prompt,
    done: 'The gate rises only another 1.25 m, well inside its 2 m of guide. The lock is safe to open.',
    steps: Q('m18-10').steps.concat([
      { ask: 'The guide rails allow 2 m above that point. So:', type: 'choice',
        choices: [R`$1.25 < 2$: the gate stays on its rails`, R`$1.25 > 2$: it flies off`, R`It depends on the tension`, R`The gate keeps going for ever`], answer: 0,
        hint: 'Compare the extra rise with the 2 m of guide.', explain: R`The gate coasts up $1.25$ m under gravity alone, then stops. It stays on its rails.` },
    ]),
  };
  P.cogTrial.steps = P.cogTrial.steps.map((s, i) => Object.assign({}, s, { react: [
    [['enemy', 'RESULTANT FORCE: 5g MINUS 3g. TOTAL MASS: 8. ACCELERATION: g OVER 4.'], ['enemy', '...COG HAS NOT DONE ARITHMETIC IN THIRTY DAYS. IT FEELS... GOOD.']],
    [['enemy', 'TENSION THIRTY-SIX POINT SEVEN FIVE. SAME BOTH SIDES. LIGHT STRING. SMOOTH PULLEY.'], ['rook', 'He\'s quoting the modelling assumptions. That\'s a good sign.']],
    [['enemy', 'v SQUARED EQUALS 2 a s. THREE POINT FIVE. COG REMEMBERS SUVAT.']],
    [['enemy', 'THEN THE STRING GOES SLACK. ONLY GRAVITY. THE GATE SLOWS...'], ['enemy', 'ONE POINT TWO FIVE METRES.']],
    [['enemy', 'ONE POINT TWO FIVE... IS LESS THAN TWO.'], ['enemy', 'THE GATE... STAYS ON ITS RAILS.'], ['enemy', 'COG WAS WRONG. COG WAS AFRAID, SO COG WAS WRONG.']],
  ][i] }));

  window.ENCOUNTERS.cog = {
    name: 'Cog', sprite: 'cog', scale: 6, atk: 5,
    intro: '* Cog\'s eyes grind open. Steam hisses from his joints. "THE LOCK STAYS SHUT."',
    check: '* COG — ATK 7 DEF 60. Lock golem, built 1887. Rusted. Frightened. Has been holding the lock shut since the storm "to keep everyone SAFE".',
    flavor: ['* Cog\'s gears grind. Something in them is full of fog.', '* The Wend rushes against the shut gates.', '* Dilys watches from the lockhouse door with her arms folded.', '* Cog checks the lock gates for the four-hundredth time today.'],
    fightLine: 'He\'s solid iron, {name}. The only thing that moves Cog is a calculation.',
    talk: [
      [['enemy', 'THE WOMAN WITH THE NOTEBOOK SAID: "SHUT THE LOCK, COG. KEEP THEM SAFE UNTIL I\'M BACK."'], ['enemy', 'SHE IS NOT BACK.']],
      [['enemy', 'IF COG OPENS THE LOCK, THE GATES WILL FLY. THE BOATS WILL SMASH. COG HAS CALCULATED IT.'], ['rook', 'Has he, though? With fog in his gears?']],
      [['enemy', 'COG\'S NUMBERS ARE ALL... TOO BIG. EVERYTHING IS TOO BIG. EVERYTHING IS DANGER.']],
      [['enemy', 'SHOW COG THE WORKING. COG WILL CHECK EVERY LINE.']],
    ],
    taunts: ['NOT SAFE', 'SHUT', 'DANGER', 'F = ma', 'CLANK'],
    angry: ['NOT SAFE!', 'TOO MUCH FORCE!', 'TENSION!', 'CLANK CLANK'],
    attacks: [
      { pattern: 'rain', bullets: ['F=ma', 'mg', 'T'], speed: 64, every: 340 },
      { pattern: 'sweep', bullets: ['NOT SAFE', 'SHUT', '⚙'], speed: 68, every: 360 },
      { pattern: 'arc', bullets: ['⚙', 'g', '⚙'], speed: 60, every: 300 },
      { pattern: 'spiral', bullets: ['v²=u²+2as', 'R'], speed: 55, every: 260 },
    ],
    spareHint: '* Cog\'s eyes dim to a calm amber. He is reading your working, line by line. (Cog can be SPARED.)',
    problem: P.cogTrial,
  };

  // ───────────────────────── the bridge ─────────────────────────
  P.bracing = {
    id: 'bracing', topic: 'vectors', title: 'Cross-Bracing the Bridge', giver: 'bramble', source: 'OCR H230/01 June 2018 Q7',
    context: 'Each side panel of the new bridge is a parallelogram of timber, $OABC$, with a steel cross-brace along each diagonal. I want to bolt the two braces together where they cross. Mira said they always cross in the exact middle of both. I want PROOF before I drill.',
    prompt: R`$OABC$ is a parallelogram with $\overrightarrow{OA} = \mathbf{a}$ and $\overrightarrow{OC} = \mathbf{c}$. $P$ is the midpoint of $AC$. Prove that the diagonals of a parallelogram bisect one another.`,
    done: 'OP = ½(a + c) = ½OB, so the midpoint of AC is also the midpoint of OB. Bramble drills one hole in each brace, exactly in the middle.',
    steps: Q('o18-7ia').steps.concat(Q('o18-7ib').steps, Q('o18-7ii').steps),
  };
  P.boulders = fromPaper('o23-10', { id: 'boulders', title: 'Foundation Boulders', giver: 'bramble',
    context: 'Tansy and the goats dragged me 120 boulders for the foundations. I weighed them all (troll scales, very accurate). Light ones crumble, so anything unusually light goes in the garden wall instead.',
    done: 'Mean about 57.7 kg, s.d. about 6.20 kg. Anything under 45.3 kg is an outlier, about 4 boulders. Those go in Ivy\'s wall.' });
  P.deck = {
    id: 'deck', topic: 'forces', title: 'The Deck Plank', giver: 'bramble', source: 'Topic questions: Moments, Q6',
    context: 'The first deck plank: uniform, 4 m long, weight 100 N. It rests on two trestles, C and D, 0.5 m apart, with C at $x$ m from the end A. Rook sat on C and read the reaction: 75 N.',
    diagram: '<svg class="graph" viewBox="0 0 300 120" width="300" height="120"><rect width="300" height="120" fill="#fffdf6"/><rect x="20" y="50" width="260" height="10" fill="#8a6038"/><text x="10" y="45" font-size="12" fill="#3a3550">A</text><text x="282" y="45" font-size="12" fill="#3a3550">B</text><polygon points="102,60 94,82 110,82" fill="#6a6a76"/><polygon points="134,60 126,82 142,82" fill="#6a6a76"/><text x="96" y="98" font-size="12" fill="#3a3550">C</text><text x="128" y="98" font-size="12" fill="#3a3550">D</text><line x1="20" y1="30" x2="102" y2="30" stroke="#c0403a"/><text x="52" y="25" font-size="12" fill="#c0403a">x m</text><text x="104" y="114" font-size="11" fill="#3a3550">0.5 m</text><line x1="150" y1="60" x2="150" y2="80" stroke="#3f6fb0" stroke-width="2"/><text x="154" y="78" font-size="11" fill="#3f6fb0">100 N</text></svg>',
    prompt: R`A uniform plank $AB$ of weight $100$ N and length $4$ m rests horizontally on supports $C$ and $D$, where $AC = x$ m and $CD = 0.5$ m. The reaction at $C$ is $75$ N. Find $x$.`,
    done: 'x = 1.875 m. Bramble sets the trestles and the plank sits level.',
    steps: [
      { ask: 'Resolving vertically, the reaction at D is ... N', type: 'num', answer: 25, hint: R`$R_C + R_D = 100$`, explain: R`$75 + R_D = 100 \Rightarrow R_D = 25$ N.`,
        rook: 'Equilibrium has two conditions: forces balance, and turning effects balance. Forces first.' },
      { ask: R`The weight acts at the middle, 2 m from A. Distance from C to the middle, in terms of $x$:`, type: 'expr', answer: '2-x', hint: R`C is at $x$, the middle is at 2.`, explain: R`$2 - x$` },
      { ask: R`Distance from the middle to D, in terms of $x$:`, type: 'expr', answer: 'x-1.5', hint: R`D is at $x + 0.5$.`, explain: R`$(x + 0.5) - 2 = x - 1.5$` },
      { ask: R`Taking moments about the middle: $75(2 - x) = 25(x - 1.5)$. Solve for $x$.`, type: 'num', answer: 1.875,
        hint: R`$150 - 75x = 25x - 37.5$`, explain: R`$187.5 = 100x \Rightarrow x = 1.875$ m`,
        rook: 'Moment = force × perpendicular distance. Clockwise equals anticlockwise. That\'s all of statics.' },
    ],
  };

  // ───────────────────────── side problems ─────────────────────────
  P.race = fromPaper('m20-11', { id: 'race', title: 'The Towpath Race', giver: 'rowan',
    context: 'Now the towpath\'s dry, Tansy wants a race: me on the old tractor against the postman on his motorbike. The tractor pulls away from the lock at 4 m s⁻², and the postman does a steady 16 m s⁻¹ but he passes the lock 1.5 seconds later. When are we level, and how far ahead do I ever get?',
    done: 'Level at 2 s and 6 s. Rowan is ahead in between, by 8 m at most. Tansy declares it a draw "for safety reasons".' });
  P.modelShip = fromPaper('m18-9', { id: 'modelShip', title: 'The Model Ship', giver: 'kid',
    context: 'I made a model ship for the millpond! It\'s 2 kg and it has a little engine. Mira worked out its acceleration for me: $\\mathbf{a} = 3(2t - 5)\\mathbf{i} + 4\\mathbf{j}$. When is the force on it exactly 10 newtons?',
    done: 'T = 2 or T = 3 seconds. The ship circles the millpond twice and sinks with dignity.' });
  P.ballThrow = fromPaper('m22-10', { id: 'ballThrow', title: "Tansy's Ball", giver: 'tansy',
    context: 'I\'m on the haystack, 2 m up. I throw the ball straight up at 3.5 m s⁻¹ and Gerald tries to catch it when it lands. How long does Gerald have?',
    done: '1.09 seconds. Gerald does not catch it. Gerald never catches it.' });
  P.goatPull = {
    id: 'goatPull', topic: 'forces', title: 'Three Goats, One Cart', giver: 'tansy', source: "Topic questions: Newton's First and Third Laws, Q1",
    context: 'I tied all three goats to the hay cart. Pythagoras pulls 12 N due north (000°). Hypatia pulls 14 N due east (090°). Gerald pulls 5 N due west (270°), because he\'s Gerald. Where does the cart go?',
    prompt: R`Three horizontal forces of $12$ N, $14$ N and $5$ N act along bearings $000°$, $090°$ and $270°$. Find the magnitude and bearing of their resultant.`,
    done: 'A resultant of 15 N on a bearing of 036.9°. The cart ends up in the duck pond.',
    steps: [
      { ask: 'Total force east (N):', type: 'num', answer: 9, hint: 'East is positive, west is negative.', explain: R`$14 - 5 = 9$ N east` },
      { ask: 'Total force north (N):', type: 'num', answer: 12, hint: 'Only Pythagoras pulls north–south.', explain: '12 N north' },
      { ask: 'Magnitude of the resultant (N):', type: 'num', answer: 15, hint: R`$\sqrt{9^2 + 12^2}$`, explain: R`$\sqrt{81 + 144} = 15$ N` },
      { ask: 'Bearing of the resultant (degrees, 1 d.p.):', type: 'num', answer: 36.8699, dp: 1, hint: R`A bearing is measured clockwise from north: $\tan\theta = \dfrac{\text{east}}{\text{north}}$.`, explain: R`$\tan^{-1}\!\left(\tfrac{9}{12}\right) = 36.9°$, so bearing $036.9°$` },
    ],
  };
  P.pimRide = fromPaper('m21-10', { id: 'pimRide', title: "Pim's Bike Ride", giver: 'pim',
    context: 'Now the roads are open I\'m cycling the census returns to the regional office. I timed myself on the practice run: 150 seconds door to door. Mira always said draw the velocity–time graph first.',
    done: 'Acceleration 0.24 m s⁻² to start, then T = 45 s, and an average speed of 6.27 m s⁻¹. Pim is thrilled to be described as "average".' });

  // ───────────────────────── chapter 5 script ─────────────────────────
  SC.cog = async G => {
    if (!G.flag('drained')) return G.narr('* A huge iron figure stands knee-deep in the floodwater by the lock. It hasn\'t moved. Rust runs down its arms like tears.');
    if (G.flag('lockOpen')) return G.say('cog', ['THE LOCK IS OPEN. THE RIVER REACHES THE SEA. COG IS... CONTENT.', 'COG IS RECALCULATING EVERYTHING. EVERYTHING IS SMALLER THAN COG FEARED.', 'IF YOU FIND THE WOMAN WITH THE NOTEBOOK, TELL HER COG KEPT THEM SAFE. AND THEN COG LET GO.'][Math.floor(Math.random() * 3)]);
    if (!G.flag('cogMet')) {
      G.set('cogMet');
      await G.say('cog', 'HALT. THE LOCK IS SHUT. THE LOCK STAYS SHUT. IT IS NOT SAFE.');
      await G.say('rook', 'Cog. The lock golem. Built to open and shut these gates, and he\'s been standing here since the storm.', 'If the lock stays shut, the Wend floods again with the next rain. We have to convince him.');
      await G.say('cog', 'CONVINCE COG WITH NUMBERS. NOT WITH WORDS. WORDS ARE FOG.');
      await G.say('rook', 'There\'s a lockhouse right there. Somebody kept a log. Let\'s start with them.');
      G.hud();
      return;
    }
    if (!G.flag('chamberDone')) return G.say('cog', 'COG REQUIRES: THE FORCES ON THE GATE. THE COUNTERWEIGHT RAISED. THE SURGE IN THE CHAMBER. THEN COG WILL LISTEN.');
    await G.say('cog', 'THE GATE IS IN BALANCE. THE COUNTERWEIGHT IS RAISED. THE SURGE IS SAFE.', 'BUT THE PULLEY. THE GREAT PULLEY. WHEN THE WEIGHT HITS THE BUFFER, THE GATE WILL FLY.', 'COG WILL NOT BE MOVED.');
    const r = await G.battle(window.ENCOUNTERS.cog);
    if (r !== 'spared') return;
    await G.say('cog', 'COG HAS CHECKED EVERY LINE.', 'THE LOCK... IS SAFE TO OPEN.');
    await G.narr('* Cog sets his hands on the windlass. Rust cracks and falls from his arms.', '* Slowly, groaning, the great gates swing open.');
    G.set('lockOpen'); G.refresh(); G.shake();
    await G.narr('* The Wend pours through the lock towards the sea, glad and quick.');
    await G.say('cog', 'TAKE THIS. THE LOCK\'S SPARE CABLE. FORTY METRES OF STEEL. COG KEPT IT SAFE.', 'COG KEPT EVERYTHING SAFE. FOR TOO LONG.');
    G.give('cable', 1);
    G.page('forces'); G.page('kinematics');
    await G.say('rook', 'Forty metres of steel cable. Bramble has been waiting for exactly this.', 'The gorge bridge, {name}. North of the village. Then the road out of Lowmarsh is open for the first time since the storm.');
    G.hud(); G.save();
  };

  SC.dilys = async G => {
    if (!G.flag('dilysMet')) {
      G.set('dilysMet');
      await G.say('dilys', 'Oh! A person! A dry person! I\'m Dilys. I keep the lock. Kept it. I\'ve been up in the loft since the water came.',
        'Cog shut the gates the night of the storm. Mira told him to: "Shut it, keep them safe, till I\'m back." Then she went off into the marsh, and he won\'t open them for anyone.',
        'His gears are full of fog. Every number he works out comes out too big. Everything looks like a disaster to him.',
        'But he\'ll believe working. He always has. Mira left me the sums. I just can\'t do them any more.');
    }
    if (!G.flag('gateDone')) {
      await G.say('dilys', 'First, the forces on the gate leaf. If it\'s balanced, he can stop holding it.');
      await G.solve(P.gateForces);
      G.set('gateDone');
      await G.say('dilys', 'Balanced! Every way. A thing at rest has no resultant force. I knew that once.');
    }
    if (!G.flag('weightDone')) {
      await G.say('dilys', 'Next, the counterweight. It\'s at the bottom of the chamber. The crane can lift it, if we don\'t snap the cable.');
      await G.solve(P.counterweight);
      G.set('weightDone');
      await G.narr('* You winch gently. The counterweight rises out of the water and clanks back onto its chain.');
      await G.say('dilys', 'Last thing is the surge in the chamber. The sluice is by the gates. Mira\'s timings are on the board.');
      G.hud();
      return;
    }
    if (!G.flag('chamberDone')) return G.say('dilys', 'The sluice board, by the gates. Then go and talk to that great rusty lump.');
    if (!G.flag('lockOpen')) return G.say('dilys', 'Go on. He\'s ready to be argued with. Be kind to him. He\'s been frightened for a month.');
    return G.say('dilys', ['Listen to that. Water through the lock. Best sound in the world.', 'Cog\'s been oiling himself all morning. I think he\'s embarrassed.', 'If you see Mira, tell her the lock\'s open. She\'ll know what that means.'][Math.floor(Math.random() * 3)]);
  };
  SC.lockLog = async G => G.narr(G.flag('lockOpen') ? '* The lock-keeper\'s log. A new entry: "Lock opened. Cog sound. River running. — D."' : '* The lock-keeper\'s log. The last entry: "Storm. Lock shut on Mira\'s word, to save the village. Cog will not open it again. Cog says it is not SAFE. — D."');
  SC.winch = async G => G.narr(G.flag('weightDone') ? '* The crane winch. Its cable is taut now, holding the counterweight.' : '* The crane winch for the lock. It could lift something heavy, carefully.');
  SC.lockgate = async G => G.narr(G.flag('lockOpen') ? '* The lock gates stand open. The Wend runs through them towards the sea.' : '* The Wend Lock. The gates are shut tight.');
  SC.sluice = async G => {
    if (!G.flag('drained')) return G.narr('* A board on a post, under water.');
    if (G.flag('chamberDone')) return G.narr('* Mira\'s surge timings. Someone has written "6.75 < 8" underneath, in big letters, for a golem.');
    if (!G.flag('weightDone')) return G.narr('* The sluice board. Mira\'s surge timings are chalked on it. Dilys will know what they mean.');
    await G.solve(P.chamber);
    G.set('chamberDone');
    await G.say('rook', 'Six point seven five metres. The boats never touch the gates. Now Cog.');
    G.hud();
  };

  // ── the bridge ──
  SC.brambleBridge = async G => {
    if (!G.flag('bridgeIntro')) {
      G.set('bridgeIntro');
      await G.say('bramble', 'CABLE. That\'s a CABLE. Forty metres of it! The timber came in on the boats yesterday, now the light\'s on.', 'Bridge No. 2, little one. You and me. Proper this time. With PROOF.');
    }
    if (!G.flag('bracingDone')) {
      await G.solve(P.bracing);
      G.set('bracingDone'); G.page('vectors');
      await G.say('bramble', 'Halfway along each one. Always. Even on a wonky one. I love a proof. Nobody can argue with it, not even a troll.');
    }
    if (!G.flag('bouldersDone')) {
      await G.solve(P.boulders);
      G.set('bouldersDone');
      await G.say('bramble', 'Four tiddlers out. The rest go in the footings.');
    }
    if (!G.flag('deckDone')) {
      await G.solve(P.deck);
      G.set('deckDone');
    }
    await G.narr('* You spend the whole day building. Moss brings scones. Rowan brings the tractor. Tansy brings the goats, who are no help at all.', '* At sunset Bramble hauls the last cable tight and stands back.');
    G.set('bridgeBuilt'); G.save_.items.cable = 0;
    G.refresh();
    await G.say('bramble', 'Bridge No. 2. Four metres clear of the flood, like Mira wanted.', '...The road north is open, little one. For the first time since the storm, Lowmarsh is joined to the world again.');
    await G.say('rook', '{name}. Look west.');
    await G.narr('* Over the marsh, the fog is pulling back, rolling in on itself towards one place.', '* The Still.');
    await G.say('rook', 'Every problem you\'ve solved is someone in Lowmarsh remembering how to think. The fog is running out of village to feed on.', 'It\'s gone back to where it came from. To where she is.', 'The marsh is open. Let\'s go and get her.');
    G.set('chapter', 6); G.set('marshOpen'); G.set('fogLevel', 0.15);
    G.refresh();
    await G.card('CHAPTER 5 COMPLETE', 'The lock is open. The bridge stands.');
    await G.card('CHAPTER 6', 'THE STILL');
    G.hud(); G.save();
  };
  SC.crossBridge = async G => {
    await G.narr('* The new bridge. Beyond it, the road climbs north into the hills, towards the bigger towns, and the city beyond them.');
    if (!G.flag('miraFreed')) await G.say('rook', 'Not yet. We don\'t leave without Mira.');
    else await G.narr('* (Part Two, the rest of A level, lies up that road. It isn\'t built yet. Come back soon.)');
    await G.go('world', 49, 5, 'down');
  };

  // ── side quests (chapter 5 onwards) ──
  SC.rowanRace = async G => {
    await G.say('rowan', 'Tansy\'s organised a race. Tractor against motorbike. She says it\'s "for science". Will you work out what happens before I embarrass myself?');
    await G.solve(P.race);
    G.set('raceDone');
    await G.say('rowan', 'Eight metres ahead at best, then he catches me. Fair enough. The tractor\'s older than him.');
    G.give('flapjack', 1);
  };
  SC.kidShip = async G => {
    await G.say('kid', 'You do FORCES now? Look at my model ship!');
    await G.solve(P.modelShip);
    G.set('shipDone');
    await G.say('kid', 'Two seconds AND three seconds. It\'s a quadratic in disguise! Everything is a quadratic in disguise!');
  };
  SC.tansyBall = async G => {
    if (!G.flag('goatPullDone')) {
      await G.say('tansy', 'Physics question! I tied all three goats to the hay cart. It did NOT go where I expected.');
      await G.solve(P.goatPull);
      G.set('goatPullDone');
      await G.say('tansy', 'Fifteen newtons, north-east-ish, straight into the duck pond. Gerald pulled the wrong way on PURPOSE.');
      return;
    }
    await G.say('tansy', 'Gerald can\'t catch. I want to know exactly how long he has.');
    await G.solve(P.ballThrow);
    G.set('ballDone');
    await G.say('tansy', 'One point oh nine seconds. Gerald needs about four.');
    G.give('hourglass', 1);
  };
  SC.pimBike = async G => {
    await G.say('pim', 'I\'ve bought a bicycle! For the census returns! I timed my practice run but I can\'t make the graph make sense.');
    await G.solve(P.pimRide);
    G.set('pimRideDone');
    await G.say('pim', 'Six point two seven metres per second. I am a professional cyclist now. Basically.');
  };

  const wrap = (key, chapter, test, fn) => { const orig = SC[key]; SC[key] = async (G, e) => ((G.flag('chapter') || 0) >= chapter && test(G) ? fn(G, e) : orig(G, e)); };
  wrap('bramble', 5, G => G.flag('lockOpen') && !G.flag('bridgeBuilt'), SC.brambleBridge);
  wrap('rowan', 5, G => !G.flag('raceDone'), SC.rowanRace);
  wrap('kid1', 5, G => !G.flag('shipDone'), SC.kidShip);
  wrap('tansy', 5, G => !G.flag('ballDone') && !(G.has('soup') && !G.flag('soupDone')), SC.tansyBall);
  wrap('pim', 5, G => !G.flag('pimRideDone'), SC.pimBike);
  (SC.extraJobs = SC.extraJobs || []).push(...[
    [5, 'raceDone', 'The towpath race', 'Rowan, out in the meadows'],
    [5, 'shipDone', 'The model ship', 'a kid in the square'],
    [5, 'goatPullDone', 'Three goats, one cart', 'Tansy at the farm'],
    [5, 'ballDone', "Tansy's ball", 'Tansy at the farm'],
    [5, 'pimRideDone', "Pim's bike ride", 'Pim in the Town Hall'],
  ]);
})();
