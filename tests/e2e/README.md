# Playthrough tests

Browser tests that play the game the way a person would: they type, press Enter, walk into doors and solve problems with the real answer checker. Run them after any change.

```bash
python3 -m http.server 8765        # from the repo root, in another terminal
cd tests/e2e
npm install playwright             # once (or set PLAYWRIGHT_MODULE / CHROMIUM_PATH)
node ch1test.js                    # chapter 1 from a new game; also ch2test … ch5test
node fuzz.js ch3                   # talk to everyone and step on every trigger at the start of chapter 3 (ch1…ch5, open)
node reach.js                      # where can you walk in each chapter? gated areas, stranded characters
node rooms.js                      # the same inside every building
```

| Test | Checks |
|---|---|
| `ch1test`–`ch5test` | each chapter played through |
| `sidestest`, `sqtest`, `southtest` | side quests, leaving one with Not now, rewards and charms, the south bank |
| `planktest`, `gulltest`, `enter3` | leaving a problem, Esc, ending conversations with Enter |
| `newplayer`, `girltest` | a new game: name, boy/girl, controls card, first tips |
| `doortest` | a locked door puts you back on the path |
| `iphone` | every screen fits iPhone sizes in Safari |
| `fuzz`, `reach`, `rooms` | the whole world, chapter by chapter |

Screenshots land in `tests/e2e/shots/`. The answer checker has its own tests: `node tools/validate.js` and `node tools/answer-formats.js` (every correct answer written every reasonable way, and typical mistakes, against every step).
