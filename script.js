/* ================================================================
   STONE HOUSE BAR & GRILL — script.js
   Shared across all pages
   ================================================================ */
'use strict';

/* ── PAGE LOAD FADE-IN ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => document.body.classList.add('page-ready'));
});

/* ── PAGE-EXIT TRANSITION (fade out before navigating) ───────── */
document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') ||
      href.startsWith('mailto') || href.startsWith('tel') ||
      link.hasAttribute('target')) return;
  e.preventDefault();
  document.body.classList.remove('page-ready');
  setTimeout(() => { window.location.href = href; }, 380);
});

/* ── HEADER SCROLL SHADOW ─────────────────────────────────────── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── ACTIVE NAV LINK (current page detection) ────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  const linkPage = href.split('/').pop();
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active-link');
  }
});

/* ── HAMBURGER + MOBILE NAV ───────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

function openMobileNav() {
  if (!mobileNav || !hamburger) return;
  mobileNav.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  if (!mobileNav || !hamburger) return;
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) closeMobileNav();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* ── SCROLL-TRIGGERED FADE-IN (Intersection Observer) ────────── */
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

/* ── MENU TABS ────────────────────────────────────────────────── */
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) panel.classList.add('active');
  });
});

/* ── LIGHTBOX (gallery page, if present) ─────────────────────── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const lightboxCtr   = document.getElementById('lightboxCounter');

if (lightbox && lightboxImg) {
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
  let currentIdx = 0;

  function setImg(idx) {
    currentIdx = (idx + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIdx].dataset.src;
    lightboxImg.alt = galleryItems[currentIdx].dataset.alt || '';
    if (lightboxCtr) lightboxCtr.textContent = `${currentIdx + 1} / ${galleryItems.length}`;
  }

  function openLightbox(idx) {
    lightbox.removeAttribute('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => lightbox.classList.add('lb-open')));
    setImg(idx);
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    document.body.style.overflow = '';
    lightbox.addEventListener('transitionend', () => {
      lightbox.setAttribute('hidden', '');
      lightboxImg.src = '';
    }, { once: true });
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', () => setImg(currentIdx - 1));
  if (lightboxNext)  lightboxNext.addEventListener('click', () => setImg(currentIdx + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   setImg(currentIdx - 1);
    if (e.key === 'ArrowRight')  setImg(currentIdx + 1);
  });

  let touchX = 0;
  lightbox.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) dx < 0 ? setImg(currentIdx + 1) : setImg(currentIdx - 1);
  });
}
