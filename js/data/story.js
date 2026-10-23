// Story scripts. Each line: [speaker, text]. {name} is replaced with the player's name.
// Lines starting with "* " are Undertale-style narration.
window.STORY = {
  prologue: [
    ['narrator', '* 02:47. Your desk lamp hums.'],
    ['narrator', '* The AS Maths textbook is open at Chapter 1. It has been open at Chapter 1 for three weeks.'],
    ['narrator', '* "I\'m just not a maths person," you mutter.'],
    ['narrator', '* You rest your head on the page. Just for a second.'],
    ['narrator', '* ...'],
    ['narrator', '* The page feels... wet.'],
    ['pip', '...hey. HEY. Are you alive?!'],
    ['pip', 'Oh thank the tides. You were drifting face-down in the kelp. I nearly puffed up from the stress.'],
    ['pip', 'I\'m Pip! Pufferfish, junior cartographer, professional worrier. And you are... a krill? A very confused-looking krill.'],
    ['you', '(A krill?! You look down. Tiny legs. Lots of them.)'],
    ['pip', 'You\'re saying you were a HUMAN? From above the Surface?! Nobody\'s come down from there since the Gate sealed!'],
    ['pip', 'Okay. Okay okay okay. We need Elder Theta. She knows everything. Probably. Follow me!'],
    ['narrator', '* You follow Pip down into a drowned city of glowing domes, pipes and lifts.'],
    ['narrator', '* Half of the lights are dead.'],
    ['theta', 'Ah. So the current has finally brought one.'],
    ['theta', 'Welcome to Bathys, little one. A city built entirely on mathematics.'],
    ['theta', 'Every pump that moves oxygen, every lift that sinks, every sonar ping — all of it runs on equations our ancestors worked out by hand.'],
    ['theta', 'But something has come down the trench. We call it the Hollow.'],
    ['theta', 'It is a fog that whispers convenient lies. "Just square each bit." "The minus sign doesn\'t matter." "You\'ll never get this anyway."'],
    ['theta', 'The guardians of each district breathed it in. Now they believe those lies — and the machines they guard are failing.'],
    ['pip', 'The Kelp Farms stopped growing. The Twilight Lighthouse went dark. My mum\'s map office has been flooded for a month...'],
    ['theta', 'You cannot fight a misconception with claws, {name}. Only with working. Show a guardian the correct method, step by step, and the fog leaves their heart.'],
    ['you', '(...but you\'re not a maths person.)'],
    ['theta', 'Hm. I heard that thought. It sounded a lot like the Hollow.'],
    ['theta', 'Go and see Lumen in the Tide Room. If there is a way back to your world, the lanternfish will know it.'],
    ['narrator', '* The Tide Room. Velvet-blue water. A lanternfish waits behind a desk made of coral.'],
    ['lumen', 'Welcome, welcome. You are not lost, {name}. You are a student of the deep.'],
    ['lumen', 'Your world is sealed behind the Hadal Gate, at the very floor of the trench. 700 metres down.'],
    ['lumen', 'Yes — to go up, you must go down.'],
    ['lumen', 'Each district has a guardian. Free one, and the current lets you sink to the next depth.'],
    ['lumen', 'And the Gate opens on one day only: the day of your exam. I keep the calendar here. Do not waste the days.'],
    ['lumen', 'When you are tired of fighting, train here — Practice has no clock and no harm. And each day, a Daily Dive: seven problems, twenty-five seconds a step. Fast, clean working sinks you deeper. A perfect dive reaches the trench floor.'],
    ['pip', 'I\'m coming with you! Someone has to map this. And... someone has to make sure you don\'t get eaten.'],
    ['lumen', 'Then descend. The Sunlit Shallows await.'],
  ],

  // Short beats played after a zone is cleared for the first time (keyed by zone id).
  afterClear: {
    shallows: [
      ['pip', 'The dome lights are back on! Look — people are coming out of their shells!'],
      ['pip', 'You said you weren\'t a maths person. A maths person is just a person who did the working, right?'],
    ],
    reef: [
      ['theta', 'The kelp grows again. You noticed what Quadrabble was doing? It never checked whether its answer made sense.'],
      ['theta', 'A negative time. A negative length. The examiners love to see you reject those, out loud.'],
    ],
    grid: [
      ['pip', '...Can I tell you something? My mum went down past the Midnight line to chart the trench. She never came back up.'],
      ['pip', 'Everyone says the Hollow got her. I keep thinking if I map far enough down, I\'ll find her map. Or her.'],
      ['pip', 'Anyway! Ha! Next district! Don\'t look at me, I\'m puffing.'],
    ],
    spire: [
      ['hollow', '...why are you still trying...'],
      ['hollow', '...you\'ll forget it all by the exam... everyone does...'],
      ['pip', 'Did... did the water just talk?'],
      ['theta', 'The Hollow has noticed you. Good. That means you are a threat to it.'],
    ],
    vents: [
      ['lumen', 'Half of the Pure districts are lit. The trench water is warmer than it was.'],
      ['lumen', 'Tip from an old fish: past papers are the current that carries you. The examiners repeat themselves more than they admit.'],
    ],
    hollowbasin: [
      ['pip', 'I found something in the Hollow Basin. A page of working. Waterlogged... but that\'s my mum\'s handwriting.'],
      ['pip', '"Area under the curve = total oxygen used. Need more. Going deeper." She was HERE, {name}.'],
    ],
    currents: [
      ['theta', 'You have crossed the Pure districts. Below lie the Shoal and the Court — the realms of data and chance — and the Forge, where things move.'],
      ['theta', 'Different creatures. The same rule. Show your working.'],
    ],
    court: [
      ['hollow', '...probability of you passing... low... the evidence says so...'],
      ['you', '(You\'ve learned this one now. One result doesn\'t prove anything. You test it.)'],
      ['hollow', '...insufficient evidence to reject you. ...for now...'],
    ],
    forge: [
      ['pip', 'The Hadal Gate. It\'s right there. And... there\'s someone standing in front of it.'],
      ['pip', '{name}... it looks exactly like you.'],
    ],
    gate: [
      ['shadow', '...fine. Fine! You did the working. All of it.'],
      ['shadow', 'I only said we weren\'t a maths person because then failing wouldn\'t be our fault.'],
      ['you', '(You reach out. The Shadow takes your claw. The Hollow\'s fog thins into ordinary seawater.)'],
      ['pip', 'Look — on the gate! A map. MUM\'S map! She charted all the way to the bottom!'],
      ['lumen', 'The AS Gate is open, {name}. But this trench goes deeper than 700 metres...'],
      ['lumen', 'When you are ready, the full A level awaits: the Hadal Deep. Bring your past papers.'],
    ],
  },
};
