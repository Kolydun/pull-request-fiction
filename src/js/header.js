const desktop = window.matchMedia('(min-width: 768px)');

export function initHeader() {
  const header = document.querySelector('#header');
  if (!header) return;

  const burger = header.querySelector('.header__burger');
  const panel = header.querySelector('#header-menu');
  const closeButton = header.querySelector('.header__close');

  markCurrentPage(header);

  if (!burger || !panel || !closeButton) return;

  const outside = [
    header.querySelector('.header__logo'),
    burger,
    document.querySelector('main'),
  ];

  const setOpen = (isOpen) => {
    const open = isOpen && !desktop.matches;

    panel.classList.toggle('header__panel--open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-menu-open', open);
    panel.toggleAttribute('inert', !open && !desktop.matches);
    outside.forEach((element) => element?.toggleAttribute('inert', open));

    if (open) closeButton.focus();
  };

  const close = () => {
    setOpen(false);
    burger.focus();
  };

  setOpen(false);

  burger.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', close);

  panel.addEventListener('click', (event) => {
    if (!event.target.closest?.('a')) return;
    setTimeout(() => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      panel.classList.contains('header__panel--open')
    ) {
      close();
    }
  });

  desktop.addEventListener('change', () => setOpen(false));
}

function markCurrentPage(header) {
  const onFavorites = location.pathname.toLowerCase().includes('favorites');

  header.querySelectorAll('.header__link').forEach((link) => {
    const current =
      link.href.toLowerCase().includes('favorites') === onFavorites;

    link.classList.toggle('header__link--current', current);
    if (current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
