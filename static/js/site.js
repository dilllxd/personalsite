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
      .querySelectorAll('[data-animate], .link-card, .widget-shell')
      .forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const timeline = anime.timeline({ easing: 'easeOutExpo', duration: 700 });

  timeline
    .add({
      targets: '.hero__eyebrow',
      translateY: [24, 0],
      opacity: [0, 1],
    })
    .add(
      {
        targets: '.hero__title',
        translateY: [36, 0],
        opacity: [0, 1],
      },
      '-=520',
    )
    .add(
      {
        targets: '.hero__lead',
        translateY: [32, 0],
        opacity: [0, 1],
      },
      '-=560',
    )
    .add(
      {
        targets: '.hero__description',
        translateY: [28, 0],
        opacity: [0, 1],
      },
      '-=560',
    )
    .add(
      {
        targets: '.hero__stats',
        translateY: [24, 0],
        opacity: [0, 1],
      },
      '-=560',
    )
    .add(
      {
        targets: '.hero__stats .stat',
        translateY: [18, 0],
        opacity: [0, 1],
        delay: anime.stagger(90),
      },
      '-=500',
    )
    .add(
      {
        targets: '.hero__actions',
        translateY: [20, 0],
        opacity: [0, 1],
      },
      '-=540',
    )
    .add(
      {
        targets: '.hero__actions .button',
        translateY: [18, 0],
        opacity: [0, 1],
        delay: anime.stagger(80),
      },
      '-=520',
    )
    .add(
      {
        targets: '.card--links',
        translateY: [28, 0],
        opacity: [0, 1],
      },
      '-=500',
    )
    .add(
      {
        targets: '.card--links .link-card',
        translateY: [18, 0],
        opacity: [0, 1],
        delay: anime.stagger(70),
      },
      '-=540',
    )
    .add(
      {
        targets: '.card--widget',
        translateY: [24, 0],
        opacity: [0, 1],
      },
      '-=480',
    )
    .add(
      {
        targets: '.card--widget .widget-shell',
        translateY: [16, 0],
        opacity: [0, 1],
      },
      '-=520',
    );

  const orbs = document.querySelectorAll('[data-orb]');

  if (orbs.length) {
    anime({
      targets: orbs,
      translateX: () => anime.random(-40, 40),
      translateY: () => anime.random(-60, 60),
      scale: () => anime.random(90, 120) / 100,
      opacity: () => anime.random(35, 60) / 100,
      direction: 'alternate',
      easing: 'easeInOutSine',
      duration: () => anime.random(8000, 14000),
      delay: anime.stagger(300),
      loop: true,
    });
  }
});
