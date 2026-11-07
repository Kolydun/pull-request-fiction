import { getFilters } from './api/energyApi.js';
import { FILTER_TYPES } from './constants/index.js';
import { showLoader, hideLoader } from './helpers/loader.js';
import { createPagination } from './pagination.js';

const TABLET = '(min-width: 768px)';

const state = {
  filter: FILTER_TYPES.MUSCLES,
  page: 1,
  isCategorySelected: false,
};

let requestSeq = 0;

function getLimit() {
  return window.matchMedia(TABLET).matches ? 12 : 9;
}

function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function createCategoryMarkup({ filter, name, imgURL }) {
  return `
    <li class="categories__item">
      <button
        class="categories__card"
        type="button"
        data-filter="${filter}"
        data-name="${name}"
      >
        <img class="categories__img" src="${imgURL}" alt="" loading="lazy" />
        <span class="categories__name">${name}</span>
        <span class="categories__type">${filter}</span>
      </button>
    </li>
  `;
}

export function initCategories() {
  const section = document.querySelector('.categories');
  if (!section) return;

  const crumb = section.querySelector('.categories__crumb');
  const search = section.querySelector('.exercises__form');
  const filters = section.querySelector('.categories__filters');
  const list = section.querySelector('.categories__list');
  const empty = section.querySelector('.categories__empty');
  const pagination = section.querySelector('.categories__pagination');
  if (!crumb || !filters || !list || !empty || !pagination) return;

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;

    const { filter } = button.dataset;
    if (filter === state.filter && !state.isCategorySelected) return;

    state.filter = filter;
    state.page = 1;
    setActiveFilter(button);
    showCategories();
    emit('filter:changed', { filter });
    loadCategories();
  });

  list.addEventListener('click', (event) => {
    const card = event.target.closest('.categories__card');
    if (!card) return;

    const { filter, name } = card.dataset;
    hideCategories(name);
    emit('category:selected', { filter, name });
  });

  window.matchMedia(TABLET).addEventListener('change', () => {
    if (state.isCategorySelected) return;
    state.page = 1;
    loadCategories();
  });

  loadCategories();

  function setActiveFilter(activeButton) {
    filters.querySelectorAll('[data-filter]').forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function hideCategories(name) {
    state.isCategorySelected = true;
    crumb.textContent = name;
    search?.classList.remove('is-hidden');
    list.classList.add('is-hidden');
    empty.classList.add('is-hidden');
    pagination.classList.add('is-hidden');
  }

  function showCategories() {
    state.isCategorySelected = false;
    crumb.textContent = '';
    search?.classList.add('is-hidden');
    list.classList.remove('is-hidden');
    pagination.classList.remove('is-hidden');
  }

  async function loadCategories() {
    const seq = ++requestSeq;
    showLoader();
    list.innerHTML = '';
    empty.classList.add('is-hidden');

    try {
      const data = await getFilters({
        filter: state.filter,
        page: state.page,
        limit: getLimit(),
      });
      if (seq !== requestSeq) return;

      render(data.results ?? []);
      updatePagination(data.totalPages);
    } catch {
      if (seq !== requestSeq) return;
      render([]);
      updatePagination(0);
    } finally {
      if (seq === requestSeq) hideLoader();
    }
  }

  function render(items) {
    if (!items.length) {
      empty.classList.remove('is-hidden');
      return;
    }

    const markup = items.map(createCategoryMarkup).join('');
    list.insertAdjacentHTML('beforeend', markup);
  }

  function updatePagination(totalPages) {
    createPagination({
      container: pagination,
      totalPages,
      currentPage: state.page,
      onChange: (page) => {
        state.page = page;
        loadCategories();
      },
    });
  }
}
