# Haryanvi Charts
## The official home of Haryanvi music rankings — powered by real YouTube data

A Billboard/Official Charts-inspired ranking site for Haryanvi music, built with **vanilla JavaScript**, **pure CSS**, and the **YouTube Data API v3**. Zero backend, zero build tools — runs directly on GitHub Pages.

---

## Features

✨ **Live Rankings**
- Top 10 Trending, Top 100 all-time
- Transparent ranking algorithm (views, likes, comments, recency)
- Real-time YouTube data, updated every 30 minutes

🎵 **Comprehensive Charts**
- New Releases (songs from the past 3 weeks)
- Fastest Rising (high engagement on recent drops)
- Most Viewed (all-time popularity)
- Top Artists (by number of charting songs)
- Recently Added

🔍 **Search & Filter**
- Search by song title, artist, or label
- Filter by time range (today, week, month, year)
- Instant results, no page reload

🎨 **Premium Design**
- Dark marigold-and-jade color scheme
- Glassmorphism cards
- Smooth animations & transitions
- Fully responsive (desktop, tablet, mobile)
- Light mode support (toggle in header)

⚡ **Performance**
- Lazy-loaded images
- Cached API responses (30-min default)
- Optimized for fast loading on all devices

🔐 **Privacy**
- No user tracking or analytics
- API key restricted to your domain
- All data fetched directly from YouTube

---

## Quick Start

### 1. Get a YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it "Haryanvi Charts" or similar
   - Click "Create"

3. Enable the YouTube Data API v3:
   - Search for "YouTube Data API v3" in the search bar
   - Click on it
   - Click "Enable"

4. Create credentials (API key):
   - Go to "Credentials" in the left menu
   - Click "Create Credentials" → "API Key"
   - Copy the key

5. **Restrict the key** (important for security):
   - Click on the key in the Credentials list
   - Under "API restrictions", select "YouTube Data API v3"
   - Under "Application restrictions", select "Web applications (HTTP referrers)"
   - Add your GitHub Pages domain: `https://yourusername.github.io`
   - Click "Save"

### 2. Configure the API Key

Open `channels.js` and replace:
```javascript
API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",
```

with your actual API key:
```javascript
API_KEY: "AIzaSy...your-key-here",
```

### 3. Add Your Channels

In `channels.js`, the `CHANNELS` array contains all channels to track:
```javascript
window.HVC.CHANNELS = [
  { id: "UC3Zva7aW8lJUFZQYnC-XyHg", name: "T-Series Haryanvi" },
  { id: "UCbYXVxwDEWc9sIt6yZhweqQ", name: "Nav Haryanvi" },
  // Add more below...
];
```

To **add a new channel**:
1. Visit the YouTube channel
2. Look at the URL: `youtube.com/channel/UC...` — copy the `UC...` part
3. Add a new line:
```javascript
{ id: "UCxxxxxxxxxxxxxxxxxxxxxx", name: "Channel Display Name" },
```

### 4. Deploy to GitHub Pages

1. Fork or clone this repo to your computer
2. Create a GitHub repository named `yourusername.github.io`
3. Copy all files to that repo
4. Commit and push:
```bash
git add .
git commit -m "Initial commit: Haryanvi Charts"
git push
```

5. Visit `https://yourusername.github.io` — your charts are live!

---

## Configuration

All settings are in `channels.js`:

### `API_KEY`
Your YouTube Data API v3 key. **Must be set** for the site to work.

### `VIDEOS_PER_CHANNEL`
How many recent videos to fetch from each channel per refresh. Higher = more complete charts, but uses more API quota.
- Default: `25`
- Typical quota cost: `25 channels × 25 videos ≈ 300 units per refresh`

### `CACHE_TTL_MINUTES`
How long to cache fetched data before re-fetching from YouTube. Preserves your daily 10,000-unit quota.
- Default: `30` (useful for development)
- For production: `120–240` (2–4 hours, or once per day)

### `NEW_RELEASE_WINDOW_DAYS`
Songs uploaded within this many days are eligible for the "New Releases" section.
- Default: `21`

### `RISING_WINDOW_DAYS`
Songs uploaded within this many days are eligible for "Fastest Rising".
- Default: `45`

### `SECTION_SIZES`
How many songs/artists each homepage section shows:
```javascript
SECTION_SIZES: {
  top10: 10,           // Top 10 Trending
  newReleases: 8,      // New Releases grid
  topArtists: 10,      // Top Artists row
  fastestRising: 6,    // Fastest Rising
  mostViewed: 8,       // Most Viewed
  recentlyAdded: 8,    // Recently Added
}
```

### `TOP_CHART_SIZE`
The full chart size for the "Top 100" page.
- Default: `100`

---

## Ranking Algorithm

Songs are ranked using a **transparent, weighted formula**:

| Component | Weight | What It Measures |
|-----------|--------|------------------|
| **Views** | 40% | Total reach on YouTube |
| **Likes** | 30% | Quality signal, harder to fake |
| **Comments** | 20% | Audience engagement & discussion |
| **Recency** | 10% | Freshness boost (newer = higher) |

Each component is normalized to 0–100 across all songs, then weighted and summed.

**Tie-breaking:** If scores are equal, songs are ranked by views (descending).

### Customizing the Formula

