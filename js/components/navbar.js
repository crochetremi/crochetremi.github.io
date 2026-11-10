import { getActiveTheme, toggleTheme } from '../core/theme.js';

const ICONS = {
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  burger: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
};

function isCurrentPage(href) {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page === href;
}

export function renderNavbar(container, siteData) {
  if (!container) return;

  const linksHtml = siteData.navigation.map((item) => {
    const current = isCurrentPage(item.href) ? 'aria-current="page"' : '';
    return `<li><a href="./${item.href}" class="navbar__link" ${current}>${item.label}</a></li>`;
  }).join('');

  container.innerHTML = `
    <div class="container">
      <nav class="navbar glass-pill" aria-label="Navigation principale">
        <a href="./index.html" class="navbar__brand">${siteData.fullName}</a>

        <div class="navbar__actions">
          <ul class="navbar__menu">${linksHtml}</ul>

          <a href="${siteData.linkedin.url}"
             class="navbar__icon-btn glass-pill"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Profil LinkedIn (nouvel onglet)">
            ${ICONS.linkedin}
          </a>

          <button type="button"
                  id="theme-toggle-btn"
                  class="navbar__icon-btn glass-pill"
                  aria-label="Basculer le thème clair ou sombre">
            ${getActiveTheme() === 'dark' ? ICONS.sun : ICONS.moon}
          </button>

          <button type="button"
                  id="mobile-menu-btn"
                  class="navbar__icon-btn navbar__burger glass-pill"
                  aria-expanded="false"
                  aria-controls="mobile-dropdown"
                  aria-label="Ouvrir le menu de navigation">
            ${ICONS.burger}
          </button>
        </div>
      </nav>

      <div id="mobile-dropdown" class="navbar__dropdown glass-panel" data-open="false">
        <ul class="navbar__mobile-list">${linksHtml}</ul>
      </div>
    </div>
  `;

  const themeBtn = container.querySelector('#theme-toggle-btn');
  const updateThemeButton = (theme) => {
    themeBtn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    themeBtn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'
    );
  };

  updateThemeButton(getActiveTheme());
  themeBtn.addEventListener('click', () => updateThemeButton(toggleTheme()));
  window.addEventListener('themechange', (e) => updateThemeButton(e.detail.theme));

  const burgerBtn = container.querySelector('#mobile-menu-btn');
  const dropdown = container.querySelector('#mobile-dropdown');

  burgerBtn.addEventListener('click', () => {
    const isOpen = dropdown.getAttribute('data-open') === 'true';
    dropdown.setAttribute('data-open', String(!isOpen));
    burgerBtn.setAttribute('aria-expanded', String(!isOpen));
  });
}