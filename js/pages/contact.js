import { siteData } from '../../data/site.js';
import { getActiveTheme } from '../core/theme.js';

function loadLinkedInBadgeScript() {
  const existing = document.getElementById('linkedin-badge-script');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = 'linkedin-badge-script';
  script.src = 'https://platform.linkedin.com/badges/js/profile.js';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

function renderContact(container, site) {
  if (!container) return;

  const badgeTheme = getActiveTheme() === 'dark' ? 'dark' : 'light';

  container.innerHTML = `
    <section class="contact-card glass-panel" aria-labelledby="contact-heading">
      <img src="${site.avatar}" alt="${site.avatarAlt}" class="contact-card__avatar">
      <div>
        <h1 id="contact-heading" class="contact-card__title">${site.fullName}</h1>
        <p class="contact-card__subtitle">${site.role}</p>
      </div>

      <div class="linkedin-badge-wrapper">
        <div class="badge-base LI-profile-badge"
             data-locale="${site.linkedin.locale}"
             data-size="large"
             data-theme="${badgeTheme}"
             data-type="HORIZONTAL"
             data-vanity="${site.linkedin.vanityName}"
             data-version="v1">
          <a class="badge-base__link LI-simple-link sr-only"
             href="${site.linkedin.url}"
             target="_blank"
             rel="noopener noreferrer">
            ${site.fullName}
          </a>
        </div>
        <p class="linkedin-fallback-note">
          Aperçu du profil LinkedIn (identifiant : <code>${site.linkedin.vanityName}</code>)
        </p>
      </div>

      <a href="${site.linkedin.url}"
         class="btn-primary"
         target="_blank"
         rel="noopener noreferrer">
        ${site.linkedin.ctaLabel}
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  `;

  loadLinkedInBadgeScript();
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('contact-root');
  renderContact(root, siteData);

  window.addEventListener('themechange', () => {
    renderContact(root, siteData);
  });
});