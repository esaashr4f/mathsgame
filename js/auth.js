// Accounts. Email accounts work out of the box and are kept on this device (passwords are salted and
// hashed with PBKDF2, never stored). Google and Apple sign-in, and accounts that follow you between devices,
// switch on when a Firebase project is configured in js/auth-config.js (see docs/ACCOUNTS.md).
(function () {
  'use strict';
  const KEY = 'lowmarsh-auth-v1';
  const cfg = window.LOWMARSH_AUTH || {};
  let db = { users: {}, session: null };
  try { db = Object.assign(db, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ } };
  const listeners = [];
  const changed = () => { save(); listeners.forEach(f => f(db.session)); };
  const fail = (code, message) => { const e = new Error(message); e.code = code; throw e; };

  const enc = new TextEncoder();
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  async function hash(password, salt) {
    if (!(window.crypto && crypto.subtle)) fail('no-crypto', 'This browser can\'t create accounts securely. Try a newer browser.');
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256));
  }
  const newId = () => hex(crypto.getRandomValues(new Uint8Array(12)));
  const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const findUser = id => {
    const k = String(id || '').trim().toLowerCase();
    if (db.users[k]) return db.users[k];
    return Object.values(db.users).find(u => u.username && u.username.toLowerCase() === k);
  };

  // ── Firebase (optional) ──
  let fb = null;
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Couldn\'t reach the sign-in service. Check your connection.')); document.head.appendChild(s); });
  async function firebase() {
    if (!cfg.firebase) return null;
    if (fb) return fb;
    const v = '10.12.2';
    await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/' + v + '/firebase-auth-compat.js');
    window.firebase.initializeApp(cfg.firebase);
    fb = window.firebase.auth();
    return fb;
  }
  // Firebase restores a signed-in user asynchronously after a reload; wait for it before touching the database.
  async function firebaseUser() {
    const a = await firebase();
    if (!a) return null;
    if (a.currentUser) return a.currentUser;
    return new Promise(res => { const off = a.onAuthStateChanged(u => { off(); res(u); }); });
  }
  let store = null;
  async function firestore() {
    if (store) return store;
    await firebase();
    await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
    store = window.firebase.firestore();
    return store;
  }
  // On a new device, bring the username back from the account's profile.
  async function withProfile(session) {
    if (session.username) return session;
    try {
      const doc = await (await firestore()).collection('profiles').doc(session.uid).get();
      if (doc.exists && doc.data().username) {
        session.username = doc.data().username;
        const rec = db.users['uid:' + session.uid];
        if (rec) rec.username = session.username;
        changed();
      }
    } catch (e) { /* offline: they can pick it again */ }
    return session;
  }
  const providerSession = (u, provider) => {
    const prev = db.users['uid:' + u.uid];
    const rec = db.users['uid:' + u.uid] = Object.assign({ uid: u.uid, provider, email: u.email || '', username: prev ? prev.username : '' }, prev || {});
    db.session = { uid: rec.uid, provider, email: rec.email, username: rec.username };
    changed();
    return db.session;
  };

  const Auth = {
    get configured() { return !!cfg.firebase; },
    current: () => db.session,
    onChange: f => listeners.push(f),

    async signUp(email, password) {
      email = String(email || '').trim().toLowerCase();
      if (!validEmail(email)) fail('bad-email', 'That doesn\'t look like an email address.');
      if (String(password || '').length < 8) fail('weak', 'Use a password of at least 8 characters.');
      if (cfg.firebase) {
        const a = await firebase();
        const r = await a.createUserWithEmailAndPassword(email, password).catch(e => fail(e.code, friendly(e)));
        return withProfile(providerSession(r.user, 'email'));
      }
      if (db.users[email]) fail('exists', 'There\'s already an account with that email. Try signing in.');
      const salt = newId();
      db.users[email] = { uid: newId(), provider: 'email', email, salt, hash: await hash(password, salt), username: '' };
      db.session = { uid: db.users[email].uid, provider: 'email', local: true, email, username: '' };
      changed();
      return db.session;
    },

    async signIn(id, password) {
      const raw = String(id || '').trim();
      if (cfg.firebase && validEmail(raw)) {
        const a = await firebase();
        const r = await a.signInWithEmailAndPassword(raw.toLowerCase(), password).catch(e => fail(e.code, friendly(e)));
        return withProfile(providerSession(r.user, 'email'));
      }
      const u = findUser(raw);
      if (!u || !u.hash) fail('no-user', 'No account with that email or username on this device.');
      if (await hash(password, u.salt) !== u.hash) fail('wrong', 'Wrong password.');
      db.session = { uid: u.uid, provider: 'email', local: true, email: u.email, username: u.username };
      changed();
      return db.session;
    },

    async signInWith(which) {
      if (!cfg.firebase) fail('not-configured', (which === 'apple' ? 'Apple' : 'Google') + ' sign-in isn\'t switched on for this copy of Lowmarsh yet. Use email for now.');
      const a = await firebase();
      const p = which === 'apple' ? new window.firebase.auth.OAuthProvider('apple.com') : new window.firebase.auth.GoogleAuthProvider();
      const r = await a.signInWithPopup(p).catch(e => fail(e.code, friendly(e)));
      return withProfile(providerSession(r.user, which));
    },

    validUsername(name) {
      name = String(name || '').trim();
      if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return '3 to 16 letters, numbers or underscores.';
      const taken = Object.values(db.users).find(u => u.username && u.username.toLowerCase() === name.toLowerCase() && u.uid !== (db.session && db.session.uid));
      return taken ? 'That username is taken.' : '';
    },
    async setUsername(name) {
      const err = Auth.validUsername(name);
      if (err) fail('bad-username', err);
      // With Firebase, usernames are claimed in the database so they're unique across every device:
      // usernames/<lowercase name> -> uid, and profiles/<uid> -> { username }.
      if (Auth.cloud.available) {
        const u = await firebaseUser();
        const fs = await firestore(), key = name.trim().toLowerCase(), old = (db.session.username || '').toLowerCase();
        await fs.runTransaction(async t => {
          const claim = await t.get(fs.collection('usernames').doc(key));
          if (claim.exists && claim.data().uid !== u.uid) fail('taken', 'That username is taken.');
          t.set(fs.collection('usernames').doc(key), { uid: u.uid });
          if (old && old !== key) t.delete(fs.collection('usernames').doc(old));
          t.set(fs.collection('profiles').doc(u.uid), { username: name.trim() }, { merge: true });
        }).catch(e => fail(e.code || 'taken', e.code === 'taken' ? e.message : 'Couldn\'t save your username. Check your connection and try again.'));
      }
      const u = Object.values(db.users).find(x => x.uid === db.session.uid);
      if (u) u.username = name.trim();
      db.session.username = name.trim();
      changed();
    },

    // Saves that follow the player between devices: one document per account, saves/<uid>, readable and
    // writable only by that account (see the security rules in docs/ACCOUNTS.md). Off without Firebase.
    cloud: {
      get available() { return !!(cfg.firebase && db.session && !db.session.local); },
      async load() {
        if (!Auth.cloud.available) return null;
        const u = await firebaseUser();
        if (!u) return null;
        const doc = await (await firestore()).collection('saves').doc(u.uid).get();
        if (!doc.exists) return null;
        const d = doc.data();
        try { return { updatedAt: d.updatedAt || 0, save: JSON.parse(d.data) }; } catch (e) { return null; }
      },
      async save(data) {
        if (!Auth.cloud.available) return false;
        const u = await firebaseUser();
        if (!u) return false;
        await (await firestore()).collection('saves').doc(u.uid).set({ data: JSON.stringify(data), updatedAt: data.updatedAt || Date.now() });
        return true;
      },
    },

    async signOut() {
      if (fb) await fb.signOut().catch(() => {});
      db.session = null;
      changed();
    },
  };

  function friendly(e) {
    const m = {
      'auth/popup-closed-by-user': 'The sign-in window was closed.',
      'auth/email-already-in-use': 'There\'s already an account with that email. Try signing in.',
      'auth/invalid-credential': 'Wrong email or password.',
      'auth/wrong-password': 'Wrong password.',
      'auth/user-not-found': 'No account with that email.',
      'auth/weak-password': 'Use a stronger password.',
      'auth/unauthorized-domain': 'Sign-in isn\'t allowed from this web address yet.',
    };
    return m[e.code] || e.message || 'Sign-in failed.';
  }

  window.Auth = Auth;
})();
