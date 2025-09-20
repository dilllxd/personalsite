// Last.fm API service for failover when RPC backend is offline
class LastFmService {
  constructor(apiKey, username) {
    this.apiKey = apiKey;
    this.username = username;
    this.baseUrl = 'https://ws.audioscrobbler.com/2.0/';
    this.lastTrackData = null;
    this.pollInterval = null;
  }

  async getRecentTracks(limit = 1) {
    try {
      const params = new URLSearchParams({
        method: 'user.getrecenttracks',
        user: this.username,
        api_key: this.apiKey,
        format: 'json',
        limit: limit,
        extended: '1' // Get extended track info
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`Last.fm API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Last.fm API error: ${data.message}`);
      }

      return this.transformLastFmData(data);
    } catch (error) {
      console.error('Last.fm API error:', error);
      throw error;
    }
  }

  transformLastFmData(lastFmData) {
    const tracks = lastFmData.recenttracks?.track;
    if (!tracks || tracks.length === 0) {
      return null;
    }

    // Get the most recent track (could be nowplaying or recently played)
    const track = Array.isArray(tracks) ? tracks[0] : tracks;

    // Check if currently playing
    const isNowPlaying = track['@attr']?.nowplaying === 'true';

    // Get the largest available image
    const getImageUrl = (images) => {
      if (!images || !Array.isArray(images)) return null;

      // Try to get largest image first
      const sizes = ['extralarge', 'large', 'medium', 'small'];
      for (const size of sizes) {
        const image = images.find(img => img.size === size);
        if (image && image['#text']) {
          return image['#text'];
        }
      }
      return null;
    };

    // Transform to match the RPC backend format
    const musicData = {
      title: track.name || 'Unknown Track',
      artist: track.artist?.name || track.artist?.['#text'] || 'Unknown Artist',
      album: track.album?.['#text'] || '',
      artUrl: getImageUrl(track.image),
      status: isNowPlaying ? 'Playing' : 'Paused',
      position: 0, // Last.fm doesn't provide position
      length: 0,   // Last.fm doesn't provide track length
      timestamp: track.date?.uts ? parseInt(track.date.uts) : Date.now() / 1000
    };

    return {
      music: musicData,
      activity: null, // Last.fm only provides music data
      source: 'lastfm'
    };
  }

  async startPolling(callback, interval = 30000) {
    // Initial fetch
    try {
      const data = await this.getRecentTracks();
      if (data) {
        callback(data);
      }
    } catch (error) {
      console.error('Initial Last.fm fetch failed:', error);
    }

    // Set up polling
    this.pollInterval = setInterval(async () => {
      try {
        const data = await this.getRecentTracks();
        if (data) {
          // Only call callback if track has changed
          const currentTrack = data.music;
          if (!this.lastTrackData ||
              this.lastTrackData.title !== currentTrack.title ||
              this.lastTrackData.artist !== currentTrack.artist ||
              this.lastTrackData.status !== currentTrack.status) {
            this.lastTrackData = currentTrack;
            callback(data);
          }
        }
      } catch (error) {
        console.error('Last.fm polling error:', error);
      }
    }, interval);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  isConfigured() {
    return !!(this.apiKey && this.username);
  }
}

// Export for use in other modules
window.LastFmService = LastFmService;