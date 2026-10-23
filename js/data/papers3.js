// OCR AS Level Mathematics A — H230/02 Pure Mathematics and Mechanics, June 2018 to June 2023.
// Steps follow each mark scheme (2018/2019 answers worked and checked independently).
(function () {
  const R = String.raw;
  const sk = (f, x, y, extra) => Graph.sketch(f, x, y, extra);
  const pulley = (left, right, note) => '<svg class="graph" viewBox="0 0 220 150" width="220" height="150"><rect width="220" height="150" fill="#fffdf6"/><line x1="70" y1="10" x2="150" y2="10" stroke="#3a3550" stroke-width="4"/><circle cx="110" cy="26" r="12" fill="none" stroke="#3a3550" stroke-width="2"/><line x1="110" y1="10" x2="110" y2="14" stroke="#3a3550"/><line x1="98" y1="26" x2="98" y2="' + left.y + '" stroke="#3a3550"/><line x1="122" y1="26" x2="122" y2="' + right.y + '" stroke="#3a3550"/><circle cx="98" cy="' + left.y + '" r="6" fill="#3f6fb0"/><circle cx="122" cy="' + right.y + '" r="6" fill="#c0403a"/><text x="70" y="' + (left.y + 4) + '" font-size="11">' + left.label + '</text><text x="132" y="' + (right.y + 4) + '" font-size="11">' + right.label + '</text>' + (note || '') + '</svg>';

  // ───────────────────────── June 2018 ─────────────────────────
  const m18 = [
    { id: 'm18-1', num: '1', topic: 'trig', marks: 6,
      prompt: R`In triangle $ABC$, $AB = 20$ cm and angle $B = 45°$. (i) Given $AC = 16$ cm, find the two possible values of angle $C$ (1 d.p.). (ii) Given instead that the area is $75\sqrt2$ cm², find $BC$.`,
      steps: [
        { ask: R`Sine rule: $\sin C = \dfrac{20\sin45°}{16}$. Find $\sin C$ (4 d.p.).`, answer: '20*sin(pi/4)/16', dp: 4, hint: R`$\dfrac{\sin C}{AB} = \dfrac{\sin B}{AC}$`, explain: R`$\sin C = 0.8839$` },
        { ask: R`Both possible values of $C$ (1 d.p.):`, type: 'set', answer: [62.1144, 117.8856], dp: 1, marks: 3, hint: R`$\sin^{-1}$ gives one; $180°$ minus it gives the other.`, explain: R`$C = 62.1°$ or $117.9°$ (both work: $45° + 117.9° < 180°$)` },
        { ask: R`(ii) $\tfrac12 \times 20 \times BC \times \sin45° = 75\sqrt2$. Find $BC$.`, answer: 15, marks: 2, hint: R`$\sin45° = \tfrac{\sqrt2}{2}$, so the left side is $5\sqrt2 \times BC$.`, explain: R`$5\sqrt2 \cdot BC = 75\sqrt2 \Rightarrow BC = 15$ cm` },
      ] },
    { id: 'm18-2', num: '2', topic: 'graphs', marks: 4,
      prompt: R`(i) $y = \dfrac{2}{3+x}$ is translated by 4 units in the positive $x$-direction. State the new equation. (ii) Describe fully the single transformation mapping $y = \dfrac{2}{3+x}$ to $y = \dfrac{5}{3+x}$.`,
      steps: [
        { ask: R`(i) New equation, $y = $ ?`, type: 'expr', answer: '2/(x-1)', marks: 2, hint: R`Replace $x$ with $x - 4$.`, explain: R`$y = \dfrac{2}{3 + x - 4} = \dfrac{2}{x - 1}$` },
        { ask: '(ii) The transformation is:', type: 'choice', marks: 2, choices: [R`A stretch parallel to the $y$-axis, scale factor $\tfrac52$`, R`A stretch parallel to the $x$-axis, scale factor $\tfrac52$`, R`A translation by 3 units up`, R`A stretch parallel to the $y$-axis, scale factor $\tfrac25$`], answer: 0, hint: R`$\dfrac5{3+x} = \tfrac52 \times \dfrac{2}{3+x}$`, explain: R`$y \mapsto \tfrac52 y$: stretch parallel to the $y$-axis, s.f. $\tfrac52$.` },
      ] },
    { id: 'm18-3', num: '3', topic: 'proof', marks: 3,
      prompt: R`Choose $P \Rightarrow Q$, $P \Leftarrow Q$ or $P \Leftrightarrow Q$ for each pair.`,
      steps: [
        { ask: R`(i) $P$: $y = 3x^5 - 4x^2 + 12x$. $Q$: $\dfrac{dy}{dx} = 15x^4 - 8x + 12$.`, type: 'choice', choices: [R`$P \Rightarrow Q$`, R`$P \Leftarrow Q$`, R`$P \Leftrightarrow Q$`], answer: 0, hint: R`Does $Q$ pin down $y$ exactly? (Think $+c$.)`, explain: R`$P \Rightarrow Q$ only: $Q$ also holds for $y = 3x^5 - 4x^2 + 12x + c$.` },
        { ask: R`(ii) $P$: $x^5 - 32 = 0$, $x$ real. $Q$: $x = 2$.`, type: 'choice', choices: [R`$P \Leftrightarrow Q$`, R`$P \Rightarrow Q$`, R`$P \Leftarrow Q$`], answer: 0, hint: R`How many REAL fifth roots does 32 have?`, explain: R`$P \Leftrightarrow Q$: the only real solution of $x^5 = 32$ is $2$.` },
        { ask: R`(iii) $P$: $\ln y < 0$. $Q$: $y < 1$.`, type: 'choice', choices: [R`$P \Rightarrow Q$`, R`$P \Leftarrow Q$`, R`$P \Leftrightarrow Q$`], answer: 0, hint: R`$\ln y < 0 \iff 0 < y < 1$. What about $y = -5$?`, explain: R`$P \Rightarrow Q$: $Q$ includes negative $y$, where $\ln y$ isn't defined.` },
      ] },
    { id: 'm18-4', num: '4', topic: 'quadratics', marks: 6,
      prompt: R`(i) Express $4x^2 - 12x + 11$ in the form $a(x+b)^2 + c$. (ii) State the number of real roots of $4x^2 - 12x + 11 = 0$. (iii) Explain how $r$ determines the number of real roots of $p(x+q)^2 + r = 0$ ($p > 0$).`,
      steps: [
        { ask: R`Give $a, b, c$ in order.`, type: 'tuple', answer: [4, -1.5, 2], marks: 3, hint: R`$4(x^2 - 3x) + 11 = 4(x - 1.5)^2 - 9 + 11$`, explain: R`$4(x - 1.5)^2 + 2$` },
        { ask: '(ii) Number of real roots?', answer: 0, hint: R`The minimum value is $2 > 0$.`, explain: R`$0$ — the curve never reaches the axis.` },
        { ask: R`(iii) Relationship:`, type: 'choice', marks: 2, choices: [R`$r > 0$: no real roots; $r = 0$: one repeated root; $r < 0$: two distinct real roots.`, R`$r > 0$: two roots; $r < 0$: none.`, R`Always two roots.`, R`$r$ doesn't matter, only $q$.`], answer: 0, hint: R`Minimum value is $r$.`, explain: R`The minimum value is $r$: above, on, or below the axis.` },
      ] },
    { id: 'm18-5', num: '5', topic: 'quadratics', marks: 5, dr: true,
      prompt: R`The line $x + 5y = k$ is a tangent to the curve $x^2 - 4y = 10$. Find $k$.`,
      steps: [
        { ask: R`Substitute $y = \dfrac{x^2 - 10}{4}$ into the line. Which quadratic?`, type: 'choice', marks: 2, choices: [R`$5x^2 + 4x - 50 - 4k = 0$`, R`$5x^2 + 4x + 50 - 4k = 0$`, R`$x^2 + 5x - k = 0$`, R`$5x^2 - 50 = 4k$`], answer: 0, hint: R`$x + \tfrac54(x^2 - 10) = k$, then $\times 4$.`, explain: R`$4x + 5x^2 - 50 = 4k \Rightarrow 5x^2 + 4x - (50 + 4k) = 0$` },
        { ask: R`Tangent ⇒ discriminant = 0: $16 + 20(50 + 4k) = 0$. Find $k$.`, answer: -12.7, marks: 3, hint: R`$16 + 1000 + 80k = 0$`, explain: R`$80k = -1016 \Rightarrow k = -12.7$` },
      ] },
    { id: 'm18-6', num: '6', topic: 'explog', marks: 9,
      prompt: R`Water at 100 °C cools as $T = 25 + ae^{-kt}$ ($t$ in minutes). Initially it cools at 15 °C per minute.`,
      steps: [
        { ask: R`(i) $a = $ ?`, answer: 75, hint: R`At $t = 0$, $T = 100$.`, explain: R`$100 = 25 + a \Rightarrow a = 75$` },
        { ask: '(ii) What does 25 represent?', type: 'choice', choices: ['The room temperature — the temperature the water cools towards.', 'The starting temperature.', 'The rate of cooling.', 'The time to cool.'], answer: 0, hint: R`What happens as $t \to \infty$?`, explain: R`$T \to 25$: room temperature.` },
        { ask: R`(iii) $\dfrac{dT}{dt} = -75ke^{-kt}$. Use the initial rate to find $k$.`, answer: 0.2, marks: 3, hint: R`At $t = 0$: $-75k = -15$.`, explain: R`$k = 0.2$` },
        { ask: R`(iv) Time to cool to 45 °C (3 s.f.)?`, answer: '5ln(3.75)', sf: 3, marks: 3, hint: R`$75e^{-0.2t} = 20$`, explain: R`$t = 5\ln 3.75 = 6.61$ minutes` },
        { ask: '(v) If heating stops below 100 °C:', type: 'choice', choices: [R`$a$ would be smaller ($a = T_0 - 25$).`, R`25 would change.`, R`$k$ would be negative.`, 'Nothing changes.'], answer: 0, hint: R`$a$ is set by the starting temperature.`, explain: R`$a$ decreases — it equals the starting temperature minus 25.` },
      ] },
    { id: 'm18-7', num: '7', topic: 'trig', marks: 8,
      prompt: R`(i) Show that $2\sin x\tan x = \cos x + 5$ can be written as $3\cos^2 x + 5\cos x - 2 = 0$. (ii) Hence solve $2\sin2\theta\tan2\theta = \cos2\theta + 5$ for $0° < \theta < 180°$ (1 d.p.).`,
      steps: [
        { ask: R`(i) Multiply by $\cos x$ and use $\sin^2 x = 1 - \cos^2 x$. You get...`, type: 'choice', marks: 3, choices: [R`$2 - 2\cos^2 x = \cos^2 x + 5\cos x \Rightarrow 3\cos^2 x + 5\cos x - 2 = 0$`, R`$2\sin^2 x = \cos x + 5$`, R`$2 - 2\cos^2 x = \cos x + 5$`, R`$\sin x = \cos x$`], answer: 0, hint: R`$2\sin x \cdot \dfrac{\sin x}{\cos x} = \cos x + 5$`, explain: R`$2\sin^2 x = \cos^2 x + 5\cos x$, then $\sin^2 = 1 - \cos^2$. ∎` },
        { ask: R`(ii) Factorise: possible values of $\cos 2\theta$:`, type: 'set', answer: ['1/3', -2], marks: 2, hint: R`$(3c - 1)(c + 2)$`, explain: R`$\cos2\theta = \tfrac13$ (or $-2$, impossible)` },
        { ask: R`All $\theta$ in $0° < \theta < 180°$ (1 d.p.):`, type: 'set', answer: [35.2644, 144.7356], dp: 1, marks: 3, hint: R`$2\theta = 70.5°, 289.5°$ (since $0 < 2\theta < 360°$).`, explain: R`$\theta = 35.3°, 144.7°$` },
      ] },
    { id: 'm18-8', num: '8', topic: 'integ', marks: 9, dr: true,
      prompt: R`The region under $y = 2x^{\frac13} - \dfrac{7}{x^{\frac13}}$ between $x = 8$ and $x = a$ ($a > 8$) has area 45. Find $a$.` + Graph.svg({ w: 280, h: 170, x: [0, 30], y: [-3, 7], xstep: 5, ystep: 2, fns: [{ f: '2x^(1/3)-7x^(-1/3)', domain: [1, 30] }], shade: { f: '2x^(1/3)-7x^(-1/3)', a: 8, b: 27 } }),
      steps: [
        { ask: R`Integrate $2x^{\frac13} - 7x^{-\frac13}$.`, type: 'antideriv', answer: '1.5x^(4/3)-10.5x^(2/3)', marks: 3, hint: R`Powers become $\tfrac43$ and $\tfrac23$.`, explain: R`$\tfrac32 x^{\frac43} - \tfrac{21}{2}x^{\frac23}$` },
        { ask: R`Value at $x = 8$:`, answer: -18, hint: R`$8^{\frac43} = 16$, $8^{\frac23} = 4$`, explain: R`$24 - 42 = -18$` },
        { ask: R`Let $u = a^{\frac23}$. The area condition $\tfrac32u^2 - \tfrac{21}{2}u + 18 = 45$ becomes...`, type: 'choice', marks: 2, choices: [R`$u^2 - 7u - 18 = 0$`, R`$u^2 - 7u + 18 = 0$`, R`$u^2 + 7u - 18 = 0$`, R`$3u^2 - 21u = 45$`], answer: 0, hint: R`$\times\tfrac23$: $u^2 - 7u + 12 = 30$.`, explain: R`$u^2 - 7u - 18 = 0 = (u - 9)(u + 2)$` },
        { ask: R`$u = 9$ (reject $-2$). Find $a$.`, answer: 27, marks: 3, hint: R`$a^{\frac23} = 9 \Rightarrow a = 9^{\frac32}$`, explain: R`$a = 27$` },
      ] },
    { id: 'm18-9', num: '9', topic: 'forces', marks: 4,
      prompt: R`A model ship of mass 2 kg has acceleration $\mathbf{a} = 3(2t - 5)\mathbf{i} + 4\mathbf{j}$ m s⁻². When $t = T$, the magnitude of the horizontal force on it is 10 N. Find the possible values of $T$.`,
      steps: [
        { ask: R`Force $\mathbf{F} = m\mathbf{a}$. Its $\mathbf{j}$-component?`, answer: 8, hint: R`$2 \times 4$`, explain: R`$\mathbf{F} = 6(2T-5)\mathbf{i} + 8\mathbf{j}$` },
        { ask: R`$|\mathbf{F}| = 10$ gives $36(2T - 5)^2 + 64 = 100$. Solve for $T$.`, type: 'set', answer: [3, 2], marks: 3, hint: R`$(2T - 5)^2 = 1$`, explain: R`$2T - 5 = \pm1 \Rightarrow T = 2$ or $3$` },
      ] },
    { id: 'm18-10', num: '10', topic: 'forces', marks: 8,
      prompt: R`$P$ (3 kg) and $Q$ (5 kg) hang from a light inextensible string over a smooth pulley, released from rest. After descending 2.5 m, $Q$ hits the plane and stops; $P$ carries on. Take $g = 9.8$.` + pulley({ y: 90, label: 'P 3 kg' }, { y: 70, label: 'Q 5 kg' }),
      steps: [
        { ask: R`Acceleration of the system (m s⁻²)?`, answer: 2.45, hint: R`$(5 - 3)g = 8a$`, explain: R`$a = \tfrac{2g}{8} = 2.45$` },
        { ask: '(i) Tension (N)?', answer: 36.75, sf: 3, marks: 3, hint: R`For $P$: $T - 3g = 3a$`, explain: R`$T = 3(9.8 + 2.45) = 36.75$ N` },
        { ask: R`Speed of $P$ when $Q$ hits the plane (m s⁻¹)?`, answer: 3.5, hint: R`$v^2 = 2 \times 2.45 \times 2.5$`, explain: R`$v^2 = 12.25$, $v = 3.5$` },
        { ask: R`(ii) Distance $P$ travels before the string is taut again (m)?`, answer: 1.25, marks: 3, hint: R`$P$ moves freely: up until $v = 0$, then back down the same distance. Up: $s = \tfrac{3.5^2}{2g}$.`, explain: R`Up $0.625$ m, down $0.625$ m: total $1.25$ m` },
      ] },
    { id: 'm18-11', num: '11', topic: 'kinematics', marks: 13,
      prompt: R`$P$ moves with constant acceleration. It starts at $O$; after 9 s it is at $A$ ($OA = 18$ m) with velocity 8 m s⁻¹ in direction $OA$. $B$ is on the other side of $O$ with $OB = 10$ m. A second particle $Q$ has $x = at^3 + bt^2 + ct$, with the same velocity and acceleration as $P$ at $O$, and reaches $A$ at $t = 6$.`,
      steps: [
        { ask: R`(i)(a) Initial velocity of $P$ (towards $A$ positive)?`, answer: -4, marks: 2, hint: R`$s = \tfrac12(u + v)t$: $18 = \tfrac12(u + 8)(9)$`, explain: R`$u + 8 = 4 \Rightarrow u = -4$: speed 4 m s⁻¹, initially towards $B$.` },
        { ask: '(b) Acceleration?', answer: '4/3', marks: 2, hint: R`$a = \tfrac{v - u}{t}$`, explain: R`$a = \tfrac{12}{9} = \tfrac43$ m s⁻²` },
        { ask: R`(ii) Furthest distance $P$ gets from $O$ on the $B$ side (m)?`, answer: 6, marks: 3, hint: R`It stops when $v = 0$: $0 = 16 - 2 \cdot \tfrac43 s$.`, explain: R`$s = 6$ m` },
        { ask: 'So:', type: 'choice', choices: ['6 < 10, so P never reaches B.', 'P reaches B at t = 3.', 'P passes B twice.', 'Cannot tell.'], answer: 0, hint: 'Compare with OB = 10.', explain: 'P turns round 6 m from O, so it never reaches B.' },
        { ask: R`(iii) For $Q$: $v = 3at^2 + 2bt + c$, acceleration $6at + 2b$. Using $O$: find $c$ and $b$ (give $b, c$).`, type: 'tuple', answer: ['2/3', -4], marks: 2, hint: R`At $t = 0$: $v = c = -4$, acceleration $2b = \tfrac43$.`, explain: R`$c = -4$, $b = \tfrac23$` },
        { ask: R`$x(6) = 18$. Find $a$.`, answer: '1/12', hint: R`$216a + 24 - 24 = 18$`, explain: R`$a = \tfrac{1}{12}$` },
        { ask: R`Velocity of $Q$ at $A$ ($t = 6$)?`, answer: 13, marks: 2, hint: R`$3 \cdot \tfrac1{12} \cdot 36 + 2 \cdot \tfrac23 \cdot 6 - 4$`, explain: R`$9 + 8 - 4 = 13$ m s⁻¹` },
      ] },
  ];

  // ───────────────────────── June 2019 ─────────────────────────
  const m19 = [
    { id: 'm19-1', num: '1', topic: 'indices', marks: 3, dr: true,
      prompt: R`Solve $x(3 - \sqrt5) = 24$, giving your answer as $a + b\sqrt5$.`,
      steps: [
        { ask: R`Rationalise $\dfrac{24}{3 - \sqrt5}$. The denominator becomes...`, answer: 4, hint: R`$(3-\sqrt5)(3+\sqrt5)$`, explain: R`$9 - 5 = 4$` },
        { ask: R`$x = $ ?`, exact: true, answer: '18+6sqrt5', marks: 2, hint: R`$\dfrac{24(3 + \sqrt5)}{4}$`, explain: R`$x = 6(3 + \sqrt5) = 18 + 6\sqrt5$` },
      ] },
    { id: 'm19-2', num: '2', topic: 'quadratics', marks: 6,
      prompt: R`(a) Express $5x^2 - 20x + 3$ as $p(x+q)^2 + r$. (b) State the minimum point of $y = 5x^2 - 20x + 3$. (c) State the equation of the normal at the minimum point.`,
      steps: [
        { ask: R`Give $p, q, r$.`, type: 'tuple', answer: [5, -2, -17], marks: 3, hint: R`$5(x^2 - 4x) + 3 = 5(x-2)^2 - 20 + 3$`, explain: R`$5(x - 2)^2 - 17$` },
        { ask: '(b) Minimum point:', type: 'point', answer: [2, -17], marks: 2, hint: 'Read it off.', explain: R`$(2, -17)$` },
        { ask: '(c) Normal at the minimum:', type: 'choice', choices: [R`$x = 2$`, R`$y = -17$`, R`$y = 2x - 21$`, R`$y = -x$`], answer: 0, hint: 'The tangent at a minimum is horizontal, so the normal is...', explain: R`Tangent $y = -17$ is horizontal, so the normal is vertical: $x = 2$.` },
      ] },
    { id: 'm19-3', num: '3', topic: 'graphs', marks: 5,
      prompt: R`(a) Sketch $y = -\dfrac1{x^2}$. (b) It is translated 2 units in the positive $x$-direction: new equation? (c) It is stretched parallel to the $y$-axis, scale factor $\tfrac12$: where does $\left(\tfrac12, -4\right)$ go?`,
      steps: [
        { ask: '(a) Which sketch?', type: 'choice', choices: [sk('-1/x^2', [-3, 3], [-4, 1]), sk('1/x^2', [-3, 3], [-1, 4]), sk('-1/x', [-3, 3], [-3, 3]), sk('-x^2', [-3, 3], [-4, 1])], answer: 0, hint: R`Always negative, symmetric about the $y$-axis.`, explain: R`Two branches below the $x$-axis, asymptotes $x = 0$, $y = 0$.` },
        { ask: R`(b) $y = $ ?`, type: 'expr', answer: '-1/(x-2)^2', marks: 2, hint: R`Replace $x$ with $x - 2$.`, explain: R`$y = -\dfrac{1}{(x-2)^2}$` },
        { ask: '(c) P = ?', type: 'point', answer: [0.5, -2], marks: 2, hint: R`$y$ halves, $x$ stays.`, explain: R`$P\left(\tfrac12, -2\right)$` },
      ] },
    { id: 'm19-4', num: '4', topic: 'binomial', marks: 6,
      prompt: R`(a) Find the first three terms of $(2 - 5x)^5$ in ascending powers of $x$. (b) In the expansion of $(1 + ax)^2(2 - 5x)^5$, the coefficient of $x$ is 48. Find $a$.`,
      steps: [
        { ask: '(a) First three terms:', type: 'expr', answer: '32-400x+2000x^2', marks: 3, hint: R`$2^5$, $5 \cdot 2^4(-5x)$, $10 \cdot 2^3(-5x)^2$`, explain: R`$32 - 400x + 2000x^2$` },
        { ask: R`(b) $(1 + 2ax + \ldots)(32 - 400x + \ldots)$: the $x$ coefficient in terms of $a$:`, type: 'expr', vars: ['a'], answer: '64a-400', marks: 2, hint: R`$1 \times (-400) + 2a \times 32$`, explain: R`$64a - 400$` },
        { ask: R`Find $a$.`, answer: 7, hint: R`$64a - 400 = 48$`, explain: R`$a = 7$` },
      ] },
    { id: 'm19-5', num: '5', topic: 'vectors', marks: 6,
      prompt: R`$\mathbf a = \begin{pmatrix}1\\2\end{pmatrix}$, $\mathbf b = \begin{pmatrix}3\\5\end{pmatrix}$, $\mathbf c = \begin{pmatrix}7\\4\end{pmatrix}$, $\mathbf d = \begin{pmatrix}4\\k\end{pmatrix}$.`,
      steps: [
        { ask: R`(a) $k$ for which $D$ is the midpoint of $AC$:`, answer: 3, hint: R`Midpoint $\left(\tfrac{1+7}{2}, \tfrac{2+4}{2}\right)$`, explain: R`$(4, 3)$, so $k = 3$` },
        { ask: R`(b) $|\overrightarrow{AD}| = \sqrt{13}$: both values of $k$.`, type: 'set', answer: [4, 0], marks: 3, hint: R`$\overrightarrow{AD} = \begin{pmatrix}3\\k-2\end{pmatrix}$; $9 + (k-2)^2 = 13$`, explain: R`$(k-2)^2 = 4 \Rightarrow k = 4$ or $0$` },
        { ask: '(c) One value of k making ABCD a trapezium:', type: 'choice', marks: 2, choices: [R`$k = -\tfrac12$ (then $\overrightarrow{DC} = \tfrac32\overrightarrow{AB}$, so $AB \parallel DC$)`, R`$k = 3$`, R`$k = 5$`, R`$k = 2$`], answer: 0, hint: R`$\overrightarrow{AB} = \begin{pmatrix}2\\3\end{pmatrix}$. Make $\overrightarrow{DC} = \begin{pmatrix}3\\4-k\end{pmatrix}$ a multiple of it.`, explain: R`$\begin{pmatrix}3\\4-k\end{pmatrix} = \tfrac32\begin{pmatrix}2\\3\end{pmatrix} \Rightarrow k = -\tfrac12$ (or $AD \parallel BC$ gives $k = 1.25$)` },
      ] },
    { id: 'm19-6', num: '6', topic: 'trig', marks: 7, dr: true,
      prompt: R`(a) Show $6\cos^2\theta = \tan\theta\cos\theta + 4$ can be written $6\sin^2\theta + \sin\theta - 2 = 0$. (b) Solve $6\cos^2\theta > \tan\theta\cos\theta + 4$ for $0° < \theta < 360°$.` + Graph.svg({ w: 300, h: 170, x: [0, 360], y: [0, 7], xstep: 90, ystep: 2, fns: [{ f: '6cos(x*pi/180)^2', label: '6cos²θ' }, { f: 'sin(x*pi/180)+4', label: 'tanθcosθ + 4' }] }),
      steps: [
        { ask: R`(a) $\tan\theta\cos\theta = \sin\theta$ and $\cos^2\theta = 1 - \sin^2\theta$ give...`, type: 'choice', marks: 2, choices: [R`$6 - 6\sin^2\theta = \sin\theta + 4$, i.e. $6\sin^2\theta + \sin\theta - 2 = 0$`, R`$6\cos^2\theta = \sin\theta$`, R`$6\sin^2\theta = \sin\theta + 4$`, R`$\cos\theta = 4$`], answer: 0, hint: 'Substitute both.', explain: R`$6 - 6\sin^2\theta = \sin\theta + 4$ ∎` },
        { ask: R`Roots: values of $\sin\theta$.`, type: 'set', answer: [0.5, '-2/3'], hint: R`$(2s - 1)(3s + 2)$`, explain: R`$\sin\theta = \tfrac12$ or $-\tfrac23$` },
        { ask: R`Solutions of the equation (1 d.p.):`, type: 'set', answer: [30, 150, 221.8103, 318.1897], dp: 1, marks: 2, hint: R`$\sin\theta = -\tfrac23$: $180° + 41.8°$ and $360° - 41.8°$.`, explain: R`$30°, 150°, 221.8°, 318.2°$` },
        { ask: R`$6\cos^2\theta > \ldots \iff -\tfrac23 < \sin\theta < \tfrac12$. So:`, type: 'choice', marks: 2, choices: [R`$0° < \theta < 30°$, $150° < \theta < 221.8°$, $318.2° < \theta < 360°$`, R`$30° < \theta < 150°$`, R`$221.8° < \theta < 318.2°$`, R`$30° < \theta < 221.8°$`], answer: 0, hint: R`Where on the graph is the $6\cos^2\theta$ curve higher?`, explain: R`$\{0 < \theta < 30\} \cup \{150 < \theta < 221.8\} \cup \{318.2 < \theta < 360\}$` },
      ] },
    { id: 'm19-7', num: '7', topic: 'integ', marks: 8,
      prompt: R`The total area of the shaded regions between $y = (5-x)(x-1)$, the $x$-axis and $x = a$ is 19. Find $a$ exactly.` + Graph.svg({ w: 280, h: 180, x: [-0.5, 7.5], y: [-8, 5], xstep: 1, ystep: 2, fns: [{ f: '(5-x)(x-1)' }], shade: { f: '(5-x)(x-1)', a: 1, b: 6.79 } }),
      steps: [
        { ask: R`Area between $x = 1$ and $x = 5$ (exact):`, answer: '32/3', exact: true, marks: 3, hint: R`$\int_1^5 (-x^2 + 6x - 5)\,dx$`, explain: R`$\left[-\tfrac{x^3}{3} + 3x^2 - 5x\right]_1^5 = \tfrac{25}{3} + \tfrac73 = \tfrac{32}{3}$` },
        { ask: R`So the region beyond $x = 5$ has area...`, answer: '25/3', exact: true, hint: R`$19 - \tfrac{32}{3}$`, explain: R`$\tfrac{25}{3}$ (below the axis)` },
        { ask: R`$F(5) - F(a) = \tfrac{25}{3}$ where $F(x) = -\tfrac{x^3}{3} + 3x^2 - 5x$. This gives...`, type: 'choice', marks: 2, choices: [R`$F(a) = 0 \Rightarrow a^2 - 9a + 15 = 0$`, R`$F(a) = \tfrac{25}{3}$`, R`$a^2 - 9a - 15 = 0$`, R`$a = 5$`], answer: 0, hint: R`$F(5) = \tfrac{25}{3}$.`, explain: R`$F(a) = 0 \Rightarrow a\left(-\tfrac{a^2}{3} + 3a - 5\right) = 0 \Rightarrow a^2 - 9a + 15 = 0$` },
        { ask: R`$a$ (exact, $a > 5$):`, answer: '(9+sqrt21)/2', exact: true, marks: 2, hint: 'Quadratic formula.', explain: R`$a = \dfrac{9 + \sqrt{21}}{2}$` },
      ] },
    { id: 'm19-8', num: '8', topic: 'explog', marks: 8,
      prompt: R`(a) Show $2\log_2 x = \log_2(kx - 1) + 3$ can be written $x^2 - 8kx + 8 = 0$. (b) Given it has only one real root, find that root.`,
      steps: [
        { ask: R`(a) Combine logs: $\log_2 \dfrac{x^2}{kx - 1} = 3$ gives...`, type: 'choice', marks: 4, choices: [R`$x^2 = 8(kx - 1)$, i.e. $x^2 - 8kx + 8 = 0$`, R`$x^2 = 3(kx - 1)$`, R`$2x = kx + 2$`, R`$x^2 - kx = 8$`], answer: 0, hint: R`$\log_2 A = 3 \iff A = 8$`, explain: R`$x^2 = 8kx - 8$ ∎` },
        { ask: R`(b) One root ⇒ discriminant 0: $64k^2 - 32 = 0$. Valid $k$ (exact)?`, answer: '1/sqrt2', exact: true, marks: 2, hint: R`$k = \pm\tfrac1{\sqrt2}$; the root $x = 4k$ must be positive.`, explain: R`$k = \tfrac{1}{\sqrt2}$ (the negative gives $x < 0$, outside the log\'s domain)` },
        { ask: 'The root (exact):', answer: '2sqrt2', exact: true, marks: 2, hint: R`$x = 4k$`, explain: R`$x = 2\sqrt2$` },
      ] },
    { id: 'm19-9', num: '9', topic: 'forces', marks: 2,
      prompt: R`Three forces $\begin{pmatrix}7\\-6\end{pmatrix}$ N, $\begin{pmatrix}2\\5\end{pmatrix}$ N and $\mathbf F$ N keep a particle in equilibrium. Find $\mathbf F$.`,
      steps: [{ ask: R`$\mathbf F = $ ?`, type: 'vector', answer: [-9, 1], marks: 2, hint: 'Resultant must be zero.', explain: R`$\mathbf F = -\begin{pmatrix}9\\-1\end{pmatrix} = \begin{pmatrix}-9\\1\end{pmatrix}$` }] },
    { id: 'm19-10', num: '10', topic: 'kinematics', marks: 8,
      prompt: R`A car's velocity is $v = pt^2 + qt + r$ for $0 \le t \le 5$; $v(0) = 18$, $v(5) = 9$, and its acceleration is zero at $t = 5$, after which the speed stays at 9 m s⁻¹.` + Graph.svg({ w: 280, h: 170, x: [0, 11], y: [0, 20], xstep: 1, ystep: 3, fns: [{ f: '0.36x^2-3.6x+18', domain: [0, 5] }, { f: '9', domain: [5, 11], color: '#3f6fb0' }], labels: { x: 't', y: 'v' } }),
      steps: [
        { ask: R`(a) Give $p, q, r$.`, type: 'tuple', answer: [0.36, -3.6, 18], marks: 5, hint: R`$r = 18$; $25p + 5q + 18 = 9$; $10p + q = 0$.`, explain: R`$p = 0.36$, $q = -3.6$, $r = 18$` },
        { ask: '(b) Distance from t = 2 to t = 10 (m, 4 s.f.):', answer: 75.24, sf: 4, marks: 3, hint: R`$\int_2^5 v\,dt + 9 \times 5$`, explain: R`$30.24 + 45 = 75.24$ m` },
      ] },
    { id: 'm19-11', num: '11', topic: 'forces', marks: 16,
      prompt: R`Ball $P$ (3 kg) on a rough horizontal surface is pulled away from a pulley by a 40 N force, with friction 8 N. It is tied over the pulley to ball $Q$ (2 kg), 2 m above the floor. After 0.5 s the string breaks. $g = 9.8$.`,
      steps: [
        { ask: R`(a) Acceleration of the system (show it's 2.48):`, answer: 2.48, marks: 5, hint: R`$40 - 8 - 2g = 5a$`, explain: R`$12.4 = 5a \Rightarrow a = 2.48$ m s⁻²` },
        { ask: '(b) Tension (N):', answer: 24.56, sf: 4, marks: 2, hint: R`For $Q$ (rising): $T - 2g = 2a$`, explain: R`$T = 19.6 + 4.96 = 24.56$ N` },
        { ask: R`(c) After 0.5 s: speed of $Q$ and its height. Speed?`, answer: 1.24, hint: R`$v = 2.48 \times 0.5$`, explain: R`$v = 1.24$ m s⁻¹ (up); it has risen $0.31$ m, so it's $2.31$ m up.` },
        { ask: R`Time from the break until $Q$ hits the floor (3 s.f.):`, answer: 0.824699, sf: 3, marks: 4, hint: R`$-2.31 = 1.24t - 4.9t^2$`, explain: R`$t = 0.825$ s` },
        { ask: R`(d) Speed of $Q$ on hitting the floor (3 s.f.):`, answer: 6.84205, sf: 3, marks: 2, hint: R`$v^2 = 1.24^2 + 2(9.8)(2.31)$`, explain: R`$6.84$ m s⁻¹` },
        { ask: R`(e) Normal reaction on $Q$ once at rest (N):`, answer: 19.6, hint: R`$R = mg$`, explain: R`$19.6$ N` },
        { ask: '(f) One improvement to the model:', type: 'choice', choices: ['Include air resistance (or friction at the pulley).', 'Use a heavier ball.', 'Use g = 10.', 'Make the string longer.'], answer: 0, hint: 'What did the model ignore?', explain: 'e.g. include air resistance / pulley friction / the balls\' size.' },
      ] },
  ];

  // ───────────────────────── November 2020 ─────────────────────────
  const m20 = [
    { id: 'm20-1', num: '1', topic: 'trig', marks: 5,
      prompt: R`Sector $AOB$ has radius 9.5 cm and angle $25°$. (a) Find the chord $AB$. (b) Find the area of the segment between the chord and the arc.`,
      steps: [
        { ask: R`(a) $AB$ (3 s.f.):`, answer: '2*9.5*sin(12.5*pi/180)', sf: 3, marks: 2, hint: R`Cosine rule, or $2r\sin\tfrac{25°}{2}$.`, explain: R`$AB = 4.11$ cm` },
        { ask: R`(b) Sector area (3 s.f.):`, answer: '25/360*pi*9.5^2', sf: 3, hint: R`$\tfrac{25}{360}\pi r^2$`, explain: R`$19.69$ cm²` },
        { ask: R`Segment area (3 s.f.):`, answer: 0.618847, sf: 3, marks: 2, hint: R`Sector minus triangle $\tfrac12 r^2\sin25°$.`, explain: R`$19.69 - 19.07 = 0.619$ cm²` },
      ] },
    { id: 'm20-2', num: '2', topic: 'graphs', marks: 5,
      prompt: R`Curves $y = \ln x$ and $y = \dfrac{k}{x}$ ($k > 0$). (a) Sketch them on one diagram. (b) Explain why $x\ln x - k = 0$ has exactly one real root.`,
      steps: [
        { ask: '(a) Which diagram?', type: 'choice', marks: 3, choices: [Graph.svg({ w: 150, h: 110, x: [-3, 6], y: [-3, 3], plain: true, ticks: false, fns: [{ f: 'ln(x)', domain: [0.05, 6], color: '#14141c' }, { f: '1/x', color: '#c0403a' }] }), Graph.svg({ w: 150, h: 110, x: [-3, 6], y: [-3, 3], plain: true, ticks: false, fns: [{ f: 'ln(x)', domain: [0.05, 6], color: '#14141c' }, { f: '-1/x', color: '#c0403a' }] }), Graph.svg({ w: 150, h: 110, x: [-3, 6], y: [-3, 3], plain: true, ticks: false, fns: [{ f: 'e^x', color: '#14141c' }, { f: '1/x', color: '#c0403a' }] })], answer: 0, hint: R`$\ln x$ only exists for $x > 0$, through $(1, 0)$. $\tfrac kx$ has branches in quadrants 1 and 3.`, explain: R`$\ln x$ through $(1,0)$; $\tfrac kx$ in the 1st and 3rd quadrants.` },
        { ask: '(b) Why exactly one root?', type: 'choice', marks: 2, choices: [R`$x\ln x = k \iff \ln x = \tfrac kx$, and the two curves cross exactly once.`, R`$\ln x$ is increasing.`, R`$k > 0$.`, R`$x\ln x$ is a cubic.`], answer: 0, hint: R`Divide by $x$.`, explain: R`$x\ln x - k = 0 \iff \ln x = \tfrac kx$ (for $x > 0$): one intersection, so one root.` },
      ] },
    { id: 'm20-3', num: '3', topic: 'diff', marks: 7, dr: true,
      prompt: R`Find the normal to $y = 4\sqrt x - 3x + 1$ at $x = 4$, in the form $ax + by + c = 0$.`,
      steps: [
        { ask: R`$y$ at $x = 4$:`, answer: -3, hint: R`$8 - 12 + 1$`, explain: R`$(4, -3)$` },
        { ask: R`$\dfrac{dy}{dx} = $ ?`, type: 'expr', answer: '2x^(-1/2)-3', marks: 2, hint: R`$4x^{\frac12} \to 2x^{-\frac12}$`, explain: R`$2x^{-\frac12} - 3$` },
        { ask: 'Gradient of the curve at x = 4:', answer: -2, hint: R`$2 \times \tfrac12 - 3$`, explain: R`$-2$` },
        { ask: 'Normal, y = ?', type: 'expr', answer: '(x-4)/2-3', marks: 2, hint: R`Gradient $\tfrac12$ through $(4, -3)$.`, explain: R`$y + 3 = \tfrac12(x - 4)$` },
        { ask: R`In the form $ax + by + c = 0$ (give $a, b, c$ with $a = 1$):`, type: 'tuple', answer: [1, -2, -10], hint: R`Multiply by 2 and rearrange.`, explain: R`$x - 2y - 10 = 0$` },
      ] },
    { id: 'm20-4', num: '4', topic: 'quadratics', marks: 9, dr: true,
      prompt: R`$f(x) = 6x^3 + kx^2 + 57x - 20$, and $(2x - 1)$ is a factor. (a) Show $k = -37$. (b) Factorise. (c)(i) Solve $6e^{-3t} - 37e^{-2t} + 57e^{-t} - 20 = 0$. (ii) Express the sum of the solutions as a single logarithm.`,
      steps: [
        { ask: R`(a) $f\left(\tfrac12\right) = 0$ gives $k = $ ?`, answer: -37, marks: 2, hint: R`$\tfrac34 + \tfrac k4 + 28.5 - 20 = 0$`, explain: R`$k = -37$` },
        { ask: R`(b) Roots of $f(x) = 0$:`, type: 'set', answer: [0.5, '5/3', 4], marks: 3, hint: R`$f(x) = (2x - 1)(3x^2 - 17x + 20) = (2x-1)(3x-5)(x-4)$`, explain: R`$x = \tfrac12, \tfrac53, 4$` },
        { ask: R`(c)(i) With $x = e^{-t}$, the values of $t$:`, type: 'set', answer: ['ln2', 'ln0.6', '-ln4'], marks: 2, hint: R`$t = -\ln x$`, explain: R`$t = \ln2$, $\ln\tfrac35$, $-\ln4$` },
        { ask: '(ii) Sum as a single log — its value:', answer: 'ln0.3', exact: true, marks: 2, hint: R`$\ln2 + \ln0.6 - \ln4 = \ln\dfrac{2 \times 0.6}{4}$`, explain: R`$\ln\tfrac{3}{10}$` },
      ] },
    { id: 'm20-5', num: '5', topic: 'graphs', marks: 5,
      prompt: R`$y = a(x+b)^2 + c$ has a stationary point at $(-3, 2)$. Translated by $\begin{pmatrix}4\\0\end{pmatrix}$, it passes through $(3, -18)$.`,
      steps: [
        { ask: R`(a) Give $b, c$.`, type: 'tuple', answer: [3, 2], marks: 2, hint: R`Vertex at $(-b, c)$.`, explain: R`$b = 3$, $c = 2$` },
        { ask: R`(b) Translated: $y = a(x - 1)^2 + 2$. Find $a$.`, answer: -5, marks: 3, hint: R`$4a + 2 = -18$`, explain: R`$a = -5$` },
      ] },
    { id: 'm20-6', num: '6', topic: 'coord', marks: 6, dr: true,
      prompt: R`The line $3y + x = 7$ is a tangent to a circle with centre $(3, -2)$. Find the equation of the circle.`,
      steps: [
        { ask: 'Gradient of the radius to the point of contact:', answer: 3, hint: R`The tangent has gradient $-\tfrac13$.`, explain: R`$3$` },
        { ask: 'Point of contact:', type: 'point', answer: [4, 1], marks: 2, hint: R`Radius line $y = 3x - 11$; solve with $x + 3y = 7$.`, explain: R`$(4, 1)$` },
        { ask: R`$r^2 = $ ?`, answer: 10, hint: R`$(4-3)^2 + (1+2)^2$`, explain: R`$r^2 = 10$` },
        { ask: 'The circle is:', type: 'choice', marks: 2, choices: [R`$(x - 3)^2 + (y + 2)^2 = 10$`, R`$(x + 3)^2 + (y - 2)^2 = 10$`, R`$(x - 3)^2 + (y + 2)^2 = \sqrt{10}$`, R`$x^2 + y^2 = 10$`], answer: 0, hint: 'Centre (3, −2).', explain: R`$(x-3)^2 + (y+2)^2 = 10$` },
      ] },
    { id: 'm20-7', num: '7', topic: 'diff', marks: 13,
      prompt: R`A toy roof is a triangular prism: base $AC = 2x$, length $y$, height $x$, cross-section isosceles. The five faces have total area 600 cm² and volume $V$.`,
      steps: [
        { ask: R`Slant edge $AB$ in terms of $x$:`, type: 'expr', answer: 'x*sqrt2', hint: R`Pythagoras with $x$ and $x$.`, explain: R`$AB = x\sqrt2$` },
        { ask: R`Area condition $2x^2 + 2\sqrt2xy + 2xy = 600$. Volume $V = x^2 y$. So $V = kx(300 - x^2)$ with $k = $ ? (exact)`, answer: 'sqrt2-1', exact: true, marks: 5, hint: R`$y = \dfrac{300 - x^2}{x(\sqrt2 + 1)}$, and $\dfrac1{\sqrt2+1} = \sqrt2 - 1$.`, explain: R`$k = \sqrt2 - 1$ ($a = 2$, $b = -1$)` },
        { ask: R`(b) $x$ for maximum volume:`, answer: 10, marks: 4, hint: R`$\dfrac{dV}{dx} = k(300 - 3x^2) = 0$`, explain: R`$x = 10$ (and $\frac{d^2V}{dx^2} = -6kx < 0$)` },
        { ask: '(c) Maximum volume (nearest cm³):', answer: 828, tol: 0.5, hint: R`$(\sqrt2 - 1) \times 10 \times 200$`, explain: R`$828$ cm³` },
        { ask: R`(d) $x$ must be less than (exact):`, answer: 'sqrt300', exact: true, marks: 2, hint: R`$y > 0$ needs $300 - x^2 > 0$.`, explain: R`$x < \sqrt{300} \approx 17.3$` },
      ] },
    { id: 'm20-8', num: '8', topic: 'forces', marks: 3,
      prompt: R`A particle is in equilibrium under $(2p\mathbf i - 4\mathbf j)$, $(-3q\mathbf i + 5p\mathbf j)$ and $(-13\mathbf i - 6\mathbf j)$ N. Find $p$ and $q$.`,
      steps: [{ ask: R`Give $p, q$.`, type: 'tuple', answer: [2, -3], marks: 3, hint: R`$\mathbf j$: $-4 + 5p - 6 = 0$. Then $\mathbf i$: $2p - 3q - 13 = 0$.`, explain: R`$p = 2$, $q = -3$` }] },
    { id: 'm20-9', num: '9', topic: 'forces', marks: 6,
      prompt: R`A crane lifts a crate (55 kg) containing a car (830 kg). The cable can take 9500 N. $g = 9.8$.`,
      steps: [
        { ask: '(a) Maximum acceleration (3 s.f.):', answer: '827/885', sf: 3, marks: 2, hint: R`$9500 - 885g = 885a$`, explain: R`$a = 0.934$ m s⁻²` },
        { ask: '(b) Forces on the crate:', type: 'choice', choices: ['Tension up; its weight 55g down; the car\'s reaction R down.', 'Tension up and weight down only.', 'Weight 885g down only.', 'Tension down, weight up.'], answer: 0, hint: 'The car presses on the crate floor.', explain: 'T up, 55g down, R (from the car) down.' },
        { ask: '(c) Reaction between crate and car (3 s.f.):', answer: 8909.6, sf: 3, marks: 3, hint: R`For the car: $R - 830g = 830a$`, explain: R`$R = 830(9.8 + 0.934) = 8910$ N` },
      ] },
    { id: 'm20-10', num: '10', topic: 'kinematics', marks: 6,
      prompt: R`$v = (2t + 1)(3 - t)$. (a) Deceleration at $t = 4$. (b) When at rest. (c) Total distance from $t = 0$ to $t = 4$.` + Graph.svg({ w: 260, h: 160, x: [0, 4.5], y: [-6, 7], xstep: 1, ystep: 2, fns: [{ f: '(2x+1)(3-x)' }], labels: { x: 't', y: 'v' } }),
      steps: [
        { ask: '(a) Deceleration at t = 4:', answer: 11, marks: 2, hint: R`$a = 5 - 4t$`, explain: R`$a = -11$: deceleration 11 m s⁻²` },
        { ask: '(b) t when instantaneously at rest:', answer: 3, hint: R`Positive root of $v = 0$.`, explain: R`$t = 3$` },
        { ask: '(c) Total distance (exact):', answer: '53/3', exact: true, marks: 3, hint: R`$\int_0^3 v\,dt + \left|\int_3^4 v\,dt\right|$`, explain: R`$13.5 + 4.1\dot6 = \tfrac{53}{3}$ m` },
      ] },
    { id: 'm20-11', num: '11', topic: 'kinematics', marks: 10,
      prompt: R`A car starts from rest at traffic lights with acceleration 4 m s⁻². A motorcycle at a constant 16 m s⁻¹ passes the lights 1.5 s later.`,
      steps: [
        { ask: '(a) Car: s = 2t². Motorcycle: s = ? (in t)', type: 'expr', vars: ['t'], answer: '16(t-1.5)', marks: 2, hint: 'It starts 1.5 s late.', explain: R`$16(t - 1.5)$` },
        { ask: 'Times when they are level:', type: 'set', answer: [2, 6], marks: 4, hint: R`$2t^2 = 16t - 24 \Rightarrow t^2 - 8t + 12 = 0$`, explain: R`$t = 2, 6$` },
        { ask: '(b) Between those times:', type: 'choice', choices: ['The motorcycle is ahead of the car.', 'The car is ahead.', 'They are level.', 'They are at the lights.'], answer: 0, hint: 'Try t = 4.', explain: 'The motorcycle is in front.' },
        { ask: '(c) Maximum distance between them (m):', answer: 8, marks: 3, hint: R`$d = 16t - 24 - 2t^2$; maximise.`, explain: R`$t = 4$: $d = 8$ m` },
      ] },
  ];

  // ───────────────────────── October 2021 ─────────────────────────
  const m21 = [
    { id: 'm21-1', num: '1', topic: 'quadratics', marks: 2, prompt: R`$(x-2)$ is a factor of $2x^3 + kx - 4$. Find $k$.`,
      steps: [{ ask: R`$k = $ ?`, answer: -6, marks: 2, hint: R`$16 + 2k - 4 = 0$`, explain: R`$k = -6$` }] },
    { id: 'm21-2', num: '2', topic: 'graphs', marks: 3,
      prompt: R`Region $R$ is bounded by $y = -2x + 4$, $y = x^2 - 4$ and the $y$-axis (the unshaded region between them for $x \ge 0$).` + Graph.svg({ w: 220, h: 200, x: [-3, 3], y: [-5, 6], fns: [{ f: '-2x+4' }, { f: 'x^2-4' }] }),
      steps: [{ ask: 'The inequalities defining R:', type: 'choice', marks: 3, choices: [R`$x \ge 0$, $y \le -2x + 4$, $y \ge x^2 - 4$`, R`$x \le 0$, $y \ge -2x + 4$, $y \le x^2 - 4$`, R`$y \le -2x + 4$, $y \le x^2 - 4$`, R`$x \ge 0$, $y \ge -2x + 4$`], answer: 0, hint: 'Below the line, above the parabola, right of the y-axis.', explain: R`$x \ge 0$, $y \le 4 - 2x$, $y \ge x^2 - 4$` }] },
    { id: 'm21-3', num: '3', topic: 'graphs', marks: 5,
      prompt: R`Sam's shares: £2375 after 6 months, £2825 after 12 months. Original investment £1900.`,
      steps: [
        { ask: R`(a) Straight-line model: $V = $ ? (in $t$ months)`, type: 'expr', vars: ['t'], answer: '75t+1925', marks: 3, hint: R`Gradient $\tfrac{2825 - 2375}{6}$`, explain: R`$V = 75t + 1925$` },
        { ask: '(b) Does £1900 support the model?', type: 'choice', marks: 2, choices: ['Yes, roughly: the model predicts £1925 at t = 0, close to £1900.', 'No: they are exactly equal.', 'No: shares never grow linearly.', 'Yes: 1900 = 1925.'], answer: 0, hint: 'Put t = 0.', explain: 'Model gives £1925 at t = 0 — close to £1900, so reasonably supported.' },
      ] },
    { id: 'm21-4', num: '4', topic: 'diff', marks: 5, prompt: R`$f(x) = 2x^2 - 3$. Use differentiation from first principles to find $f'(2)$.`,
      steps: [
        { ask: R`$f(2 + h) = $ ? (in h)`, type: 'expr', vars: ['h'], answer: '2(2+h)^2-3', marks: 2, hint: 'Expand.', explain: R`$5 + 8h + 2h^2$` },
        { ask: R`$\dfrac{f(2+h) - f(2)}{h} = $ ?`, type: 'expr', vars: ['h'], answer: '8+2h', marks: 2, hint: R`$f(2) = 5$`, explain: R`$8 + 2h$` },
        { ask: R`$f'(2) = $ ?`, answer: 8, hint: R`$h \to 0$`, explain: R`$f'(2) = 8$` },
      ] },
    { id: 'm21-5', num: '5', topic: 'trig', marks: 9, dr: true,
      prompt: R`(a) Show $2\cos x\tan^2 x = 3(1 + \cos x)$ can be written $5\cos^2 x + 3\cos x - 2 = 0$. (b) Solve $2\cos3\theta\tan^23\theta = 3(1 + \cos3\theta)$ for $0° < \theta < 120°$.`,
      steps: [
        { ask: R`(a) Which line is right?`, type: 'choice', marks: 3, choices: [R`$\dfrac{2\sin^2 x}{\cos x} = 3 + 3\cos x \Rightarrow 2 - 2\cos^2 x = 3\cos x + 3\cos^2 x$`, R`$2\cos x\sin^2 x = 3$`, R`$2\tan^2 x = 3$`, R`$\cos x = 3$`], answer: 0, hint: R`$\tan^2 x = \dfrac{\sin^2 x}{\cos^2 x}$`, explain: R`$\Rightarrow 5\cos^2 x + 3\cos x - 2 = 0$ ∎` },
        { ask: R`(b) Values of $\cos3\theta$:`, type: 'set', answer: [0.4, -1], marks: 2, hint: R`$(5c - 2)(c + 1)$`, explain: R`$\cos3\theta = 0.4$ or $-1$` },
        { ask: R`All $\theta$ (1 d.p. where needed):`, type: 'set', answer: [22.1406, 60, 97.8594], dp: 1, marks: 4, hint: R`$0 < 3\theta < 360°$: $3\theta = 66.4°, 293.6°, 180°$.`, explain: R`$\theta = 22.1°, 60°, 97.9°$` },
      ] },
    { id: 'm21-6', num: '6', topic: 'integ', marks: 6,
      prompt: R`$\dfrac{d^2y}{dx^2} = 3x^2 + 2$. The gradient function crosses the $x$-axis at $-1$ and the $y$-axis at 3. $C$ passes through $\left(-1, \tfrac14\right)$.`,
      steps: [
        { ask: '(a) Nature of the single stationary point:', type: 'choice', choices: [R`Minimum, since $\dfrac{d^2y}{dx^2} = 3x^2 + 2 > 0$ always`, 'Maximum', 'Point of inflection', 'Cannot tell'], answer: 0, hint: R`Sign of $3x^2 + 2$?`, explain: 'Always positive ⇒ minimum.' },
        { ask: R`(b) $\dfrac{dy}{dx} = $ ?`, type: 'expr', answer: 'x^3+2x+3', marks: 2, hint: R`Integrate; the graph gives $\dfrac{dy}{dx} = 3$ at $x = 0$.`, explain: R`$x^3 + 2x + 3$` },
        { ask: R`$y = $ ?`, type: 'expr', answer: 'x^4/4+x^2+3x+2', marks: 3, hint: R`Integrate again; use $\left(-1, \tfrac14\right)$.`, explain: R`$y = \tfrac{x^4}{4} + x^2 + 3x + 2$` },
      ] },
    { id: 'm21-7', num: '7', topic: 'coord', marks: 9,
      prompt: R`Circle $x^2 + y^2 - 6x + 9y + 19 = 0$, centre $C$. The tangent at $D$ meets the axes at $A\left(\tfrac{55}{4}, 0\right)$ and $B(0, -11)$.`,
      steps: [
        { ask: '(a) Centre C:', type: 'point', answer: [3, -4.5], hint: 'Complete the square.', explain: R`$(3, -4.5)$` },
        { ask: 'Exact radius:', answer: 'sqrt41/2', exact: true, marks: 2, hint: R`$r^2 = 9 + 20.25 - 19$`, explain: R`$r = \tfrac{\sqrt{41}}{2}$` },
        { ask: '(b) Gradient of the tangent AB:', answer: 0.8, hint: R`$\dfrac{0 - (-11)}{\tfrac{55}{4} - 0}$`, explain: R`$\tfrac45$` },
        { ask: R`$D$ (where the radius $CD$, gradient $-\tfrac54$, meets $AB$):`, type: 'point', answer: [5, -7], marks: 3, hint: R`$y = 0.8x - 11$ and $y + 4.5 = -1.25(x - 3)$.`, explain: R`$D(5, -7)$` },
        { ask: 'Area of triangle OBD:', answer: 27.5, marks: 2, hint: R`Base $OB = 11$ on the $y$-axis; height = $x$-coordinate of $D$.`, explain: R`$\tfrac12 \times 11 \times 5 = 27.5$` },
      ] },
    { id: 'm21-8', num: '8', topic: 'integ', marks: 11, dr: true,
      prompt: R`Curve $y = 1 - x + \dfrac{6}{\sqrt x}$; line $l$ is the normal at $(1, 6)$. Find $l$, verify the curve crosses the $x$-axis at $x = 4$, and find the exact area between $l$, the curve, and the axes.`,
      steps: [
        { ask: R`$\dfrac{dy}{dx}$ at $x = 1$:`, answer: -4, marks: 2, hint: R`$-1 - 3x^{-\frac32}$`, explain: R`$-4$` },
        { ask: R`(a) Normal $l$ as $ax + by = c$ (give $a, b, c$ with $a = 1$):`, type: 'tuple', answer: [1, -4, -23], marks: 3, hint: R`Gradient $\tfrac14$: $y - 6 = \tfrac14(x - 1)$`, explain: R`$x - 4y = -23$` },
        { ask: R`(b) $y$ at $x = 4$:`, answer: 0, hint: R`$1 - 4 + 3$`, explain: R`$0$ ✓` },
        { ask: R`(c) Area under $l$ from 0 to 1 (exact):`, answer: '47/8', exact: true, marks: 2, hint: R`Trapezium with heights $\tfrac{23}{4}$ and $6$.`, explain: R`$\tfrac{47}{8}$` },
        { ask: R`$\int_1^4 \left(1 - x + 6x^{-\frac12}\right)dx$ (exact):`, answer: 7.5, marks: 2, hint: R`$\left[x - \tfrac{x^2}{2} + 12\sqrt x\right]_1^4$`, explain: R`$20 - 12.5 = 7.5$` },
        { ask: 'Total area (exact):', answer: '107/8', exact: true, hint: 'Add.', explain: R`$\tfrac{47}{8} + \tfrac{60}{8} = \tfrac{107}{8}$` },
      ] },
    { id: 'm21-9', num: '9', topic: 'forces', marks: 3,
      prompt: R`A body at rest: up $3F_2$ and 30 N; down $F_1$; left 60 N and 28 N; right $2F_1$ and $F_2$. Find $F_1$ and $F_2$.`,
      steps: [{ ask: R`Give $F_1, F_2$.`, type: 'tuple', answer: [42, 4], marks: 3, hint: R`$F_1 = 3F_2 + 30$ and $2F_1 + F_2 = 88$.`, explain: R`$7F_2 = 28$: $F_2 = 4$, $F_1 = 42$` }] },
    { id: 'm21-10', num: '10', topic: 'kinematics', marks: 8,
      prompt: R`A cyclist: rest to 6 m s⁻¹ in 25 s; then accelerates at 0.05 m s⁻² to 10 m s⁻¹; then decelerates uniformly to rest. Total time 150 s.`,
      steps: [
        { ask: '(a) The velocity–time graph is:', type: 'choice', marks: 2, choices: [Graph.svg({ w: 150, h: 90, x: [0, 155], y: [0, 11], plain: true, ticks: false, segments: [{ a: [0, 0], b: [25, 6] }, { a: [25, 6], b: [105, 10] }, { a: [105, 10], b: [150, 0] }] }), Graph.svg({ w: 150, h: 90, x: [0, 155], y: [0, 11], plain: true, ticks: false, segments: [{ a: [0, 0], b: [25, 10] }, { a: [25, 10], b: [105, 6] }, { a: [105, 6], b: [150, 0] }] }), Graph.svg({ w: 150, h: 90, x: [0, 155], y: [0, 11], plain: true, ticks: false, segments: [{ a: [0, 0], b: [75, 10] }, { a: [75, 10], b: [150, 0] }] })], answer: 0, hint: 'Steep, gentle, then down.', explain: '0→6 over 25 s, 6→10 over 80 s, then 10→0.' },
        { ask: '(b) Acceleration for the first 25 s:', answer: 0.24, hint: R`$6 \div 25$`, explain: R`$0.24$ m s⁻²` },
        { ask: R`(c) $T$:`, answer: 45, marks: 2, hint: R`Middle stage: $\tfrac{10 - 6}{0.05} = 80$ s.`, explain: R`$150 - 25 - 80 = 45$` },
        { ask: '(d) Average speed (3 s.f.):', answer: '940/150', sf: 3, marks: 3, hint: 'Total distance = area: 75 + 640 + 225.', explain: R`$\tfrac{940}{150} = 6.27$ m s⁻¹` },
      ] },
    { id: 'm21-11', num: '11', topic: 'forces', marks: 7,
      prompt: R`A train: engine $A$ (50 000 kg, resistance 9000 N) pulls carriage $B$ (20 000 kg, resistance 1250 N). It passes $P$ at 15 m s⁻¹ and accelerates at 0.01 m s⁻² for 12.95 km to $Q$.`,
      steps: [
        { ask: '(a) Time from P to Q in minutes (3 s.f.):', answer: '700/60', sf: 3, marks: 3, hint: R`$12950 = 15t + 0.005t^2$`, explain: R`$t = 700$ s $= 11.7$ minutes` },
        { ask: '(b) Driving force (N):', answer: 10950, marks: 2, hint: R`$D - 10250 = 70000 \times 0.01$`, explain: R`$D = 10950$ N` },
        { ask: '(c) Tension in the coupling (N):', answer: 1450, marks: 2, hint: R`For $B$: $T - 1250 = 20000 \times 0.01$`, explain: R`$T = 1450$ N` },
      ] },
    { id: 'm21-12', num: '12', topic: 'kinematics', marks: 7,
      prompt: R`$v = -3t^2 + 24t + k$ ($k > 0$). Maximum velocity at $t = T$. The distance from $t = 1$ to $t = T$ is 297 m. When is $P$ at rest?`,
      steps: [
        { ask: R`$T = $ ?`, answer: 4, hint: R`$\dfrac{dv}{dt} = -6t + 24 = 0$`, explain: R`$T = 4$` },
        { ask: R`$\int_1^4 v\,dt = 117 + 3k = 297$. Find $k$.`, answer: 60, marks: 3, hint: R`$[-t^3 + 12t^2 + kt]_1^4$`, explain: R`$k = 60$` },
        { ask: 'Time at rest:', answer: 10, marks: 3, hint: R`$-3t^2 + 24t + 60 = 0 \Rightarrow t^2 - 8t - 20 = 0$`, explain: R`$t = 10$ s` },
      ] },
  ];

  // ───────────────────────── June 2022 ─────────────────────────
  const m22 = [
    { id: 'm22-1', num: '1', topic: 'graphs', marks: 2, prompt: R`Solve $(x - 2)(x + 3) > 0$ in set notation.`,
      steps: [{ ask: 'Solution:', type: 'choice', marks: 2, choices: [R`$\{x : x < -3\} \cup \{x : x > 2\}$`, R`$\{x : -3 < x < 2\}$`, R`$\{x : x > 2\}$`, R`$\{x : x < -3\} \cap \{x : x > 2\}$`], answer: 0, hint: 'U-shape: positive outside the roots.', explain: R`$\{x : x < -3\} \cup \{x : x > 2\}$` }] },
    { id: 'm22-2', num: '2', topic: 'quadratics', marks: 4, dr: true, prompt: R`Solve $3x + 1 = 4\sqrt x$.`,
      steps: [
        { ask: R`Let $u = \sqrt x$. Solve $3u^2 - 4u + 1 = 0$.`, type: 'set', answer: [1, '1/3'], marks: 2, hint: R`$(3u - 1)(u - 1)$`, explain: R`$u = 1$ or $\tfrac13$` },
        { ask: R`Values of $x$:`, type: 'set', answer: [1, '1/9'], marks: 2, hint: R`$x = u^2$`, explain: R`$x = 1$ or $\tfrac19$` },
      ] },
    { id: 'm22-3', num: '3', topic: 'proof', marks: 2, prompt: R`Disprove: if $x$ and $y$ are both irrational then $x + y$ is irrational.`,
      steps: [{ ask: 'A counter-example:', type: 'choice', marks: 2, choices: [R`$x = \sqrt2$, $y = -\sqrt2$: $x + y = 0$, rational`, R`$x = \sqrt2$, $y = \sqrt2$: $2\sqrt2$`, R`$x = 1$, $y = 2$`, R`$x = \pi$, $y = \sqrt2$`], answer: 0, hint: 'Make the irrational parts cancel.', explain: R`$\sqrt2 + (-\sqrt2) = 0$, which is rational.` }] },
    { id: 'm22-4', num: '4', topic: 'coord', marks: 3, prompt: R`The circle $x^2 + y^2 - 6x + 4y + k = 0$ has radius 5. Find $k$.`,
      steps: [{ ask: R`$k = $ ?`, answer: -12, marks: 3, hint: R`$(x-3)^2 + (y+2)^2 = 13 - k$`, explain: R`$13 - k = 25 \Rightarrow k = -12$` }] },
    { id: 'm22-5', num: '5', topic: 'diff', marks: 7,
      prompt: R`$y$ is inversely proportional to $x$, and the curve passes through $\left(1, -\tfrac12\right)$.`,
      steps: [
        { ask: R`The curve is $y = $ ?`, type: 'expr', answer: '-1/(2x)', hint: R`$y = \tfrac kx$`, explain: R`$y = -\dfrac{1}{2x}$` },
        { ask: R`(a)(i) Gradient function $\dfrac{dy}{dx} = $ ?`, type: 'expr', answer: '1/(2x^2)', marks: 2, hint: R`$-\tfrac12x^{-1} \to \tfrac12x^{-2}$`, explain: R`$\dfrac{1}{2x^2}$` },
        { ask: '(ii) Its sketch:', type: 'choice', choices: [sk('1/(2x^2)', [-3, 3], [-1, 4]), sk('-1/(2x^2)', [-3, 3], [-4, 1]), sk('1/(2x)', [-3, 3], [-3, 3])], answer: 0, hint: 'Always positive, symmetric.', explain: R`Positive everywhere, asymptotes $x = 0$, $y = 0$.` },
        { ask: '(b) The feature showing no stationary points:', type: 'choice', choices: ['The gradient graph never meets the x-axis (dy/dx is never 0).', 'It is symmetric.', 'It has an asymptote at x = 0.', 'It is positive at x = 1.'], answer: 0, hint: 'Stationary means dy/dx = 0.', explain: R`$\dfrac{dy}{dx}$ is never zero.` },
        { ask: R`(c) Translated by $\begin{pmatrix}-2\\0\end{pmatrix}$: $y = $ ?`, type: 'expr', answer: '-1/(2(x+2))', marks: 2, hint: R`Replace $x$ with $x + 2$.`, explain: R`$y = -\dfrac{1}{2(x+2)}$` },
      ] },
    { id: 'm22-6', num: '6', topic: 'explog', marks: 12,
      prompt: R`A sail $ABC$: curve $AC$ is $y = 2\log_2 x$; curve $BC$ is $y = \log_2\left(x - \tfrac32\right) + 3$. The true area is $0.656$.` + Graph.svg({ w: 260, h: 170, x: [0, 2.5], y: [-0.5, 2.5], xstep: 0.5, ystep: 0.5, fns: [{ f: '2log(x)/log(2)', domain: [1, 2] }, { f: 'log(x-1.5)/log(2)+3', domain: [1.625, 2] }] }),
      steps: [
        { ask: '(a) x-coordinate of A:', answer: 1, hint: R`$2\log_2 x = 0$`, explain: R`$x = 1$` },
        { ask: '(b) x-coordinate of B:', answer: '13/8', marks: 3, hint: R`$\log_2\left(x - \tfrac32\right) = -3$`, explain: R`$x - \tfrac32 = \tfrac18 \Rightarrow x = \tfrac{13}{8}$` },
        { ask: R`(c) $2\log_2 x = \log_2\left(x - \tfrac32\right) + 3 \Rightarrow x^2 = 8\left(x - \tfrac32\right)$. Roots:`, type: 'set', answer: [2, 6], marks: 4, hint: R`$x^2 - 8x + 12 = 0$`, explain: R`$x = 2$ or $6$; from the diagram $C$ is at $x = 2$ (so $y = 2$).` },
        { ask: '(d) Area of the triangle with straight edges A(1,0), B(13/8,0), C(2,2):', answer: 0.625, marks: 2, hint: R`$\tfrac12 \times \tfrac58 \times 2$`, explain: R`$\tfrac58 = 0.625$` },
        { ask: 'Over- or under-estimate, and by how much?', type: 'choice', marks: 2, choices: ['Under-estimate by 0.031 units²', 'Over-estimate by 0.031 units²', 'Under-estimate by 0.656', 'Exactly right'], answer: 0, hint: '0.656 vs 0.625.', explain: 'Under-estimate by 0.031 units².' },
      ] },
    { id: 'm22-7', num: '7', topic: 'vectors', marks: 9,
      prompt: R`Parallelogram $OACB$ with $\overrightarrow{OA} = 2\mathbf i + 4\mathbf j$, $\overrightarrow{OB} = 4\mathbf i - 3\mathbf j$.`,
      steps: [
        { ask: R`$|\overrightarrow{AB}|^2$ ($\overrightarrow{AB} = 2\mathbf i - 7\mathbf j$):`, answer: 53, hint: R`$4 + 49$`, explain: R`$53$` },
        { ask: R`(a) Cosine rule: $\cos AOB$ (exact):`, answer: '-2sqrt5/25', exact: true, marks: 4, hint: R`$\dfrac{20 + 25 - 53}{2\sqrt{20}\cdot5}$`, explain: R`$\dfrac{-8}{20\sqrt5} = -\dfrac{2\sqrt5}{25}$ ∎` },
        { ask: R`(b) $\sin AOB$ (exact):`, answer: '11sqrt5/25', exact: true, marks: 2, hint: R`$\sin^2 = 1 - \tfrac{20}{625}$`, explain: R`$\dfrac{11\sqrt5}{25}$` },
        { ask: '(c) Area of OACB:', answer: 22, marks: 2, hint: R`$|OA||OB|\sin AOB$`, explain: R`$2\sqrt5 \times 5 \times \tfrac{11\sqrt5}{25} = 22$` },
      ] },
    { id: 'm22-8', num: '8', topic: 'diff', marks: 11,
      prompt: R`(a) $f(x) = ax^2 + bx$: find $f'(x)$ from first principles. (b) The area under $y = ax^2 + bx$ from $x = 1$ to $4$ is 9, and the tangent at $x = 4$ has gradient $-\tfrac34$ and meets the $x$-axis at $(k, 0)$. Find $k$.`,
      steps: [
        { ask: R`(a) Simplify $\dfrac{f(x+h) - f(x)}{h}$:`, type: 'expr', vars: ['x', 'h', 'a', 'b'], answer: '2a*x+a*h+b', marks: 2, hint: R`$a(2xh + h^2) + bh$, divided by $h$.`, explain: R`$2ax + ah + b$` },
        { ask: R`$f'(x) = $ ?`, type: 'expr', vars: ['x', 'a', 'b'], answer: '2a*x+b', marks: 2, hint: R`$h \to 0$`, explain: R`$2ax + b$` },
        { ask: R`(b) Area: $21a + 7.5b = 9$. Gradient: $8a + b = -\tfrac34$. Give $a, b$.`, type: 'tuple', answer: [-0.375, 2.25], marks: 3, hint: 'Solve simultaneously.', explain: R`$a = -\tfrac38$, $b = \tfrac94$` },
        { ask: R`$y$ at $x = 4$:`, answer: 3, hint: R`$-6 + 9$`, explain: R`$(4, 3)$` },
        { ask: R`$k$:`, answer: 8, marks: 3, hint: R`$0 - 3 = -\tfrac34(k - 4)$`, explain: R`$k = 8$` },
      ] },
    { id: 'm22-9', num: '9', topic: 'forces', marks: 2, prompt: R`Forces $(3\mathbf i + 2\mathbf j)$ N and $\mathbf F$ act on a 4 kg particle with acceleration $(-2\mathbf i + 3\mathbf j)$ m s⁻². Find $\mathbf F$.`,
      steps: [{ ask: R`$\mathbf F$:`, type: 'vector', answer: [-11, 10], marks: 2, hint: R`$4(-2\mathbf i + 3\mathbf j) - (3\mathbf i + 2\mathbf j)$`, explain: R`$-11\mathbf i + 10\mathbf j$` }] },
    { id: 'm22-10', num: '10', topic: 'kinematics', marks: 3, prompt: R`A ball is projected up at 3.5 m s⁻¹ from 2 m above the ground. Find the time to reach the ground.`,
      steps: [{ ask: R`$t$ (3 s.f.):`, answer: 1.08907, sf: 3, marks: 3, hint: R`$-2 = 3.5t - 4.9t^2$`, explain: R`$t = 1.09$ s` }] },
    { id: 'm22-11', num: '11', topic: 'kinematics', marks: 9, dr: true,
      prompt: R`$v = t(t - 3)(8 - t)$; maximum velocity at $t = T$.` + Graph.svg({ w: 260, h: 160, x: [0, 7], y: [-12, 40], xstep: 1, ystep: 10, fns: [{ f: 'x(x-3)(8-x)' }], labels: { x: 't', y: 'v' } }),
      steps: [
        { ask: '(a) Acceleration at T:', answer: 0, hint: 'Maximum of v.', explain: '0' },
        { ask: R`(b) $\dfrac{dv}{dt} = $ ?`, type: 'expr', vars: ['t'], answer: '-3t^2+22t-24', marks: 2, hint: R`$v = -t^3 + 11t^2 - 24t$`, explain: R`$-3t^2 + 22t - 24$` },
        { ask: R`$T$:`, answer: 6, marks: 3, hint: R`$3t^2 - 22t + 24 = 0$: roots $\tfrac43$ and $6$ — which is the maximum?`, explain: R`$T = 6$ ($t = \tfrac43$ is the minimum)` },
        { ask: R`(c) Total distance from $0$ to $T$:`, answer: 94.5, marks: 3, hint: R`$\left|\int_0^3 v\,dt\right| + \int_3^6 v\,dt$`, explain: R`$29.25 + 65.25 = 94.5$ m` },
      ] },
    { id: 'm22-12', num: '12', topic: 'forces', marks: 11,
      prompt: R`$P$ (4 kg) hangs 1.75 m above a plane; $Q$ (6 kg) rests on the plane; string over a smooth pulley. Then $P$'s mass is doubled and the system released.` + pulley({ y: 80, label: 'P' }, { y: 120, label: 'Q' }),
      steps: [
        { ask: '(a) Normal reaction on Q in equilibrium (N):', answer: 19.6, hint: R`$6g - 4g$`, explain: R`$2g = 19.6$ N` },
        { ask: R`(b) With $P = 8$ kg: acceleration?`, answer: 1.4, marks: 2, hint: R`$(8 - 6)g = 14a$`, explain: R`$a = 1.4$ m s⁻²` },
        { ask: 'Force on the pulley (N):', answer: 134.4, marks: 3, hint: R`$T = 6(g + a)$; the pulley feels $2T$.`, explain: R`$T = 67.2$ N, force $= 134.4$ N` },
        { ask: R`(c) Total distance $Q$ travels until momentarily at rest (m):`, answer: 2, marks: 4, hint: R`$Q$ rises 1.75 m reaching $v^2 = 2(1.4)(1.75)$, then rises a further $\tfrac{v^2}{2g}$.`, explain: R`$1.75 + 0.25 = 2$ m` },
        { ask: '(d) Why less in practice?', type: 'choice', choices: ['Air resistance (or friction at the pulley) — the model ignored them.', 'g is bigger.', 'The string stretches more.', 'The plane is smoother.'], answer: 0, hint: 'What resists motion that the model left out?', explain: 'Air resistance / pulley not smooth.' },
      ] },
  ];

  // ───────────────────────── June 2023 ─────────────────────────
  const m23 = [
    { id: 'm23-1', num: '1', topic: 'quadratics', marks: 3, prompt: R`$kx^2 + 3x + k = 0$ has no real roots. Find the set of possible values of $k$.`,
      steps: [
        { ask: 'Discriminant condition:', type: 'choice', choices: [R`$9 - 4k^2 < 0$`, R`$9 - 4k^2 > 0$`, R`$9 - 4k = 0$`, R`$3 - 4k^2 < 0$`], answer: 0, hint: R`$b^2 - 4ac < 0$`, explain: R`$9 - 4k^2 < 0$` },
        { ask: R`So:`, type: 'choice', marks: 2, choices: [R`$\{k : k < -\tfrac32\} \cup \{k : k > \tfrac32\}$`, R`$-\tfrac32 < k < \tfrac32$`, R`$k > \tfrac32$`, R`$k > \tfrac94$`], answer: 0, hint: R`$k^2 > \tfrac94$`, explain: R`$k < -\tfrac32$ or $k > \tfrac32$` },
      ] },
    { id: 'm23-2', num: '2', topic: 'indices', marks: 4, dr: true, prompt: R`Solve $x\sqrt5 + 32 = x\sqrt{45} + 2x$, giving $x = a\sqrt5 + b$.`,
      steps: [
        { ask: R`$\sqrt{45} = $ ? (as $k\sqrt5$, give $k$)`, answer: 3, hint: R`$\sqrt{9 \times 5}$`, explain: R`$3\sqrt5$` },
        { ask: R`Rearranged: $32 = x(2\sqrt5 + 2)$. So $x = $ ?`, exact: true, answer: '4sqrt5-4', marks: 3, hint: R`$x = \dfrac{16}{\sqrt5 + 1}$; rationalise.`, explain: R`$x = \dfrac{16(\sqrt5 - 1)}{4} = 4\sqrt5 - 4$` },
      ] },
    { id: 'm23-3', num: '3', topic: 'trig', marks: 8,
      prompt: R`A Ferris wheel seat: $h = 15 - 14\cos(kt)°$ metres, $t$ seconds after the lowest point.` + Graph.svg({ w: 280, h: 160, x: [0, 160], y: [0, 30], xstep: 30, ystep: 5, fns: [{ f: '15-14cos(2.4x*pi/180)' }], hlines: [{ y: 20, label: '20 m' }], labels: { x: 't', y: 'h' } }),
      steps: [
        { ask: '(a)(i) Greatest height:', answer: 29, hint: R`$\cos = -1$`, explain: '29 m' },
        { ask: '(ii) Least height:', answer: 1, hint: R`$\cos = 1$`, explain: '1 m' },
        { ask: R`(b) One revolution takes 150 s. $k = $ ?`, answer: 2.4, marks: 2, hint: R`$150k = 360$`, explain: R`$k = 2.4$` },
        { ask: '(c) Time at 20 m or more (nearest 0.1 s):', answer: 57.5626, dp: 1, marks: 4, hint: R`$\cos(2.4t) \le -\tfrac5{14}$: $2.4t$ between $110.9°$ and $249.1°$.`, explain: R`$t$ from $46.2$ to $103.8$: $57.6$ s` },
      ] },
    { id: 'm23-4', num: '4', topic: 'binomial', marks: 6,
      prompt: R`(a) First three terms of $\left(2 + \tfrac13kx\right)^6$. (b) In $(3 - 4x)\left(2 + \tfrac13kx\right)^6$ the constant term equals the coefficient of $x^2$. Find $k > 0$ exactly.`,
      steps: [
        { ask: '(a) First three terms:', type: 'expr', vars: ['x', 'k'], answer: '64+64k*x+(80/3)k^2x^2', marks: 3, hint: R`$2^6$, $6 \cdot 2^5 \cdot \tfrac13kx$, $15 \cdot 2^4 \cdot \tfrac19k^2x^2$`, explain: R`$64 + 64kx + \tfrac{80}{3}k^2x^2$` },
        { ask: R`(b) Equation for $k$: $192 = 80k^2 - 256k$. $k$ exactly:`, answer: '(8+2sqrt31)/5', exact: true, marks: 3, hint: R`$5k^2 - 16k - 12 = 0$`, explain: R`$k = \dfrac{8 + 2\sqrt{31}}{5}$` },
      ] },
    { id: 'm23-5', num: '5', topic: 'explog', marks: 5,
      prompt: R`$y = 2^{3x}$ is mapped to $y = 2^{3x+2}$ by a stretch. $A$ on $y = 2^{3x}$ and $B$ on $y = 2^{3x+2}$ have the same $x$-coordinate and $y$-coordinates differing by 36.`,
      steps: [
        { ask: '(a) The stretch:', type: 'choice', marks: 2, choices: ['Parallel to the y-axis, scale factor 4', 'Parallel to the x-axis, scale factor 4', 'Parallel to the y-axis, scale factor 2', 'Parallel to the x-axis, scale factor ⅔'], answer: 0, hint: R`$2^{3x+2} = 4 \times 2^{3x}$`, explain: 'Stretch parallel to the y-axis, s.f. 4.' },
        { ask: R`(b) $4 \cdot 2^{3x} - 2^{3x} = 36 \Rightarrow 2^{3x} = $ ?`, answer: 12, hint: R`$3 \cdot 2^{3x} = 36$`, explain: R`$2^{3x} = 12$` },
        { ask: R`$x = m\log_2 n$: value of $x$ (exact):`, answer: 'ln12/(3ln2)', exact: true, marks: 2, hint: R`$3x = \log_2 12$`, explain: R`$x = \tfrac13\log_2 12$` },
      ] },
    { id: 'm23-6', num: '6', topic: 'coord', marks: 10,
      prompt: R`Triangle $A(-3, 1)$, $B(5, 0)$, $C(9, 7)$.`,
      steps: [
        { ask: R`(a) $AB^2 = BC^2 = $ ?`, answer: 65, marks: 2, hint: R`$8^2 + 1^2$ and $4^2 + 7^2$`, explain: R`Both $65$, so $AB = BC$.` },
        { ask: '(b) Product of the gradients of AB and BC:', answer: '-7/32', marks: 2, hint: R`$-\tfrac18 \times \tfrac74$`, explain: R`$-\tfrac{7}{32} \ne -1$, so not a right angle.` },
        { ask: '(c) Midpoint of AC:', type: 'point', answer: [3, 4], hint: 'Average.', explain: R`$(3, 4)$` },
        { ask: R`(d) Line of symmetry $px + qy = r$ (give $p, q, r$ with $p = 2$):`, type: 'tuple', answer: [2, 1, 10], marks: 2, hint: R`Through $B(5, 0)$ and $(3, 4)$.`, explain: R`$2x + y = 10$` },
        { ask: R`(e) Circle centre $A$ through $B$: $(x+3)^2 + (y-1)^2 = $ ?`, answer: 65, marks: 2, hint: R`$r^2 = AB^2$`, explain: R`$(x+3)^2 + (y-1)^2 = 65$` },
        { ask: '(f) The second intersection with the line of symmetry:', type: 'point', answer: [1, 8], hint: R`Substitute $y = 10 - 2x$: $x^2 - 6x + 5 = 0$.`, explain: R`$(1, 8)$` },
      ] },
    { id: 'm23-7', num: '7', topic: 'diff', marks: 7,
      prompt: R`Curve $y = 4x^2 - 10x + 7$; $l_1$ is the normal at $\left(\tfrac12, 3\right)$; $l_2$ the normal at the minimum point.`,
      steps: [
        { ask: R`Gradient of the curve at $x = \tfrac12$:`, answer: -6, hint: R`$8x - 10$`, explain: R`$-6$` },
        { ask: R`(a) $l_1$: $ax + by + c = 0$ (give $a, b, c$ with $a = 2$):`, type: 'tuple', answer: [2, -12, 35], marks: 3, hint: R`Gradient $\tfrac16$: $y - 3 = \tfrac16\left(x - \tfrac12\right)$`, explain: R`$2x - 12y + 35 = 0$` },
        { ask: '(b) The shaded region:', type: 'choice', marks: 3, choices: [R`$x \ge \tfrac54$, $y \ge 4x^2 - 10x + 7$, $y \le \tfrac{2x + 35}{12}$`, R`$x \le \tfrac54$, $y \le 4x^2 - 10x + 7$`, R`$y \ge \tfrac{2x+35}{12}$`, R`$x \ge \tfrac12$ only`], answer: 0, hint: R`$l_2$ is the vertical line $x = \tfrac54$.`, explain: R`Right of $x = \tfrac54$, above the curve, below $l_1$.` },
      ] },
    { id: 'm23-8', num: '8', topic: 'integ', marks: 7, dr: true, prompt: R`Given $\displaystyle\int_4^a \left(\frac{4}{\sqrt x} + 3\right)dx = 7$, find $a$.`,
      steps: [
        { ask: 'Antiderivative:', type: 'antideriv', answer: '8sqrt(x)+3x', marks: 2, hint: R`$4x^{-\frac12} \to 8x^{\frac12}$`, explain: R`$8\sqrt x + 3x$` },
        { ask: R`Equation: $8\sqrt a + 3a - 28 = 7$. With $u = \sqrt a$:`, type: 'choice', marks: 2, choices: [R`$3u^2 + 8u - 35 = 0$`, R`$3u^2 + 8u - 7 = 0$`, R`$3u + 8u^2 = 35$`, R`$u^2 + 8u - 35 = 0$`], answer: 0, hint: 'Substitute and rearrange.', explain: R`$3u^2 + 8u - 35 = 0 = (3u - 7)(u + 5)$` },
        { ask: R`$a = $ ?`, answer: '49/9', marks: 3, hint: R`$u = \tfrac73$`, explain: R`$a = \tfrac{49}{9}$` },
      ] },
    { id: 'm23-9', num: '9', topic: 'kinematics', marks: 4,
      prompt: R`A cyclist accelerates from rest for 20 s to 15 m s⁻¹, cruises, then decelerates at 0.3 m s⁻² to rest. Total distance 1950 m.`,
      steps: [
        { ask: '(a) Deceleration time (s):', answer: 50, hint: R`$15 \div 0.3$`, explain: '50 s' },
        { ask: '(b) Velocity–time graph:', type: 'choice', choices: ['Up, flat, then down (a trapezium)', 'Up then down (a triangle)', 'A curve', 'Flat'], answer: 0, hint: 'Three stages.', explain: 'A trapezium shape.' },
        { ask: '(c) Time at constant velocity (s):', answer: 95, marks: 2, hint: R`$1950 - 150 - 375 = 15T$`, explain: R`$1425 \div 15 = 95$ s` },
      ] },
    { id: 'm23-10', num: '10', topic: 'kinematics', marks: 8,
      prompt: R`$a = 4t - 9$; $v = 2$ when $t = 1$.`,
      steps: [
        { ask: R`(a) $v = $ ?`, type: 'expr', vars: ['t'], answer: '2t^2-9t+9', marks: 3, hint: R`Integrate; use $v(1) = 2$.`, explain: R`$v = 2t^2 - 9t + 9$` },
        { ask: R`(b) $t_1, t_2$:`, type: 'set', answer: [1.5, 3], marks: 2, hint: R`$(2t - 3)(t - 3)$`, explain: R`$1.5$ and $3$` },
        { ask: R`(c) Total distance from 0 to $t_2$:`, answer: 6.75, marks: 3, hint: R`$\int_0^{1.5} v\,dt + \left|\int_{1.5}^3 v\,dt\right|$`, explain: R`$5.625 + 1.125 = 6.75$ m` },
      ] },
    { id: 'm23-11', num: '11', topic: 'forces', marks: 13,
      prompt: R`$P$ (0.6 kg) on a rough table, 2 m from a pulley; over it hang $Q$ (0.4 kg) and below that $R$ ($m$ kg). $P$ accelerates at 3.5 m s⁻² against friction 4.5 N. After 0.4 s the $Q$–$R$ string breaks.`,
      steps: [
        { ask: '(a) Tension between P and Q (N):', answer: 6.6, marks: 2, hint: R`$T - 4.5 = 0.6 \times 3.5$`, explain: R`$T = 6.6$ N` },
        { ask: R`(b) $m$ (3 s.f.):`, answer: '6.6/6.3-0.4', sf: 3, marks: 4, hint: R`For $Q + R$: $(0.4 + m)g - 6.6 = (0.4 + m)(3.5)$`, explain: R`$0.4 + m = \tfrac{6.6}{6.3}$, $m = 0.648$` },
        { ask: R`(c) After 0.4 s: distance moved and speed. Distance (m)?`, answer: 0.28, hint: R`$\tfrac12(3.5)(0.4)^2$`, explain: R`$0.28$ m, speed $1.4$ m s⁻¹` },
        { ask: R`New acceleration of $P$ and $Q$ (negative = slowing):`, answer: -0.58, marks: 2, hint: R`$0.4g - 4.5 = 1.0a$`, explain: R`$a = -0.58$ m s⁻²` },
        { ask: 'Total distance P moves (m, 3 s.f.):', answer: 1.96966, sf: 3, marks: 3, hint: R`$0.28 + \dfrac{1.4^2}{2 \times 0.58}$`, explain: R`$0.28 + 1.69 = 1.97 < 2$: it stops short of the pulley.` },
        { ask: '(d) Why might P reach the pulley in reality?', type: 'choice', choices: ['Friction may not be constant (or the pulley may not be smooth / the balls are not particles).', 'Gravity is stronger.', 'P is heavier.', 'The string broke later.'], answer: 0, hint: 'Which modelling assumption could be wrong?', explain: 'e.g. friction not constant / balls not particles / string not light.' },
      ] },
  ];

  const add = (id, title, qs) => {
    const p = { id, title, board: 'OCR AS Level Mathematics A', paper: 'Pure Mathematics and Mechanics', minutes: 90, questions: qs };
    window.PAPERS.push(p);
    qs.forEach(q => { q.source = title + ' Q' + q.num; q.steps.forEach(s => { s.type = s.type || 'num'; }); window.PAPER_Q[q.id] = q; });
  };
  add('m18', 'OCR H230/02 — June 2018', m18);
  add('m19', 'OCR H230/02 — June 2019', m19);
  add('m20', 'OCR H230/02 — November 2020', m20);
  add('m21', 'OCR H230/02 — October 2021', m21);
  add('m22', 'OCR H230/02 — June 2022', m22);
  add('m23', 'OCR H230/02 — June 2023', m23);
})();
