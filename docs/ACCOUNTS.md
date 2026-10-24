# Accounts and sign-in

The game has a Log In button (top right of the main menu), a sign-in / sign-up page, a choose-a-username step and a profile page. Each account gets its own save. The first time someone signs in, their current guest progress moves across to the account.

## How it works out of the box

With `js/auth-config.js` left empty:

- **Email accounts work**, but they live on the device and browser where they were made. Passwords are never stored: they're salted and hashed with PBKDF2 (120,000 rounds of SHA-256) in `js/auth.js`. You can sign in with your email or your username.
- **Google and Apple buttons** are shown, but say that they aren't switched on yet. There's no way to sign in with Google or Apple without registering the game with them.

## Switching on Google, Apple and accounts that work on any device

This uses Firebase (Authentication for sign-in, Firestore for saves). It's free at this scale and needs no server of your own.

1. Go to <https://console.firebase.google.com>, create a project, and add a **Web app**. Copy the config object it shows you.
2. Paste it into `js/auth-config.js`:
   ```js
   window.LOWMARSH_AUTH = {
     firebase: { apiKey: '…', authDomain: '…firebaseapp.com', projectId: '…', appId: '…' },
   };
   ```
   These values are meant to be public. They identify the project and don't grant access; the security rules below do that.
3. In Firebase, open **Authentication → Sign-in method** and enable:
   - **Email/Password**.
   - **Google**: one click.
   - **Apple**: needs an Apple Developer account (£79 / $99 a year). Create a Services ID and a key in Apple's developer portal, then paste them into Firebase. Firebase's Apple page walks you through it. You can leave Apple until later.
4. In **Authentication → Settings → Authorised domains**, add the domain the game is hosted on (for example `lowmarsh.co.uk` or `yourname.github.io`).
5. Open **Firestore Database → Create database**. Pick a location near your players (for the UK, `europe-west2`, London) and start in **production mode**.
6. In **Firestore → Rules**, replace the rules with these and press **Publish**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       // each player's saved game: only they can read or write it
       match /saves/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid
                            && (request.resource == null || request.resource.data.data.size() < 800000);
       }
       // each player's public profile (just the username)
       match /profiles/{uid} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == uid;
       }
       // usernames are claimed here so nobody can take one that's in use
       match /usernames/{name} {
         allow read: if request.auth != null;
         allow create: if request.auth != null && request.resource.data.uid == request.auth.uid
                       && name.matches('^[a-z0-9_]{3,16}$');
         allow update: if request.auth != null && resource.data.uid == request.auth.uid
                       && request.resource.data.uid == request.auth.uid;
         allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
       }
     }
   }
   ```

Once that's done:

- Email sign-up goes through Firebase, so the same login works on any device.
- Usernames are unique across everyone, not just one device.
- **Progress follows the player.** Every save is kept in the browser at once and sent to the account a few seconds later (and when the tab is closed or hidden). When the game opens, or someone signs in, whichever copy was saved most recently wins. The first time an account is used on a device, it takes the account's saved game if there is one; a new account brings the guest progress along.
- The profile page shows whether progress is saved to the account, or waiting because the player is offline.

## What it stores

- `saves/<uid>`: the player's whole save as one piece of text, plus when it was saved.
- `profiles/<uid>`: their username.
- `usernames/<name>`: which account owns that username.

Passwords are handled by Firebase and never touch the game. Update the in-game Privacy page (in `js/main.js`, `PAGES.privacy`) and your privacy policy before launch to say that progress and email addresses are stored with Google Firebase.
