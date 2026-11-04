/**
 * Render a simple pagination control into `container`.
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.container - element to render buttons into
 * @param {number} opts.totalPages - total number of pages
 * @param {number} opts.currentPage - active page (1-based)
 * @param {(page: number) => void} opts.onPage - page click callback
 */
export function renderPagination({
  container,
  totalPages,
  currentPage,
  onPage,
}) {
  if (!container) return;
  container.innerHTML = '';

  if (!totalPages || totalPages <= 1) return;

  const list = document.createElement('ul');
  list.className = 'pagination';

  for (let page = 1; page <= totalPages; page += 1) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pagination__btn';
    button.textContent = String(page);

    if (page === currentPage) {
      button.classList.add('pagination__btn--active');
      button.setAttribute('aria-current', 'page');
    }

    button.addEventListener('click', () => {
      if (page !== currentPage) onPage(page);
    });

    item.append(button);
    list.append(item);
  }

  container.append(list);
}
