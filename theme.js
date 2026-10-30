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
      const paint = document.createElement('div');
      paint.className = 'theme-paint';
      paint.setAttribute('aria-hidden', 'true');
      paint.style.setProperty('--paint', theme === 'dark' ? '#191b2a' : '#f6f6fa');
      const animations = [];
      const apply = () => {
        savedTheme = theme;
        applyTheme(theme);
        try { localStorage.setItem('owen-theme', theme); } catch {}
      };
      const stopMotion = () => animations.forEach(animation => animation.finish());
      try {
        if (reducedMotion.matches || !Element.prototype.animate) {
          apply();
          return;
        }
        const bounds = button.getBoundingClientRect();
        const startX = bounds.left + bounds.width / 2;
        const startY = bounds.top + bounds.height / 2;
        const width = innerWidth;
        const height = innerHeight;
        const columns = 5;
        const rows = 6;
        const cellWidth = width / columns;
        const cellHeight = height / rows;
        const diameter = Math.max(cellWidth, cellHeight) * 2.9;
        // Overlapping irregular paint dabs cover the viewport, without copying page content.
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const dab = document.createElement('span');
            const x = (column + .5 + Math.sin(row * 7 + column) * .15) * cellWidth;
            const y = (row + .5 + Math.cos(column * 5 + row) * .15) * cellHeight;
            const distance = Math.hypot(x - startX, y - startY) / Math.hypot(width, height);
            dab.className = 'paint-dab';
            dab.style.cssText = `left:${x}px;top:${y}px;width:${diameter}px;height:${diameter}px;border-radius:${43 + row % 3 * 5}% ${56 - column % 3 * 5}% ${44 + column % 4 * 3}% ${55 - row % 4 * 3}% / 48% 42% 58% 52%;`;
            paint.append(dab);
            const animation = dab.animate([
              { transform: 'translate(-50%, -50%) scale(0) rotate(-18deg)' },
              { transform: 'translate(-50%, -50%) scale(.12) rotate(-10deg)', offset: .38 },
              { transform: 'translate(-50%, -50%) scale(1) rotate(8deg)' }
            ], { duration: 620, delay: distance * 380, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'both' });
            animations.push(animation);
          }
        }
        document.body.append(paint);
        reducedMotion.addEventListener('change', stopMotion);
        await Promise.all(animations.map(animation => animation.finished));
        // Switch only once opaque paint covers the old page, then reveal the new palette.
        paint.style.backgroundColor = paint.style.getPropertyValue('--paint');
        apply();
        if (!reducedMotion.matches) {
          const clearing = paint.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 430, delay: 90, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards'
          });
          animations.push(clearing);
          await clearing.finished;
        }
      } catch {
        apply();
      } finally {
        reducedMotion.removeEventListener('change', stopMotion);
        paint.remove();
        animations.forEach(animation => animation.cancel());
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
