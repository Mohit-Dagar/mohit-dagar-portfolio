/* ============================================================
   MOHIT DAGAR — AI PORTFOLIO
   script.js  |  Navbar · Scroll · Filter · Form · Animations
   ============================================================ */

/* ══════════════════════════════════════════════
   1. DOM READY
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initActiveNav();

  // Page-specific inits
  if (document.querySelector('.filter-bar'))   initProjectFilter();
  if (document.querySelector('.contact-form')) initContactForm();
});

/* ══════════════════════════════════════════════
   2. NAVBAR — scroll effect + hamburger
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  // Scroll-based class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      }
    });
  }
}

/* ══════════════════════════════════════════════
   3. ACTIVE NAV LINK — highlight current page
══════════════════════════════════════════════ */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ══════════════════════════════════════════════
   4. SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════════ */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve so it stays visible
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   5. SKILL BARS — animate on scroll
══════════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const target = fill.dataset.width || '0';
          setTimeout(() => { fill.style.width = target; }, 200);
          barObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => barObserver.observe(bar));
}

/* ══════════════════════════════════════════════
   6. PROJECT FILTER
══════════════════════════════════════════════ */
function initProjectFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const matches  = filter === 'all' || category === filter;

        if (matches) {
          card.style.display = '';
          // Re-trigger reveal
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            setTimeout(() => card.classList.add('visible'), 50);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ══════════════════════════════════════════════
   7. CONTACT FORM VALIDATION
══════════════════════════════════════════════ */
function initContactForm() {
  const form    = document.querySelector('.contact-form');
  const success = document.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
    form.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));

    // Validate Name
    const name = form.querySelector('#name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full name.');
      valid = false;
    }

    // Validate Email
    const email = form.querySelector('#email');
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    // Validate Message
    const msg = form.querySelector('#message');
    if (!msg.value.trim() || msg.value.trim().length < 15) {
      showError(msg, 'Message must be at least 15 characters.');
      valid = false;
    }

    if (!valid) return;

    // Simulate send (replace with EmailJS or Formspree in production)
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText  = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending…';
    submitBtn.disabled  = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = origText;
      submitBtn.disabled  = false;
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1600);
  });

  // Real-time clear error on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const err = document.getElementById(el.id + '-error');
      if (err) err.classList.remove('show');
    });
  });
}

function showError(field, message) {
  field.classList.add('error');
  const err = document.getElementById(field.id + '-error');
  if (err) {
    err.textContent = message;
    err.classList.add('show');
  }
}

/* ══════════════════════════════════════════════
   8. TYPED / CURSOR EFFECT on hero subtitle
══════════════════════════════════════════════ */
(function initTyped() {
  const el = document.querySelector('.hero-sub-typed');
  if (!el) return;

  const words  = ['ML Engineer', 'Python Developer', 'Data Scientist', 'AI/ML Intern', 'Automation Engineer'];
  let wIndex   = 0;
  let cIndex   = 0;
  let deleting = false;
  let paused   = false;

  function type() {
    if (paused) return;

    const word    = words[wIndex];
    const current = deleting
      ? word.substring(0, cIndex - 1)
      : word.substring(0, cIndex + 1);

    el.textContent = current;
    deleting ? cIndex-- : cIndex++;

    let delay = deleting ? 55 : 90;

    if (!deleting && cIndex === word.length) {
      delay   = 1600;
      deleting = true;
    } else if (deleting && cIndex === 0) {
      deleting = false;
      wIndex   = (wIndex + 1) % words.length;
      delay    = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();

/* ══════════════════════════════════════════════
   9. SMOOTH COUNTER ANIMATION for stats
══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 50);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);

      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  counters.forEach(c => observer.observe(c));
})();
