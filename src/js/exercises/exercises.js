import { getExercises } from '../api/energyApi.js';
import { showLoader, hideLoader } from '../helpers/loader.js';
import { createPagination } from '../pagination.js';
import {
  createExerciseCardMarkup,
  openExerciseModal,
} from './exercise-card.js';

const TABLET = '(min-width: 768px)';

const state = {
  param: '',
  category: '',
  keyword: '',
  page: 1,
};

let requestSeq = 0;

function getPerPage() {
  return window.matchMedia(TABLET).matches ? 10 : 8;
}

export function initExercises() {
  const section = document.querySelector('.exercises');
  if (!section) return;

  const crumb = section.querySelector('.exercises__crumb');
  const form = section.querySelector('.exercises__form');
  const input = section.querySelector('.exercises__input');
  const clear = section.querySelector('.exercises__clear');
  const list = section.querySelector('.exercises__list');
  const empty = section.querySelector('.exercises__empty');
  const pagination = section.querySelector('.pagination');
  if (!crumb || !form || !input || !clear || !list || !empty) return;

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
    if (!state.param) return;
    state.page = 1;
    loadExercises();
  });

  // Мокап: видалити після імплементації фільтрів.
  state.param = 'bodypart';
  state.category = 'waist';
  crumb.textContent = 'Waist';
  section.classList.remove('is-hidden');
  loadExercises();

  async function loadExercises() {
    const seq = ++requestSeq;
    showLoader();
    list.innerHTML = '';
    empty.classList.add('is-hidden');

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
    } catch {
      if (seq !== requestSeq) return;
      render([]);
      updatePagination(0);
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
      empty.classList.remove('is-hidden');
      return;
    }

    empty.classList.add('is-hidden');
    list.innerHTML = items
      .map((exercise) => createExerciseCardMarkup(exercise, 'home'))
      .join('');
  }
}
