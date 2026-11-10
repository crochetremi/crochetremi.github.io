import { siteData } from '../../data/site.js';
import { cvData } from '../../data/cv.js';

function renderCV(container, site, cv) {
  if (!container) return;

  const experiencesHTML = cv.experiences.map((exp) => `
    <article class="timeline__item">
      <p class="timeline__period">${exp.period}</p>
      <h3 class="timeline__role">${exp.role}</h3>
      <p class="timeline__org">${exp.organization} • ${exp.location}</p>
      <p class="timeline__desc">${exp.description}</p>
    </article>
  `).join('');

  const educationHTML = cv.education.map((edu) => `
    <article class="timeline__item">
      <p class="timeline__period">${edu.period}</p>
      <h3 class="timeline__role">${edu.degree}</h3>
      <p class="timeline__org">${edu.school} • ${edu.location}</p>
      <p class="timeline__desc">${edu.details}</p>
    </article>
  `).join('');

  const skillsHTML = cv.skills.map((group) => `
    <div class="skills-group">
      <h3 class="skills-group__title">${group.category}</h3>
      <ul class="tag-list">
        ${group.items.map((item) => `<li class="tag">${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const languagesHTML = cv.languages.map((lang) => `
    <li class="lang-item">
      <span>${lang.name}</span>
      <span class="lang-item__level">${lang.level}</span>
    </li>
  `).join('');

  container.innerHTML = `
    <section class="cv-header glass-panel" aria-label="En-tête du CV">
      <div class="cv-header__info">
        <h1 class="cv-header__title">${site.fullName}</h1>
        <p class="cv-header__role">${site.role}</p>
        <p class="cv-header__summary">${cv.profileSummary}</p>
      </div>
      <div>
        <a href="${cv.pdfUrl}" class="btn-primary" download>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          ${cv.pdfButtonLabel}
        </a>
      </div>
    </section>

    <div class="cv-grid">
      <div>
        <section class="cv-section glass-panel" aria-labelledby="exp-heading">
          <h2 id="exp-heading" class="cv-section__title">Expériences professionnelles</h2>
          <div class="timeline">${experiencesHTML}</div>
        </section>

        <section class="cv-section glass-panel" aria-labelledby="edu-heading">
          <h2 id="edu-heading" class="cv-section__title">Formations</h2>
          <div class="timeline">${educationHTML}</div>
        </section>
      </div>

      <aside>
        <section class="cv-section glass-panel" aria-labelledby="skills-heading">
          <h2 id="skills-heading" class="cv-section__title">Compétences</h2>
          ${skillsHTML}
        </section>

        <section class="cv-section glass-panel" aria-labelledby="lang-heading">
          <h2 id="lang-heading" class="cv-section__title">Langues</h2>
          <ul class="lang-list">${languagesHTML}</ul>
        </section>
      </aside>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCV(document.getElementById('cv-root'), siteData, cvData);
});