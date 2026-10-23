# Adding questions, papers and story problems

After any edit, run:

```bash
node tools/validate.js
```

It checks that every step accepts its own answer and rejects a clearly wrong one, that every past paper adds up to exactly 75 marks, and that every story problem and encounter is well formed.

## Where things live

| What | File | Shape |
|---|---|---|
| Drill bank | `js/data/questions.js` | `{ id, topic, marks, context?, prompt, steps }` |
| Past papers | `js/data/papers*.js` | `add(id, title, [questions])`: also fills `PAPER_Q[questionId]` |
| Story problems | `js/story/ch*.js`, `finale.js`, `sides.js` | `STORY_PROBLEMS[id] = { id, topic, title, giver, source?, context, diagram?, prompt, steps, done }` |
| Encounters | the chapter files | `ENCOUNTERS[id] = { name, sprite, intro, check, flavor, talk, attacks, spareHint, problem }` |

`topic` is one of the ids in `js/data/topics.js` (`proof`, `indices`, `quadratics`, `graphs`, `coord`, `binomial`, `trig`, `explog`, `diff`, `integ`, `vectors`, `data`, `prob`, `kinematics`, `forces`).

## A step

```js
{
  ask: R`What the student must find in this step.`,
  type: 'num',                  // see the table below
  answer: 4,
  marks: 1,                     // optional, default 1
  hint: R`A nudge, not the answer.`,
  explain: R`The worked line, as it would appear in a model answer.`,
  rook: 'Optional aside from Rook after this step.',
  react: [['enemy', '...'], ['rook', '...']],   // encounters only: lines after the step is solved
  // options: dp: 2 | sf: 3 | exact: true | range: [a, b] | tol: 0.1 | vars: ['t']
}
```

`R` is `String.raw`, so you can write `\frac` without doubling the backslashes.

| type | player types | `answer` |
|---|---|---|
| `num` | `3/4`, `2√3`, `sqrt(5)`, `-1.5`, `x = 4`, `6180 N` | a number or an expression string (`'ln4/0.2'`) |
| `set` | `3, -4` (any order) | array |
| `tuple` | `42, 4` (in order) | array |
| `point` | `(3, -2)` | `[x, y]` |
| `vector` | `6i - 8j` or `(6, -8)` | `[i, j]` |
| `expr` | `3x^2 - 4/x` | expression string, checked at sample points so any equivalent form passes; `vars` defaults to `['x']` |
| `line` | `x + 2y - 19 = 0`, `y = -x/2 + 9.5`, `2x + 4y = 38` | the line as an expression equal to zero (`'x+2y-19'`); any equation of the same line passes |
| `integral` | `2x^3 + 3x + c` | the integral **without** `+ c`; a missing `+ c` is caught and explained |
| `antideriv` | as above, no `+ c` needed | expression |
| `choice` | clicks an option | index into `choices` (shown shuffled) |

## Splitting a question into steps

Follow the mark scheme. Each M or A mark usually becomes one step.

- If the method is the hard part, ask for an intermediate value ("Find the discriminant in terms of k").
- If choosing a method or a form is the hard part, use a `choice` step.
- Put the classic mistake into a wrong option or a hint.
- For "show that" questions, ask for each line's key quantity, then the shown result.
- For choice steps, check that no wrong option is also correct (for example, a second valid counter-example).

## Turning a paper question into a story problem

```js
P.sail = fromPaper('m22-6', { id: 'sail', title: 'New Sails for the Windpump', giver: 'rowan',
  context: 'Why this matters to someone in Lowmarsh, in their own voice.',
  done: 'What the answer means for them.' });
```

`fromPaper` keeps the real prompt and steps and the OCR source line. Pass `steps:` to add a final in-world step, for example "so is it safe?". To make it a side quest, hook it onto a villager with `wrap(...)`, as at the bottom of each chapter file, and add a row to the side-quest list (`SC.extraJobs`).
