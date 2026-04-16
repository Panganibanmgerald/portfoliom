/* ═══════════════════════════════════════════════════════
   MARK GERALD PANGANIBAN — PORTFOLIO
   Full Animation Engine
   Libraries: GSAP + ScrollTrigger + TextPlugin
═══════════════════════════════════════════════════════ */

'use strict';

// ─── GSAP SETUP ─────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─── RESPECT REDUCED MOTION ────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════
   1. PAGE LOADER
═══════════════════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // trigger hero after loader
      if (!prefersReduced) runHeroEntrance();
    }, 1500);
  });
  // fallback
  setTimeout(() => {
    loader.classList.add('hidden');
    if (!prefersReduced) runHeroEntrance();
  }, 3000);
}

/* ═══════════════════════════════════════════════════════
   2. CUSTOM CURSOR
═══════════════════════════════════════════════════════ */
function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  if (!outer || !inner) return;

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // inner follows instantly
    gsap.to(inner, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  });

  // outer follows with lag
  gsap.ticker.add(() => {
    outerX += (mouseX - outerX) * 0.14;
    outerY += (mouseY - outerY) * 0.14;
    gsap.set(outer, { x: outerX, y: outerY });
  });

  // hover states
  const hoverEls = document.querySelectorAll('a, button, .work-tab, .tool-chip, .service-card, .testimonial-card, .work-card, input, textarea, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-clicking'));

  // hide/show on leave/enter window
  document.addEventListener('mouseleave', () => { outer.style.opacity = '0'; inner.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { outer.style.opacity = '1'; inner.style.opacity = '1'; });
}

/* ═══════════════════════════════════════════════════════
   3. MAGNETIC BUTTONS
═══════════════════════════════════════════════════════ */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = Math.min((window.scrollY / max) * 100, 100);
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   5. NAV — SCROLL HIDE/SHOW + SCROLLED STATE
═══════════════════════════════════════════════════════ */
function initNav() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    header.classList.toggle('nav-hidden', y > lastY + 10 && y > 200);
    if (y < lastY) header.classList.remove('nav-hidden');
    lastY = y;
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   6. MOBILE MENU
═══════════════════════════════════════════════════════ */
function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ═══════════════════════════════════════════════════════
   7. PARTICLE CANVAS
═══════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 55;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  let mouseX = -9999, mouseY = -9999;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // subtle mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        p.x += dx / dist * force * 0.6;
        p.y += dy / dist * force * 0.6;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
      ctx.fill();
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201,162,39,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════
   8. HERO ENTRANCE ANIMATION
═══════════════════════════════════════════════════════ */
function runHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#hero-eyebrow',  { opacity: 1, y: 0, duration: 0.7 }, 0.2)
    .to('#hero-name',     { opacity: 1, y: 0, duration: 0.8 }, 0.45)
    .to('#hero-tagline',  { opacity: 1, y: 0, duration: 0.7 }, 0.65)
    .to('#hero-actions',  { opacity: 1, y: 0, duration: 0.6 }, 0.85)
    .to('#hero-portrait', { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 0.35)
    .to('#hero-stats',    { opacity: 1, y: 0, duration: 0.7 }, 1.0);

  // set initial off-screen positions
  gsap.set('#hero-eyebrow', { y: 20 });
  gsap.set('#hero-name',    { y: 30 });
  gsap.set('#hero-tagline', { y: 20 });
  gsap.set('#hero-actions', { y: 20 });
  gsap.set('#hero-portrait',{ x: 40 });
  gsap.set('#hero-stats',   { y: 15 });
}

/* ═══════════════════════════════════════════════════════
   9. SCROLL REVEAL ANIMATIONS
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  if (prefersReduced) {
    document.querySelectorAll('.reveal-text,.reveal-heading,.reveal-item,.reveal-card,.reveal-img,.reveal-timeline').forEach(el => {
      el.style.opacity = 1;
    });
    return;
  }

  const makeReveal = (selector, vars, stagger = 0) => {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
      gsap.set(el, { opacity: 0, ...vars });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            x: 0, y: 0,
            scale: 1,
            duration: 0.75,
            delay: stagger ? i * stagger : 0,
            ease: 'power3.out',
          });
        },
      });
    });
  };

  makeReveal('.reveal-text',    { y: 24 });
  makeReveal('.reveal-heading', { y: 30 });
  makeReveal('.reveal-img',     { scale: 0.96, y: 20 });

  // Cards stagger in groups
  document.querySelectorAll('.reveal-card').forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: (i % 3) * 0.1,
          ease: 'power2.out',
        });
      },
    });
  });

  // Items stagger
  document.querySelectorAll('.reveal-item').forEach((el, i) => {
    gsap.set(el, { opacity: 0, x: -16 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.55,
          delay: (i % 5) * 0.08,
          ease: 'power2.out',
        });
      },
    });
  });

  // Timeline items
  document.querySelectorAll('.reveal-timeline').forEach((el, i) => {
    gsap.set(el, { opacity: 0, x: 30 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power3.out',
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════
   10. COUNT-UP NUMBERS
═══════════════════════════════════════════════════════ */
function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let triggered = false;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate() { el.textContent = Math.round(+el.textContent); },
          }
        );
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════
   11. CLIENTS MARQUEE (subtle parallax)
═══════════════════════════════════════════════════════ */
function initClientsParallax() {
  const strip = document.querySelector('.clients-logos');
  if (!strip || prefersReduced) return;
  ScrollTrigger.create({
    trigger: '.clients-strip',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      gsap.set(strip, { x: -self.progress * 20 });
    },
  });
}

