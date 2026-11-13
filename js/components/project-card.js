export function createProjectCardHTML(project) {
  const href = project.link || `./project.html?id=${project.id}`;
  const isExternal = href.startsWith('http');
  const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
  const label = project.linkLabel || 'Détails sur demande';

  return `
    <article class="project-card glass-card">
      <div class="project-card__media">
        <img src="${project.image}"
             alt="${project.imageAlt}"
             class="project-card__img"
             loading="lazy">
      </div>
      <div class="project-card__body">
        <p class="project-card__meta">${project.category} • ${project.displayDate}</p>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.description}</p>
        <a href="${href}"
           class="project-card__link"
           ${targetAttr}
           aria-label="${label} : ${project.title}">
          ${label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `;
}