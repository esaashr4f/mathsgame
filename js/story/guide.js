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
    [f => !f.drained, 'Calm the flood in the western meadows', 'West, past where the fallen tree was. The Wend has burst its banks. Graphs and calculus, {name}. Lots of graphs.'],
    [f => !f.lockOpen, 'Open the Wend Lock and get the steel cable', 'The lock is at the far west end of the river. There\'s a golem. Forces and motion. Draw a force diagram first.'],
    [f => !f.bridgeBuilt, 'Bring the cable to Bramble at the gorge', 'Take the cable to Bramble. The timber boats are arriving now the light\'s on.'],
    [f => !f.miraFreed, 'Go into the marsh — to the Still', 'The marsh is north-west, beyond the meadows. The fog has pulled back to its heart. Mira\'s in there. I know it.'],
    [f => true, 'Explore Lowmarsh · practise · get ready for your exam', 'We did it, {name}. Now go and do it again in the exam hall. Drills, past papers, the Daily Dive — they\'re all in the menu.'],
  ];

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
