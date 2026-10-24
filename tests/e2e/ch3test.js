const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => {
    localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 49, y: 20, dir: 'up',
      flags: { chapter: 3, fogLevel: 0.35, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true },
      items: { flapjack: 3, hourglass: 2 }, pages: [], solved: {}, stats: {}, daily: {}, papers: {} }));
  });
  await page.reload(); await page.waitForTimeout(500);
  await page.$eval('#title [data-a=cont]', b => b.click()); await page.waitForTimeout(500);
  const step = async (label, fn) => { console.log(label); await fn(); await P.drive(page, { max: 400 }); };
  await step('door', () => page.evaluate(() => { World.run(G => SCRIPTS.townhallDoor(G, 49)); }));
  await P.shot(page, 'c3-hall');
  await step('pim', () => P.talkTo(page, 'pim'));
  for (let i = 0; i < 4; i++) await step('mayor' + i, () => P.talkTo(page, 'mayorIn'));
  await step('register', () => P.talkTo(page, 'register'));
  await page.evaluate(() => { Game.G.go('clinic', 5, 6, 'up'); }); await page.waitForTimeout(700);
  await step('sorrel', () => P.talkTo(page, 'sorrel'));
  await page.evaluate(() => { Game.G.go('townhall', 9, 9, 'up'); }); await page.waitForTimeout(700);
  await step('strix', () => P.talkTo(page, 'strix'));
  await P.shot(page, 'c3-after');
  await page.evaluate(() => { Game.G.go('world', 52, 26, 'up'); }); await page.waitForTimeout(700);
  for (const id of ['moss', 'stall1', 'kid1', 'kid2', 'ivy']) await step(id, () => P.talkTo(page, id));
  await page.evaluate(() => { Game.G.go('bakery', 6, 6, 'up'); }); await page.waitForTimeout(700);
  await step('fen', () => P.talkTo(page, 'fen'));
  const f = await page.evaluate(() => ({ flags: Game.save.flags, solved: Object.keys(Game.save.solved) }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
