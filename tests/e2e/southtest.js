const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  // chapter 1: the cove and the south bank say "come back later"; Hob's quest works
  const go = async flags => {
    await page.evaluate(f => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 70, y: 52, dir: 'down', flags: f, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })), flags);
    await page.reload(); await page.waitForTimeout(600);
    await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(600);
  };
  const base = { rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, ropeFixed: true };
  await go({ chapter: 1, ...base });
  await P.talkTo(page, 'hob'); await P.drive(page, { shotReward: 'hob-reward' });
  console.log('ch1 hob:', await page.evaluate(() => [Game.save.flags.hobDone, !!Game.save.solved.footbridge, World.entity('hob').px / 16]));
  await P.talkTo(page, 'agnes').catch(() => {}); await P.drive(page);
  console.log('ch1 agnes (should wait):', await page.evaluate(() => !!Game.save.flags.windmillDone));
  await go({ chapter: 4, ...base, hobDone: true, eastOpen: true, lightOn: true });
  for (const id of ['shelly', 'agnes', 'pike', 'bea']) { await P.talkTo(page, id); await P.drive(page); }
  console.log('ch4:', JSON.stringify(await page.evaluate(() => ({ flags: ['shellsDone', 'windmillDone', 'pikeDone', 'orchardDone'].map(k => !!Game.save.flags[k]), items: Game.save.items, sides: Object.keys(Game.save.solved) }))));
  // the side quest list shows them
  await page.evaluate(() => Game.openMenu()); await page.waitForTimeout(300);
  await page.evaluate(() => { [...document.querySelectorAll('.menu-grid button')].find(b => /Side Quests/.test(b.textContent)).click(); }); await page.waitForTimeout(400);
  console.log('listed:', await page.evaluate(() => [...document.querySelectorAll('.job-list li b')].map(b => b.textContent).filter(t => /footbridge|shell|windmill|Pike|orchard/i.test(t))));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
