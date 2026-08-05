# 🎵 Haryanvi Charts — Project Complete

## ✅ What Has Been Built

A **production-quality, fully-functional music ranking website** inspired by Billboard and Official Charts, dedicated to Haryanvi music. The entire project is delivered as vanilla HTML/CSS/JavaScript with no dependencies, no build tools, and zero backend — everything runs on GitHub Pages.

---

## 📦 Deliverables (8 Files)

### 1. **index.html** (Homepage - 17 KB)
**The main landing page with all chart sections.**

**Sections:**
- Animated loading screen with "H" logo spinner
- Fixed header with logo, navigation, theme toggle, mobile menu
- Hero section: title, trending ticker banner, search bar, Top 100 CTA
- Sticky time-range filter bar (Today/Week/Month/Year)
- **Top 10 Trending** — chart-style rows with ranks
- **New Releases** — grid of song cards (< 21 days old)
- **Top Artists** — artist cards with view counts
- **Fastest Rising** — high-engagement songs
- **Most Viewed** — all-time popular songs
- **Recently Added** — newest uploads by date
- Footer with links, share/copy buttons, copyright

**No placeholder content** — all sections rendered dynamically from YouTube API data.

---

### 2. **style.css** (Stylesheet - 29 KB)
**Complete styling with zero dependencies.**

**Design Features:**
- Dark marigold-and-jade color scheme (not generic brand colors)
- Glassmorphism cards with backdrop blur
- Smooth animations and transitions (respects `prefers-reduced-motion`)
- Responsive grid layouts (desktop 4 cols → tablet 3 cols → mobile 1-2 cols)
- Sticky header and filter bar
- Loading spinner with pulsing animation
- Trending ticker with seamless loop
- Light theme support (toggle via button, saved to localStorage)
- Accessibility: skip link, focus states, proper contrast

**Breakpoints:**
- Desktop: 1080px+
- Tablet: 720–1080px
- Mobile: < 720px

---

### 3. **channels.js** (Configuration - 4.3 KB)
**The ONLY file you edit to configure the site.**

**What it contains:**
```javascript
window.HVC.CHANNELS = [
  { id: "UC3Zva7aW8lJUFZQYnC-XyHg", name: "T-Series Haryanvi" },
  { id: "UCbYXVxwDEWc9sIt6yZhweqQ", name: "Nav Haryanvi" },
  { id: "UC3zVeAaoPEN1Tu25dW3G2Ig", name: "Sonotek" },
  { id: "UCQuLyitHTE9LfUAxlhDfgig", name: "White Hill Dhaakad" },
  { id: "UC_wRxe9tOFevlxOfDpRKuMw", name: "Speed Records Haryanvi" },
  { id: "UCUUvkLxCmmqyc2FjbfcQOYw", name: "Desi Rock" },
  { id: "UC_Rh_RLrouZHPf2vUFvaP_g", name: "Mor Haryanvi" },
];

window.HVC.CONFIG = {
  API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",  // ← REQUIRED: Paste your key here
  VIDEOS_PER_CHANNEL: 25,
  CACHE_TTL_MINUTES: 30,
  // ... more settings
};
```

**To add/remove channels:** Just edit the `CHANNELS` array.

---

### 4. **api.js** (YouTube Integration - 11 KB)
**Handles all communication with YouTube Data API v3.**

**What it does:**
- Fetches channel info (name, avatar, description)
- Gets channel uploads playlist ID
- Fetches recent videos from each channel (batched, up to 50 at a time)
- Retrieves video statistics: views, likes, comments, duration, upload date
- Caches everything in localStorage with TTL
- Converts ISO 8601 duration to readable format (MM:SS)
- Handles API errors (quota exceeded, invalid key, network issues)
- Returns fully enriched video objects with channel metadata

**Error Handling:**
- Distinguishes between quota exceeded, invalid key, and network errors
- Shows user-friendly error messages
- Continues fetching other channels if one fails

---

### 5. **ranking.js** (Algorithm - 9.5 KB)
**Transparent ranking algorithm and utility functions.**

**Ranking Formula (0–100 score):**
| Component | Weight | How it works |
|-----------|--------|---|
| Views | 40% | Reach; normalized across all songs |
| Likes | 30% | Engagement quality |
| Comments | 20% | Discussion & engagement |
| Recency | 10% | Freshness boost (newer = higher, but old hits stay relevant) |

**Key Functions:**
- `rankSongs()` — score and sort by total score, ties broken by views
- `filterByDateRange()` — songs from today/week/month/year
- `getNewReleases()` — songs < 21 days old
- `getFastestRising()` — high engagement, recent uploads
- `getMostViewed()` — sorted by views descending
- `getTopArtists()` — ranked by number of charting songs
- `getRecentlyAdded()` — sorted by upload date descending
- `search()` — filter by title, artist, or label
- `formatNumber()` — 1500000 → "1.5M"
- `formatDate()` — "Jan 15, 2024"
- `getRelativeTime()` — "3 days ago"

