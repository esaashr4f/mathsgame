// CHAPTER 6 "The Still": the AS finale. Proof: Mira's unfinished proofs scattered as echoes in the marsh,
// then the Hush, the thing that makes people stop asking why. Ends Part One (AS level).
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;
  const Q = id => window.PAPER_Q[id];

  // ───────────────────────── Mira's echoes ─────────────────────────
  P.echo1 = { id: 'echo1', topic: 'proof', title: 'Echo: Not Divisible by Three', giver: 'mira', source: Q('o18-5').source,
    context: 'A pale shape of Mira, kneeling in the reeds, writing the same line over and over: "N not divisible by 3... then N² is... then N² is..."',
    prompt: Q('o18-5').prompt, steps: Q('o18-5').steps,
    done: 'Both cases end in "one more than a multiple of 3". The echo finishes the line, smiles, and is gone.' };
  P.echo2 = { id: 'echo2', topic: 'proof', title: 'Echo: Three Proofs in the Reeds', giver: 'mira', source: 'Topic questions: Proof, Q1 and Q3',
    context: 'An echo of Mira at a little folding table in the marsh, with three proofs on it and none of them finished. "Counter-example. Then algebra. Then exhaustion. Every kind. You have to know every kind."',
    prompt: R`(a) Show by counter-example that the claim "for every prime between 20 and 40, the sum of the squares of its digits is odd" is false. (b) Prove that the sum of the squares of any three consecutive positive integers is never divisible by 3. (c) Prove by exhaustion that no 2-digit number whose digits add up to 5 is a perfect square.`,
    done: 'One counter-example, one algebraic proof and one proof by exhaustion. The echo folds up her table and fades out.',
    steps: [
      { ask: 'The primes between 20 and 40 are 23, 29, 31, 37. Which one breaks the claim?', type: 'choice',
        choices: [R`$31$: $3^2 + 1^2 = 10$, which is even`, R`$23$: $4 + 9 = 13$`, R`$29$: $4 + 81 = 85$`, R`None: the claim is true`], answer: 0,
        hint: 'Work out each sum of squares and look for an even one.', explain: R`$31$ gives $9 + 1 = 10$, which is even, so the claim is false. ($37$ gives $9 + 49 = 58$ and works too. You only ever need one.)`,
        rook: 'One counter-example kills a "for every" claim. Just one. That\'s the cheapest proof there is.' },
      { ask: R`Call the integers $n - 1$, $n$, $n + 1$. Simplify $(n-1)^2 + n^2 + (n+1)^2$.`, type: 'expr', vars: ['n'], answer: '3n^2+2',
        hint: R`$(n - 1)^2 = n^2 - 2n + 1$ and $(n + 1)^2 = n^2 + 2n + 1$. The $2n$ terms cancel.`, explain: R`$n^2 - 2n + 1 + n^2 + n^2 + 2n + 1 = 3n^2 + 2$` },
      { ask: 'So:', type: 'choice', choices: [R`$3n^2 + 2$ is a multiple of 3, plus 2, so it always leaves remainder 2 when divided by 3`, R`$3n^2 + 2$ is divisible by 3 when $n$ is even`, R`It works for $n = 1, 2, 3$, so it's true`, R`$3n^2 + 2$ is always odd`], answer: 0,
        hint: 'What is the remainder when you divide by 3?', explain: R`$3n^2$ is a multiple of 3, so $3n^2 + 2$ leaves remainder 2: never divisible by 3. $\blacksquare$`,
        rook: 'Notice that option three is just checking examples. Examples are never a proof of "always". Not even a thousand of them.' },
      { ask: 'Proof by exhaustion: list every 2-digit number whose digits add to 5.', type: 'set', answer: [14, 23, 32, 41, 50],
        hint: 'Tens digit 1, 2, 3, 4, 5 (it can\'t be 0).', explain: R`$14, 23, 32, 41, 50$` },
      { ask: 'Are any of them perfect squares?', type: 'choice', choices: [R`No: the 2-digit squares are 16, 25, 36, 49, 64, 81, and none of them is on the list`, R`Yes, 23`, R`Yes, 41`, R`We can\'t check them all`], answer: 0,
        hint: 'List the 2-digit squares.', explain: R`The 2-digit squares are $16, 25, 36, 49, 64, 81$. None of them is in the list, so the statement is proved by exhaustion. $\blacksquare$` },
    ] };
  P.echo3 = { id: 'echo3', topic: 'proof', title: 'Echo: Odd Numbers', giver: 'mira', source: Q('o21-8').source,
    context: 'The last echo, standing ankle-deep in a pool. Ripples spread from where she stands, in pairs, two odd numbers apart.',
    prompt: Q('o21-8').prompt, steps: Q('o21-8').steps,
    done: 'mn + 1 = (n + 1)², and n + 1 is even. The last echo turns towards the Still and walks into it.' };

  // ───────────────────────── the Hush ─────────────────────────
  P.hush = {
    id: 'hush', topic: 'proof', title: 'The Hush', giver: null, source: 'OCR H230/02 June 2022 Q3, June 2018 Q3; H230/01 June 2023 Q7',
    context: 'The Hush only ever says things. It never says WHY. To break its hold on Mira you have to answer it the only way it can\'t: with proof, in every form you know. Counter-example. Implication. Algebra.',
    prompt: R`Disprove the Hush's claim about irrational numbers; decide which way each implication goes; then prove that the mean of two squares is never less than the square of the mean.`,
    done: 'Disproved, decided and proved. Nothing the Hush said survived being asked why.',
    steps: [Q('m22-3').steps[0]].concat(Q('m18-3').steps, Q('o23-7').steps.slice(0, 2)),
  };
  P.hush.steps = P.hush.steps.map((s, i) => Object.assign({}, s, { react: [
    [['enemy', 'irrational and irrational is irrational. obviously. everyone knows. hush.'], ['enemy', '...√2 and −√2. zero. ...hm.']],
    [['enemy', 'this, therefore that. why ask which way the arrow points. it points. hush.']],
    [['enemy', 'two is the answer, so two is the only answer. ...'], ['rook', 'Real x. Only one real fifth root of 32. It IS both ways. Hush yourself.']],
    [['enemy', 'ln y less than nought... y less than one... the same. the same...'], ['enemy', '...unless y is negative. and then ln y is nothing at all.']],
    [['enemy', 'the mean of the squares and the square of the mean. who cares. close enough. it doesn\'t matter.'], ['enemy', '...a minus b, squared, over four.']],
    [['enemy', 'a square is never negative...'], ['enemy', 'so it is always true. not because i said. because it CAN\'T be otherwise.'], ['text', '* The Hush is very quiet now. Not hushing. Just quiet.']],
  ][i] }));

  window.ENCOUNTERS.hush = {
    name: 'The Hush', sprite: 'hush', scale: 6, atk: 6,
    intro: '* The fog folds itself into a shape. It has no face, just a finger to its lips.  "shhhhh."',
    check: '* THE HUSH — ATK ? DEF ?. The part of every mind that says "don\'t bother asking". Has never once given a reason.',
    flavor: ['* The standing stones hum, very low.', '* Mira stands frozen in the middle of the ring, pencil raised.', '* Rook has gone completely silent. It\'s the first time you\'ve ever seen that.', '* The fog presses on your ears like deep water.', '* Somewhere very far off, Fen\'s voice: "Show your working, love."'],
    fightLine: '...You can\'t hit it. It\'s not even there, it\'s just the absence of a reason.',
    talk: [
      [['enemy', 'why do you keep asking why. things are true. things are false. accept.'], ['rook', 'That\'s the Hush. That\'s what got the whole village. "Just accept it. Don\'t check."']],
      [['enemy', 'she came here with her notebook. she asked and asked. so tiring. i made her quiet.']],
      [['enemy', 'you could stop. you could rest. you don\'t need to know WHY. nobody needs to know why.'], ['text', '* For a moment that sounds very nice.'], ['rook', '{name}. Don\'t you dare.']],
      [['enemy', '...what IS a proof. tell me. show me. if you can.']],
    ],
    taunts: ['shh', 'obviously', 'just accept it', 'everyone knows', 'trust me', 'don\'t check'],
    angry: ['SHHH', 'STOP ASKING', 'OBVIOUSLY', 'IT JUST IS'],
    attacks: [
      { pattern: 'spiral', bullets: ['shh', 'obviously', '…'], speed: 52, every: 220 },
      { pattern: 'rain', bullets: ['just accept it', 'shh'], speed: 66, every: 330 },
      { pattern: 'sweep', bullets: ['everyone knows', '⇒?', '⇐?'], speed: 70, every: 340 },
      { pattern: 'arc', bullets: ['it just is', 'shh'], speed: 62, every: 280 },
    ],
    spareHint: '* The Hush is not hushing any more. It is listening. (The Hush can be SPARED.)',
    problem: P.hush,
  };

  // ───────────────────────── chapter 6 script ─────────────────────────
  SC.enterStill = async G => {
    if (G.flag('stillSeen')) return;
    G.set('stillSeen');
    await G.narr('* The marsh is silent. No birds. No wind. Your footsteps make no sound in the reeds.', '* Ahead, a ring of old standing stones. Several of them are cracked right through.', '* In the middle of the ring, a woman stands perfectly still, pencil raised, as if she has stopped mid-sentence.');
    await G.say('rook', '...Mira.', 'MIRA!');
    await G.narr('* She doesn\'t move. The fog around her is so thick it looks solid.');
    await G.say('rook', 'She can\'t hear me. She can\'t hear ANYTHING.', 'Look. Shapes in the reeds, all around the marsh. Pale. Like her.');
    const c = await G.choose(['"Echoes of her?"', '"What happened to her?"']);
    if (c === 0) await G.say('rook', 'Her thoughts. Half-finished ones. Proofs she never got to the end of. The fog pulled them right out of her.');
    else await G.say('rook', 'Something took her thinking away a piece at a time, and left the pieces lying out there in the reeds.');
    await G.say('rook', 'Finish them for her, {name}. All three. Then we bring her home.');
    G.hud(); G.save();
  };
  SC.still = async G => G.narr(G.flag('miraFreed') ? '* The Still. The cracked stones have been propped back up with driftwood and string. It looks ridiculous, and it\'s holding.' : '* A ring of standing stones, half sunk in the marsh. The air inside the ring doesn\'t move.');

  const echoLines = {
    echo1: ['...one more than a multiple of three. Always. Both cases. Why did I ever doubt it...', 'mira'],
    echo2: ['...every kind of proof. Counter-example, algebra, exhaustion. You need all of them, Rook. Remind the student.', 'mira'],
    echo3: ['...an even number, squared. Of course. Of course it is.', 'mira'],
  };
  ['echo1', 'echo2', 'echo3'].forEach(k => {
    SC[k] = async G => {
      if (G.flag(k + 'Done')) return;
      await G.say('mira', ['...where was I... the next line... I can\'t find the next line...', '...not enough to check examples... there has to be a reason...', '...two odd numbers... their product plus one... is a square of... of...'][Number(k.slice(-1)) - 1]);
      await G.solve(P[k]);
      G.set(k + 'Done');
      await G.say(echoLines[k][1], echoLines[k][0]);
      G.refresh();
      const left = ['echo1', 'echo2', 'echo3'].filter(e => !G.flag(e + 'Done')).length;
      await G.say('rook', left ? (left === 1 ? 'One more. The fog around the stones is thinning. I can see her face.' : 'That\'s one. Did you see? The fog round her flickered.') : 'That\'s all three. Now, {name}. The stones.');
      if (!left) G.page('proof');
      G.hud(); G.save();
    };
  });

  SC.miraFogged = async G => {
    if (!(G.flag('echo1Done') && G.flag('echo2Done') && G.flag('echo3Done'))) {
      await G.narr('* Mira stands frozen, pencil raised. Her eyes are open but she isn\'t looking at anything.');
      return G.say('rook', 'Her thoughts are still out in the reeds. Find the echoes first.');
    }
    await G.narr('* As you step into the ring, the fog peels away from Mira and gathers itself up into a shape.');
    await G.say('hush', 'shhhh.', 'she is resting. she asked too many questions. you ask too many questions too.');
    const r = await G.battle(window.ENCOUNTERS.hush);
    if (r !== 'spared') return;
    await G.say('hush', '...it can\'t be otherwise.', 'i never knew that there were things that could not be otherwise. i only ever knew things that were. i didn\'t know there was a WHY under them.');
    await G.narr('* The Hush settles into the cracked stones like water into sand.');
    await G.say('hush', 'i will stay here. in the stones. i will be... quiet. but not the hushing kind.');
    G.set('miraFreed'); G.set('chapter', 7); G.set('fogLevel', 0);
    G.refresh(); G.shake();
    await G.narr('* The last of the fog lifts off the marsh like a sheet off a bed.', '* For the first time since you arrived, you can see the sky over Lowmarsh. It is enormous, and very blue.');
    await G.say('mira', '...the next line is "therefore".', '...Rook?');
    await G.say('rook', 'MIRA. Mira Mira Mira. You absolute IDIOT. You walked into a FOG MONSTER with a PENCIL.');
    await G.say('mira', 'It was a very good pencil.', 'And you. You must be Fen\'s {name}. The one with the maths book.');
    const c = await G.choose(['"You asked for me. Why?"', '"Are you alright?"']);
    if (c === 1) await G.say('mira', 'Stiff. Hungry. Behind on about a month of paperwork. But I\'m alright, thanks to you.');
    await G.say('mira', 'Fen talked about you constantly. "Not a maths person," she said you said. "But they never stop asking why."',
      'That\'s the only thing the Hush can\'t touch. Not knowing the answers. Asking why, and then working it out.',
      'The storm cracked the stones of the Still. The Hush got out and settled on Lowmarsh, and everybody just... stopped checking. Stopped working things out.',
      'I came out here to put it back, and it got me halfway through a proof. All I could do was hold it at the Still. The fog was me holding the door shut.');
    await G.say('rook', 'And all the time you were stood here, {name} was out there, working it all out again. One problem at a time. A plank, a bridge, a lighthouse, a census, a river, a lock.');
    await G.say('mira', 'Every one of those was someone in Lowmarsh remembering how to think. That\'s what really beat it.', 'Come on. Fen will have baked something enormous.');
    await G.go('workshop', 6, 7, 'up');
    await G.narr('* That evening the whole village crams into Mira\'s workshop. Fen has baked something enormous.', '* The Mayor makes a speech. It goes on for a long time. Bramble cries. Strix pretends not to. Cog has been oiled specially.');
    await G.say('fen', 'Two weeks of sea air, I told your mum. "Nothing ever happens in Lowmarsh," I told her.', 'I am NOT telling her about the fog monster.');
    await G.say('mira', 'One more thing, {name}. Those stones were not the only Still.', 'There are others, up the valley, past the bridge. Bigger ones. Older. I\'ve seen the fog on the hills from the lighthouse at night.',
      'The mathematics gets harder up there. A lot harder. You\'ll need everything you learned here, and a great deal more.', 'When you\'re ready, the road north is open.');
    await G.say('rook', 'And I\'m coming. Obviously. Someone has to tell you to show your working.');
    G.set('asComplete');
    await G.card('PART ONE COMPLETE', 'AS Level, done. Lowmarsh remembers how to think.');
    await G.card('TO BE CONTINUED', 'Part Two: the road north, and the rest of A level.');
    G.hud(); G.save();
  };

  SC.miraHome = async G => G.say('mira', [
    'Drills, past papers, the Daily Dive. Use them. Doing it again in the exam hall is a different kind of brave.',
    'Rook tells me you got stuck on hypothesis tests the same way I did at your age. "Proves" is not the word. Ever.',
    'Show your working. Not for the examiner. For you, three weeks later.',
    'I\'ve started mending the theodolite. When the road north opens properly, we\'ll need it.',
    'Thank you, {name}. I mean it.',
  ][Math.floor(Math.random() * 5)]);
})();
