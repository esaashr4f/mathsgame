# Accounts and sign-in

The game has a Log In button (top right of the main menu), a sign-in / sign-up page, a choose-a-username step and a profile page. Each account gets its own save. The first time someone signs in, their current guest progress moves across to the account.

## How it works out of the box

With `js/auth-config.js` left empty:

- **Email accounts work**, but they live on the device and browser where they were made. Passwords are never stored: they're salted and hashed with PBKDF2 (120,000 rounds of SHA-256) in `js/auth.js`. You can sign in with your email or your username.
- **Google and Apple buttons** are shown, but say that they aren't switched on yet. There's no way to sign in with Google or Apple without registering the game with them.

## Switching on Google, Apple and accounts that work on any device

This uses Firebase Authentication. It's free at this scale and needs no server of your own.

1. Go to <https://console.firebase.google.com>, create a project, and add a **Web app**. Copy the config object it shows you.
2. Paste it into `js/auth-config.js`:
   ```js
   window.LOWMARSH_AUTH = {
     firebase: { apiKey: '…', authDomain: '…firebaseapp.com', projectId: '…', appId: '…' },
   };
   ```
   These values are meant to be public. They identify the project and don't grant access.
3. In Firebase, open **Authentication → Sign-in method** and enable:
   - **Email/Password**.
   - **Google**: one click.
   - **Apple**: needs an Apple Developer account (£79 / $99 a year). Create a Services ID and a key in Apple's developer portal, then paste them into Firebase. Firebase's Apple page walks you through it.
4. In **Authentication → Settings → Authorised domains**, add the domain the game is hosted on (for example `yourname.github.io`).

Once that's done, email sign-up also goes through Firebase, so the same login works on any device.

## What still stays on the device

Progress (story, stats, papers, streak) is still saved in the browser, keyed to the account. To make saves follow you between devices, the next step would be to store them in Firestore under the user's id. That's about 40 lines in `main.js` (`persist` and `loadSave`), and can come later.