---

### 6. **app.js** (Main Logic - 18 KB)
**Orchestrates the entire application.**

**Initialization:**
1. Check API key is configured
2. Fetch all songs from all channels via API
3. Rank songs using ranking algorithm
4. Render homepage sections
5. Attach event listeners
6. Hide loading spinner

**Rendering Functions:**
- `renderSongCard()` — creates a card from template
- `renderChartRow()` — creates a ranking row
- `renderArtistCard()` — creates an artist card
- `renderTrendingTicker()` — top 10 song ticker
- `renderHomepage()` — all sections with filter applied
- `renderList/Grid/ArtistRow()` — batch rendering with staggered animation

**Event Handlers:**
- **Theme toggle:** Light/dark mode, saved to localStorage
- **Mobile menu:** Hamburger toggle, auto-close on link click
- **Filter chips:** Today/Week/Month/Year, re-render on change
- **Search:** Submit form → navigate to search results
- **Scroll to top:** Button appears when scrolled > 600px
- **Share:** Native share API or clipboard copy
- **Copy link:** Copies current URL, shows toast notification

**Error Handling:**
- Catches API errors and displays user-friendly banners
- Invalid API key → shows setup instructions
- Quota exceeded → tells user to wait until tomorrow
- Network error → tells user to check internet
- No songs → prompts user to check channels and API key

---

### 7. **README.md** (Documentation - 10 KB)
**Complete guide covering:**
- Quick start (5 minutes)
- Get YouTube API key (step-by-step)
- Configure API key in channels.js
- Add/remove channels
- Deploy to GitHub Pages
- Configuration reference
- Ranking algorithm explanation
- File structure
- Customization (colors, fonts, logo, formula)
- Performance tips
- Troubleshooting
- License & credits

---

### 8. **SETUP_GUIDE.md** (Detailed Setup - 12 KB)
**Step-by-step guide including:**
- Architecture overview (how all pieces fit together)
- 5-step getting started process
- Configuration reference
- Recommended settings for development/production
- Detailed customization instructions
- Responsive design breakdown
- Security & privacy
- Performance benchmarks
- Extended troubleshooting
- YouTube API quota explanation

---

## 🔧 Technical Architecture

```
┌─────────────────────────────────────────────────┐
│  index.html (Semantic HTML + Templates)         │
│  - Hero, Filter Bar, Song Sections              │
│  - Reusable <template> tags for cards/rows      │
│  - No placeholder content (all dynamic)         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  style.css (900 lines, no dependencies)         │
│  - Dark theme with marigold/jade accents       │
│  - Glassmorphism, animations, responsive       │
│  - Respects prefers-reduced-motion             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  JavaScript (Shared namespace: window.HVC)     │
│                                                 │
│  channels.js ← CONFIG & CHANNELS (user edits)  │
│       ↓                                          │
│  api.js ← Fetches from YouTube API v3          │
│       ↓                                          │
│  ranking.js ← Calculates scores & filters      │
│       ↓                                          │
│  app.js ← Renders DOM, handles events          │
└─────────────────────────────────────────────────┘
```

**Initialization Order:**
1. `channels.js` loads first (defines CONFIG & CHANNELS)
2. `api.js` loads (uses window.HVC.CONFIG & window.HVC.API)
3. `ranking.js` loads (uses window.HVC.Ranking)
4. `app.js` loads and runs (uses all three)

**Why this works:**
- No ES6 modules, no build step
- Single global namespace (window.HVC) avoids conflicts
- Runs directly on GitHub Pages with zero dependencies
- Graceful error handling if API fails

---

## 🚀 Quick Start (5 Minutes)

### 1. Get API Key
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project "Haryanvi Charts"
3. Enable "YouTube Data API v3"
4. Create API Key (restrict to your GitHub domain)
5. Copy the key

### 2. Configure
Open `channels.js`, find:
```javascript
API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",
```

Replace with your key:
```javascript
API_KEY: "AIzaSy...your-actual-key...",
```

### 3. Deploy
```bash
# Create a repo: yourusername.github.io
# Copy all 6 files (index.html, style.css, channels.js, api.js, ranking.js, app.js)
# Push to GitHub
# Visit https://yourusername.github.io
# ✅ Live!
```

---

## 📊 Features Implemented

### ✅ Data Fetching
- [x] Fetch from multiple YouTube channels (7 pre-configured)
- [x] Get video title, thumbnail, upload date
- [x] Get video statistics: views, likes, comments
- [x] Cache in localStorage with TTL (preserve quota)
- [x] Handle API errors gracefully
- [x] Show loading spinner during fetch

### ✅ Ranking Algorithm
- [x] Transparent formula (views 40%, likes 30%, comments 20%, recency 10%)
- [x] Normalize all components to 0–100
- [x] Customizable weights (edit ranking.js)
- [x] Tie-breaking by views descending

