import { createProjectCardHTML } from './project-card.js';

let flkty = null;
let resizeHandler = null;

function destroyCarousel() {
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
  contain: false,          // sinon la 1re carte resterait collée à gauche
  pageDots: false,
  prevNextButtons: false,
  draggable: true,
  percentPosition: false,
  adaptiveHeight: false,
  });

  prevBtn.addEventListener('click', () => flkty.previous());
  nextBtn.addEventListener('click', () => flkty.next());

  // Cartes de même hauteur (Flickity n'étire pas les cellules)
  const equalizeHeights = () => {
    if (!flkty) return;
    const slides = [...track.querySelectorAll('.carousel__slide')];
    slides.forEach((s) => (s.style.height = 'auto'));
    const max = Math.max(...slides.map((s) => s.offsetHeight));
    slides.forEach((s) => (s.style.height = `${max}px`));
    flkty.resize();
  };

  equalizeHeights();

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