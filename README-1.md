# Harrywood Charts — Admin Panel Setup Guide

A Netflix-style admin dashboard (Firebase Auth + Firestore + Storage) that manages every piece of content on Harrywood Charts, and streams changes to the public site **in real time** — no rebuild, no redeploy, no page reload for visitors.

**This does not replace anything in your existing project.** All admin files live in a new `/admin` folder alongside your existing `index.html`, `style.css`, etc. Three small, additive changes were made to the public site (see "What changed on the public site" below) — nothing was removed.

---

## 📁 Where Every File Goes

```
your-repo/                         (repo root — same folder as your existing index.html)
├── index.html                     (existing — 3 small additions, see below)
├── style.css                      (existing — untouched)
├── channels.js                    (existing — 1 new config flag added)
├── api.js                         (existing — untouched, still used as fallback)
├── ranking.js                     (existing — untouched)
├── app.js                         (existing — init() updated to support Firestore mode)
├── firebase-config.js             ⭐ NEW — Firebase project keys (shared by site + admin)
├── firestore-sync.js              ⭐ NEW — real-time public site ↔ Firestore bridge
├── firestore.rules                ⭐ NEW — Firestore security rules (paste into console)
├── storage.rules                  ⭐ NEW — Storage security rules (paste into console)
│
└── admin/                         ⭐ NEW FOLDER — the entire admin panel
    ├── login.html                 Admin login + password reset
    ├── dashboard.html             The dashboard shell (sidebar + all views + modals)
    ├── admin-style.css             Netflix black/red admin theme
    ├── auth.js                    Firebase Auth login/logout/reset/route-guard
    ├── db.js                      All Firestore reads/writes (songs, artists, labels, news, top100, settings)
    ├── storage.js                 Thumbnail/logo upload to Firebase Storage
    ├── youtube-fetch.js           Auto-fetch title/thumbnail/stats from a pasted YouTube URL
    └── admin-app.js                Dashboard controller — wires everything together
```

**To deploy:** copy the `admin/` folder and the 4 new root files into your existing repo, commit, push. That's it — your existing pages are untouched.

---

## What Changed on the Public Site (and why it's safe)

Only three files got small, additive edits — nothing was deleted or restructured:

1. **`index.html`** — added 4 `<script>` tags (Firebase SDK + `firebase-config.js` + `firestore-sync.js`), placed *before* the existing `api.js`/`ranking.js`/`app.js` tags, which are still there unchanged.
2. **`channels.js`** — added one new setting: `CONFIG.USE_FIRESTORE: true`.
3. **`app.js`** — `init()` now checks `CONFIG.USE_FIRESTORE`. If `true` (default), it subscribes to live Firestore data instead of calling YouTube directly. If you set it to `false`, the site behaves **exactly as before** — direct YouTube fetch, no Firebase needed at all. The original fetch code in `api.js` was not touched.

So: with a Firebase project connected, your site now shows whatever is in Firestore, live. Without one (or with `USE_FIRESTORE: false`), it's your original YouTube-charts site, unchanged.

---

## Step 1 — Create the Firebase Project (5 min)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Name it (e.g. `harrywood-charts`) → continue through the wizard (Analytics is optional)
3. Once created, click the **`</>`** (Web) icon on the project overview page to register a web app
4. Name it "Harrywood Charts Web" → **Register app**
5. Firebase shows a config object like this — **copy it**:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "harrywood-charts.firebaseapp.com",
  projectId: "harrywood-charts",
  storageBucket: "harrywood-charts.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```
6. Paste those values into **`firebase-config.js`** (repo root), replacing the placeholders in `window.HVC.FIREBASE_CONFIG`.

---

## Step 2 — Enable Authentication (2 min)

1. Firebase Console → **Build → Authentication → Get started**
2. **Sign-in method** tab → click **Email/Password** → enable the first toggle → **Save**

---

## Step 3 — Create Firestore Database (2 min)

1. Firebase Console → **Build → Firestore Database → Create database**
2. Choose **Start in production mode** → pick a location close to your audience → **Enable**
3. Go to the **Rules** tab → delete the default rules → paste the entire contents of **`firestore.rules`** from this project → **Publish**

---

## Step 4 — Enable Storage (2 min)

1. Firebase Console → **Build → Storage → Get started** → keep default location → **Done**
2. Go to the **Rules** tab → paste the entire contents of **`storage.rules`** from this project → **Publish**

---

## Step 5 — Create Your First Admin Login (5 min)

**5a. Create the Auth user:**
1. Firebase Console → **Authentication → Users → Add user**
2. Enter your email + a strong password → **Add user**
3. Copy the **User UID** shown in the users list (looks like `a1B2c3D4e5F6...`)

**5b. Allow-list that UID in Firestore** (this is what actually grants dashboard access):
1. Firebase Console → **Firestore Database → Start collection**
2. Collection ID: `admins`
3. Document ID: **paste the User UID you copied** (exactly — this is how the security rules recognize you)
4. Add one field: `email` (string) = your email address
5. **Save**

> **Why two steps?** Firebase Auth only proves *who you are*. The `/admins` Firestore collection controls *what you're allowed to do*. Someone could theoretically create an Auth account, but without a matching `/admins` document, the security rules block every write — and the dashboard itself signs them straight back out (see `admin/auth.js` → `requireAdmin`).

