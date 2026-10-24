const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.$eval('#title [data-a=new]', b => b.click()); await page.waitForTimeout(400);
  await page.fill('#nm', 'Esa'); await page.keyboard.press('Enter');
  await P.drive(page);
  await P.talkTo(page, 'gull');
  for (let i = 0; i < 40 && !(await page.$('.nb-screen [data-t=quit]')); i++) { if (await page.$('.dlg')) await page.click('.dlg'); await page.waitForTimeout(150); }
  await P.shot(page, 'plank-quit');
  // press Esc while typing in the answer box
  await page.focus('.nb-screen .ans'); await page.keyboard.type('20'); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({ notebook: !!document.querySelector('.nb-screen'), locked: World.locked, plank: !!Game.save.flags.plank, toast: (document.querySelector('.toast') || {}).textContent }));
  console.log('after Esc:', JSON.stringify(after));
  // open the menu and save
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  console.log('menu open:', !!(await page.$('.menu-box')));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  // talk again: the problem comes back and can be solved
  console.log('before talking again:', JSON.stringify(await page.evaluate(() => ({ menu: !!document.querySelector('.menu-box'), panels: document.querySelectorAll('.panel-screen').length, locked: World.locked }))));
  await P.talkTo(page, 'gull'); await page.waitForTimeout(300); console.log('talking:', await page.evaluate(() => World.locked)); await P.drive(page);
  console.log('solved after coming back:', await page.evaluate(() => !!Game.save.flags.plank));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
