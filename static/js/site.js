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
      themeToggleIcon.classList.remove('fa-sun', 'fa-moon');
      themeToggleIcon.classList.add(normalizedTheme === 'light' ? 'fa-moon' : 'fa-sun');
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

    const updateWidget = (activityData) => {
      if (!activityData) return;

      const musicData = activityData.music || {};
      const gameData = activityData.game || {};

      const isMusicPlaying = musicData.status === 'Playing';
      const hasMusic = musicData.title && musicData.title !== 'Not Playing';
      const isGamePlaying = gameData.status === 'Playing';
      const hasGame = gameData.name && gameData.name !== '';

      // Determine what to display based on current activities
      if (hasMusic && hasGame) {
        // Both music and game - prioritize game but show music info
        updateForGame(gameData, musicData);
      } else if (hasGame) {
        // Only game
        updateForGame(gameData);
      } else if (hasMusic) {
        // Only music
        updateForMusic(musicData);
      } else {
        // Nothing playing
        updateForIdle();
      }
    };

    const updateForMusic = (musicData) => {
      const isPlaying = musicData.status === 'Playing';

      // Update artwork
      if (musicData.artUrl && widgetArtwork) {
        widgetArtwork.style.backgroundImage = `url("${musicData.artUrl}")`;
        widgetArtwork.style.backgroundSize = 'cover';
        widgetArtwork.style.backgroundPosition = 'center';
      }

      // Update label
      if (widgetLabel) {
        const icon = isPlaying ? 'fa-music' : 'fa-pause';
        const statusText = isPlaying ? 'Now playing' : 'Paused';
        widgetLabel.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i> ${statusText}`;
      }

      // Update hint with track info
      if (widgetHint) {
        const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : '';
        const album = musicData.album && musicData.album !== 'Unknown' ? musicData.album : '';
        const trackInfo = [musicData.title, artist, album].filter(Boolean).join(' • ');
        widgetHint.textContent = trackInfo;
      }

      // Update badge
      if (cardBadge) {
        cardBadge.textContent = 'Live';
        cardBadge.style.backgroundColor = isPlaying ? '#10b981' : '#f59e0b';
      }
    };

    const updateForGame = (gameData, musicData = null) => {
      // Clear artwork for games (or keep music artwork if both)
      if (widgetArtwork) {
        if (musicData && musicData.artUrl) {
          widgetArtwork.style.backgroundImage = `url("${musicData.artUrl}")`;
          widgetArtwork.style.backgroundSize = 'cover';
          widgetArtwork.style.backgroundPosition = 'center';
          widgetArtwork.style.opacity = '0.3'; // Dim the music artwork
        } else {
          widgetArtwork.style.backgroundImage = '';
          widgetArtwork.style.opacity = '1';
        }
      }

      // Update label for game
      if (widgetLabel) {
        const icon = 'fa-gamepad';
        widgetLabel.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i> Currently playing`;
      }

      // Update hint with game and optional music info
      if (widgetHint) {
        let hintText = gameData.name;
        if (musicData && musicData.title && musicData.title !== 'Not Playing') {
          const artist = musicData.artist && musicData.artist !== 'Unknown' ? musicData.artist : '';
          const musicInfo = artist ? `${musicData.title} by ${artist}` : musicData.title;
          hintText += ` • 🎵 ${musicInfo}`;
        }
        widgetHint.textContent = hintText;
      }

      // Update badge
      if (cardBadge) {
        cardBadge.textContent = 'Gaming';
        cardBadge.style.backgroundColor = '#8b5cf6'; // Purple for gaming
      }
    };

    const updateForIdle = () => {
      // Clear artwork
      if (widgetArtwork) {
        widgetArtwork.style.backgroundImage = '';
        widgetArtwork.style.opacity = '1';
      }

      // Update label
      if (widgetLabel) {
        widgetLabel.innerHTML = '<i class="fa-solid fa-waveform-lines" aria-hidden="true"></i> Currently idle';
      }

      // Update hint
      if (widgetHint) {
        widgetHint.textContent = 'No music or games currently active. Start something to see it here.';
      }

      // Update badge
      if (cardBadge) {
        cardBadge.textContent = 'Idle';
        cardBadge.style.backgroundColor = '#6b7280'; // Gray for idle
      }
    };

    const fetchActivityData = async () => {
      try {
        const response = await fetch('https://rpc.dylan.lol/website');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        updateWidget(data);

        // Update connection status
        if (!isConnected) {
          isConnected = true;
          console.log('Connected to activity API');
        }

      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        isConnected = false;

        // Show connection error
        if (cardBadge) {
          cardBadge.textContent = 'Offline';
          cardBadge.style.backgroundColor = '#ef4444';
        }
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
  };

  // Initialize activity widget
  initActivityWidget();
});