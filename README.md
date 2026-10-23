# 🦐 THE DESCENT

**An A-level maths RPG.** Wake up as a krill in the drowned city of Bathys. Every district's guardian believes one classic maths mistake. Beat them with your working, sink 700 m to the Hadal Gate, and get home before your exam.

Inspired by Krillion (the daily dive and depth scoring), Undertale (FIGHT/ACT/ITEM/MERCY and dodging the boss's attacks), Pokémon Mystery Dungeon (the stranded hero and their partner), and Persona 5 (the calendar countdown, the hub room, changing hearts).

## Play

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

It also works when published as-is on GitHub Pages. Progress saves in your browser.

## Modes

- **Descend (story).** 14 AS districts plus the final Gate. Each boss fight is 3 multi-step exam-style questions with a 25 s Krillion timer per step. A wrong answer means dodging the boss's attacks.
- **Practice.** Any topic, no damage, optional timer, free hints, and worked solutions for every step.
- **Daily Dive.** 7 problems, same for everyone each day, one shot per step. 100 m per problem; 700 m is the trench floor. Gives you a shareable result grid.
- **Codex.** Elder Theta's lesson for every topic: method, worked example, the trap.
- **Calendar.** Set your exam date to see the countdown.

## Content

AS Maths: Pure (indices & surds, quadratics, equations/inequalities/graphs, coordinate geometry, binomial, trig, exponentials & logs, differentiation, integration, vectors), Statistics (data & sampling, probability, binomial, hypothesis testing), Mechanics (kinematics, forces). There are 51 original exam-style questions, 150 steps and 192 marks.

## Project layout

```
index.html            entry point
css/style.css         all styles
js/math.js            answer parser and checker (2√3, 3x^2-4/x, (3,-2), 6i-8j, + c …)
js/game.js            engine: screens, dialogue, battle, dodge, timer, daily dive
js/audio.js           WebAudio blips
js/data/zones.js      districts, bosses, misconceptions, lessons
js/data/questions.js  question bank
js/data/story.js      prologue and story beats
tools/validate.js     node tools/validate.js — checks every answer in the bank
docs/DESIGN.md        story, mechanics, inspirations, roadmap
docs/ADDING_QUESTIONS.md  question format + past-paper import guide
```
