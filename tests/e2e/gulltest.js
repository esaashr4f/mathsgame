const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  for (const plank of [false, true]) {
    await page.evaluate(pl => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 47, y: 57, dir: 'up', flags: { chapter: 1, rook: true, rookFogTalk: true, plank: pl, arrived: pl }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })), plank);
    await page.reload(); await page.waitForTimeout(600);
    await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(700);
    await page.evaluate(() => { window.__runs = 0; const r = World.run.bind(World); World.run = fn => { window.__runs++; return r(fn); }; const e = World.entity('gull'); World.player.x = e.px + 14; World.player.y = e.py; World.player.dir = 'left'; });
    for (let i = 0; i < 60; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(110); }
    const s = await page.evaluate(() => ({ runs: window.__runs, locked: World.locked, notebook: !!document.querySelector('.nb-screen'), dlg: !!document.querySelector('.dlg') }));
    if (s.notebook) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    const x0 = await page.evaluate(() => World.player.x);
    await page.keyboard.down('ArrowRight'); await page.waitForTimeout(600); await page.keyboard.up('ArrowRight');
    const x1 = await page.evaluate(() => World.player.x);
    console.log(plank ? 'after plank ' : 'before plank', JSON.stringify(s), 'walked away:', Math.round(x1 - x0), 'px');
    await P.shot(page, 'gull-' + plank);
  }
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
