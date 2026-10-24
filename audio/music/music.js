// The game's music: written by tools/music/build.py (the scores are in tools/music/tracks.py).
// Each track is a seamless loop: `loop` is its length in seconds and `start` where the loop begins in the file.
// To use your own recording for a slot instead, replace the entry with just a file name, e.g. village: 'my-village.mp3'.
window.LOWMARSH_MUSIC = {
  title: { file: 'title.mp3', loop: 106.6667, start: 1.0 },
  village: { file: 'village.mp3', loop: 76.8, start: 1.0 },
  home: { file: 'home.mp3', loop: 77.1429, start: 1.0 },
  study: { file: 'study.mp3', loop: 98.4615, start: 1.0 },
  wilds: { file: 'wilds.mp3', loop: 83.4783, start: 1.0 },
  gorge: { file: 'gorge.mp3', loop: 50.5263, start: 1.0 },
  coast: { file: 'coast.mp3', loop: 54.8571, start: 1.0 },
  meadows: { file: 'meadows.mp3', loop: 71.1111, start: 1.0 },
  flood: { file: 'flood.mp3', loop: 53.3333, start: 1.0 },
  marsh: { file: 'marsh.mp3', loop: 71.1111, start: 1.0 },
  townhall: { file: 'townhall.mp3', loop: 80.0, start: 1.0 },
  lighthouse: { file: 'lighthouse.mp3', loop: 43.6364, start: 1.0 },
  lock: { file: 'lock.mp3', loop: 73.8462, start: 1.0 },
  encounter: { file: 'encounter.mp3', loop: 48.6957, start: 1.0 },
  finale: { file: 'finale.mp3', loop: 64.6154, start: 1.0 },
};