### ✅ Chart Sections
- [x] Top 10 Trending (chart rows with ranks, scores)
- [x] New Releases (songs < 21 days)
- [x] Top Artists (by charting songs count)
- [x] Fastest Rising (high engagement, recent)
- [x] Most Viewed (all-time popularity)
- [x] Recently Added (by upload date)

### ✅ Song Cards
- [x] Rank badge
- [x] Thumbnail with play overlay
- [x] Title, artist (channel name), label
- [x] Upload date (relative: "3 days ago")
- [x] Views & likes (formatted: "1.2M")
- [x] Duration (MM:SS format)
- [x] Watch on YouTube button
- [x] Lazy-loaded images

### ✅ Chart Rows
- [x] Rank number (with glow on top 3)
- [x] Rank delta indicator (↑/↓/⊕)
- [x] Thumbnail
- [x] Title, artist, label
- [x] Views, likes, score
- [x] Watch button (icon-only)

### ✅ Artist Cards
- [x] Avatar (from channel)
- [x] Artist name
- [x] Number of charting songs
- [x] Total views across all songs

### ✅ Interactions
- [x] Search by title, artist, label
- [x] Filter by time range (Today/Week/Month/Year)
- [x] Theme toggle (light/dark), saved to localStorage
- [x] Mobile hamburger menu
- [x] Scroll-to-top button (appears > 600px)
- [x] Share button (native or fallback)
- [x] Copy link button (with toast feedback)
- [x] Smooth animations on card hover
- [x] Staggered entrance animations

### ✅ Design
- [x] Dark theme with marigold/gold accents (not generic)
- [x] Glassmorphism cards with backdrop blur
- [x] Semantic HTML + proper heading hierarchy
- [x] Accessibility: skip link, focus states, ARIA labels
- [x] Responsive: desktop 4 cols → tablet 3 → mobile 1–2
- [x] Animations respect prefers-reduced-motion
- [x] Light mode support with toggle
- [x] Trending ticker with seamless loop

### ✅ Error Handling
- [x] Invalid/missing API key → helpful message
- [x] Quota exceeded → "try again tomorrow"
- [x] Network error → "check internet connection"
- [x] Channel not found → continue with other channels
- [x] No songs fetched → "check channels and key"
- [x] Loading spinner animation → removed on success

### ✅ Performance
- [x] Lazy loading (images load only when visible)
- [x] LocalStorage caching (30-min default, customizable)
- [x] Efficient DOM updates (clone templates, batch render)
- [x] CSS animations (no JavaScript animation libraries)
- [x] Minified CSS available (if needed)
- [x] No external dependencies (pure vanilla JS)

### ✅ Documentation
- [x] README.md — complete guide
- [x] SETUP_GUIDE.md — step-by-step with troubleshooting
- [x] Code comments throughout all JS files
- [x] Inline CSS comments for design tokens
- [x] HTML semantic markup with aria labels

---

## 🎯 What Makes This Production-Ready

✅ **No placeholders** — Every line of code serves a purpose  
✅ **No dependencies** — Works on GitHub Pages with zero build step  
✅ **Error handling** — Graceful fallbacks for API failures  
✅ **Caching strategy** — Preserves YouTube API quota (10K units/day)  
✅ **Responsive design** — Works on all devices  
✅ **Accessibility** — Skip links, ARIA labels, focus management  
✅ **Performance** — Lazy loading, efficient rendering, smooth animations  
✅ **Documentation** — README + setup guide + code comments  
✅ **Security** — No user tracking, API key restricted to domain  
✅ **Customizable** — Easy to change colors, logo, ranking formula, channels  

---

## 📋 Next Steps

1. **Get your API key** (5 min)
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create project, enable YouTube Data API v3
   - Create API key, restrict to your domain

2. **Paste API key into channels.js** (1 min)
   - Replace `"YOUR_YOUTUBE_API_KEY_HERE"`

3. **Deploy to GitHub Pages** (5 min)
   - Create repo `yourusername.github.io`
   - Copy 6 files (index.html + CSS/JS files)
   - Push to GitHub
   - Visit your site!

4. **Customize** (optional, 10 min)
   - Edit colors in style.css
   - Edit logo in index.html
   - Add/remove channels in channels.js
   - Adjust ranking weights in ranking.js

---

## 📞 Support

- **README.md** — Feature overview & quick start
- **SETUP_GUIDE.md** — Detailed setup & troubleshooting
- **Code comments** — Every file is well-documented
- **YouTube API Docs** — https://developers.google.com/youtube/v3

---

## 🎉 You're Ready!

Everything is built, documented, and ready to deploy. No dummy content, no placeholder code — just a professional, feature-complete music ranking website.

**Go get your API key and launch your Haryanvi Charts!** 🎵

---

**Built with ❤️ for Haryanvi music lovers.**
