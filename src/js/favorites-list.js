import { createPagination } from './pagination.js';
import { createExerciseCardMarkup } from './exercises/exercise-card.js';

// Брейкпоінти з src/css/common/variables.css.
const TABLET = '(min-width: 768px)';
const DESKTOP = '(min-width: 1440px)';

// Ключ localStorage з issue #3 (контракти).
const STORAGE_KEY = 'yourEnergy.favorites';

export function initFavoritesList() {
  const section = document.querySelector('.favorites');
  if (!section) return;

  const list = section.querySelector('.favorites__list');
  const empty = section.querySelector('.favorites__empty');
  const pagination = section.querySelector('.pagination');
  if (!list || !empty || !pagination) return;

  const tablet = window.matchMedia(TABLET);
  const desktop = window.matchMedia(DESKTOP);

  let page = 1;

  // За Figma: mobile 8 вправ на сторінку, tablet 10, desktop — усі одразу.
  function getPerPage(total) {
    if (desktop.matches) return Math.max(total, 1);
    return tablet.matches ? 10 : 8;
  }

  function render() {
    const items = getFavorites();

    if (!items.length) {
      list.innerHTML = '';
      list.classList.add('is-hidden');
      empty.classList.remove('is-hidden');
      pagination.innerHTML = '';
      pagination.classList.add('is-hidden');
      return;
    }

    const perPage = getPerPage(items.length);
    const totalPages = Math.ceil(items.length / perPage);
    // Після видалення останньої вправи на останній сторінці page може
    // вийти за межі, тому затискаємо його в діапазон 1..totalPages.
    page = Math.min(Math.max(page, 1), totalPages);
    const start = (page - 1) * perPage;

    empty.classList.add('is-hidden');
    list.classList.remove('is-hidden');
    list.innerHTML = items
      .slice(start, start + perPage)
      .map((exercise) => createExerciseCardMarkup(exercise, 'favorites'))
      .join('');

    createPagination({
      container: pagination,
      totalPages,
      currentPage: page,
      onChange: (next) => {
        page = next;
        render();
      },
    });
  }

  list.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-exercise-remove]');
    if (remove) {
      // Список не перемальовуємо тут: storage відправить favorites:changed,
      // і render() спрацює від події.
      removeFavorite(remove.dataset.id);
      return;
    }

    const start = event.target.closest('[data-exercise-start]');
    if (start) openExerciseModal(start.dataset.id);
  });

  document.addEventListener('favorites:changed', render);

  const resetPage = () => {
    page = 1;
    render();
  };
  tablet.addEventListener('change', resetPage);
  desktop.addEventListener('change', resetPage);

  render();
}

// ---------------------------------------------------------------------------
// TODO(#8): тимчасові заглушки до мержу задачі 8. Тоді видалити цей блок
// і замінити на:
//   import { getFavorites, removeFavorite } from './storage.js';
//   import { openExerciseModal } from './exercise-modal.js';
// ---------------------------------------------------------------------------

function getFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function removeFavorite(id) {
  const next = getFavorites().filter((exercise) => exercise._id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  document.dispatchEvent(
    new CustomEvent('favorites:changed', { detail: { id } })
  );
}

function openExerciseModal(_id) {
  // Заглушка до задачі 8.
}
