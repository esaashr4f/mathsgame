const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.$eval('#title [data-a=new]', b => b.click()); await page.waitForTimeout(400);
  await page.fill('#nm', 'Amira'); await page.keyboard.press('Enter'); await page.waitForTimeout(700);
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
  await P.shot(page, 'girl-choose');
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  console.log('gender:', await page.evaluate(() => Game.save.gender));
  // into the prologue, stop at a line spoken by the player
  for (let i = 0; i < 80; i++) {
    if (await page.$('.narrate')) await page.click('.narrate');
    else if (await page.$('.choice-box')) { await page.waitForTimeout(450); await page.keyboard.press('Enter'); }
    else if (await page.$('.dlg')) { const n = await page.$eval('.dlg', d => d.textContent); if (/Amira/.test(n)) break; await page.click('.dlg'); }
    await page.waitForTimeout(140);
  }
  await P.shot(page, 'girl-world');
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})();
