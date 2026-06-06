/* ==========================================================================
   Theme Module — Dark/Light Mode Toggle
   Persists user preference in localStorage.
   Default theme is dark (no data-theme attribute on <html>).
   ========================================================================== */

const Theme = (() => {
  'use strict';

  const STORAGE_KEY = 'theme';
  let currentTheme = localStorage.getItem(STORAGE_KEY) || 'dark';

  /* ---- Public --------------------------------------------------------- */

  /**
   * Initialise the theme system.
   * Reads persisted preference, applies it, and wires up the toggle button.
   */
  function init() {
    apply(currentTheme);

    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }
  }

  /* ---- Private -------------------------------------------------------- */

  /**
   * Toggle between dark ↔ light and persist the choice.
   */
  function toggle() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    apply(currentTheme);
    localStorage.setItem(STORAGE_KEY, currentTheme);
  }

  /**
   * Apply the given theme to the document and update the toggle icon.
   * @param {string} theme - 'dark' or 'light'
   */
  function apply(theme) {
    const root = document.documentElement;

    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    // Swap the icon inside the toggle button
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    if (!icon) return;

    // Dark mode → show moon icon  |  Light mode → show sun icon
    icon.className = theme === 'dark'
      ? 'fa-solid fa-moon'
      : 'fa-solid fa-sun';
  }

  /* ---- Expose --------------------------------------------------------- */
  return { init };
})();
