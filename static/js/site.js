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
});