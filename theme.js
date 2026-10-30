(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  let transitionTimer;
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
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.classList.add('theme-changing');
        clearTimeout(transitionTimer);
        transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 650);
        const icon = document.querySelector('.theme-toggle');
        icon.animate([{ transform: 'rotate(-35deg) scale(.85)' }, { transform: 'rotate(0) scale(1)' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
      savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(savedTheme);
      try { localStorage.setItem('owen-theme', savedTheme); } catch {}
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
