// The game's music. Put the audio files in this folder (audio/music/) and list them here by slot.
// MP3 works everywhere. Loop points: make each track loop cleanly from its end back to its start.
// Leave a slot out and the game uses the nearest related track instead (see the fallbacks in js/audio.js),
// so you can start with just "village" and "encounter" and add the rest later.
window.LOWMARSH_MUSIC = {
  // title: 'title.mp3',          // the title screen and menus outside the story
  // study: 'study.mp3',          // drills, guided papers, the Daily Challenge (exam mode is always silent)
  // village: 'village.mp3',      // Lowmarsh village, the square and the jetty
  // wilds: 'wilds.mp3',          // the general outdoors, used where a place has no track of its own
  // gorge: 'gorge.mp3',          // the gorge and the bridge, to the north
  // coast: 'coast.mp3',          // the cliff road and Gull Point
  // meadows: 'meadows.mp3',      // the west meadows and Rowan's farm
  // flood: 'flood.mp3',          // the meadows while they're flooded (chapter 4)
  // marsh: 'marsh.mp3',          // the marsh and the Still
  // home: 'home.mp3',            // cosy interiors: the bakery, Mira's workshop, the clinic, Wick's cottage
  // townhall: 'townhall.mp3',    // the Town Hall and archive
  // lighthouse: 'lighthouse.mp3',// inside the lighthouse and the lamp room
  // lock: 'lock.mp3',            // the lockhouse
  // encounter: 'encounter.mp3',  // encounters (Bramble, Ottoline, Strix, the Wend, Cog)
  // finale: 'finale.mp3',        // the last encounter, the Hush
};
