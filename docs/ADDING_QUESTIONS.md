# Adding questions (and importing past papers)

All questions live in `js/data/questions.js`. After any edit, run:

```bash
node tools/validate.js
```

This checks that every step's own answer is accepted by the answer checker, that a clearly wrong answer is rejected, and that every zone has enough questions.

## Format

```js
{
  id: 'rf-3',                       // unique. Past papers: 'edx-2019-p1-q7' etc.
  zone: 'reef',                     // which district / topic (see js/data/zones.js)
  source: 'Edexcel AS 2019 Paper 1 Q7',
  marks: 4,
  context: 'Story framing — what this fixes in Bathys.',     // optional
  prompt: R`The question as printed. Use $\LaTeX$ in dollars.`,
  steps: [
    {
      ask: R`What the student must find in this step.`,
      type: 'num',                  // see types below
      answer: 4,
      marks: 1,                     // optional, default 1
      hint: R`A nudge, not the answer.`,
      explain: R`The worked line, as it would appear in a model answer.`,
      // options: dp: 2 | sf: 3 | exact: true | vars: ['t'] | time: 40 (seconds)
    },
  ],
}
```

`R` is `String.raw`, so you can write `\frac` without doubling the backslashes.

### Step types

| type | player types | `answer` |
|---|---|---|
| `num` | `3/4`, `2√3`, `sqrt(5)`, `-1.5`, `x = 4`, `6180 N` | number or expression string (`'ln4/0.2'`). Add `dp`/`sf` for rounding, `exact: true` to reject decimals |
| `set` | `3, -4` or `x = 3 or x = -4` (any order) | array |
| `point` | `(3, -2)` | `[x, y]` |
| `vector` | `6i - 8j` or `(6, -8)` | `[i, j]` |
| `expr` | `3x^2 - 4/x`, `y = 5x - 15` | expression string. Checked by evaluating at sample points, so any equivalent form passes. `vars` defaults to `['x']` |
| `integral` | `2x^3 - 2x^2 + 3x + c` | the integral **without** `+ c`. Leaving out `+ c` is caught and explained |
| `antideriv` | as above, `+ c` not needed (definite integrals) | expression |
| `choice` | clicks one option | index into `choices` (options are shuffled on screen) |

## How to split a question into steps

Follow the mark scheme. Each **M** (method) or **A** (accuracy) mark usually becomes one step:

- If a step's method is the hard part, ask for an intermediate value ("Find the discriminant in terms of k").
- If the hard part is *choosing* a method or a form, use a `choice` step ("Which equation is correct?").
- Put the classic mistake into a wrong option or a hint. That's what the zone's boss is about.
- "Show that" questions: ask for each line's key quantity, then a final step for the shown result.

## Importing past papers

1. Upload the question paper **and** its mark scheme as PDFs (or images).
2. For each question: transcribe the prompt into LaTeX, use the mark scheme to split it into steps, use the scheme's accepted answers and accuracy (`awrt 2.73` → `sf: 3`) for each step, and give it an id like `edx-2022-as-p1-q5`.
3. Tag the zone by topic. Questions that span topics go in the main topic's zone. They can also be pulled into the Hadal Gate (mixed).
4. Diagram-heavy questions (sketches, graphs): describe the diagram in `context` for now. A graph widget is on the roadmap.
5. Run `node tools/validate.js`.

Planned: a **Past Paper mode** that plays one whole paper in order with the real time limit (marks × 1.2 minutes), then a mark-scheme breakdown at the end.
