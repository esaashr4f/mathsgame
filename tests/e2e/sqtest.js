const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 50, y: 26, dir: 'up',
    flags: { chapter: 2, rook: true, arrived: true, wickDone: true, tomasDone: true, kidCode: true }, items: {}, pages: [], solved: { wick: true, tomas: true, kidcode: true }, stats: {}, daily: {}, papers: {} })));
  await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(600);
  console.log('stall', await page.evaluate(() => typeof SCRIPTS.stall)); await page.evaluate(() => { World.run(G => SCRIPTS.stall(G)); });
  for (let i = 0; i < 30 && !(await page.$('.nb-screen [data-t=quit]')); i++) { if (await page.$('.dlg')) await page.click('.dlg'); await page.waitForTimeout(150); }
  await P.shot(page, 'sq-quitbtn');
  await page.click('.nb-screen [data-t=quit]'); await page.waitForTimeout(500);
  console.log('after quit', JSON.stringify(await page.evaluate(() => ({ locked: World.locked, done: Game.save.flags.footpathDone || false, solved: !!Game.save.solved.footpath, toast: (document.querySelector('.toast') || {}).textContent }))));
  await page.evaluate(() => { World.run(G => SCRIPTS.stall(G)); });
  await P.drive(page, { shotReward: 'sq-reward' });
  console.log('after solve', JSON.stringify(await page.evaluate(() => ({ locked: World.locked, done: Game.save.flags.footpathDone, items: Game.save.items, shell: Game.charm('shell'), hp: Game.maxHP() }))));
  await page.evaluate(() => Game.openMenu()); await page.waitForTimeout(300);
  await page.evaluate(() => { const b = [...document.querySelectorAll('.menu-grid button')].find(b => /Side Quests/.test(b.textContent)); b.click(); }); await page.waitForTimeout(400);
  await P.shot(page, 'sq-list');
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
