// The districts of Bathys. Each is one AS topic, guarded by a boss who believes one classic misconception.
// depth = metres at the zone's floor (every mark = 10 m, like Krillion). Lessons use KaTeX ($...$).
(function () {
  const R = String.raw;

  window.ZONES = [
    {
      id: 'shallows', name: 'Sunlit Shallows', depth: 50, paper: 'Pure', topic: 'Indices & Surds',
      system: 'The Pressure Dome',
      realWorld: 'Dome panels are cut to surd ratios so they tessellate exactly — a decimal would leave gaps for the sea to get in.',
      depthNote: '── light begins to fade',
      boss: {
        name: 'Radixa', title: 'the Tangled Eel', icon: '🐍', color: '#4cc9f0',
        misconception: R`$\sqrt{a+b} = \sqrt{a} + \sqrt{b}$`,
        check: 'RADIXA — ATK 4 DEF 2. Believes roots split over addition. Coils tighter every time you guess.',
        flavor: ['* Radixa coils around a square root.', '* Radixa insists √(9+16) = 7.', '* The water smells like chalk dust.'],
        bullets: ['√a+√b', '√2+√2', 'x½', '2³=6'],
        pattern: 'rain',
        intro: [
          ['narrator', '* The Pressure Dome groans. A long, glittering eel is knotted around the valve.'],
          ['boss', 'Sssso. A krill. Come to fix my dome?'],
          ['boss', 'I already fixed it. The panel is √9 + √16 = 7 metres wide. Roots of a sum are the sum of the roots. Sssimple.'],
          ['pip', 'It\'s actually √25 = 5! That\'s why there\'s a 2-metre gap and WATER COMING IN!'],
          ['boss', 'Prove it, then. Ssstep by ssstep.'],
        ],
        defeat: [
          ['boss', 'Sss... √(9+16)... is √25... is five.'],
          ['boss', 'I\'ve been adding roots for months. No wonder my dome leaksss.'],
          ['narrator', '* The fog drifts out of Radixa\'s eyes. The Pressure Dome seals with a satisfying THUNK.'],
        ],
      },
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
      id: 'reef', name: 'Kelp Reef Farms', depth: 100, paper: 'Pure', topic: 'Quadratics',
      system: 'Kelp Farms & Supply Launchers',
      realWorld: 'Supply pods are launched on parabolic arcs. Solve the quadratic and you know exactly when — and where — they land.',
      depthNote: 'most sunlight stops here ──',
      boss: {
        name: 'Quadrabble', title: 'the Parabolic Crab', icon: '🦀', color: '#f77f00',
        misconception: R`If $x^2 = 9$ then $x = 3$ (forgetting $\pm$) — and never rejecting nonsense roots.`,
        check: 'QUADRABBLE — ATK 5 DEF 3. Only ever walks one way. Forgets the other root exists.',
        flavor: ['* Quadrabble clicks its claws in a perfect parabola.', '* Quadrabble walks sideways. Only to the right.', '* Somewhere, a negative root goes unnoticed.'],
        bullets: ['x=3', '±?', 't=-1', 'b²+4ac'],
        pattern: 'arc',
        intro: [
          ['narrator', '* Supply pods are slamming into the reef. A crab with one enormous claw operates the launcher.'],
          ['boss', 'CLICK. Height zero at t = −1! I launch the pods one second BEFORE pressing the button! Efficient!'],
          ['pip', 'That\'s... not how time works.'],
          ['boss', 'Square root of nine is three. Always three. Only three. CLICK CLICK.'],
        ],
        defeat: [
          ['boss', 'Minus three ALSO squares to nine...? There were two of them. There were always two.'],
          ['boss', 'And I should have thrown away the root that made no sense. Click... sorry, kelp.'],
          ['narrator', '* The launcher swings back on target. Pods drift gently into the farms.'],
        ],
      },
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
<h3>⚠ The trap</h3>
<p>$x^2 = 9 \Rightarrow x = \pm 3$. And in context (time, length, mass) <b>say which root you reject and why</b> — the mark scheme wants it.</p>`,
    },

    {
      id: 'lagoon', name: 'Mirror Lagoon', depth: 150, paper: 'Pure', topic: 'Equations, Inequalities & Graphs',
      system: 'Sonar Mirrors',
      realWorld: 'The lagoon\'s sonar shifts and stretches its signal curve. Know the transformation and you know where the echo lands.',
      depthNote: '── deepest scuba dive ever — 332m',
      boss: {
        name: 'Inversa', title: 'the Mirror Octopus', icon: '🐙', color: '#c77dff',
        misconception: R`$y = f(x+3)$ moves the graph 3 to the <i>right</i>.`,
        check: 'INVERSA — ATK 5 DEF 4. Sees everything backwards. Thinks inequalities never flip.',
        flavor: ['* Inversa rearranges its tentacles. They are all on the wrong side.', '* Inversa multiplies by −1 and keeps the sign. Bold.', '* The water reflects a graph that isn\'t there.'],
        bullets: ['→+3', 'x>-2', 'f(x+a)→', '<>'],
        pattern: 'sweep',
        intro: [
          ['narrator', '* Every mirror in the lagoon points the wrong way. An octopus is turning them, one tentacle each.'],
          ['boss', 'Plus three means move right! Everyone knows plus is right! Mirror, mirror, everything\'s inverted except my opinions.'],
          ['pip', 'Inside the bracket it\'s the opposite, though. f(x+3) shifts LEFT.'],
          ['boss', 'Lies! Reflect on THIS.'],
        ],
        defeat: [
          ['boss', 'Inside the bracket... it does the opposite. Because x has to be three SMALLER to get the same output.'],
          ['boss', 'Oh. Oh, I\'ve been aiming the sonar at the wrong reef for weeks.'],
          ['narrator', '* The mirrors turn. A clean sonar ping rings across the lagoon.'],
        ],
      },
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
      id: 'grid', name: 'Coral Grid', depth: 200, paper: 'Pure', topic: 'Coordinate Geometry',
      system: 'Pipeline Grid',
      realWorld: 'Every oxygen pipe is a straight line, every sonar range a circle. Where they touch is where you put the junction.',
      depthNote: '── sperm whales hunt below here',
      boss: {
        name: 'Circulus', title: 'the Nautilus', icon: '🐚', color: '#ef476f',
        misconception: R`The circle $(x-a)^2+(y-b)^2=r^2$ has centre $(-a,-b)$ and radius $r^2$.`,
        check: 'CIRCULUS — ATK 6 DEF 4. Spirals. Gets every sign backwards and forgets to square-root.',
        flavor: ['* Circulus spins in a perfect circle. Centre: wrong.', '* Circulus says the radius is 25. The sonar disagrees.', '* Pipes hiss somewhere in the coral.'],
        bullets: ['r=25', '(-a,-b)', 'm₁=m₂', '⊥?'],
        pattern: 'ring',
        intro: [
          ['narrator', '* The pipeline grid is a tangle of crossed lines. A nautilus sits at the centre of a circle of sonar buoys. Well — near the centre.'],
          ['boss', 'Radius twenty-five. Centre (−3, 2). My buoys are perfect.'],
          ['pip', 'They\'re all floating off into the abyss...'],
          ['boss', 'Then the abyss is wrong.'],
        ],
        defeat: [
          ['boss', 'The equation holds r SQUARED... and the signs inside the brackets flip...'],
          ['boss', 'Spiralling out was my whole personality. Perhaps I could spiral... correctly.'],
          ['narrator', '* The buoys glide into a true circle. The pipeline lights up junction by junction.'],
        ],
      },
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
      id: 'nursery', name: 'Jelly Nursery', depth: 250, paper: 'Pure', topic: 'Binomial Expansion',
      system: 'Population Forecaster',
      realWorld: 'Growth factors like $1.02^{10}$ are approximated with the first few binomial terms — fast estimates with no calculator.',
      depthNote: 'emperor penguins dive this deep ──',
      boss: {
        name: 'Binomia', title: 'the Expanding Jellyfish', icon: '🪼', color: '#ff70a6',
        misconception: R`$(2x)^3 = 2x^3$ — the coefficient never gets raised to the power.`,
        check: 'BINOMIA — ATK 6 DEF 5. Keeps multiplying. Never brackets the coefficient.',
        flavor: ['* Binomia splits into 1, 4, 6, 4, 1 smaller jellies.', '* Binomia forgets to bracket the 2. Again.', '* The nursery glows in Pascal\'s triangle.'],
        bullets: ['2x³', 'nCr?', '(-x)²<0', '1 4 6 4'],
        pattern: 'rain',
        intro: [
          ['narrator', '* The nursery is overflowing. The population forecaster predicted 40 jellies. There are 400.'],
          ['boss', 'I expanded the growth formula myself~ (1 + 2x) to the fifth is 1 + 10x + 10x²~'],
          ['pip', 'You forgot to square the 2 in the x² term! It should be 40x²!'],
          ['boss', 'Expand THIS, little krill~'],
        ],
        defeat: [
          ['boss', 'The whole bracket goes to the power... (2x)² is 4x²... oh my tentacles, I\'ve been under-counting by a factor of FOUR.'],
          ['narrator', '* Binomia drifts calmly into the nursery. The forecaster\'s numbers finally match the jellies.'],
        ],
      },
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
      id: 'spire', name: 'Twilight Spire', depth: 300, paper: 'Pure', topic: 'Trigonometry',
      system: 'The Twilight Lighthouse',
      realWorld: 'The lighthouse beam sweeps in angles; triangulating two buoys tells you exactly how far a lost diver is.',
      depthNote: '── pressure: 67x the surface',
      boss: {
        name: 'Sinéad', title: 'Siren of Sines', icon: '🧜', color: '#4361ee',
        misconception: R`$\sin^{-1}$ gives the only answer — ignoring the other solutions in the interval and the ambiguous case.`,
        check: 'SINÉAD — ATK 7 DEF 5. Sings one angle and stops. The CAST diagram makes her furious.',
        flavor: ['* Sinéad\'s song oscillates between −1 and 1.', '* Sinéad sings "thirty degrees" and nothing else.', '* The lighthouse beam stutters at 150°.'],
        bullets: ['30°?', 'only 1', 'RAD', '180-x'],
        pattern: 'wave',
        intro: [
          ['narrator', '* The Twilight Lighthouse turns, but its beam only ever points one way. A siren sits on the lamp, singing.'],
          ['boss', '♪ sin x is one half, and x is thirty, and that is all, and that is all ♪'],
          ['pip', 'The beam needs to stop at EVERY angle where sin x = ½! The boats at 150° are lost in the dark!'],
          ['boss', '♪ There is no 150. Hush, little krill, hush. ♪'],
        ],
        defeat: [
          ['boss', '♪ ...sine is positive in the first and second quadrants... 180 minus thirty is... ♪'],
          ['boss', 'One hundred and fifty. There was another verse to my song all along.'],
          ['narrator', '* The beam sweeps the full circle. Far out, a lost boat blinks its lights in thanks.'],
        ],
      },
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
      id: 'vents', name: 'Pressure Vents', depth: 350, paper: 'Pure', topic: 'Exponentials & Logarithms',
      system: 'Thermal Vents & Plankton Beds',
      realWorld: 'Plankton grow exponentially and vent pressure decays exponentially. Logs are how you pull the time out of the exponent.',
      depthNote: 'siphonophore drift zone ──',
      boss: {
        name: 'Logjaw', title: 'the Abyssal Shark', icon: '🦈', color: '#06d6a0',
        misconception: R`$\log(a+b) = \log a + \log b$`,
        check: 'LOGJAW — ATK 7 DEF 6. Splits logs over addition. Will bite anything with an exponent.',
        flavor: ['* Logjaw bites the exponent clean off.', '* Logjaw writes log(x+2) = log x + log 2. You wince.', '* The vents hiss at e to the something.'],
        bullets: ['log(a+b)', 'ln0', 'eˣ<0', 'log a·b'],
        pattern: 'rain',
        intro: [
          ['narrator', '* The plankton beds are dying. The vent valves are set to random numbers. A shark circles them.'],
          ['boss', 'Grrr. To find when the plankton double, I took log of both sides and split the log over the plus. Easy.'],
          ['pip', 'You can\'t split a log over a plus! Log of a PRODUCT is a sum. Not the other way!'],
          ['boss', 'Then I\'ll take a bite out of YOU.'],
        ],
        defeat: [
          ['boss', 'log(ab) = log a + log b. Products become sums. Sums... stay sums.'],
          ['boss', 'And the time was hiding in the exponent the whole time. I just had to take logs to bring it down.'],
          ['narrator', '* The vents rumble into a steady rhythm. Plankton bloom in clouds of green light.'],
        ],
      },
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
      id: 'falls', name: 'Gradient Falls', depth: 400, paper: 'Pure', topic: 'Differentiation',
      system: 'Oxygen Tank Foundry',
      realWorld: 'The foundry needs tanks that hold the most air for the least metal. Set the derivative to zero: that\'s the optimal design.',
      depthNote: '── THE MIDNIGHT ZONE',
      boss: {
        name: 'Leviathan', title: 'of the Gradient Falls', icon: '🐉', color: '#e63946',
        misconception: R`The derivative of a constant is the constant; $\frac{d}{dx}\left(\frac{1}{x}\right) = \ln x$.`,
        check: 'LEVIATHAN — ATK 8 DEF 6. Its slope is everywhere. Refuses to rewrite 1/x as x^-1 first.',
        flavor: ['* Leviathan\'s body is a curve. You can see its tangents.', '* Leviathan tries to differentiate 5 and gets 5.', '* The waterfall\'s gradient is steepest right... here.'],
        bullets: ["d/dx 5=5", '1/x→ln', "f'=0?", 'nxⁿ'],
        pattern: 'sweep',
        intro: [
          ['narrator', '* An underwater waterfall pours into the dark. The tank foundry at its edge is spitting out lopsided cylinders.'],
          ['boss', 'I AM THE SLOPE. I differentiate everything. The derivative of 6/x is 6 ln x. The derivative of 5 is 5. BEHOLD.'],
          ['pip', 'Rewrite it as 6x⁻¹ first! And constants don\'t change, so their gradient is zero!'],
          ['boss', 'Your gradient is about to be VERY negative, little krill.'],
        ],
        defeat: [
          ['boss', 'Bring the power down... take one off the power... and lonely constants vanish...'],
          ['boss', 'At the very top and the very bottom, my slope is zero. I always found those places peaceful.'],
          ['narrator', '* The foundry recalibrates. Perfect tanks roll out: maximum air, minimum metal.'],
        ],
      },
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
      id: 'hollowbasin', name: 'The Hollow Basin', depth: 450, paper: 'Pure', topic: 'Integration',
      system: 'Coral Planting Fields',
      realWorld: 'The area under a curve is total quantity: coral seabed area, total oxygen used, total distance travelled.',
      depthNote: 'anglerfish territory ──',
      boss: {
        name: 'Integra', title: 'the Constant Hollow', icon: '👻', color: '#adb5bd',
        misconception: R`Forgetting $+\,c$ — and treating area below the axis as positive.`,
        check: 'INTEGRA — ATK 8 DEF 7. A ghost of a function. Is missing a constant and doesn\'t know which one.',
        flavor: ['* Integra flickers. Something about it is missing.', '* Integra adds 1 to the power... and forgets to divide.', '* You hear a whisper: "+ c... + c..."'],
        bullets: ['no +c', 'xⁿ⁺¹', '∫=−?', '÷n?'],
        pattern: 'ring',
        intro: [
          ['narrator', '* The basin floor is grey and bare. A pale ghost drifts over the coral planters, measuring.'],
          ['boss', '...I integrate... and I am never whole... something is always missing...'],
          ['pip', 'It\'s the + c! When you integrate you lose the constant — any constant would differentiate to zero!'],
          ['boss', '...then give it back to me... if you can...'],
        ],
        defeat: [
          ['boss', '...a whole family of curves... all the same shape... shifted by c...'],
          ['boss', 'I am complete.'],
          ['narrator', '* The ghost solidifies into a calm white sea-angel. Coral bursts out across the basin floor.'],
        ],
      },
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
      id: 'currents', name: 'Current Labyrinth', depth: 500, paper: 'Pure', topic: 'Vectors',
      system: 'Current Navigation',
      realWorld: 'Submarines steer through currents by adding velocity vectors. Magnitude is speed; direction is the bearing.',
      depthNote: '── sperm whales duel giant squid here',
      boss: {
        name: 'Vex', title: 'the Whirlpool', icon: '🌀', color: '#48cae4',
        misconception: R`$|3\mathbf{i} + 4\mathbf{j}| = 3 + 4 = 7$`,
        check: 'VEX — ATK 9 DEF 7. Adds components to get speed. Nobody has ever told it about Pythagoras.',
        flavor: ['* Vex spins at 7 m/s. Or 5. It\'s not sure.', '* The current pulls you 3 right and 4 up.', '* AB and BA argue about who is pointing at whom.'],
        bullets: ['3+4=7', 'AB=BA', '|v|²', 'i+j'],
        pattern: 'spiral',
        intro: [
          ['narrator', '* The labyrinth of currents twists every which way. Submarines are crashing into the walls.'],
          ['boss', 'WHOOSH. Current: 3i + 4j. Speed: 3 plus 4. Seven! Full throttle!'],
          ['pip', 'The components are at right angles! It\'s Pythagoras: √(3² + 4²) = 5!'],
          ['boss', 'WHOOSH WHOOSH. Then dodge THIS current!'],
        ],
        defeat: [
          ['boss', 'Three across, four up... the diagonal is five. A right-angled triangle was hiding in me all along.'],
          ['narrator', '* The whirlpool slows into a steady, navigable current. Submarines glide through.'],
        ],
      },
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
      id: 'shoal', name: 'The Shoal Census', depth: 550, paper: 'Statistics', topic: 'Data & Sampling',
      system: 'The Fish Census',
      realWorld: 'You can\'t count every fish in the sea. Sample well, summarise well, and spot the readings that are probably errors.',
      depthNote: 'giant squid territory ──',
      boss: {
        name: 'Meanace', title: 'the Biased Shoal', icon: '🐟', color: '#90be6d',
        misconception: R`A sample of whoever is easiest to catch represents everyone; outliers should just be deleted.`,
        check: 'MEANACE — ATK 9 DEF 8. A thousand fish pretending to be one. Only samples its friends.',
        flavor: ['* Meanace surveys the 10 fish closest to it. Results: everyone agrees with Meanace.', '* Meanace deletes the inconvenient data point.', '* The shoal turns as one.'],
        bullets: ['n=10?', 'bias', 'σ²', 'Q3+IQR'],
        pattern: 'rain',
        intro: [
          ['narrator', '* The census hall is chaos. A shoal of fish moves as one huge body, filling in every form itself.'],
          ['boss', 'WE surveyed the population. WE asked everyone near US. Conclusion: the sea is 100% shoal fish.'],
          ['pip', 'That\'s an opportunity sample! It\'s massively biased!'],
          ['boss', 'WE disagree. All of us.'],
        ],
        defeat: [
          ['boss', 'We... only asked ourselves. Of course we agreed.'],
          ['boss', 'Random sampling. Every fish an equal chance. Even the ones who don\'t like us.'],
          ['narrator', '* The shoal scatters into individual fish. The census board fills with honest data.'],
        ],
      },
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
      id: 'court', name: 'The Null Court', depth: 600, paper: 'Statistics', topic: 'Probability & Hypothesis Testing',
      system: 'The Court of Evidence',
      realWorld: 'Is the reactor really faulty, or just unlucky this week? A hypothesis test decides fairly — before you look at the result.',
      depthNote: '── colossal squid eyes: football-sized',
      boss: {
        name: 'Justice Null', title: 'the Abyssal Arbiter', icon: '⚖️', color: '#ffd166',
        misconception: R`Not rejecting $H_0$ <i>proves</i> $H_0$ is true; and $P(X < 3)$ is the same as $P(X \le 3)$.`,
        check: 'JUSTICE NULL — ATK 10 DEF 8. Assumes everything is innocent. Confuses "not proven guilty" with "proven innocent".',
        flavor: ['* Justice Null bangs a gavel shaped like a bell curve.', '* "The defendant is PROVEN innocent!" (They weren\'t.)', '* 5% of the jury is asleep.'],
        bullets: ['H₀ true!', 'P(X<3)', 'p>5%', 'n choose r'],
        pattern: 'sweep',
        intro: [
          ['narrator', '* A courtroom carved into the trench wall. On trial: the oxygen reactor, accused of failing too often.'],
          ['boss', 'ORDER. The reactor failed 3 times in 20 tests. Not enough to reject innocence. Therefore it is PROVEN PERFECT.'],
          ['pip', 'Not rejecting H₀ doesn\'t PROVE it! It just means there isn\'t enough evidence!'],
          ['boss', 'Contempt of court! Present your evidence, krill.'],
        ],
        defeat: [
          ['boss', '"Insufficient evidence to reject H₀." Not "H₀ is true." The distinction... is just.'],
          ['boss', 'Court is adjourned. Let the reactor be tested again with a larger sample.'],
          ['narrator', '* The courtroom\'s torches settle. Bathys finally trusts its own data again.'],
        ],
      },
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
      id: 'lift', name: 'The Sinking Lift', depth: 650, paper: 'Mechanics', topic: 'Kinematics',
      system: 'The Great Lift Shaft',
      realWorld: 'The lift that carries everyone between districts accelerates, cruises and brakes. SUVAT tells you where it is at every moment.',
      depthNote: 'the water is 2°C and utterly black ──',
      boss: {
        name: 'Suvat', title: 'the Kinematic Kraken', icon: '🦑', color: '#f15bb5',
        misconception: R`SUVAT works even when acceleration changes; and up and down can both be positive.`,
        check: 'SUVAT — ATK 10 DEF 9. Five tentacles: s, u, v, a, t. Uses all of them on everything, constant or not.',
        flavor: ['* Suvat waves five tentacles, each labelled with a letter.', '* Suvat drops a stone and says g = +9.8 upwards.', '* The lift shaft echoes: "constant acceleration only..."'],
        bullets: ['a≠const', 'g=+9.8↑', 'v=u+at', 's=vt?'],
        pattern: 'arc',
        intro: [
          ['narrator', '* The lift shaft. Something enormous has wrapped itself around the cables.'],
          ['boss', 'Five tentacles. Five letters. s, u, v, a, t. I use them for EVERYTHING. Even when acceleration changes! Especially then!'],
          ['pip', 'SUVAT only works for CONSTANT acceleration! For variable acceleration you need calculus!'],
          ['boss', 'Calcu-what? Hold on to the cables, krill.'],
        ],
        defeat: [
          ['boss', 'Constant acceleration... suvat. Changing acceleration... differentiate and integrate. Two tools. Two jobs.'],
          ['boss', 'And pick a direction to be positive. And STICK to it.'],
          ['narrator', '* The kraken releases the cables. The lift resumes its smooth descent — to the very bottom of the trench.'],
        ],
      },
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
      id: 'forge', name: "Titan's Forge", depth: 690, paper: 'Mechanics', topic: 'Forces & Newton\'s Laws',
      system: 'The Hadal Forge',
      realWorld: 'Every winch, pulley and anchor in Bathys is balanced with F = ma. Get it wrong and the cable snaps.',
      depthNote: '── THE ABYSSAL ZONE',
      boss: {
        name: 'Forgemaw', title: 'the Titan Lobster', icon: '🦞', color: '#ff595e',
        misconception: R`Forgetting weight; using the <i>applied</i> force in $F=ma$ instead of the <i>resultant</i> force.`,
        check: 'FORGEMAW — ATK 11 DEF 10. Strongest claw in the deep. Forgets gravity exists.',
        flavor: ['* Forgemaw lifts an anvil. Ignores its weight.', '* Forgemaw: "Tension is tension. Gravity is a myth."', '* The forge rings with resultant forces.'],
        bullets: ['W=0?', 'F≠ma', 'T=mg?', 'μR'],
        pattern: 'spiral',
        intro: [
          ['narrator', '* The forge glows red at the floor of the abyss. Cables snap like threads. A titanic lobster hauls them.'],
          ['boss', 'MORE TENSION. Lift accelerates up, so tension equals mass times acceleration. Weight? Never heard of it.'],
          ['pip', 'You have to include the weight! Resultant force = T − mg!'],
          ['boss', 'CRUSH THE KRILL.'],
        ],
        defeat: [
          ['boss', 'Resultant... force. All of them. Up minus down. Then equals ma.'],
          ['boss', 'I could have lifted with half the strain, if I\'d drawn a force diagram first.'],
          ['narrator', '* The forge cools to a working glow. Below it, the Hadal Gate shimmers.'],
        ],
      },
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

    {
      id: 'gate', name: 'The Hadal Gate', depth: 700, paper: 'Mixed', topic: 'Mixed AS Exam',
      system: 'The Way Home',
      realWorld: 'The exam is the Gate. Every topic, mixed together, under time pressure. You\'ve already beaten every piece of it.',
      depthNote: 'the trench floor — a perfect dive ends here ──',
      final: true,
      boss: {
        name: 'Shadow {name}', title: 'the Hollow Within', icon: '👤', color: '#c77dff',
        misconception: R`"I'm just not a maths person."`,
        check: 'SHADOW — ATK ?? DEF ??. Knows every mistake you have ever made. Is very, very tired.',
        flavor: ['* The Shadow uses every misconception at once.', '* "Just give up. Then it can\'t be your fault."', '* You remember Radixa. You remember Quadrabble. You remember the working.'],
        bullets: ['give up', 'not a maths person', '√a+√b', 'no +c', 'x=3 only', 'log(a+b)'],
        pattern: 'chaos',
        intro: [
          ['narrator', '* At the trench floor, the Hadal Gate. In front of it stands... you.'],
          ['boss', 'Hey. It\'s me. You. The real you.'],
          ['boss', 'Why are you doing this? We\'re not a maths person. We said so. It was comfortable.'],
          ['boss', 'If we don\'t try, we can\'t fail. Stay down here. Stay in the Hollow.'],
          ['pip', '{name}! Don\'t listen! You beat every guardian down here. With WORKING!'],
          ['boss', 'Then show me. Every topic. All at once. Like the real thing.'],
        ],
        defeat: [
          ['boss', '...'],
        ],
      },
      lesson: R`
<h3>Exam technique</h3>
<ul>
<li><b>Read the command word.</b> "Show that" → every step written. "Hence" → use the previous part. "Exact" → surds/fractions/ln, no decimals.</li>
<li><b>Marks ≈ minutes.</b> AS papers: about 1.2 minutes per mark.</li>
<li><b>Method marks</b> are awarded even if the final answer is wrong — always show the working.</li>
<li><b>Context</b>: reject impossible answers (negative time, length) and say why.</li>
<li><b>Accuracy</b>: give 3 s.f. unless told otherwise. Keep full precision in your calculator until the end.</li>
<li>Stuck? Move on, come back. Fresh eyes find the trick.</li>
</ul>`,
    },
  ];
})();
