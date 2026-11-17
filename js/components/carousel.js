import { createProjectCardHTML } from './project-card.js';

const TRANSITION_MS = 450; // doit correspondre à la transition CSS de width

let flkty = null;
let resizeHandler = null;
let rafId = null;

function destroyCarousel() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (flkty) {
    flkty.destroy();
    flkty = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
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
    <div class="carousel" role="region" aria-label="Carrousel des projets">
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
  const track = container.querySelector('#carousel-track');
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');

  // Flickity est chargé en script classique (variable globale)
  flkty = new Flickity(track, {
    cellAlign: 'center',     // la carte active est centrée
    wrapAround: true,        // boucle infinie
    contain: false,
    pageDots: false,
    prevNextButtons: false,  // on garde les boutons glass
    draggable: true,
    percentPosition: false,
    adaptiveHeight: false,
  });

  prevBtn.addEventListener('click', () => flkty.previous());
  nextBtn.addEventListener('click', () => flkty.next());

  // Égalise les hauteurs : mesure faite avec toutes les cartes à la largeur
  // "normale" (la plus étroite, donc la plus haute), sans animation parasite.
  const equalizeHeights = () => {
    if (!flkty) return;
    const slides = [...track.querySelectorAll('.carousel__slide')];

    track.classList.add('is-measuring', 'no-transition');
    slides.forEach((s) => (s.style.height = 'auto'));
    const max = Math.max(...slides.map((s) => s.offsetHeight));
    slides.forEach((s) => (s.style.height = `${max}px`));
    track.classList.remove('is-measuring');
    void track.offsetWidth;                  // applique l'état sans transition
    track.classList.remove('no-transition');

    flkty.resize();
  };

  // Pendant la transition de largeur, Flickity doit recalculer les positions
  // à chaque image, sinon les voisines ne s'écartent pas.
  const followAnimation = () => {
    if (rafId) cancelAnimationFrame(rafId);
    const end = performance.now() + TRANSITION_MS + 80;
    const tick = () => {
      if (!flkty) return;
      flkty.reposition();
      if (performance.now() < end) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        flkty.resize();
      }
    };
    rafId = requestAnimationFrame(tick);
  };

  flkty.on('select', followAnimation);

  equalizeHeights();
  followAnimation(); // anime la largeur de la 1re carte dès l'init

  // Recalcul quand les images finissent de charger
  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', equalizeHeights, { once: true });
  });

  // Recalcul au redimensionnement (le texte passe à la ligne différemment)
  let t;
  resizeHandler = () => {
    clearTimeout(t);
    t = setTimeout(equalizeHeights, 150);
  };
  window.addEventListener('resize', resizeHandler);
}