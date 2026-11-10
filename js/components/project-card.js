export function createProjectCardHTML(project) {
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
        <a href="${project.link}"
           class="project-card__link"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="${project.linkLabel} : ${project.title}">
          ${project.linkLabel}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `;
}