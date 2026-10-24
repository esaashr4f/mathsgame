const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.evaluate(() => localStorage.setItem('lowmarsh-save-v1', JSON.stringify({ name: 'Esa', started: true, map: 'world', x: 49, y: 21, dir: 'up', flags: { chapter: 1, rook: true, plank: true, arrived: true }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} })));
  await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(700);
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(1600); await page.keyboard.up('ArrowUp');
  const msg = await page.evaluate(() => (document.querySelector('.dlg-text') || {}).textContent || '');
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(400); }
  await page.waitForTimeout(800);
  const end = await page.evaluate(() => ({ tile: [Math.floor(World.player.x / 16), Math.floor((World.player.y - 2) / 16)], under: World.tile(Math.floor(World.player.x / 16), Math.floor((World.player.y - 2) / 16)), locked: World.locked }));
  console.log('message:', msg.slice(0, 60), '\nended at', JSON.stringify(end));
  await P.shot(page, 'door-after');
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
