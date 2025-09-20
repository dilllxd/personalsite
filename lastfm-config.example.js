// Last.fm Configuration Example
// Copy this file to setup your Last.fm failover credentials

// Steps to set up Last.fm failover:
// 1. Get a Last.fm API account: https://www.last.fm/api/account/create
// 2. Create an application to get your API key
// 3. Find your Last.fm username (visible in your profile URL)
// 4. Edit static/js/site.js and update the LASTFM_CONFIG object:

/*
const LASTFM_CONFIG = {
  apiKey: 'your-lastfm-api-key-here',
  username: 'your-lastfm-username-here'
};
*/

// Example configuration:
/*
const LASTFM_CONFIG = {
  apiKey: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  username: 'dylan_music_lover'
};
*/

// Features when Last.fm failover is active:
// - Shows currently playing or recently played tracks from Last.fm
// - Displays artist, track name, and album artwork when available
// - Updates every 15 seconds to respect Last.fm rate limits
// - Automatically switches back to RPC backend when it comes online
// - Shows "Last.fm Fallback" badge to indicate failover mode

// Note: Last.fm doesn't provide real-time position tracking or activity data,
// so the failover will only show music information without progress bars
// or game activity data.