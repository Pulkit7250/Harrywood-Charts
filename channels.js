/* ============================================================================
   channels.js
   ----------------------------------------------------------------------------
   ADMIN CONFIGURATION FILE.

   This is the ONLY file you need to touch to add/remove YouTube channels that
   Haryanvi Charts tracks. Everything else (fetching, ranking, rendering) is
   fully automatic — add a channel here and it will appear on the site after
   the next page load / cache refresh.

   HOW TO ADD A CHANNEL
   ----------------------------------------------------------------------------
   1. Go to the channel's YouTube page.
   2. Get its Channel ID (starts with "UC..."). Easiest ways:
        a. View page source and search for "channelId".
        b. Use a free tool like https://commentpicker.com/youtube-channel-id.php
        c. If you only have a video URL, open it, click the channel name,
           then copy the ID from the resulting /channel/UC... URL.
   3. Add a new object to the CHANNELS array below:
        { id: "UCxxxxxxxxxxxxxxxxxxxxxx", name: "Channel Display Name" }
   4. Save the file, commit, and push. No other code changes needed.

   There is no limit on how many channels you can add. More channels = more
   YouTube Data API quota used per refresh, so see CONFIG.CACHE_TTL_MINUTES
   below if you add a lot of channels and want to conserve your daily quota.
   ============================================================================ */

// Shared global namespace used by every script file (channels/api/ranking/app)
// so we can avoid ES module imports entirely — this keeps the site a plain
// static site that runs directly on GitHub Pages with zero build step.
window.HVC = window.HVC || {};

/**
 * The list of YouTube channels Haryanvi Charts pulls songs from.
 * "name" is a friendly display fallback; the real channel title & avatar
 * are fetched live from YouTube and used wherever possible.
 */
window.HVC.CHANNELS = [
  { id: "UC3Zva7aW8lJUFZQYnC-XyHg", name: "T-Series Haryanvi" },
  { id: "UCbYXVxwDEWc9sIt6yZhweqQ", name: "Nav Haryanvi" },
  { id: "UC3zVeAaoPEN1Tu25dW3G2Ig", name: "Sonotek" },
  { id: "UCQuLyitHTE9LfUAxlhDfgig", name: "White Hill Dhaakad" },
  { id: "UC_wRxe9tOFevlxOfDpRKuMw", name: "Speed Records Haryanvi" },
  { id: "UCUUvkLxCmmqyc2FjbfcQOYw", name: "Desi Rock" },
  { id: "UC_Rh_RLrouZHPf2vUFvaP_g", name: "Mor Haryanvi" },
  // { id: "UCxxxxxxxxxxxxxxxxxxxxxx", name: "Add Your Channel Here" },
];

/**
 * Site-wide tunable settings. Nothing here requires touching api.js,
 * ranking.js or app.js.
 */
window.HVC.CONFIG = {
  // --------------------------------------------------------------------
  // YOUTUBE DATA API KEY
  // --------------------------------------------------------------------
  // Paste your own YouTube Data API v3 key between the quotes below.
  // See README.md → "Get a YouTube API Key" for step-by-step instructions.
  // The key is used client-side (this is a static site with no backend),
  // so make sure you restrict it to your GitHub Pages domain + the
  // YouTube Data API v3 in the Google Cloud Console.
  API_KEY: "YOUR_YOUTUBE_API_KEY_HERE",

  // How many of each channel's most recent uploads to pull per refresh.
  // Higher = more complete charts, but costs more API quota per refresh.
  VIDEOS_PER_CHANNEL: 25,

  // How long fetched data is cached in the browser (localStorage) before
  // being re-fetched from YouTube, in minutes. Raise this if you are
  // worried about hitting your daily quota (10,000 units/day on the
  // default free tier). Each full refresh costs roughly:
  //   (channels × 1 unit for channel info)
  // + (channels × 1 unit per 50 videos for playlist paging)
  // + (ceil(totalVideos / 50) unit(s) for video details)
  CACHE_TTL_MINUTES: 30,

  // Songs newer than this many days are eligible for "New Releases".
  NEW_RELEASE_WINDOW_DAYS: 21,

  // Songs newer than this many days are eligible for "Fastest Rising"
  // (keeps long-standing catalog hits from crowding out real momentum).
  RISING_WINDOW_DAYS: 45,

  // How many songs/artists each homepage section shows.
  SECTION_SIZES: {
    top10: 10,
    newReleases: 8,
    topArtists: 10,
    fastestRising: 6,
    mostViewed: 8,
    recentlyAdded: 8,
  },

  // Full chart size for the Top 100 page.
  TOP_CHART_SIZE: 100,
};
