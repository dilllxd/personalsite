# Dylan's Personal Site

Welcome to my website repository. This houses/hosts the code that powers my personal site.

## Recent Fixes (September 2025)

✅ **All Issues Resolved:**

1. **Connection text formatting** - Fixed connecting state display with proper styling and message formatting
2. **Music position on refresh** - Fixed music position to show actual current position instead of starting at 0:00, added proper position tracking for refresh scenarios
3. **Comprehensive music updates** - Added real-time updates for:
   - Skip/reverse >5 seconds
   - Song changes
   - Pause/resume state changes
   - Proper position synchronization
4. **WebSocket connectivity** - Completed WebSocket conversion and fixed CORS issues that were preventing the website from connecting to the rpc.dylan.lol backend
5. **Last.fm Failover** - Added Last.fm scrobble failover support when RPC backend is offline, ensuring music data is always available

The music widget now properly connects via WebSocket to the tidal-connection backend and provides real-time activity and music updates with smooth progress tracking. When the RPC backend is offline, it automatically falls back to Last.fm for music data.

## Last.fm Failover Feature

### Overview
The website now includes a failover system that uses Last.fm as a backup music data source when the primary RPC backend is unavailable. This ensures that music information is still displayed even when the main backend is offline.

### Setup
1. Get a Last.fm API key from [Last.fm API](https://www.last.fm/api/account/create)
2. Edit `static/js/site.js` and update the `LASTFM_CONFIG` object with your credentials
3. See `LASTFM_FAILOVER.md` for detailed setup instructions

### Features
- ✅ Automatic failover when RPC backend is offline
- ✅ Shows currently playing/recent tracks from Last.fm
- ✅ Album artwork and track information
- ✅ Automatic recovery when RPC backend comes back online
- ✅ Respects Last.fm API rate limits

### Files Added
- `static/js/lastfm-service.js` - Last.fm API client
- `LASTFM_FAILOVER.md` - Detailed documentation
- `lastfm-config.example.js` - Configuration example
- `test-lastfm.html` - Test page for Last.fm connectivity