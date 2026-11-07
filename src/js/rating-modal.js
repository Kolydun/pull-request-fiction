import { rateExercise } from './api/energyApi.js';
import { showLoader, hideLoader } from './helpers/loader.js';
import { closeModal as closeExerciseModal } from './modal.js';
import { showMessage } from './toast.js';

let activeExerciseId = null;

export function initRating() {
  const modalEl = document.getElementById('rating-modal');
  const form = document.getElementById('rating-form');
  const valueDisplay = document.getElementById('rating-value');
  const radioInputs = form?.querySelectorAll('input[name="rate"]');

  if (!modalEl || !form) return;

  radioInputs?.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (valueDisplay) {
        valueDisplay.textContent = Number(e.target.value).toFixed(1);
      }
    });
  });

  const emailInput = form.querySelector('input[name="email"]');

  const notifyError = (message) => {
    showMessage(message, 'error', emailInput);
  };

  const closeRatingModal = () => {
    if (modalEl.classList.contains('is-hidden')) return;

    modalEl.classList.add('is-hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleEsc);

    const exerciseId = activeExerciseId;
    activeExerciseId = null;
    if (exerciseId) {
      document.dispatchEvent(
        new CustomEvent('exercise:open', { detail: { id: exerciseId } })
      );
    }
  };

  const handleEsc = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeRatingModal();
  };

  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl || event.target.closest('[data-modal-close]')) {
      closeRatingModal();
    }
  });

  document.addEventListener('rating:open', (event) => {
    const exerciseId = event.detail?.id;
    if (!exerciseId) return;

    activeExerciseId = exerciseId;
    closeExerciseModal();
    form.reset();
    if (valueDisplay) valueDisplay.textContent = '0.0';

    modalEl.classList.remove('is-hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleEsc);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rate = Number(formData.get('rate'));
    const email = formData.get('email')?.toString().trim();
    const review = formData.get('review')?.toString().trim();

    if (!activeExerciseId || !rate || !email || !review) {
      notifyError('Please fill in all fields correctly.');
      return;
    }

    try {
      showLoader();
      await rateExercise(activeExerciseId, { rate, email, review });
      form.reset();
      closeRatingModal();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Error submitting rating. Please try again.';
      notifyError(message);
    } finally {
      hideLoader();
    }
  });
}