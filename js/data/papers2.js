// OCR AS Level Mathematics A — H230/01, papers from November 2020, October 2021, June 2022 and June 2023.
// Steps follow each paper's mark scheme. Open-response parts (explain / comment / sketch) become multiple choice,
// using the mark-scheme answer and the classic wrong answers as distractors.
(function () {
  const R = String.raw;
  const sk = (f, x, y, extra) => Graph.sketch(f, x, y, extra);

  // A histogram as an SVG. bars: [[from, to, height]]
  function histo(bars, opts) {
    const W = 300, H = 170, pad = 22;
    const x0 = opts.x[0], x1 = opts.x[1], ymax = opts.ymax;
    const sx = x => pad + (x - x0) / (x1 - x0) * (W - 2 * pad), sy = y => H - pad - y / ymax * (H - 2 * pad);
    let s = '<svg class="graph" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="#fffdf6"/>';
    for (let g = 0; g <= ymax + 1e-9; g += opts.grid) s += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + sy(g) + '" y2="' + sy(g) + '" stroke="#e6e0cf"/>';
    bars.forEach(([a, b, h]) => { s += '<rect x="' + sx(a) + '" y="' + sy(h) + '" width="' + (sx(b) - sx(a)) + '" height="' + (sy(0) - sy(h)) + '" fill="#b8c6d8" stroke="#3a3550"/>'; });
    s += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + sy(0) + '" y2="' + sy(0) + '" stroke="#3a3550"/><line x1="' + pad + '" x2="' + pad + '" y1="' + sy(0) + '" y2="' + (pad - 6) + '" stroke="#3a3550"/>';
    opts.ticks.forEach(t => { s += '<text x="' + sx(t) + '" y="' + (H - 8) + '" font-size="9" text-anchor="middle" fill="#3a3550">' + t + '</text>'; });
    s += '<text x="' + (pad + 3) + '" y="' + (pad - 8) + '" font-size="9" fill="#3a3550">' + (opts.ylabel || 'frequency density') + '</text>';
    return s + '</svg>';
  }

  // ───────────────────────── November 2020 ─────────────────────────
  const o20 = [
    { id: 'o20-1a', num: '1(a)', topic: 'diff', marks: 3,
      prompt: R`Find $\dfrac{d}{dx}\left(x^3 - 3x + \dfrac{5}{x^2}\right)$.`,
      steps: [
        { ask: R`Write $\dfrac{5}{x^2}$ as $5x^n$. Find $n$.`, answer: -2, hint: R`$\frac1{x^2} = x^{?}$`, explain: R`$\dfrac{5}{x^2} = 5x^{-2}$` },
        { ask: 'Differentiate.', type: 'expr', answer: '3x^2-3-10x^(-3)', marks: 2, hint: R`$5x^{-2} \to 5 \times (-2)x^{-3}$`, explain: R`$3x^2 - 3 - 10x^{-3}$` },
      ] },
    { id: 'o20-1b', num: '1(b)', topic: 'integ', marks: 3,
      prompt: R`Find $\displaystyle\int \left(6x^2 - \dfrac{2}{x^3}\right)dx$.`,
      steps: [
        { ask: R`Write $\dfrac{2}{x^3}$ as $2x^n$. Find $n$.`, answer: -3, hint: 'Negative power.', explain: R`$\dfrac2{x^3} = 2x^{-3}$` },
        { ask: 'Integrate.', type: 'integral', answer: '2x^3+x^(-2)', marks: 2, hint: R`$\int 2x^{-3}dx = \dfrac{2x^{-2}}{-2}$ — and subtracting it flips the sign.`, explain: R`$2x^3 + x^{-2} + c$` },
      ] },
    { id: 'o20-2a', num: '2(a)', topic: 'vectors', marks: 2,
      prompt: R`Points $A$ and $B$ have position vectors $\begin{pmatrix}-3\\4\end{pmatrix}$ and $\begin{pmatrix}1\\2\end{pmatrix}$. Point $C$ has position vector $\begin{pmatrix}p\\1\end{pmatrix}$ and $ABC$ is a straight line. Find $p$.`,
      steps: [
        { ask: R`Find $\overrightarrow{AB}$.`, type: 'vector', answer: [4, -2], hint: 'End minus start.', explain: R`$\overrightarrow{AB} = \begin{pmatrix}4\\-2\end{pmatrix}$: every 4 across, 2 down.` },
        { ask: R`$C$ is one unit lower than $B$, on the same line. Find $p$.`, answer: 3, hint: 'Going 2 down means 4 across, so going 1 down means...', explain: R`Half of $\overrightarrow{AB}$ from $B$: $p = 1 + 2 = 3$` },
      ] },
    { id: 'o20-2b', num: '2(b)', topic: 'vectors', marks: 3,
      prompt: R`Same points $A(-3, 4)$, $B(1, 2)$. Point $D$ has position vector $\begin{pmatrix}q\\1\end{pmatrix}$ and angle $ABD = 90°$. Determine $q$.`,
      steps: [
        { ask: R`Gradient of $AB$?`, answer: '-1/2', hint: R`$\dfrac{2-4}{1-(-3)}$`, explain: R`$m_{AB} = -\tfrac12$` },
        { ask: R`Gradient of $BD$ (perpendicular)?`, answer: 2, hint: 'Negative reciprocal.', explain: R`$m_{BD} = 2$, so $BD$: $y - 2 = 2(x - 1)$, i.e. $y = 2x$` },
        { ask: R`$D$ has $y = 1$. Find $q$.`, answer: 0.5, hint: R`$1 = 2q$`, explain: R`$q = \tfrac12$` },
      ] },
    { id: 'o20-3a', num: '3(a)', topic: 'trig', marks: 5, dr: true,
      prompt: R`Solve $4\sin^2\theta = \tan^2\theta$ for $0° \le \theta \le 180°$.`,
      steps: [
        { ask: R`Write $\tan^2\theta = \dfrac{\sin^2\theta}{\cos^2\theta}$ and rearrange. What do you get?`, type: 'choice', choices: [R`$\sin\theta = 0$ or $\cos^2\theta = \tfrac14$`, R`$\cos^2\theta = \tfrac14$ only`, R`$4\cos^2\theta = 1 + \sin\theta$`, R`$\sin^2\theta = 4$`], answer: 0,
          hint: R`$4\sin^2\theta\cos^2\theta = \sin^2\theta$. Don't divide by $\sin^2\theta$ without keeping the $\sin\theta = 0$ case!`, explain: R`$\sin^2\theta(4\cos^2\theta - 1) = 0 \Rightarrow \sin\theta = 0$ or $\cos^2\theta = \tfrac14$` },
        { ask: R`Values of $\cos\theta$ from $\cos^2\theta = \tfrac14$:`, type: 'set', answer: [0.5, -0.5], hint: R`$\pm$`, explain: R`$\cos\theta = \pm\tfrac12$` },
        { ask: R`All solutions in $0° \le \theta \le 180°$:`, type: 'set', answer: [0, 60, 120, 180], marks: 3, hint: R`$\sin\theta = 0$ gives two (the interval includes both ends). $\cos\theta = \pm\tfrac12$ gives two more.`, explain: R`$\theta = 0°, 60°, 120°, 180°$` },
      ] },
    { id: 'o20-3b', num: '3(b)', topic: 'trig', marks: 3, dr: true,
      prompt: R`Prove that $\dfrac{\sin^2\theta - 1 + \cos\theta}{1 - \cos\theta} \equiv \cos\theta$ $(\cos\theta \ne 1)$. (Let $c = \cos\theta$.)`,
      steps: [
        { ask: R`Use $\sin^2\theta = 1 - \cos^2\theta$. The numerator becomes (in terms of $c$):`, type: 'expr', vars: ['c'], answer: 'c-c^2', hint: R`$1 - c^2 - 1 + c$`, explain: R`Numerator $= \cos\theta - \cos^2\theta$` },
        { ask: 'Factorise the numerator (in terms of c).', type: 'expr', vars: ['c'], answer: 'c(1-c)', hint: 'Take out c.', explain: R`$\cos\theta(1 - \cos\theta)$` },
        { ask: 'Finish:', type: 'choice', choices: [R`$\dfrac{\cos\theta(1-\cos\theta)}{1-\cos\theta} = \cos\theta$, cancelling since $\cos\theta \ne 1$.`, R`Put $\theta = 0$: both sides equal 1.`, R`$\sin^2\theta - 1 = \cos^2\theta$, so it works.`, R`Multiply both sides by $1 - \cos\theta$ and it's true.`], answer: 0, hint: 'Cancel the common factor — which is allowed because it isn\'t zero.', explain: R`$\dfrac{\cos\theta(1 - \cos\theta)}{1 - \cos\theta} \equiv \cos\theta$ ∎` },
      ] },
    { id: 'o20-4', num: '4', topic: 'binomial', marks: 5,
      prompt: R`(a) Expand $(1+x)^4$. (b) <b>Use your expansion</b> to determine the exact value of $1002^4$.`,
      steps: [
        { ask: R`(a) $(1+x)^4 = $ ?`, type: 'expr', answer: '1+4x+6x^2+4x^3+x^4', hint: 'Pascal: 1 4 6 4 1.', explain: R`$1 + 4x + 6x^2 + 4x^3 + x^4$` },
        { ask: R`(b) $1002^4 = 1000^4 \times (1 + x)^4$. What is $x$?`, answer: 0.002, hint: R`$1002 = 1000(1 + ?)$`, explain: R`$x = 0.002$` },
        { ask: R`Find $(1.002)^4$ exactly using the expansion (all the terms).`, answer: 1.008024032016, hint: R`$1 + 0.008 + 0.000024 + 0.000000032 + 0.000000000016$`, explain: R`$1.008024032016$`, marks: 2 },
        { ask: R`So $1002^4 = $ ? (type every digit)`, answer: 1008024032016, strict: true, hint: R`Multiply by $1000^4 = 10^{12}$.`, explain: R`$1\,008\,024\,032\,016$` },
      ] },
    { id: 'o20-5', num: '5', topic: 'integ', marks: 8,
      prompt: R`$f(x) = (x+a)(x+3a)(x-b)$ where $a$, $b$ are positive integers. (a)(b) Sketch $y = f(x)$, showing where it meets the axes. (c) With $a = 1$, $b = 4$, find the total area enclosed between the curve and the $x$-axis.`,
      steps: [
        { ask: 'Which sketch is the right shape?', type: 'choice', marks: 2, choices: [sk('(x+1)(x+3)(x-4)/6', [-4, 5], [-6, 4]), sk('-(x+1)(x+3)(x-4)/6', [-4, 5], [-4, 6]), sk('(x-1)(x-3)(x+4)/6', [-5, 4], [-4, 6]), sk('(x+1)(x+3)/2', [-4, 5], [-2, 6])], answer: 0,
          hint: 'Positive cubic, two roots left of O (−3a and −a), one to the right (b).', explain: R`Positive cubic crossing the $x$-axis at $-3a$, $-a$ and $b$.` },
        { ask: R`The $y$-intercept, in terms of $a$ and $b$:`, type: 'expr', vars: ['a', 'b'], answer: '-3a^2*b', marks: 2, hint: R`Put $x = 0$: $(a)(3a)(-b)$.`, explain: R`$(0, -3a^2b)$; $x$-intercepts $(-3a, 0)$, $(-a, 0)$, $(b, 0)$.` },
        { ask: R`$a = 1$, $b = 4$: $f(x) = x^3 - 13x - 12$. Find $\displaystyle\int_{-3}^{-1} f(x)\,dx$.`, answer: 8, hint: R`$\left[\tfrac{x^4}{4} - \tfrac{13x^2}{2} - 12x\right]_{-3}^{-1}$`, explain: R`$= 8$ (above the axis)` },
        { ask: R`Find $\displaystyle\int_{-1}^{4} f(x)\,dx$.`, answer: -93.75, hint: 'Same antiderivative, new limits. Expect a negative answer — this part is below the axis.', explain: R`$= -93.75$ (below the axis)` },
        { ask: 'Total area enclosed?', answer: 101.75, marks: 2, hint: 'Areas are positive: add the sizes.', explain: R`$8 + 93.75 = 101.75$ (not $8 - 93.75$!)` },
      ] },
    { id: 'o20-6a', num: '6(a)', topic: 'graphs', marks: 4, dr: true,
      prompt: R`Solve the inequality $x^2 + x - 6 > 0$, giving your answer in set notation.`,
      steps: [
        { ask: 'Critical values:', type: 'set', answer: [2, -3], marks: 2, hint: R`$(x - 2)(x + 3)$`, explain: R`$x = 2, -3$` },
        { ask: 'Region:', type: 'choice', choices: [R`$x < -3$ or $x > 2$`, R`$-3 < x < 2$`, R`$x > 2$`, R`$x < -3$`], answer: 0, hint: 'U-shaped: positive outside the roots.', explain: R`$x < -3$ or $x > 2$` },
        { ask: 'In set notation:', type: 'choice', choices: [R`$\{x : x < -3\} \cup \{x : x > 2\}$`, R`$\{x : x < -3\} \cap \{x : x > 2\}$`, R`$\{x : -3 < x < 2\}$`, R`$\{-3, 2\}$`], answer: 0, hint: '"or" is a union.', explain: R`$\{x : x < -3\} \cup \{x : x > 2\}$` },
      ] },
    { id: 'o20-6b', num: '6(b)', topic: 'indices', marks: 4, dr: true,
      prompt: R`Solve the equation $x^3 - 7x^{\frac32} - 8 = 0$.`,
      steps: [
        { ask: R`Let $y = x^{\frac32}$. The equation becomes...`, type: 'choice', choices: [R`$y^2 - 7y - 8 = 0$`, R`$y^3 - 7y - 8 = 0$`, R`$y^2 - 7y^{\frac32} - 8 = 0$`, R`$y - 7y - 8 = 0$`], answer: 0, hint: R`$x^3 = \left(x^{\frac32}\right)^2$`, explain: R`$y^2 - 7y - 8 = 0$` },
        { ask: R`Solve for $y$.`, type: 'set', answer: [8, -1], hint: R`$(y - 8)(y + 1)$`, explain: R`$y = 8$ or $y = -1$` },
        { ask: R`Which value of $y$ is impossible, and why?`, type: 'choice', choices: [R`$y = -1$: $x^{\frac32} = \sqrt{x}^3$ can't be negative.`, R`$y = 8$: too big.`, 'Neither — both give solutions.', R`$y = -1$: you can't square $-1$.`], answer: 0, hint: R`$x^{\frac32}$ is a square root, cubed.`, explain: R`$x^{\frac32} = -1$ has no solution.` },
        { ask: R`Solve $x^{\frac32} = 8$.`, answer: 4, hint: R`Raise both sides to the power $\tfrac23$.`, explain: R`$x = 8^{\frac23} = 4$` },
      ] },
    { id: 'o20-6c', num: '6(c)', topic: 'explog', marks: 5, dr: true,
      prompt: R`Find the exact solution of the equation $(3^x)^2 = 3 \times 2^x$.`,
      steps: [
        { ask: 'Take natural logs of both sides. Which is correct?', type: 'choice', marks: 2, choices: [R`$2x\ln3 = \ln3 + x\ln2$`, R`$2x\ln3 = x\ln6$`, R`$x^2\ln3 = \ln3 + x\ln2$`, R`$2x\ln3 = \ln3 \times x\ln2$`], answer: 0, hint: R`$\ln(3^{2x}) = 2x\ln3$; $\ln(3 \times 2^x) = \ln3 + x\ln2$`, explain: R`$2x\ln3 = \ln3 + x\ln2$` },
        { ask: R`Collect the $x$ terms and give $x$ exactly.`, answer: 'ln3/(2ln3-ln2)', exact: true, marks: 3, hint: R`$x(2\ln3 - \ln2) = \ln3$`, explain: R`$x = \dfrac{\ln3}{2\ln3 - \ln2} = \dfrac{\ln 3}{\ln 4.5}$` },
      ] },
    { id: 'o20-7', num: '7', topic: 'quadratics', marks: 5,
      prompt: R`Determine the points of intersection of the curve $3xy + x^2 + 14 = 0$ and the line $x + 2y = 4$.`,
      steps: [
        { ask: R`Substitute $x = 4 - 2y$ and simplify. Which equation?`, type: 'choice', marks: 2, choices: [R`$y^2 + 2y - 15 = 0$`, R`$y^2 - 2y - 15 = 0$`, R`$2y^2 + 4y + 30 = 0$`, R`$y^2 + 2y + 15 = 0$`], answer: 0, hint: R`$3(4-2y)y + (4-2y)^2 + 14 = 0 \Rightarrow -2y^2 - 4y + 30 = 0$`, explain: R`$12y - 6y^2 + 16 - 16y + 4y^2 + 14 = 0 \Rightarrow y^2 + 2y - 15 = 0$` },
        { ask: R`Solve for $y$.`, type: 'set', answer: [3, -5], hint: R`$(y + 5)(y - 3)$`, explain: R`$y = 3$ or $y = -5$` },
        { ask: R`Intersection point with $y = 3$:`, type: 'point', answer: [-2, 3], hint: R`$x = 4 - 2y$`, explain: R`$(-2, 3)$` },
        { ask: R`Intersection point with $y = -5$:`, type: 'point', answer: [14, -5], hint: R`$x = 4 - 2(-5)$`, explain: R`$(14, -5)$` },
      ] },
    { id: 'o20-8', num: '8', topic: 'data', marks: 5,
      prompt: R`The histogram shows the lengths $l$ cm of a sample of worms (heights are in grid squares). There are 30 worms in the class $3 \le l < 4$.` + histo([[0, 2, 1.6], [2, 3, 5.4], [3, 4, 6], [4, 5, 4.8], [5, 9, 2.4]], { x: [0, 10], ymax: 6.5, grid: 0.5, ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ylabel: 'frequency density (squares)' }),
      steps: [
        { ask: R`The $3 \le l < 4$ bar is 6 units tall and 1 cm wide, and holds 30 worms. How many worms is 1 unit of height × 1 cm of width?`, answer: 5, hint: R`$30 \div 6$`, explain: R`Area: 1 unit² ↔ 5 worms` },
        { ask: R`(a) How many worms in $0 \le l < 2$? (height 1.6)`, answer: 16, hint: R`$1.6 \times 2 \times 5$`, explain: R`$1.6 \times 2 \times 5 = 16$` },
        { ask: R`(b) Frequencies of $4 \le l < 5$ (height 4.8) and $5 \le l < 9$ (height 2.4) — what's the frequency in $5 \le l < 6$?`, answer: 12, hint: R`$2.4 \times 1 \times 5$`, explain: R`$4$–$5$: 24 worms. $5$–$6$: 12 worms.` },
        { ask: R`Estimate the number with $4.5 \le l < 5.5$.`, answer: 18, marks: 2, hint: 'Half of the 4–5 class plus half of the 5–6 class.', explain: R`$\tfrac12(24) + \tfrac12(12) = 18$` },
      ] },
    { id: 'o20-9', num: '9', topic: 'data', marks: 8,
      prompt: 'A researcher takes the 15 Local Authorities (LAs) outside London with the largest decreases in the percentage of people driving to work (2001 → 2011) and tabulates changes in travel. Highlights: Brighton & Hove (bicycle +2.1, foot +2.3), Cambridge (bicycle +3.1), Oxford (bicycle +2.2, foot +2.1), Exeter (bicycle +1.7, foot +3.4); "work at home" rises in every LA (0.7 to 4.3, Waverley largest at 4.3); "train" rises in every LA (0.6 to 4.1). The decreases in driving range from −8.2 (Brighton) to −3.6, with no clear pattern against the home-working figures.',
      steps: [
        { ask: '(a) Why might these not be the 15 LAs with the largest decreases?', type: 'choice', choices: ['London LAs were excluded, and some of them might have larger decreases.', 'The sample is too small.', 'The data is from 2011.', 'Some LAs have negative values.'], answer: 0, hint: 'Read the description of what was chosen.', explain: 'London LAs were excluded — one of them may have had a larger decrease.' },
        { ask: '(b) Which four LAs were most successful at encouraging cycling or walking?', type: 'choice', marks: 2, choices: ['Brighton and Hove, Cambridge, Oxford, Exeter — the largest increases in both cycling and walking.', 'Waverley, Tandridge, Mole Valley, Elmbridge — the most home working.', 'Watford, Chiltern, Elmbridge, Epsom — the most train use.', 'The four with the largest decrease in driving.'], answer: 0, hint: 'Look at the Bicycle and On foot columns.', explain: 'Brighton & Hove, Cambridge, Oxford and Exeter have the largest increases in cycling and walking.' },
        { ask: '(c) Does the data show Waverley had the largest increase in the NUMBER working from home?', type: 'choice', choices: ['No — the data are percentages; an LA with a bigger population could have a larger increase in number.', 'Yes — 4.3 is the largest figure.', 'Yes — but only for these 15 LAs.', 'No — Waverley\'s figure is negative.'], answer: 0, hint: 'Percentages vs numbers.', explain: 'No: percentages, not numbers, and population sizes are unknown.' },
        { ask: '(d) Which two categories replaced driving for the most workers?', type: 'choice', marks: 3, choices: ['Working at home and train — both positive in every LA, with the largest values (4.3 and 4.1).', 'Bicycle and on foot.', 'Bus and passenger.', 'Underground and bus.'], answer: 0, hint: 'Which two columns are consistently large and positive?', explain: 'Work mainly at/from home and Train: all entries positive (smallest 0.7 and 0.6), largest 4.3 and 4.1.' },
        { ask: '(e) Strong correlation between the decrease in driving and the increase in home working?', type: 'choice', choices: ['Not supported: driving decreases fall steadily down the table, but the home figures show no pattern.', 'Yes — both columns change.', 'Yes — strong negative correlation.', 'Cannot comment without calculation.'], answer: 0, hint: 'As you go down the (ordered) driving column, does the home column follow?', explain: 'The driving figures change steadily but the home figures jump about — no strong correlation.' },
      ] },
    { id: 'o20-10', num: '10', topic: 'prob', marks: 8,
      prompt: 'A manufacturer claims 1 in 4 biscuit packets contain a free gift. Marisa suspects the true proportion is less. She chooses 20 packets at random and finds exactly 1 contains a gift. (a) Test the claim at the 2.5% significance level. (b) Later she finds that in three boxes of 40, one box has 19 gifts and the other two have none. Why does this suggest the binomial model may not be appropriate?',
      steps: [
        { ask: 'Hypotheses:', type: 'choice', marks: 2, choices: [R`$H_0: p = 0.25$, $H_1: p < 0.25$, where $p$ = proportion of packets with a gift`, R`$H_0: p = 0.25$, $H_1: p \ne 0.25$`, R`$H_0: p = 0.05$, $H_1: p < 0.05$`, R`$H_0: p < 0.25$, $H_1: p = 0.25$`], answer: 0, hint: 'She suspects LESS than 1 in 4.', explain: R`$H_0: p = 0.25$, $H_1: p < 0.25$` },
        { ask: R`$X \sim B(20, 0.25)$. Find $P(X \le 1)$ (3 s.f.).`, answer: 0.0243126, sf: 3, marks: 2, hint: R`$P(X = 0) + P(X = 1)$`, explain: R`$P(X \le 1) = 0.0243$` },
        { ask: 'Conclusion:', type: 'choice', marks: 3, choices: ['0.0243 < 0.025: reject H₀. There is sufficient evidence that the proportion with a gift is less than 1 in 4.', '0.0243 < 0.025: the proportion IS less than 1 in 4.', '0.0243 > 0.025: do not reject H₀.', 'Reject H₁.'], answer: 0, hint: 'Compare with 2.5%, and conclude non-assertively in context.', explain: R`$0.0243 < 0.025$: reject $H_0$ — sufficient evidence that the proportion is less than $0.25$.` },
        { ask: '(b) Why might the binomial model not be appropriate?', type: 'choice', choices: ['Gifts seem to be clustered in boxes, so packets are not independent (p isn\'t constant).', 'The sample was too small.', 'Boxes hold 40 packets, not 20.', 'The proportion is clearly 1 in 4.'], answer: 0, hint: 'Binomial needs independent trials.', explain: 'Gifts are clustered by box, so whether a packet has a gift is not independent of the others.' },
      ] },
    { id: 'o20-11', num: '11', topic: 'prob', marks: 4, dr: true,
      prompt: R`A biased four-sided spinner: $P(X = x) = \tfrac12 - \tfrac1{10}x$ for $x = 1, 2, 3, 4$. (a) Tabulate the distribution. (b) It is spun three times. Find the probability that the third value is greater than the sum of the first two.`,
      steps: [
        { ask: R`(a) Give $P(X=1), P(X=2), P(X=3), P(X=4)$ in order.`, type: 'tuple', answer: [0.4, 0.3, 0.2, 0.1], hint: R`$\tfrac12 - \tfrac{x}{10}$ for each $x$.`, explain: R`$0.4,\ 0.3,\ 0.2,\ 0.1$` },
        { ask: R`(b) Third = 3 needs the first two to sum to 2, i.e. (1, 1). Probability of this case?`, answer: '0.2*0.4*0.4', hint: R`$P(3) \times P(1) \times P(1)$`, explain: R`$0.2 \times 0.4^2 = 0.032$` },
        { ask: R`Third = 4 needs a first-two sum of 2 or 3: (1,1), (1,2), (2,1). Probability of this case?`, answer: '0.1*(0.16+0.12+0.12)', hint: R`$0.1 \times (0.4^2 + 2 \times 0.4 \times 0.3)$`, explain: R`$0.1 \times 0.4 = 0.04$` },
        { ask: 'Total probability?', answer: 0.072, hint: 'Add the cases.', explain: R`$0.032 + 0.04 = 0.072$` },
      ] },
  ];

  // ───────────────────────── October 2021 ─────────────────────────
  const cubic21 = '(x-1)(x-2)(x-3)+0.5';
  const o21 = [
    { id: 'o21-1', num: '1', topic: 'trig', marks: 7,
      prompt: R`In triangle $ABC$, $AB = 3$, $BC = 4$ and angle $ABC = 30°$. Find (a) the area, (b) $AC$, (c) angle $ACB$.`,
      steps: [
        { ask: '(a) Area?', answer: 3, marks: 2, hint: R`$\tfrac12 \times 3 \times 4 \times \sin30°$`, explain: R`$\tfrac12 \times 3 \times 4 \times \tfrac12 = 3$` },
        { ask: R`(b) $AC$ (3 s.f.)?`, answer: 'sqrt(25-24cos(pi/6))', sf: 3, marks: 2, hint: R`Cosine rule: $AC^2 = 9 + 16 - 24\cos30°$`, explain: R`$AC^2 = 4.215\ldots$, $AC = 2.05$` },
        { ask: R`(c) Angle $ACB$ in degrees (3 s.f.)?`, answer: 46.9357, sf: 3, marks: 3, hint: R`Sine rule: $\dfrac{\sin C}{3} = \dfrac{\sin 30°}{2.053}$. (C is opposite AB = 3.)`, explain: R`$\sin C = \dfrac{3 \times 0.5}{2.053} = 0.7306$, $C = 46.9°$` },
      ] },
    { id: 'o21-2', num: '2', topic: 'diff', marks: 4,
      prompt: R`A town's population is modelled by $n = 12500 + \dfrac{5000}{t}$ for $t \ge 1$ (years). Find the rate of change of $n$ when $t = 5$.`,
      steps: [
        { ask: R`$\dfrac{dn}{dt} = $ ? (in terms of t)`, type: 'expr', vars: ['t'], answer: '-5000t^(-2)', marks: 2, hint: R`$\dfrac{5000}{t} = 5000t^{-1}$`, explain: R`$\dfrac{dn}{dt} = -5000t^{-2}$` },
        { ask: R`At $t = 5$:`, answer: -200, marks: 2, hint: R`$-5000 \div 25$`, explain: R`$-200$ people per year (the population is falling).` },
      ] },
    { id: 'o21-3', num: '3', topic: 'graphs', marks: 6,
      prompt: R`The diagram shows $y = f(x)$, a cubic, which crosses the line $y = \tfrac12$ at $x = 1, 2, 3$.` + Graph.svg({ w: 300, h: 190, x: [-3.5, 3.5], y: [-2, 2], xstep: 1, ystep: 1, fns: [{ f: cubic21, color: '#14141c' }], hlines: [{ y: 0.5, label: 'y = ½', color: '#2a9d6a' }] }),
      steps: [
        { ask: R`(a) $f(x) < \tfrac12$ for...`, type: 'choice', marks: 3, choices: [R`$\{x : x < 1\} \cup \{x : 2 < x < 3\}$`, R`$\{x : 1 < x < 2\} \cup \{x : x > 3\}$`, R`$\{x : x < 3\}$`, R`$\{x : x < 1\} \cap \{x : 2 < x < 3\}$`], answer: 0, hint: R`Where is the curve BELOW the line $y = \tfrac12$?`, explain: R`Below the line for $x < 1$ and for $2 < x < 3$.` },
        { ask: R`(b) The graph of $y = f(-x)$ is:`, type: 'choice', marks: 2, choices: [sk('(-x-1)(-x-2)(-x-3)+0.5', [-3.5, 3.5], [-2, 2]), sk('-((x-1)(x-2)(x-3)+0.5)', [-3.5, 3.5], [-2, 2]), sk('(x-1)(x-2)(x-3)-0.5', [-3.5, 3.5], [-2, 2]), sk('(x+1)(x+2)(x+3)', [-3.5, 3.5], [-2, 2])], answer: 0, hint: R`$f(-x)$: reflect in the $y$-axis.`, explain: R`Reflection in the $y$-axis: through $(-1, \tfrac12), (-2, \tfrac12), (-3, \tfrac12)$.` },
        { ask: '(c) Why can\'t f(x) be written as three real linear factors?', type: 'choice', choices: ['The curve crosses the x-axis only once, so there is only one real root.', 'It has a maximum and a minimum.', 'Its leading coefficient is positive.', 'It passes through (1, ½).'], answer: 0, hint: 'Three real linear factors ⇒ three real roots (counting repeats).', explain: 'Only one intersection with the x-axis, so only one real root.' },
      ] },
    { id: 'o21-4', num: '4', topic: 'vectors', marks: 7,
      prompt: R`(a) Simplify $2\begin{pmatrix}6\\-3\end{pmatrix} - 3\begin{pmatrix}-1\\2\end{pmatrix}$. (b) $\mathbf{a} = r\begin{pmatrix}6\\-3\end{pmatrix} + s\begin{pmatrix}-1\\2\end{pmatrix}$. Find two pairs $(r, s)$ such that $\mathbf{a}$ is parallel to the $y$-axis and $|\mathbf{a}| = 3$.`,
      steps: [
        { ask: '(a) Simplify:', type: 'vector', answer: [15, -12], marks: 2, hint: R`$\begin{pmatrix}12\\-6\end{pmatrix} - \begin{pmatrix}-3\\6\end{pmatrix}$`, explain: R`$\begin{pmatrix}15\\-12\end{pmatrix}$` },
        { ask: R`(b) Parallel to the $y$-axis means the $\mathbf{i}$-component is 0: $6r - s = 0$. So $s = $ ? (in terms of r)`, type: 'expr', vars: ['r'], answer: '6r', marks: 2, hint: 'Rearrange.', explain: R`$s = 6r$` },
        { ask: R`Then the $\mathbf{j}$-component is $-3r + 2s = 9r$. Solve $|9r| = 3$.`, type: 'set', answer: ['1/3', '-1/3'], marks: 2, hint: R`$81r^2 = 9$`, explain: R`$r = \pm\tfrac13$` },
        { ask: R`When $r = \tfrac13$, $s = $ ?`, answer: 2, hint: R`$s = 6r$`, explain: R`$(r, s) = (\tfrac13, 2)$ or $(-\tfrac13, -2)$` },
      ] },
    { id: 'o21-5', num: '5', topic: 'diff', marks: 8,
      prompt: R`Jamal models fuel consumption $C$ (miles per gallon) at speed $v$ mph by $C = \tfrac{12}{5}v - \tfrac{3}{125}v^2$, for $0 \le v \le 80$.`,
      steps: [
        { ask: '(a) Why include an upper limit?', type: 'choice', choices: ['The car can\'t (or won\'t) go faster than about 80 mph — and the model would eventually give negative C.', 'To make the maths easier.', 'Because 80 is a round number.', 'Fuel consumption is always below 80.'], answer: 0, hint: 'What happens to the formula at large v?', explain: 'Max speed of the car / the model eventually gives negative consumption.' },
        { ask: R`(b) $\dfrac{dC}{dv} = $ ?`, type: 'expr', vars: ['v'], answer: '12/5-6v/125', hint: 'Differentiate term by term.', explain: R`$\dfrac{dC}{dv} = \tfrac{12}{5} - \tfrac{6}{125}v$` },
        { ask: 'Speed for maximum fuel consumption (mph)?', answer: 50, marks: 2, hint: R`Set $\tfrac{12}{5} - \tfrac{6v}{125} = 0$.`, explain: R`$v = 50$ mph` },
        { ask: 'How do you know it\'s a maximum?', type: 'choice', choices: [R`$\dfrac{d^2C}{dv^2} = -\tfrac{6}{125} < 0$`, R`$C > 0$ at $v = 50$`, 'Because 50 is in the middle.', R`$\dfrac{dC}{dv} = 0$`], answer: 0, hint: 'Second derivative.', explain: R`$\dfrac{d^2C}{dv^2} = -\tfrac6{125} < 0$, so a maximum at 50 mph.` },
        { ask: R`(c) Why is $C = \tfrac{12}{5}v - \tfrac{3}{125}v^2 + k$ ($k > 0$) unsuitable?`, type: 'choice', choices: [R`At $v = 0$ it gives $C = k \ne 0$ — a car that isn't moving doesn't do any miles per gallon.`, R`$k$ is too small.`, 'It has no maximum.', 'It is not a quadratic.'], answer: 0, hint: 'Try v = 0.', explain: R`At $v = 0$, $C = k > 0$, which makes no sense.` },
        { ask: '(d) A more suitable change:', type: 'choice', marks: 2, choices: [R`Multiply the whole formula by a constant $k > 1$.`, R`Add a constant $k$.`, R`Change the upper limit to 100.`, R`Replace $v$ with $v + k$.`], answer: 0, hint: 'Keep C = 0 at v = 0 but make every value bigger.', explain: R`$C = k\left(\tfrac{12}{5}v - \tfrac{3}{125}v^2\right)$ with $k > 1$.` },
      ] },
    { id: 'o21-6', num: '6', topic: 'indices', marks: 3,
      prompt: R`A wind turbine's power $P$ watts is proportional to the cube of the wind speed $v$ m/s. When $v = 3.6$, $P = 50$. Find the wind speed giving $225$ W.`,
      steps: [
        { ask: R`$P = kv^3$. Find $k$ (3 s.f.).`, answer: '50/3.6^3', sf: 3, hint: R`$k = 50 \div 3.6^3$`, explain: R`$k = 1.07$` },
        { ask: R`Solve $kv^3 = 225$ (3 s.f.).`, answer: 5.94347, sf: 3, marks: 2, hint: R`$v = \sqrt[3]{225 / k}$`, explain: R`$v = 5.94$ m/s` },
      ] },
    { id: 'o21-7', num: '7', topic: 'explog', marks: 3,
      prompt: R`$Q = aP^n$, where $a$ and $n$ are constants. Some values of $P$ and $Q$ are obtained from an experiment.`,
      steps: [
        { ask: '(a) What should you plot to get a straight line?', type: 'choice', choices: [R`$\log Q$ against $\log P$`, R`$Q$ against $P$`, R`$\log Q$ against $P$`, R`$Q$ against $P^2$`], answer: 0, hint: R`Take logs: $\log Q = \log a + n\log P$.`, explain: R`$\log Q$ against $\log P$` },
        { ask: R`(b) How do you estimate $n$?`, type: 'choice', marks: 2, choices: [R`$\log Q = n\log P + \log a$ is $Y = mX + c$, so $n$ is the gradient of the line of best fit.`, R`$n$ is the $y$-intercept.`, R`$n$ is $10^{\text{gradient}}$.`, R`$n$ is the largest value of Q.`], answer: 0, hint: R`Compare with $Y = mX + c$.`, explain: R`Gradient $= n$ (and the intercept is $\log a$).` },
      ] },
    { id: 'o21-8', num: '8', topic: 'proof', marks: 5,
      prompt: R`(a) Prove that this is not true: $p$ is a positive integer $\Rightarrow 2^p \ge p^2$. (b) Prove: $m$ and $n$ are consecutive positive odd numbers $\Rightarrow mn + 1$ is the square of an even number.`,
      steps: [
        { ask: '(a) Counter-example:', type: 'choice', choices: [R`$p = 3$: $2^3 = 8 < 9 = 3^2$`, R`$p = 4$: $16 = 16$`, R`$p = 1$: $2 \ge 1$`, R`$p = 5$: $32 > 25$`], answer: 0, hint: 'Find p where 2^p is smaller.', explain: R`$p = 3$: $8 < 9$. ∎` },
        { ask: R`(b) Let the odd numbers be $n$ and $n + 2$. Write $n(n+2) + 1$ as a perfect square: $(\ldots)^2$. What's inside the bracket?`, type: 'expr', vars: ['n'], answer: 'n+1', marks: 2, hint: R`$n^2 + 2n + 1$`, explain: R`$n(n+2) + 1 = n^2 + 2n + 1 = (n + 1)^2$` },
        { ask: 'Conclusion:', type: 'choice', marks: 2, choices: [R`$n$ is odd, so $n + 1$ is even: $mn + 1 = (n+1)^2$ is the square of an even number.`, R`It works for 1 and 3: $1 \times 3 + 1 = 4$.`, R`$(n+1)^2$ is always even.`, R`$n + 2$ is odd.`], answer: 0, hint: 'Why is n + 1 even?', explain: R`$n$ odd $\Rightarrow n + 1$ even, so $mn + 1 = (\text{even})^2$. ∎` },
      ] },
    { id: 'o21-9', num: '9', topic: 'quadratics', marks: 6, dr: true,
      prompt: R`Find the equation of the straight line with positive gradient that passes through $(0, 2)$ and is a tangent to the curve $y = x^2 - x + 6$.`,
      steps: [
        { ask: R`The line is $y = mx + 2$. Setting equal to the curve gives...`, type: 'choice', marks: 2, choices: [R`$x^2 - (m+1)x + 4 = 0$`, R`$x^2 + (m-1)x + 4 = 0$`, R`$x^2 - (m+1)x + 8 = 0$`, R`$x^2 - mx + 4 = 0$`], answer: 0, hint: R`$x^2 - x + 6 - mx - 2 = 0$`, explain: R`$x^2 - (m+1)x + 4 = 0$` },
        { ask: R`Tangent ⇒ discriminant $= 0$: $(m+1)^2 - 16 = 0$. Solve for $m$.`, type: 'set', answer: [3, -5], marks: 2, hint: R`$m + 1 = \pm 4$`, explain: R`$m = 3$ or $m = -5$` },
        { ask: R`Equation of the tangent with positive gradient: $y = $ ?`, type: 'expr', answer: '3x+2', marks: 2, hint: 'Reject the negative gradient.', explain: R`$y = 3x + 2$` },
      ] },
    { id: 'o21-10', num: '10', topic: 'prob', marks: 6,
      prompt: 'Jane surveys 400 people from towns A, B and C: 230 adults; 55 adults and 65 children from A; 35 children from B; 150 people from B. Later she numbers 820 hostel students 1–820 and uses random numbers 0.114287562 and 0.081859817. Kareem picks 114, 142, 428, 287, 756; Jane picks 114, 287, 562, 81, 817.',
      steps: [
        { ask: '(a) How many adults are from town B?', answer: 115, hint: '150 people from B, 35 of them children.', explain: '150 − 35 = 115' },
        { ask: '(a) How many people are from town C?', answer: 130, hint: '400 − (55 + 65) − 150', explain: '400 − 120 − 150 = 130' },
        { ask: '(b)(i) P(adult from town A)?', answer: '55/400', hint: '55 out of 400.', explain: R`$\tfrac{55}{400} = \tfrac{11}{80}$` },
        { ask: '(b)(ii) P(adult | from town A)?', answer: '55/120', hint: 'Only the 120 people from A count now.', explain: R`$\tfrac{55}{120} = \tfrac{11}{24}$` },
        { ask: '(c)(i) Which sample is not random?', type: 'choice', choices: ['Kareem\'s — overlapping digits: each number shares digits with the next, so they aren\'t independent.', 'Jane\'s — 81 is too small.', 'Both are random.', 'Jane\'s — she skipped a number.'], answer: 0, hint: 'Look at 114, 142, 428...', explain: 'Kareem\'s: consecutive numbers overlap (the 2nd digits of one are the first of the next).' },
        { ask: '(c)(ii) Why did Jane omit 859?', type: 'choice', choices: ['There are only 820 students; 859 > 820.', '859 is prime.', 'It appeared twice.', 'It was too close to 817.'], answer: 0, hint: 'Students are numbered 1 to 820.', explain: '859 > 820, so there is no student 859.' },
      ] },
    { id: 'o21-11', num: '11', topic: 'data', marks: 6,
      prompt: 'A scatter diagram (South-East LAs) plots x = number of residents aged 8–9 in 2001 against y = number aged 18–19 in 2011. Most points lie close to y = x; a few points lie well above the line; one point (Medway, the largest LA) is furthest right.',
      steps: [
        { ask: '(a) Why compare these two age groups?', type: 'choice', choices: ['People aged 8–9 in 2001 are the same people aged 18–19 in 2011.', 'They are both children.', 'They are the most common ages.', 'The census only records these ages.'], answer: 0, hint: 'Add 10 years.', explain: 'Same cohort, 10 years later.' },
        { ask: '(b)(i) Points near y = x suggest...', type: 'choice', choices: ['Few people of this age group moved in or out — most stayed in the same LA.', 'Everyone moved away.', 'The population doubled.', 'There is no correlation.'], answer: 0, hint: 'Same number in 2011 as in 2001.', explain: 'Most residents stayed: little change in this group.' },
        { ask: '(b)(ii) "Correlation does not imply causation, so there is no causal link." Correct?', type: 'choice', choices: ['No — there IS a link: they are largely the same people (even though correlation alone can\'t prove it).', 'Yes — correlation never means causation.', 'Yes — the points are scattered.', 'No — correlation always means causation.'], answer: 0, hint: 'Is there an obvious reason the numbers match?', explain: 'Not correct: the 18–19s in 2011 are largely the 8–9s of 2001.' },
        { ask: '(c) Which points likely represent LAs with universities, and why?', type: 'choice', marks: 2, choices: ['The highest points above the line: many more 18–19s in 2011 than 8–9s in 2001 — students moved in.', 'Points below the line: young people left.', 'The right-most point.', 'Points on the line.'], answer: 0, hint: 'Students arrive at 18.', explain: 'Points well above y = x: extra 18–19 year-olds (students) moved in.' },
        { ask: '(d) Medway (largest population) is...', type: 'choice', choices: ['The right-most point (largest number of 8–9s).', 'The highest point.', 'The point closest to the origin.', 'Any point on the line.'], answer: 0, hint: 'Same proportion of 8–9s everywhere ⇒ biggest LA has the most.', explain: 'The right-most point.' },
      ] },
    { id: 'o21-12', num: '12', topic: 'prob', marks: 7,
      prompt: R`$X \sim B(50, \tfrac16)$. A student suspects a dice shows 2 less often than it should. They throw it 50 times and test at the 5% level.`,
      steps: [
        { ask: R`(a) $P(X = r)$ are the terms of $(a + b)^n$ with...`, type: 'choice', choices: [R`$a = \tfrac56$, $b = \tfrac16$, $n = 50$`, R`$a = \tfrac16$, $b = \tfrac16$, $n = 50$`, R`$a = 1$, $b = 6$, $n = 50$`, R`$a = \tfrac56$, $b = \tfrac16$, $n = 6$`], answer: 0, hint: R`$\left(\tfrac56 + \tfrac16\right)^{50}$`, explain: R`$a = \tfrac56$, $b = \tfrac16$, $n = 50$` },
        { ask: '(b) Hypotheses:', type: 'choice', marks: 2, choices: [R`$H_0: p = \tfrac16$, $H_1: p < \tfrac16$`, R`$H_0: p = \tfrac16$, $H_1: p \ne \tfrac16$`, R`$H_0: p < \tfrac16$, $H_1: p = \tfrac16$`, R`$H_0: p = \tfrac16$, $H_1: p > \tfrac16$`], answer: 0, hint: 'FEWER 2s.', explain: R`$H_0: p = \tfrac16$, $H_1: p < \tfrac16$ ($p$ = probability of a 2)` },
        { ask: R`(c) $P(X \le 3)$ (3 s.f.)?`, answer: 0.023823, sf: 3, marks: 2, hint: 'Binomial CD, n = 50, p = 1/6.', explain: R`$P(X \le 3) = 0.0238$` },
        { ask: R`$P(X \le 4)$ (3 s.f.)?`, answer: 0.064313, sf: 3, hint: 'Next value up.', explain: R`$P(X \le 4) = 0.0643$` },
        { ask: 'Rejection region:', type: 'choice', choices: [R`$X \le 3$`, R`$X \le 4$`, R`$X \ge 3$`, R`$X < 3$ only`], answer: 0, hint: 'Largest region with probability below 0.05.', explain: R`$0.0238 < 0.05 < 0.0643$, so the rejection region is $X \le 3$.` },
      ] },
    { id: 'o21-13', num: '13', topic: 'prob', marks: 7,
      prompt: R`(a) $P(X=0) = \tfrac1{12}$, $P(X=1) = \tfrac14$, $P(X=2) = p$, $P(X=3) = 3p$. Two values are chosen at random. Find the probability that their product is greater than their sum. (b) $Y$ takes $n$ equally likely values and $P(Y_1 = Y_2) = 0.02$. Find $P(Y_1 > Y_2)$.`,
      steps: [
        { ask: R`Find $p$.`, answer: '1/6', marks: 2, hint: R`$\tfrac1{12} + \tfrac14 + 4p = 1$`, explain: R`$4p = \tfrac23 \Rightarrow p = \tfrac16$` },
        { ask: 'Which pairs have product > sum?', type: 'choice', choices: ['(2,3), (3,2), (3,3)', '(2,2), (2,3), (3,2), (3,3)', '(1,3), (3,1), (3,3)', 'Only (3,3)'], answer: 0, hint: 'Check (2,2): 4 vs 4. Any pair with a 0 or 1 fails.', explain: R`$(2,3)$: $6 > 5$ ✓, $(3,3)$: $9 > 6$ ✓, $(2,2)$: $4 = 4$ ✗` },
        { ask: 'Probability?', answer: '5/12', marks: 2, hint: R`$2 \times \tfrac16 \times \tfrac12 + \left(\tfrac12\right)^2$`, explain: R`$\tfrac16 + \tfrac14 = \tfrac5{12}$` },
        { ask: R`(b) $P(Y_1 > Y_2)$?`, answer: 0.49, marks: 2, hint: R`By symmetry $P(Y_1 > Y_2) = P(Y_1 < Y_2)$.`, explain: R`$\tfrac{1 - 0.02}{2} = 0.49$` },
      ] },
  ];

  // ───────────────────────── June 2022 ─────────────────────────
  const o22 = [
    { id: 'o22-1', num: '1', topic: 'binomial', marks: 2,
      prompt: R`Find the term in $x^3$ in the binomial expansion of $(3 - 2x)^5$.`,
      steps: [
        { ask: R`The term is $\binom53 3^2(-2x)^3$. Its coefficient?`, answer: -720, marks: 2, hint: R`$10 \times 9 \times (-8)$`, explain: R`$10 \times 9 \times (-8)x^3 = -720x^3$` },
      ] },
    { id: 'o22-2', num: '2', topic: 'quadratics', marks: 5, dr: true,
      prompt: R`$f(x) = 5x^3 - 4x^2 + ax - 2$, and $(x - 2)$ is a factor. (a) Find $a$. (b) Find all the factors of $f(x)$.`,
      steps: [
        { ask: R`(a) $f(2) = 0$. Find $a$.`, answer: -11, marks: 2, hint: R`$40 - 16 + 2a - 2 = 0$`, explain: R`$22 + 2a = 0 \Rightarrow a = -11$` },
        { ask: R`(b) $f(x) = (x - 2)(\ldots)$. The quadratic factor:`, type: 'expr', answer: '5x^2+6x+1', marks: 2, hint: R`$(x-2)(5x^2 + bx + 1)$; match the $x^2$ terms.`, explain: R`$5x^2 + 6x + 1$` },
        { ask: 'All roots of f(x) = 0:', type: 'set', answer: [2, '-1/5', -1], hint: R`$5x^2 + 6x + 1 = (5x + 1)(x + 1)$`, explain: R`$f(x) = (x-2)(5x+1)(x+1)$` },
      ] },
    { id: 'o22-3', num: '3', topic: 'graphs', marks: 7,
      prompt: R`The diagram shows $y = x^2 - 4x + 3$. (a) To solve $x^2 - 3x + 1 = 0$ graphically, a line $y = mx + c$ is drawn. Find $m$ and $c$. (b) Estimate the roots. (c) Describe the region where $x \ge 0$, $x \le 4$, $y \le x^2 - 4x + 3$ and $y \ge mx + c$.` + Graph.svg({ w: 280, h: 190, x: [-1, 5], y: [-2, 5], xstep: 1, ystep: 1, fns: [{ f: 'x^2-4x+3', color: '#14141c' }] }),
      steps: [
        { ask: R`$x^2 - 3x + 1 = 0 \iff x^2 - 4x + 3 = mx + c$. Give $m, c$.`, type: 'tuple', answer: [-1, 2], marks: 2, hint: R`Subtract: $x^2 - 4x + 3 - (x^2 - 3x + 1) = -x + 2$.`, explain: R`$x^2 - 4x + 3 = -x + 2$, so $m = -1$, $c = 2$.` },
        { ask: R`(b) Read off the roots (1 d.p.) — the $x$-values where the line meets the curve. (Use the grapher if you like!)`, type: 'set', answer: ['(3-sqrt5)/2', '(3+sqrt5)/2'], tol: 0.1, marks: 2, hint: 'Draw y = −x + 2 on the graph.', explain: R`$x \approx 0.4$ and $x \approx 2.6$` },
        { ask: '(c) The required region is:', type: 'choice', marks: 3, choices: ['Below the curve and above the line, between x = 0 and x = 4 — two separate pieces, left of x ≈ 0.4 and right of x ≈ 2.6.', 'Above the curve and below the line.', 'Between the two roots only.', 'Everything below the curve.'], answer: 0, hint: 'Where is the curve above the line?', explain: R`$mx + c \le y \le x^2 - 4x + 3$ with $0 \le x \le 4$: the parts where the curve is above the line — for $0 \le x \le 0.4$ and $2.6 \le x \le 4$.` },
      ] },
    { id: 'o22-4', num: '4', topic: 'trig', marks: 8, dr: true,
      prompt: R`Solve, for $0° \le x \le 360°$: (a) $2\tan x + 1 = 4$, (b) $5\sin x - 1 = 2\cos^2 x$.`,
      steps: [
        { ask: R`(a) All solutions (3 s.f.):`, type: 'set', answer: [56.3099, 236.3099], sf: 3, marks: 3, hint: R`$\tan x = \tfrac32$; tan repeats every $180°$.`, explain: R`$x = 56.3°, 236°$` },
        { ask: R`(b) Use $\cos^2 x = 1 - \sin^2 x$. The quadratic in $\sin x$ is:`, type: 'choice', choices: [R`$2\sin^2 x + 5\sin x - 3 = 0$`, R`$2\sin^2 x - 5\sin x + 3 = 0$`, R`$5\sin x - 1 = 2 - 2\sin x$`, R`$2\sin^2 x + 5\sin x + 1 = 0$`], answer: 0, marks: 2, hint: R`$5\sin x - 1 = 2 - 2\sin^2 x$`, explain: R`$2\sin^2 x + 5\sin x - 3 = 0$` },
        { ask: R`Factorise and give the possible values of $\sin x$.`, type: 'set', answer: [0.5, -3], hint: R`$(2\sin x - 1)(\sin x + 3)$`, explain: R`$\sin x = \tfrac12$ or $\sin x = -3$` },
        { ask: 'Solutions:', type: 'set', answer: [30, 150], marks: 2, hint: R`$\sin x = -3$ is impossible.`, explain: R`$\sin x = -3$ has no solutions; $\sin x = \tfrac12$: $x = 30°, 150°$` },
      ] },
    { id: 'o22-5', num: '5', topic: 'integ', marks: 8,
      prompt: R`The gradient of a curve is $\dfrac{dy}{dx} = x^2 - 3x$, and the curve passes through $(6, 20)$. (a) Find the equation of the curve. (b) Hence find $\displaystyle\int_1^p y\,dx$ in terms of $p$.`,
      steps: [
        { ask: R`(a) Integrate $x^2 - 3x$.`, type: 'integral', answer: 'x^3/3-3x^2/2', marks: 2, hint: '+c!', explain: R`$y = \tfrac{x^3}{3} - \tfrac{3x^2}{2} + c$` },
        { ask: R`Use $(6, 20)$ to find $c$.`, answer: 2, hint: R`$72 - 54 + c = 20$`, explain: R`$c = 2$` },
        { ask: R`$y = $ ?`, type: 'expr', answer: 'x^3/3-3x^2/2+2', hint: 'Put c back.', explain: R`$y = \tfrac{x^3}{3} - \tfrac{3x^2}{2} + 2$` },
        { ask: R`(b) $\displaystyle\int_1^p y\,dx$ in terms of $p$:`, type: 'expr', vars: ['p'], answer: 'p^4/12-p^3/2+2p-19/12', marks: 4, hint: R`Antiderivative $\tfrac{x^4}{12} - \tfrac{x^3}{2} + 2x$; subtract its value at 1, which is $\tfrac{19}{12}$.`, explain: R`$\tfrac{p^4}{12} - \tfrac{p^3}{2} + 2p - \tfrac{19}{12}$` },
      ] },
    { id: 'o22-6', num: '6', topic: 'explog', marks: 11,
      prompt: R`An insect population is modelled by $P = 100e^t$ ($t$ months). A second model is $P = ka^t$. Data: $t$ = 1, 2, 3, 4, 5; $\log_{10}P$ = 2.00, 2.70, 3.26, 3.85, 4.28.` + Graph.svg({ w: 280, h: 180, x: [0, 6], y: [0, 5], xstep: 1, ystep: 1, points: [{ x: 1, y: 2 }, { x: 2, y: 2.7 }, { x: 3, y: 3.26 }, { x: 4, y: 3.85 }, { x: 5, y: 4.28 }], fns: [{ f: '1.5+0.57x', color: '#c0403a', dash: true, label: 'a line of best fit' }], labels: { x: 't', y: 'log P' } }),
      steps: [
        { ask: R`(a)(i) $P$ when $t = 4$ (3 s.f.)?`, answer: '100e^4', sf: 3, hint: R`$100e^4$`, explain: R`$5460$` },
        { ask: R`(a)(ii) $t$ when $P = 9000$ (3 s.f.)?`, answer: 'ln90', sf: 3, marks: 2, hint: R`$e^t = 90$`, explain: R`$t = \ln 90 = 4.50$` },
        { ask: R`(b)(i) Taking $\log_{10}$ of $P = ka^t$ gives...`, type: 'choice', marks: 2, choices: [R`$\log P = \log k + t\log a$ — a straight line with gradient $\log a$ and intercept $\log k$`, R`$\log P = t\log k + \log a$`, R`$\log P = \log k \times t\log a$`, R`$\log P = k + at$`], answer: 0, hint: 'Log laws.', explain: R`$\log_{10}P = \log_{10}k + t\log_{10}a$: linear in $t$.` },
        { ask: R`(b)(ii) A good line of best fit has intercept about 1.5. Estimate $k$.`, answer: '10^1.5', range: [19.9, 63.1], marks: 2, hint: R`$\log_{10}k = $ intercept, so $k = 10^{\text{intercept}}$.`, explain: R`$k \approx 10^{1.5} \approx 32$ (mark scheme accepts 19.9 to 63.1)` },
        { ask: R`(b)(iii) The gradient is about 0.57. Estimate $a$.`, answer: '10^0.57', range: [3.16, 5.01], marks: 4, hint: R`$a = 10^{\text{gradient}}$`, explain: R`$a \approx 10^{0.57} \approx 3.7$ (accepts 3.16 to 5.01)` },
      ] },
    { id: 'o22-7', num: '7', topic: 'coord', marks: 8, dr: true,
      prompt: R`(a) Find the range of values of $m$ for which $y = mx$ and $x^2 + y^2 - 6x - 2y + 5 = 0$ have real solutions. (b) Interpret the case $m = 2$ geometrically.`,
      steps: [
        { ask: 'Substitute y = mx. Which quadratic?', type: 'choice', choices: [R`$(1+m^2)x^2 - (6+2m)x + 5 = 0$`, R`$(1+m)x^2 - 6x + 5 = 0$`, R`$(1+m^2)x^2 + (6+2m)x + 5 = 0$`, R`$x^2 + m^2 - 6x - 2m + 5 = 0$`], answer: 0, hint: R`$x^2 + m^2x^2 - 6x - 2mx + 5 = 0$`, explain: R`$(1+m^2)x^2 - (6+2m)x + 5 = 0$` },
        { ask: R`Discriminant, in terms of $m$:`, type: 'expr', vars: ['m'], answer: '(6+2m)^2-20(1+m^2)', marks: 2, hint: R`$b^2 - 4ac$ with $a = 1 + m^2$, $b = -(6+2m)$, $c = 5$.`, explain: R`$(6+2m)^2 - 20(1+m^2) = -16m^2 + 24m + 16$` },
        { ask: R`Critical values: solve $-16m^2 + 24m + 16 = 0$.`, type: 'set', answer: [2, -0.5], hint: R`$2m^2 - 3m - 2 = 0 = (2m+1)(m-2)$`, explain: R`$m = 2$ or $m = -\tfrac12$` },
        { ask: 'Real solutions when...', type: 'choice', choices: [R`$-\tfrac12 \le m \le 2$`, R`$m \le -\tfrac12$ or $m \ge 2$`, R`$-\tfrac12 < m < 2$ only`, R`$m \ge 2$`], answer: 0, hint: R`Discriminant $\ge 0$, and it's a ∩-shaped quadratic in $m$.`, explain: R`$-\tfrac12 \le m \le 2$` },
        { ask: R`(b) When $m = 2$, the equation is $5x^2 - 10x + 5 = 0$. What does this mean?`, type: 'choice', marks: 3, choices: [R`A repeated root $x = 1$: the line $y = 2x$ is a tangent to the circle at $(1, 2)$.`, 'The line misses the circle.', 'The line passes through the centre.', 'The line cuts the circle twice.'], answer: 0, hint: R`$5(x-1)^2 = 0$`, explain: R`Repeated root $x = 1$ ⇒ $y = 2x$ touches the circle (centre $(3,1)$, radius $\sqrt5$) at $(1, 2)$.` },
      ] },
    { id: 'o22-8', num: '8', topic: 'data', marks: 4,
      prompt: 'Ten students: hours studying x vs money earned £y. Points: (18,23), (20,21), (23,20), (25,19), (25,21), (27,18), (32,16), (38,17), (40,16), (41,23).',
      steps: [
        { ask: '(a) Comment on the relationship.', type: 'choice', marks: 2, choices: ['Negative correlation — more studying, less earning (time spent working cuts study time) — with one outlier at (41, 23).', 'Positive correlation.', 'No correlation at all.', 'Perfect linear relationship.'], answer: 0, hint: 'As x rises, y...? And is there an odd point?', explain: 'Negative correlation in context, plus an outlier (41, 23).' },
        { ask: '(b) Mean hours?', answer: 28.9, hint: 'Sum of x ÷ 10.', explain: R`$\bar x = 28.9$` },
        { ask: 'Standard deviation (3 s.f.)?', answer: 7.93032, sf: 3, hint: R`$\sqrt{\tfrac{\sum x^2}{n} - \bar x^2}$`, explain: R`$\sigma = 7.93$` },
      ] },
    { id: 'o22-9', num: '9', topic: 'prob', marks: 10,
      prompt: 'Last year 8% of adults in a town used a local coffee shop. After an advertising campaign, a random sample of 150 adults is taken; 18 say they use it. Later it turns out the sample was taken from shoppers on a Friday and a Saturday.',
      steps: [
        { ask: '(a)(i) Model for X if nothing changed:', type: 'choice', choices: ['B(150, 0.08)', 'B(150, 0.18)', 'B(18, 0.08)', 'B(0.08, 150)'], answer: 0, hint: 'n trials, p success.', explain: R`$X \sim B(150, 0.08)$` },
        { ask: R`(a)(ii) The expansion $(a + b)^n$:`, type: 'choice', choices: [R`$(0.92 + 0.08)^{150}$`, R`$(0.08 + 0.08)^{150}$`, R`$(1 + 0.08)^{150}$`, R`$(0.92 + 0.08)^{18}$`], answer: 0, hint: R`$a = 1 - p$`, explain: R`$(0.92 + 0.08)^{150}$` },
        { ask: '(b) Hypotheses:', type: 'choice', marks: 2, choices: [R`$H_0: p = 0.08$, $H_1: p > 0.08$`, R`$H_0: p = 0.08$, $H_1: p \ne 0.08$`, R`$H_0: p = 0.12$, $H_1: p > 0.12$`, R`$H_0: p > 0.08$`], answer: 0, hint: 'Has it INCREASED?', explain: R`$H_0: p = 0.08$, $H_1: p > 0.08$` },
        { ask: R`$P(X \ge 18)$ (3 s.f.)?`, answer: 0.0551140, sf: 3, marks: 2, hint: R`$1 - P(X \le 17)$`, explain: R`$P(X \ge 18) = 0.0551$` },
        { ask: 'Conclusion:', type: 'choice', marks: 3, choices: ['0.0551 > 0.05: do not reject H₀. Insufficient evidence that the proportion has increased.', '0.0551 > 0.05: reject H₀.', 'The proportion has not changed.', 'Reject H₀: 18/150 = 12% > 8%.'], answer: 0, hint: 'Compare with 5%.', explain: R`$0.0551 > 0.05$: do not reject $H_0$ — insufficient evidence of an increase.` },
        { ask: '(c) Why might the binomial assumptions fail?', type: 'choice', choices: ['Weekend shoppers aren\'t representative (e.g. weekday commuters buy coffee) — p may not be constant / sample not random.', 'The sample is too large.', '18 is too small.', 'Fridays don\'t exist.'], answer: 0, hint: 'Who shops in town on Friday and Saturday?', explain: 'Not a random sample of all adults; probability may differ between groups.' },
      ] },
    { id: 'o22-10', num: '10', topic: 'data', marks: 6,
      prompt: 'Increases 2001→2011 in % of employees by travel method, North East LAs (codes 06 = unitary authority, 08 = metropolitan borough). Metro/tram rises: South Tyneside +2.03, Sunderland +1.48, North Tyneside +0.54 (all 08). Driving rises in almost every LA (up to +4.89); passenger and bus fall everywhere. Data refer to residents aged 20–65 at each census; migration and deaths negligible.',
      steps: [
        { ask: '(a) Largest increases in metro/tram are in which type of LA?', type: 'choice', choices: ['Metropolitan boroughs (code 08)', 'Unitary authorities (06)', 'Non-metropolitan districts (07)', 'All types equally'], answer: 0, hint: 'Look at the codes of the big metro increases.', explain: 'Metropolitan boroughs.' },
        { ask: '(b) Two main changes:', type: 'choice', marks: 2, choices: ['More people drive themselves; fewer travel as passengers or by bus.', 'More people walk and cycle.', 'Everyone works from home.', 'Metro use fell everywhere.'], answer: 0, hint: 'Which columns are consistently positive / negative?', explain: 'Increase in driving; decrease in passengers and in bus use.' },
        { ask: '(c) Percentage of 20–65s in 2011 whose data also appears in 2001 (3 s.f.)?', answer: '35/45*100', sf: 3, marks: 2, hint: 'In 2011, the 20–29s were under 20 in 2001. Of the 45-year age range, how many years overlap?', explain: R`Those aged 30–65 in 2011 were 20–55 in 2001: $\tfrac{35}{45} = 77.8\%$` },
        { ask: '(d) A reason for the changes:', type: 'choice', choices: ['Older people who used buses or walked have left the 20–65 range, replaced by younger people more likely to drive.', 'The weather changed.', 'Buses were banned.', 'The census was wrong.'], answer: 0, hint: 'Who left the age range, who joined?', explain: 'Over-55s in 2001 (more likely to use public transport) were replaced by young drivers.' },
      ] },
    { id: 'o22-11', num: '11', topic: 'prob', marks: 6,
      prompt: R`Goals per match: $P(0) = \tfrac3{25}$, $P(1) = \tfrac15$, $P(2) = \tfrac8{25}$, $P(3) = \tfrac7{25}$, $P(4) = \tfrac2{25}$, independent between matches.`,
      steps: [
        { ask: '(a)(i) P(exactly 1 goal in total over 3 matches)?', answer: '3*(3/25)^2*(1/5)', marks: 2, hint: 'One match with 1 goal, two with 0 — in any of 3 orders.', explain: R`$3 \times \left(\tfrac3{25}\right)^2 \times \tfrac15 = \tfrac{27}{3125} = 0.00864$` },
        { ask: '(a)(ii) P(first two equal, third different)?', answer: '2760/15625', marks: 3, hint: R`$\sum P(k)^2 (1 - P(k))$ over $k = 0, \ldots, 4$.`, explain: R`$\sum p_k^2(1 - p_k) = 0.177$ (3 s.f.)` },
        { ask: '(b) The team scores 31 goals in 10 matches. Does this cast doubt on the model?', type: 'choice', choices: ['Yes — the model\'s mean is 2 goals a match (20 in 10), so 31 is much higher than expected.', 'No — 31 is about average.', 'No — goals are random.', 'Yes — they can\'t score more than 4.'], answer: 0, hint: 'Find the expected goals per match.', explain: R`Mean $= \tfrac{0 + 5 + 16 + 21 + 8}{25} = 2$, so about 20 expected — 31 suggests the model may be wrong.` },
      ] },
  ];

  // ───────────────────────── June 2023 ─────────────────────────
  const o23 = [
    { id: 'o23-1a', num: '1(a)', topic: 'trig', marks: 3,
      prompt: R`Prove that $\cos x + \sin x\tan x \equiv \dfrac{1}{\cos x}$.`,
      steps: [
        { ask: R`Replace $\tan x$ and combine over $\cos x$. The numerator is...`, type: 'choice', marks: 2, choices: [R`$\cos^2 x + \sin^2 x$`, R`$\cos x + \sin^2 x$`, R`$\cos^2 x - \sin^2 x$`, R`$1 + \sin x$`], answer: 0, hint: R`$\cos x + \dfrac{\sin^2 x}{\cos x} = \dfrac{\cos^2 x + \sin^2 x}{\cos x}$`, explain: R`$\dfrac{\cos^2 x + \sin^2 x}{\cos x}$` },
        { ask: 'Finish:', type: 'choice', choices: [R`$\cos^2 x + \sin^2 x = 1$, so it equals $\dfrac1{\cos x}$. ∎`, R`Put $x = 0$.`, R`$\cos^2 x = \sin^2 x$`, R`Cancel the $\cos x$.`], answer: 0, hint: 'Pythagorean identity.', explain: R`$= \dfrac{1}{\cos x}$ ∎` },
      ] },
    { id: 'o23-1b', num: '1(b)', topic: 'trig', marks: 2,
      prompt: R`Solve $2\sin^2 x = \cos^2 x$ for $0° \le x \le 180°$.`,
      steps: [
        { ask: R`$\tan^2 x = $ ?`, answer: 0.5, hint: R`Divide by $2\cos^2 x$.`, explain: R`$\tan^2 x = \tfrac12$` },
        { ask: R`All solutions (3 s.f.):`, type: 'set', answer: [35.2644, 144.7356], sf: 3, hint: R`$\tan x = \pm\tfrac1{\sqrt2}$`, explain: R`$x = 35.3°, 145°$` },
      ] },
    { id: 'o23-2a', num: '2(a)', topic: 'vectors', marks: 3,
      prompt: R`$A$, $B$, $C$ have position vectors $\begin{pmatrix}-4\\3\end{pmatrix}$, $\begin{pmatrix}-3\\6\end{pmatrix}$, $\begin{pmatrix}-1\\12\end{pmatrix}$. (i) Show $B$ lies on $AC$. (ii) Find the ratio $AB : BC$.`,
      steps: [
        { ask: R`$\overrightarrow{AB} = $ ?`, type: 'vector', answer: [1, 3], hint: 'b − a', explain: R`$\begin{pmatrix}1\\3\end{pmatrix}$` },
        { ask: R`$\overrightarrow{BC} = k\overrightarrow{AB}$. Find $k$.`, answer: 2, hint: R`$\overrightarrow{BC} = \begin{pmatrix}2\\6\end{pmatrix}$`, explain: R`$\overrightarrow{BC} = 2\overrightarrow{AB}$: parallel with a common point $B$, so $B$ lies on $AC$.` },
        { ask: R`$AB : BC = 1 : n$. Find $n$.`, answer: 2, hint: 'From k.', explain: R`$AB : BC = 1 : 2$` },
      ] },
    { id: 'o23-2bc', num: '2(b)(c)', topic: 'vectors', marks: 5,
      prompt: R`$P(2, 4)$ lies on $x + y = 6$. $Q$ is the other point on this line with $OQ = OP$. (b) Find the magnitude and direction of $\overrightarrow{PQ}$. (c) $R$ is such that $PR \perp OP$ and $PR = \tfrac12 OP$. Give both possible position vectors of $R$.`,
      steps: [
        { ask: R`Coordinates of $Q$:`, type: 'point', answer: [4, 2], hint: 'Reflect P in y = x.', explain: R`$Q(4, 2)$` },
        { ask: R`$|\overrightarrow{PQ}|$ exactly:`, answer: '2sqrt2', exact: true, hint: R`$\overrightarrow{PQ} = \begin{pmatrix}2\\-2\end{pmatrix}$`, explain: R`$2\sqrt2$` },
        { ask: R`Direction of $\overrightarrow{PQ}$ (angle from the positive $x$-direction):`, type: 'choice', choices: [R`$-45°$ (i.e. $315°$): down and to the right`, R`$45°$`, R`$135°$`, R`$225°$`], answer: 0, hint: R`$\overrightarrow{PQ} = \begin{pmatrix}2\\-2\end{pmatrix}$: right 2, down 2.`, explain: R`$-45°$ (i.e. $315°$)` },
        { ask: R`(c) One possible $R$ — give the one with the larger $x$-coordinate.`, type: 'point', answer: [4, 3], hint: R`$\overrightarrow{OP} = \begin{pmatrix}2\\4\end{pmatrix}$; a perpendicular half-length vector is $\pm\begin{pmatrix}2\\-1\end{pmatrix}$.`, explain: R`$R = (4, 3)$` },
        { ask: 'The other R:', type: 'point', answer: [0, 5], hint: R`$P - \begin{pmatrix}2\\-1\end{pmatrix}$`, explain: R`$R = (0, 5)$` },
      ] },
    { id: 'o23-3', num: '3', topic: 'diff', marks: 4,
      prompt: R`The diagram shows $y = f(x)$, a quadratic (U-shaped, minimum to the right of the $y$-axis).` + Graph.svg({ w: 260, h: 170, x: [-1, 5], y: [-2, 5], ticks: false, fns: [{ f: '(x-2)^2-1', color: '#14141c' }] }),
      steps: [
        { ask: R`(a) A possible graph of $y = f'(x)$:`, type: 'choice', marks: 3, choices: [sk('2x-4', [-1, 5], [-5, 5]), sk('-2x+4', [-1, 5], [-5, 5]), sk('(x-2)^2', [-1, 5], [-2, 5]), sk('2x+4', [-3, 3], [-2, 8])], answer: 0, hint: R`Gradient negative before the minimum, zero at it, positive after — and a quadratic's derivative is linear.`, explain: R`A straight line with positive gradient, crossing the $x$-axis at the minimum's $x$-value (negative $y$-intercept).` },
        { ask: R`(b) The gradient of the graph of $y = f''(x)$ is...`, answer: 0, hint: R`$f''$ is a constant.`, explain: R`$f''(x)$ is constant, so its graph is horizontal: gradient $0$.` },
      ] },
    { id: 'o23-4', num: '4', topic: 'explog', marks: 4,
      prompt: R`A curve has equation $y = e^{3x}$. (a) Find $x$ when $y = 10$. (b) Find the gradient at $x = 2$.`,
      steps: [
        { ask: R`(a) $x$ (3 s.f.)?`, answer: 'ln10/3', sf: 3, marks: 2, hint: R`$3x = \ln 10$`, explain: R`$x = \tfrac13\ln10 = 0.768$` },
        { ask: R`(b) Gradient at $x = 2$, exactly:`, answer: '3e^6', exact: true, marks: 2, hint: R`$\dfrac{dy}{dx} = 3e^{3x}$`, explain: R`$3e^6 \approx 1210$` },
      ] },
    { id: 'o23-5', num: '5', topic: 'integ', marks: 6, dr: true,
      prompt: R`Find the total area enclosed by $y = x^3 - 4x$ and the $x$-axis.` + Graph.svg({ w: 260, h: 170, x: [-3, 3], y: [-4, 4], fns: [{ f: 'x^3-4x' }], shade: { f: 'x^3-4x', a: -2, b: 2 } }),
      steps: [
        { ask: 'Where does the curve meet the x-axis?', type: 'set', answer: [0, 2, -2], marks: 2, hint: R`$x(x^2 - 4) = 0$`, explain: R`$x = -2, 0, 2$` },
        { ask: R`$\displaystyle\int_0^2 (x^3 - 4x)\,dx = $ ?`, answer: -4, marks: 2, hint: R`$\left[\tfrac{x^4}{4} - 2x^2\right]_0^2$`, explain: R`$4 - 8 = -4$ (below the axis)` },
        { ask: 'Total area?', answer: 8, marks: 2, hint: 'The other half is the same size by symmetry. Areas are positive.', explain: R`$4 + 4 = 8$ — note $\int_{-2}^{2} = 0$, which is NOT the area!` },
      ] },
    { id: 'o23-6', num: '6', topic: 'diff', marks: 11,
      prompt: R`(a) Find the two real roots of $8x^6 + 7x^3 - 1 = 0$. (b) Find the stationary points of $y = 8x^7 + \tfrac{49}{4}x^4 - 7x$. (c) Classify them.`,
      steps: [
        { ask: R`(a) Treat as a quadratic in $x^3$. Roots $x$:`, type: 'set', answer: [-1, 0.5], marks: 3, hint: R`$(8x^3 - 1)(x^3 + 1) = 0$`, explain: R`$x^3 = \tfrac18$ or $-1$, so $x = \tfrac12$ or $-1$` },
        { ask: R`(b) $\dfrac{dy}{dx} = $ ?`, type: 'expr', answer: '56x^6+49x^3-7', hint: 'Differentiate each term.', explain: R`$56x^6 + 49x^3 - 7 = 7(8x^6 + 7x^3 - 1)$ — so part (a) gives the stationary points!` },
        { ask: R`Stationary point at $x = -1$:`, type: 'point', answer: [-1, 11.25], hint: R`$-8 + \tfrac{49}{4} + 7$`, explain: R`$(-1, 11.25)$` },
        { ask: R`Stationary point at $x = \tfrac12$ (exact or 3 s.f.):`, type: 'point', answer: [0.5, '-171/64'], sf: 3, marks: 2, hint: R`$\tfrac{8}{128} + \tfrac{49}{64} - \tfrac72$`, explain: R`$\left(\tfrac12, -\tfrac{171}{64}\right)$` },
        { ask: R`(c) $\dfrac{d^2y}{dx^2} = $ ?`, type: 'expr', answer: '336x^5+147x^2', marks: 2, hint: 'Differentiate again.', explain: R`$336x^5 + 147x^2$` },
        { ask: 'Classify:', type: 'choice', marks: 2, choices: [R`$x = \tfrac12$: $47.25 > 0$, minimum. $x = -1$: $-189 < 0$, maximum.`, R`Both minima.`, R`$x = \tfrac12$ maximum, $x = -1$ minimum.`, R`Both maxima.`], answer: 0, hint: 'Substitute each x.', explain: R`$x = \tfrac12$: minimum; $x = -1$: maximum.` },
      ] },
    { id: 'o23-7', num: '7', topic: 'proof', marks: 5,
      prompt: R`(a)(i) Write expressions for the mean of the squares of $a$ and $b$, and the square of their mean. (ii) Prove the mean of the squares is at least the square of the mean. (b) What does this show about variance?`,
      steps: [
        { ask: 'Mean of squares minus square of mean, simplified (in a and b):', type: 'expr', vars: ['a', 'b'], answer: '(a-b)^2/4', marks: 3, hint: R`$\dfrac{a^2+b^2}{2} - \dfrac{(a+b)^2}{4} = \dfrac{2a^2 + 2b^2 - a^2 - 2ab - b^2}{4}$`, explain: R`$\dfrac{(a-b)^2}{4}$` },
        { ask: 'So:', type: 'choice', choices: [R`$\dfrac{(a-b)^2}{4} \ge 0$, so the mean of the squares $\ge$ the square of the mean. ∎`, R`It's true for $a = b$.`, R`$(a-b)^2$ can be negative.`, 'Check with numbers.'], answer: 0, hint: 'A square is never negative.', explain: R`$\dfrac{(a-b)^2}{4} \ge 0$ ∎` },
        { ask: '(b) This shows that...', type: 'choice', choices: [R`Variance $= \dfrac{\sum x^2}{n} - \bar x^2 \ge 0$ — variance is never negative.`, 'Variance is always 1.', 'The mean is always positive.', 'Standard deviation is always bigger than the mean.'], answer: 0, hint: 'Variance formula.', explain: 'Variance = mean of squares − square of mean ≥ 0.' },
      ] },
    { id: 'o23-8', num: '8', topic: 'coord', marks: 7, dr: true,
      prompt: R`A circle has equation $x^2 + y^2 - 6x - 4y + 12 = 0$. Two tangents to it pass through $(0, 1)$. Find the angle between them.`,
      steps: [
        { ask: 'Centre:', type: 'point', answer: [3, 2], hint: 'Complete the square.', explain: R`$(x-3)^2 + (y-2)^2 = 1$: centre $(3, 2)$` },
        { ask: 'Radius:', answer: 1, hint: R`$9 + 4 - 12$`, explain: R`$r = 1$` },
        { ask: R`Tangent $y = mx + 1$. Substituting gives which quadratic?`, type: 'choice', choices: [R`$(1+m^2)x^2 - (6+2m)x + 9 = 0$`, R`$(1+m^2)x^2 - 6x + 12 = 0$`, R`$(1+m)x^2 - (6+2m)x + 9 = 0$`, R`$x^2 + m^2x - 6x + 9 = 0$`], answer: 0, hint: R`$x^2 + (mx+1)^2 - 6x - 4(mx+1) + 12 = 0$`, explain: R`$(1+m^2)x^2 - (6+2m)x + 9 = 0$` },
        { ask: R`Discriminant $= 0$: $(6+2m)^2 - 36(1+m^2) = 0$. Solve for $m$.`, type: 'set', answer: [0, 0.75], marks: 2, hint: R`$24m - 32m^2 = 0$`, explain: R`$m = 0$ or $m = \tfrac34$` },
        { ask: 'Angle between the tangents (degrees, 3 s.f.):', answer: 'arctan(0.75)*180/pi', sf: 3, marks: 2, hint: R`One tangent is horizontal; the other has $\tan\theta = \tfrac34$.`, explain: R`$\tan^{-1}\tfrac34 = 36.9°$` },
      ] },
    { id: 'o23-9', num: '9', topic: 'prob', marks: 4,
      prompt: 'Venn diagram of 50 people: English only 25, both 5, Mathematics only 15, neither 5.',
      steps: [
        { ask: '(a) P(passed Mathematics)?', answer: '20/50', hint: '15 + 5', explain: R`$\tfrac{20}{50} = 0.4$` },
        { ask: '(b) How many passed at least one subject?', answer: 45, hint: '25 + 5 + 15', explain: '45' },
        { ask: 'Two chosen from those 45 without replacement: P(both passed Maths)? (3 s.f.)', answer: '20/45*19/44', sf: 3, marks: 2, hint: R`$\tfrac{20}{45} \times \tfrac{19}{44}$`, explain: R`$\tfrac{380}{1980} = \tfrac{19}{99} = 0.192$` },
      ] },
    { id: 'o23-10', num: '10', topic: 'data', marks: 9,
      prompt: 'Masses of 120 boulders (kg). Classes 40–45, 45–50, 50–55, 55–57.5, 57.5–60, 60–65, 65–70.' + histo([[40, 45, 0.8], [45, 50, 2], [50, 55, 4], [55, 57.5, 8.8], [57.5, 60, 8], [60, 65, 6], [65, 70, 2.8]], { x: [35, 75], ymax: 9.5, grid: 0.5, ticks: [35, 40, 45, 50, 55, 60, 65, 70, 75] }),
      steps: [
        { ask: '(a) Number of boulders between 60 and 65 kg?', answer: 30, marks: 2, hint: 'Total area ↔ 120 boulders. The 60–65 block is 6 × 5 = 30 units² out of 120 units² total.', explain: 'Frequencies: 4, 10, 20, 22, 20, 30, 14 → 30' },
        { ask: '(b)(i) Estimate the mean (3 s.f.).', answer: 57.7292, sf: 3, marks: 2, hint: 'Midpoints 42.5, 47.5, 52.5, 56.25, 58.75, 62.5, 67.5 with frequencies 4, 10, 20, 22, 20, 30, 14.', explain: R`$\bar x = 57.7$` },
        { ask: 'Estimate the standard deviation (3 s.f.).', answer: 6.19766, sf: 3, hint: R`$\sqrt{\tfrac{\sum fx^2}{n} - \bar x^2}$`, explain: R`$\sigma = 6.20$` },
        { ask: '(ii) Why only estimates?', type: 'choice', choices: ['The exact masses within each class are unknown (midpoints assumed).', 'The sample is too small.', 'The histogram is drawn by hand.', 'Boulders change mass.'], answer: 0, hint: 'Grouped data.', explain: 'Raw data unknown — we assume every value is at its class midpoint.' },
        { ask: R`(c) Outliers below $\bar x - 2\sigma$: find $\bar x - 2\sigma$ (3 s.f.).`, answer: 45.3338, sf: 3, hint: R`$57.7 - 2 \times 6.20$`, explain: R`$45.3$ (and $\bar x + 2\sigma = 70.1$, beyond all data)` },
        { ask: 'Estimated number of outliers?', answer: 4, hint: 'How many boulders lie below 45.3 kg? (The 40–45 class.)', explain: 'About 4 (the 40–45 class).' },
        { ask: '(d) An advantage of a histogram over a pie chart here:', type: 'choice', choices: ['You can read actual frequencies (and estimate mean/sd); a pie chart only shows proportions.', 'Pie charts can\'t show 7 classes.', 'Histograms are more colourful.', 'Histograms show the median exactly.'], answer: 0, hint: 'What can you calculate from a histogram?', explain: 'Histogram shows frequencies of a continuous variable — you can estimate statistics.' },
      ] },
    { id: 'o23-11', num: '11', topic: 'prob', marks: 8,
      prompt: R`Casey believes 75% of students' favourite band is Blue Rocking; Riley thinks it's more. $H_0: p = 0.75$, $H_1: p > 0.75$, 5% level, sample of 60, $X = 50$.`,
      steps: [
        { ask: R`(a) Riley says $P(X = 50) = 0.0407 < 0.05$ so reject $H_0$. Why is that wrong?`, type: 'choice', choices: [R`You need $P(X \ge 50)$, not $P(X = 50)$.`, 'The level should be 10%.', 'You need P(X ≤ 50).', 'The value 0.0407 is wrong.'], answer: 0, hint: 'Probability of a result at least this extreme.', explain: R`Must use $P(X \ge 50)$.` },
        { ask: R`(b) $P(X \ge 50)$ (3 s.f.)?`, answer: 0.0858868, sf: 3, marks: 2, hint: R`$X \sim B(60, 0.75)$, $1 - P(X \le 49)$`, explain: R`$P(X \ge 50) = 0.0859$` },
        { ask: 'Conclusion:', type: 'choice', marks: 3, choices: ['0.0859 > 0.05: do not reject H₀ — insufficient evidence that more than 75% prefer Blue Rocking.', 'Reject H₀.', 'Exactly 75% prefer Blue Rocking.', 'Accept H₁.'], answer: 0, hint: 'Compare with 0.05.', explain: R`$0.0859 > 0.05$: do not reject $H_0$.` },
        { ask: '(c)(i) The model:', type: 'choice', choices: ['B(60, 0.75)', 'B(50, 0.75)', 'B(60, 0.0407)', 'B(75, 0.6)'], answer: 0, hint: 'n and p under H₀.', explain: 'B(60, 0.75)' },
        { ask: '(c)(ii) Sampling without replacement — does it invalidate the model?', type: 'choice', choices: ['Strictly, trials aren\'t independent (p changes slightly as students are removed) — but in a large school the effect is tiny, so the model is still reasonable.', 'Yes — completely invalid.', 'No — sampling never matters.', 'Yes — 60 is too many.'], answer: 0, hint: 'How big is the school?', explain: 'Without replacement, p changes slightly each pick; with a large population the binomial is still a good approximation. (Mark scheme accepts "not independent".)' },
      ] },
    { id: 'o23-12', num: '12', topic: 'data', marks: 4,
      prompt: 'Northern LAs, 2011 census. Fig 1: proportion aged 25–44 against proportion aged 0–4 (strong correlation). Fig 2: proportion aged 60+ against proportion aged 0–4 (strong correlation, opposite kind). Point A (Fig 3) has a very low proportion aged 60+; in Fig 4 (numbers rather than proportions), the same LA (B) has a similar number of over-60s to many others but by far the most 0–4s.',
      steps: [
        { ask: '(a) Kinds of correlation:', type: 'choice', choices: ['Fig 1 positive, Fig 2 negative', 'Fig 1 negative, Fig 2 positive', 'Both positive', 'Both negative'], answer: 0, hint: 'More young adults ↔ more babies; more over-60s ↔ ?', explain: 'Fig 1 positive, Fig 2 negative.' },
        { ask: '(b) Reasons:', type: 'choice', marks: 2, choices: ['25–44s are the age group who have young children; areas with many over-60s have fewer young families.', 'Children grow up.', 'Old people dislike children.', 'It is a coincidence.'], answer: 0, hint: 'Who are the parents of 0–4 year-olds?', explain: 'Parents are mostly 25–44; high proportions of over-60s mean fewer young families.' },
        { ask: '(c) How can you tell LA A/B has a large population?', type: 'choice', choices: ['It has a similar NUMBER of over-60s to many LAs, but the lowest PROPORTION — so its total population must be large.', 'Its point is on the right.', 'It has the most children.', 'It is a city.'], answer: 0, hint: 'Number ÷ proportion = total population.', explain: 'Similar number of over-60s but a much smaller proportion ⇒ large total population.' },
      ] },
  ];

  const add = (id, title, minutes, qs) => {
    const p = { id, title, board: 'OCR AS Level Mathematics A', paper: 'Pure Mathematics and Statistics', minutes, questions: qs };
    window.PAPERS.push(p);
    qs.forEach(q => { q.source = title + ' Q' + q.num; q.steps.forEach(s => { s.type = s.type || 'num'; }); window.PAPER_Q[q.id] = q; });
  };
  add('o20', 'OCR H230/01 — November 2020', 90, o20);
  add('o21', 'OCR H230/01 — October 2021', 90, o21);
  add('o22', 'OCR H230/01 — June 2022', 90, o22);
  add('o23', 'OCR H230/01 — June 2023', 90, o23);
})();
