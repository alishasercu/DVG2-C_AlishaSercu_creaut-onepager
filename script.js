// Titel schuift omhoog zodra de pagina geladen is
requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));

// Scroll-animaties: .reveal komt zacht in beeld (IntersectionObserver, geen scroll-listener)
const animated = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  animated.forEach((el) => revealObserver.observe(el));

  // Actief hoofdstuk in de navigatie
  const links = document.querySelectorAll('.nav__links a');
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const on = a.getAttribute('href') === `#${entry.target.id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('.chapter, .hero, .overview').forEach((s) => activeObserver.observe(s));
} else {
  animated.forEach((el) => el.classList.add('is-visible'));
}

// Menu voor mobiel
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
const background = [document.getElementById('main'), document.querySelector('.footer')];

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  document.body.style.overflow = open ? 'hidden' : '';
  background.forEach((el) => { el.inert = open; });

  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menu.querySelector('a').focus({ preventScroll: true });
  } else {
    menu.classList.remove('is-open');
    setTimeout(() => { if (toggle.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, 400);
  }
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
// Eerst het menu sluiten (scroll weer vrij), dan pas naar het hoofdstuk scrollen
menu.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  e.preventDefault();
  setMenu(false);
  const hash = link.getAttribute('href');
  setTimeout(() => {
    document.querySelector(hash).scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.pushState(null, '', hash);
  }, 0);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

// Menu sluiten als het scherm breder wordt dan mobiel
matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
  if (e.matches && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
});
