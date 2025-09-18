import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const yearsSinceElements = document.querySelectorAll('[data-years-since]');
  yearsSinceElements.forEach((element) => {
    const startYear = Number.parseInt(element.getAttribute('data-years-since'), 10) || now.getFullYear();
    element.textContent = Math.max(0, now.getFullYear() - startYear);
  });

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(now.getFullYear());
  });

  const root = document.body;
  const themeToggleButton = document.querySelector('[data-theme-toggle]');
  const themeToggleLabel = document.querySelector('[data-theme-toggle-label]');
  const themeToggleIcon = document.querySelector('[data-theme-toggle-icon]');
  const storageKey = 'theme-preference';

  const applyTheme = (theme, { persist = true } = {}) => {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', normalizedTheme);

    if (persist) {
      try {
        window.localStorage.setItem(storageKey, normalizedTheme);
      } catch (error) {
        // Ignore storage errors (private mode, etc.).
      }
    }

    if (themeToggleButton) {
      themeToggleButton.setAttribute('aria-pressed', normalizedTheme === 'light' ? 'true' : 'false');
    }

    if (themeToggleLabel) {
      themeToggleLabel.textContent = normalizedTheme === 'light' ? 'Dark mode' : 'Light mode';
    }

    if (themeToggleIcon) {
      themeToggleIcon.setAttribute('data-lucide', normalizedTheme === 'light' ? 'moon' : 'sun');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  };

  const storedTheme = (() => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  })();

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme(prefersLight.matches ? 'light' : 'dark', { persist: false });

    const handlePreferenceChange = (event) => {
      const hasStoredPreference = (() => {
        try {
          return window.localStorage.getItem(storageKey);
        } catch (error) {
          return null;
        }
      })();

      if (!hasStoredPreference) {
        applyTheme(event.matches ? 'light' : 'dark', { persist: false });
      }
    };

    if (typeof prefersLight.addEventListener === 'function') {
      prefersLight.addEventListener('change', handlePreferenceChange);
    } else if (typeof prefersLight.addListener === 'function') {
      prefersLight.addListener(handlePreferenceChange);
    }
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  console.log('anime check:', typeof anime);
  console.log('reduced motion:', prefersReducedMotion);

  if (prefersReducedMotion || typeof anime === 'undefined') {
    console.log('Using fallback - no animations');
    document
      .querySelectorAll('[data-animate]')
      .forEach((element) => element.classList.add('is-visible'));
    return;
  }

  console.log('Running anime.js animations');

  // Check if elements exist
  const introEl = document.querySelector('.hero__intro[data-animate]');
  const asideEl = document.querySelector('.hero__aside[data-animate]');

  console.log('intro element:', introEl);
  console.log('aside element:', asideEl);

  if (introEl) {
    console.log('Animating intro with grouped animations');

    // First animate the container
    anime({
      targets: introEl,
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 800,
      delay: 200,
      easing: 'easeOutQuart'
    });

    // Group 1: Header content (eyebrow, title, lead)
    const headerGroup = introEl.querySelectorAll('.hero__eyebrow, .hero__title, .hero__lead');
    anime({
      targets: headerGroup,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: 400,
      easing: 'easeOutQuart'
    });

    // Group 2: Description and stats
    const contentGroup = introEl.querySelectorAll('.hero__description, .hero__stats');
    anime({
      targets: contentGroup,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: 600,
      easing: 'easeOutQuart'
    });

    // Group 3: Actions
    const actionsGroup = introEl.querySelectorAll('.hero__actions');
    anime({
      targets: actionsGroup,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: 800,
      easing: 'easeOutQuart'
    });
  }

  if (asideEl) {
    console.log('Animating aside with grouped animations');

    // Animate the aside container
    anime({
      targets: asideEl,
      opacity: [0, 1],
      translateX: [30, 0],
      duration: 800,
      delay: 900,
      easing: 'easeOutQuart'
    });

    // Group all cards together AND their link cards - everything at once
    const cards = asideEl.querySelectorAll('.card');
    const linkCards = asideEl.querySelectorAll('.link-card');
    anime({
      targets: [...cards, ...linkCards],
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600,
      delay: 1000,
      easing: 'easeOutQuart'
    });
  }

  // No fallback needed - only animating the main containers

  // Subtle orb movements - very gentle
  const orbs = document.querySelectorAll('[data-orb]');
  if (orbs.length) {
    orbs.forEach((orb, index) => {
      anime({
        targets: orb,
        translateX: () => anime.random(-20, 20),
        translateY: () => anime.random(-30, 30),
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: () => anime.random(15000, 25000),
        delay: index * 2000,
        loop: true,
      });
    });
  }

  // Activity widget functionality (music + games)
  const initActivityWidget = () => {
    const widgetCard = document.querySelector('.card--widget');
    const widgetShell = document.querySelector('.widget-shell');
    const widgetArtwork = document.querySelector('.widget-shell__artwork');
    const widgetLabel = document.querySelector('.widget-shell__label');
    const widgetHint = document.querySelector('.widget-shell__hint');
    const cardBadge = document.querySelector('.card--widget .card__badge');

    if (!widgetCard || !widgetShell) return;

    let updateInterval;
    let isConnected = false;

    let lastGameName = null;
    let cachedGameArtworkUrl = null;

    const resetGameArtworkCache = () => {
      lastGameName = null;
      cachedGameArtworkUrl = null;
    };

    const setLabel = (iconName, text) => {
      if (!widgetLabel) return;
      widgetLabel.innerHTML = '';
      widgetLabel.className = 'widget-shell__label';

      if (iconName) {
        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', iconName);
        iconEl.setAttribute('aria-hidden', 'true');
        widgetLabel.appendChild(iconEl);
      }

      const { content, shouldMultiline } = createMultilineText(text);
      const textEl = document.createElement('span');
      textEl.className = shouldMultiline ? 'widget-shell__label-text widget-shell__label-text--multiline' : 'widget-shell__label-text';
      textEl.textContent = content;

      widgetLabel.appendChild(textEl);

      // Reinitialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };

    const setDualLabels = (gameIcon, gameText, musicIcon, musicText) => {
      if (!widgetLabel) return;
      widgetLabel.innerHTML = '';
      widgetLabel.className = 'widget-shell__label widget-shell__label--dual';

      // Game label
      const gameLabel = document.createElement('div');
      gameLabel.className = 'widget-shell__label-item';

      const gameIconEl = document.createElement('i');
      gameIconEl.setAttribute('data-lucide', gameIcon);
      gameIconEl.setAttribute('aria-hidden', 'true');
      gameLabel.appendChild(gameIconEl);

      const { content: gameContent, shouldMultiline: gameMultiline } = createMultilineText(gameText);
      const gameTextEl = document.createElement('span');
      gameTextEl.className = gameMultiline ? 'widget-shell__label-text widget-shell__label-text--multiline' : 'widget-shell__label-text';
      gameTextEl.textContent = gameContent;
      gameLabel.appendChild(gameTextEl);

      // Music label
      const musicLabel = document.createElement('div');
      musicLabel.className = 'widget-shell__label-item';

      const musicIconEl = document.createElement('i');
      musicIconEl.setAttribute('data-lucide', musicIcon);
      musicIconEl.setAttribute('aria-hidden', 'true');
      musicLabel.appendChild(musicIconEl);

      const { content: musicContent, shouldMultiline: musicMultiline } = createMultilineText(musicText);
      const musicTextEl = document.createElement('span');
      musicTextEl.className = musicMultiline ? 'widget-shell__label-text widget-shell__label-text--multiline' : 'widget-shell__label-text';
      musicTextEl.textContent = musicContent;
      musicLabel.appendChild(musicTextEl);

      widgetLabel.appendChild(gameLabel);
      widgetLabel.appendChild(musicLabel);

      // Reinitialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };

    const setLabelWithSubtext = (iconName, text, subtext) => {
      if (!widgetLabel) return;
      widgetLabel.innerHTML = '';
      widgetLabel.className = 'widget-shell__label widget-shell__label--with-subtext';

      const mainRow = document.createElement('div');
      mainRow.className = 'widget-shell__label-main';
      widgetLabel.appendChild(mainRow);

      if (iconName) {
        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', iconName);
        iconEl.setAttribute('aria-hidden', 'true');
        mainRow.appendChild(iconEl);
      }

      const { content, shouldMultiline } = createMultilineText(text);
      const textEl = document.createElement('span');
      textEl.className = shouldMultiline ? 'widget-shell__label-text widget-shell__label-text--multiline' : 'widget-shell__label-text';
      textEl.textContent = content;
      mainRow.appendChild(textEl);

      if (subtext) {
        const subtextEl = document.createElement('div');
        subtextEl.className = 'widget-shell__label-subtext';
        subtextEl.textContent = subtext;
        widgetLabel.appendChild(subtextEl);
      }

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };

    const setBadge = (text, color) => {
      if (!cardBadge) return;
      cardBadge.textContent = text;
      cardBadge.style.backgroundColor = color;
    };

    const createMultilineText = (text, maxLength = 30) => {
      if (!text) return { content: '', shouldMultiline: false };
      const shouldMultiline = text.length > maxLength;
      return {
        content: text,
        shouldMultiline
      };
    };

    const calculatePlaytime = (startTime) => {
      if (!startTime) return null;

      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const elapsed = now - startTime; // Elapsed time in seconds

      if (elapsed < 60) {
        return `${elapsed}s`;
      } else if (elapsed < 3600) {
        const minutes = Math.floor(elapsed / 60);
        return `${minutes}m`;
      } else {
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      }
    };

    const renderHintLines = (lines = [], fallbackText = '') => {
      if (!widgetHint) return;
      widgetHint.innerHTML = '';

      // Get the meta container to add/remove centering class
      const metaContainer = document.querySelector('.widget-shell__meta');

      if (!lines.length && !fallbackText) {
        // No hint content - add centering class
        if (metaContainer) {
          metaContainer.classList.add('widget-shell__meta--no-hint');
          metaContainer.classList.remove('widget-shell__meta--with-hint');
        }
        return;
      }

      // Has hint content - add with-hint class and remove no-hint class
      if (metaContainer) {
        metaContainer.classList.remove('widget-shell__meta--no-hint');
        metaContainer.classList.add('widget-shell__meta--with-hint');
      }

      if (!lines.length) {
        widgetHint.textContent = fallbackText;
        return;
      }

      lines.forEach(({ icon, text }) => {
        if (!text) return;
        const line = document.createElement('span');
        line.className = 'widget-shell__hint-line';

        if (icon) {
          const iconEl = document.createElement('i');
          iconEl.setAttribute('data-lucide', icon);
          iconEl.setAttribute('aria-hidden', 'true');
          line.appendChild(iconEl);
        }

        const textEl = document.createElement('span');
        textEl.textContent = text;
        line.appendChild(textEl);

        widgetHint.appendChild(line);
      });

      // Reinitialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    };

    const getTrackLine = (musicData) => {
      const title = musicData.title && musicData.title !== 'Not Playing' ? musicData.title : '';
      const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : '';
      return [title, artist].filter(Boolean).join(' — ');
    };

    const updateWidget = async (activityData) => {
      if (!activityData) return;

      const musicData = activityData.music || {};
      const gameData = activityData.game || {};

      const isMusicPlaying = musicData.status === 'Playing';
      const hasMusic = isMusicPlaying && musicData.title && musicData.title !== 'Not Playing';
      const hasGame = gameData.name && gameData.name !== '';

      // Determine what to display based on current activities
      if (hasMusic && hasGame) {
        // Both music and game - prioritize game but show music info
        await updateForGame(gameData, musicData);
      } else if (hasGame) {
        // Only game
        await updateForGame(gameData);
      } else if (hasMusic) {
        // Only music
        updateForMusic(musicData);
      } else {
        // Nothing playing
        updateForIdle();
      }
    };

    const updateForMusic = (musicData) => {
      resetGameArtworkCache();

      const isPlaying = musicData.status === 'Playing';

      if (!isPlaying) {
        updateForIdle();
        return;
      }

      // Update artwork
      if (musicData.artUrl && widgetArtwork) {
        widgetArtwork.style.backgroundImage = `url("${musicData.artUrl}")`;
        widgetArtwork.style.backgroundSize = 'cover';
        widgetArtwork.style.backgroundPosition = 'center';
        widgetArtwork.style.backgroundColor = '';
        widgetArtwork.style.opacity = '1';
        widgetArtwork.innerHTML = '';
      } else if (widgetArtwork) {
        // Add music-themed animated fallback
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
        widgetArtwork.style.opacity = '1';

        if (typeof anime !== 'undefined') {
          widgetArtwork.innerHTML = `
            <div class="music-animation">
              <div class="music-wave music-wave-1"></div>
              <div class="music-wave music-wave-2"></div>
              <div class="music-wave music-wave-3"></div>
              <div class="music-wave music-wave-4"></div>
            </div>
          `;
          const musicContainer = widgetArtwork.querySelector('.music-animation');
          if (musicContainer) {
            musicContainer.style.cssText = `
              position: absolute;
              inset: 0;
              display: flex;
              align-items: end;
              justify-content: center;
              gap: 4px;
              padding: 20px;
              border-radius: 24px;
            `;

            const waves = widgetArtwork.querySelectorAll('.music-wave');
            waves.forEach((wave, index) => {
              wave.style.cssText = `
                width: 6px;
                height: ${20 + index * 8}px;
                background: linear-gradient(to top,
                  rgba(16,185,129,0.6),
                  rgba(6,182,212,0.4));
                border-radius: 3px;
              `;

              anime({
                targets: wave,
                scaleY: [0.3, 1, 0.8, 1, 0.5],
                duration: () => anime.random(800, 1500),
                delay: index * 150,
                easing: 'easeInOutSine',
                loop: true
              });
            });
          }
        }
      }

      const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : 'Unknown Artist';
      const title = musicData.title && musicData.title !== 'Not Playing' ? musicData.title : 'Unknown Track';

      setLabel('music', artist);

      // Show song title as hint
      renderHintLines([], title);

      // Update badge
      setBadge('Listening', '#10b981');
    };

    const tryGetGameArtwork = async (gameName) => {
      if (!gameName || gameName === 'In game') return null;

      try {
        const response = await fetch('https://rpc.dylan.lol/api/game-artwork', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ gameName })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.imageUrl) {
            return data.imageUrl;
          }
        }
      } catch (error) {
        console.log('Game artwork API error:', error);
      }

      return null;
    };

    const updateForGame = async (gameData, musicData = null) => {
      const gameName = gameData.name && gameData.name !== '' ? gameData.name : 'Unknown Game';
      const hasMusic =
        musicData &&
        musicData.status === 'Playing' &&
        musicData.title &&
        musicData.title !== 'Not Playing';

      // Handle artwork
      if (widgetArtwork) {
        // Try to get game artwork first (fetch only when the game changes)
        if (gameName !== lastGameName) {
          lastGameName = gameName;
          cachedGameArtworkUrl = await tryGetGameArtwork(gameName);
        }

        const gameArtworkUrl = cachedGameArtworkUrl;

        if (gameArtworkUrl) {
          widgetArtwork.style.backgroundImage = `url("${gameArtworkUrl}")`;
          widgetArtwork.style.backgroundSize = 'cover';
          widgetArtwork.style.backgroundRepeat = 'no-repeat';
          widgetArtwork.style.backgroundPosition = 'center';
          widgetArtwork.style.backgroundColor = '';
          widgetArtwork.style.opacity = '1';
          widgetArtwork.innerHTML = '';
        } else if (
          musicData &&
          musicData.status === 'Playing' &&
          musicData.artUrl
        ) {
          // Fallback to music artwork if no game logo
          widgetArtwork.style.backgroundImage = `url("${musicData.artUrl}")`;
          widgetArtwork.style.backgroundSize = 'cover';
          widgetArtwork.style.backgroundPosition = 'center';
          widgetArtwork.style.backgroundColor = '';
          widgetArtwork.style.opacity = '0.6'; // Slightly dim the music artwork
          widgetArtwork.innerHTML = '';
        } else {
            // Add game-themed animated fallback
            widgetArtwork.style.backgroundImage = '';
            widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
            widgetArtwork.style.opacity = '1';

            if (typeof anime !== 'undefined') {
              widgetArtwork.innerHTML = `
                <div class="game-animation">
                  <div class="game-pulse"></div>
                  <div class="game-ring"></div>
                </div>
              `;
              const gameContainer = widgetArtwork.querySelector('.game-animation');
              if (gameContainer) {
                gameContainer.style.cssText = `
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 24px;
                  overflow: hidden;
                `;

                const pulse = widgetArtwork.querySelector('.game-pulse');
                const ring = widgetArtwork.querySelector('.game-ring');

                if (pulse) {
                  pulse.style.cssText = `
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3));
                  `;

                  anime({
                    targets: pulse,
                    scale: [1, 1.5],
                    opacity: [0.6, 0.2],
                    duration: 2000,
                    easing: 'easeInOutQuad',
                    direction: 'alternate',
                    loop: true
                  });
                }

                if (ring) {
                  ring.style.cssText = `
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 2px solid rgba(139,92,246,0.3);
                    border-radius: 50%;
                  `;

                  anime({
                    targets: ring,
                    rotate: '360deg',
                    duration: 4000,
                    easing: 'linear',
                    loop: true
                  });
                }
              }
            }
          }
        }

      // Show dual labels for game + music or single label for game only
      if (hasMusic) {
        const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : 'Unknown Artist';
        const playtime = calculatePlaytime(gameData.start_time);
        const playtimeText = playtime ? `Playing for ${playtime}` : '';
        setLabelWithSubtext('gamepad-2', gameName, playtimeText);

        const hintLines = [];
        if (artist) {
          hintLines.push({ icon: null, text: artist });
        }

        const trackLine = getTrackLine(musicData);
        if (trackLine) {
          hintLines.push({ icon: 'music-2', text: trackLine });
        }

        if (hintLines.length > 0) {
          renderHintLines(hintLines);
        } else if (playtimeText) {
          renderHintLines([], playtimeText);
        } else {
          const title = musicData.title && musicData.title !== 'Not Playing' ? musicData.title : 'Unknown Track';
          renderHintLines([], title);
        }
      } else {
        setLabel('gamepad-2', gameName);

        // Calculate and show playtime as hint
        const playtime = calculatePlaytime(gameData.start_time);
        if (playtime) {
          renderHintLines([], `Playing for ${playtime}`);
        } else {
          renderHintLines([]);
        }
      }
      // Update badge
      if (hasMusic) {
        setBadge('Gaming + Music', '#6366f1');
      } else {
        setBadge('Gaming', '#8b5cf6'); // Purple for gaming
      }
    };

    const updateForIdle = () => {
      resetGameArtworkCache();

      // Set idle artwork with anime.js animation
      if (widgetArtwork) {
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
        widgetArtwork.style.opacity = '1';

        // Add a cool anime.js animation for idle state
        if (typeof anime !== 'undefined') {
          widgetArtwork.innerHTML = `
            <div class="idle-animation">
              <div class="idle-orb idle-orb-1"></div>
              <div class="idle-orb idle-orb-2"></div>
              <div class="idle-orb idle-orb-3"></div>
            </div>
          `;
          const idleContainer = widgetArtwork.querySelector('.idle-animation');
          if (idleContainer) {
            idleContainer.style.cssText = `
              position: absolute;
              inset: 0;
              overflow: hidden;
              border-radius: 24px;
            `;

            const orbs = widgetArtwork.querySelectorAll('.idle-orb');
            orbs.forEach((orb, index) => {
              orb.style.cssText = `
                position: absolute;
                width: ${30 + index * 15}px;
                height: ${30 + index * 15}px;
                border-radius: 50%;
                background: linear-gradient(45deg,
                  rgba(255,255,255,${0.1 - index * 0.02}) 0%,
                  rgba(255,255,255,${0.05 - index * 0.01}) 100%);
                filter: blur(${index + 1}px);
              `;

              anime({
                targets: orb,
                translateX: () => anime.random(-40, 40),
                translateY: () => anime.random(-40, 40),
                scale: [0.8, 1.2],
                opacity: [0.3, 0.7],
                duration: () => anime.random(3000, 6000),
                delay: index * 800,
                direction: 'alternate',
                easing: 'easeInOutSine',
                loop: true
              });
            });
          }
        }
      }

      // Update label - use a valid Lucide icon
      setLabel('circle-dot', 'Currently idle');

      // Update hint for idle state with personalized message
      const personalizedMessages = [
        'Not gaming or jamming right now.',
        'Taking a break. Back soon!',
        'Currently offline. Check back later!',
        'Away from the setup.',
        'Nothing playing at the moment.'
      ];
      const randomMessage = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
      renderHintLines([], randomMessage);

      // Update badge - keep it simple
      setBadge('Live', '#6b7280'); // Gray for idle
    };

    const updateForConnectionError = () => {
      // Clear artwork
      if (widgetArtwork) {
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.opacity = '1';
      }

      // Update label to show connection status
      setLabel('wifi-off', 'Connection lost');

      // Update hint for connection error
      renderHintLines([], 'Unable to connect to activity service. Retrying...');

      // Update badge
      setBadge('Reconnecting', '#f59e0b'); // Orange for connection issues
    };

    const updateForConnecting = () => {
      // Clear artwork
      if (widgetArtwork) {
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.opacity = '1';
      }

      // Update label
      setLabel('wifi', 'Connecting...');

      // Update hint for connecting state
      renderHintLines([], 'Establishing connection to activity service.');

      // Update badge
      setBadge('Connecting', '#3b82f6'); // Blue for connecting
    };

    const fetchActivityData = async () => {
      try {
        const response = await fetch('https://rpc.dylan.lol/website');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        await updateWidget(data);

        // Update connection status
        if (!isConnected) {
          isConnected = true;
          console.log('Connected to activity API');
        }

      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        isConnected = false;

        // Show connection error in widget content
        updateForConnectionError();
      }
    };

    // Start polling for activity data
    const startPolling = () => {
      // Initial fetch
      fetchActivityData();

      // Poll every 3 seconds
      updateInterval = setInterval(fetchActivityData, 3000);
    };

    // Stop polling
    const stopPolling = () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    };

    // Start the polling
    startPolling();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      stopPolling();
    });
  }; // End of initActivityWidget function

  // Initialize activity widget
  initActivityWidget();
});




