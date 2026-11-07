const OPEN_CLASS = 'is-open';
const BODY_LOCK_CLASS = 'modal-open';

let refs = null;
let onCloseCallback = null;
let lastFocusedElement = null;

function getRefs() {
  if (refs) return refs;

  const backdrop = document.querySelector('[data-modal-backdrop]');
  if (!backdrop) return null;

  refs = {
    backdrop,
    closeBtn: backdrop.querySelector('[data-modal-close]'),
    content: backdrop.querySelector('[data-modal-content]'),
  };
  return refs;
}

export function isModalOpen() {
  return Boolean(getRefs()?.backdrop.classList.contains(OPEN_CLASS));
}

export function openModal(contentElement, { onClose } = {}) {
  const modalRefs = getRefs();
  if (!modalRefs) return;

  if (isModalOpen()) closeModal();

  const { backdrop, closeBtn, content } = modalRefs;

  content.replaceChildren(contentElement);
  onCloseCallback = typeof onClose === 'function' ? onClose : null;
  lastFocusedElement = document.activeElement;

  lockScroll();
  backdrop.classList.add(OPEN_CLASS);
  backdrop.setAttribute('aria-hidden', 'false');

  backdrop.addEventListener('click', onBackdropClick);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', onEscKeydown);

  closeBtn.focus();
}

export function closeModal() {
  const modalRefs = getRefs();
  if (!modalRefs || !isModalOpen()) return;

  const { backdrop, closeBtn, content } = modalRefs;

  restoreFocus(backdrop);

  backdrop.classList.remove(OPEN_CLASS);
  backdrop.setAttribute('aria-hidden', 'true');

  backdrop.removeEventListener('click', onBackdropClick);
  closeBtn.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', onEscKeydown);

  content.replaceChildren();
  unlockScroll();

  const callback = onCloseCallback;
  onCloseCallback = null;
  callback?.();
}

function restoreFocus(backdrop) {
  const target = lastFocusedElement;
  lastFocusedElement = null;

  const canFocusBack =
    target &&
    target !== document.body &&
    target.isConnected &&
    !backdrop.contains(target);

  if (canFocusBack) {
    target.focus();
  } else if (backdrop.contains(document.activeElement)) {
    document.activeElement.blur();
  }
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) closeModal();
}

function onEscKeydown(event) {
  if (event.key === 'Escape') closeModal();
}

function lockScroll() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight =
    scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
  document.body.classList.add(BODY_LOCK_CLASS);
}

function unlockScroll() {
  document.body.classList.remove(BODY_LOCK_CLASS);
  document.body.style.paddingRight = '';
}
