/* ============================================================================
   admin/youtube-fetch.js
   ----------------------------------------------------------------------------
   Given a YouTube video URL pasted by the admin, extracts the video ID and
   calls YouTube Data API v3 to auto-fill: title, thumbnail, channel name,
   duration, views, likes, comments, and upload date.

   Uses the same YOUTUBE_API_KEY configured in /channels.js (CONFIG.API_KEY)
   — no separate key needed. Only the admin dashboard calls YouTube directly;
   the public site now reads from Firestore instead, which keeps quota usage
   low (see /firestore.js).
   ============================================================================ */

window.HVC = window.HVC || {};

window.HVC.YouTubeFetch = (() => {

  /**
   * Extract an 11-character YouTube video ID from any common URL format:
   * youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, etc.
   */
  function extractVideoId(url) {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    // Fallback: maybe the admin pasted the bare ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
    return null;
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return 0;
    const h = parseInt(m[1] || 0, 10);
    const min = parseInt(m[2] || 0, 10);
    const s = parseInt(m[3] || 0, 10);
    return h * 3600 + min * 60 + s;
  }

  function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = n => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  /**
   * Fetch full video details from a pasted YouTube URL.
   * Returns { videoId, title, thumbnail, channelTitle, channelId, views,
   *           likes, comments, duration, formattedDuration, uploadedAt, url }
   */
  async function fetchVideoDetails(youtubeUrl) {
    const apiKey = window.HVC.CONFIG?.API_KEY;
    if (!apiKey || apiKey === "YOUR_YOUTUBE_API_KEY_HERE") {
      throw new Error("YouTube API key not configured. Set CONFIG.API_KEY in channels.js.");
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Could not read a video ID from that URL. Paste a full YouTube link.");
    }

    const params = new URLSearchParams({
      part: "snippet,statistics,contentDetails",
      id: videoId,
      key: apiKey,
    });

    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "YouTube API request failed.");
    }
    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found. Check the URL and make sure the video is public.");
    }

    const video = data.items[0];
    const durationSeconds = parseDuration(video.contentDetails.duration);

    return {
      videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails?.maxres?.url
        || video.snippet.thumbnails?.high?.url
        || video.snippet.thumbnails?.default?.url,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      views: parseInt(video.statistics?.viewCount || 0, 10),
      likes: parseInt(video.statistics?.likeCount || 0, 10),
      comments: parseInt(video.statistics?.commentCount || 0, 10),
      duration: durationSeconds,
      formattedDuration: formatDuration(durationSeconds),
      uploadedAt: video.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  return { extractVideoId, fetchVideoDetails, formatDuration };
})();
