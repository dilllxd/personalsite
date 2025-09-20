import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';
import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

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
    let isUsingLastFmFallback = false;
    let lastFmRetryTimeout = null;

    let lastActivityName = null;
    let cachedActivityArtworkUrl = null;
    let recordSpinAnimation = null;
    let currentMusicData = null;
    let lastUpdateTime = null;
    let positionTimer = null;

    const formatTime = (seconds) => {
      if (!seconds || seconds <= 0) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const updateProgress = (position, length) => {
      if (!widgetShell || position == null || length == null || length === 0) {
        if (widgetShell) {
          widgetShell.classList.remove('widget-shell--with-progress');
          widgetShell.style.removeProperty('--progress');
        }
        return;
      }
      const progress = Math.min(100, Math.max(0, (position / length) * 100));
      widgetShell.classList.add('widget-shell--with-progress');
      widgetShell.style.setProperty('--progress', `${progress}%`);
    };

    const updateTimeDisplay = () => {
      if (!currentMusicData || currentMusicData.status !== 'Playing') return;

      const now = Date.now();
      const elapsed = lastUpdateTime ? (now - lastUpdateTime) / 1000 : 0;
      // Ensure we use the latest position from the server instead of defaulting to 0
      const basePosition = currentMusicData.position || 0;
      const currentPosition = Math.min(
        currentMusicData.length,
        basePosition + elapsed
      );

      // Update progress bar
      updateProgress(currentPosition, currentMusicData.length);

      // Update time display in the artwork
      const timeElement = widgetArtwork?.querySelector('.widget-shell__artwork__time');
      if (timeElement) {
        timeElement.textContent = `${formatTime(currentPosition)} / ${formatTime(currentMusicData.length)}`;
      }
    };

    const startPositionTimer = () => {
      stopPositionTimer();
      if (currentMusicData && currentMusicData.status === 'Playing') {
        positionTimer = setInterval(updateTimeDisplay, 250); // Update 4 times per second for smooth progress
      }
    };

    const stopPositionTimer = () => {
      if (positionTimer) {
        clearInterval(positionTimer);
        positionTimer = null;
      }
    };

    const startRecordSpin = () => {
      if (!widgetArtwork || !anime) return;

      // Stop any existing animation first
      stopRecordSpin();

      widgetArtwork.classList.add('widget-shell__artwork--spinning');

      recordSpinAnimation = anime({
        targets: widgetArtwork,
        rotate: '360deg',
        duration: 3000,
        easing: 'linear',
        loop: true,
        autoplay: true
      });
    };

    const stopRecordSpin = () => {
      if (recordSpinAnimation) {
        recordSpinAnimation.pause();
        recordSpinAnimation = null;
      }

      if (widgetArtwork) {
        widgetArtwork.classList.remove('widget-shell__artwork--spinning');
        widgetArtwork.classList.remove('widget-shell__artwork--record');
        // Reset rotation to 0
        if (anime) {
          anime.set(widgetArtwork, { rotate: '0deg' });
        }
      }

      // Clear progress border
      updateProgress(0, 0);
    };

    const resetActivityArtworkCache = () => {
      lastActivityName = null;
      cachedActivityArtworkUrl = null;

      // Stop spinning animation when resetting
      stopRecordSpin();
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

    const setStackedLabelsWithHints = (gameIcon, gameText, gameHint, musicIcon, musicText, musicHint) => {
      if (!widgetLabel || !widgetHint) return;
      widgetLabel.innerHTML = '';
      widgetHint.innerHTML = '';

      // Create a stacked layout: game-title, game-hint, music-title, music-hint
      widgetLabel.className = 'widget-shell__label widget-shell__label--stacked';

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

      widgetLabel.appendChild(gameLabel);

      // Game hint right after game title
      if (gameHint) {
        const gameHintEl = document.createElement('div');
        gameHintEl.className = 'widget-shell__hint-line widget-shell__hint-line--stacked';
        gameHintEl.textContent = gameHint;
        widgetLabel.appendChild(gameHintEl);
      }

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

      widgetLabel.appendChild(musicLabel);

      // Music hint right after music title
      if (musicHint) {
        const musicHintEl = document.createElement('div');
        musicHintEl.className = 'widget-shell__hint-line widget-shell__hint-line--stacked';
        musicHintEl.textContent = musicHint;
        widgetLabel.appendChild(musicHintEl);
      }

      // Clear the hint area since we're putting everything in the label area
      widgetHint.innerHTML = '';

      // Update meta container classes
      const metaContainer = document.querySelector('.widget-shell__meta');
      if (metaContainer) {
        metaContainer.classList.remove('widget-shell__meta--no-hint');
        metaContainer.classList.add('widget-shell__meta--with-hint');
      }

      // Reinitialize Lucide icons
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

      const numericStart = Number(startTime);
      if (!Number.isFinite(numericStart)) return null;

      // Some providers return milliseconds instead of seconds.
      const startInSeconds = numericStart > 1e12 ? Math.floor(numericStart / 1000) : numericStart;

      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const elapsed = Math.floor(Math.max(0, now - startInSeconds)); // Clamp to avoid negative durations

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
      const activityDataInfo = activityData.activity || {};

      // Store current music data and update time for real-time tracking
      const previousMusicData = currentMusicData;
      const trackChanged = !previousMusicData ||
        previousMusicData.title !== musicData.title ||
        previousMusicData.artist !== musicData.artist ||
        previousMusicData.status !== musicData.status;

      // Check for significant position changes (skip/reverse >5 seconds)
      const positionJumped = previousMusicData && musicData.position != null &&
        previousMusicData.position != null &&
        Math.abs(musicData.position - previousMusicData.position) > 5;

      // Check for pause/resume state changes
      const stateChanged = previousMusicData &&
        previousMusicData.status !== musicData.status;

      currentMusicData = musicData;
      lastUpdateTime = Date.now();

      // Force immediate time display update if track changed, position jumped, or state changed
      if (trackChanged || positionJumped || stateChanged) {
        updateTimeDisplay();
      }

      const isMusicPlaying = musicData.status === 'Playing';
      const isPaused = musicData.status === 'Paused';
      const hasMusic = (isMusicPlaying || isPaused) && musicData.title && musicData.title !== 'Not Playing';
      const hasActivity = activityDataInfo.name && activityDataInfo.name !== '';

      // Start or stop position timer based on music state
      if (hasMusic && isMusicPlaying) {
        startPositionTimer();
      } else {
        stopPositionTimer();
      }

      // Determine what to display based on current activities
      if (hasMusic && hasActivity) {
        // Both music and activity - prioritize activity but show music info
        await updateForActivity(activityDataInfo, musicData, trackChanged);
      } else if (hasActivity) {
        // Only activity
        await updateForActivity(activityDataInfo);
      } else if (hasMusic) {
        // Only music
        updateForMusic(musicData, trackChanged);
      } else {
        // Nothing playing
        updateForIdle();
      }
    };

    const updateForMusic = (musicData, trackChanged = true) => {
      resetActivityArtworkCache();

      const isPlaying = musicData.status === 'Playing';

      if (!isPlaying) {
        updateForIdle();
        return;
      }

      // Update artwork
      if (musicData.artUrl && widgetArtwork) {
        // Create vinyl record with album art overlay
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.backgroundColor = '';
        widgetArtwork.style.opacity = '1';
        widgetArtwork.classList.add('widget-shell__artwork--record');

        widgetArtwork.innerHTML = `
          <div class="widget-shell__artwork__album" style="background-image: url('${musicData.artUrl}')"></div>
          <div class="widget-shell__artwork__center"></div>
          <div class="widget-shell__artwork__time">${formatTime(musicData.position || 0)} / ${formatTime(musicData.length || 0)}</div>
        `;

        // Update progress border
        updateProgress(musicData.position, musicData.length);

        // Add spinning animation for music (only restart if track changed)
        if (trackChanged) {
          startRecordSpin();
        }
      } else if (widgetArtwork) {
        // Add music-themed animated fallback
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
        widgetArtwork.style.opacity = '1';
        stopRecordSpin();

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

    const updateForActivity = async (activityData, musicData = null, trackChanged = true) => {
      const activityName = activityData.name && activityData.name !== '' ? activityData.name : 'Unknown Activity';
      const activityType = activityData.type || 'unknown';
      const activityIcon = activityData.icon || 'circle-dot';
      const hasMusic =
        musicData &&
        musicData.status === 'Playing' &&
        musicData.title &&
        musicData.title !== 'Not Playing';

      // Handle artwork
      if (widgetArtwork) {
        // Try to get game artwork first (only for games, fetch only when the activity changes)
        if (activityType === 'game') {
          if (activityName !== lastActivityName) {
            lastActivityName = activityName;
            cachedActivityArtworkUrl = await tryGetGameArtwork(activityName);
          }

          const gameArtworkUrl = cachedActivityArtworkUrl;

          if (gameArtworkUrl) {
            widgetArtwork.style.backgroundImage = `url("${gameArtworkUrl}")`;
            widgetArtwork.style.backgroundSize = 'cover';
            widgetArtwork.style.backgroundRepeat = 'no-repeat';
            widgetArtwork.style.backgroundPosition = 'center';
            widgetArtwork.style.backgroundColor = '';
            widgetArtwork.style.opacity = '1';
            widgetArtwork.innerHTML = '';
            stopRecordSpin();
          } else if (
            musicData &&
            musicData.status === 'Playing' &&
            musicData.artUrl
          ) {
            // Fallback to music vinyl record if no game logo
            widgetArtwork.style.backgroundImage = '';
            widgetArtwork.style.backgroundColor = '';
            widgetArtwork.style.opacity = '0.8'; // Slightly dim the record
            widgetArtwork.classList.add('widget-shell__artwork--record');

            widgetArtwork.innerHTML = `
              <div class="widget-shell__artwork__album" style="background-image: url('${musicData.artUrl}')"></div>
              <div class="widget-shell__artwork__center"></div>
              <div class="widget-shell__artwork__time">${formatTime(musicData.position || 0)} / ${formatTime(musicData.length || 0)}</div>
            `;

            // Update progress border
            updateProgress(musicData.position, musicData.length);

            // Add spinning animation for music (only restart if track changed)
            if (trackChanged) {
              startRecordSpin();
            }
          } else {
            // Add game-themed animated fallback
            widgetArtwork.style.backgroundImage = '';
            widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
            widgetArtwork.style.opacity = '1';
            stopRecordSpin();

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
        } else {
          // For non-game activities, use music artwork if available or create activity-themed animation
          if (
            musicData &&
            musicData.status === 'Playing' &&
            musicData.artUrl
          ) {
            // Use vinyl record for music
            widgetArtwork.style.backgroundImage = '';
            widgetArtwork.style.backgroundColor = '';
            widgetArtwork.style.opacity = '0.7'; // Slightly dim to show it's not the primary focus
            widgetArtwork.classList.add('widget-shell__artwork--record');

            widgetArtwork.innerHTML = `
              <div class="widget-shell__artwork__album" style="background-image: url('${musicData.artUrl}')"></div>
              <div class="widget-shell__artwork__center"></div>
              <div class="widget-shell__artwork__time">${formatTime(musicData.position || 0)} / ${formatTime(musicData.length || 0)}</div>
            `;

            // Update progress border
            updateProgress(musicData.position, musicData.length);

            // Add spinning animation for music (only restart if track changed)
            if (trackChanged) {
              startRecordSpin();
            }
          } else {
            // Add activity-themed animated fallback
            widgetArtwork.style.backgroundImage = '';
            widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
            widgetArtwork.style.opacity = '1';

            if (typeof anime !== 'undefined') {
              widgetArtwork.innerHTML = `
                <div class="activity-animation">
                  <div class="activity-pulse"></div>
                  <div class="activity-dots"></div>
                </div>
              `;
              const activityContainer = widgetArtwork.querySelector('.activity-animation');
              if (activityContainer) {
                activityContainer.style.cssText = `
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 24px;
                  overflow: hidden;
                `;

                const pulse = widgetArtwork.querySelector('.activity-pulse');
                const dots = widgetArtwork.querySelector('.activity-dots');

                if (pulse) {
                  pulse.style.cssText = `
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border-radius: 6px;
                    background: linear-gradient(45deg, rgba(34,197,94,0.4), rgba(59,130,246,0.3));
                  `;

                  anime({
                    targets: pulse,
                    scale: [1, 1.3],
                    opacity: [0.6, 0.2],
                    duration: 1500,
                    easing: 'easeInOutQuad',
                    direction: 'alternate',
                    loop: true
                  });
                }

                if (dots) {
                  dots.style.cssText = `
                    position: absolute;
                    width: 50px;
                    height: 50px;
                  `;

                  // Create small dots around the pulse
                  for (let i = 0; i < 3; i++) {
                    const dot = document.createElement('div');
                    dot.style.cssText = `
                      position: absolute;
                      width: 4px;
                      height: 4px;
                      border-radius: 50%;
                      background: rgba(34,197,94,0.5);
                      top: ${20 + Math.cos((i * 120) * Math.PI / 180) * 15}px;
                      left: ${23 + Math.sin((i * 120) * Math.PI / 180) * 15}px;
                    `;
                    dots.appendChild(dot);

                    anime({
                      targets: dot,
                      scale: [0.5, 1.5],
                      opacity: [0.3, 0.8],
                      duration: 1000,
                      delay: i * 200,
                      easing: 'easeInOutSine',
                      direction: 'alternate',
                      loop: true
                    });
                  }
                }
              }
            }
          }
        }
      }

      // Show dual labels for activity + music with aligned hints
      if (hasMusic) {
        const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : 'Unknown Artist';
        const playtime = calculatePlaytime(activityData.start_time);
        const title = musicData.title && musicData.title !== 'Not Playing' ? musicData.title : 'Unknown Track';

        const activityHint = playtime ? `Active for ${playtime}` : null;
        const musicHint = title;

        setStackedLabelsWithHints(activityIcon, activityName, activityHint, 'music', artist, musicHint);
      } else {
        setLabel(activityIcon, activityName);

        // Calculate and show activity duration as hint
        const playtime = calculatePlaytime(activityData.start_time);
        if (playtime) {
          renderHintLines([], `Active for ${playtime}`);
        } else {
          renderHintLines([]);
        }
      }

      // Update badge based on activity type
      const getActivityBadge = (type, hasMusic) => {
        const badges = {
          game: hasMusic ? { text: 'Gaming + Music', color: '#6366f1' } : { text: 'Gaming', color: '#8b5cf6' },
          development: hasMusic ? { text: 'Coding + Music', color: '#059669' } : { text: 'Coding', color: '#10b981' },
          productivity: hasMusic ? { text: 'Working + Music', color: '#0891b2' } : { text: 'Working', color: '#06b6d4' },
          media: hasMusic ? { text: 'Media + Music', color: '#dc2626' } : { text: 'Media', color: '#ef4444' },
          browser: hasMusic ? { text: 'Browsing + Music', color: '#7c3aed' } : { text: 'Browsing', color: '#8b5cf6' },
          unknown: hasMusic ? { text: 'Active + Music', color: '#6b7280' } : { text: 'Active', color: '#9ca3af' }
        };
        return badges[type] || badges.unknown;
      };

      const badge = getActivityBadge(activityType, hasMusic);
      setBadge(badge.text, badge.color);
    };

    const updateForIdle = () => {
      resetActivityArtworkCache();

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
      const errorMessage = isUsingLastFmFallback ?
        'Both RPC backend and Last.fm API unavailable.' :
        'Unable to connect to activity service. Trying Last.fm fallback...';
      renderHintLines([], errorMessage);

      // Update badge
      setBadge('Reconnecting', '#f59e0b'); // Orange for connection issues
    };

    const updateForConnecting = () => {
      // Clear artwork and reset styles
      if (widgetArtwork) {
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.backgroundColor = 'var(--accent-soft)';
        widgetArtwork.style.opacity = '1';
        widgetArtwork.innerHTML = '';
        stopRecordSpin();
      }

      // Update label with proper formatting
      setLabel('wifi', 'Connecting to service...');

      // Update hint for connecting state with better formatting
      renderHintLines([], 'Establishing connection to activity service...');

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

        // If we were using Last.fm fallback, switch back to RPC
        if (isUsingLastFmFallback) {
          console.log('RPC backend back online, switching from Last.fm fallback');
          isUsingLastFmFallback = false;
          clearTimeout(lastFmRetryTimeout);
          clearInterval(updateInterval); // Stop Last.fm polling
          setBadge('Connected', '#10b981'); // Update badge
        }

        // Update connection status
        if (!isConnected) {
          isConnected = true;
          console.log('Connected to activity API');
        }

      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        isConnected = false;

        // Try Last.fm fallback if not already using it
        if (!isUsingLastFmFallback) {
          tryLastFmFallback();
        } else {
          updateForConnectionError();
        }
      }
    };

    const fetchLastFmData = async () => {
      try {
        const response = await fetch('https://lastfm.dylan.lol/api/recent');
        if (!response.ok) {
          throw new Error(`Last.fm API HTTP ${response.status}`);
        }

        const data = await response.json();

        // Transform Last.fm data to match RPC format
        const transformedData = {
          music: data.music || null,
          activity: null, // Last.fm only provides music data
          source: 'lastfm'
        };

        await updateWidget(transformedData);
        console.log('Using Last.fm fallback data');

      } catch (error) {
        console.error('Failed to fetch Last.fm data:', error);
        updateForConnectionError();
      }
    };

    const tryLastFmFallback = () => {
      console.log('RPC backend offline, trying Last.fm fallback');
      isUsingLastFmFallback = true;

      // Update badge to show fallback mode
      setBadge('Last.fm Fallback', '#d97706');

      // Try Last.fm immediately
      fetchLastFmData();

      // Set up Last.fm polling (less frequent than RPC)
      clearInterval(updateInterval);
      updateInterval = setInterval(fetchLastFmData, 15000); // 15 seconds
    };

    // WebSocket connection for real-time updates
    let socket = null;

    const connectWebSocket = () => {
      try {
        socket = io('https://rpc.dylan.lol', {
          timeout: 30000,           // 30 second timeout instead of default 20s
          reconnection: true,       // Enable auto-reconnection
          reconnectionDelay: 2000,  // Wait 2s before first reconnect attempt
          reconnectionDelayMax: 10000, // Max 10s between reconnect attempts
          maxReconnectionAttempts: 5,  // Try 5 times before giving up
          forceNew: false          // Reuse existing connection if possible
        });

        socket.on('connect', () => {
          console.log('[WebSocket] Connected to activity server');
          setBadge('Connected', '#10b981'); // Green for connected

          // If we were using Last.fm fallback, switch back to RPC
          if (isUsingLastFmFallback) {
            console.log('RPC backend back online, switching from Last.fm fallback');
            isUsingLastFmFallback = false;
            clearInterval(updateInterval);
          }

          // Immediately fetch data after connection
          fetchActivityData();
        });

        socket.on('website_data', (data) => {
          console.log('[WebSocket] Received data:', data);
          updateWidget(data);
        });

        socket.on('disconnect', (reason) => {
          console.log('[WebSocket] Disconnected from activity server:', reason);
          setBadge('Disconnected', '#ef4444'); // Red for disconnected

          // Try Last.fm fallback after a brief delay
          if (!isUsingLastFmFallback) {
            lastFmRetryTimeout = setTimeout(() => {
              console.log('WebSocket disconnected, trying Last.fm fallback');
              tryLastFmFallback();
            }, 3000); // Wait 3 seconds before activating fallback
          }
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
          console.log(`[WebSocket] Reconnection attempt ${attemptNumber}`);
          setBadge('Reconnecting...', '#f59e0b'); // Amber for reconnecting
        });

        socket.on('reconnect', (attemptNumber) => {
          console.log(`[WebSocket] Reconnected after ${attemptNumber} attempts`);
          setBadge('Connected', '#10b981'); // Green for connected
        });

        socket.on('connect_error', (error) => {
          console.error('[WebSocket] Connection error:', error);
          setBadge('Connection Error', '#ef4444'); // Red for error

          // Try Last.fm fallback if connection completely fails
          if (!isUsingLastFmFallback) {
            setTimeout(() => {
              console.log('WebSocket connection failed, trying Last.fm fallback');
              tryLastFmFallback();
            }, 2000);
          }
        });

      } catch (error) {
        console.error('[WebSocket] Failed to initialize:', error);
        // Fallback to old polling method
        console.log('[WebSocket] Falling back to polling');
        startPollingFallback();
      }
    };

    // Fallback polling method (in case WebSocket fails)
    const startPollingFallback = () => {
      // Initial fetch
      fetchActivityData();

      // Poll every 3 seconds
      updateInterval = setInterval(fetchActivityData, 3000);
    };

    // Cleanup function
    const cleanup = () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
      if (lastFmRetryTimeout) {
        clearTimeout(lastFmRetryTimeout);
        lastFmRetryTimeout = null;
      }
      stopPositionTimer();
    };

    // Initial data fetch to ensure immediate position update on page load
    fetchActivityData().then(() => {
      // After initial fetch, start WebSocket connection
      connectWebSocket();
    }).catch(() => {
      // If initial fetch fails, try WebSocket first
      connectWebSocket();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
  }; // End of initActivityWidget function

  // Initialize activity widget
  initActivityWidget();
});




