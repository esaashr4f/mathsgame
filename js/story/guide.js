// Where to go next: the HUD objective and Rook's advice (press R, or "Ask Rook" in the menu).
(function () {
  'use strict';
  const SC = window.SCRIPTS;

  // [condition, objective, rook's advice...] — the first unmet step wins.
  const STEPS = [
    [f => !f.plank, 'Help Captain Gull reach the jetty', 'Talk to Gull. She needs a plank long enough to bridge the gap. That\'s Pythagoras, and a surd.'],
    [f => !f.arrived, 'Walk up the jetty into Lowmarsh', 'Up the plank, along the jetty. Mind the gap. It\'s exactly 2√5 metres.'],
    [f => !f.metMayor, 'Find the Mayor in the village square', 'Straight up the main path. He\'ll be the one standing in the middle of the square, looking important.'],
    [f => !f.fenDone, 'Visit Aunt Fen at the bakery (west of the square)', 'Fen\'s bakery is the one with the chimney, west of the square. She\'s been worrying about her prices.'],
    [f => !f.blueprint, 'Search Mira\'s workshop (east of the square)', 'Mira\'s workshop is east of the square. Locked, but she kept the spare key under the third flowerpot by the door. Of course she did.', 'Old Wick the lamplighter wanders the square too. He\'s got a problem with a lantern. Optional, but he knows things.'],
    [f => !f.ropeFixed, 'Help Moss get across the stream (north of the square)', 'Moss is by the stream, north of the square. Line meets curve. Think about the discriminant.'],
    [f => !f.brambleSpared, 'Face Bramble at the gorge bridge', 'North, across Moss\'s crossing, up to the gorge. Bring the blueprint. Bring patience.', 'In the encounter: ACT, then "Work it out". One step per turn. If you slip, he hits harder — and I\'ll hint.'],
    [f => !f.lightOn, 'Relight the lighthouse at Gull Point (east road)', 'East along the cliff road to Gull Point. The fog has thinned enough to get through.', 'Nell the fisher is on the beach. The lighthouse door is at the foot of the tower.'],
    [f => !f.strixSpared, 'Restore the census records in the Town Hall', 'The Town Hall is open. Pim the clerk needs the records sorted, and Dr Sorrel\'s remedy is on trial.', 'Statistics chapter. The census is the OCR Large Data Set, more or less. And don\'t let anyone say "proves" about a hypothesis test.'],
    [f => !f.meadowsSeen, 'Go west to the flooded meadows', 'West along the road from the square, past where the oak fell. Bramble moved it. The Wend has burst its banks.'],
    [f => !f.gaugeDone, 'Talk to Rowan by the gauge post on the shore', 'Rowan\'s the farmer by the gauge post on the meadow shore. He needs to know how fast the water\'s rising. Differentiation from first principles: two moments, closer and closer.'],
    [f => !f.pumpOn, 'Get the old windpump running (west end of the shore)', 'The windpump is at the far west end of the shore. Sails first: logs. Then whether there\'s enough wind: a cube law.'],
    [f => !f.launchDone, "Take Rowan's launch from the causeway", 'Walk out along the causeway. The launch is tied up on the right. Mira modelled its engine: find the best speed by differentiating.'],
    [f => !f.shelterDone, 'Help Tansy on the farm island', 'Tansy\'s by the barn. She needs a roof for the goats. Optimisation: write the volume as one variable, differentiate, set it to zero.'],
    [f => !f.riverbedDone, "Read Mira's survey stake (top corner of the island)", 'Mira\'s stake is at the top-right corner of the island. Factorise, differentiate, find the stationary points: that\'s a sketch.'],
    [f => !f.drained, 'Face the Wend (from the causeway)', 'Take the launch back, then face the Wend from the causeway. Second derivatives tell you max or min. Then integrate.', 'In the encounter: ACT, then "Work it out". Use the hourglass if you need time.'],
    [f => !f.cogMet, 'Go to the Wend Lock (south-west, past the lockhouse)', 'Through the drained meadows, down the causeway, past the lockhouse to the lock. There\'s a golem. Forces and motion. Draw a force diagram first.'],
    [f => !f.weightDone, 'Help Dilys in the lockhouse', 'Dilys the lock-keeper is in the lockhouse. Equilibrium: forces in every direction balance. Then F = ma for the crane, and the cable\'s limit.'],
    [f => !f.chamberDone, 'Check the surge at the sluice board by the lock', 'The sluice board is by the gates. The acceleration varies with time: integrate to get the velocity, and watch for when it changes sign.'],
    [f => !f.lockOpen, 'Convince Cog to open the lock', 'Now Cog. Connected particles: one equation of motion for each particle, or one for the whole system. When the string goes slack, only gravity is left.'],
    [f => !f.bridgeBuilt, 'Bring the cable to Bramble at the gorge', 'Take the cable to Bramble at the gorge, north of the village. Vectors, then data, then moments. He wants proof.'],
    [f => !f.stillSeen, 'Go into the marsh, to the Still', 'The marsh is north-west, through the gap in the trees off the west road. The fog has pulled back to its heart. Mira\'s in there. I know it.'],
    [f => !(f.echo1Done && f.echo2Done && f.echo3Done), 'Find the three echoes of Mira in the marsh', 'Her thoughts are scattered round the marsh. Three of them, all half-finished proofs. Finish them for her.'],
    [f => !f.miraFreed, 'Free Mira at the Still', 'Go to Mira at the centre of the stones. Whatever is holding her, it hates proof.'],
    [f => true, 'Explore Lowmarsh · practise · get ready for your exam', 'We did it, {name}. Now go and do it again in the exam hall. Drills, past papers, the Daily Challenge — they\'re all in the menu.'],
  ];

  // Side quests: [chapter it opens, done flag, title, where to look, the problem it is].
  const JOBS = [
    [1, 'wickDone', "Old Wick's lantern", 'Old Wick, wandering the square', 'wick'],
    [1, 'tomasDone', "Tomas's apples", 'the blue market stall', 'tomas'],
    [1, 'kidCode', "Mira's strongbox code", 'a kid in the square', 'kidcode'],
    [2, 'nellDone', "Nell's net", 'Nell on the beach at Gull Point', 'net'],
    [2, 'janDone', "Jan's kingfisher", 'Old Jan on the headland', 'kingfisher'],
    [2, 'kiteDone', "Pebble's kite", 'a kid on the headland', 'kite'],
    [3, 'travelDone', 'The travel ledger', 'the Mayor in the Town Hall', 'travel'],
    [3, 'radarDone', 'School or care home?', 'the Mayor in the Town Hall', 'radar'],
    [3, 'vennDone', 'The evening classes', 'the Mayor in the Town Hall', 'venn'],
    [3, 'registerDone', 'The fog-day register', 'the register in the Town Hall', 'register'],
    [3, 'ivyDone', "Gran Ivy's allotments", 'Gran Ivy, south of the square', 'allotment'],
    [3, 'coffeeDone', "Fen's posters", 'Aunt Fen at the bakery', 'coffee'],
    [3, 'goalsDone', "Moss's football team", 'Moss by the stream', 'goals'],
    [3, 'giftsDone', 'The free gift claim', 'the blue market stall', 'gifts'],
    [3, 'spinnerDone', 'The fairground spinner', 'a kid in the square', 'spinner'],
    [3, 'bandDone', 'Blue Rocking', 'a kid near the cottages', 'band'],
    [4, 'soupDone', "Fen's soup run", 'Aunt Fen at the bakery, then Tansy', 'soup'],
    [4, 'leveeDone', "Bramble's flood bank", 'Bramble', 'levee'],
    [4, 'midgesDone', 'The midge plague', 'Dr Sorrel at the clinic', 'midges'],
    [4, 'lanternDone', "Wick's beam", 'Old Wick', 'lantern'],
    [4, 'colonyDone', 'The shrinking colony', 'Old Jan at Gull Point', 'colony'],
    [4, 'ditchDone', "Moss's drainage ditch", 'Moss', 'ditch'],
    [4, 'algaeDone', 'The bloom in the rock pools', 'Nell at Gull Point', 'algae'],
  ];
  JOBS.push(...(SC.extraJobs || []));
  SC.jobs = f => JOBS.filter(j => (f.chapter || 0) >= j[0]).map(j => ({ title: j[2], where: j[3], done: !!f[j[1]], problem: j[4] }));
  // problem id -> its side quest, so the game knows which problems you can walk away from (and get rewarded for)
  SC.sideQuests = {};
  JOBS.forEach(j => (SC.sideQuests[j[4]] = { flag: j[1], title: j[2], where: j[3] }));
  SC.sideQuestCount = JOBS.length;

  SC.objective = f => STEPS.find(s => s[0](f))[1];
  SC.rookHint = f => {
    const s = STEPS.find(x => x[0](f));
    const extra = [
      'If you get stuck on a step, press "Talk me through it". Then write it out yourself. That\'s how it sticks.',
      'The scratch pad (✏️ button, top right) is for working. Use it. Mira filled a notebook a week.',
      'The grapher in the menu will draw anything you type. Very handy for checking a sketch.',
      'Every page of Mira\'s notebook you find is in the menu. Read them. She was good at this.',
    ];
    return s.slice(2).concat(Math.random() < 0.5 ? [extra[Math.floor(Math.random() * extra.length)]] : []);
  };
})();
