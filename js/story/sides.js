// Extra side quests built from the OCR topic question packs, hooked onto villagers across Parts of the story.
// Each one waits until its chapter, then takes over that villager's next conversation until it's done.
(function () {
  'use strict';
  const R = String.raw;
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;

  P.flowerbed = {
    id: 'flowerbed', topic: 'quadratics', title: 'The Square Flower Bed', giver: 'villager', source: 'Topic questions: Inequalities, Q5',
    context: 'The council wants a new flower bed in the square for when the bridge reopens. The rules: its length is 3 m more than its width; the length must be at least 14.5 m; and the area must be under 180 m² or the Mayor says it\'s "ostentatious".',
    prompt: R`The width of the bed is $x$ m. By writing and solving inequalities in $x$, find the set of possible widths.`,
    done: '11.5 ≤ x < 12. Not much room, but the bed gets dug and the tulips go in.',
    steps: [
      { ask: R`Length condition: $x + 3 \ge 14.5$. So $x \ge$ ?`, type: 'num', answer: 11.5, hint: 'Subtract 3.', explain: R`$x \ge 11.5$` },
      { ask: R`Area condition: $x(x + 3) < 180$, i.e. $x^2 + 3x - 180 < 0$. Roots of $x^2 + 3x - 180 = 0$:`, type: 'set', answer: [-15, 12],
        hint: R`Two numbers multiplying to $-180$ and adding to $3$.`, explain: R`$(x + 15)(x - 12) = 0 \Rightarrow x = -15, 12$` },
      { ask: R`So $x^2 + 3x - 180 < 0$ when...`, type: 'choice', choices: [R`$-15 < x < 12$`, R`$x < -15$ or $x > 12$`, R`$x < 12$`, R`$x > -15$`], answer: 0,
        hint: 'A positive quadratic is negative BETWEEN its roots.', explain: R`U-shaped curve, below the axis between the roots: $-15 < x < 12$.`,
        rook: 'Sketch it. Every time. A quick U with two crossings saves you from the classic wrong-way-round mistake.' },
      { ask: 'Putting both conditions together (and a width must be positive):', type: 'choice', choices: [R`$11.5 \le x < 12$`, R`$-15 < x < 12$`, R`$x \ge 11.5$`, R`$11.5 < x \le 12$`], answer: 0,
        hint: 'Both must be true at once. Watch which ends are included.', explain: R`$x \ge 11.5$ AND $x < 12$: $\{x : 11.5 \le x < 12\}$.` },
    ],
  };

  P.footpath = {
    id: 'footpath', topic: 'coord', title: 'The New Footpath', giver: 'tomas', source: 'Topic questions: Straight Lines, Q3',
    context: 'On Mira\'s village map, the old wall runs from the Well, A(5, 7), down to the Mill, B(−1, −5). The council wants a footpath from the Well running at right angles to the wall, so the market carts can get round it.',
    prompt: R`$A$ is $(5, 7)$ and $B$ is $(-1, -5)$. (i) Find the midpoint of $AB$. (ii) Find the equation of the line through $A$ perpendicular to $AB$, in the form $ax + by + c = 0$.`,
    done: 'Midpoint (2, 1). The footpath is x + 2y − 19 = 0. Tomas paints it on the cobbles himself.',
    steps: [
      { ask: R`Midpoint of $AB$:`, type: 'point', answer: [2, 1], hint: 'Average the x-coordinates, then average the y-coordinates.', explain: R`$\left(\tfrac{5 + (-1)}{2}, \tfrac{7 + (-5)}{2}\right) = (2, 1)$` },
      { ask: R`Gradient of $AB$:`, type: 'num', answer: 2, hint: R`$\dfrac{7 - (-5)}{5 - (-1)}$`, explain: R`$\dfrac{12}{6} = 2$` },
      { ask: 'Gradient of a line perpendicular to AB:', type: 'num', answer: -0.5, hint: 'Negative reciprocal.', explain: R`$-\tfrac12$, because $m_1 m_2 = -1$.` },
      { ask: R`The footpath through $A(5, 7)$, in the form $ax + by + c = 0$ with integers:`, type: 'line', answer: 'x+2y-19',
        hint: R`$y - 7 = -\tfrac12(x - 5)$. Multiply by 2 and bring everything to one side.`, explain: R`$2y - 14 = -x + 5 \Rightarrow x + 2y - 19 = 0$` },
    ],
  };

  P.fishpen = {
    id: 'fishpen', topic: 'coord', title: "Nell's Round Fish Pen", giver: 'nell', source: 'Topic questions: Circles, Q6',
    context: 'I\'m staking out a round fish pen in the shallows. The two posts I\'ve got, A(3, 0) and B(9, 8), are opposite ends of a diameter. I need the centre for the middle post, and a straight boom to run along the edge, touching the pen at B.',
    prompt: R`$A(3, 0)$ and $B(9, 8)$ are the ends of a diameter of a circle. (a) Find the centre. (b) Find the equation of the tangent at $B$.`,
    done: 'Centre (6, 4), radius 5. The boom runs along 3x + 4y = 59.',
    steps: [
      { ask: 'Centre of the circle:', type: 'point', answer: [6, 4], hint: 'The centre is the midpoint of a diameter.', explain: R`$\left(\tfrac{3 + 9}{2}, \tfrac{0 + 8}{2}\right) = (6, 4)$` },
      { ask: 'Gradient of the radius from the centre to B:', type: 'num', answer: '4/3', hint: R`$\dfrac{8 - 4}{9 - 6}$`, explain: R`$\tfrac43$` },
      { ask: R`The tangent at $B$ is perpendicular to the radius. Its equation:`, type: 'line', answer: '3x+4y-59',
        hint: R`Gradient $-\tfrac34$ through $(9, 8)$: $y - 8 = -\tfrac34(x - 9)$.`, explain: R`$4y - 32 = -3x + 27 \Rightarrow 3x + 4y - 59 = 0$`,
        rook: 'Tangent meets radius at a right angle. Circles have very few facts, but they are LOUD ones.' },
    ],
  };

  P.rocks = {
    id: 'rocks', topic: 'trig', title: 'The Two Rocks', giver: 'ottoline', source: 'Topic questions: Sine and Cosine Rules, Q1',
    context: 'Now the light is on, I should chart the hazards again. From my log: the lamp, A, is 14 cables from the Cormorant, C. The Cormorant is 10 cables from the Widow, B. And the angle at the Widow between the other two is 63°. Where does that put the lamp from the Widow?',
    prompt: R`Triangle $ABC$ has $AC = 14$, $BC = 10$ and angle $ABC = 63°$. (i) Find angle $CAB$. (ii) Find $AB$.`,
    done: 'Angle A = 39.5°, and AB = 15.3 cables. Ottoline inks it into the log in very old-fashioned handwriting.',
    steps: [
      { ask: R`Sine rule: $\dfrac{\sin A}{10} = \dfrac{\sin 63°}{14}$. Angle $A$ (1 d.p.):`, type: 'num', answer: 39.5185, dp: 1,
        hint: R`$\sin A = \dfrac{10\sin63°}{14} = 0.636\ldots$`, explain: R`$A = \sin^{-1}(0.6364) = 39.5°$. (The obtuse option, $140.5°$, can't fit alongside $63°$.)`,
        rook: 'Sine rule: when you know a side and the angle OPPOSITE it. Cosine rule: when you don\'t.' },
      { ask: 'Angle C (1 d.p.):', type: 'num', answer: 77.4815, dp: 1, hint: R`Angles in a triangle: $180 - 63 - 39.5$`, explain: R`$C = 77.5°$` },
      { ask: R`$AB$ (3 s.f.):`, type: 'num', answer: 15.339, sf: 3, hint: R`$\dfrac{AB}{\sin C} = \dfrac{14}{\sin 63°}$`, explain: R`$AB = \dfrac{14\sin 77.48°}{\sin 63°} = 15.3$` },
    ],
  };

  P.pond = {
    id: 'pond', topic: 'quadratics', title: "Moss's Round Pond", giver: 'moss', source: 'Topic questions: Simultaneous Equations, Q3',
    context: 'I\'m digging a round pond in the garden, $x^2 + y^2 = 34$ on Mira\'s grid, and putting up a straight fence along $3x - y + 4 = 0$. Where does the fence cross the edge of the pond? I need to put posts there so the ducks can\'t get under.',
    prompt: R`Solve the simultaneous equations $x^2 + y^2 = 34$ and $3x - y + 4 = 0$.`,
    done: 'The fence meets the pond at (0.6, 5.8) and (−3, −5). Moss puts in two posts and a sign: NO DUCKS.',
    steps: [
      { ask: R`From the line, $y = $ ?`, type: 'expr', answer: '3x+4', hint: 'Rearrange the linear equation.', explain: R`$y = 3x + 4$` },
      { ask: R`Substitute into the circle and simplify to $5x^2 + 12x + c = 0$. What is $c$?`, type: 'num', answer: -9,
        hint: R`$x^2 + (3x + 4)^2 = 34 \Rightarrow 10x^2 + 24x + 16 = 34$. Then divide by 2.`, explain: R`$10x^2 + 24x - 18 = 0 \Rightarrow 5x^2 + 12x - 9 = 0$` },
      { ask: 'Solve for x:', type: 'set', answer: [0.6, -3], hint: R`$(5x - 3)(x + 3) = 0$`, explain: R`$x = \tfrac35$ or $x = -3$` },
      { ask: 'The two crossing points:', type: 'choice', choices: [R`$(0.6, 5.8)$ and $(-3, -5)$`, R`$(0.6, 5.8)$ and $(-3, 5)$`, R`$(0.6, -5.8)$ and $(-3, -5)$`, R`$(3, 13)$ and $(-0.6, 2.2)$`], answer: 0,
        hint: R`Put each $x$ back into $y = 3x + 4$.`, explain: R`$x = 0.6$: $y = 5.8$. $x = -3$: $y = -5$.`,
        rook: 'Always substitute back into the LINEAR one. Squaring hides signs.' },
    ],
  };

  P.wickBinom = {
    id: 'wickBinom', topic: 'binomial', title: "Mira's Puzzle Book", giver: 'wick', source: 'Topic questions: Binomial Expansion, Q2',
    context: 'Mira used to leave me a puzzle every Sunday, to keep the old brain ticking over. This is the last one she left. It\'s been on my mantelpiece since the storm and I can\'t get past the first line.',
    prompt: R`(i) Find the binomial expansion of $(2 + x)^5$. (ii) Hence find the coefficient of $y^3$ in the expansion of $(2 + 3y + y^2)^5$.`,
    done: 'The coefficient is 1560. Under the puzzle, Mira had written: "Well done, Wick. Same time next week." Wick has to sit down for a minute.',
    steps: [
      { ask: R`Expand $(2 + x)^5$ fully.`, type: 'expr', answer: '32+80x+80x^2+40x^3+10x^4+x^5',
        hint: R`Pascal's row 1, 5, 10, 10, 5, 1, with powers of 2 going down: $\binom5r 2^{5-r}x^r$.`, explain: R`$32 + 80x + 80x^2 + 40x^3 + 10x^4 + x^5$`,
        rook: 'Write the row of Pascal\'s triangle first. Then the falling powers, then the rising powers. Three lines, no mistakes.' },
      { ask: R`Now put $x = 3y + y^2$. Which terms of the expansion can produce $y^3$?`, type: 'choice',
        choices: [R`Only the $x^2$ and $x^3$ terms`, R`Only the $x^3$ term`, R`Every term`, R`The $x$ and $x^3$ terms`], answer: 0,
        hint: R`$x$ alone gives powers of $y$ up to $y^2$. $x^4$ starts at $y^4$.`, explain: R`$x = 3y + y^2$ gives only $y$ and $y^2$. $x^2$ gives $y^2, y^3, y^4$. $x^3$ gives $y^3$ upwards. $x^4$ starts at $y^4$.` },
      { ask: R`$y^3$ from $80x^2 = 80(3y + y^2)^2$: the coefficient is...`, type: 'num', answer: 480,
        hint: R`$(3y + y^2)^2 = 9y^2 + 6y^3 + y^4$`, explain: R`$80 \times 6 = 480$` },
      { ask: R`$y^3$ from $40x^3 = 40(3y + y^2)^3$: the coefficient is...`, type: 'num', answer: 1080,
        hint: R`The lowest term of $(3y + y^2)^3$ is $(3y)^3 = 27y^3$.`, explain: R`$40 \times 27 = 1080$` },
      { ask: R`Total coefficient of $y^3$:`, type: 'num', answer: 1560, hint: '480 + 1080', explain: R`$1560$` },
    ],
  };

  // ── hooks ──
  const wrap = (key, chapter, test, fn) => { const orig = SC[key]; SC[key] = async (G, e) => ((G.flag('chapter') || 0) >= chapter && test(G) ? fn(G, e) : orig(G, e)); };
  const job = (key, chapter, flag, intro, problem, outro, reward) => wrap(key, chapter, G => !G.flag(flag), async G => {
    await G.say(problem.giver === 'villager' ? 'villager' : problem.giver, intro);
    await G.solve(problem);
    G.set(flag);
    if (problem.topic === 'binomial') G.page('binomial');
    await G.say(problem.giver === 'villager' ? 'villager' : problem.giver, outro);
    if (reward) G.give(reward, 1);
  });
  job('villager2', 1, 'flowerbedDone', 'Are you the one who does algebra? The council\'s given me the flower bed for the square. It has RULES.', P.flowerbed, 'Eleven and a half to twelve metres. Tulips, I think. Yellow ones.', 'flapjack');
  job('stall', 2, 'footpathDone', 'The Mayor wants a footpath at right angles to the old wall, and somehow it\'s my job. Mira\'s map is here.', P.footpath, 'x plus 2y minus nineteen. I shall paint it on the cobbles. Neatly.', null);
  job('moss', 2, 'pondDone', 'Big news. I\'m digging a POND. Round. With a fence. The ducks have opinions.', P.pond, 'Two posts. One sign. Zero ducks. Perfect.', 'hourglass');
  job('wick', 2, 'binomDone', 'You\'re clever with patterns, aren\'t you? Let me show you Mira\'s last Sunday puzzle.', P.wickBinom, 'One thousand five hundred and sixty. Same time next week, she wrote. ...Same time next week.', 'flapjack');
  wrap('nell', 2, G => G.flag('nellDone') && !G.flag('fishpenDone'), async G => {
    await G.say('nell', 'Another job, if you\'re not sick of me. A round fish pen this time.');
    await G.solve(P.fishpen);
    G.set('fishpenDone');
    await G.say('nell', 'Centre post at six, four. Boom along the tangent. Mira couldn\'t have staked it better.');
    G.give('flapjack', 1);
  });
  wrap('ottolineAfter', 2, G => !G.flag('rocksDone'), async G => {
    await G.say('ottoline', 'Now the light is on, I must chart the rocks again. A keeper\'s duty. Would you check my triangle?');
    await G.solve(P.rocks);
    G.set('rocksDone');
    await G.say('ottoline', 'Fifteen point three cables. I shall put it in the log for the next keeper, whoever she is.');
  });

  (SC.extraJobs = SC.extraJobs || []).push(
    [1, 'flowerbedDone', 'The square flower bed', 'a villager in the square'],
    [2, 'footpathDone', 'The new footpath', 'Tomas at the blue market stall'],
    [2, 'pondDone', "Moss's round pond", 'Moss by the stream'],
    [2, 'binomDone', "Mira's puzzle book", 'Old Wick'],
    [2, 'fishpenDone', "Nell's round fish pen", 'Nell at Gull Point (after her net)'],
    [2, 'rocksDone', 'The two rocks', 'Ottoline in the lamp room'],
  );
})();
