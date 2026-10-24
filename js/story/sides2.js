// The Part One expansion: the south bank of the Wend (Hob's footbridge, Windmill Hill, Pike's Pond,
// Bea's orchard) and the cove under Gull Point. Five new side quests, one per place, opening chapter by chapter.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;

  P.footbridge = {
    id: 'footbridge', topic: 'coord', title: 'The Footbridge Handrail', giver: 'hob', source: 'Lowmarsh original',
    context: 'Hob keeps the footbridge over the Wend. Since the storm its handrail wobbles, and he won\'t let anyone across until it\'s set right. On Mira\'s plan (in metres) the rail runs straight from post A(2, 1) to post B(10, 7). A brace has to run from the stump at C(4, 9) and meet the rail at right angles.',
    prompt: R`$A(2, 1)$, $B(10, 7)$, $C(4, 9)$. Find the gradient, midpoint, equation and length of $AB$, then the equation of the brace through $C$ perpendicular to $AB$.`,
    done: 'The rail is 3x − 4y − 2 = 0, ten metres long, with a middle post at (6, 4). The brace is 4x + 3y − 43 = 0. Hob tightens the last bolt and waves you across.',
    steps: [
      { ask: R`Gradient of $AB$:`, type: 'num', answer: 0.75, hint: 'Change in y over change in x.', explain: R`$\dfrac{7 - 1}{10 - 2} = \dfrac{6}{8} = \dfrac34$` },
      { ask: R`The middle post goes at the midpoint of $AB$:`, type: 'point', answer: [6, 4], hint: 'Average the x-coordinates, then the y-coordinates.', explain: R`$\left(\tfrac{2 + 10}{2}, \tfrac{1 + 7}{2}\right) = (6, 4)$` },
      { ask: R`Equation of the rail $AB$, in the form $ax + by + c = 0$ with integers:`, type: 'line', answer: '3x-4y-2',
        hint: R`$y - 1 = \tfrac34(x - 2)$. Multiply by 4 and bring everything to one side.`, explain: R`$4y - 4 = 3x - 6 \Rightarrow 3x - 4y - 2 = 0$` },
      { ask: R`Length of the rail $AB$ (m):`, type: 'num', answer: 10, hint: R`Pythagoras: $\sqrt{8^2 + 6^2}$.`, explain: R`$\sqrt{64 + 36} = 10$ m` },
      { ask: R`The brace through $C(4, 9)$, perpendicular to $AB$, in the form $ax + by + c = 0$:`, type: 'line', answer: '4x+3y-43',
        hint: R`Perpendicular gradient: $-\tfrac43$. Then $y - 9 = -\tfrac43(x - 4)$.`, explain: R`$3y - 27 = -4x + 16 \Rightarrow 4x + 3y - 43 = 0$`,
        rook: 'Perpendicular: flip the fraction, change the sign. Mira used to say it like a spell.' },
    ],
  };

  P.windmill = {
    id: 'windmill', topic: 'trig', title: 'The Windmill Sails', giver: 'agnes', source: 'Lowmarsh original',
    context: 'Agnes the miller is fixing the sails on Windmill Hill, and she wants to know where the tip of a sail will be before she climbs up to it. It turns steadily. t seconds after the tip passes its lowest point, its height above the ground is h = 12 − 7cos(30t)° metres.',
    prompt: R`$h = 12 - 7\cos(30t)^\circ$. Find the lowest and highest the tip goes, its height after 4 seconds, how long one turn takes, and when it first reaches 15 m.`,
    done: 'Five metres at the bottom, nineteen at the top, a turn every twelve seconds, and the tip passes 15 m at 3.85 seconds. Agnes times her climb to the second.',
    steps: [
      { ask: R`The lowest height of the tip (m), when $\cos(30t)^\circ = 1$:`, type: 'num', answer: 5, hint: R`$12 - 7 \times 1$`, explain: R`$12 - 7 = 5$ m` },
      { ask: 'The highest height of the tip (m):', type: 'num', answer: 19, hint: R`Cosine's smallest value is $-1$.`, explain: R`$12 - 7(-1) = 19$ m` },
      { ask: R`Height after $t = 4$ seconds (m):`, type: 'num', answer: 15.5, hint: R`$\cos 120^\circ = -\tfrac12$`, explain: R`$12 - 7\cos 120^\circ = 12 + 3.5 = 15.5$ m` },
      { ask: 'How long one full turn takes (seconds):', type: 'num', answer: 12, hint: R`The angle $30t$ has to go through $360^\circ$.`, explain: R`$30t = 360 \Rightarrow t = 12$ s` },
      { ask: R`When $h = 15$: $\cos(30t)^\circ = $ ?`, type: 'num', answer: '-3/7', hint: R`$12 - 7\cos(30t) = 15$`, explain: R`$-7\cos(30t) = 3 \Rightarrow \cos(30t) = -\tfrac37$` },
      { ask: R`So the first time the tip reaches 15 m is $t = $ ? (3 s.f.)`, type: 'num', answer: 3.8459, sf: 3,
        hint: R`$30t = \cos^{-1}\!\left(-\tfrac37\right)$. Then divide by 30.`, explain: R`$30t = 115.38^\circ \Rightarrow t = 3.85$ s`,
        rook: 'Inverse cos gives the first angle. That\'s exactly the one we want here: the first time.' },
    ],
  };

  P.pikefish = {
    id: 'pikefish', topic: 'data', title: "Pike's Big Fish", giver: 'pike', source: 'Lowmarsh original',
    context: 'Old Pike has fished the pond for fifty years and writes down every fish. This season: 20 fish. He\'s added up the lengths, x cm, and their squares: Σx = 640 and Σx² = 20 800. This morning he caught a 41 cm monster and wants to know if it really is unusual.',
    prompt: R`$n = 20$, $\sum x = 640$, $\sum x^2 = 20\,800$. Find the mean and standard deviation, decide whether a 41 cm fish is more than two standard deviations above the mean, and see what happens if every fish were 2 cm longer.`,
    done: 'Mean 32 cm, standard deviation 4 cm. The 41 cm fish is more than two standard deviations above the mean, so it really is a whopper. Pike has it framed. (He let it go first.)',
    steps: [
      { ask: 'Mean length (cm):', type: 'num', answer: 32, hint: R`$\bar x = \dfrac{\sum x}{n}$`, explain: R`$640 \div 20 = 32$ cm` },
      { ask: R`Variance: $\dfrac{\sum x^2}{n} - \bar x^2 = $ ?`, type: 'num', answer: 16, hint: R`$20\,800 \div 20 = 1040$, then subtract $32^2$.`, explain: R`$1040 - 1024 = 16$` },
      { ask: 'Standard deviation (cm):', type: 'num', answer: 4, hint: 'Square root of the variance.', explain: R`$\sqrt{16} = 4$ cm` },
      { ask: 'Is a 41 cm fish more than two standard deviations above the mean?', type: 'choice',
        choices: [R`Yes: $32 + 2 \times 4 = 40$, and $41 > 40$`, R`No: $41 < 32 + 2 \times 16$`, R`No: it's less than 10 cm above the mean`, 'You can\'t tell without the raw data'], answer: 0,
        hint: R`Work out $\bar x + 2\sigma$.`, explain: R`$\bar x + 2\sigma = 40$, and $41 > 40$: unusual by that rule.` },
      { ask: 'If every fish were 2 cm longer, the new mean would be:', type: 'num', answer: 34, hint: 'Adding 2 to every value moves the mean by 2.', explain: R`$32 + 2 = 34$ cm` },
      { ask: '...and the new standard deviation would be:', type: 'num', answer: 4, hint: 'Does adding the same amount to everything change how spread out they are?', explain: 'Still 4 cm: shifting every value by the same amount doesn\'t change the spread.',
        rook: 'Add a constant: the mean moves, the spread doesn\'t. Multiply: both change. That one turns up every year.' },
    ],
  };

  P.orchard = {
    id: 'orchard', topic: 'diff', title: "Bea's New Orchard", giver: 'bea', source: 'Lowmarsh original',
    context: 'Bea is planting a new apple orchard on the south bank, now the flood\'s gone down. The river makes one side; she has 120 m of fencing for the other three. The two sides that run away from the river are each x metres long.',
    prompt: R`The orchard is a rectangle with one side along the river and 120 m of fence for the other three sides. Find the area $A$ in terms of $x$, and use calculus to find the largest orchard Bea can make.`,
    done: 'Sides of 30 m away from the river and 60 m along it: 1800 m² of orchard. Bea plants forty apple trees and names the biggest one Rook. Rook pretends not to be pleased.',
    steps: [
      { ask: R`The side along the river is $120 - 2x$. Area $A$ in terms of $x$:`, type: 'expr', answer: '120x-2x^2', hint: 'Length times width.', explain: R`$A = x(120 - 2x) = 120x - 2x^2$` },
      { ask: R`$\dfrac{dA}{dx} = $ ?`, type: 'expr', answer: '120-4x', hint: 'Differentiate each term.', explain: R`$\dfrac{dA}{dx} = 120 - 4x$` },
      { ask: R`At the maximum, $\dfrac{dA}{dx} = 0$. So $x = $ ?`, type: 'num', answer: 30, hint: R`$120 - 4x = 0$`, explain: R`$x = 30$ m` },
      { ask: R`$\dfrac{d^2A}{dx^2} = $ ?`, type: 'num', answer: -4, hint: R`Differentiate $120 - 4x$.`, explain: R`$-4 < 0$, so it is a maximum.` },
      { ask: R`The largest area (m²):`, type: 'num', answer: 1800, hint: R`$x = 30$, so the river side is $120 - 60 = 60$.`, explain: R`$30 \times 60 = 1800$ m²`,
        rook: 'Always check it\'s a maximum. Examiners love a second derivative. So do I, frankly.' },
    ],
  };

  P.shells = {
    id: 'shells', topic: 'prob', title: "Shelly's Shell Game", giver: 'shelly', source: 'Lowmarsh original',
    context: 'Shelly combs the cove under Gull Point every morning. Today her bucket holds 5 pink shells and 3 white ones. She\'s invented a game for the village children: pull out two shells without looking, one after the other, without putting the first back.',
    prompt: R`5 pink and 3 white shells; two are taken without replacement. Find the probability that the first is pink, that both are pink, that both are white, and that she gets one of each.`,
    done: 'Both pink 5/14, both white 3/28, one of each 15/28. The children decide "one of each" wins. Shelly says that\'s what she was hoping.',
    steps: [
      { ask: 'P(the first shell is pink):', type: 'num', answer: '5/8', hint: '5 pink out of 8 shells.', explain: R`$\tfrac58$` },
      { ask: 'P(both pink):', type: 'num', answer: '5/14', hint: R`After a pink one, there are 4 pink left out of 7.`, explain: R`$\tfrac58 \times \tfrac47 = \tfrac{20}{56} = \tfrac{5}{14}$` },
      { ask: 'P(both white):', type: 'num', answer: '3/28', hint: R`$\tfrac38 \times \tfrac27$`, explain: R`$\tfrac{6}{56} = \tfrac{3}{28}$` },
      { ask: 'P(one of each colour):', type: 'num', answer: '15/28', hint: 'Everything else. Or: pink then white, plus white then pink.', explain: R`$1 - \tfrac{5}{14} - \tfrac{3}{28} = \tfrac{15}{28}$, or $\tfrac58 \cdot \tfrac37 + \tfrac38 \cdot \tfrac57 = \tfrac{30}{56}$`,
        rook: 'Two routes to the same answer. If they agree, you can stop worrying.' },
    ],
  };

  // ── the footbridge and Hob ──
  SC.hob = async G => {
    if (G.flag('hobDone')) return G.say('hob', ['Bridge is sound. I check it every morning anyway. Habit.', 'Windmill Hill\'s due south, the pond\'s west, Bea\'s orchard\'s east. Mind the geese.'][Math.floor(Math.random() * 2)]);
    await G.say('hob', 'Nobody crosses. Not till that handrail\'s right. It wobbled in the storm and I can\'t for the life of me remember how Mira set it out.', 'She left me the plan, mind. Numbers everywhere. Might as well be Greek.');
    await G.solve(P.footbridge);
    G.set('hobDone'); G.refresh();
    await G.say('hob', 'Three x minus four y minus two. I\'ll carve it on the post. Go on then, over you go: the south bank\'s lovely this time of year. Fog or no fog.');
  };
  SC.southSign = async G => G.narr('* SOUTH BANK. ← Pike\'s Pond · Windmill Hill ↓ · Bea\'s Orchard →');
  // ── Windmill Hill ──
  SC.agnes = async G => {
    if (G.flag('windmillDone')) return G.say('agnes', ['Twelve seconds a turn, regular as a heartbeat. Flour\'s never been finer.', 'I time my climbs by your numbers now. Three point eight five, and up I go.'][Math.floor(Math.random() * 2)]);
    if ((G.flag('chapter') || 0) < 2) return G.say('agnes', 'The sails are torn, the cogs are stiff, and the fog\'s got into the flour. Come back when the lighthouse is lit, love. I\'ll have it running by then, or know why not.');
    await G.say('agnes', 'There you are! I\'ve patched the sails. Now I need to get up to the tips without being swept off by one.', 'Mira worked out the height of a sail tip once. Cosines, she said. I nodded like I understood.');
    await G.solve(P.windmill);
    G.set('windmillDone');
    await G.say('agnes', 'Three point eight five seconds. I\'ll count it out loud. The goats will think I\'ve gone strange. They already do.');
  };
  SC.windmill = async G => G.narr(G.flag('windmillDone') ? '* The windmill turns steadily. Somewhere inside, a millstone grinds and Agnes sings along to it.' : '* An old windmill on the hill. Its sails creak round, slowly, as if it\'s trying to remember how.');
  // ── Pike's Pond ──
  SC.pike = async G => {
    if (G.flag('pikeDone')) return G.say('pike', ['Mean thirty-two, give or take four. Fish are more predictable than people.', 'You come back with a rod one day. I\'ll show you where the big ones sit.'][Math.floor(Math.random() * 2)]);
    if ((G.flag('chapter') || 0) < 3) return G.say('pike', 'Shh. They\'re biting.', '...No they\'re not. Come back another day. I\'ve fifty years of numbers in my notebook and no idea what to do with them.');
    await G.say('pike', 'Look at this one. LOOK at it. Forty-one centimetres. But is it big? Properly big? Or am I just excited?', 'I\'ve totted up the season in my book. Mira said there was a way to tell what "unusual" means.');
    await G.solve(P.pikefish);
    G.set('pikeDone');
    await G.say('pike', 'More than two standard deviations. I KNEW it. I\'m having it framed. Well. A drawing of it. Off you go, fish.');
  };
  SC.pier = async G => G.narr('* A little wooden pier. The water is so clear you can see the fish deciding not to bite.');
  // ── Bea's orchard ──
  SC.bea = async G => {
    if (G.flag('orchardDone')) return G.say('bea', ['Forty trees, and a fence that\'s exactly long enough. Not a metre to spare.', 'The bees love it. The bees love everything, to be fair.'][Math.floor(Math.random() * 2)]);
    if ((G.flag('chapter') || 0) < 4) return G.say('bea', 'Hello, petal! I\'m Bea. I keep the bees and the old orchard.', 'I want to plant a new one, by the river, but I\'ve only got so much fencing. Come and see me another time and we\'ll put our heads together.');
    await G.say('bea', 'The flood\'s left the riverbank lovely and soft. Perfect for new trees!', 'One hundred and twenty metres of fence, and the river does the fourth side. How big can I make it?');
    await G.solve(P.orchard);
    G.set('orchardDone');
    await G.say('bea', 'Eighteen hundred square metres! I\'ll name the biggest tree after your crow.');
    await G.say('rook', '...I\'m not saying I\'m touched. But I\'m not NOT saying it.');
  };
  SC.hives = async G => G.narr('* Beehives, humming. A sign: "PLEASE DO NOT TELL THE BEES ABOUT THE FOG. THEY WORRY."');
  // ── the cove ──
  SC.shelly = async G => {
    if (G.flag('shellsDone')) return G.say('shelly', ['The children play shell-game every morning now. One of each wins. Fifteen twenty-eighths of the time!', 'The tide brings in a new story every day. Mostly crabs.'][Math.floor(Math.random() * 2)]);
    if ((G.flag('chapter') || 0) < 2) return G.say('shelly', 'Oh! You found my cove. Nobody comes down here while the fog\'s on the cliff road.', 'Come back when it\'s cleared. I\'ve got a game I want to try, but I need someone good with chances.');
    await G.say('shelly', 'Five pink, three white. Two out, no peeking, no putting back.', 'I want the game to be fair for the children. What are the chances?');
    await G.solve(P.shells);
    G.set('shellsDone');
    await G.say('shelly', 'Fifteen twenty-eighths for one of each. That\'s more than a half! Lovely. The little ones will win more than they lose.');
  };
  SC.cave = async G => G.narr('* A sea cave under the cliff. Something has scratched a tally on the wall: four marks and a line through them, over and over, all the way into the dark.', '* Mira, counting the tides.');
  SC.rockpool = async G => G.narr('* A rock pool. A tiny crab glares at you from under a strand of weed.');

  (SC.extraJobs = SC.extraJobs || []).push(
    [1, 'hobDone', 'The footbridge handrail', 'Hob, at the footbridge over the Wend (south of the jetty path)', 'footbridge'],
    [2, 'shellsDone', "Shelly's shell game", 'Shelly, in the cove below Gull Point', 'shells'],
    [2, 'windmillDone', 'The windmill sails', 'Agnes, on Windmill Hill (over the footbridge)', 'windmill'],
    [3, 'pikeDone', "Pike's big fish", 'Old Pike, at the pond on the south bank', 'pikefish'],
    [4, 'orchardDone', "Bea's new orchard", 'Bea, in the orchard on the south bank', 'orchard'],
  );
})();
