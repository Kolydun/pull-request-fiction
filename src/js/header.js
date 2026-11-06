const DESKTOP_QUERY = '(min-width: 768px)';

export function initHeader() {
  const header = document.querySelector('#header');
  if (!header) return;

  const burger = header.querySelector('.header__burger');
  const panel = header.querySelector('#header-menu');
  const closeButton = header.querySelector('.header__close');
  const links = header.querySelectorAll('.header__link');
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);

  setCurrentPage(links);

  if (!burger || !panel || !closeButton) return;

  const syncPanel = (isOpen) => {
    const isDesktop = desktopQuery.matches;
    const openOnMobile = isOpen && !isDesktop;

    panel.classList.toggle('header__panel--open', openOnMobile);
    burger.setAttribute('aria-expanded', String(openOnMobile));
    burger.setAttribute(
      'aria-label',
      openOnMobile ? 'Close menu' : 'Open menu'
    );
    document.body.classList.toggle('is-menu-open', openOnMobile);

    const hideFromA11y = !isDesktop && !openOnMobile;
    panel.toggleAttribute('inert', hideFromA11y);
    if (hideFromA11y) {
      panel.setAttribute('aria-hidden', 'true');
    } else {
      panel.removeAttribute('aria-hidden');
    }
  };

  const openMenu = () => {
    syncPanel(true);
    closeButton.focus();
  };

  const closeMenu = (restoreFocus) => {
    const wasOpen = panel.classList.contains('header__panel--open');
    syncPanel(false);
    if (wasOpen && restoreFocus) {
      burger.focus();
    }
  };

  syncPanel(false);

  burger.addEventListener('click', () => {
    if (panel.classList.contains('header__panel--open')) {
      closeMenu(true);
      return;
    }
    openMenu();
  });

  closeButton.addEventListener('click', () => {
    closeMenu(true);
  });

  panel.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('a') && !desktopQuery.matches) {
      closeMenu(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!panel.classList.contains('header__panel--open')) return;

    if (event.key === 'Escape') {
      closeMenu(true);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [...panel.querySelectorAll('button, a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktopQuery.addEventListener('change', () => {
    closeMenu(false);
  });
}

function setCurrentPage(links) {
  const favoritesPage = window.location.pathname
    .toLowerCase()
    .includes('favorites');

  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const leadsToFavorites = href.toLowerCase().includes('favorites');
    const isCurrent = favoritesPage ? leadsToFavorites : !leadsToFavorites;

    link.classList.toggle('header__link--current', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
