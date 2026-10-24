// Visit every map at the start of each chapter, talk to everyone and step on every trigger.
const P = require('./play.js');
const fs = require('fs');
const states = [];
states.push({ name: 'ch1', save: { name: 'Esa', started: true, map: 'world', x: 50, y: 40, dir: 'up', flags: { chapter: 1, fogLevel: 0.55, rook: true, plank: true, arrived: true }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} } });
for (const f of ['ch2test', 'ch3test', 'ch4test', 'ch5test']) {
  const src = fs.readFileSync(f + '.js', 'utf8');
  const m = src.match(/JSON\.stringify\((\{ name: 'Esa'[\s\S]*?papers: \{\} \})\)/);
  states.push({ name: f.replace('test', ''), save: eval('(' + m[1] + ')') });
}
states.push({ name: 'open', save: { name: 'Esa', started: true, map: 'world', x: 50, y: 30, dir: 'up', flags: { chapter: 6, fogLevel: 0.1, rook: true, plank: true, arrived: true, metMayor: true, fenDone: true, ropeFixed: true, brambleSpared: true, eastOpen: true, lightOn: true, westOpen: true, drained: true, lockOpen: true, bridgeBuilt: true, marshOpen: true, hobDone: true, hallOpen: true }, items: {}, pages: [], solved: {}, stats: {}, daily: {}, papers: {} } });
const only = process.argv[2];
(async () => {
  const report = [];
  for (const st of states) {
    if (only && st.name !== only) continue;
    const { browser, page, errors } = await P.setup();
    await page.evaluate(s => localStorage.setItem('lowmarsh-save-v1', JSON.stringify(s)), st.save);
    await page.reload(); await page.waitForTimeout(500);
    await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(500);
    const maps = await page.evaluate(() => Object.keys(MAPS));
    let talks = 0;
    for (const m of maps) {
      await page.evaluate(m => { World.load(m, 5, 5, 'down'); }, m);
      await page.waitForTimeout(100);
      const ids = await page.evaluate(() => World.entities.filter(e => e.talk && !e.hidden).map(e => e.id));
      for (const id of ids) {
        const before = errors.length;
        const ok = await page.evaluate(([m, id]) => {
          if (World.mapId !== m) World.load(m, 5, 5, 'down');
          const e = World.entity(id); if (!e || e.hidden || !e.talk) return false;
          World.talkCooldown = 0;
          World.run(G => e.talk(G, e)); return true;
        }, [m, id]);
        if (!ok) continue;
        talks++;
        await P.drive(page, { max: 500 });
        for (let k = 0; k < 4 && await page.evaluate(() => World.locked) && await page.$('.panel-screen [data-a=back]'); k++) { await page.click('.panel-screen:last-of-type [data-a=back]').catch(() => {}); await P.drive(page, { max: 300 }); }
        const locked = await page.evaluate(() => World.locked);
        if (locked) { report.push(st.name + ' STUCK talking to ' + m + '/' + id); await P.shot(page, 'fuzz-stuck-' + st.name + '-' + id); await page.evaluate(() => location.reload()); await page.waitForTimeout(600); await page.evaluate(() => Game.titleChoose('cont')); await page.waitForTimeout(500); }
        if (errors.length > before) report.push(st.name + ' ' + m + '/' + id + ': ' + errors.slice(before).join(' | '));
      }
      const trigs = await page.evaluate(m => { if (World.mapId !== m) World.load(m, 5, 5, 'down'); return World.triggers.map((t, i) => i); }, m);
      for (const i of trigs) {
        const before = errors.length;
        const ran = await page.evaluate(([m, i]) => { if (World.mapId !== m) World.load(m, 5, 5, 'down'); const t = World.triggers[i]; if (!t || (t.when && !t.when(World.flags()))) return false; World.run(t.run); return true; }, [m, i]);
        if (!ran) continue;
        await P.drive(page, { max: 500 });
        if (await page.evaluate(() => World.locked)) report.push(st.name + ' STUCK on trigger ' + m + '#' + i);
        if (errors.length > before) report.push(st.name + ' trigger ' + m + '#' + i + ': ' + errors.slice(before).join(' | '));
        await page.evaluate(m => { if (World.mapId !== m) World.load(m, 5, 5, 'down'); }, m);
      }
    }
    console.log(st.name, 'maps', maps.length, 'talks', talks, 'errors', errors.length);
    await browser.close();
  }
  console.log(report.join('\n') || 'nothing found');
})().catch(e => { console.error(e); process.exit(1); });
