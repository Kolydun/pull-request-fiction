import iconAngle from '../images/icon-angle-left.svg';
import iconAngles from '../images/icon-angles-left.svg';

// How many page numbers are visible at once, e.g. "... 4 5 6 ...".
const VISIBLE_PAGES = 3;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// One click listener per container, so createPagination() can be called
// again after every data load without stacking listeners.
const clickHandlers = new WeakMap();
// Latest call per container: a delayed onChange from an older call is skipped.
const latestCalls = new WeakMap();

/**
 * Render pagination into `container` and call `onChange(page)` when the
 * user picks another page. The component doesn't know where data comes from:
 * pass `totalPages` from the backend response (categories, exercises) or
 * `Math.ceil(items.length / perPage)` for a local array (Favorites).
 *
 * Call it again after each load with fresh values; with one page or less
 * the container is cleared and hidden. If `currentPage` is past the last
 * page (e.g. the last item on the last Favorites page was removed),
 * `onChange(lastPage)` is called once so the list can show that page.
 *
 * The container gets role="navigation" and aria-label="Pagination" unless
 * it already has its own aria-label.
 *
 * @param {object} options
 * @param {HTMLElement} options.container - e.g. `<div class="pagination"></div>`
 * @param {number} options.totalPages
 * @param {number} options.currentPage
 * @param {(page: number) => void} options.onChange
 * @param {HTMLElement} [options.scrollTarget] - scrolled into view after a
 *   page change; defaults to the closest `<section>` around the container.
 */
export function createPagination({
  container,
  totalPages,
  currentPage,
  onChange,
  scrollTarget,
} = {}) {
  if (!container) return;

  const call = {};
  latestCalls.set(container, call);

  const prevHandler = clickHandlers.get(container);
  if (prevHandler) {
    container.removeEventListener('click', prevHandler);
    clickHandlers.delete(container);
  }

  const total = toPageNumber(totalPages);
  const requested = toPageNumber(currentPage);

  // Past the last page: the list would stay on an empty page while the
  // pagination shows the last one. Let the caller switch to the last page
  // (after this call returns, and only if no newer call replaced it).
  if (total > 0 && requested > total) {
    queueMicrotask(() => {
      if (latestCalls.get(container) !== call) return;
      if (typeof onChange === 'function') onChange(total);
    });
  }

  if (total <= 1) {
    container.innerHTML = '';
    container.classList.add('is-hidden');
    return;
  }

  let page = Math.min(Math.max(requested, 1), total);
  const target =
    scrollTarget ?? container.closest('section') ?? container.parentElement;

  const handleClick = (event) => {
    const button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;

    const next = Number(button.dataset.page);
    if (!next || next === page) return;

    page = next;
    render(container, page, total);
    scrollToStart(target);
    if (typeof onChange === 'function') onChange(page);
  };

  container.classList.add('pagination');
  container.classList.remove('is-hidden');
  container.setAttribute('role', 'navigation');
  if (!container.hasAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Pagination');
  }
  render(container, page, total);
  container.addEventListener('click', handleClick);
  clickHandlers.set(container, handleClick);
}

function toPageNumber(value) {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function render(container, page, total) {
  const hadFocus = container.contains(document.activeElement);
  container.innerHTML = createMarkup(page, total);

  // Re-rendering removes the focused button; keep keyboard users in place.
  if (hadFocus) {
    container
      .querySelector('[aria-current="page"]')
      ?.focus({ preventScroll: true });
  }
}

function scrollToStart(target) {
  if (!target || target.getBoundingClientRect().top >= 0) return;

  const behavior = window.matchMedia(REDUCED_MOTION).matches
    ? 'auto'
    : 'smooth';
  target.scrollIntoView({ behavior, block: 'start' });
}

function getVisiblePages(page, total) {
  const size = Math.min(VISIBLE_PAGES, total);
  const start = Math.min(
    Math.max(page - Math.floor(size / 2), 1),
    total - size + 1
  );
  return Array.from({ length: size }, (_, index) => start + index);
}

function createMarkup(page, total) {
  const pages = getVisiblePages(page, total);
  const lastVisible = pages[pages.length - 1];
  const dots = '<li class="pagination__dots" aria-hidden="true">...</li>';

  // --digits sizes the number block in CSS so the arrows stay in place.
  const list = `
    <ul class="pagination__pages" style="--digits: ${String(lastVisible).length}">
      ${pages[0] > 1 ? dots : ''}
      ${pages.map((number) => createPageMarkup(number, number === page)).join('')}
      ${lastVisible < total ? dots : ''}
    </ul>`;

  // Few pages: numbers only, as on the page mockups.
  if (total <= VISIBLE_PAGES) return list;

  const isFirst = page === 1;
  const isLast = page === total;
  // First/last arrows are hidden on screens narrower than 375px (CSS).
  const double = { icon: iconAngles, width: 31, height: 24, edge: true };
  const single = { icon: iconAngle, width: 20, height: 20 };

  return `
    <div class="pagination__arrows">
      ${createArrowMarkup({ ...double, page: 1, label: 'First page', disabled: isFirst })}
      ${createArrowMarkup({ ...single, page: page - 1, label: 'Previous page', disabled: isFirst })}
    </div>
    ${list}
    <div class="pagination__arrows pagination__arrows--next">
      ${createArrowMarkup({ ...single, page: page + 1, label: 'Next page', disabled: isLast })}
      ${createArrowMarkup({ ...double, page: total, label: 'Last page', disabled: isLast })}
    </div>`;
}

function createPageMarkup(number, isActive) {
  const activeClass = isActive ? ' is-active' : '';
  // --length lets CSS shrink the font so a 2+ digit number fits the circle.
  const activeAttrs = isActive
    ? ` aria-current="page" disabled style="--length: ${String(number).length}"`
    : '';
  return `
    <li>
      <button class="pagination__page${activeClass}" type="button" data-page="${number}" aria-label="Page ${number}"${activeAttrs}>${number}</button>
    </li>`;
}

function createArrowMarkup({
  page,
  label,
  icon,
  width,
  height,
  disabled,
  edge = false,
}) {
  const edgeClass = edge ? ' pagination__arrow--edge' : '';
  return `
    <button class="pagination__arrow${edgeClass}" type="button" data-page="${page}" aria-label="${label}"${disabled ? ' disabled' : ''}>
      <img class="pagination__icon" src="${icon}" width="${width}" height="${height}" alt="" />
    </button>`;
}
