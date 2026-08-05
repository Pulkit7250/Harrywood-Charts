# 🚀 Haryanvi Charts — Quick Start Checklist

**Time to launch: 10 minutes**

---

## 📥 Step 1: Get YouTube API Key (5 min)

```
[ ] Go to console.cloud.google.com
[ ] Click "Create Project" → Name: "Haryanvi Charts"
[ ] Search for "YouTube Data API v3" → Click "Enable"
[ ] Click "Credentials" in left menu
[ ] Click "Create Credentials" → "API Key"
[ ] Copy the key (starts with "AIza...")
[ ] Click the key in the Credentials list
[ ] Scroll down to "API Restrictions" → Select "YouTube Data API v3"
[ ] Scroll to "Application Restrictions" → Select "Web applications"
[ ] Add your GitHub domain: https://yourusername.github.io
[ ] Click "Save"
```

**Your key is ready!** 🔑

---

## 📝 Step 2: Configure the Key (1 min)

Open `channels.js` and find this line:
```javascript
API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",
```

Replace with your actual key:
```javascript
API_KEY: "AIzaSy1234567890abcdefghijklmnopqrst",
```

**Save the file!** ✅

---

## 🚀 Step 3: Deploy to GitHub Pages (3 min)

```bash
# Create a new repository on GitHub called:
# yourusername.github.io

# Clone it to your computer
git clone https://github.com/yourusername/yourusername.github.io.git

# Copy all files from Haryanvi Charts into the folder:
# - index.html
# - style.css
# - channels.js
# - api.js
# - ranking.js
# - app.js
# - README.md (optional)

# Commit and push
cd yourusername.github.io
git add .
git commit -m "Launch Haryanvi Charts"
git push

# Done! Your site is now live at:
# https://yourusername.github.io
```

---

## ✨ Step 4: Verify It Works (1 min)

Open your browser and go to:
```
https://yourusername.github.io
```

You should see:
- [ ] Loading spinner while fetching
- [ ] Hero with trending ticker
- [ ] Search bar
- [ ] Filter chips (Today/Week/Month/Year)
- [ ] Top 10 Trending songs with ranks
- [ ] Multiple chart sections below
- [ ] Footer with links

**If you see all of these, you're live!** 🎉

---

## 🎨 Step 5: Customize (Optional, 10 min)

### Change the Logo
Edit `index.html`, find the `<a class="logo">` tag, and replace:
```html
<span class="logo-mark">H</span>
<span class="logo-text">Haryanvi<em>Charts</em></span>
```

### Change Colors
Edit `style.css`, find the `:root` block, and change:
```css
--gold-500: #e3b23c;     /* Primary accent */
--jade-500: #2fbf9f;     /* "Rising" indicator */
```

### Add/Remove Channels
Edit `channels.js`, modify the `CHANNELS` array:
```javascript
window.HVC.CHANNELS = [
  { id: "UC3Zva7aW8lJUFZQYnC-XyHg", name: "T-Series Haryanvi" },
  // Add or remove channels here
];
```

### Adjust Ranking Formula
Edit `ranking.js`, find the `calculateScore()` function, and change the weights:
```javascript
const totalScore = (
  viewsScore * 0.40 +      // Increase for view-focused
  likesScore * 0.30 +
  commentsScore * 0.20 +
  recency * 0.10
);
```

---

## 📚 Files Included

| File | Purpose | Size | Edit? |
|------|---------|------|-------|
| `index.html` | Homepage structure | 17 KB | Optional |
| `style.css` | All styling & animations | 29 KB | Optional (colors) |
| `channels.js` | API key & settings | 4.3 KB | **REQUIRED** |
| `api.js` | YouTube API integration | 11 KB | No |
| `ranking.js` | Ranking algorithm | 9.5 KB | Optional (formula) |
| `app.js` | App logic & rendering | 18 KB | No |
| `README.md` | Complete user guide | 10 KB | Reference |
| `SETUP_GUIDE.md` | Detailed setup guide | 12 KB | Reference |
| `PROJECT_SUMMARY.md` | Project overview | 15 KB | Reference |