**To add more admins later:** repeat step 5b for each additional teammate's UID after they've had an Auth account created (Authentication → Users → Add user).

---

## Step 6 — Configure the YouTube API Key (for the "Fetch Details" button)

The admin dashboard's "Fetch Details" button (auto-fill title/thumbnail/views/likes from a pasted YouTube URL) reuses the same key from the original project setup.

Open **`channels.js`** and confirm this is set:
```javascript
API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",   // ← your real YouTube Data API v3 key
```
See the main `README.md` / `QUICKSTART.md` from the original project for how to get this key. Only the admin dashboard calls YouTube directly now — public visitors never do, so your quota usage is dramatically lower than before.

---

## Step 7 — Deploy

Copy these into your existing repo (same one your `index.html` already lives in):
```
firebase-config.js
firestore-sync.js
firestore.rules        (reference copy — already applied via console in Step 3)
storage.rules           (reference copy — already applied via console in Step 4)
admin/                  (entire folder)
```

Then:
```bash
git add .
git commit -m "Add Firebase admin panel"
git push
```

Visit:
- **Admin login:** `https://yourusername.github.io/admin/login.html`
- **Public site:** `https://yourusername.github.io/` (now reading from Firestore)

---

## Using the Dashboard

### Songs
**+ Add Song** → paste a YouTube URL → **Fetch Details** auto-fills title, thumbnail, duration, views, likes, comments. Fill in Artist (pick from your Artists list), Label, Genre, Release Date. Toggle **Featured** / **Trending** as needed. You can also upload a custom thumbnail to override the YouTube one, and set a **Rank Override** to pin a song's Top 100 position regardless of views.

### Artists
Name, YouTube channel, Instagram, bio, monthly views, and a **Verified** badge toggle.

### Labels
Logo, description, official website + YouTube channel — shown wherever you choose to surface labels on the public site.

### News
A lightweight rich-text editor (bold, italic, lists, links, headings) built into the page — no external editor library needed. Set a category, author, and either **Publish Now**, **Schedule** (pick a future date/time), or **Save as Draft**.

### Weekly Top 100
- Drag rows to reorder, or type a rank number directly into any row.
- **Auto-Rank by Views** re-sorts every song by view count in one click (songs with a manual **Rank Override** are pinned to the top first).
- **Save Order** commits the current order to Firestore — the public site updates instantly.
- **Lock** freezes the chart (disables drag/edit/save) once you're happy with the week's ranking, so it can't be bumped by accident.
- **Archive This Week** snapshots the current Top 100 into a dated record under **Weekly Archive**, so you keep history even after next week's reshuffle.

### Settings
Site name, logo, favicon, social links, contact email, and SEO meta description/keywords — stored in Firestore (`/config/site`) for you to wire into `index.html`'s `<head>` tags whenever you're ready.

### Overview
Live counts, a "Most Viewed Songs" bar chart and a content-breakdown donut chart (via Chart.js), plus an estimated YouTube API quota usage meter for the current admin session.

---

## Security Model Summary

| Layer | Who can do what |
|---|---|
| **Firebase Auth** | Anyone with an email/password you create can *log in* |
| **Firestore `/admins` collection** | Only UIDs you've manually added here can *write* data — checked by security rules on every request, not just in the dashboard UI |
| **Firestore rules** | Public read on all content; write requires `/admins` membership; the `/admins` collection itself is never client-writable |
| **Storage rules** | Public read on uploaded images; upload/delete requires the same `/admins` check, plus file-type and size limits |

This means even if your dashboard's JavaScript were somehow bypassed, the database itself refuses unauthorized writes.

---

## Troubleshooting

**"This account is not authorized as an admin"**
→ You logged in successfully, but your UID isn't in the `/admins` Firestore collection yet. Redo Step 5b with the exact UID from Authentication → Users.

**Dashboard loads but Songs/Artists tables stay empty**
→ Normal on a fresh project — add your first song/artist from the dashboard.

**Public site shows "No Songs Yet"**
→ Same cause — this is the friendly empty state shown when Firestore has no songs. Add one in `/admin` and it will appear within a second or two, live.

**"Missing or insufficient permissions" in the browser console**
→ The Firestore/Storage rules haven't been published yet, or your UID isn't allow-listed. Recheck Steps 3, 4, and 5b.

**Thumbnails don't load after upload**
→ Confirm Storage rules were published (Step 4) and the file is under 5MB and an image type.

**I want the public site back to the old YouTube-direct mode**
→ Set `CONFIG.USE_FIRESTORE = false` in `channels.js`. Nothing else needs to change.

---

## What's Intentionally Not Included (Scope Notes)

- A public-facing **News page/section** isn't built yet — `firestore-sync.js` already fetches published news in real time (`latestNews`), so wiring up a `news.html` page is a quick follow-up whenever you want it, reusing the same rendering patterns as `index.html`.
- The rich-text editor is a lightweight `contenteditable` + `execCommand` toolbar (bold/italic/lists/links/heading) rather than a full WYSIWYG library — keeps the project dependency-free, and covers typical news formatting needs.

---

**You're live!** Log in at `/admin/login.html`, add a song, and watch it appear on your homepage in real time. 🎬
