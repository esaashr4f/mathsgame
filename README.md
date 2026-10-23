# Lowmarsh

**An Undertale-style RPG that teaches OCR AS Mathematics (H230).** You arrive in Lowmarsh, a fog-bound fen village, for two weeks with your Aunt Fen. Since the great storm the fog has made everyone forget how to work things out. Mira Hale, the village surveyor, walked into the marsh and never came back. Her crow Rook can still talk, and still remembers her methods.

You put Lowmarsh back together one real problem at a time: a gangplank, a bridge, a lighthouse, a census, a flood, a lock. Every one of them is real AS maths, and most are real OCR exam questions, solved step by step with Rook's help.

Inspired by Undertale (talk your way through encounters, FIGHT never works, spare your enemies), Krillion (the step timer and the daily challenge) and Pokémon Mystery Dungeon (a stranded hero and a partner who believes in them).

## Play

No build step. Serve the folder and open it in a browser:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Progress saves in your browser, per account if you sign in (see [docs/ACCOUNTS.md](docs/ACCOUNTS.md)). Controls: arrows or WASD to move, Z or Enter to talk and confirm, C or Esc (or the ☰ MENU button, top left) for the menu, R to ask Rook. On a phone, use the on-screen pad, or switch to a floating joystick in Settings.

On phones the game takes the screen's shape: held sideways, the game fills the height with the pad on the left and the buttons on the right; held upright, the game fills the top and the controls fill the rest. There's a full-screen button (⛶) where the browser allows it, and the game can be added to the home screen to play full screen (`manifest.webmanifest`, `icons/`).

## Part One: AS level (complete)

| Chapter | Place | Maths | Encounter |
|---|---|---|---|
| Prologue & 1. Stranded | the ferry, the village, the gorge | surds, indices, quadratics, the discriminant, inequalities | Bramble the bridge troll |
| 2. The Dark Lighthouse | Gull Point | trig, sine and cosine rules, circles, coordinate geometry, probability | Ottoline the keeper's ghost |
| 3. The Census | the Town Hall | sampling, the Large Data Set, histograms, probability, binomial, hypothesis tests | Magistrate Strix |
| 4. The Rising | the flooded west meadows | first principles, rates of change, stationary points, optimisation, integration, exponentials and logs | the Wend, river spirit |
| 5. The Lock | the Wend Lock, the gorge | forces, F = ma, pulleys, variable and constant acceleration; vectors, data and moments for the bridge | Cog the lock golem |
| 6. The Still | the marsh | proof: counter-example, deduction, exhaustion, implication | the Hush |

There are 34 side quests, all listed in the pause menu under Side Quests. They come from OCR papers and from the OCR topic question packs.

Part Two (the rest of A level, on a new map up the road north) will be built once the A level material is in.

## Everything else in the menu

- **Mira's Notebook.** One page per topic, collected through the story. Each has a lesson, a worked example and the usual trap.
- **Past Papers.** All twelve OCR AS papers (H230/01 and H230/02, 2018 to 2023), filtered by exam board (Edexcel and AQA coming soon) and by AS, A Level or both. Sit them under exam conditions with a clock, work through them guided step by step, or pick out single questions.
- **Drills.** Practise by topic. Mixed and weak-topic drills too.
- **Daily Challenge.** 7 problems down the Lowmarsh well, a new set every day and the same for everyone. Every timer in the game runs at real exam pace: 72 seconds a mark.
- **Scratch Pad, Grapher, Formula Book.** Space to work things out, a grapher that plots anything you type, and the OCR formula booklet.

## Project layout

```
index.html               entry point (load order matters)
css/style.css            all styles
js/math.js               answer parser and checker (2√3, 3x^2-4/x, (3,-2), 6i-8j, + c, line equations …)
js/audio.js              WebAudio blips
js/engine/               graph.js (SVG plots), sprites.js, tiles.js, ui.js, world.js (overworld),
                         solver.js (step-by-step notebook, sessions), battle.js (encounters)
js/data/                 topics.js, questions.js (drill bank), papers.js / papers2.js (H230/01), papers3.js (H230/02)
js/story/                cast.js, maps.js, ch1–ch5.js, finale.js, sides.js (topic-pack side quests), guide.js (objectives, Rook's hints, side-quest list)
js/main.js               game shell: saves, menus, accounts screens, the G scripting API
js/auth.js, auth-config.js  accounts (local email accounts; Google/Apple via Firebase when configured)
tools/validate.js        node tools/validate.js checks every answer, paper total and story problem
docs/                    DESIGN.md (story bible and structure), ADDING_QUESTIONS.md
```

## Note on content

Past-paper questions are © OCR, used here for personal revision. Keep the repository private if you don't want to share them.
