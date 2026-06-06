/* ==========================================================================
   Animations Module
   Scroll reveal, typing effect, and counter animation.
   All observers fire once and then unobserve for performance.
   ========================================================================== */

const Animations = (() => {
  'use strict';

  /* ---- Public --------------------------------------------------------- */

  function init() {
    initScrollReveal();
    initTypingEffect();
    initCounters();
  }

  /* ==================================================================== */
  /*  Scroll Reveal                                                       */
  /*  Elements with [data-reveal] receive .revealed when in view.         */
  /* ==================================================================== */

  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ==================================================================== */
  /*  Typing Effect                                                       */
  /*  Infinite loop: type → pause → delete → pause → next phrase.         */
  /* ==================================================================== */

  function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
      'Industry Professional',
      'Printing Technology Expert',
      'Computer Science Student',
      'IT & Hardware Specialist'
    ];

    const TYPE_SPEED   = 100;  // ms per character typed
    const DELETE_SPEED = 50;   // ms per character deleted
    const PAUSE_END    = 2000; // ms pause after full phrase
    const PAUSE_BETWEEN = 500; // ms pause between phrases

    let phraseIdx = 0;
    let charIdx   = 0;
    let isDeleting = false;

    function tick() {
      const current = phrases[phraseIdx];

      if (!isDeleting) {
        // Typing forward
        charIdx++;
        el.textContent = current.substring(0, charIdx);

        if (charIdx === current.length) {
          // Finished typing — pause, then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_END);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting backward
        charIdx--;
        el.textContent = current.substring(0, charIdx);

        if (charIdx === 0) {
          // Finished deleting — move to next phrase
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(tick, PAUSE_BETWEEN);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    // Kick off
    tick();
  }

  /* ==================================================================== */
  /*  Counter Animation                                                   */
  /*  Animates [data-count] elements from 0 → target with ease-out.       */
  /* ==================================================================== */

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /**
   * Animate a single counter element from 0 → data-count value.
   * Uses an ease-out curve over ~2 seconds.
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;

    const duration = 2000; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Final value with '+' suffix
        el.textContent = target + '+';
      }
    }

    requestAnimationFrame(step);
  }

  /* ---- Expose --------------------------------------------------------- */
  return { init };
})();
