import { initTheme } from './core/theme.js';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { siteData } from '../data/site.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderNavbar(document.getElementById('navbar-root'), siteData);
  renderFooter(document.getElementById('footer-root'), siteData);
});