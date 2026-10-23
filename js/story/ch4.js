// CHAPTER 4 "The Rising" — calculus and exponentials: first principles, rates of change, stationary points,
// optimisation, integration and areas, exponential models and logarithms. The flooded western meadows.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;
  const Q = id => window.PAPER_Q[id];
  const fromPaper = (id, extra) => Object.assign({ id: extra.id, topic: Q(id).topic, title: extra.title, giver: extra.giver, source: Q(id).source, context: extra.context, prompt: Q(id).prompt, steps: Q(id).steps, done: extra.done, diagram: extra.diagram }, extra.prompt ? { prompt: extra.prompt } : {}, extra.steps ? { steps: extra.steps } : {});
  const bed = 'x^3-6x^2+9x';

  // ───────────────────────── main problems ─────────────────────────
  P.gauge = {
    id: 'gauge', topic: 'diff', title: 'How Fast Is It Rising?', giver: 'rowan', source: 'Adapted from OCR H230/02 Oct 2021 Q4',
    context: 'Mira fitted a model to my gauge readings, back before the storm: the water is $h = 2t^2 - 3$ centimetres above the top of the field wall, $t$ hours after midnight. It\'s six in the morning now. The lockhouse floor sits 125 cm above the wall top.',
    diagram: Graph.svg({ w: 300, h: 190, x: [0, 9], y: [-10, 140], xstep: 1, ystep: 20, fns: [{ f: '2x^2-3', color: '#3f6fb0', label: 'water level' }], hlines: [{ y: 125, label: 'lockhouse floor', color: '#c0403a' }], labels: { x: 't (hours)', y: 'h (cm)' } }),
    prompt: R`Use differentiation from first principles to find how fast the water was rising at $t = 2$. Then find how fast it is rising now, and when it will reach the lockhouse floor.`,
    done: 'Rising 8 cm an hour at 2 a.m., 24 cm an hour now. The lockhouse floods at 8 a.m., in two hours\' time.',
    steps: [
      { ask: R`Level at $t = 2$: $h(2) = $ ?`, type: 'num', answer: 5, hint: R`$2(2)^2 - 3$`, explain: R`$h(2) = 8 - 3 = 5$ cm above the wall.` },
      { ask: R`A moment later, at $t = 2 + d$ (type $d$ for the small step of time). Expand $h(2 + d)$ fully.`, type: 'expr', vars: ['d'], answer: '5+8d+2d^2',
        hint: R`$2(2 + d)^2 - 3 = 2(4 + 4d + d^2) - 3$`, explain: R`$2(4 + 4d + d^2) - 3 = 5 + 8d + 2d^2$`,
        rook: 'Two moments, close together. Rise over run between them. That\'s all a gradient ever is.' },
      { ask: R`Gradient of the chord between the two moments: $\dfrac{h(2+d) - h(2)}{d} = $ ?`, type: 'expr', vars: ['d'], answer: '8+2d',
        hint: R`The top is $8d + 2d^2$. Divide every term by $d$.`, explain: R`$\dfrac{(5 + 8d + 2d^2) - 5}{d} = \dfrac{8d + 2d^2}{d} = 8 + 2d$` },
      { ask: R`Now let $d \to 0$. At 2 a.m. the water was rising at ... cm per hour.`, type: 'num', answer: 8,
        hint: R`What does $8 + 2d$ become as $d$ shrinks to nothing?`, explain: R`As $d \to 0$, $8 + 2d \to 8$, so $h'(2) = 8$ cm per hour.`,
        rook: 'That limit IS the derivative. Every rule you\'ll learn ("bring the power down, knock one off") is this, done once, in general.' },
      { ask: R`Doing the same in general gives $\dfrac{dh}{dt} = 4t$. How fast is it rising now, at $t = 6$? (cm per hour)`, type: 'num', answer: 24,
        hint: R`$4 \times 6$`, explain: R`$h'(6) = 24$ cm per hour, three times as fast as at 2 a.m. The rate itself is rising.` },
      { ask: R`When does it reach the lockhouse floor? Solve $2t^2 - 3 = 125$ for $t > 0$.`, type: 'num', answer: 8,
        hint: R`$2t^2 = 128$, so $t^2 = 64$.`, explain: R`$t^2 = 64 \Rightarrow t = 8$. Eight o'clock: two hours from now.` },
    ],
  };

  P.sail = fromPaper('m22-6', { id: 'sail', title: 'New Sails for the Windpump', giver: 'rowan',
    context: 'Mira was re-making the windpump sails before the storm. Each sail is a curved triangle of canvas, cut between two log curves she drew on the barn wall. I need to know the corners, and how far out a straight-edged triangle would be for the canvas.',
    done: 'Corners at A(1, 0), B(13/8, 0), C(2, 2). The straight-edged triangle is 0.625, under the true 0.656 by about 5%. Rowan cuts a little extra canvas.' });

  P.pump = fromPaper('o21-6', { id: 'pump', title: 'Will It Pump?', giver: 'rowan',
    context: 'The windpump\'s power goes as the cube of the wind speed. Mira\'s plate on the gearbox says 50 W at 3.6 m/s. Lifting this much water needs 225 W.',
    done: 'It needs 5.94 m/s of wind. This morning\'s westerly is blowing harder than that.',
    steps: Q('o21-6').steps.concat([
      { ask: 'Old Jan\'s anemometer reads 6.2 m/s this morning. Will the pump lift the water?', type: 'choice',
        choices: [R`Yes: $6.2 > 5.94$, and $P = kv^3 \approx 254$ W $> 225$ W`, R`No: $6.2$ m/s gives less than $225$ W`, R`Only if the wind doubles`, R`We can't tell without $k$`], answer: 0,
        hint: R`Compare $6.2$ with your answer, or work out $k \times 6.2^3$.`, explain: R`$0.00107 \times 6.2^3 \approx 254$ W. That's enough.`,
        rook: 'Cube laws are vicious. A little more wind gives a LOT more power. That\'s why windpumps stand on mounds.' },
    ]) });

  P.launch = fromPaper('o21-5', { id: 'launch', title: "Rowan's Launch", giver: 'rowan',
    context: 'My launch has one can of fuel left. Mira modelled the engine: $C$ miles per gallon at $v$ mph. Run it too slow and you burn fuel going nowhere; run it too fast and it drinks the stuff. The island is close, but I\'ll need to make the trip a lot.',
    done: 'Best economy at 50 mph, according to the model, though the model has its limits. Rowan says the launch has never done 50 in its life.' });

  P.shelter = fromPaper('m20-7', { id: 'shelter', title: 'The Goat Shelter', giver: 'tansy',
    context: 'The goats need a roof before the rain. I\'m making a model first out of card: a triangular prism, sloping sides, 600 cm² of card for all five faces. Mira said the best roof holds the most hay. What shape should it be?',
    done: 'Make it with x = 10 cm for the biggest roof, 828 cm³. Tansy scales the model up by twenty and the goats move in.' });

  P.riverbed = {
    id: 'riverbed', topic: 'diff', title: "Mira's Survey Stake", giver: null, source: 'OCR H230/01 June 2018 Q6(ii), June 2019 Q4(a)',
    context: 'A survey stake, driven into the top of the old bank. Mira\'s writing on a brass tag: "WEND, cross-section at the narrows. Bed: $y = x^3 - 6x^2 + 9x$ ($x$, $y$ in metres). Where is the top of the bank? Where is the bottom of the channel? Remember the shape. — M.H."',
    prompt: R`Sketch the curve $y = x^3 - 6x^2 + 9x$ and find its stationary points. This is the shape of the Wend's bed.`,
    done: 'Bank top at (1, 4), channel bottom at (3, 0). This is the shape Mira asked someone to remember.',
    steps: Q('o18-6ii').steps.concat([Q('o19-4a').steps[3]]),
  };

  // ───────────────────────── the Wend ─────────────────────────
  P.wendBed = {
    id: 'wendBed', topic: 'diff', title: 'The Shape of the Wend', giver: null, source: 'Built on OCR H230/01 June 2019 Q4(b)',
    context: 'The river\'s bed at the narrows is $y = x^3 - 6x^2 + 9x$. The Wend\'s surface is now 5 m up, over the top of her own bank, so she is one wide lake. To go back into her channel her level must fall to the bank top or below.',
    diagram: Graph.svg({ w: 300, h: 200, x: [-0.5, 4.5], y: [-1, 6], xstep: 1, ystep: 1, fns: [{ f: bed, color: '#8a6038', label: 'riverbed' }], hlines: [{ y: 5, label: 'flood now', color: '#3f6fb0' }, { y: 4, label: 'bank top', color: '#2a9d6a' }], labels: { x: 'x (m)', y: 'y (m)' } }),
    prompt: R`Confirm the nature of the stationary points, decide which water levels meet the bed only once, and find how much water (in cross-section) the channel holds when it's full to the bank top.`,
    done: 'The channel holds 6.75 m² of water in cross-section. Above 4 m the Wend is a flood; at 4 m and below she\'s a river again.',
    steps: [
      { ask: R`$\dfrac{d^2y}{dx^2} = $ ?`, type: 'expr', answer: '6x-12', hint: R`Differentiate $3x^2 - 12x + 9$.`, explain: R`$\dfrac{d^2y}{dx^2} = 6x - 12$` },
      { ask: R`At $x = 1$, $\dfrac{d^2y}{dx^2} = $ ? (So is $(1, 4)$ a maximum or a minimum?)`, type: 'num', answer: -6,
        hint: R`$6(1) - 12$`, explain: R`$-6 < 0$, so $(1, 4)$ is a maximum: the top of the bank.` },
      { ask: R`At $x = 3$, $\dfrac{d^2y}{dx^2} = $ ?`, type: 'num', answer: 6,
        hint: R`$6(3) - 12$`, explain: R`$6 > 0$, so $(3, 0)$ is a minimum: the bottom of the channel.` },
      { ask: R`A water level $y = c$ meets the bed exactly ONCE (one wide sheet of water, with no banks holding it) when...`, type: 'choice',
        choices: [R`$c > 4$ or $c < 0$`, R`$0 < c < 4$`, R`$c = 4$ only`, R`$c > 0$`], answer: 0,
        hint: R`Picture a horizontal line sliding up the graph. Between the minimum (0) and the maximum (4) it cuts three times.`,
        explain: R`Above the maximum or below the minimum, $y = c$ cuts the cubic once. That's the root-counting idea from June 2019 Q4(b), with $c = -k$.` },
      { ask: R`At the bank top, $c = 4$: $x^3 - 6x^2 + 9x - 4 = 0$. You know $(x - 1)^2$ is a factor (it touches at $x = 1$). The other root is $x = $ ?`, type: 'num', answer: 4,
        hint: R`$(x - 1)^2(x - a)$ has constant term $-a$. Compare it with $-4$.`, explain: R`$x^3 - 6x^2 + 9x - 4 = (x - 1)^2(x - 4)$, so the water reaches the far bank at $x = 4$.` },
      { ask: R`Water held in the channel when full to the bank top: $\displaystyle\int_1^4 \left(4 - (x^3 - 6x^2 + 9x)\right)dx = $ ? (m²)`, type: 'num', answer: 6.75,
        hint: R`Integrate $4 - x^3 + 6x^2 - 9x$ to $4x - \tfrac{x^4}{4} + 2x^3 - \tfrac{9x^2}{2}$, then do top limit minus bottom limit.`,
        explain: R`$\left[4x - \tfrac{x^4}{4} + 2x^3 - \tfrac92x^2\right]_1^4 = 8 - 1.25 = 6.75$ m²` },
    ],
  };
  P.wendBed.steps = P.wendBed.steps.map((s, i) => Object.assign({}, s, { react: [
    [['enemy', 'Six x... minus twelve. The bend of me. The way I CURVE.']],
    [['enemy', 'A peak. Yes... there was a high place. Where the willows stood. Where the woman with the notebook stood.']],
    [['enemy', 'And a deep place. A deep cool place where I was narrow and quick.'], ['rook', 'That\'s your channel. That\'s YOU.']],
    [['enemy', 'Above the bank I am one water. Wide. Thin. Everywhere and nowhere.'], ['enemy', 'Inside my banks I am... a river.']],
    [['enemy', 'From the willow bank to the far bank. Four lengths. I remember the far bank now.']],
    [['enemy', 'Six and three-quarters. So little. So much smaller than this.'], ['enemy', '...I was never meant to be this big.']],
  ][i] }));

  window.ENCOUNTERS.wend = {
    name: 'The Wend', sprite: 'wend', scale: 6, atk: 4,
    intro: '* The water heaves. The Wend rises out of the flood, a river standing on end. "DO NOT MEASURE ME."',
    check: '* THE WEND — ATK 6 DEF 12. Spirit of the river. Has spread so wide she has forgotten where her edges are.',
    flavor: ['* The floodwater laps at the causeway.', '* Something that used to be a hedge drifts past.', '* The Wend coils and uncoils. She can\'t settle on a shape.', '* Far off, Tansy\'s goats are bleating.', '* The windpump creaks round. Every turn lifts a bucket of her away.'],
    fightLine: 'You can\'t punch a river, {name}. Believe me, I\'ve watched people try.',
    talk: [
      [['enemy', 'I was a river once. Then the iron one shut the lock. Then the fog came down from the Still.'], ['enemy', 'And I could not remember what shape I was.']],
      [['enemy', 'The woman with the notebook stood on my bank that night. She said, "Remember your shape, whatever happens."'], ['rook', '...Mira.']],
      [['enemy', 'I do not WANT to drown the meadows. I do not know where I end.']],
      [['enemy', 'Show me. Show me my shape.']],
    ],
    taunts: ['DEEPER', 'WIDER', 'MINE', 'ALL OF IT', '~~~'],
    angry: ['DROWN', 'RISE', 'OVER THE BANK', 'NO EDGES'],
    attacks: [
      { pattern: 'rain', bullets: ['~', 'dy/dx', '~'], speed: 62, every: 340 },
      { pattern: 'sweep', bullets: ['RISE', '+4t', '~~'], speed: 66, every: 360 },
      { pattern: 'arc', bullets: ['∫', '~', '∫'], speed: 58, every: 300 },
      { pattern: 'spiral', bullets: ['x³', '−6x²', '+9x'], speed: 54, every: 250 },
    ],
    spareHint: '* The Wend sinks a little in the water. She is looking down at her own reflection. (The Wend can be SPARED.)',
    problem: P.wendBed,
  };

  // ───────────────────────── side problems ─────────────────────────
  P.soup = fromPaper('m18-6', { id: 'soup', title: "Fen's Soup Run", giver: 'fen',
    context: 'Tansy\'s been out on that farm island all night with the goats. I\'ve made leek and potato, 100 °C off the stove. The kitchen\'s at 25 °C, and the flask lets it cool like Mira\'s model. Tansy won\'t touch it below 45 °C. How long have you got?',
    done: 'About 6.6 minutes before it drops to 45 °C. Fen wraps the flask in three tea towels and says "RUN."' });
  P.midges = fromPaper('o22-6', { id: 'midges', title: 'The Midge Plague', giver: 'sorrel',
    context: 'The floodwater is breeding midges. Since the water came up, half my patients are bitten raw. I counted the swarms over the meadows every month. One model says $P = 100e^t$. I fitted a second one to the log of my counts. Which should I trust?',
    done: 'The fitted model gives k ≈ 31.6 and a ≈ 3.72, and it fits the data better than 100eᵗ. Sorrel orders a great deal of nettle cream.' });
  P.lantern = fromPaper('o19-7b', { id: 'lantern', title: "Wick's Beam", giver: 'wick',
    context: 'When I was young I kept a signal lamp on the west road. I set the lamp at ground level, at the origin of Mira\'s map, and the beam just grazed the top of Barrow Hill, whose outline is $y = e^{\\frac12x}$. Mira said it touched exactly where $x = 2$. Was she right?',
    done: 'The tangent at x = 2 is y = ½ex, which passes through the origin, so the lamp did just graze the hill. Wick looks very pleased with himself.' });
  P.colony = fromPaper('o21-2', { id: 'colony', title: 'The Shrinking Colony', giver: 'jan',
    context: 'The terns on Gull Point. Mira\'s model for the colony is $n = 12500 + \\frac{5000}{t}$, $t$ years after the survey began. I want to know how fast they\'re going, now that it\'s year five.',
    done: 'Falling by 200 birds a year at t = 5, and the fall is slowing. The model levels off at 12 500. Jan is relieved.' });
  P.levee = fromPaper('o22-5', { id: 'levee', title: "Bramble's Flood Bank", giver: 'bramble',
    context: 'Building a bank of earth so the Wend can\'t get at the village. Mira\'s drawing gives the slope of the top, $\\frac{dy}{dx} = x^2 - 3x$, and the bank passes through the post at (6, 20). I need the profile, and how much earth sits under it.',
    done: 'Profile y = x³/3 − 3x²/2 + 2. Bramble works out the earth by integrating and starts digging. Happily.' });
  P.ditch = fromPaper('m19-7', { id: 'ditch', title: "Moss's Drainage Ditch", giver: 'moss',
    context: 'I\'m digging a ditch to drain our garden into the stream. The ground follows $y = (5 - x)(x - 1)$ and the ditch has to go out to $x = a$. Mira said the shaded areas add up to 19, and that was exactly the right amount of digging. So where do I stop?',
    done: 'a = (9 + √21)/2 ≈ 6.79 m. Moss stops exactly there, plants a flag and goes for a nap.' });
  P.algae = fromPaper('o23-4', { id: 'algae', title: 'The Bloom in the Rock Pools', giver: 'nell',
    context: 'Green bloom spreading over the rock pools since the flood water ran down here. Mira\'s model for the covered area is $y = e^{3x}$. When does it reach 10 square metres, and how fast is it spreading by the second week?',
    done: 'It reaches 10 m² at x ≈ 0.768, and at x = 2 it\'s spreading at 3e⁶ ≈ 1210. Nell is going to need a bigger net.' });

  // ───────────────────────── chapter 4 script ─────────────────────────
  SC.log = async G => G.narr('* A great oak lies across the west road, roots and all. Only something very strong could shift it.');
  SC.fogMarsh = async G => G.narr(...['* The fog here is as thick as wool. Somewhere inside, it is very, very quiet.'].concat(G.flag('chapter') >= 4 ? ['* You can\'t go in yet. Not without knowing how to come back out.'] : []));
  SC.still = async G => G.narr('* A ring of standing stones, half sunk in the marsh. The air inside the ring doesn\'t move.');
  SC.cog = async G => {
    if (!G.flag('drained')) return G.narr('* A huge iron figure stands knee-deep in the floodwater by the lock. It hasn\'t moved. Rust runs down its arms like tears.');
    return SC._missing(G);
  };
  SC.lockgate = async G => G.narr('* The Wend Lock. The gates are shut tight, and the windlass is jammed with something.');
  SC.lockLog = async G => G.narr('* The lock-keeper\'s log. The last entry: "Storm. Lock shut on Cog\'s order, to save the village. Cog will not open it again. Cog says it is not SAFE. — D."');
  SC.winch = async G => G.narr('* A great windlass for the lock gates. Its cable is missing.');
  SC.farmDoor = async G => G.narr(G.flag('drained') ? '* Rowan\'s farmhouse. Everything is wet but nothing is ruined. Tansy has hung the goats\' names over the door.' : '* The water inside the farmhouse is up to the window sills. Tansy has rescued the kettle, the cat and a framed photo of a goat.');

  SC.arriveMeadows = async G => {
    G.set('meadowsSeen');
    await G.narr('* Past the fallen oak, Bramble has dragged it aside like a twig, the road opens onto the western meadows.', '* What were the meadows. It is a lake now, grey and still, right to the edge of the marsh.');
    await G.say('bramble', 'LITTLE ONE. Moved your tree. Took me four goes. Don\'t tell anyone about the first three.');
    await G.say('bramble', 'The water came up since the storm. Every day a bit more. Rowan\'s farm is out there in it. His girl\'s on the island with the goats.');
    await G.say('rook', 'The Wend\'s burst its banks. And look how fast it\'s coming up. You can watch the edge crawl over the grass.',
      'Rising water, {name}. How FAST it rises: that\'s a rate of change. That\'s calculus.');
    const c = await G.choose(['"How do you work out how fast something changes?"', '"Where\'s Rowan?"']);
    if (c === 0) await G.say('rook', 'You take two moments close together, and the gradient of the line between them. Then you move them closer, and closer...', 'Rowan will show you. He has a gauge.');
    await G.say('rook', 'That\'s Rowan on the shore, by the gauge post. Looks like he hasn\'t slept.');
    G.hud(); G.save();
  };

  SC.gauge = async G => G.narr(G.flag('drained') ? '* The gauge post. The water mark is back at the bottom where it belongs.' : G.flag('pumpOn') ? '* The gauge post. The level has stopped climbing. It\'s even crept down a centimetre.' : '* A gauge post: a plank marked in centimetres. The water creeps up it while you watch.');

  SC.rowan = async G => {
    if (G.flag('drained')) return G.say('rowan', ['Look at it. Grass. Mud, but grass. I could cry. I might.', 'The goats are back in the barn. Tansy is teaching them their tables.', 'Mira used to sit on that bank and sketch the river. Said every river has its own equation.'][Math.floor(Math.random() * 3)]);
    if (!G.flag('gaugeDone')) {
      await G.say('rowan', 'Who— oh. Mira\'s crow. And you\'ll be the one who lit the light. Rowan. That was my farm.',
        'My daughter Tansy rowed out last night to get the goats off the barn roof. The boat drifted off. She\'s on the island now with the goats, and the water\'s still rising.',
        'I\'ve been reading the gauge every hour. Mira fitted me a formula for it. I can\'t make the numbers say anything. I just need to know how long we\'ve got.');
      await G.solve(P.gauge);
      G.set('gaugeDone'); G.page('diff');
      await G.say('rowan', 'Eight o\'clock. Two hours. And it\'s getting FASTER.');
      await G.say('rook', 'Then we slow it down. Rowan, the old windpump at the end of the shore. Mira was mending it, wasn\'t she?');
      await G.say('rowan', 'Aye. Sails are rags and nobody knows if it\'ll lift enough. Her drawings are nailed up inside the door.', 'If it runs, it\'ll drop the water off the causeway. Then my launch can get out to Tansy.');
      G.hud();
      return;
    }
    if (!G.flag('pumpOn')) return G.say('rowan', 'The windpump. West end of the shore. Please.');
    if (!G.flag('launchDone')) return G.say('rowan', 'The causeway\'s showing! My launch is tied up halfway along it. Go. GO. I\'ll keep the pump turning.');
    if (!G.flag('shelterDone')) return G.say('rowan', 'Is she alright? Tell her to stay put. Tell her I said the goats aren\'t worth it. Don\'t tell the goats.');
    return G.say('rowan', 'The Wend\'s out by the causeway, isn\'t she. I can see her. My gran said you never look a river in the eye.', 'Mira did. Every day.');
  };

  SC.windpump = async G => {
    if (G.flag('pumpOn')) return G.narr('* The windpump turns steadily, clank... clank... Water gushes out of the spout into the drain.');
    if (!G.flag('gaugeDone')) return G.narr('* An old drainage windpump on a mound. Its sails hang in tatters.');
    if (!G.flag('sailDone')) {
      await G.narr('* Inside the door: Mira\'s drawings, nailed up. Two curves on squared paper, labelled "sail canvas".');
      await G.solve(P.sail);
      G.set('sailDone'); G.page('explog');
      await G.narr('* You and Rook pin the new canvas to the sail frames. Rook mostly supervises.');
      await G.say('rook', 'Logs, {name}. A log is just the question "what power?" turned into a function. Mira loved them. Said they made huge things small.');
    }
    await G.solve(P.pump);
    G.set('pumpOn');
    await G.narr('* You release the brake. The sails catch the westerly.');
    G.refresh(); G.shake();
    await G.narr('* Clank... clank... CLANK. Water spouts from the outlet into the old drain.', '* Slowly, out in the lake, a line of stones breaks the surface: the causeway.');
    await G.say('rook', 'There. The rate\'s turned negative. Somewhere on that graph is a stationary point, and we just walked past it.');
    G.hud(); G.save();
  };

  async function ride(G, x, y, dir) {
    await G.narr('* The launch putters across the flood.');
    await G.go('world', x, y, dir);
  }
  SC.launch = async G => {
    if (!G.flag('launchDone')) {
      await G.narr('* Rowan\'s launch, tied to a post on the causeway. A tin of fuel sits under the seat with Mira\'s model taped to the lid.');
      await G.solve(P.launch);
      G.set('launchDone'); G.refresh();
    }
    await ride(G, 15, 36, 'right');
    if (!G.flag('tansyMet')) await G.say('rook', 'There\'s Tansy, by the barn. And... several goats. I\'ll stay up here.');
    G.hud();
  };
  SC.launchBack = async G => ride(G, 9, 35, 'left');

  SC.tansy = async G => {
    if (G.flag('drained')) {
      if (G.has('soup') && !G.flag('soupDone')) return deliverSoup(G);
      return G.say('tansy', ['Pythagoras ate the shelter plans. He\'s a goat of very little brain.', 'When I grow up I\'m going to be a surveyor like Mira. Or a goat.', 'Dad keeps hugging me. It\'s embarrassing. I don\'t mind really.'][Math.floor(Math.random() * 3)]);
    }
    if (!G.flag('tansyMet')) {
      G.set('tansyMet');
      await G.say('tansy', 'Are you from Dad? Is he alright? I\'m FINE. The goats are fine. Gerald fell in but he\'s fine. He\'s a goat.',
        'It\'s going to rain again tonight. They\'ve got no roof, it\'s all under water. I\'m building them a shelter out of the barn doors.',
        'I\'m doing a model first, out of card. Mira taught me that. "Model it small, get it right, then build it big."');
    }
    if (!G.flag('shelterDone')) {
      await G.solve(P.shelter);
      G.set('shelterDone');
      await G.say('tansy', 'Ten centimetres high on the model, so two metres for real. Most hay for the least door. RIGHT.');
      await G.narr('* You help Tansy lash two barn doors into a roof. Three goats file under it at once, looking smug.');
      await G.say('tansy', 'There\'s a post up by the old bank with Mira\'s writing on it. She was out here measuring the river the day before the storm. She said it was important.');
      G.hud();
      return;
    }
    if (G.has('soup') && !G.flag('soupDone')) return deliverSoup(G);
    await G.say('tansy', G.flag('riverbedDone') ? 'You\'re going to TALK to the river? Mira used to talk to the river. Dad said she was weird. She was. I liked her.' : 'Mira\'s post is at the top corner of the island. Mind Gerald, he bites.');
  };
  async function deliverSoup(G) {
    G.save_.items.soup = 0;
    G.set('soupDone');
    await G.say('tansy', 'SOUP. Is it hot? It\'s hot! It\'s still hot!');
    await G.narr('* Tansy drinks the soup in one go. One of the goats tries to drink the flask.');
    G.give('flapjack', 2);
  }

  SC.goat = async G => G.narr(['* A goat. Its name tag says PYTHAGORAS. It is eating a pencil.', '* A goat. Its name tag says HYPATIA. It watches you with the calm of a much older animal.', '* A goat. Its name tag says GERALD. It is still damp, and furious about it.'][Math.floor(Math.random() * 3)]);

  SC.surveyStake = async G => {
    if (G.flag('riverbedDone')) return G.narr('* Mira\'s stake. "Remember the shape." Someone has scratched underneath, in a smaller hand: "WE WILL — T."');
    if (!G.flag('launchDone')) return G.narr('* A post on the old bank, out on the island. You can\'t reach it from here.');
    await G.solve(P.riverbed);
    G.set('riverbedDone');
    await G.say('rook', 'Bank top at (1, 4). Channel bottom at (3, 0). She measured the Wend the day before the storm, {name}.',
      '"Remember the shape." She wasn\'t writing to herself. She was writing to the river.');
    await G.say('rook', 'The Wend surfaced by the causeway. If she\'s forgotten her own shape, then we bring it back to her.');
    G.hud(); G.save();
  };

  SC.wend = async G => {
    if (!G.flag('riverbedDone') || !G.flag('shelterDone')) {
      await G.say('wend', '...who stands on my water...', '...I cannot find my edges... go away... go away...');
      return G.say('rook', G.flag('launchDone') ? 'Not yet. Tansy first, then whatever Mira left on that island.' : 'She\'s confused, not cruel. Let\'s get to Tansy first.');
    }
    await G.say('wend', 'You. You smell of HER. Of pencil and of wet notebook.', 'Everyone measures me. Measures how high, how fast, how much. I am TIRED of being measured.');
    await G.say('rook', 'We\'re not here to measure you. We\'re here to give you something back.');
    const r = await G.battle(window.ENCOUNTERS.wend);
    if (r !== 'spared') return;
    await G.say('wend', 'Narrow and quick. A peak where the willows stand. A deep cool place. Four lengths, bank to bank.', 'That is me. That is my shape.');
    await G.narr('* The Wend lowers herself into the flood. A long ripple runs out across the lake toward the old channel.');
    G.set('drained'); G.set('chapter', 5); G.set('fogLevel', 0.25);
    await G.go('world', 9, 30, 'down');
    await G.narr('* By noon the meadows are mud and grass and puddles. The Wend runs in her own bed again, quick and narrow.');
    await G.say('wend', 'Listen, little measurer. The woman with the notebook stood on my bank that night and the fog came down from the Still like a hand.',
      'The iron one, Cog, slammed the lock shut to save the village. Now I cannot reach the sea. I will hold my shape as long as I can.',
      'But when the autumn rain comes, I will rise again. Open the lock.');
    await G.say('rook', 'Cog. The lock golem. He\'s been standing in the water down there since the storm.', 'Forces, {name}. Mechanics. Every golem in the world is just a force diagram with opinions.');
    G.page('integ');
    G.give('hourglass', 1);
    await G.card('CHAPTER 4 COMPLETE', 'The Wend runs in her own bed again.');
    await G.card('CHAPTER 5', 'THE LOCK');
    G.hud(); G.save();
  };

  // ── Bramble on the west road ──
  SC.brambleWest = async G => {
    if (!G.flag('leveeDone')) return SC.brambleLevee(G);
    await G.say('bramble', ['Bank\'s holding. Earth is honest. Mostly.', 'Rowan offered me a goat as payment. I said no. The goat seemed relieved.', 'Go on. I\'ll watch the water.'][Math.floor(Math.random() * 3)]);
  };
  SC.brambleLevee = async G => {
    await G.say('bramble', 'Building a flood bank to keep the water off the village. Mira drew me the shape. Only she wrote it as the SLOPE, not the height. Why would you do that to a troll.');
    const c = await G.choose(['"I\'ll work it out."', '"Later, Bramble."']);
    if (c === 1) return G.say('bramble', 'Later. Bank and me will be here.');
    await G.solve(P.levee);
    G.set('leveeDone');
    await G.say('bramble', 'Integrate the slope, get the shape. Put the post in to find the plus-c. I LIKE plus-c. It\'s where the post goes.');
    G.give('hourglass', 1);
  };

  // ── side quests across the village (chapter 4 onwards) ──
  SC.fenSoup = async G => {
    await G.say('fen', 'Oh, love. Tansy\'s on that island and she\'ll be frozen. I\'ve got soup on. How long will it stay hot enough, though?');
    await G.solve(P.soup);
    await G.say('fen', 'Six and a half minutes! Off you go, quick as you can. And bring the flask back.');
    G.give('soup', 1);
    G.set('soupGiven');
  };
  SC.sorrelMidges = async G => {
    await G.say('sorrel', 'You again! Good. I have a statistics-adjacent emergency. Midges.');
    await G.solve(P.midges);
    G.set('midgesDone');
    await G.say('sorrel', 'Exponential growth, with a rate a bit under e. Nettle cream for EVERYONE.');
    G.give('flapjack', 1);
  };
  SC.wickLantern = async G => {
    await G.say('wick', 'Calculus, they tell me you\'re doing now! Let me test an old man\'s memory.');
    await G.solve(P.lantern);
    G.set('lanternDone');
    await G.say('wick', 'Through the origin! Sixty years I\'ve wondered if Mira was flattering me. She wasn\'t.');
  };
  SC.janColony = async G => {
    await G.say('jan', 'The terns. They\'re thinning out. Mira left me a model, but I can\'t tell how fast they\'re going.');
    await G.solve(P.colony);
    G.set('colonyDone');
    await G.say('jan', 'Two hundred a year, and slowing. They\'ll hold. Thank you, young one.');
    G.give('flapjack', 1);
  };
  SC.mossDitch = async G => {
    await G.say('moss', 'You know integration now? Mira left me a ditch problem and I\'ve been digging and filling the same hole for a WEEK.');
    await G.solve(P.ditch);
    G.set('ditchDone');
    await G.say('moss', 'Nine plus root twenty-one, over two. I\'m putting a flag in it. A big one.');
    G.give('hourglass', 1);
  };
  SC.nellAlgae = async G => {
    await G.say('nell', 'Floodwater brought a green bloom down to my rock pools. It\'s spreading. Faster every day.');
    await G.solve(P.algae);
    G.set('algaeDone');
    await G.say('nell', 'e to the three x. Faster every day, like I said. I\'ll net it out before it gets to the boats.');
    G.give('flapjack', 1);
  };

  const wrap = (key, test, fn) => { const orig = SC[key]; SC[key] = async (G, e) => ((G.flag('chapter') || 0) >= 4 && test(G) ? fn(G, e) : orig(G, e)); };
  wrap('fen', G => !G.flag('soupGiven'), SC.fenSoup);
  wrap('sorrel', G => !G.flag('midgesDone'), SC.sorrelMidges);
  wrap('wick', G => !G.flag('lanternDone'), SC.wickLantern);
  wrap('jan', G => !G.flag('colonyDone'), SC.janColony);
  wrap('moss', G => !G.flag('ditchDone'), SC.mossDitch);
  wrap('nell', G => !G.flag('algaeDone'), SC.nellAlgae);
  wrap('bramble', G => !G.flag('leveeDone'), SC.brambleLevee);
})();