/* ═══════════════════════════════════════════════════════
   12. WORK FILTER TABS
═══════════════════════════════════════════════════════ */
function initWorkFilter() {
  const tabs  = document.querySelectorAll('.work-tab');
  const cards = document.querySelectorAll('.work-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        if (match) {
          card.classList.remove('is-hidden');
          gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.05 * [...cards].filter(c => !c.classList.contains('is-hidden')).indexOf(card) });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   13. LIGHTBOX
═══════════════════════════════════════════════════════ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.work-card-img').forEach(wrap => {
    wrap.style.cursor = 'zoom-in';
    wrap.addEventListener('click', () => {
      const img = wrap.querySelector('img');
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = wrap.closest('.work-card')?.querySelector('h3')?.textContent || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo('.lightbox-inner', { scale: 0.93, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    });
  });

  function closeLightbox() {
    gsap.to(lightbox, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => { lightbox.hidden = true; document.body.style.overflow = ''; lbImg.src = ''; },
    });
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
}

/* ═══════════════════════════════════════════════════════
   14. CONTACT FORM (mailto)
═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all required fields.';
      status.style.color = '#f87171';
      return;
    }

    const subject = encodeURIComponent(`Portfolio Inquiry from ${name} — ${service || 'General'}`);
    const body    = encodeURIComponent(
      `Hi Mark Gerald,\n\nMy name is ${name} and I'm reaching out from your portfolio.\n\nService Needed: ${service || 'Not specified'}\n\nMessage:\n${message}\n\nBest regards,\n${name}\n${email}`
    );

    window.location.href = `mailto:panganibanmgerald@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = 'Opening your email app… ✓';
    status.style.color = 'var(--color-gold)';
    form.reset();
    setTimeout(() => { status.textContent = ''; }, 4000);
  });

  // Animate inputs on focus
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      gsap.to(input, { boxShadow: '0 0 0 3px rgba(201,162,39,0.12)', duration: 0.25 });
    });
    input.addEventListener('blur', () => {
      gsap.to(input, { boxShadow: '0 0 0 0px rgba(201,162,39,0)', duration: 0.25 });
    });
  });
}

/* ═══════════════════════════════════════════════════════
   15. PARALLAX SECTIONS
═══════════════════════════════════════════════════════ */
function initParallax() {
  if (prefersReduced) return;

  // Portrait subtle parallax
  gsap.to('.hero-portrait', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  // Hero grid moves slower
  gsap.to('.hero-bg-grid', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
  });

  // Glow layer
  gsap.to('.hero-glow', {
    y: 80,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2.5,
    },
  });
}

/* ═══════════════════════════════════════════════════════
   16. SECTION TITLE UNDERLINE REVEAL
═══════════════════════════════════════════════════════ */
function initSectionUnderlines() {
  if (prefersReduced) return;
  document.querySelectorAll('.section-heading em').forEach(em => {
    ScrollTrigger.create({
      trigger: em,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(em, { backgroundSize: '0% 2px' }, {
          backgroundSize: '100% 2px',
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.4,
        });
      },
    });
    // ensure proper styling for underline animation
    em.style.backgroundImage = 'linear-gradient(var(--color-gold), var(--color-gold))';
    em.style.backgroundRepeat = 'no-repeat';
    em.style.backgroundPosition = '0 100%';
    em.style.backgroundSize = '0% 2px';
  });
}

/* ═══════════════════════════════════════════════════════
   17. SERVICE CARD ICON SPIN ON SECTION ENTER
═══════════════════════════════════════════════════════ */
function initServiceIcons() {
  if (prefersReduced) return;
  document.querySelectorAll('.service-icon').forEach(icon => {
    ScrollTrigger.create({
      trigger: icon,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(icon, { rotation: -15, scale: 0.7, opacity: 0 }, {
          rotation: 0, scale: 1, opacity: 1,
          duration: 0.6, ease: 'back.out(2)',
        });
      },
    });
  });
}

/* ═══════════════════════════════════════════════════════
   18. TIMELINE LINE DRAW
═══════════════════════════════════════════════════════ */
function initTimelineDraw() {
  if (prefersReduced) return;
  const line = document.querySelector('.timeline::before');
  // CSS pseudo-element, use clip-path via wrapper
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  gsap.fromTo(timeline,
    { '--line-scaleY': 0 },
    {
      '--line-scaleY': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 1,
      },
    }
  );
}

/* ═══════════════════════════════════════════════════════
   19. TOOL CHIP WAVE ANIMATION
═══════════════════════════════════════════════════════ */
function initToolChips() {
  if (prefersReduced) return;
  ScrollTrigger.create({
    trigger: '.tools-grid',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.tool-chip',
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5,
          stagger: { amount: 0.5, from: 'start' },
          ease: 'back.out(1.5)',
        }
      );
    },
  });
}

/* ═══════════════════════════════════════════════════════
   20. INIT ALL
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initMagnetic();
  initScrollProgress();
  initNav();
  initMobileMenu();
  initParticles();
  initScrollReveal();
  initCountUp();
  initClientsParallax();
  initWorkFilter();
  initLightbox();
  initContactForm();
  initParallax();
  initSectionUnderlines();
  initServiceIcons();
  initTimelineDraw();
  initToolChips();

  // If page loads without loader (cached), run hero immediately
  if (document.readyState === 'complete' && !prefersReduced) {
    setTimeout(runHeroEntrance, 300);
  }

  // Smooth anchor scrolling with offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});
