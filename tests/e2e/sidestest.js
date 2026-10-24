const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => {
    localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 26, dir: 'up',
      flags: { chapter: 3, fogLevel: 0.35, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true, nellDone: true, gullPointSeen: true },
      items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} }));
  });
  await page.reload(); await page.waitForTimeout(500);
  await page.$eval('#title [data-a=cont]', b => b.click()); await page.waitForTimeout(500);
  const step = async (label, fn) => { console.log(label); await fn(); await P.drive(page, { max: 500 }); };
  for (const id of ['villager2', 'stall1', 'moss', 'wick']) await step(id, () => P.talkTo(page, id));
  await page.evaluate(() => { Game.G.go('world', 84, 32, 'up'); }); await page.waitForTimeout(700);
  await step('nell', () => P.talkTo(page, 'nell'));
  await page.evaluate(() => { Game.G.go('lamproom', 4, 8, 'up'); }); await page.waitForTimeout(700);
  await step('ottoline', () => P.talkTo(page, 'ottolineAfter'));
  // a line answer typed in a different form, through the real UI
  const res = await page.evaluate(() => MathIn.check({ type: 'line', answer: '3x+4y-59' }, 'y = -3/4x + 59/4'));
  console.log('line check', JSON.stringify(res));
  await page.evaluate(() => Game.openMenu()); await page.waitForTimeout(300);
  await page.click('[data-a=jobs]'); await page.waitForTimeout(400);
  await P.shot(page, 'jobs');
  const f = await page.evaluate(() => ({ solved: Object.keys(Game.save.solved), pages: Game.save.pages }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
