document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const LOCAL_STORAGE_THEME_KEY = 'preferred-theme';

  // Helper to get preferred theme
  function getPreferredTheme() {
    return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || 'light';
  }

  // Helper to set theme and update icon
  function setTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark');
    const iconSpan = themeToggleBtn.querySelector('.theme-toggle__icon');
    if (iconSpan) iconSpan.textContent = theme === 'dark' ? '🌙' : '☀️';
    if (persist) localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme(), false);

  // Toggle handler with animation re-trigger
  themeToggleBtn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
    themeToggleBtn.classList.remove('theme-toggle-bounce');
    void themeToggleBtn.offsetWidth; // Force reflow
    themeToggleBtn.classList.add('theme-toggle-bounce');
    setTimeout(() => themeToggleBtn.classList.remove('theme-toggle-bounce'), 520);
  });

  // Animate cards on load (staggered)
  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.animationDelay = (0.2 + i * 0.16) + "s";
    card.classList.add("card-animate");
  });
});