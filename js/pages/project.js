import * as projectsModule from '../../data/projects.js';

// Récupère le tableau quel que soit le nom de ton export (projects, projectsData, default)
const projectsList =
  projectsModule.projects ||
  projectsModule.projectsData ||
  projectsModule.default ||
  [];

function escapeHTML(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderProjectDetail() {
  const container = document.getElementById('project-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  const project = projectsList.find(
    (item) => String(item.id) === String(projectId)
  );

  if (!project) {
    document.title = 'Projet introuvable — Rémi Crochet';
    container.innerHTML = `
      <section class="project-error glass-card">
        <h1>Projet introuvable</h1>
        <p>Le projet demandé n'existe pas ou son identifiant est invalide.</p>
        <a href="./index.html" class="project-card__link">
          <span aria-hidden="true">←</span> Retour à l'accueil
        </a>
      </section>
    `;
    return;
  }

  document.title = `${project.title} — Rémi Crochet`;

  const tagsHtml = (project.tags || [])
    .map((tag) => `<span class="project-tag">${escapeHTML(tag)}</span>`)
    .join('');

  const objectivesHtml = (project.objectives || [])
    .map((obj) => `<li>${escapeHTML(obj)}</li>`)
    .join('');

  const detailsHtml = (project.details || [])
    .map((step) => `<li>${escapeHTML(step)}</li>`)
    .join('');

  container.innerHTML = `
    <nav class="project-breadcrumb" aria-label="Fil d'Ariane">
      <a href="./index.html" class="project-card__link">
        <span aria-hidden="true">←</span> Retour aux projets
      </a>
    </nav>

    <article class="project-detail glass-card">
      <header class="project-detail__header">
        <div class="project-detail__media">
          <img src="${escapeHTML(project.image)}"
               alt="${escapeHTML(project.imageAlt || project.title)}"
               class="project-detail__img">
        </div>
        <div class="project-detail__intro">
          <p class="project-card__meta">
            ${escapeHTML(project.category)} • ${escapeHTML(project.displayDate)}
          </p>
          <h1 class="project-detail__title">${escapeHTML(project.title)}</h1>
          <p class="project-detail__desc">${escapeHTML(project.description)}</p>
          ${tagsHtml ? `<div class="project-detail__tags">${tagsHtml}</div>` : ''}
        </div>
      </header>

      <div class="project-detail__body">
        ${project.context ? `
          <section class="project-detail__section">
            <h2>Contexte & Enjeux</h2>
            <p>${escapeHTML(project.context)}</p>
          </section>
        ` : ''}

        ${objectivesHtml ? `
          <section class="project-detail__section">
            <h2>Objectifs</h2>
            <ul class="project-detail__list">${objectivesHtml}</ul>
          </section>
        ` : ''}

        ${detailsHtml ? `
          <section class="project-detail__section">
            <h2>Réalisations techniques</h2>
            <ul class="project-detail__list">${detailsHtml}</ul>
          </section>
        ` : ''}
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', renderProjectDetail);