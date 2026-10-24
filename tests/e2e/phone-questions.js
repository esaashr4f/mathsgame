const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const tag = process.argv[2] || 'before';
  for (const [name, vp] of [['13', { width: 390, height: 664 }], ['se', { width: 375, height: 548 }], ['land', { width: 844, height: 340 }]]) {
    const ctx = await b.newContext({ viewport: vp, hasTouch: true, isMobile: true, deviceScaleFactor: 2, userAgent: UA });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8765/');
    await p.evaluate(() => { localStorage.setItem('lowmarsh-tips', '{"rotate":1,"answer":1,"scratch":1,"controls":1}'); localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 30, dir: 'up', flags: { chapter: 3, rook: true, plank: true, arrived: true }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })); });
    await p.reload(); await p.waitForTimeout(1000);
    await p.evaluate(() => Game.titleChoose('cont')); await p.waitForTimeout(700);
    // a story problem with context + diagram (the gangplank) and a long one (footpath)
    for (const id of ['gangplank', 'footpath', 'windmill']) {
      await p.evaluate(id => { window.__done = false; Solver.story(STORY_PROBLEMS[id], { quit: 'Step away for now' }); }, id);
      await p.waitForTimeout(900);
      const m = await p.evaluate(() => { const s = document.querySelector('.nb-screen'); const inp = document.querySelector('.nb-screen .ans, .nb-screen .choice'); const r = inp && inp.getBoundingClientRect(); const d = document.querySelector('.nb-dock').getBoundingClientRect(); return { scrollH: s.scrollHeight, H: innerHeight, inputTop: r ? Math.round(r.top) : null, inputBottom: r ? Math.round(r.bottom) : null, dockTop: Math.round(d.top), dockBottom: Math.round(d.bottom) }; });
      console.log(tag, name, id, JSON.stringify(m));
      await p.screenshot({ path: 'shots/q-' + tag + '-' + name + '-' + id + '.png' });
      await p.evaluate(() => document.querySelector('.nb-screen [data-t=quit]').click()); await p.waitForTimeout(300);
    }
    // a drill session
    await p.evaluate(() => Game.drills(() => {})); await p.waitForTimeout(500);
    await p.click('[data-a=go][data-v=coord]'); await p.waitForTimeout(900);
    const m2 = await p.evaluate(() => { const s = document.querySelector('.sess-screen, .panel-screen:last-child'); return { scrollH: s.scrollHeight, H: innerHeight }; });
    console.log(tag, name, 'drill', JSON.stringify(m2));
    await p.screenshot({ path: 'shots/q-' + tag + '-' + name + '-drill.png' });
    await ctx.close();
  }
  await b.close();
})();
