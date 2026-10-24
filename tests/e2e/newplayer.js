const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const P = require('./play.js');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  for (const [name, opts] of [['desk', { viewport: { width: 1100, height: 800 } }], ['phone', { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }]]) {
    const ctx = await b.newContext(opts); const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:8765/'); await page.waitForTimeout(700);
    await page.$eval('#title [data-a=new]', b => b.click()); await page.waitForTimeout(400);
    await page.fill('#nm', 'Esa'); await page.keyboard.press('Enter');
    await P.drive(page, { shotReward: 'np-' + name + '-controls' });
    await P.talkTo(page, 'gull');
    for (let i = 0; i < 40 && !(await page.$('.nb-screen .tip-bubble')); i++) { if (await page.$('.dlg')) await page.click('.dlg'); await page.waitForTimeout(150); }
    await page.waitForTimeout(300);
    await P.shot(page, 'np-' + name + '-answertip');
    await page.click('.tip-bubble button');
    await P.drive(page);
    // first battle
    await page.evaluate(() => { World.run(G => G.battle(ENCOUNTERS.bramble)); }); await page.waitForTimeout(2600);
    await page.click('.btl-box'); await page.waitForTimeout(1500);
    await P.shot(page, 'np-' + name + '-battletip');
    console.log(name, errors.join('\n') || 'no errors');
    await ctx.close();
  }
  await b.close();
})();
