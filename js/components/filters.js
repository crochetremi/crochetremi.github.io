export function renderFilters(container, categories, onFilterChange) {
  if (!container) return;

  const categoryOptions = categories.map(
    (cat) => `<option value="${cat}">${cat}</option>`
  ).join('');

  container.innerHTML = `
    <div class="filters-bar__search">
      <svg class="filters-bar__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="search"
             id="search-input"
             class="filters-bar__input"
             placeholder="Rechercher un projet…"
             aria-label="Rechercher un projet par titre ou description">
    </div>

    <div class="filters-bar__controls">
      <select id="sort-select" class="filters-bar__select" aria-label="Trier les projets">
        <option value="featured">À la une</option>
        <option value="newest">Plus récents</option>
        <option value="oldest">Plus anciens</option>
      </select>

      <select id="category-select" class="filters-bar__select" aria-label="Filtrer par catégorie">
        <option value="all">Toutes les catégories</option>
        ${categoryOptions}
      </select>
    </div>
  `;

  const searchInput = container.querySelector('#search-input');
  const sortSelect = container.querySelector('#sort-select');
  const categorySelect = container.querySelector('#category-select');

  const emitChange = () => {
    onFilterChange({
      query: searchInput.value.trim().toLowerCase(),
      sort: sortSelect.value,
      category: categorySelect.value
    });
  };

  searchInput.addEventListener('input', emitChange);
  sortSelect.addEventListener('change', emitChange);
  categorySelect.addEventListener('change', emitChange);
}