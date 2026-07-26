'use strict';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
const progress = document.querySelector('.scroll-progress span');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollUI() {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    progress.style.width = `${value}%`;
  }
}
updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
  nav?.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });

const reveals = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: '0px 0px -45px 0px' });
  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 22, 150)}ms`;
    observer.observe(el);
  });
}

document.querySelectorAll('.accordion-trigger').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

document.querySelectorAll('[data-before-after]').forEach(component => {
  const range = component.querySelector('input[type="range"]');
  const layer = component.querySelector('.after-layer');
  const handle = component.querySelector('.ba-handle');
  function update() {
    const value = Number(range.value);
    layer.style.clipPath = `inset(0 0 0 ${value}%)`;
    handle.style.left = `${value}%`;
  }
  range.addEventListener('input', update);
  update();
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxText = lightbox?.querySelector('p');
function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove('menu-open');
}
document.querySelectorAll('[data-lightbox]').forEach(image => {
  image.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxText) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxText.textContent = image.dataset.caption || image.alt;
    lightbox.hidden = false;
    document.body.classList.add('menu-open');
  });
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