Edit the ranking weights in `ranking.js`:
```javascript
const totalScore = (
  viewsScore * 0.40 +  // Change this to 0.50 for more view-focused
  likesScore * 0.30 +
  commentsScore * 0.20 +
  recency * 0.10
);
```

---

## File Structure

```
haryanvi-charts/
├── index.html          # Homepage (all sections)
├── style.css           # All styling (dark theme, animations, responsive)
├── channels.js         # Config: API key, channels, settings
├── api.js              # YouTube Data API v3 wrapper
├── ranking.js          # Ranking algorithm & utilities
├── app.js              # Main app logic, DOM rendering, events
├── README.md           # This file
└── top100.html         # (Optional) Full Top 100 page
```

### HTML Pages (Generate as Needed)

You can extend the site with more pages:
- `top100.html` — Full Top 100 with sorting
- `artists.html` — All artists & their songs
- `latest.html` — Latest releases (paginated)
- `about.html` — About Haryanvi Charts
- `privacy.html` — Privacy policy

Each can reuse the same `style.css`, `api.js`, `ranking.js`, and follow the same pattern as `index.html`.

---

## YouTube API Quota

Free tier: **10,000 units per day**.

Each operation costs:
- Fetch channel info: **1 unit**
- Fetch channel uploads playlist: **1 unit**
- Fetch 50 videos: **1 unit**
- Fetch video statistics: **1 unit**

**Example:** Fetching 7 channels × 25 videos each
```
= (7 × 1 channel info) 
+ (7 × 1 uploads playlist) 
+ (ceil(175 / 50) × 1 video details)
≈ 7 + 7 + 4 = 18 units per refresh
```

With a 30-minute cache, that's ~48 refreshes/day = ~864 units/day. Plenty of room for 2–3 concurrent users.

**If quota runs out:**
- Increase `CACHE_TTL_MINUTES` to 240 (4 hours) or higher
- Reduce `VIDEOS_PER_CHANNEL` to 15–20
- Clear localStorage to force a fresh fetch: `localStorage.clear()`

---

## Customization

### Change the Logo

Edit `index.html`, find:
```html
<a href="index.html" class="logo" aria-label="Haryanvi Charts home">
  <span class="logo-mark">H</span>
  <span class="logo-text">Haryanvi<em>Charts</em></span>
</a>
```

Replace with your own text/SVG.

### Change Colors

In `style.css`, edit the CSS custom properties at the top:
```css
:root {
  --gold-400: #f2c94c;    /* Accent color */
  --gold-500: #e3b23c;
  --gold-600: #c6932a;
  --jade-400: #4fd8ab;    /* "Rising" indicator */
  --jade-500: #2fbf9f;
  /* ...etc */
}
```

### Change Fonts

In `style.css`:
```css
--font-display: "Anton", "Arial Narrow", sans-serif;  /* Headings */
--font-body: "Space Grotesk", "Segoe UI", sans-serif;  /* Body text */
--font-mono: "JetBrains Mono", ui-monospace, monospace; /* Stats */
```

Replace with your own Google Fonts, or remove the @import at the top.

### Add More Sections

Edit `index.html` to add a new section, then in `app.js` add a render call:
```javascript
const myCharts = window.HVC.Ranking.myFilterFunction(filtered);
renderGrid("my-section-id", myCharts, renderSongCard);
```

---

## Troubleshooting

### "API Key Missing or Invalid"
- Did you paste your API key in `channels.js`?
- Did you enable the YouTube Data API v3 in Google Cloud Console?
- Is the key restricted to your GitHub Pages domain?

### "No Songs Found" or Loading forever
- Check the browser console (F12) for error messages
- Are the channel IDs correct? (Should start with `UC...`)
- Does each channel have public videos?
- Is your API quota exceeded? (Check Google Cloud Console)

### "Quota Exceeded"
- You've hit the 10,000-unit daily limit
- Increase cache time in `channels.js`: `CACHE_TTL_MINUTES: 240`
- Reduce videos per channel: `VIDEOS_PER_CHANNEL: 15`
- Try again tomorrow (quota resets at midnight PT)

### Charts not updating
- Data is cached. To force refresh: `localStorage.clear()` in console
- Or wait for the `CACHE_TTL_MINUTES` to expire

### Mobile menu not working
- Check browser console for JS errors
- Ensure JavaScript is enabled
- Try a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Performance Tips

1. **Cache strategically:** Set `CACHE_TTL_MINUTES: 240` for production (fetch once per 4 hours)
2. **Limit channels:** More channels = higher quota usage. Stick to 5–10
3. **Lazy loading:** Images use `loading="lazy"` — already built in
4. **Image optimization:** YouTube thumbnails are already optimized; no CDN needed

---

## License

This project is open source and available for personal, educational, and non-commercial use.

---

## Credits

Built with ❤️ for Haryanvi music lovers.

Inspired by [Billboard Hot 100](https://www.billboard.com/charts/hot-100/) and [Official Charts Company](https://www.officialcharts.com/).

---

## Support

Found a bug? Have a feature request?
1. Check the [troubleshooting](#troubleshooting) section above
2. Check your browser console (F12 → Console tab) for error messages
3. Double-check your API key and channel IDs
4. Try `localStorage.clear()` to reset cache

---

**Enjoy the charts! 🎵**
