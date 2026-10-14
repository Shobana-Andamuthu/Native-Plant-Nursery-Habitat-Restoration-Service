/**
 * Sylvan & Soil — Native Plant Nursery & Habitat Restoration
 * Main Global Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initThemeToggle();
  initDirectionToggle();
  initMobileMenu();
  initBackToTop();
  initFormValidation();
  initProductGallery();
  initProjectTabs();
});

// Also trigger immediate loader check before full DOMContentLoaded
if (document.readyState === 'complete') {
  const l = document.getElementById('pageLoader');
  if (l) l.classList.add('fade-out');
}

/* ================= 1. THEME TOGGLE (DARK / LIGHT) ================= */
function initThemeToggle() {
  const themeSwitchBtns = document.querySelectorAll('[data-theme-switch]');
  const savedTheme = localStorage.getItem('sylvan_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  themeSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('sylvan_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update theme icons
  const icons = document.querySelectorAll('[data-theme-switch] i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill text-warning';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  });
}

/* ================= 2. DIRECTION TOGGLE (LTR / RTL) ================= */
function initDirectionToggle() {
  const dirSwitchBtns = document.querySelectorAll('[data-dir-switch]');
  const dirPills = document.querySelectorAll('[data-dir-set]');
  const savedDir = localStorage.getItem('sylvan_dir') || 'ltr';

  applyDirection(savedDir);

  dirSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('sylvan_dir', newDir);
    });
  });

  dirPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const targetDir = e.currentTarget.getAttribute('data-dir-set');
      if (targetDir) {
        applyDirection(targetDir);
        localStorage.setItem('sylvan_dir', targetDir);
      }
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  if (dir === 'rtl') {
    document.documentElement.setAttribute('lang', 'ar');
  } else {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Update UI toggles
  document.querySelectorAll('.dir-toggle-opt').forEach(opt => {
    if (opt.classList.contains(`dir-opt-${dir}`)) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  document.querySelectorAll('[data-dir-set]').forEach(btn => {
    if (btn.getAttribute('data-dir-set') === dir) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ================= 2.1 MOBILE OFFCANVAS MENU CONTROLS ================= */
function initMobileMenu() {
  const mobileMenuEl = document.getElementById('mobileMenu');
  if (!mobileMenuEl) return;

  // Background scroll lock when offcanvas is shown
  mobileMenuEl.addEventListener('show.bs.offcanvas', () => {
    document.body.classList.add('offcanvas-open');
    document.body.style.overflow = 'hidden';
  });

  mobileMenuEl.addEventListener('hidden.bs.offcanvas', () => {
    document.body.classList.remove('offcanvas-open');
    document.body.style.overflow = '';

    // Automatically collapse and reset the Home dropdown whenever mobile menu closes
    const homeSub = mobileMenuEl.querySelector('#mobileHomeSub');
    if (homeSub) {
      const bsCollapse = bootstrap.Collapse.getInstance(homeSub);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        homeSub.classList.remove('show');
      }
      const trigger = mobileMenuEl.querySelector('[href="#mobileHomeSub"]');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.add('collapsed');
      }
    }
  });

  // Explicit listener on offcanvas close button
  const closeBtn = mobileMenuEl.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const homeSub = mobileMenuEl.querySelector('#mobileHomeSub');
      if (homeSub) {
        const bsCollapse = bootstrap.Collapse.getInstance(homeSub);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          homeSub.classList.remove('show');
        }
        const trigger = mobileMenuEl.querySelector('[href="#mobileHomeSub"]');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
          trigger.classList.add('collapsed');
        }
      }
    });
  }

  // Automatically close mobile offcanvas menu when any navigation link is clicked
  const navLinks = mobileMenuEl.querySelectorAll('.mobile-nav-link:not([data-bs-toggle]), .mobile-sublink, .mobile-menu-footer a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(mobileMenuEl);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    });
  });
}

/* ================= 3. BACK TO TOP BUTTON ================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  // Check URL parameters to pre-fill enquiry form if on contact page
  const urlParams = new URLSearchParams(window.location.search);
  const enquiryTypeSelect = document.getElementById('enquiryType');
  const interestInput = document.getElementById('interestDetails');

  if (enquiryTypeSelect || interestInput) {
    const serviceParam = urlParams.get('service');
    const inquiryParam = urlParams.get('inquiry');
    const projectParam = urlParams.get('project');

    if (serviceParam && enquiryTypeSelect) {
      if (serviceParam.includes('meadow')) enquiryTypeSelect.value = 'meadow-restoration';
      else if (serviceParam.includes('pollinator')) enquiryTypeSelect.value = 'pollinator-habitat';
      else if (serviceParam.includes('wetland')) enquiryTypeSelect.value = 'wetland-restoration';
      else if (serviceParam.includes('woodland')) enquiryTypeSelect.value = 'woodland-stewardship';
      else if (serviceParam.includes('landscaping')) enquiryTypeSelect.value = 'general';
    }

    if (inquiryParam) {
      if (enquiryTypeSelect) enquiryTypeSelect.value = 'plant-order';
      if (interestInput) {
        interestInput.value = inquiryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    if (projectParam && interestInput) {
      interestInput.value = `Consultation request based on: ${projectParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
  }

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
          if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              isValid = false;
              input.classList.add('is-invalid');
            }
          }
        }
      });

      const feedback = form.querySelector('.form-feedback-alert') || 
                       form.closest('.site-section')?.querySelector('.form-feedback-alert') ||
                       form.parentElement?.querySelector('.form-feedback-alert');

      if (isValid) {
        if (feedback) {
          feedback.classList.remove('d-none');
          feedback.classList.add('show');
          feedback.innerHTML = `<i class="bi bi-check-circle-fill text-success fs-5"></i> <span>Thank you! Your enquiry has been received. Our restoration botanist will contact you within 24 hours.</span>`;
        } else {
          alert('Thank you! Your submission has been received.');
        }
        form.reset();
      } else {
        if (feedback) {
          feedback.classList.remove('d-none');
          feedback.classList.add('show');
          feedback.className = 'form-feedback-alert show alert alert-warning';
          feedback.innerHTML = `<i class="bi bi-exclamation-triangle-fill fs-5"></i> <span>Please check the highlighted fields and ensure all required information is provided.</span>`;
        }
      }
    });
  });
}

/* ================= 5. PRODUCT GALLERY SWITCHER ================= */
function initProductGallery() {
  const mainImg = document.getElementById('mainGalleryImg');
  const thumbs = document.querySelectorAll('.gallery-thumb-btn');

  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const targetSrc = thumb.getAttribute('data-img-src');
      if (targetSrc) {
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
          mainImg.src = targetSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ================= 6. PROJECT GALLERY TABS ================= */
function initProjectTabs() {
  const tabBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('[data-project-item]');

  if (tabBtns.length === 0 || projectCards.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const itemCategory = card.getAttribute('data-project-habitat');
        if (category === 'all' || itemCategory === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 7. ATTRACTIVE BOTANICAL PAGE LOADER ================= */
function initPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  const hideLoader = () => {
    if (!loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 550);
    }
  };

  // Check if page already loaded
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Graceful safety timer (max 750ms so user never waits unnecessarily)
    setTimeout(hideLoader, 750);
  }
}

