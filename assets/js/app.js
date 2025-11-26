(function () {
  // Persisted dark mode preference
  const storageKey = 'starter:theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(storageKey);

  function applyTheme(mode) {
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }

  // Initialize theme: saved -> OS preference -> light
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Toggle dark mode
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    // Close on navigation click (mobile)
    mobileNav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Desktop Solutions mega menu
  const solToggle = document.getElementById('solutionsToggle');
  const solPanel = document.getElementById('solutionsPanel');
  let hideTimer;

  function showSolutions() {
    if (!solPanel) return;
    clearTimeout(hideTimer);
    solPanel.classList.remove('hidden');
    solToggle?.setAttribute('aria-expanded', 'true');
  }

  function hideSolutions() {
    if (!solPanel) return;
    solPanel.classList.add('hidden');
    solToggle?.setAttribute('aria-expanded', 'false');
  }

  if (solToggle && solPanel) {
    // Hover/focus interactions
    solToggle.addEventListener('mouseenter', showSolutions);
    solToggle.addEventListener('focus', showSolutions);
    solPanel.addEventListener('mouseenter', showSolutions);

    solToggle.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(hideSolutions, 120);
    });
    solToggle.addEventListener('blur', () => {
      hideTimer = setTimeout(hideSolutions, 120);
    });
    solPanel.addEventListener('mouseleave', hideSolutions);

    // Click toggles on desktop as well
    solToggle.addEventListener('click', (e) => {
      // Prevent jumping to #solutions when used as a toggle
      e.preventDefault();
      if (solPanel.classList.contains('hidden')) showSolutions();
      else hideSolutions();
    });

    // Hide on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideSolutions();
    });
  }

  // Simple contact form handler
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      setStatus('Please fill out all fields.', true);
      return;
    }

    // Simulate async submit
    setStatus('Sending...', false);
    setTimeout(() => {
      setStatus('Thanks! Your message has been sent.', false);
      form.reset();
    }, 800);
  });

  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('text-red-600', !!isError);
    status.classList.toggle('text-slate-500', !isError);
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
  // Lightweight confetti on first load
  function launchConfetti(duration = 2500, count = 90) {
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    document.body.appendChild(layer);

    const colors = ['#10b981', '#34d399', '#06b6d4', '#f59e0b', '#ef4444'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const w = 6 + Math.random() * 8;
      const h = 8 + Math.random() * 10;
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.setProperty('--sx', (Math.random() * 120 - 60) + 'px');
      el.style.animationDuration = (2.4 + Math.random() * 1.2) + 's';
      el.style.animationDelay = (Math.random() * 0.6) + 's';
      el.style.opacity = String(0.8);
      layer.appendChild(el);
    }

    setTimeout(() => layer.remove(), duration + 1200);
  }

  // Fire once shortly after load
  if (!sessionStorage.getItem('starter:confetti')) {
    setTimeout(() => launchConfetti(2600, 110), 400);
    sessionStorage.setItem('starter:confetti', '1');
  }

  // Animated metrics counters (scroll into view)
  const metricsSection = document.getElementById('metrics');
  const counters = metricsSection?.querySelectorAll('.count-up');
  let metricsStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400; // ms
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (metricsSection && counters && counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !metricsStarted) {
          metricsStarted = true;
          counters.forEach((el) => animateCounter(el));
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(metricsSection);
  }
})();
