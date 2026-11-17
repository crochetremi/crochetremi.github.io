import { createProjectCardHTML } from './project-card.js';

let destroyActiveCarousel = null;

function destroyCarousel() {
  if (typeof destroyActiveCarousel === 'function') {
    destroyActiveCarousel();
    destroyActiveCarousel = null;
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

  // Plus de 4 projets : carrousel infini à moteur unifié
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

  destroyActiveCarousel = setupCarousel(container);
}

function setupCarousel(container) {
  const carouselEl = container.querySelector('.carousel');
  const track = container.querySelector('#carousel-track');
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');
  const slides = [...track.querySelectorAll('.carousel__slide')];
  const count = slides.length;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Métriques résolues depuis les variables CSS
  let baseWidth = 320;
  let focusWidth = 480;
  let extraWidth = 160;
  let gap = 24;
  let step = 344;

  // État continu du ressort (en unités d'index de tuile)
  let pos = 0;
  let targetPos = 0;
  let velocity = 0;
  let selectedIndex = 0;
  let rafId = null;
  let lastTime = 0;

  // Constantes physiques (ressort critique fluide, sans rebond parasite)
  const STIFFNESS = 175;
  const DAMPING = 25;

  const mod = (n, m) => ((n % m) + m) % m;

  // Distance circulaire signée la plus courte entre pos et l'index i dans [-count/2, count/2]
  const shortestDelta = (index, currentPos) => {
    const half = count / 2;
    return mod(index - currentPos + half, count) - half;
  };

  // Courbe d'élargissement C² continue sur [-1, 1] :
  // f(0) = 1, f(±1) = 0, et f(Δ) + f(Δ - 1) = 1 (somme des largeurs invariante)
  const focusWeight = (delta) => {
    const ad = Math.abs(delta);
    if (ad >= 1) return 0;
    return 0.5 * (1 + Math.cos(Math.PI * delta));
  };

  // Intégrale analytique de focusWeight(u) de 0 à delta pour positionner les voisines sans dérive
  const focusIntegral = (delta) => {
    if (delta >= 1) return 0.5;
    if (delta <= -1) return -0.5;
    return 0.5 * delta + Math.sin(Math.PI * delta) / (2 * Math.PI);
  };

  const updateSelectionClasses = (nextIdx) => {
    selectedIndex = mod(nextIdx, count);
    slides.forEach((slide, i) => {
      const isSelected = i === selectedIndex;
      slide.classList.toggle('is-selected', isSelected);
      if (isSelected) {
        slide.setAttribute('aria-current', 'true');
      } else {
        slide.removeAttribute('aria-current');
      }
    });
  };

  // Applique géométrie exacte (largeur + translate3d) à toutes les tuiles en une passe
  const renderFrame = () => {
    for (let i = 0; i < count; i++) {
      const delta = shortestDelta(i, pos);
      const w = baseWidth + extraWidth * focusWeight(delta);
      const centerX = delta * step + extraWidth * focusIntegral(delta);
      const leftX = centerX - w * 0.5;

      const slide = slides[i];
      slide.style.width = `${w.toFixed(2)}px`;
      slide.style.transform = `translate3d(${leftX.toFixed(2)}px, 0, 0)`;
    }
  };

  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    track.classList.remove('is-animating');
  };

  const tick = (now) => {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.032) : 1 / 60;
    lastTime = now;

    if (prefersReducedMotion.matches) {
      pos = targetPos;
      velocity = 0;
      renderFrame();
      stopLoop();
      return;
    }

    const displacement = targetPos - pos;
    const force = displacement * STIFFNESS - velocity * DAMPING;
    velocity += force * dt;
    pos += velocity * dt;

    renderFrame();

    if (Math.abs(displacement) < 0.0004 && Math.abs(velocity) < 0.0004) {
      pos = targetPos;
      velocity = 0;
      renderFrame();
      stopLoop();
    } else {
      rafId = requestAnimationFrame(tick);
    }
  };

  const startLoop = () => {
    if (rafId !== null) return;
    lastTime = 0;
    track.classList.add('is-animating');
    rafId = requestAnimationFrame(tick);
  };

  const goTo = (nextTarget) => {
    targetPos = nextTarget;
    updateSelectionClasses(Math.round(targetPos));
    startLoop();
  };

  const stepBy = (dir) => {
    goTo(Math.round(targetPos) + dir);
  };

  // Mesure les dimensions CSS résolues et égalise la hauteur des tuiles
  const measureLayout = () => {
    track.classList.add('is-measuring');

    gap = parseFloat(getComputedStyle(slides[0]).marginRight) || 24;

    slides.forEach((s) => {
      s.style.width = '';
      s.style.height = 'auto';
    });

    baseWidth = slides[0].getBoundingClientRect().width;

    slides[0].classList.add('is-measuring-focus');
    focusWidth = slides[0].getBoundingClientRect().width;
    slides[0].classList.remove('is-measuring-focus');

    extraWidth = Math.max(0, focusWidth - baseWidth);
    step = baseWidth + gap;

    const maxHeight = Math.max(...slides.map((s) => s.offsetHeight));
    slides.forEach((s) => {
      s.style.height = `${maxHeight}px`;
    });
    track.style.height = `${maxHeight}px`;

    track.classList.remove('is-measuring');
    renderFrame();
  };

  // Navigation boutons
  const onPrev = () => stepBy(-1);
  const onNext = () => stepBy(1);
  prevBtn.addEventListener('click', onPrev);
  nextBtn.addEventListener('click', onNext);

  // Navigation clavier
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepBy(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepBy(1);
    }
  };
  carouselEl.addEventListener('keydown', onKeyDown);

  // Navigation trackpad / défilement horizontal
  let wheelLockUntil = 0;
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
    e.preventDefault();
    const now = performance.now();
    if (now < wheelLockUntil) return;
    wheelLockUntil = now + 260;
    stepBy(e.deltaX > 0 ? 1 : -1);
  };
  track.addEventListener('wheel', onWheel, { passive: false });

  // Glisser interactif (souris + tactile) avec mise au focus progressive sous le doigt
  let isPointerDown = false;
  let isDragging = false;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let dragStartPos = 0;
  let lastMoveX = 0;
  let lastMoveTime = 0;
  let dragVelocity = 0;
  let suppressNextClick = false;

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isPointerDown = true;
    isDragging = false;
    pointerId = e.pointerId;
    startX = lastMoveX = e.clientX;
    startY = e.clientY;
    lastMoveTime = performance.now();
    dragStartPos = pos;
    dragVelocity = 0;
  };

  const onPointerMove = (e) => {
    if (!isPointerDown || e.pointerId !== pointerId) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isDragging) {
      if (Math.hypot(dx, dy) < 6) return;
      // Laisse défiler la page verticalement sur écran tactile
      if (Math.abs(dy) > Math.abs(dx)) {
        isPointerDown = false;
        return;
      }
      isDragging = true;
      suppressNextClick = true;
      stopLoop();
      track.classList.add('is-dragging');
      track.setPointerCapture(pointerId);
    }

    e.preventDefault();
    const now = performance.now();
    const dt = Math.max((now - lastMoveTime) / 1000, 0.001);
    const instantVel = -((e.clientX - lastMoveX) / step) / dt;
    dragVelocity = dragVelocity * 0.65 + instantVel * 0.35;

    lastMoveX = e.clientX;
    lastMoveTime = now;

    pos = dragStartPos - dx / step;
    targetPos = pos;
    updateSelectionClasses(Math.round(pos));
    renderFrame();
  };

  const endDrag = (e) => {
    if (!isPointerDown || e.pointerId !== pointerId) return;
    isPointerDown = false;

    if (isDragging) {
      isDragging = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId);
      }

      // Projection inertielle douce vers la tuile cible
      const projected = pos + dragVelocity * 0.16;
      velocity = dragVelocity;
      goTo(Math.round(projected));
    }
  };

  const onDragStart = (e) => e.preventDefault();

  // Clic sur une tuile latérale : la place au centre ; clic sur la tuile active : ouvre son lien
  const onTrackClick = (e) => {
    if (suppressNextClick) {
      suppressNextClick = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const slide = e.target.closest('.carousel__slide');
    if (!slide) return;

    const clickedIndex = slides.indexOf(slide);
    if (clickedIndex !== -1 && clickedIndex !== selectedIndex) {
      e.preventDefault();
      e.stopPropagation();
      const delta = shortestDelta(clickedIndex, Math.round(targetPos));
      goTo(Math.round(targetPos) + delta);
    }
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove);
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('dragstart', onDragStart);
  track.addEventListener('click', onTrackClick, true);

  // Initialisation et recalculs
  updateSelectionClasses(0);
  measureLayout();

  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', measureLayout, { once: true });
  });
  if (document.fonts?.ready) {
    document.fonts.ready.then(measureLayout);
  }

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureLayout, 120);
  };
  window.addEventListener('resize', onResize);

  return () => {
    stopLoop();
    clearTimeout(resizeTimer);
    prevBtn.removeEventListener('click', onPrev);
    nextBtn.removeEventListener('click', onNext);
    carouselEl.removeEventListener('keydown', onKeyDown);
    track.removeEventListener('wheel', onWheel);
    track.removeEventListener('pointerdown', onPointerDown);
    track.removeEventListener('pointermove', onPointerMove);
    track.removeEventListener('pointerup', endDrag);
    track.removeEventListener('pointercancel', endDrag);
    track.removeEventListener('dragstart', onDragStart);
    track.removeEventListener('click', onTrackClick, true);
    window.removeEventListener('resize', onResize);
  };
}