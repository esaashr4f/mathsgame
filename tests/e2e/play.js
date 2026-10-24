// Automated playthrough helper for Lowmarsh.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || (require('fs').existsSync('/opt/node-tools/node_modules/playwright') ? '/opt/node-tools/node_modules/playwright' : 'playwright'));
const OUT = '' + __dirname + '/shots/';
let shotN = 0;
function canonical(step) {
  const a = step.answer;
  switch (step.type) {
    case 'set': case 'tuple': return a.join(', ');
    case 'point': case 'vector': return '(' + a.join(', ') + ')';
    case 'integral': return a + ' + c';
    default: return String(a);
  }
}
async function setup() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (require('fs').existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined) });
  const page = await browser.newPage({ viewport: { width: 1000, height: 820 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://localhost:8765/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
  return { browser, page, errors };
}
// Handle whatever UI is up until the world is free again. Returns when idle.
async function drive(page, opts = {}) {
  const shots = opts.shots || [];
  for (let n = 0; n < (opts.max || 400); n++) {
    await page.waitForTimeout(90);
    const state = await page.evaluate(() => ({
      narrate: !!document.querySelector('.narrate'), card: !!document.querySelector('.chapter-card'),
      choice: !!document.querySelector('.choice-box'), dlg: !!document.querySelector('.dlg:not(.choice-box)'),
      nb: !!document.querySelector('.nb-screen .notebook'), finish: !!document.querySelector('.finish'),
      battle: !!document.querySelector('.battle'), locked: World.locked, step: window.__step ? true : false,
      cmdsOn: document.querySelector('.cmd') ? !document.querySelector('.cmd').disabled : false,
      sub: !!document.querySelector('.submenu'), ansBattle: !!document.querySelector('.btl-box .ans, .btl-box .choice'),
      btlText: !!document.querySelector('.btl-box .btl-text'), bubble: document.querySelector('.bubble') && !document.querySelector('.bubble').classList.contains('hidden'),
      dodge: !!document.querySelector('canvas.dodge'),
    }));
    if (await page.$('.who-pick >> visible=true')) { await page.click('.who-pick button >> visible=true'); continue; }
    if (await page.$('.reward button')) { if (opts.shotReward) await page.screenshot({ path: OUT + opts.shotReward + '.png' }); await page.click('.reward button'); continue; }
    if (state.narrate) { await page.click('.narrate'); continue; }
    if (state.card) { await page.click('.chapter-card button'); continue; }
    if (state.choice) { await page.keyboard.press(opts.choiceKey || 'z'); continue; }
    if (state.dlg) { await page.click('.dlg'); continue; }
    if (state.battle) {
      if (state.dodge) { await page.waitForTimeout(400); continue; }
      if (state.bubble) { await page.click('.bubble'); continue; }
      if (state.ansBattle) { await answer(page, '.btl-box'); continue; }
      if (state.sub) {
        const labels = await page.$$eval('.submenu button', bs => bs.map(b => b.textContent));
        let idx = labels.findIndex(l => /Work it out/.test(l));
        if (idx < 0) idx = labels.findIndex(l => /Spare/.test(l));
        if (idx < 0) idx = labels.length - 1;
        await page.click('.submenu button:nth-child(' + (idx + 1) + ')');
        continue;
      }
      if (state.cmdsOn) {
        const spare = await page.evaluate(() => document.querySelector('.enemy-name').classList.contains('spare'));
        await page.click('.cmd[data-c="' + (spare ? 3 : 1) + '"]');
        continue;
      }
      if (state.btlText) { await page.click('.btl-box'); continue; }
      continue;
    }
    if (state.nb) {
      if (state.finish) { if (opts.shotFinish) await page.screenshot({ path: OUT + (opts.shotFinish) + '.png', fullPage: false }); await page.click('.finish'); continue; }
      await answer(page, '.nb-screen');
      continue;
    }
    if (!state.locked) return;
  }
}
async function answer(page, scope) {
  const step = await page.evaluate(() => { const s = window.__step; return s && s.problem.steps[s.i]; });
  if (!step) return;
  if (step.type === 'choice') {
    await page.click(scope + ' .choice[data-c="' + step.answer + '"]');
  } else {
    await page.fill(scope + ' .ans', canonical(step));
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(150);
}
async function talkTo(page, id) {
  await page.evaluate(id => {
    const e = World.entity(id);
    World.player.x = e.px; World.player.y = e.py + 14; World.player.dir = 'up';
    World.talkCooldown = 0;
    World.interact();
  }, id);
  await page.waitForTimeout(150);
}
async function at(page, x, y) {
  await page.evaluate(([x, y]) => { World.player.x = x * 16 + 8; World.player.y = y * 16 + 14; }, [x, y]);
  await page.waitForTimeout(250);
}
async function shot(page, name) { await page.screenshot({ path: OUT + name + '.png' }); }
module.exports = { setup, drive, talkTo, at, shot, answer, OUT };
