/* ============================================================================
   firebase-config.js
   ----------------------------------------------------------------------------
   Shared Firebase configuration — used by BOTH the admin dashboard (/admin)
   and the public website. Loaded before any other Firebase-dependent script.

   HOW TO GET THESE VALUES
   ----------------------------------------------------------------------------
   1. Go to https://console.firebase.google.com
   2. Create a project (or open an existing one) — e.g. "harrywood-charts"
   3. Click the gear icon → "Project settings"
   4. Scroll to "Your apps" → click the </> (Web) icon → register an app
   5. Firebase shows you an object exactly like the one below — copy it here.
   6. Enable these products in the left sidebar:
        - Authentication → Sign-in method → Email/Password → Enable
        - Firestore Database → Create database → Start in production mode
        - Storage → Get started (used for uploaded thumbnails)
   See /admin/README.md for full step-by-step setup, security rules, and
   how to create your first admin login.
   ============================================================================ */

window.HVC = window.HVC || {};

window.HVC.FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase (uses the compat SDK — no bundler required, works
// directly via <script> tags on GitHub Pages, same philosophy as the rest
// of this project).
//
// The PUBLIC site only loads firebase-app + firebase-firestore (it just
// reads data, in real time, for visitors — no auth or storage needed).
// The ADMIN dashboard loads all four compat SDKs (app, auth, firestore,
// storage). Each capability below is wired up only if its SDK was
// actually loaded on the current page, so neither page errors out
// waiting for a script it doesn't include.
firebase.initializeApp(window.HVC.FIREBASE_CONFIG);

window.HVC.db = firebase.firestore();
if (firebase.auth) window.HVC.auth = firebase.auth();
if (firebase.storage) window.HVC.storage = firebase.storage();
