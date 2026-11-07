import { getExercises } from '../api/energyApi.js';
import { FILTER_TYPES } from '../constants/index.js';
import { showLoader, hideLoader } from '../helpers/loader.js';
import { createPagination } from '../pagination.js';
import {
  createExerciseCardMarkup,
  openExerciseModal,
} from './exercise-card.js';

const EXERCISE_PARAMS = {
  [FILTER_TYPES.MUSCLES]: 'muscles',
  [FILTER_TYPES.BODY_PARTS]: 'bodypart',
  [FILTER_TYPES.EQUIPMENT]: 'equipment',
};

const DIRECT_PARAMS = new Set(Object.values(EXERCISE_PARAMS));
const TABLET = '(min-width: 768px)';

const state = {
  param: '',
  category: '',
  keyword: '',
  page: 1,
};

let requestSeq = 0;
const shown = { page: 1, totalPages: 0, keyword: '' };

function exerciseParam(filter) {
  if (EXERCISE_PARAMS[filter]) return EXERCISE_PARAMS[filter];
  if (DIRECT_PARAMS.has(filter)) return filter;
  return '';
}

function titleCase(value) {
  return String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPerPage() {
  return window.matchMedia(TABLET).matches ? 10 : 8;
}

export function initExercises() {
  const section = document.querySelector('.exercises');
  if (!section) return;

  const crumb = document.querySelector('.categories__crumb');
  const form = document.querySelector('.exercises__form');
  const input = document.querySelector('.exercises__input');
  const clear = document.querySelector('.exercises__clear');
  const list = section.querySelector('.exercises__list');
  const empty = section.querySelector('.exercises__empty');
  const pagination = section.querySelector('.pagination');
  if (!form || !input || !clear || !list || !empty) return;

  const tablet = window.matchMedia(TABLET);

  const syncClear = () => {
    clear.classList.toggle('is-hidden', input.value.trim() === '');
  };

  input.addEventListener('input', syncClear);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!state.param) return;
    state.keyword = input.value.trim();
    input.value = state.keyword;
    state.page = 1;
    syncClear();
    loadExercises();
  });

  clear.addEventListener('click', () => {
    const hadKeyword = state.keyword !== '';
    input.value = '';
    state.keyword = '';
    state.page = 1;
    syncClear();
    input.focus();
    if (hadKeyword && state.param) loadExercises();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-exercise-start]');
    if (!button) return;
    openExerciseModal(button.dataset.id);
  });

  tablet.addEventListener('change', () => {
    if (section.classList.contains('is-hidden') || !state.param) return;
    state.page = 1;
    loadExercises();
  });

  document.addEventListener('category:selected', (event) => {
    const detail = event.detail ?? {};
    const category = String(detail.name ?? detail.category ?? '')
      .trim()
      .toLowerCase();
    const param = exerciseParam(detail.filter);
    if (!category || !param) return;

    state.param = param;
    state.category = category;
    state.keyword = '';
    state.page = 1;
    input.value = '';
    syncClear();
    if (crumb) crumb.textContent = titleCase(category);
    section.classList.remove('is-hidden');
    loadExercises();
  });

  document.addEventListener('filter:changed', () => {
    section.classList.add('is-hidden');
  });

  async function loadExercises() {
    const seq = ++requestSeq;
    // Старі картки лишаються під лоадером до приходу нових,
    // інакше сторінка складається і інтерфейс стрибає.
    showLoader();

    try {
      const data = await getExercises({
        [state.param]: state.category,
        keyword: state.keyword,
        page: state.page,
        limit: getPerPage(),
      });
      if (seq !== requestSeq) return;

      render(data.results ?? []);
      updatePagination(data.totalPages);
      shown.page = state.page;
      shown.totalPages = Number(data.totalPages) || 0;
      shown.keyword = state.keyword;
    } catch {
      if (seq !== requestSeq) return;
      if (!list.children.length) {
        render([]);
        updatePagination(0);
        return;
      }

      state.page = shown.page;
      state.keyword = shown.keyword;
      input.value = shown.keyword;
      syncClear();
      updatePagination(shown.totalPages);
    } finally {
      if (seq === requestSeq) hideLoader();
    }
  }

  function updatePagination(totalPages) {
    createPagination({
      container: pagination,
      totalPages,
      currentPage: state.page,
      onChange: (page) => {
        state.page = page;
        loadExercises();
      },
    });
  }

  function render(items) {
    if (!items.length) {
      list.innerHTML = '';
      empty.classList.remove('is-hidden');
      return;
    }

    empty.classList.add('is-hidden');
    list.innerHTML = items
      .map((exercise) => createExerciseCardMarkup(exercise, 'home'))
      .join('');
  }
}
