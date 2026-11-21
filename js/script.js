/**
 * Halimov Sarvarbek — Personal Developer Portfolio
 * Vanilla JavaScript (ES5/ES6 compatible, works directly via file://)
 */

(function () {
  'use strict';

  /**
   * Editable Portfolio Configuration
   * Fill in your real links or study period when ready — the UI updates automatically.
   */
  const PORTFOLIO_CONFIG = {
    // Example: "2023 — 2027" (leave empty until confirmed)
    studyPeriod: '',

    // Example: "https://github.com/khalimovvs/restostaff" (leave empty if private/unverified)
    restoStaffRepoUrl: '',

    // Editable contact placeholders (already configured in index.html)
    contacts: {
      telegram: {
        url: 'https://t.me/Khalimovvs',
        display: '@Khalimovvs'
      },
      email: {
        address: 'sarvarhalimov7@gmail.com'
      },
      linkedin: {
        url: 'https://www.linkedin.com/in/sarvarbek-halimov-3032b6343/',
        display: 'Sarvarbek Halimov'
      }
    }
  };

  /* ------------------------------------------------------------------------
     1. Apply Optional Config Values (Contacts, RestoStaff Repo, Study Period)
     ------------------------------------------------------------------------ */
  function applyPortfolioConfig() {
    // Update study period badge only if explicitly configured
    if (PORTFOLIO_CONFIG.studyPeriod) {
      const badge = document.getElementById('study-period-badge');
      if (badge) {
        badge.textContent = '3-kurs talabasi · ' + PORTFOLIO_CONFIG.studyPeriod;
      }
    }

    // Update RestoStaff GitHub link if configured
    if (PORTFOLIO_CONFIG.restoStaffRepoUrl) {
      const container = document.getElementById('restostaff-links');
      if (container) {
        container.innerHTML =
          '<a href="' +
          escapeAttr(PORTFOLIO_CONFIG.restoStaffRepoUrl) +
          '" target="_blank" rel="noopener noreferrer" class="project-link">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
          '<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"></path>' +
          '</svg>' +
          '<span>GitHub repozitoriy</span>' +
          '</a>';
      }
    }

    // Upgrade editable contact slots into live links when configured
    upgradeContactSlot('telegram', PORTFOLIO_CONFIG.contacts.telegram.url, PORTFOLIO_CONFIG.contacts.telegram.display, true);
    if (PORTFOLIO_CONFIG.contacts.email.address) {
      upgradeContactSlot(
        'email',
        'mailto:' + PORTFOLIO_CONFIG.contacts.email.address,
        PORTFOLIO_CONFIG.contacts.email.address,
        false
      );
    }
    upgradeContactSlot('linkedin', PORTFOLIO_CONFIG.contacts.linkedin.url, PORTFOLIO_CONFIG.contacts.linkedin.display, true);
  }

  function upgradeContactSlot(slotName, href, displayValue, isExternal) {
    if (!href) return;
    const slot = document.querySelector('[data-contact-slot="' + slotName + '"]');
    if (!slot) return;

    const anchor = document.createElement('a');
    anchor.className = 'contact-card card reveal is-visible';
    anchor.href = href;
    if (isExternal) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }

    const icon = slot.querySelector('.contact-icon');
    const label = slot.querySelector('.contact-label');

    if (icon) anchor.appendChild(icon.cloneNode(true));

    const meta = document.createElement('div');
    meta.className = 'contact-meta';

    const labelEl = document.createElement('span');
    labelEl.className = 'contact-label';
    labelEl.textContent = label ? label.textContent : slotName;

    const valueEl = document.createElement('span');
    valueEl.className = 'contact-value';
    valueEl.textContent = displayValue || href.replace(/^https?:\/\//, '');

    meta.appendChild(labelEl);
    meta.appendChild(valueEl);
    anchor.appendChild(meta);

    const arrow = document.createElement('span');
    arrow.className = 'contact-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    anchor.appendChild(arrow);

    slot.replaceWith(anchor);
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ------------------------------------------------------------------------
     2. Theme Toggle (Dark Default + Persistent Preference)
     ------------------------------------------------------------------------ */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (!toggleBtn) return;

    function syncThemeUI(theme) {
      const isLight = theme === 'light';
      toggleBtn.setAttribute('aria-pressed', String(isLight));
      toggleBtn.setAttribute(
        'aria-label',
        isLight ? 'Qorong‘i rejimga o‘tish' : 'Yorug‘ rejimga o‘tish'
      );
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', isLight ? '#f8fafc' : '#0a0c10');
      }
    }

    const initialTheme = html.getAttribute('data-theme') || 'dark';
    syncThemeUI(initialTheme);

    toggleBtn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      syncThemeUI(next);

      try {
        localStorage.setItem('portfolio-theme', next);
      } catch (e) {
        // Ignore storage errors
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    const menuBtn = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (!menuBtn || !drawer) return;

    function setOpen(isOpen) {
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Menyuni yopish' : 'Menyuni ochish');
      drawer.hidden = !isOpen;
    }

    menuBtn.addEventListener('click', function () {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      setOpen(!expanded);
    });

    // Close menu when a link is clicked
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !drawer.hidden) {
        setOpen(false);
        menuBtn.focus();
      }
    });

    // Close if resized to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && !drawer.hidden) {
        setOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Active Navigation Indicator (Scroll Spy)
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    if (!sections.length || !navLinks.length) return;

    function setActive(sectionId) {
      navLinks.forEach(function (link) {
        const isMatch = link.getAttribute('data-section') === sectionId;
        link.classList.toggle('active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-35% 0px -55% 0px',
          threshold: 0
        }
      );

      sections.forEach(function (sec) {
        if (sec.id !== 'hero') {
          observer.observe(sec);
        }
      });
    }
  }

  /* ------------------------------------------------------------------------
     5. Scroll Reveal Animations (Respects prefers-reduced-motion)
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    document.documentElement.classList.add('js-enabled');

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     6. Back-to-Top Button
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    function toggleVisibility() {
      btn.classList.toggle('visible', window.scrollY > 420);
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', function () {
      const prefersReduced =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Footer Year
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* ------------------------------------------------------------------------
     Initialize
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    applyPortfolioConfig();
    initThemeToggle();
    initMobileMenu();
    initActiveNav();
    initScrollReveal();
    initBackToTop();
    initFooterYear();
  });
})();
