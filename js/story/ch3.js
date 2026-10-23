// CHAPTER 3 "The Census" — statistics: sampling, data presentation, the Large Data Set, probability,
// the binomial distribution and hypothesis tests. Nearly every problem is a real OCR H230/01 question.
(function () {
  'use strict';
  const SC = window.SCRIPTS;
  const P = window.STORY_PROBLEMS;
  const Q = id => window.PAPER_Q[id];
  const fromPaper = (id, extra) => Object.assign({ id: extra.id, topic: Q(id).topic, title: extra.title, giver: extra.giver, source: Q(id).source, context: extra.context, prompt: Q(id).prompt, steps: Q(id).steps, done: extra.done, diagram: extra.diagram }, extra.prompt ? { prompt: extra.prompt } : {});

  // ───────────────────────── problems ─────────────────────────
  P.histo = fromPaper('o19-8', { id: 'histo', title: 'Redrawing the Age Histogram', giver: 'pim',
    context: 'The regional census office wants Lowmarsh\'s age histogram redrawn, but my ruler and my brain stopped agreeing after the storm. Mira\'s template uses 1 cm = 1000 people per year on the frequency-density axis. There are 2143 children in the "0 to 4" group.',
    done: 'Block height 0.429 cm. And travel-to-work data is categorical: bar chart or pie chart, never a histogram.' });
  P.survey = fromPaper('o21-10', { id: 'survey', title: "Pim's Survey", giver: 'pim',
    context: 'I surveyed 400 people across the three valley villages, A, B and C, for the census. Half my table got wet. And I need a random sample of the 820 people in the hostel — my nephew Kareem and I used the same random numbers but got different lists.',
    done: 'Table rebuilt, probabilities found, and Kareem\'s overlapping-digit sample thrown out.' });
  P.travel = fromPaper('o19-10', { id: 'travel', title: 'The Travel Ledger', giver: 'mayor',
    context: 'Before the bridge reopens I need to know what happens to traffic when a town changes its roads. Mira collected the regional "Method of travel to work" ledgers. Four towns, 2001 and 2011. One opened a tram line in 2004; one brought in a congestion charge in 2003.',
    done: 'LA4 got the tram, LA1 the congestion charge — and the bus "boom" in LA1 was just more people in work.' });
  P.radar = fromPaper('o18-13', { id: 'radar', title: 'School or Care Home?', giver: 'mayor',
    context: 'The council (me) has money for ONE new building after the bridge: a school or a care home. Mira left radar diagrams comparing two census areas — a big city, Liverpool, and a small rural one, Rutland, a lot like us. Which way are the ages going?',
    done: 'Different scales compare shapes, not sizes. Places full of 18–29s get more children; places like Rutland (and Lowmarsh) get older.' });
  P.register = fromPaper('o19-9', { id: 'register', title: 'The Fog-Day Register', giver: 'pim',
    context: 'The school\'s attendance register for class 2A since the fog. Most children missed a day or so; one poor soul missed weeks. The governors want an "average" for the report.',
    done: 'Mean 2.4, median 1 — and the median isn\'t dragged up by the one long absence.' });
  P.venn = fromPaper('o19-12', { id: 'venn', title: 'The Evening Classes', giver: 'mayor',
    context: 'Before the fog I ran evening classes for 100 villagers: History, Geography and Psychology. I\'m drawing names for the first class back — one prize for a historian, then one for a geographer who doesn\'t do psychology.',
    done: 'P = 0.158. Two cases, because the first name might already be a geographer.' });
  P.allotment = fromPaper('o18-12', { id: 'allotment', title: "Gran Ivy's Allotments", giver: 'ivy',
    context: 'Normally one plant in five gets the fungus. Under the fog I tried a new growing method — straw mulch and talking to them firmly. Out of 250 plants, 36 got the fungus. Has my method actually reduced it, or am I fooling myself? Test it properly — 2% level, I\'m a cautious woman.',
    done: 'P(X ≤ 36) = 0.0139 < 0.02: evidence that the method works. Ivy is unbearable about it.' });
  P.coffee = fromPaper('o22-9', { id: 'coffee', title: "Fen's Posters", giver: 'fen',
    context: 'Last year 8% of grown-ups in Lowmarsh came in for my morning coffee. I\'ve put posters up EVERYWHERE. I asked 150 people in the market on Friday and Saturday: 18 said they come in. Has it gone up?',
    done: 'P(X ≥ 18) = 0.0551 > 0.05: not enough evidence yet — and a weekend market sample isn\'t random anyway.' });
  P.goals = fromPaper('o22-11', { id: 'goals', title: "Moss's Football Team", giver: 'moss',
    context: 'Our team is the Lowmarsh Mudlarks. I wrote down how likely we are to score 0, 1, 2, 3 or 4 goals in a match. Then we scored 31 goals in our first 10 matches. My model might be rubbish.',
    done: 'The model\'s mean is 2 goals a match — 31 in 10 is suspicious. The Mudlarks are better than Moss thought.' });
  P.gifts = fromPaper('o20-10', { id: 'gifts', title: 'The Free Gift Claim', giver: 'tomas',
    context: 'The biscuit supplier claims one packet in four has a free gift. I opened 20 at random. ONE gift. I want to complain — but properly, with a test at the 2.5% level.',
    done: 'P(X ≤ 1) = 0.0243 < 0.025: complaint justified. And the gifts are clustered by box, so the binomial model itself is shaky.' });
  P.spinner = fromPaper('o20-11', { id: 'spinner', title: 'The Fairground Spinner', giver: 'kid',
    context: 'I made a spinner for the spring fair. It\'s rigged a bit: P(X = x) = ½ − x/10. If your third spin beats the total of your first two, you win a scone. Is it too easy?',
    done: 'P(win) = 0.072. The scones are safe.' });
  P.band = fromPaper('o23-11', { id: 'band', title: 'Blue Rocking', giver: 'kid',
    context: 'Everyone at the big school over the river LOVES Blue Rocking. My friend says 75% of them. I say MORE. We asked 60 people and 50 said Blue Rocking. I said P(X = 50) is 0.0407, that\'s less than 0.05, so I win. My friend says I\'m doing it wrong.',
    done: 'You need P(X ≥ 50) = 0.0859 > 0.05. Not enough evidence. Sorry, Pebble.' });

  P.trial = fromPaper('o19-11', { id: 'trial', title: 'The Trial of the Fog-Cough Remedy', giver: null,
    context: 'Under the old treatment for fog-cough, 9.7% of patients get side effects within a year. Dr Sorrel\'s new remedy was given to a random sample of 450 villagers: 51 had side effects. The village wants it BANNED. Magistrate Strix will rule — on the evidence, at the 10% level.' });
  P.trial.steps = P.trial.steps.map((s, i) => Object.assign({}, s, { react: [
    [['enemy', 'Independent? ...Hoo. Yes. One villager\'s rash does not cause another\'s. Proceed.']],
    [['enemy', 'GREATER than nine point seven per cent. That is the accusation. Very well, the hypotheses are entered into the record.']],
    [['enemy', 'Fifty-one out of four hundred and fifty is MORE than nine point seven per cent! It is OBVIOUS!'], ['rook', 'More in one sample. The question is whether that\'s unusual enough to be evidence. Keep going, {name}.']],
    [['enemy', 'Nought point one three eight... greater than nought point one.'], ['enemy', 'A result like this would happen one time in seven even if the remedy were exactly as safe as the old one.'], ['enemy', 'Insufficient evidence. Not "proven safe". Not "proven guilty". Insufficient evidence.'], ['rook', 'That\'s the whole of statistics in one sentence, Your Honour.']],
  ][i] }));

  window.ENCOUNTERS.strix = {
    name: 'Magistrate Strix', sprite: 'owl', scale: 7, atk: 3,
    intro: '* Magistrate Strix spreads her wings over the bench. "THIS COURT WILL NOW RULE."',
    check: '* STRIX — ATK 5 DEF 40. Owl of the Marsh Court. Can see in fog. Believes that any difference in a sample is PROOF.',
    flavor: ['* Strix swivels her head a full 270°. It is very distracting.', '* The jury of villagers mutters. Several of them are coughing fog.', '* Dr Sorrel grips the edge of the dock.', '* Pim is taking minutes. Furiously.'],
    fightLine: 'Don\'t attack the JUDGE, {name}! Present the EVIDENCE.',
    talk: [
      [['enemy', 'The numbers are bigger. Bigger numbers are guilty. HOO.'], ['rook', 'Bigger in one sample of 450. Samples wobble, Your Honour.']],
      [['enemy', 'I have sat in this court for thirty years. In the fog, every case looks obvious.']],
      [['enemy', 'If I ban the remedy and I am wrong, people stay sick. If I allow it and I am wrong...'], ['text', '* Strix\'s feathers droop. She is frightened of being wrong either way.']],
      [['enemy', '...Show me the test. The proper one.']],
    ],
    taunts: ['GUILTY!', 'Fifty-one is too many!', 'The evidence is OBVIOUS!', 'Hoo...'],
    angry: ['CONTEMPT OF COURT!', 'ORDER! ORDER!', 'PROVEN! PROVEN!', 'HOO!'],
    attacks: [
      { pattern: 'rain', bullets: ['GUILTY', 'p<0.05', '!'], speed: 60, every: 380 },
      { pattern: 'sweep', bullets: ['PROVEN', 'OBVIOUS', '51'], speed: 65, every: 380 },
      { pattern: 'spiral', bullets: ['H₀', 'H₁', '?'], speed: 55, every: 260 },
      { pattern: 'arc', bullets: ['HOO', 'HOO'], speed: 60, every: 300 },
    ],
    spareHint: '* Strix lowers her gavel. She has reached a verdict on the evidence, not the noise. (Strix can be SPARED.)',
    problem: P.trial,
  };

  // ───────────────────────── chapter 3 script ─────────────────────────
  SC.townhallDoor = async (G, x) => {
    if ((G.flag('chapter') || 0) < 3) return G.narr('* The Town Hall. A sign on the door: "ARCHIVE CLOSED UNTIL THE FOG LIFTS. (Or until I remember the combination.) — The Mayor"');
    await G.go('townhall', x === 50 ? 9 : 8, 10, 'up');
    if (!G.flag('hallOpen')) {
      G.set('hallOpen');
      await G.narr('* The archive. Shelves of census ledgers to the ceiling, all of them damp and out of order.');
      await G.say('mayor', '{name}! The light at Gull Point — the WHOLE village saw it. I opened the archive the moment I heard.',
        'Mira ran the census for us. Every ten years, everybody counted. Since the fog nobody can read a table without crying.');
      await G.say('pim', 'H-hello. Pim. Clerk. I\'ve been trying to re-file everything but the numbers keep... sliding.');
      await G.say('rook', 'Ottoline said Mira told her "somebody\'s been disappearing in the records". Whatever she found, it\'s in here.');
      await G.say('mayor', 'And there is the small matter of the TRIAL.', 'Dr Sorrel\'s new fog-cough remedy. Half the village says it gives people rashes. Magistrate Strix is holding court here tomorrow. She is... very decisive.',
        'If Strix bans the remedy, everyone with fog-cough goes without. If she allows a dangerous one...', 'Help Pim with the records, {name}. And talk to Sorrel. The court will want evidence.');
      G.hud();
    }
  };

  SC.pim = async G => {
    if (!G.flag('histoDone')) {
      await G.say('pim', 'The first job. The regional office wants our age histogram redrawn. I just need the height of one block and my hands won\'t stop shaking.');
      await G.solve(P.histo);
      G.set('histoDone'); G.page('data');
      await G.say('pim', 'Nought point four two nine centimetres. I can draw that. I can DRAW that.');
      await G.say('pim', 'Oh — and there\'s my survey. Half of it got wet.');
    }
    if (!G.flag('surveyDone')) {
      await G.solve(P.survey);
      G.set('surveyDone');
      await G.say('pim', 'Kareem\'s sample is out. Mine is in. Random means random — not "the next three digits".');
      await G.say('pim', 'Wait. While I was re-filing, I found Mira\'s own census card. It\'s... strange. The Magistrate keeps the sealed cards. You\'ll have to ask her after the trial.');
      G.hud();
      return;
    }
    const lines = ['Filing is going much better. I only cried twice today.', 'Did you know Lowmarsh\'s population has gone DOWN since the storm? Not by people leaving. By people... being harder to count. It\'s like the fog makes you easy to miss.'];
    await G.say('pim', lines[Math.floor(Math.random() * lines.length)]);
  };

  SC.mayorHall = async G => {
    if (!G.flag('travelDone')) {
      await G.say('mayor', 'A civic question, {name}. When the bridge reopens, traffic will come. I have Mira\'s regional travel ledgers — four towns, 2001 and 2011. One opened a tram, one charged cars for driving in. Which was which, and what can we learn?');
      await G.solve(P.travel);
      G.set('travelDone');
      return G.say('mayor', 'Trams fill up if you build them. Charge cars and people stop driving. Noted. NOTED.');
    }
    if (!G.flag('radarDone')) {
      await G.say('mayor', 'Another one: school or care home? Mira left me radar diagrams of two census areas.');
      await G.solve(P.radar);
      G.set('radarDone');
      return G.say('mayor', 'An ageing village needs a care home. But if the bridge brings young families back... a school. Hmm. I shall build BOTH. Eventually. Probably.');
    }
    if (!G.flag('vennDone')) {
      await G.say('mayor', 'And for fun: the evening-class prize draw!');
      await G.solve(P.venn);
      G.set('vennDone');
      return G.say('mayor', 'Nought point one five eight. I shall announce it with tremendous ceremony.');
    }
    await G.say('mayor', G.flag('strixSpared') ? 'A fair verdict! On EVIDENCE! I may weep.' : 'The court sits when you\'re ready. Strix is in the middle of the hall, glaring at everyone.');
  };

  SC.ledger = async G => SC.mayorHall(G);
  SC.register = async G => {
    if (G.flag('registerDone')) return G.narr('* The class register. Mean 2.4 days, median 1. One very long absence, circled in red.');
    await G.narr('* The village school\'s attendance register, fog-damp but legible.');
    await G.solve(P.register);
    G.set('registerDone');
  };
  SC.radar = async G => SC.mayorHall(G);
  SC.venn = async G => SC.mayorHall(G);

  SC.sorrel = async G => {
    if (!G.flag('sorrelMet')) {
      G.set('sorrelMet');
      await G.say('sorrel', 'Come in, come in, mind the jars. You\'re the one who lit the lighthouse? Then maybe you can help me.',
        'Half of Lowmarsh has fog-cough. The old treatment gives side effects to 9.7% of patients in the first year. I made a new remedy — willow bark and sea-buckthorn.',
        'I gave it to 450 people. 51 had side effects. That\'s 11.3%. And now the village says I\'m poisoning them.', 'Maybe I am. I genuinely don\'t know. That\'s what frightens me.');
      await G.say('rook', 'That\'s a hypothesis test, {name}. Not "is it bigger" — "is it bigger than chance can explain".');
      await G.say('sorrel', 'Will you speak for the evidence at the trial? Not for me. For the evidence.');
      G.hud();
      return;
    }
    await G.say('sorrel', G.flag('strixSpared') ? 'The remedy stays — and I\'m running a bigger trial, properly. If it IS worse, a bigger sample will show it. Thank you for doing it honestly.' : 'The trial\'s in the Town Hall. I\'ll be the one in the dock trying not to faint.');
  };
  SC.jars = async G => G.narr('* Jars of willow bark, sea-buckthorn, and one labelled "DO NOT. — S."');

  SC.strix = async G => {
    if (G.flag('strixSpared')) return SC.strixAfter(G);
    if (!G.flag('surveyDone') || !G.flag('sorrelMet')) {
      await G.say('strix', 'HOO. The court is not yet in session. Bring me the census in order and the accused\'s own account. Then we shall see.');
      return G.say('rook', G.flag('surveyDone') ? 'We still need to talk to Dr Sorrel. Clinic\'s south-west of the square.' : 'Pim\'s records first. Then Sorrel at the clinic.');
    }
    await G.say('strix', 'The Court of the Marsh is in session. The matter: Dr Sorrel\'s remedy. The charge: that it causes MORE side effects than the old treatment.',
      'Fifty-one patients out of four hundred and fifty. Eleven point three per cent. Nine point seven is the old figure. The difference is OBVIOUS. I am minded to ban it immediately.');
    await G.say('rook', 'Objection! ...Can crows object? I\'m objecting.');
    const r = await G.battle(window.ENCOUNTERS.strix);
    if (r !== 'spared') return;
    await G.say('strix', 'The court finds that there is insufficient evidence that the new remedy causes more side effects.', 'The remedy may continue. And Dr Sorrel will run a larger trial. That is how one becomes MORE certain — more evidence, not louder voices.');
    await G.narr('* The villagers murmur. Someone starts clapping. Dr Sorrel sits down very suddenly.');
    await G.say('strix', 'Now, little one. Pim says you seek Mira Hale\'s census card. I keep the sealed cards. Owls see through fog, you know. We always have.');
    await G.narr('* Strix passes you a card in Mira\'s handwriting.', '* "HALE, Mira. Surveyor. Location on census night: THE STILL (marsh, bearing 290° from Gull Point)."', '* Underneath, added in a hurry: "Fen — when this is over, send for your {name}. The one with the maths book. Rook will need someone who still asks why."');
    await G.say('rook', '...She asked for you. Before any of this. She knew.');
    const c = await G.choose(['"Why me?"', '"Then let\'s go and get her."']);
    if (c === 0) await G.say('rook', 'Because you didn\'t know the answers. You had to work them out. The fog can\'t take working from someone who\'s still doing it.');
    await G.say('strix', 'The Still lies at the heart of the marsh, beyond the western meadows. But the Wend has burst its banks out there since the storm. The meadows are a lake.',
      'And a fallen oak has closed the west road. You will need someone very strong.');
    await G.say('rook', 'I know just the troll.');
    G.give('census');
    G.set('strixSpared'); G.set('chapter', 4); G.set('westOpen'); G.set('fogLevel', 0.3);
    G.refresh();
    await G.card('CHAPTER 3 COMPLETE', 'Bramble has cleared the fallen oak from the west road.');
    await G.card('CHAPTER 4', 'THE RISING');
    G.hud(); G.save();
  };
  SC.strixAfter = async G => G.say('strix', ['Hoo. The court thanks you.', 'More evidence, not louder voices. I have had it embroidered.', 'The Still. Bearing 290. Owls do not go there. Even we cannot see through THAT fog.'][Math.floor(Math.random() * 3)]);

  // ── side quests across the village ──
  SC.ivy = async G => {
    if ((G.flag('chapter') || 0) < 3) return G.say('ivy', 'My allotment. Straw mulch and firm words. Come back when you know some statistics, dear.');
    if (!G.flag('ivyDone')) {
      await G.say('ivy', 'You! Statistics person! Normally one plant in five gets the fungus. I\'ve been trying a new method. Tell me if it works — properly. Two per cent level. I am a cautious woman.');
      await G.solve(P.allotment);
      G.set('ivyDone');
      await G.say('ivy', 'EVIDENCE. Evidence that I am right. I shall be insufferable at the show.');
      G.give('flapjack', 1);
      return;
    }
    await G.say('ivy', 'Thirty-six out of two hundred and fifty. I\'ve framed it.');
  };
  SC.fenCoffee = async G => {
    await G.say('fen', 'Statistics, love? Good — I\'ve been dying to know if my posters worked.');
    await G.solve(P.coffee);
    G.set('coffeeDone');
    await G.say('fen', 'Not enough evidence YET. And I asked on market days, which is daft — the coffee crowd comes on weekday mornings. I\'ll ask again properly. Have a scone.');
    G.give('flapjack', 1);
  };
  SC.mossGoals = async G => {
    await G.say('moss', 'Statistics? You can test my FOOTBALL MODEL?');
    await G.solve(P.goals);
    G.set('goalsDone');
    await G.say('moss', 'We\'re TOO GOOD for my model. Best news ever. The Mudlarks are going to the regional league once the bridge is fixed.');
  };
  SC.tomasGifts = async G => {
    await G.say('tomas', 'Biscuits. The supplier says one packet in four has a free gift. I opened twenty and found ONE. I want to complain. Scientifically.');
    await G.solve(P.gifts);
    G.set('giftsDone');
    await G.say('tomas', 'Evidence at the 2.5% level. I\'m writing a VERY polite, VERY statistical letter.');
  };
  SC.kidSpinner = async G => {
    await G.say('kid', 'Want to test my fair spinner? If it\'s too easy I\'ll go broke. In scones.');
    await G.solve(P.spinner);
    G.set('spinnerDone');
    await G.say('kid', 'Seven point two per cent. My scones are SAFE.');
  };
  SC.kidBand = async G => {
    await G.say('kid', 'Settle an argument! Do more than 75% of the big school love Blue Rocking?');
    await G.solve(P.band);
    G.set('bandDone');
    await G.say('kid', 'P of X EQUALS fifty isn\'t the right thing? Ugh. Fine. Not enough evidence. But I still think it\'s more.');
  };

  // Hook the side quests onto existing NPCs once chapter 3 starts.
  const wrap = (key, test, fn) => { const orig = SC[key]; SC[key] = async (G, e) => ((G.flag('chapter') || 0) >= 3 && test(G) ? fn(G, e) : orig(G, e)); };
  wrap('fen', G => !G.flag('coffeeDone'), SC.fenCoffee);
  wrap('moss', G => !G.flag('goalsDone'), SC.mossGoals);
  wrap('stall', G => !G.flag('giftsDone'), SC.tomasGifts);
  wrap('kid1', G => !G.flag('spinnerDone'), SC.kidSpinner);
  wrap('kid2', G => !G.flag('bandDone'), SC.kidBand);
})();
