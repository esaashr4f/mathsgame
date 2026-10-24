const P = require('./play.js');
(async () => {
  const { browser, page, errors } = await P.setup();
  await page.$eval('#title [data-a=new]', b => b.click());
  await page.fill('#nm', 'Esa');
  await page.keyboard.press('Enter');
  await P.drive(page);
  await P.shot(page, 'p1-ferry');
  await P.talkTo(page, 'gull');
  await P.drive(page, { shotFinish: 'p2-gangplank-solved' });
  const f1 = await page.evaluate(() => Game.save.flags);
  console.log('after gull:', JSON.stringify(f1));
  await P.at(page, 49.5, 47); await P.drive(page); // arrive trigger
  await P.at(page, 50, 46); await P.drive(page);
  console.log('arrived:', await page.evaluate(() => Game.save.flags.arrived), 'chapter', await page.evaluate(() => Game.save.flags.chapter));
  await P.talkTo(page, 'mayor'); await P.drive(page);
  await P.shot(page, 'p3-village');
  // bakery
  await page.evaluate(() => Game.G.go('bakery', 6, 8, 'up')); await page.waitForTimeout(600);
  await P.talkTo(page, 'fen'); await P.drive(page, { shotFinish: 'p4-fen-solved' });
  await P.talkTo(page, 'oven'); await P.drive(page);
  await page.evaluate(() => Game.G.go('world', 36, 19, 'down')); await page.waitForTimeout(600);
  // wick
  await P.talkTo(page, 'wick'); await P.drive(page);
  // key + workshop
  await P.talkTo(page, 'pots3'); await P.drive(page);
  await page.evaluate(() => Game.G.go('workshop', 6, 8, 'up')); await page.waitForTimeout(600);
  await P.talkTo(page, 'desk'); await P.drive(page);
  await P.shot(page, 'p5-workshop');
  await page.evaluate(() => Game.G.go('world', 63, 19, 'down')); await page.waitForTimeout(600);
  // tomas + kid
  await P.talkTo(page, 'stall1'); await P.drive(page);
  await P.talkTo(page, 'kid1'); await P.drive(page);
  // moss
  await P.talkTo(page, 'moss'); await P.drive(page, { shotFinish: 'p6-rope-solved' });
  await P.shot(page, 'p7-crossing');
  // bramble
  await P.at(page, 49.5, 9);
  await P.talkTo(page, 'bramble');
  await page.waitForTimeout(300);
  // screenshot during battle
  for (let i = 0; i < 25; i++) { await P.drive(page, { max: 1 }); }
  await P.shot(page, 'p8-battle');
  await P.drive(page, { max: 800 });
  await P.shot(page, 'p9-after');
  const f = await page.evaluate(() => ({ flags: Game.save.flags, items: Game.save.items, pages: Game.save.pages, solved: Object.keys(Game.save.solved) }));
  console.log(JSON.stringify(f));
  console.log(errors.join('\n') || 'no errors');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
