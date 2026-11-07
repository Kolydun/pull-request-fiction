const SHOW_AFTER_PX = 400;

export function initScrollUp() {
  const button = document.querySelector('.scroll-up');
  if (!button) return;

  let ticking = false;

  const toggleButton = () => {
    button.classList.toggle('is-visible', window.scrollY > SHOW_AFTER_PX);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(toggleButton);
  };

  const onClick = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  button.addEventListener('click', onClick);

  toggleButton();
}
