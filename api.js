/* ============================================================================
   api.js — YouTube Data API v3 Integration
   ---------------------------------------------------------------------------
   Handles all communication with YouTube Data API v3:
   - Fetch channel info (name, avatar)
   - Fetch video metadata (title, thumbnail, duration)
   - Fetch video statistics (views, likes, comments)
   - Handle pagination & quotas
   - Cache in localStorage to preserve daily quota
   - Graceful error handling
   ============================================================================ */

window.HVC = window.HVC || {};

/**
 * YouTube Data API Service.
 * All methods are async and return promises.
 * Each API call is cached in localStorage with a TTL.
 */
window.HVC.API = (() => {
  const BASE_URL = "https://www.googleapis.com/youtube/v3";
  const CACHE_PREFIX = "hvc_cache_";

  /**
   * Cache a value with TTL (time-to-live in minutes)
   */
  function setCache(key, value, ttlMinutes = 30) {
    const now = Date.now();
    const expiresAt = now + ttlMinutes * 60 * 1000;
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        value,
        expiresAt,
        timestamp: now
      }));
    } catch (e) {
      console.warn("LocalStorage quota exceeded or unavailable:", e);
    }
  }

  /**
   * Retrieve a cached value if still valid (not expired)
   */
  function getCache(key) {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const data = JSON.parse(cached);
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return data.value;
    } catch (e) {
      return null;
    }
  }

  /**
   * Make a GET request to YouTube API with error handling
   */
  async function request(endpoint, params = {}) {
    const defaultParams = {
      key: window.HVC.CONFIG.API_KEY,
      ...params
    };

    const queryString = new URLSearchParams(defaultParams).toString();
    const url = `${BASE_URL}/${endpoint}?${queryString}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error?.message || `API Error: ${response.status}`;

        // Handle quota exceeded
        if (response.status === 403 && errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
          throw {
            type: 'QUOTA_EXCEEDED',
            message: 'Daily YouTube API quota exhausted. Try again tomorrow.',
            status: 403
          };
        }

        // Handle invalid API key
        if (response.status === 400 && errorMsg.includes('key')) {
          throw {
            type: 'INVALID_API_KEY',
            message: 'YouTube API key is invalid or not configured. See README.md for setup.',
            status: 400
          };
        }

        throw {
          type: 'API_ERROR',
          message: errorMsg,
          status: response.status
        };
      }

      return await response.json();
    } catch (error) {
      if (error.type) throw error; // Re-throw our custom errors
      throw {
        type: 'NETWORK_ERROR',
        message: error.message || 'Network request failed',
        status: 0
      };
    }
  }

  /**
   * Fetch channel info: name, custom URL, avatar image
   */
  async function getChannelInfo(channelId) {
    const cacheKey = `channel_${channelId}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const data = await request("channels", {
      part: "snippet,brandingSettings",
      id: channelId,
      fields: "items(id,snippet(title,description,customUrl,thumbnails),brandingSettings(image(bannerImageUrl)))"
    });

    if (!data.items || data.items.length === 0) {
      throw {
        type: 'CHANNEL_NOT_FOUND',
        message: `Channel ${channelId} not found on YouTube`,
        status: 404
      };
    }

    const channel = data.items[0];
    const info = {
      id: channel.id,
      name: channel.snippet.title,
      customUrl: channel.snippet.customUrl || null,
      avatar: channel.snippet.thumbnails?.high?.url || null,
      description: channel.snippet.description || ""
    };

    setCache(cacheKey, info, window.HVC.CONFIG.CACHE_TTL_MINUTES);
    return info;
  }

  /**
   * Fetch videos from a channel's uploads playlist.
   * Returns array of video IDs.
   */
  async function getChannelVideos(channelId, maxResults = 25) {
    // First, get the uploads playlist ID
    const playlistKey = `uploads_playlist_${channelId}`;
    let uploadsPlaylistId = getCache(playlistKey);

    if (!uploadsPlaylistId) {
      const channelData = await request("channels", {
        part: "contentDetails",
        id: channelId,
        fields: "items(contentDetails(relatedPlaylists(uploads)))"
      });

      if (!channelData.items?.[0]) {
        throw {
          type: 'CHANNEL_ERROR',
          message: `Could not fetch uploads for channel ${channelId}`,
          status: 404
        };
      }

      uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      setCache(playlistKey, uploadsPlaylistId, window.HVC.CONFIG.CACHE_TTL_MINUTES);
    }

    // Now fetch videos from the uploads playlist
    const videosKey = `videos_${channelId}`;
    const cached = getCache(videosKey);
    if (cached) return cached;

    const allVideoIds = [];
    let pageToken = null;
    const resultsNeeded = maxResults;

    try {
      do {
        const playlistData = await request("playlistItems", {
          part: "contentDetails",
          playlistId: uploadsPlaylistId,
          maxResults: Math.min(50, resultsNeeded - allVideoIds.length),
          pageToken: pageToken || undefined,
          fields: "items(contentDetails(videoId)),nextPageToken"
        });

        const videoIds = playlistData.items?.map(item => item.contentDetails.videoId) || [];
        allVideoIds.push(...videoIds);

        pageToken = playlistData.nextPageToken;
      } while (pageToken && allVideoIds.length < resultsNeeded);
    } catch (error) {
      // If playlist fetch fails, return what we have
      if (allVideoIds.length === 0) throw error;
    }

    setCache(videosKey, allVideoIds, window.HVC.CONFIG.CACHE_TTL_MINUTES);
    return allVideoIds;
  }

  /**
   * Fetch detailed stats for videos: title, thumbnail, duration, views, likes, comments, uploadedAt
   * Accepts array of video IDs (max 50 per request due to YouTube API)
   */
  async function getVideoDetails(videoIds) {
    if (!videoIds || videoIds.length === 0) return [];

    const cacheKey = `video_details_${videoIds.join(",")}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    // Split into chunks of 50 (YouTube API limit)
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      chunks.push(videoIds.slice(i, i + 50));
    }

    const allVideos = [];

    for (const chunk of chunks) {
      const data = await request("videos", {
        part: "snippet,statistics,contentDetails",
        id: chunk.join(","),
        fields: "items(id,snippet(title,description,channelId,thumbnails,publishedAt),statistics(viewCount,likeCount,commentCount),contentDetails(duration))"
      });

      const videos = data.items?.map(video => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description || "",
        channelId: video.snippet.channelId,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || null,
        views: parseInt(video.statistics?.viewCount || 0),
        likes: parseInt(video.statistics?.likeCount || 0),
        comments: parseInt(video.statistics?.commentCount || 0),
        duration: parseDuration(video.contentDetails.duration),
        uploadedAt: new Date(video.snippet.publishedAt),
        url: `https://www.youtube.com/watch?v=${video.id}`
      })) || [];

      allVideos.push(...videos);
    }

    setCache(cacheKey, allVideos, window.HVC.CONFIG.CACHE_TTL_MINUTES);
    return allVideos;
  }

  /**
   * Parse ISO 8601 duration (e.g., "PT1H23M45S") to seconds
   */
  function parseDuration(isoDuration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);

    if (!matches) return 0;

    const hours = (matches[1] !== undefined) ? parseInt(matches[1], 10) : 0;
    const minutes = (matches[2] !== undefined) ? parseInt(matches[2], 10) : 0;
    const seconds = (matches[3] !== undefined) ? parseInt(matches[3], 10) : 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Format seconds to MM:SS or H:MM:SS
   */
  function formatDuration(seconds) {
    if (seconds === 0) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${minutes}:${pad(secs)}`;
  }

  /**
   * Fetch all songs from all configured channels.
   * Returns array of fully enriched video objects with channel name & ranking data.
   */
  async function fetchAllSongs() {
    const allSongs = [];
    const errors = [];

    for (const channel of window.HVC.CHANNELS) {
      try {
        // Get channel info
        const channelInfo = await getChannelInfo(channel.id);

        // Get video IDs
        const videoIds = await getChannelVideos(channel.id, window.HVC.CONFIG.VIDEOS_PER_CHANNEL);

        // Get video details (batched, max 50 at a time)
        const videos = await getVideoDetails(videoIds);

        // Enrich with channel info
        const enriched = videos.map(video => ({
          ...video,
          channelName: channelInfo.name,
          channelId: channel.id,
          label: channelInfo.name, // label = channel name for charts
          formattedDuration: formatDuration(video.duration)
        }));

        allSongs.push(...enriched);
      } catch (error) {
        // Log error but continue with other channels
        errors.push({
          channel: channel.name,
          error: error.message || error
        });
        console.error(`Error fetching ${channel.name}:`, error);
      }
    }

    return { songs: allSongs, errors };
  }

  /**
   * Clear all cached data
   */
  function clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get cache stats for debugging
   */
  function getCacheStats() {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    return {
      cacheCount: cacheKeys.length,
      cacheSize: keys.length
    };
  }

  // Public API
  return {
    getChannelInfo,
    getChannelVideos,
    getVideoDetails,
    fetchAllSongs,
    clearCache,
    getCacheStats,
    formatDuration
  };
})();
