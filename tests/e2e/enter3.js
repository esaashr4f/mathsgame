// Enter through every kind of conversation; when a problem is offered, choose "Not now" (arrow down, Enter).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const page = await b.newPage({ viewport: { width: 1100, height: 800 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/');
  await page.evaluate(() => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 30, dir: 'up', flags: { chapter: 2, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, wickDone: true, tomasDone: true, kidCode: true, ropeFixed: true, brambleSpared: true, eastOpen: true, blueprint: true }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })));
  await page.reload(); await page.waitForTimeout(1500);
  await page.mouse.click(550, 400); await page.waitForTimeout(600);
  await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
  for (const id of ['moss', 'wick', 'kid1', 'stall1', 'stall2']) {
    await page.evaluate(id => { const e = World.entity(id); World.player.x = e.px; World.player.y = e.py + 14; World.player.dir = 'up'; World.talkCooldown = 0; }, id);
    await page.waitForTimeout(200);
    const trace = [];
    for (let i = 0; i < 25; i++) {
      const choice = await page.$('.choice-box');
      if (choice) { const last = await page.$$eval('.choice-box button', bs => bs.length - 1); for (let k = 0; k < last; k++) await page.keyboard.press('ArrowDown'); }
      await page.keyboard.press('Enter'); await page.waitForTimeout(450);
      const s = await page.evaluate(() => (document.querySelector('.choice-box') ? 'C' : document.querySelector('.dlg') ? (document.querySelector('.dlg.done') ? 'd' : 't') : document.querySelector('.panel-screen') ? 'P' : World.locked ? 'L' : '-'));
      trace.push(s);
      if (s === '-') break;
    }
    console.log(id.padEnd(8), trace.join(''), trace[trace.length - 1] === '-' ? '→ conversation over, free to walk' : '→ STUCK');
  }
  console.log(errors.join('\n') || 'no errors');
  await b.close();
})();
