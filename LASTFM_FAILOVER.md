# Last.fm Failover Feature

This feature provides a fallback music data source when the primary RPC backend (`rpc.dylan.lol`) is offline, ensuring that music information is still displayed on the website.

## How It Works

1. **Primary Source**: The website normally connects to the RPC backend via WebSocket for real-time activity and music data
2. **Failover Trigger**: When the RPC backend is offline or unreachable, the system automatically switches to Last.fm
3. **Automatic Recovery**: When the RPC backend comes back online, the system automatically switches back

## Setup Instructions

### 1. Get Last.fm API Credentials

1. Visit [Last.fm API Account Creation](https://www.last.fm/api/account/create)
2. Create an account if you don't have one
3. Create a new application to get your API key
4. Note down your API key and your Last.fm username

### 2. Configure the Website

Edit `static/js/site.js` and update the `LASTFM_CONFIG` object:

```javascript
const LASTFM_CONFIG = {
  apiKey: 'your-api-key-here',
  username: 'your-username-here'
};
```

### 3. Test the Failover

1. Configure Last.fm credentials as above
2. Open the website in a browser
3. Open browser dev tools to see console logs
4. The system will automatically use Last.fm if the RPC backend is unavailable

## Features

### When Using Last.fm Failover

- ✅ Shows currently playing or recently played tracks
- ✅ Displays artist, track name, and album
- ✅ Shows album artwork when available
- ✅ Updates every 15 seconds (respects Last.fm rate limits)
- ✅ Displays "Last.fm Fallback" badge
- ❌ No real-time position tracking (Last.fm doesn't provide this)
- ❌ No activity/game data (Last.fm is music-only)

### When RPC Backend is Online

- ✅ Real-time music position tracking
- ✅ Activity and game data
- ✅ WebSocket updates for instant changes
- ✅ Full feature set

## Technical Details

### Last.fm API Usage

- Uses `user.getrecenttracks` method
- No authentication required for reading public data
- Rate limited to prevent API abuse
- Polls every 15 seconds when active

### Failover Logic

1. **Connection Monitoring**: Continuously monitors RPC backend health
2. **Intelligent Switching**: Only activates Last.fm when RPC is confirmed offline
3. **Graceful Recovery**: Automatically switches back when RPC recovers
4. **Error Handling**: Robust error handling for both data sources

### Console Logging

Monitor failover activity in browser console:

```
[WebSocket] Connected to activity server
[WebSocket] Disconnected from activity server: transport close
RPC backend offline, switching to Last.fm failover
Activating Last.fm failover
[Last.fm] Received data: { music: { ... }, source: 'lastfm' }
[WebSocket] Connected to activity server
RPC backend back online, switching from Last.fm failover
Deactivating Last.fm failover
```

## Security Considerations

- Last.fm API keys are client-side visible (standard for web apps)
- Only public Last.fm data is accessed (no write permissions)
- No sensitive information is stored or transmitted

## Troubleshooting

### Last.fm Not Working

1. **Check Configuration**: Ensure API key and username are correct
2. **Check Username**: Must be your actual Last.fm username (visible in profile URL)
3. **Check Console**: Look for Last.fm API errors in browser console
4. **Check Privacy**: Ensure your Last.fm profile is public

### Common Issues

- **"Invalid API key"**: Double-check your API key
- **"User not found"**: Verify your username spelling
- **No recent tracks**: Make sure you've scrobbled music recently
- **Rate limited**: Last.fm has API rate limits; wait a minute and try again

## Example Configuration

```javascript
// In static/js/site.js
const LASTFM_CONFIG = {
  apiKey: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  username: 'dylan_music_lover'
};
```

This enables automatic failover to Last.fm when the RPC backend is unavailable, ensuring music data is always displayed when possible.