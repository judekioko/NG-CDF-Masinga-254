// === ENHANCED MOBILE MENU FUNCTIONALITY ===
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav ul");
  const body = document.body;
  const header = document.querySelector("header");

  // Initialize mobile menu
  function initMobileMenu() {
    if (!menuToggle || !nav) {
      console.warn('Menu elements not found');
      return;
    }

    // Ensure initial state is correct
    nav.classList.remove('open');
    body.classList.remove('menu-open');
    removeBackdrop();

    // Toggle button click handler
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Menu link click handlers - close menu when link is clicked
    const menuLinks = nav.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only close menu on mobile
        if (window.innerWidth <= 900) {
          closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          e.target !== menuToggle &&
          !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus(); // Return focus to toggle button
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Close menu if resizing to desktop view
        if (window.innerWidth > 900 && nav.classList.contains('open')) {
          closeMenu();
        }
      }, 250);
    });

    // Prevent scroll on swipe when menu is open
    let touchStartY = 0;
    nav.addEventListener('touchstart', (e) => {
      if (nav.classList.contains('open')) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    nav.addEventListener('touchmove', (e) => {
      if (!nav.classList.contains('open')) return;

      const touchY = e.touches[0].clientY;
      const scrollTop = nav.scrollTop;
      const scrollHeight = nav.scrollHeight;
      const offsetHeight = nav.offsetHeight;

      // Prevent overscroll
      if ((scrollTop === 0 && touchY > touchStartY) ||
          (scrollTop + offsetHeight >= scrollHeight && touchY < touchStartY)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  function toggleMenu() {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    nav.classList.add('open');
    menuToggle.innerHTML = '✕';
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    body.classList.add('menu-open');
    addBackdrop();

    // Trap focus within menu
    trapFocus(nav);

    // Announce to screen readers
    announceToScreenReader('Menu opened');
  }

  function closeMenu() {
    nav.classList.remove('open');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    body.classList.remove('menu-open');
    removeBackdrop();

    // Remove focus trap
    removeFocusTrap();

    // Announce to screen readers
    announceToScreenReader('Menu closed');
  }

  function addBackdrop() {
    // Remove any existing backdrop first
    removeBackdrop();
    
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop active';
    backdrop.addEventListener('click', closeMenu);
    backdrop.addEventListener('touchstart', closeMenu, { passive: true });
    document.body.appendChild(backdrop);

    // Animate backdrop in
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
    });
  }

  function removeBackdrop() {
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop) {
      backdrop.style.opacity = '0';
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    }
  }

  // Focus trap for accessibility
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;

  function trapFocus(element) {
    focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    document.addEventListener('keydown', handleFocusTrap);
  }

  function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement || document.activeElement === menuToggle) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        menuToggle.focus();
      }
    }
  }

  function removeFocusTrap() {
    document.removeEventListener('keydown', handleFocusTrap);
  }

  // Screen reader announcements
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  // Active page highlighting
  function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('nav ul li a');
    
    menuLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth scroll to top when clicking logo/title
  const headerLeft = document.querySelector('.header-left');
  if (headerLeft) {
    headerLeft.style.cursor = 'pointer';
    headerLeft.addEventListener('click', (e) => {
      // Only if clicking on the container, not on the logo image
      if (e.target === headerLeft || e.target === document.querySelector('header h1')) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  // Add loading animation to page
  function addPageLoadAnimation() {
    document.body.style.opacity = '0';
    
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '1';
    });
  }

  // Handle orientation change on mobile
  window.addEventListener('orientationchange', () => {
    if (nav.classList.contains('open')) {
      // Close menu and reopen after orientation change completes
      closeMenu();
    }
  });

  // Prevent iOS rubber band effect when menu is open
  document.addEventListener('touchmove', (e) => {
    if (body.classList.contains('menu-open') && !nav.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Initialize everything
  initMobileMenu();
  highlightActivePage();
  addPageLoadAnimation();

  // Expose functions globally for debugging or external use
  window.menuController = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: () => nav.classList.contains('open')
  };
});

// Handle page visibility changes (when user switches tabs)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - could pause animations here
    console.log('Page hidden');
  } else {
    // Page is visible - resume animations
    console.log('Page visible');
  }
});

// Performance monitoring (optional - remove in production)
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  });
}

// Service Worker Registration (for PWA capabilities - optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('Service Worker registered'))
    //   .catch(err => console.log('Service Worker registration failed'));
  });
}