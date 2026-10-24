const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => {
    localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 9, y: 40, dir: 'down',
      flags: { chapter: 5, fogLevel: 0.25, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true, lightOn: true, ottolineSpared: true, strixSpared: true, westOpen: true, meadowsSeen: true, gaugeDone: true, sailDone: true, pumpOn: true, launchDone: true, shelterDone: true, riverbedDone: true, drained: true, leveeDone: true },
      items: { flapjack: 3, hourglass: 2 }, pages: [], solved: {}, stats: {}, daily: {}, papers: {} }));
  });
  await page.reload(); await page.waitForTimeout(500);
  await page.$eval('#title [data-a=cont]', b => b.click()); await page.waitForTimeout(500);
  const step = async (label, fn) => { console.log(label, await page.evaluate(() => SCRIPTS.objective(Game.save.flags))); await fn(); await P.drive(page, { max: 500 }); };
  await P.shot(page, 'c5-meadows');
  await step('cog-intro', () => P.talkTo(page, 'cog'));
  await P.shot(page, 'c5-lock');
  await page.evaluate(() => { Game.G.go('lockhouse', 5, 7, 'up'); }); await page.waitForTimeout(700);
  await step('dilys', () => P.talkTo(page, 'dilys'));
  await page.evaluate(() => { Game.G.go('world', 18, 50, 'down'); }); await page.waitForTimeout(700);
  await step('sluice', () => P.talkTo(page, 'sluice'));
  await step('cog', () => P.talkTo(page, 'cog'));
  await P.shot(page, 'c5-lockopen');
  for (const id of ['rowan', 'tansy', 'tansy']) await step(id, () => P.talkTo(page, id));
  await page.evaluate(() => { Game.G.go('world', 49, 8, 'up'); }); await page.waitForTimeout(700);
  await step('bramble', () => P.talkTo(page, 'bramble'));
  await P.shot(page, 'c5-bridge');
  await step('kid1', () => P.talkTo(page, 'kid1'));
  await step('cross', () => page.evaluate(() => { World.run(G => SCRIPTS.crossBridge(G)); }));
  // finale
  await page.evaluate(() => { Game.G.go('world', 10, 26, 'up'); }); await page.waitForTimeout(700);
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(700); await page.keyboard.up('ArrowUp');
  await P.drive(page);
  console.log('stillSeen', await page.evaluate(() => Game.save.flags.stillSeen));
  await P.shot(page, 'c6-marsh');
  for (const id of ['miraFog', 'echo1', 'echo2', 'echo3']) await step(id, () => P.talkTo(page, id));
  await step('mira', () => P.talkTo(page, 'miraFog'));
  await P.shot(page, 'c6-end');
  await step('miraHome', () => P.talkTo(page, 'miraHome'));
  const f = await page.evaluate(() => ({ flags: Game.save.flags, solved: Object.keys(Game.save.solved), items: Game.save.items, pages: Game.save.pages, obj: SCRIPTS.objective(Game.save.flags), jobs: SCRIPTS.jobs(Game.save.flags).length }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
