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

  if (prefersReducedMotion || typeof anime === 'undefined') {
    document
      .querySelectorAll('.hero__eyebrow, .hero__title, .hero__lead, .hero__description, .hero__actions a, .link-card')
      .forEach((element) => element.classList.add('is-visible'));
    return;
  }

  anime
    .timeline({ easing: 'easeOutExpo', duration: 750 })
    .add({
      targets: '.hero__eyebrow',
      translateY: [20, 0],
      opacity: [0, 1],
    })
    .add(
      {
        targets: '.hero__title',
        translateY: [40, 0],
        opacity: [0, 1],
      },
      '-=500',
    )
    .add(
      {
        targets: '.hero__lead',
        translateY: [40, 0],
        opacity: [0, 1],
      },
      '-=600',
    )
    .add(
      {
        targets: '.hero__description',
        translateY: [40, 0],
        opacity: [0, 1],
      },
      '-=650',
    )
    .add(
      {
        targets: '.hero__actions a',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(80),
      },
      '-=600',
    )
    .add(
      {
        targets: '.link-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(70),
      },
      '-=400',
    );

  anime({
    targets: '.hero__orb',
    translateY: [40, -60],
    scale: [1, 1.08],
    direction: 'alternate',
    loop: true,
    duration: 5200,
    easing: 'easeInOutSine',
    delay: anime.stagger(300),
  });

  anime({
    targets: '.background-bubble',
    translateY: [0, -60],
    translateX: [0, 36],
    scale: [1, 1.12],
    opacity: [0.35, 0.55],
    direction: 'alternate',
    loop: true,
    duration: 12000,
    easing: 'easeInOutSine',
    delay: anime.stagger(400),
  });
});
