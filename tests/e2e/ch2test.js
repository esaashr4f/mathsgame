const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => {
    localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 76, y: 26, dir: 'right',
      flags: { chapter: 2, fogLevel: 0.45, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, blueprint: true, ropeFixed: true, brambleSpared: true, eastOpen: true },
      items: { flapjack: 3, hourglass: 2 }, pages: ['quadratics', 'indices', 'graphs'], solved: {}, stats: {}, daily: {}, papers: {} }));
  });
  await page.reload(); await page.waitForTimeout(500);
  await page.$eval('#title [data-a=cont]', b => b.click()); await page.waitForTimeout(500);
  console.log('start'); await P.at(page, 80, 26); await P.drive(page, {max: 200}); console.log('arrived', await page.evaluate(() => Game.save.flags.gullPointSeen));
  await P.shot(page, 'c2-gullpoint');
  for (const id of ['nell', 'jan', 'pebble']) { console.log('talk', id); await P.talkTo(page, id); await P.drive(page, { shotFinish: 'c2-' + id, max: 300 }); console.log(' done', JSON.stringify(await page.evaluate(() => Object.keys(Game.save.solved)))); }
  await page.evaluate(() => { World.run(G => SCRIPTS.lighthouseDoor(G)); }); await P.drive(page);
  await P.shot(page, 'c2-lighthouse');
  await P.talkTo(page, 'gears'); await P.drive(page, { shotFinish: 'c2-gears' });
  await page.evaluate(() => { World.run(G => SCRIPTS.stairs(G)); }); await P.drive(page);
  await P.shot(page, 'c2-lamproom');
  for (const id of ['shutters', 'frame', 'mirrors']) { await P.talkTo(page, id); await P.drive(page, { shotFinish: 'c2-' + id }); }
  await P.talkTo(page, 'lampCore');
  for (let i = 0; i < 30; i++) await P.drive(page, { max: 1 });
  await P.shot(page, 'c2-battle');
  await P.drive(page, { max: 900 });
  await P.shot(page, 'c2-lit');
  await page.evaluate(() => { Game.G.go('world', 84, 24, 'up'); }); await page.waitForTimeout(800);
  await P.shot(page, 'c2-beam');
  const f = await page.evaluate(() => ({ flags: Game.save.flags, pages: Game.save.pages, solved: Object.keys(Game.save.solved) }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
