/* ==========================================================================
   App Module — Main Orchestrator
   Initialises every module, manages the loading screen, contact form,
   and smooth-scroll behaviour for anchor links.
   ========================================================================== */

const App = (() => {
  'use strict';

  /* ---- Public --------------------------------------------------------- */

  /**
   * Called on DOMContentLoaded.
   * Boot every module and set up page-wide behaviours.
   */
  function init() {
    // Initialise modules (order matters: theme first so colours are correct)
    if (typeof Theme !== 'undefined')      Theme.init();
    if (typeof Navigation !== 'undefined') Navigation.init();
    if (typeof Animations !== 'undefined') Animations.init();

    // Page-wide features
    initContactForm();
    initSmoothScroll();
  }

  /**
   * Called on window load (after all assets are ready).
   * Fades out and removes the full-page loading screen.
   */
  function hideLoader() {
    const loader = document.getElementById('loading');
    if (!loader) return;

    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  }

  /* ---- Contact Form --------------------------------------------------- */

  function initContactForm() {
    const form = document.querySelector('.contact__form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      // Store original state
      const originalText  = btn.textContent;
      const originalColor = btn.style.backgroundColor;

      // Show success feedback
      btn.textContent          = 'Message Sent!';
      btn.style.backgroundColor = '#22c55e'; // green-500
      btn.disabled              = true;

      // Reset after 2 seconds
      setTimeout(() => {
        btn.textContent          = originalText;
        btn.style.backgroundColor = originalColor;
        btn.disabled              = false;
        form.reset();
      }, 2000);
    });
  }

  /* ---- Smooth Scroll -------------------------------------------------- */

  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Account for fixed navbar height
        const navbar       = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        const targetTop = target.getBoundingClientRect().top
          + window.scrollY
          - navbarHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ---- Expose --------------------------------------------------------- */
  return { init, hideLoader };
})();

/* ---- Bootstrap -------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => App.init());
window.addEventListener('load', () => App.hideLoader());
