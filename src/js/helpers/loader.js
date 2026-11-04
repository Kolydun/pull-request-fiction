// Global loading indicator toggle.
// Targets the #loader element present in both HTML skeletons (Task 6).
const SELECTOR = '#loader';
const HIDDEN_CLASS = 'is-hidden';

export const loader = {
  show() {
    document.querySelector(SELECTOR)?.classList.remove(HIDDEN_CLASS);
  },

  hide() {
    document.querySelector(SELECTOR)?.classList.add(HIDDEN_CLASS);
  },
};
