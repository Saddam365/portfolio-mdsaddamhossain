/* ==========================================================================
   Navigation Module
   Sticky navbar, mobile menu drawer, active section highlighting,
   scroll progress bar, and back-to-top button.
   All scroll work is throttled via requestAnimationFrame.
   ========================================================================== */

const Navigation = (() => {
  'use strict';

  /* ---- State ---------------------------------------------------------- */
  let ticking = false;

  /* ---- Cached DOM refs (populated in init) ----------------------------- */
  let navbar          = null;
  let navLinks        = [];
  let hamburger       = null;
  let navMenu         = null;
  let mobileOverlay   = null;
  let scrollProgress  = null;
  let backToTop       = null;
  let sections        = [];

  /* ---- Public --------------------------------------------------------- */

  function init() {
    // Cache DOM elements
    navbar         = document.querySelector('.navbar');
    navLinks       = Array.from(document.querySelectorAll('.navbar__link'));
    hamburger      = document.getElementById('navHamburger');
    navMenu        = document.getElementById('navMenu');
    mobileOverlay  = document.getElementById('mobileOverlay');
    scrollProgress = document.getElementById('scrollProgress');
    backToTop      = document.querySelector('.back-to-top');
    sections       = Array.from(document.querySelectorAll('section[id]'));

    // Scroll listener (rAF-throttled)
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu events
    if (hamburger) {
      hamburger.addEventListener('click', toggleMobileMenu);
    }
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when any nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Back-to-top click
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Run once on load so UI matches the current scroll position
    handleScroll();
  }

  /* ---- Scroll handler (throttled) ------------------------------------- */

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleScroll() {
    const scrollY      = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio  = docHeight > 0 ? scrollY / docHeight : 0;

    // 1. Scroll progress bar
    if (scrollProgress) {
      scrollProgress.style.width = (scrollRatio * 100) + '%';
    }

    // 2. Sticky navbar class
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 50);
    }

    // 3. Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 300);
    }

    // 4. Active section highlighting
    updateActiveLink(scrollY);
  }

  /* ---- Active link ---------------------------------------------------- */

  function updateActiveLink(scrollY) {
    if (sections.length === 0) return;

    // Offset accounts for fixed navbar height + a little buffer
    const offset = navbar ? navbar.offsetHeight + 80 : 80;

    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop - offset <= scrollY) {
        currentId = section.id;
        break;
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ---- Mobile menu ---------------------------------------------------- */

  function toggleMobileMenu() {
    const isOpen = navMenu?.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    hamburger?.classList.add('open');
    navMenu?.classList.add('open');
    mobileOverlay?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    navMenu?.classList.remove('open');
    mobileOverlay?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ---- Expose --------------------------------------------------------- */
  return { init };
})();
