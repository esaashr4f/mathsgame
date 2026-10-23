// Pixel-art sprites drawn from strings. Each character is one pixel; '.' is transparent.
// NPCs reuse the human template with their own palette so the cast stays consistent.
(function () {
  'use strict';

  const BASE = {
    k: '#1a1a24', s: '#f1c7a1', S: '#c99a76', e: '#14141c', h: '#4a2f22', b: '#3f6fb0', y: '#e8c24a', p: '#3a3550',
    w: '#f4f1e8', W: '#b9b3a6', r: '#c0403a', R: '#7e2a26', g: '#5f8f4a', G: '#3c5e30', n: '#7a5232', N: '#4f3420',
    o: '#e07b39', c: '#22222e', C: '#4b4b63', t: '#7f9a7a', T: '#56705a', l: '#9bd3e8', v: '#7d5ea8', m: '#b07fc8',
  };

  const HUMAN_DOWN = [
    '...kkkkkk...',
    '..khhhhhhk..',
    '.khhhhhhhhk.',
    '.khhsssshhk.',
    '.khsssssshk.',
    '.ksessssesk.',
    '.kssssssssk.',
    '..kssssssk..',
    '.kbbyyyybbk.',
    'kbbbbbbbbbbk',
    'ksbyyyyyybsk',
    'ksbbbbbbbbsk',
    '.kbyyyyyybk.',
    '.kppppppppk.',
    '.kppk..kppk.',
    '.kkkk..kkkk.',
  ];
  const HUMAN_UP = HUMAN_DOWN.map((row, i) => (i >= 3 && i <= 6 ? '.khhhhhhhhk.' : i === 7 ? '..khhhhhhk..' : row));
  const HUMAN_SIDE = [
    '...kkkkkk...',
    '..khhhhhhk..',
    '.khhhhhhhhk.',
    '.khhhhhsssk.',
    '.khhhhsssssk',
    '.khhhsssesk.',
    '.khhssssssk.',
    '..khsssssk..',
    '..kbbyyyyk..',
    '.kbbbbbbbk..',
    '.kyyyysyyk..',
    '.kbbbbsbbk..',
    '.kyyyyyyk...',
    '..kppppk....',
    '..kpkkpk....',
    '..kk..kk....',
  ];
  // Walk frame: shift the feet.
  const stepFrame = rows => rows.map((r, i) => (i === 14 ? r.replace('.kppk..kppk.', '..kpk.kppk..').replace('..kpkkpk....', '..kppkpk....') : i === 15 ? r.replace('.kkkk..kkkk.', '..kkk.kkkk..') : r));

  const ART = {
    rook: [
      '....ccc.....',
      '...ccccc....',
      '..ccCwecoo..',
      '.cccccccc...',
      'ccCCCCcccc..',
      'cCCCCCccc...',
      '.cccccccc...',
      '..cccccc....',
      '...o..o.....',
      '..oo.oo.....',
    ],
    rook2: [
      '....ccc.....',
      'C..ccccc....',
      'CCccCwecoo..',
      '.Ccccccccc..',
      '..cCCCcccc..',
      '...CCccc....',
      '..ccccccc...',
      '..cccccc....',
      '...o..o.....',
      '..oo.oo.....',
    ],
    bramble: [
      '....kkkkkkkk....',
      '...kttttttttk...',
      '..kttTttttTttk..',
      '.kttwettttewttk.',
      '.kttttttttttttk.',
      '.kttTwwwwwwTttk.',
      '..kttttttttttk..',
      '.kgggttttttgggk.',
      'kgggttttttttgggk',
      'kttttttttttttttk',
      'kttkttttttttkttk',
      'kttkNNNNNNNNkttk',
      '.kk.kttttttk.kk.',
      '....kttkkttk....',
      '....kttk.kttk...',
      '...kkkkk.kkkkk..',
    ],
    duck: [
      '....kkk...',
      '...kgggk..',
      '...kgegkoo',
      'kkkkgggk..',
      'kwwwwwwwk.',
      'kwwwWWwwk.',
      '.kwwwwwk..',
      '..kkkkk...',
    ],
    goat: [
      '.N.N........',
      '.kNk........',
      'kwwwk.......',
      'kwewk..kkkk.',
      '.kwwkkkwwwwk',
      '..kwwwwwwwWk',
      '..kwwwwwwWWk',
      '..kWwkkkwWk.',
      '..kNk...kNk.',
      '..kk....kk..',
    ],
    cat: [
      'k...k.....',
      'kokok.....',
      'koook.....',
      'keoek...k.',
      'kooookkko.',
      '.kooooooko',
      '.koooooook',
      '.kokkkok..',
    ],
    seagull: [
      'k.......k.',
      'wk.....kw.',
      '.wwk.kww..',
      '..wwwwwyy.',
      '...WwwW...',
    ],
    barrel: [
      '..kkkkkk..',
      '.knnnnnnk.',
      'kNnnnnnnNk',
      'kWWWWWWWWk',
      'knnnnnnnnk',
      'kNnnnnnnNk',
      'knnnnnnnnk',
      'kWWWWWWWWk',
      'kNnnnnnnNk',
      '.knnnnnnk.',
      '..kkkkkk..',
    ],
    crate: [
      'kkkkkkkkkkkk',
      'knnnnnnnnnnk',
      'knNnnnnnnNnk',
      'knnNnnnnNnnk',
      'knnnNnnNnnnk',
      'knnnnNNnnnnk',
      'knnnnNNnnnnk',
      'knnnNnnNnnnk',
      'knnNnnnnNnnk',
      'knNnnnnnnNnk',
      'knnnnnnnnnnk',
      'kkkkkkkkkkkk',
    ],
    sign: [
      'kkkkkkkkkkkk',
      'knnnnnnnnnnk',
      'knwwwwwwwwnk',
      'knnnnnnnnnnk',
      'knwwwwwwnnnk',
      'knnnnnnnnnnk',
      'kkkkkkkkkkkk',
      '.....kk.....',
      '.....kk.....',
      '.....kk.....',
      '....kkkk....',
    ],
    bench: [
      'kkkkkkkkkkkkkkkk',
      'knnnnnnnnnnnnnnk',
      'kkkkkkkkkkkkkkkk',
      'knnnnnnnnnnnnnnk',
      'kkkkkkkkkkkkkkkk',
      '.kk..........kk.',
      '.kk..........kk.',
    ],
    net: [
      'k.k.k.k.k.k.',
      '.k.k.k.k.k.k',
      'k.k.k.k.k.k.',
      '.k.k.k.k.k.k',
      'kkkkkkkkkkkk',
      'knnnnnnnnnnk',
      'kkkkkkkkkkkk',
    ],
    flowerbox: [
      '.r.y.r.y.r..',
      'rgrgygrgyg..',
      '.g.g.g.g.g..',
      'kkkkkkkkkkk.',
      'knnnnnnnnnk.',
      'kkkkkkkkkkk.',
    ],
    owl: [
      '.k..........k.',
      '.kk........kk.',
      '.knkkkkkkkknk.',
      'knnnnnnnnnnnnk',
      'knwwwnnnnwwwnk',
      'knwyewnnwyewnk',
      'knwwwnoonwwwnk',
      'knnnnnoonnnnnk',
      'knWnWnnnnWnWnk',
      'knnWnWnnWnWnnk',
      'knWnWnnnnWnWnk',
      '.knnnnnnnnnnk.',
      '..kkknnnnkkk..',
      '...oo.kk.oo...',
    ],
    wend: [
      '......kkkk..........',
      '.....kllllk.........',
      '....kllellk.........',
      '....klllllbk........',
      '.....kkkllbk........',
      '........klbk........',
      '.......kllbk....kk..',
      '......kllbk....kllk.',
      '.....kllbk....kllbk.',
      '....kllbk....kllbk..',
      '....kllbbkkkkllbk...',
      '.....kllbbbbbbk.....',
      '......kkkkkkkk......',
    ],
    cog: [
      '....kkkkkkkk....',
      '...kWWWWWWWWk...',
      '...kWyWWWWyWk...',
      '...kWWWWWWWWk...',
      '....kkWWWWkk....',
      '..kkWWWWWWWWkk..',
      '.kWWWnnnnnnWWWk.',
      'kWWkWnnonnnWkWWk',
      'kWWkWWWWWWWWkWWk',
      'kWWkWWnnnnWWkWWk',
      '.kk.kWWWWWWk.kk.',
      '....kWWkkWWk....',
      '....kWWk.kWWk...',
      '...kkkkk.kkkkk..',
    ],
    heart: [
      '.rr.rr.',
      'rrrrrrr',
      'rrrrrrr',
      '.rrrrr.',
      '..rrr..',
      '...r...',
    ],
    page: [
      'kkkkkkk.',
      'kwwwwwkk',
      'kwWWWwwk',
      'kwwwwwwk',
      'kwWWWWwk',
      'kwwwwwwk',
      'kwWWWwwk',
      'kkkkkkkk',
    ],
    pot: [
      '..gGg...',
      '.gGgGg..',
      '..gGg...',
      'kkkkkkk.',
      'knooonk.',
      '.knonk..',
      '.kkkkk..',
    ],
    lamp: [
      '..kkk..',
      '.kyyyk.',
      '.kyoyk.',
      '..kkk..',
      '...k...',
      '...k...',
      '...k...',
      '...k...',
      '...k...',
      '...k...',
      '..kkk..',
    ],
    board: [
      'kkkkkkkkkkkkkk',
      'knnnnnnnnnnnnk',
      'knwwwnwwwwwnnk',
      'knwWwnwWWwwnnk',
      'knwwwnwwwwwnnk',
      'knnnnnwwwnnnnk',
      'knnnnnnnnnnnnk',
      'kkkkkkkkkkkkkk',
      '..kNk....kNk..',
      '..kNk....kNk..',
      '..kNk....kNk..',
    ],
  };

  // Palettes for each human-shaped character.
  const PEOPLE = {
    player: {},
    fen: { h: '#8a4b2a', b: '#c0403a', y: '#f4f1e8', p: '#7e2a26' },
    gull: { h: '#2b3a55', b: '#2b3a55', y: '#e8e2d0', s: '#e3b48c', p: '#22222e' },
    mayor: { h: '#1a1a24', b: '#7d5ea8', y: '#c0403a', p: '#2d2d3a' },
    moss: { h: '#3c5e30', b: '#5f8f4a', y: '#e07b39', s: '#d9a57c', p: '#4f3420' },
    wick: { h: '#b9b3a6', b: '#4f3420', y: '#7a5232', s: '#e3b48c', p: '#2d2d3a' },
    villager: { h: '#6b3b2a', b: '#3c7a6a', y: '#9bd3e8', p: '#3a3550' },
    villager2: { h: '#d8b04a', b: '#b0607a', y: '#f4f1e8', p: '#4b4b63' },
    mira: { h: '#2a1a14', b: '#3c7a6a', y: '#e8c24a', p: '#4f3420' },
    nell: { h: '#c0603a', b: '#e8e2d0', y: '#3f6fb0', s: '#e3b48c', p: '#2b3a55' },
    sorrel: { h: '#14141c', b: '#f4f1e8', y: '#9bd3e8', s: '#9a6a4a', p: '#3a3550' },
    pim: { h: '#7a5232', b: '#5a4a6a', y: '#e8c24a', p: '#2d2d3a' },
    jan: { h: '#e8e2d0', b: '#5f8f4a', y: '#3c5e30', s: '#e3b48c', p: '#4f3420' },
    ivy: { h: '#b9b3a6', b: '#b07fc8', y: '#5f8f4a', s: '#e3b48c', p: '#4f3420' },
    kid: { h: '#e8c24a', b: '#c0403a', y: '#f4f1e8', p: '#3f6fb0' },
    ottoline: { h: '#d6e6ff', b: '#8fa8cc', y: '#cfe0ff', s: '#e6eefb', e: '#4a5a7a', p: '#7a90b8', k: '#5a6a8a' },
    rowan: { h: '#8a6038', b: '#5f8f4a', y: '#7a5232', s: '#d9a57c', p: '#3a3550' },
    tansy: { h: '#c0603a', b: '#e8c24a', y: '#5f8f4a', p: '#4f3420' },
    shadow: { h: '#1a1024', b: '#2a1838', y: '#c77dff', s: '#2a1838', e: '#ff4d6d', p: '#1a1024' },
  };

  const cache = new Map();

  function build(rows, pal, flip) {
    const h = rows.length, w = Math.max(...rows.map(r => r.length));
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (ch === '.' || ch === ' ') continue;
        x.fillStyle = pal[ch] || BASE[ch] || '#f0f';
        x.fillRect(flip ? w - 1 - i : i, j, 1, 1);
      }
    });
    return c;
  }

  // name: 'player' | npc id | art key. dir: down/up/left/right. frame: 0/1
  function get(name, dir, frame) {
    const key = name + '|' + (dir || '') + '|' + (frame || 0);
    if (cache.has(key)) return cache.get(key);
    let canvas;
    if (PEOPLE[name]) {
      const pal = Object.assign({}, BASE, PEOPLE[name]);
      let rows = dir === 'up' ? HUMAN_UP : dir === 'left' || dir === 'right' ? HUMAN_SIDE : HUMAN_DOWN;
      if (name === 'mayor') rows = ['..kkkkkkkk..', '..kkkkkkkk..', 'kkkkkkkkkkkk'].concat(rows.slice(3));
      if (name === 'gull') rows = ['............', '..kkkkkkkk..', '.kbbbbbbbbk.', 'kkkkkkkkkkkk'].concat(rows.slice(4));
      if (frame) rows = stepFrame(rows);
      canvas = build(rows, pal, dir === 'left');
    } else {
      canvas = build(ART[name] || ART.page, BASE, dir === 'left');
    }
    cache.set(key, canvas);
    return canvas;
  }

  // A portrait data URL (head and shoulders, scaled up) for dialogue boxes.
  function portrait(name) {
    const key = 'portrait|' + name;
    if (cache.has(key)) return cache.get(key);
    const src = get(name, PEOPLE[name] ? 'down' : 'right');
    const crop = PEOPLE[name] ? { w: 12, h: 10 } : { w: src.width, h: src.height };
    const scale = 6;
    const c = document.createElement('canvas');
    c.width = crop.w * scale; c.height = crop.h * scale;
    const x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(src, 0, 0, crop.w, crop.h, 0, 0, crop.w * scale, crop.h * scale);
    const url = c.toDataURL();
    cache.set(key, url);
    return url;
  }

  window.Sprites = { get, portrait, BASE, isPerson: n => !!PEOPLE[n] };
})();
