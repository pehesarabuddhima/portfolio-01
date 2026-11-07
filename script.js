/* =========================================================
   Pehesara Rathnaweera — Portfolio JavaScript
   Vanilla JS: navigation, typing effect, particles,
   scroll reveal, skill bars, form handling.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Sticky Navbar on Scroll ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);
    highlightNavLink();
  }

  /* ---------- 2. Mobile Hamburger Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Active Nav Link Highlighting ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Back to Top ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 5. Typing Effect (Hero) ---------- */
  const typedEl = document.getElementById('typed');
  const phrases = ['Software Developer', 'Web Developer', 'UI/UX Enthusiast', 'Creative Coder'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    typedEl.textContent = current.slice(0, charIdx);

    if (!deleting && charIdx < current.length) {
      charIdx++;
      setTimeout(typeLoop, 85);
    } else if (deleting && charIdx > 0) {
      charIdx--;
      setTimeout(typeLoop, 40);
    } else if (!deleting) {
      deleting = true;
      setTimeout(typeLoop, 1800);   // pause at full word
    } else {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
    }
  }
  typeLoop();

  /* ---------- 6. Scroll Reveal Animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);   // animate only once
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 7. Animate Skill Bars ---------- */
  const progressBars = document.querySelectorAll('.progress-bar');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        skillsObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  progressBars.forEach(bar => skillsObserver.observe(bar));

  /* ---------- 8. Education Timeline Draw ---------- */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { timeline.classList.add('in-view'); obs.disconnect(); }
      });
    }, { threshold: 0.2 }).observe(timeline);
  }

  /* ---------- 9. Particle Canvas Background ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COLORS = ['#a855f7', '#3b82f6', '#22d3ee'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(70, Math.floor(window.innerWidth / 20));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      // Move and bounce off edges
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });

  /* ---------- 10. Contact Form Handling ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Simple validation
    if (!name || !email || !subject || !message) {
      showStatus('⚠️ Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('⚠️ Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (no backend in a static site)
    showStatus('⏳ Sending message...', 'success');
    setTimeout(() => {
      showStatus('✅ Thank you, ' + name + '! Your message has been sent.', 'success');
      form.reset();
    }, 1200);
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
  }

  /* ---------- 11. Footer Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
