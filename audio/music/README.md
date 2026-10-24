# The Lowmarsh soundtrack

Fifteen looping tracks, all built from one tune: the **Lowmarsh theme** (in G major: D–B–A–G, A–B–D…).
The title states it, the village whistles it, Fen's kitchen hums it as a lullaby, the fog in the marsh has
eaten half its notes, the encounters play it in E minor, and the Hush finale turns it from G minor back to G major.

| Slot | Track | Feel | Instruments | Tempo | Length |
|---|---|---|---|---|---|
| `title` | Lowmarsh | the theme, slow and warm | piano, harp, strings, flute, glockenspiel | 72 | 1:47 |
| `village` | Morning in Lowmarsh | bright, bouncy | steel guitar, flute, clarinet, pizzicato bass, shaker | 100 | 1:17 |
| `home` | Fen's Kitchen | a lullaby waltz (3/4) | music box, nylon guitar, celesta, strings | 84 | 1:17 |
| `study` | Mira's Notebook | lo-fi focus music | Rhodes, bass, vibraphone, brushes | 78 | 1:38 |
| `wilds` | The Open Fen | airy, wandering | steel guitar, recorder, flute, strings | 92 | 1:23 |
| `gorge` | Bridge No. 1 | bittersweet (E minor) | harp, oboe, cello, strings | 76 | 0:51 |
| `coast` | Gull Point | a gentle shanty (6/8) | accordion, fiddle, harp, flute, the sea | 70 | 0:55 |
| `meadows` | Rowan's Meadows | pastoral, cheerful | nylon guitar, clarinet, flute, pizzicato | 108 | 1:11 |
| `flood` | The Rising | tense but hopeful (D minor) | piano, cello, strings, choir, timpani | 72 | 0:53 |
| `marsh` | The Still | ambient, foggy | pads, piano, celesta | 54 | 1:11 |
| `townhall` | Hall of Records | busy, faintly baroque | harpsichord, bassoon, oboe, flute | 96 | 1:20 |
| `lighthouse` | The Lamp Room | a ghost's waltz (A minor) | vibraphone, flute, celesta, strings | 132 | 0:44 |
| `lock` | Cog's Clockwork | mechanical, playful | marimba, tuba, clarinet, woodblocks | 104 | 1:14 |
| `encounter` | Show Your Working | the battle theme (E minor) | square lead, synth bass, piano, strings, drums | 138 | 0:49 |
| `finale` | The Hush | G minor to G major | horn, strings, choir, timpani, glockenspiel | 104 | 1:05 |

## What's here

- `*.mp3`: the rendered loops the game plays. They're seamless: the game plays the loop section over and over (`loop` and `start` in `music.js`), blending each repeat into the next.
- `midi/*.mid`: the scores, one loop each. Open them in GarageBand, Logic, FL Studio, Ableton, Reaper or MuseScore to see the notes, change instruments, or re-record them with better sounds.
- `music.js`: the list the game reads. To use your own recording for a slot, replace its entry with just a file name: `village: 'my-village.mp3'` (it then loops the whole file).

## Changing the music

The notes are written in `tools/music/tracks.py` (one function per track). After editing, rebuild:

```bash
python3 tools/music/build.py            # every track
python3 tools/music/build.py village    # just one
```

That needs FluidSynth, the FluidR3 General MIDI soundfont, ffmpeg and numpy (`apt install fluidsynth fluid-soundfont-gm ffmpeg`, `pip install numpy`).

## Making it sound better

These renders use a free General MIDI sound set, so they sound like a good demo, not a finished soundtrack. The quickest big upgrade: open the MIDI files in a music program and swap in better instruments (a felt piano, a real nylon guitar sample library, a warmer string patch), add a little reverb, export each as MP3 and replace the files. Keep each export exactly the length of one loop and list it as just a file name in `music.js`.

## Licence

The music is original to Lowmarsh. The renders use the FluidR3 GM soundfont (MIT licence), so they can be used in a commercial game.