**TLDR:** You only **need to edit `channels.js`** to paste your API key. Everything else is optional.

---

## 🔧 Configuration (All in channels.js)

```javascript
window.HVC.CONFIG = {
  // ⚠️ REQUIRED: Your YouTube API key
  API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",

  // How many videos to fetch per channel (higher = more complete, more quota used)
  VIDEOS_PER_CHANNEL: 25,

  // How long to cache data (in minutes). Higher = lower quota usage
  CACHE_TTL_MINUTES: 30,  // Set to 240 for production (4 hours)

  // Songs < this many days old appear in "New Releases"
  NEW_RELEASE_WINDOW_DAYS: 21,

  // Songs < this many days old are eligible for "Fastest Rising"
  RISING_WINDOW_DAYS: 45,

  // How many items in each homepage section
  SECTION_SIZES: {
    top10: 10,
    newReleases: 8,
    topArtists: 10,
    fastestRising: 6,
    mostViewed: 8,
    recentlyAdded: 8,
  },

  // Full chart size (e.g., for Top 100 page)
  TOP_CHART_SIZE: 100,
};
```

---

## 🐛 Troubleshooting

### Loading forever / "API Key Missing"
- [ ] Did you paste your API key in `channels.js`?
- [ ] Is it the correct format? (Starts with "AIza...")
- [ ] Did you enable YouTube Data API v3 in Google Cloud Console?

### "No Songs Found"
- [ ] Are the channel IDs correct? (Must start with "UC")
- [ ] Do those channels have public videos?
- [ ] Open browser console (F12) to see error details

### Charts not updating
- [ ] Clear cache: Open console (F12), type `localStorage.clear()`, press Enter
- [ ] Or increase cache time in channels.js to see changes more frequently

### "Quota Exceeded"
- [ ] You've used all 10,000 daily API units
- [ ] Increase cache time: `CACHE_TTL_MINUTES: 240` (4 hours)
- [ ] Reduce videos per channel: `VIDEOS_PER_CHANNEL: 15`
- [ ] Try again tomorrow (quota resets at midnight PT)

---

## 📊 How It Works (60-Second Version)

1. **User visits site** → JavaScript runs in browser
2. **App fetches data** → Calls YouTube API for all configured channels
3. **API returns** → Video titles, thumbnails, views, likes, comments, upload dates
4. **App ranks songs** → Uses transparent formula (40% views + 30% likes + 20% comments + 10% recency)
5. **App renders** → Creates HTML cards from templates, sorts by rank
6. **User sees** → Live, dynamic charts with Top 10, New Releases, Fastest Rising, etc.
7. **Data caches** → Browser stores results for 30 min (saves API quota)
8. **Next user visit** → Uses cached data until TTL expires, then re-fetches

**No backend, no database, no build step — just static files on GitHub Pages.** ✨

---

## 🎯 What You Get

✅ **7 Haryanvi music channels tracked automatically**
✅ **Real YouTube data** (views, likes, comments, upload dates)
✅ **Transparent ranking algorithm** (no black box)
✅ **Multiple chart views** (Top 10, New Releases, Fastest Rising, Artists, etc.)
✅ **Search & filter functionality**
✅ **Light/dark theme toggle**
✅ **Mobile-responsive design**
✅ **Runs on GitHub Pages** (zero hosting costs)
✅ **Fully customizable** (colors, logo, channels, ranking formula)
✅ **Complete documentation**

---

## 📞 Need Help?

1. **Quick answer:** Check `README.md` → Troubleshooting section
2. **Detailed help:** Check `SETUP_GUIDE.md` → Search for your issue
3. **Code questions:** Check inline comments in `api.js`, `ranking.js`, `app.js`
4. **YouTube API:** https://developers.google.com/youtube/v3

---

## 🎉 Ready to Launch?

```
[ ] Get YouTube API key
[ ] Paste into channels.js
[ ] Create yourusername.github.io repo on GitHub
[ ] Copy all files to the repo
[ ] Push to GitHub
[ ] Visit https://yourusername.github.io
[ ] Share with friends! 🎵
```

---

**Haryanvi Charts is ready to go! Good luck! 🚀**
