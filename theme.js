(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  let switching = false;
  try { savedTheme = localStorage.getItem('owen-theme'); } catch {}
  const isTheme = value => value === 'light' || value === 'dark';

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191b2a' : '#f6f6fa');
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  applyTheme(isTheme(savedTheme) ? savedTheme : preference.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', async event => {
      if (switching) return;
      switching = true;
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const button = event.currentTarget;
      let transition;
      let animation;
      const apply = () => {
        savedTheme = theme;
        applyTheme(theme);
        try { localStorage.setItem('owen-theme', theme); } catch {}
      };
      const stopMotion = () => {
        animation?.finish();
        transition?.skipTransition();
      };
      try {
        if (reducedMotion.matches || !document.startViewTransition) {
          apply();
          return;
        }
        const bounds = button.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + bounds.height / 2;
        const farthestCorner = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        // One continuous comic-style outline, with rounded lobes and uneven fingers.
        // All frames share the same vertices so the mask expands smoothly.
        const outline = radius => {
          const points = Array.from({ length: 240 }, (_, index) => {
            const angle = index / 240 * Math.PI * 2;
            const wave = 1 + .13 * Math.sin(angle * 9 + .8)
              + .055 * Math.sin(angle * 15 - .4) + .025 * Math.cos(angle * 5);
            return `${(x + Math.cos(angle) * radius * wave).toFixed(2)}px ${(y + Math.sin(angle) * radius * wave).toFixed(2)}px`;
          });
          return `polygon(${points.join(',')})`;
        };
        root.classList.add('theme-reveal');
        reducedMotion.addEventListener('change', stopMotion);
        // The new snapshot contains the actual new text colours, not a paint overlay.
        transition = document.startViewTransition(apply);
        await transition.ready;
        if (reducedMotion.matches) {
          transition.skipTransition();
        } else {
          animation = root.animate({
            clipPath: [outline(0), outline(farthestCorner / .77)]
          }, {
            duration: 1800,
            easing: 'cubic-bezier(.45,0,.55,1)',
            fill: 'both',
            pseudoElement: '::view-transition-new(root)'
          });
          await animation.finished;
          animation.cancel();
        }
        await transition.finished;
      } catch {
        transition?.skipTransition();
        apply();
      } finally {
        reducedMotion.removeEventListener('change', stopMotion);
        animation?.cancel();
        root.classList.remove('theme-reveal');
        switching = false;
      }
    });
  });
  preference.addEventListener('change', event => {
    if (!isTheme(savedTheme)) applyTheme(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key !== 'owen-theme' && event.key !== null) return;
    savedTheme = event.newValue;
    applyTheme(isTheme(savedTheme) ? savedTheme : preference.matches ? 'dark' : 'light');
  });
})();
