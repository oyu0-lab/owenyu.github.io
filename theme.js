(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem('owen-theme'); } catch {}
  const isTheme = value => value === 'light' || value === 'dark';

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181e19' : '#f7f8f2');
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
