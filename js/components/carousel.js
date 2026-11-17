import { createProjectCardHTML } from './project-card.js';

const TRANSITION_MS = 450; // doit correspondre à --focus-duration dans carousel.css

let flkty = null;
let rafId = null;
let cleanupCallbacks = [];

function destroyCarousel() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  cleanupCallbacks.forEach((fn) => fn());
  cleanupCallbacks = [];

  if (flkty) {
    flkty.destroy();
    flkty = null;
  }
}

export function renderProjectsShowcase(container, projects) {
  if (!container) return;

  destroyCarousel(); // toujours AVANT de modifier le DOM

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state glass-panel">
        <h3 class="empty-state__title">Aucun projet correspondant</h3>
        <p class="empty-state__text">Essayez de modifier vos termes de recherche ou de réinitialiser les filtres.</p>
      </div>
    `;
    return;
  }

  // 4 projets ou moins : simple grille sans défilement
  if (projects.length <= 4) {
    container.innerHTML = `
      <div class="projects-grid">
        ${projects.map((p) => createProjectCardHTML(p)).join('')}
      </div>
    `;
    return;
  }

  // Plus de 4 projets : carrousel Flickity avec boucle infinie
  container.innerHTML = `
    <div class="carousel" role="region" aria-roledescription="carrousel" aria-label="Carrousel des projets" tabindex="0">
      <div class="carousel__header">
        <button type="button" class="carousel__btn glass-pill" id="carousel-prev" aria-label="Projet précédent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button type="button" class="carousel__btn glass-pill" id="carousel-next" aria-label="Projet suivant">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="carousel__track" id="carousel-track">
        ${projects.map((p) => `<div class="carousel__slide">${createProjectCardHTML(p)}</div>`).join('')}
      </div>
    </div>
  `;

  setupCarousel(container);
}

function setupCarousel(container) {
  const carouselEl = container.querySelector('.carousel');
  const track = container.querySelector('#carousel-track');
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');

  flkty = new Flickity(track, {
    cellAlign: 'center',
    wrapAround: true,
    contain: false,
    pageDots: false,
    prevNextButtons: false,
    draggable: true,
    percentPosition: false,
    adaptiveHeight: false,
    selectedAttraction: 0.032,
    friction: 0.3,
  });

  prevBtn.addEventListener('click', () => flkty.previous());
  nextBtn.addEventListener('click', () => flkty.next());

  const updateSelectedA11y = () => {
    const slides = track.querySelectorAll('.carousel__slide');
    slides.forEach((slide, idx) => {
      if (idx === flkty.selectedIndex) {
        slide.setAttribute('aria-current', 'true');
      } else {
        slide.removeAttribute('aria-current');
      }
    });
  };

  // Égalise les hauteurs sur la base des cartes étroites (où le texte prend le plus de lignes).
  // Sur la carte en focus plus large, le texte prend moins de hauteur et l'image comble l'espace restant.
  const equalizeHeights = () => {
    if (!flkty) return;
    const slides = [...track.querySelectorAll('.carousel__slide')];

    track.classList.add('is-measuring', 'no-transition');
    slides.forEach((s) => (s.style.height = 'auto'));
    const max = Math.max(...slides.map((s) => s.offsetHeight));
    slides.forEach((s) => (s.style.height = `${max}px`));
    track.classList.remove('is-measuring');
    void track.offsetWidth;
    track.classList.remove('no-transition');

    flkty.resize();
  };

  // Synchronise le repositionnement Flickity image par image pendant l'élargissement CSS
  const followAnimation = () => {
    if (rafId) cancelAnimationFrame(rafId);
    track.classList.add('is-animating');
    const end = performance.now() + TRANSITION_MS + 60;

    const tick = () => {
      if (!flkty) return;
      flkty.reposition();
      if (performance.now() < end) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        track.classList.remove('is-animating');
        flkty.resize();
      }
    };
    rafId = requestAnimationFrame(tick);
  };

  // Interrompt la boucle si l'utilisateur saisit le carrousel manuellement
  flkty.on('dragStart', () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    track.classList.remove('is-animating');
  });

  flkty.on('select', () => {
    updateSelectedA11y();
    followAnimation();
  });

  // Ergonomie : cliquer sur une tuile latérale la met en focus au lieu d'activer un lien
  flkty.on('staticClick', (_event, _pointer, _cellElement, cellIndex) => {
    if (typeof cellIndex === 'number' && cellIndex !== flkty.selectedIndex) {
      flkty.select(cellIndex);
    }
  });

  const onTrackClickCapture = (e) => {
    const slide = e.target.closest('.carousel__slide');
    if (slide && !slide.classList.contains('is-selected')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  track.addEventListener('click', onTrackClickCapture, true);
  cleanupCallbacks.push(() => track.removeEventListener('click', onTrackClickCapture, true));

  // Ergonomie : défilement horizontal au trackpad / Shift + molette
  let wheelLocked = false;
  let wheelTimer = null;
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    e.preventDefault();
    if (wheelLocked || !flkty) return;

    wheelLocked = true;
    if (e.deltaX > 0) {
      flkty.next();
    } else {
      flkty.previous();
    }
    wheelTimer = setTimeout(() => {
      wheelLocked = false;
    }, 320);
  };
  track.addEventListener('wheel', onWheel, { passive: false });
  cleanupCallbacks.push(() => {
    track.removeEventListener('wheel', onWheel);
    clearTimeout(wheelTimer);
  });

  // Ergonomie : navigation clavier lorsque le carrousel a le focus
  const onKeyDown = (e) => {
    if (!flkty) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      flkty.previous();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      flkty.next();
    }
  };
  carouselEl.addEventListener('keydown', onKeyDown);
  cleanupCallbacks.push(() => carouselEl.removeEventListener('keydown', onKeyDown));

  // Initialisation immédiate et calibrée
  updateSelectedA11y();
  equalizeHeights();

  // Recalcul quand les images ou les polices finissent de charger
  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', equalizeHeights, { once: true });
  });
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (flkty) equalizeHeights();
    });
  }

  // Recalcul au redimensionnement
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(equalizeHeights, 150);
  };
  window.addEventListener('resize', onResize);
  cleanupCallbacks.push(() => {
    window.removeEventListener('resize', onResize);
    clearTimeout(resizeTimer);
  });
}