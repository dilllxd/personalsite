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
5. **Last.fm Failover** - Added simple failover to `lastfm.dylan.lol` API when RPC backend is offline

The music widget now properly connects via WebSocket to the tidal-connection backend and provides real-time activity and music updates with smooth progress tracking. When the RPC backend is offline, it automatically falls back to the Last.fm API for music data.

## Last.fm Failover Feature

When `rpc.dylan.lol` is unavailable, the website automatically switches to `lastfm.dylan.lol/api/recent` to fetch music data, ensuring continuous music display.

### How it works
- ✅ **Automatic failover** when RPC backend is offline
- ✅ **Seamless switching** to Last.fm API
- ✅ **Automatic recovery** when RPC backend comes back online
- ✅ **No configuration needed** - works out of the box