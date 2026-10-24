const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => {
    localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 30, y: 27, dir: 'left',
      flags: { chapter: 4, fogLevel: 0.3, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true, strixSpared: true, westOpen: true },
      items: { flapjack: 3, hourglass: 2 }, pages: [], solved: {}, stats: {}, daily: {}, papers: {} }));
  });
  await page.reload(); await page.waitForTimeout(500);
  await page.$eval('#title [data-a=cont]', b => b.click()); await page.waitForTimeout(500);
  const step = async (label, fn) => { console.log(label); await fn(); await P.drive(page, { max: 500 }); };
  // walk west into the trigger
  await page.keyboard.down('ArrowLeft'); await page.waitForTimeout(1500); await page.keyboard.up('ArrowLeft');
  await P.drive(page);
  console.log('meadowsSeen', await page.evaluate(() => Game.save.flags.meadowsSeen));
  await P.shot(page, 'c4-arrive');
  await step('rowan', () => P.talkTo(page, 'rowan'));
  await step('windpump', () => P.talkTo(page, 'windpump'));
  await P.at(page, 9, 31); await P.shot(page, 'c4-causeway');
  await step('launch', () => page.evaluate(() => { World.player.x = 9 * 16 + 8; World.player.y = 34.6 * 16 + 8; World.player.dir = 'right'; World.talkCooldown = 0; World.interact(); }));
  await P.shot(page, 'c4-island');
  await step('tansy', () => P.talkTo(page, 'tansy'));
  await step('stake', () => P.talkTo(page, 'stake'));
  await step('back', () => page.evaluate(() => { World.player.x = 15 * 16 + 8; World.player.y = 35.6 * 16 + 8; World.player.dir = 'left'; World.talkCooldown = 0; World.interact(); }));
  await page.evaluate(() => { World.player.x = 9 * 16 + 8; World.player.y = 38 * 16 + 8; World.player.dir = 'right'; });
  await P.shot(page, 'c4-wend');
  await step('wend', () => page.evaluate(() => (World.talkCooldown = 0, World.interact())));
  await P.shot(page, 'c4-drained');
  await step('brambleLevee', () => page.evaluate(() => { World.run(G => SCRIPTS.brambleLevee(G)); }));
  for (const id of ['wick', 'moss']) await step(id, () => P.talkTo(page, id));
  await page.evaluate(() => { Game.G.go('bakery', 6, 6, 'up'); }); await page.waitForTimeout(700);
  await step('fen', () => P.talkTo(page, 'fen'));
  await page.evaluate(() => { Game.G.go('world', 20, 41, 'up'); }); await page.waitForTimeout(700);
  await step('tansy-soup', () => P.talkTo(page, 'tansy'));
  await page.evaluate(() => { Game.G.go('clinic', 5, 6, 'up'); }); await page.waitForTimeout(700);
  await step('sorrel', () => P.talkTo(page, 'sorrel'));
  await page.evaluate(() => { Game.G.go('world', 84, 32, 'up'); }); await page.waitForTimeout(700);
  for (const id of ['nell', 'jan']) await step(id, () => P.talkTo(page, id));
  const f = await page.evaluate(() => ({ flags: Game.save.flags, solved: Object.keys(Game.save.solved), items: Game.save.items, pages: Game.save.pages, jobs: SCRIPTS.jobs(Game.save.flags).filter(j => !j.done).map(j => j.title) }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
