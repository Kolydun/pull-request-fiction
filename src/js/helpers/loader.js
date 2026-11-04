// Global loading indicator toggle.
// Targets the #loader element present in both HTML skeletons.
const SELECTOR = '#loader';
const HIDDEN_CLASS = 'is-hidden';

export function showLoader() {
  document.querySelector(SELECTOR)?.classList.remove(HIDDEN_CLASS);
}

export function hideLoader() {
  document.querySelector(SELECTOR)?.classList.add(HIDDEN_CLASS);
}
