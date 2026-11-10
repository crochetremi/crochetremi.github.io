import { siteData } from '../../data/site.js';
import { projectsData } from '../../data/projects.js';
import { renderFilters } from '../components/filters.js';
import { renderProjectsShowcase } from '../components/carousel.js';

function renderHero(container, data) {
  if (!container) return;
  container.style.backgroundImage = `url('${data.heroBackground}')`;
  container.innerHTML = `
    <div class="hero__content">
      <img src="${data.avatar}" alt="${data.avatarAlt}" class="hero__avatar">
      <h1 class="hero__title">${data.fullName}</h1>
      <p class="hero__subtitle">${data.role}</p>
    </div>
  `;
}

function getUniqueCategories(projects) {
  return [...new Set(projects.map((p) => p.category))];
}

function filterAndSortProjects(projects, { query, sort, category }) {
  const filtered = projects.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    const matchesQuery =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return filtered.sort((a, b) => {
    if (sort === 'newest') return b.isoDate.localeCompare(a.isoDate);
    if (sort === 'oldest') return a.isoDate.localeCompare(b.isoDate);
    // 'featured' : met les projets "featured" en premier, puis par date
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.isoDate.localeCompare(a.isoDate);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const heroRoot = document.getElementById('hero-root');
  const filtersRoot = document.getElementById('filters-root');
  const projectsRoot = document.getElementById('projects-root');

  renderHero(heroRoot, siteData);

  const categories = getUniqueCategories(projectsData);
  const initialState = { query: '', sort: 'featured', category: 'all' };

  const updateView = (filterState) => {
    const list = filterAndSortProjects(projectsData, filterState);
    renderProjectsShowcase(projectsRoot, list);
  };

  renderFilters(filtersRoot, categories, updateView);
  updateView(initialState);
});