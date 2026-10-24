// What fits on an iPhone? Visible sizes in Safari with its toolbars showing.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const P = require('./play.js');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const report = [];
  for (const [name, vp] of [['13-portrait', { width: 390, height: 664 }], ['se-portrait', { width: 375, height: 548 }], ['13-landscape', { width: 844, height: 340 }], ['se-landscape', { width: 667, height: 323 }]]) {
    const ctx = await b.newContext({ viewport: vp, hasTouch: true, isMobile: true, deviceScaleFactor: 2, userAgent: UA });
    const p = await ctx.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
    await p.goto('http://localhost:8765/'); await p.evaluate(() => { localStorage.clear(); localStorage.setItem('lowmarsh-tips', '{"rotate":1}'); }); await p.reload(); await p.waitForTimeout(1200);
    // overflow check: does any visible card/panel content stick out past the screen without a way to scroll to it?
    const check = async label => {
      await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const W = innerWidth, H = innerHeight, out = [];
        document.querySelectorAll('.reward, .menu-box, .sheet, .notebook, .battle, .name-screen, .dlg, .auth, .nb-bar, .sess-top').forEach(el => {
          if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
          const b = el.getBoundingClientRect(); if (!b.width) return;
          const sc = el.closest('.panel-screen');
          const scrollable = sc && sc.scrollHeight > sc.clientHeight;
          if (b.right > W + 1 || b.left < -1) out.push(el.className.split(' ')[0] + ' too wide (' + Math.round(b.width) + ' > ' + W + ')');
          if ((b.top < -1 || b.bottom > H + 1) && !scrollable) out.push(el.className.split(' ')[0] + ' cut off (' + Math.round(b.top) + '..' + Math.round(b.bottom) + ' of ' + H + ')');
        });
        if (document.documentElement.scrollWidth > W + 1) out.push('page scrolls sideways (' + document.documentElement.scrollWidth + ')');
        return out;
      });
      await p.screenshot({ path: 'shots/ios-' + name + '-' + label + '.png' });
      if (r.length) report.push(name + ' / ' + label + ': ' + r.join('; '));
    };
    await p.$eval('#title [data-a=new]', b => b.click()); await p.waitForTimeout(500);
    await check('name');
    await p.fill('#nm', 'Esa'); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
    await check('who');
    await P.drive(p, { shotReward: 'ios-' + name + '-controls-raw' });
    // controls card was clicked through by drive; show it again to measure
    await p.evaluate(() => { localStorage.setItem('lowmarsh-tips', '{"rotate":1}'); });
    await p.evaluate(() => { World.run(async () => { const t = JSON.parse(localStorage.getItem('lowmarsh-tips')); delete t.controls; localStorage.setItem('lowmarsh-tips', JSON.stringify(t)); }); });
    await P.talkTo(p, 'gull'); for (let i = 0; i < 30 && !(await p.$('.nb-screen')); i++) { if (await p.$('.choice-box')) { await p.waitForTimeout(450); await p.keyboard.press('Enter'); } else if (await p.$('.dlg')) await p.click('.dlg'); await p.waitForTimeout(150); }
    await check('notebook');
    await p.keyboard.press('Escape'); await p.waitForTimeout(400);
    await p.evaluate(() => Game.openMenu()); await check('menu');
    await p.evaluate(() => { [...document.querySelectorAll('.menu-grid button')].find(b => /Settings/.test(b.textContent)).click(); }); await check('settings');
    await p.evaluate(() => location.reload()); await p.waitForTimeout(1000); await p.evaluate(() => Game.titleChoose('cont')); await p.waitForTimeout(800);
    await p.evaluate(() => { World.run(G => G.battle(ENCOUNTERS.bramble)); }); await p.waitForTimeout(2500); await check('battle');
    await p.evaluate(() => location.reload()); await p.waitForTimeout(1000); await p.evaluate(() => Game.titleChoose('cont')); await p.waitForTimeout(800);
    await p.evaluate(() => { World.run(G => G.say('rook', 'A long line of dialogue to see how the box wraps on a small phone, with plenty of words in it so it fills two or three lines.')); }); await check('dialogue');
    if (errors.length) report.push(name + ' errors: ' + errors.join(' | '));
    await ctx.close();
  }
  console.log(report.join('\n') || 'everything fits');
  await b.close();
})();
