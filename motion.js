(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22, 1, .36, 1)';
  const targets = [...document.querySelectorAll('.hero-copy > *, .hero-art, .page-intro > *, .section-heading, .topic-card, .lab-copy, .experiment, .habit-grid article, .prompt-section, .about-section > *, .project-row, .coming-note, .about-poster, .about-body > *')];
  let observer;
  let frame;
  const art = document.querySelector('.hero-art');
  const desktop = matchMedia('(min-width: 701px)');
  const show = element => {
    element.classList.remove('reveal-pending');
    observer?.unobserve(element);
  };
  function reveal(element, delay = 0) {
    show(element);
    if (preference.matches || element.hidden) return;
    element.animate([
      { opacity: 0, transform: 'translateY(26px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 850, delay, easing: ease, fill: 'backwards' });
  }
  function setup() {
    observer?.disconnect();
    targets.forEach(show);
    if (preference.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      const entering = entries.filter(entry => entry.isIntersecting);
      entering.forEach((entry, index) => reveal(entry.target, Math.min(index * 65, 195)));
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(element => {
      const rect = element.getBoundingClientRect();
      // Keep restored scroll positions and anchor destinations immediately readable.
      if (rect.top < innerHeight && rect.bottom > 0) reveal(element, Math.min(targets.indexOf(element) * 55, 220));
      else if (rect.top >= innerHeight) {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    });
  }
  function updateDepth() {
    frame = null;
    if (!art) return;
    if (preference.matches || !desktop.matches) {
      art.style.removeProperty('--depth');
      art.style.removeProperty('--spin');
      return;
    }
    const bounds = art.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    const depth = Math.max(-16, Math.min(24, (innerHeight * .42 - bounds.top) * .045));
    art.style.setProperty('--depth', `${depth}px`);
    art.style.setProperty('--spin', `${depth * .3}deg`);
  }
  function scheduleDepth() {
    if (!frame && !preference.matches && desktop.matches) frame = requestAnimationFrame(updateDepth);
  }
  document.addEventListener('focusin', event => {
    const pending = event.target.closest('.reveal-pending');
    if (pending) {
      show(pending);
      pending.getAnimations().forEach(animation => animation.cancel());
    }
  });
  window.addEventListener('scroll', scheduleDepth, { passive: true });
  window.addEventListener('resize', scheduleDepth, { passive: true });
  preference.addEventListener('change', () => {
    if (preference.matches) {
      observer?.disconnect();
      targets.forEach(element => {
        show(element);
        element.getAnimations().forEach(animation => animation.cancel());
      });
      document.documentElement.classList.remove('theme-changing');
    } else setup();
    updateDepth();
  });
  desktop.addEventListener('change', updateDepth);
  window.addEventListener('pageshow', event => {
    if (event.persisted) { targets.forEach(show); updateDepth(); }
  });
  setup();
  updateDepth();
})();
