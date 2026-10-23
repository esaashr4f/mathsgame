// OCR AS Level Mathematics A (H230) topics. Each lesson is a page of Mira Hale’s notebook.
// spec = OCR specification section. Lessons use KaTeX ($...$).
(function () {
  const R = String.raw;
  window.TOPICS = [
    {
      id: "proof", name: "Proof", spec: "OCR 1.01", paper: "Pure",
      use: R`A proof is the difference between 'it worked every time I tried' and 'it will always work'. Engineers sign their name under proofs.`,
      lesson: R`
<h3>The language</h3>
<ul>
<li>$\Rightarrow$ "implies", $\Leftarrow$ "is implied by", $\iff$ "if and only if".</li>
<li>Integers: even $= 2k$, odd $= 2k+1$. Not divisible by 3: $3k+1$ or $3k+2$.</li>
</ul>
<h3>Proof by deduction</h3>
<p>Start from what you know and follow logical steps to the result. Write it for a <b>general</b> $k$, not examples.</p>
<p>e.g. $(2k+1)^2 = 4k^2+4k+1 = 2(2k^2+2k)+1$, which is odd. So the square of an odd number is odd. ∎</p>
<h3>Proof by exhaustion</h3>
<p>Split into cases that cover <b>every</b> possibility (odd/even, remainder 1/2 on division by 3...) and prove each one.</p>
<h3>Disproof by counter-example</h3>
<p>One example where the statement fails is enough to show it is false. $m = 9$: $9^2 + 4 = 85 = 5 \times 17$ isn't prime.</p>
<h3>⚠ The trap</h3>
<p>Checking a few numbers is NOT a proof. And finish with a concluding sentence that states what you've shown.</p>`,
    },
    {
      id: "indices", name: "Indices & Surds", spec: "OCR 1.02", paper: "Pure",
      use: R`Exact values matter when you cut materials: a plank cut to 4.47 m when you needed 2√5 m is 2 mm short. Surds keep the answer exact until the last moment.`,
      lesson: R`
<h3>Index laws</h3>
<ul>
<li>$a^m \times a^n = a^{m+n}$ &nbsp; $a^m \div a^n = a^{m-n}$ &nbsp; $(a^m)^n = a^{mn}$</li>
<li>$a^0 = 1$ &nbsp; $a^{-n} = \dfrac{1}{a^n}$ &nbsp; $a^{\frac{1}{n}} = \sqrt[n]{a}$ &nbsp; $a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$</li>
</ul>
<p><b>Fractional powers:</b> do the root first, then the power — the numbers stay small. $27^{\frac{2}{3}} = (\sqrt[3]{27})^2 = 3^2 = 9$.</p>
<h3>Surds</h3>
<ul>
<li>$\sqrt{ab} = \sqrt{a}\sqrt{b}$, so $\sqrt{48} = \sqrt{16}\sqrt{3} = 4\sqrt{3}$ (pull out the biggest square factor).</li>
<li><b>Rationalising:</b> for $\dfrac{k}{a - \sqrt{b}}$ multiply top and bottom by $a + \sqrt{b}$. The bottom becomes $a^2 - b$ — the difference of two squares kills the surd.</li>
</ul>
<h3>Worked example</h3>
<p>$\dfrac{4}{\sqrt{5}-1} = \dfrac{4(\sqrt{5}+1)}{(\sqrt{5}-1)(\sqrt{5}+1)} = \dfrac{4(\sqrt{5}+1)}{5-1} = \sqrt{5}+1$</p>
<h3>⚠ The trap</h3>
<p>$\sqrt{a+b} \neq \sqrt{a}+\sqrt{b}$. Check: $\sqrt{9+16} = \sqrt{25} = 5$, but $\sqrt{9}+\sqrt{16} = 7$. Roots (and powers) only split over <i>multiplication</i>.</p>
<p class="tip">Typing tip: write $\sqrt{3}$ as <code>sqrt3</code> or <code>√3</code>, powers as <code>x^(1/2)</code>.</p>`,
    },
    {
      id: "quadratics", name: "Quadratics & Polynomials", spec: "OCR 1.02", paper: "Pure",
      use: R`Anything thrown, launched or hung (a supply crate, a cable, a profit curve) follows a quadratic. The turning point is the best price, the highest point, the lowest sag.`,
      lesson: R`
<h3>Three ways to solve $ax^2+bx+c=0$</h3>
<ul>
<li><b>Factorise</b>: $x^2 - x - 12 = (x-4)(x+3)$ so $x = 4$ or $x = -3$.</li>
<li><b>Formula</b>: $x = \dfrac{-b \pm \sqrt{b^2-4ac}}{2a}$.</li>
<li><b>Complete the square</b>: $x^2 + bx + c = \left(x+\tfrac{b}{2}\right)^2 - \left(\tfrac{b}{2}\right)^2 + c$.</li>
</ul>
<h3>Turning points</h3>
<p>$y = (x-p)^2 + q$ has its minimum at $(p, q)$. For $y = -a(x-p)^2 + q$ it is a <i>maximum</i> at $(p,q)$ — that's the top of a projectile's arc.</p>
<h3>The discriminant $b^2 - 4ac$</h3>
<ul>
<li>$> 0$: two distinct real roots &nbsp; $= 0$: one repeated (equal) root &nbsp; $< 0$: no real roots</li>
</ul>
<h3>Polynomials — the factor theorem</h3>
<p>If $f(a) = 0$ then $(x - a)$ is a factor of $f(x)$. Find the rest by matching coefficients or dividing.</p>
<p>$f(x) = 2x^3 + 3x^2 - 8x + 3$: $f(1) = 0$, so $f(x) = (x-1)(2x^2 + 5x - 3) = (x-1)(2x-1)(x+3)$.</p>
<h3>Simultaneous equations</h3>
<p>Linear + quadratic: substitute the linear into the quadratic. The discriminant of the result tells you whether the line misses, touches (tangent) or cuts the curve.</p>
<h3>⚠ The trap</h3>
<p>$x^2 = 9 \Rightarrow x = \pm 3$. And in context (time, length, mass) <b>say which root you reject and why</b> — the mark scheme wants it.</p>`,
    },
    {
      id: "graphs", name: "Inequalities & Graphs", spec: "OCR 1.02", paper: "Pure",
      use: R`Inequalities answer "for which values is this safe / profitable / above the flood line?". Transformations let you move a known curve instead of starting again.`,
      lesson: R`
<h3>Simultaneous equations (one linear, one quadratic)</h3>
<p>Rearrange the linear one to $y = \dots$, substitute into the quadratic, solve, then substitute back to get each $y$. Pair your answers up!</p>
<h3>Quadratic inequalities</h3>
<ol>
<li>Find the critical values (solve $=0$).</li>
<li>Sketch the parabola.</li>
<li>$> 0$ → where the curve is <b>above</b> the axis (two separate regions: $x<a$ or $x>b$). $< 0$ → <b>between</b> the roots: $a < x < b$.</li>
</ol>
<p>Multiplying or dividing an inequality by a negative number <b>flips</b> the sign.</p>
<h3>Transformations</h3>
<table class="tbl">
<tr><td>$y = f(x) + a$</td><td>up $a$</td></tr>
<tr><td>$y = f(x + a)$</td><td><b>left</b> $a$ (inside = opposite)</td></tr>
<tr><td>$y = af(x)$</td><td>vertical stretch, scale factor $a$</td></tr>
<tr><td>$y = f(ax)$</td><td>horizontal stretch, scale factor $\tfrac{1}{a}$</td></tr>
<tr><td>$y = -f(x)$, $y = f(-x)$</td><td>reflect in $x$-axis, $y$-axis</td></tr>
</table>
<h3>⚠ The trap</h3>
<p>Changes <i>inside</i> the bracket do the opposite of what they look like: $+3$ moves left, $\times 2$ squashes by $\tfrac12$.</p>`,
    },
    {
      id: "coord", name: "Coordinate Geometry & Circles", spec: "OCR 1.03", paper: "Pure",
      use: R`Surveyors live in coordinates: straight roads, circular ranges, tangents that just touch. A lighthouse lens is a circle; its housing walls are tangent lines.`,
      lesson: R`
<h3>Straight lines</h3>
<ul>
<li>Gradient $m = \dfrac{y_2 - y_1}{x_2 - x_1}$ &nbsp; Line: $y - y_1 = m(x - x_1)$</li>
<li>Parallel: same gradient. Perpendicular: $m_1 m_2 = -1$, i.e. negative reciprocal ($2 \to -\tfrac12$).</li>
<li>Midpoint $\left(\tfrac{x_1+x_2}{2}, \tfrac{y_1+y_2}{2}\right)$ &nbsp; Distance $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$</li>
</ul>
<h3>Circles</h3>
<p>$(x-a)^2 + (y-b)^2 = r^2$ has centre $(a, b)$, radius $r$.</p>
<p>Given $x^2+y^2-6x+4y-12=0$: complete the square on $x$ and $y$: $(x-3)^2 - 9 + (y+2)^2 - 4 - 12 = 0$ so $(x-3)^2+(y+2)^2 = 25$: centre $(3,-2)$, radius $5$.</p>
<h3>Circle facts</h3>
<ul>
<li>A tangent is perpendicular to the radius at the point of contact.</li>
<li>The perpendicular bisector of a chord passes through the centre.</li>
<li>The angle in a semicircle is $90°$.</li>
</ul>
<h3>⚠ The trap</h3>
<p>$(x+2)^2$ means the centre has $x = -2$. And $r^2 = 25$ means $r = 5$, not 25.</p>`,
    },
    {
      id: "binomial", name: "Binomial Expansion", spec: "OCR 1.04", paper: "Pure",
      use: R`Quick estimates without a calculator: $(1.02)^{10}$, growth over several years, and the binomial distribution in statistics all come from this expansion.`,
      lesson: R`
<h3>The expansion</h3>
<p>$(a+b)^n = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + b^n$</p>
<p>The general term is $\binom{n}{r} a^{n-r} b^{r}$. On a calculator, $\binom{n}{r}$ is <b>nCr</b>. Row 5 of Pascal: 1, 5, 10, 10, 5, 1.</p>
<h3>Worked example</h3>
<p>Coefficient of $x^2$ in $(3-2x)^5$: term is $\binom{5}{2} 3^3 (-2x)^2 = 10 \times 27 \times 4x^2 = 1080x^2$.</p>
<h3>Approximations</h3>
<p>To estimate $1.01^{8}$: expand $(1+x)^8 = 1 + 8x + 28x^2 + \dots$ and put $x = 0.01$: $1 + 0.08 + 0.0028 = 1.0828$ (true value $1.08286\dots$). Higher powers of a small number are tiny, so the first few terms are enough.</p>
<h3>⚠ The trap</h3>
<p>Bracket the whole term: $(-2x)^2 = +4x^2$, not $-2x^2$. Signs alternate when $b$ is negative.</p>`,
    },
    {
      id: "trig", name: "Trigonometry", spec: "OCR 1.05", paper: "Pure",
      use: R`Measuring what you can"t reach: the height of a cliff, the distance to a ship, the angle a beam must turn through. Waves and tides are trig graphs.`,
      lesson: R`
<h3>Triangles</h3>
<ul>
<li><b>Sine rule</b> $\dfrac{a}{\sin A} = \dfrac{b}{\sin B}$ — use with a matching side–angle pair.</li>
<li><b>Cosine rule</b> $a^2 = b^2 + c^2 - 2bc\cos A$ — two sides and the angle between, or all three sides.</li>
<li><b>Area</b> $= \tfrac12 ab\sin C$.</li>
<li><b>Ambiguous case:</b> if the sine rule gives $\sin B = 0.8$, then $B$ could be $53.1°$ <i>or</i> $180° - 53.1° = 126.9°$. Check both fit (angles sum &lt; 180°).</li>
</ul>
<h3>Solving trig equations</h3>
<ol>
<li>Get one trig function on its own (factorise if it's a quadratic in $\sin x$).</li>
<li>Principal value from your calculator (in <b>degrees</b> mode!).</li>
<li>Find the rest: $\sin x$: $180° - \alpha$ &nbsp; $\cos x$: $360° - \alpha$ &nbsp; $\tan x$: $\alpha + 180°$. Keep adding $360°$ while you're in range.</li>
</ol>
<h3>Identities</h3>
<p>$\tan x \equiv \dfrac{\sin x}{\cos x}$ &nbsp; $\sin^2 x + \cos^2 x \equiv 1$</p>
<h3>⚠ The trap</h3>
<p>Your calculator only gives one answer. The interval almost always holds more. Sketch the graph and count.</p>`,
    },
    {
      id: "explog", name: "Exponentials & Logarithms", spec: "OCR 1.06", paper: "Pure",
      use: R`Growth and decay: populations, interest, cooling, floods rising. Logs pull the time out of the exponent: "when will it reach 2000?"`,
      lesson: R`
<h3>Logs undo powers</h3>
<p>$\log_a b = c \iff a^c = b$. &nbsp; $\ln$ is $\log_e$, and $\ln(e^x) = x$, $e^{\ln x} = x$.</p>
<h3>Log laws</h3>
<ul>
<li>$\log a + \log b = \log(ab)$ &nbsp; $\log a - \log b = \log\left(\tfrac{a}{b}\right)$ &nbsp; $k\log a = \log(a^k)$</li>
</ul>
<h3>Solving</h3>
<p>$3^x = 20 \Rightarrow x\ln 3 = \ln 20 \Rightarrow x = \dfrac{\ln 20}{\ln 3} \approx 2.73$.</p>
<p>$P = 500e^{0.2t} = 2000 \Rightarrow e^{0.2t} = 4 \Rightarrow 0.2t = \ln 4 \Rightarrow t \approx 6.93$.</p>
<h3>Modelling: $y = ab^x$ and $y = ax^n$</h3>
<ul>
<li>$y = ab^x$: $\log y = \log a + x\log b$. Plot $\log y$ against $x$: intercept $\log a$, gradient $\log b$.</li>
<li>$y = ax^n$: $\log y = \log a + n\log x$. Plot $\log y$ against $\log x$: gradient $n$.</li>
</ul>
<p>The gradient of $e^{kx}$ is $ke^{kx}$ — exponential growth's rate is proportional to its size.</p>
<h3>⚠ The trap</h3>
<p>$\log(a+b)$ does <b>not</b> simplify. And always check solutions: you can't take the log of a negative number or zero.</p>`,
    },
    {
      id: "diff", name: "Differentiation", spec: "OCR 1.07", paper: "Pure",
      use: R`The derivative is a rate of change: how fast the water is rising right now. Set it to zero to find the best design, the highest flood, the cheapest shape.`,
      lesson: R`
<h3>The rule</h3>
<p>$\dfrac{d}{dx}\left(ax^n\right) = nax^{n-1}$. Constants differentiate to $0$.</p>
<p><b>Rewrite first:</b> $\dfrac{6}{x} = 6x^{-1}$, $\sqrt{x} = x^{\frac12}$, $\dfrac{3}{x^2} = 3x^{-2}$. Then: $\dfrac{d}{dx}(6x^{-1}) = -6x^{-2}$.</p>
<h3>First principles</h3>
<p>$f'(x) = \lim_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$. For $f(x) = x^2$: $\dfrac{(x+h)^2-x^2}{h} = \dfrac{2xh+h^2}{h} = 2x + h \to 2x$.</p>
<h3>Uses</h3>
<ul>
<li><b>Tangent</b> at $x = a$: gradient $f'(a)$, through $(a, f(a))$. <b>Normal</b>: gradient $-\dfrac{1}{f'(a)}$.</li>
<li><b>Stationary points</b>: solve $\dfrac{dy}{dx} = 0$. Then $\dfrac{d^2y}{dx^2} > 0$ → minimum, $< 0$ → maximum.</li>
<li><b>Optimisation</b>: write the quantity in ONE variable (use the constraint to eliminate the other), differentiate, set to zero, check it's a max/min.</li>
<li>Increasing where $f'(x) > 0$, decreasing where $f'(x) < 0$.</li>
</ul>
<h3>⚠ The trap</h3>
<p>Never differentiate a fraction or root as it stands. Index form first, always.</p>`,
    },
    {
      id: "integ", name: "Integration", spec: "OCR 1.08", paper: "Pure",
      use: R`Integration adds up lots of tiny pieces: area of land, volume of floodwater, total distance from a speed.`,
      lesson: R`
<h3>Reverse differentiation</h3>
<p>$\displaystyle\int ax^n\,dx = \frac{a}{n+1}x^{n+1} + c$ &nbsp; ($n \neq -1$). Add one to the power, divide by the new power, <b>+ c</b>.</p>
<p>Rewrite first, just like differentiation: $\displaystyle\int \frac{4}{x^3}dx = \int 4x^{-3}dx = -2x^{-2} + c$.</p>
<h3>Finding $c$</h3>
<p>If you know a point on the curve, substitute it in after integrating to find $c$.</p>
<h3>Definite integrals</h3>
<p>$\displaystyle\int_a^b f(x)\,dx = \Big[F(x)\Big]_a^b = F(b) - F(a)$. No $+c$ needed — it cancels.</p>
<h3>Area</h3>
<ul>
<li>Find where the curve crosses the $x$-axis first.</li>
<li>Area <b>below</b> the axis comes out negative — split the integral there and take the size of each part.</li>
</ul>
<h3>⚠ The trap</h3>
<p>Indefinite integral without $+c$ loses a mark every single time.</p>`,
    },
    {
      id: "vectors", name: "Vectors", spec: "OCR 1.10", paper: "Pure",
      use: R`Forces, currents and displacements all have size AND direction. Bridges are built from vector triangles.`,
      lesson: R`
<h3>Basics</h3>
<ul>
<li>$\overrightarrow{AB} = \mathbf{b} - \mathbf{a}$ (end minus start).</li>
<li>Magnitude $|x\mathbf{i} + y\mathbf{j}| = \sqrt{x^2+y^2}$.</li>
<li>Direction: angle with $\mathbf{i}$ is $\tan^{-1}\left(\tfrac{y}{x}\right)$ — draw it to get the right quadrant.</li>
<li>Unit vector $\hat{\mathbf{a}} = \dfrac{\mathbf{a}}{|\mathbf{a}|}$.</li>
<li>Parallel vectors are scalar multiples: $2\mathbf{i} - 3\mathbf{j} \parallel -4\mathbf{i} + 6\mathbf{j}$.</li>
</ul>
<h3>Worked example</h3>
<p>$A(1, 2)$, $B(7, -6)$: $\overrightarrow{AB} = 6\mathbf{i} - 8\mathbf{j}$, $|\overrightarrow{AB}| = \sqrt{36+64} = 10$.</p>
<h3>⚠ The trap</h3>
<p>Magnitude is never the sum of the components. And $\overrightarrow{BA} = -\overrightarrow{AB}$.</p>
<p class="tip">Typing tip: vectors as <code>6i - 8j</code> or <code>(6, -8)</code>.</p>`,
    },
    {
      id: "data", name: "Sampling & Data (incl. Large Data Set)", spec: "OCR 2.01–2.02", paper: "Statistics",
      use: R`You can"t ask everyone. Good sampling and honest summaries let a whole village be described from a few records. (OCR uses the census Large Data Set.)`,
      lesson: R`
<h3>Sampling</h3>
<ul>
<li><b>Simple random</b>: number every member, random number generator — every sample equally likely. Needs a sampling frame.</li>
<li><b>Systematic</b>: every $k$th member from a random start.</li>
<li><b>Stratified</b>: sample from each group in proportion to its size.</li>
<li><b>Quota / opportunity</b>: non-random — quick but can be biased.</li>
</ul>
<h3>Measures</h3>
<ul>
<li>Mean $\bar{x} = \dfrac{\sum x}{n}$ &nbsp; Variance $\sigma^2 = \dfrac{\sum x^2}{n} - \bar{x}^2$ &nbsp; Standard deviation $\sigma = \sqrt{\text{variance}}$</li>
<li>IQR $= Q_3 - Q_1$. A common outlier rule: below $Q_1 - 1.5\times\text{IQR}$ or above $Q_3 + 1.5\times\text{IQR}$.</li>
</ul>
<h3>Coding</h3>
<p>If $y = \dfrac{x - a}{b}$ then $\bar{y} = \dfrac{\bar{x} - a}{b}$ and $\sigma_y = \dfrac{\sigma_x}{b}$ — adding/subtracting doesn't change spread.</p>
<h3>⚠ The trap</h3>
<p>Don't remove an outlier just because it's inconvenient — only if it's an <i>error</i>. Say why in context.</p>`,
    },
    {
      id: "prob", name: "Probability, Binomial & Hypothesis Tests", spec: "OCR 2.03–2.05", paper: "Statistics",
      use: R`Is the new remedy actually worse, or was it bad luck? A hypothesis test decides fairly, before you look at the result.`,
      lesson: R`
<h3>Probability</h3>
<ul>
<li>$P(A \cup B) = P(A) + P(B) - P(A \cap B)$</li>
<li>Independent: $P(A \cap B) = P(A)P(B)$. Mutually exclusive: $P(A \cap B) = 0$.</li>
</ul>
<h3>Binomial distribution $X \sim B(n, p)$</h3>
<p>Fixed $n$ trials, two outcomes, constant $p$, independent trials. $P(X = r) = \binom{n}{r}p^r(1-p)^{n-r}$.</p>
<p>Calculator: Binomial PD for $=$, Binomial CD for $\le$. $P(X \ge 3) = 1 - P(X \le 2)$. $P(X < 3) = P(X \le 2)$.</p>
<h3>Hypothesis test (one-tailed)</h3>
<ol>
<li>$H_0: p = 0.4$ &nbsp; $H_1: p < 0.4$ (direction from the claim).</li>
<li>Assume $H_0$: $X \sim B(20, 0.4)$.</li>
<li>Find $P(X \le \text{observed})$ (or $\ge$ for $H_1: p > \dots$).</li>
<li>Compare with the significance level (e.g. 5%). Smaller → reject $H_0$.</li>
<li><b>Conclude in context</b>, non-assertively: "there is sufficient evidence to suggest the proportion has decreased."</li>
</ol>
<p>Two-tailed tests: halve the significance level for each tail.</p>
<h3>⚠ The trap</h3>
<p>Never say "$H_0$ is true" or "proves". Say "insufficient evidence to reject $H_0$".</p>`,
    },
    {
      id: "kinematics", name: "Kinematics", spec: "OCR 3.01–3.02", paper: "Mechanics",
      use: R`Lifts, falling objects, boats accelerating out of a lock: SUVAT for constant acceleration, calculus when it changes.`,
      lesson: R`
<h3>SUVAT (constant acceleration only)</h3>
<p>$v = u + at$ &nbsp; $s = ut + \tfrac12at^2$ &nbsp; $s = \left(\tfrac{u+v}{2}\right)t$ &nbsp; $v^2 = u^2 + 2as$ &nbsp; $s = vt - \tfrac12at^2$</p>
<p>List what you know (3 of s, u, v, a, t), pick the equation without the one you don't want.</p>
<h3>Graphs</h3>
<ul>
<li>Velocity–time: gradient = acceleration, area = displacement.</li>
</ul>
<h3>Vertical motion</h3>
<p>Choose up as positive: then $a = -g = -9.8\ \text{m s}^{-2}$. At the top, $v = 0$.</p>
<h3>Variable acceleration</h3>
<p>$s \xrightarrow{\frac{d}{dt}} v \xrightarrow{\frac{d}{dt}} a$ and back again by integrating (find $c$ from initial conditions).</p>
<h3>⚠ The trap</h3>
<p>If $a$ depends on $t$, SUVAT is illegal. Displacement isn't distance: a particle can travel 5 m and end up where it started.</p>`,
    },
    {
      id: "forces", name: "Forces & Newton’s Laws", spec: "OCR 3.03", paper: "Mechanics",
      use: R`Every rope, pulley and lock gate is balanced with F = ma. Draw the force diagram first, or the cable snaps.`,
      lesson: R`
<h3>Newton's laws</h3>
<ol>
<li>No resultant force → constant velocity (or at rest).</li>
<li>$F = ma$ where $F$ is the <b>resultant</b> force in the direction of acceleration.</li>
<li>Every action has an equal and opposite reaction.</li>
</ol>
<h3>Method</h3>
<ol>
<li>Draw a force diagram. Weight $mg$ down, normal reaction $R$, tension $T$, friction opposing motion.</li>
<li>Resolve in the direction of acceleration: (forces with) − (forces against) $= ma$.</li>
</ol>
<h3>Connected particles</h3>
<p>Light inextensible string → same tension throughout, same acceleration. Write $F = ma$ for <i>each</i> particle, then solve simultaneously.</p>
<h3>Lifts</h3>
<p>Accelerating up: $T - mg = ma$. Accelerating down: $mg - T = ma$.</p>
<h3>⚠ The trap</h3>
<p>Use the resultant force, not just the biggest one. Use $g = 9.8$ unless told otherwise.</p>`,
    },
  ];
})();
