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

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || typeof anime === 'undefined') {
    document.querySelectorAll('.hero__eyebrow, .hero__title, .hero__lead, .hero__description, .hero__actions a, .link-card')
      .forEach((element) => element.classList.add('is-visible'));
    return;
  }

  anime.timeline({ easing: 'easeOutExpo', duration: 750 })
    .add({
      targets: '.hero__eyebrow',
      translateY: [20, 0],
      opacity: [0, 1],
    })
    .add({
      targets: '.hero__title',
      translateY: [40, 0],
      opacity: [0, 1],
    }, '-=500')
    .add({
      targets: '.hero__lead',
      translateY: [40, 0],
      opacity: [0, 1],
    }, '-=600')
    .add({
      targets: '.hero__description',
      translateY: [40, 0],
      opacity: [0, 1],
    }, '-=650')
    .add({
      targets: '.hero__actions a',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(80),
    }, '-=600')
    .add({
      targets: '.link-card',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(70),
    }, '-=400');

  anime({
    targets: '.hero__orb',
    translateY: [30, -30],
    direction: 'alternate',
    loop: true,
    duration: 4000,
    easing: 'easeInOutSine',
  });

  anime({
    targets: '.background-bubble',
    translateY: [0, -40],
    translateX: [0, 24],
    direction: 'alternate',
    loop: true,
    duration: 9000,
    easing: 'easeInOutSine',
  });
});
