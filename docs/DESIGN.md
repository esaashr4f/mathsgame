# Lowmarsh: design notes and story bible

## The core idea

Problems are never handed to you as an exam. Someone in Lowmarsh needs something: a plank long enough, a lamp lit, a verdict that's fair, a river back in its banks. The maths is how you help them. Most of the problems are real OCR AS questions with real numbers, so the game doubles as complete exam preparation.

Three rules:

1. **Every problem changes the world.** A plank appears, a light comes on, a causeway rises out of the flood, a lock opens.
2. **Working is the whole point.** Every problem is split into the steps a mark scheme rewards. Rook hints, "Talk me through it" explains, and the scratch pad and grapher are always there.
3. **No fighting.** FIGHT never works. Every encounter is a frightened or confused creature, and you spare it by solving its problem, one step per turn on a 25-second timer.

## The world

Lowmarsh is a fen village on the river Wend. To the north is the gorge and its broken bridge, to the east the cliff road to Gull Point, to the south the jetty, and to the west the meadows, the Wend Lock and the marsh. At the heart of the marsh is the Still, a ring of standing stones.

## The fog and the Hush

The great storm cracked the stones of the Still. What had been held there got out: the Hush, the part of every mind that says *don't bother asking why, just accept it*. It settled over Lowmarsh as fog, and everyone stopped checking and stopped working things out. People even got harder to count (chapter 3).

Mira Hale, the surveyor, measured where the fog came from (bearing 290° from Gull Point, chapter 2), told Cog to shut the lock, warned the Wend to remember her shape, and walked into the Still to put the Hush back. It caught her halfway through a proof. Since then she has been holding it at the Still, and the fog is her holding the door.

Before she went, she wrote on her census card asking Fen to send for "your [niece/nephew], the one with the maths book. Rook will need someone who still asks why." The player isn't special because they know the answers. They are special because they work them out, and the Hush can't take that.

Each problem solved is someone in Lowmarsh remembering how to think, so the fog thins chapter by chapter (`fogLevel`). Once the lock is open and the bridge is built, the fog has nothing left to feed on and pulls back to the Still. Proof is the one thing the Hush can't stand, because a proof is nothing but the reason *why*.

## Cast

- **Rook**: Mira's crow and your partner. Sarcastic and loyal. Knows every method but has no thumbs.
- **Aunt Fen**: baker, worrier, feeds stray crows.
- **Mira Hale**: town surveyor, missing until the finale.
- **Bramble**: the bridge troll (ch1 encounter), later your builder.
- **Ottoline**: the lighthouse keeper's ghost, since 1923 (ch2 encounter).
- **Magistrate Strix**: owl, judge, too decisive (ch3 encounter).
- **The Wend**: the river spirit, who has forgotten her own shape (ch4 encounter).
- **Cog**: lock golem, built 1887, frightened into keeping everything shut (ch5 encounter).
- **The Hush**: the fog's voice (finale).
- **Villagers**: Moss, Old Wick, Tomas, the Mayor, Nell, Old Jan, Pim, Dr Sorrel, Gran Ivy, Rowan and Tansy (and Pythagoras, Hypatia and Gerald the goats), Dilys the lock-keeper.

## Chapter structure

Each chapter has:

- a place that opens up;
- a main chain of 4–8 problems that changes that place;
- an encounter whose problem is the chapter's hardest idea;
- side quests across the village.

Objectives and Rook's hints come from the `STEPS` table in `js/story/guide.js`, in story order.

## Part Two (A level), not started

Mira's last words set it up: the Still wasn't the only one. There are older, bigger ones up the valley, past the new bridge, and the mathematics is harder up there. Part Two gets a new map north of the gorge (`SC.crossBridge` is the hook). It is waiting on the A level material.

## Engine notes

- The overworld is 100×72 tiles of 16 px, built procedurally in `maps.js` from story flags, so the world visibly changes as you play.
- Scripts are plain async functions using the `G` API in `main.js`: `say`, `choose`, `solve`, `battle`, `go`, `set`, `give`, `page`, `card` and so on.
- Side quests wrap an NPC's existing script so that it takes over their next conversation until done.
- Playthroughs are automated with Playwright: a test drives each chapter end to end, answering with the canonical answers.
