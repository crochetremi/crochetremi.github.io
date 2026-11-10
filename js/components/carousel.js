import { createProjectCardHTML } from './project-card.js';

export function renderProjectsShowcase(container, projects) {
  if (!container) return;

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

  // Plus de 4 projets : Carrousel horizontal avec boucle infinie
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
      <div class="carousel__track" id="carousel-track" tabindex="0" aria-label="Liste déroulante des projets">
        ${projects.map((p) => `<div class="carousel__slide">${createProjectCardHTML(p)}</div>`).join('')}
      </div>
    </div>
  `;

  setupCarouselInteractions(container);
}

function setupCarouselInteractions(container) {
  const track = container.querySelector('#carousel-track');
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');

  const getStepWidth = () => {
    const firstSlide = track.querySelector('.carousel__slide');
    if (!firstSlide) return 300;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const scrollNext = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    // Boucle vers le début si on est à la fin
    if (track.scrollLeft >= maxScroll - 8) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: getStepWidth(), behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    // Boucle vers la fin si on est au tout début
    if (track.scrollLeft <= 8) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -getStepWidth(), behavior: 'smooth' });
    }
  };

  nextBtn.addEventListener('click', scrollNext);
  prevBtn.addEventListener('click', scrollPrev);

  // Navigation clavier sur la piste
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    }
  });

  // Glisser à la souris (le tactile est géré nativement par scroll-snap)
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;
  });

  const stopDragging = () => {
    isDown = false;
    track.classList.remove('is-dragging');
  };

  track.addEventListener('mouseleave', stopDragging);
  track.addEventListener('mouseup', stopDragging);

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeftStart - walk;
  });
}