import { rateExercise } from './api/energyApi.js';
import { showLoader, hideLoader } from './helpers/loader.js';

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

  const closeModal = () => {
    modalEl.classList.add('is-hidden');
    document.removeEventListener('keydown', handleEsc);
    if (activeExerciseId) {
      document.dispatchEvent(
        new CustomEvent('exercise:open', { detail: { id: activeExerciseId } })
      );
    }
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl || e.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('rating:open', (event) => {
    activeExerciseId = event.detail?.id || 'demo-id';
    form.reset();
    if (valueDisplay) valueDisplay.textContent = '0.0';

    modalEl.classList.remove('is-hidden');
    document.addEventListener('keydown', handleEsc);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const rate = Number(formData.get('rate'));
    const email = formData.get('email')?.toString().trim();
    const review = formData.get('review')?.toString().trim();

    if (!activeExerciseId || !rate || !email || !review) {
      alert('Please fill in all fields correctly.');
      return;
    }

    try {
      showLoader();
      await rateExercise(activeExerciseId, { rate, email, review });
      alert('Thank you for your rating!');
      form.reset();
      closeModal();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Error submitting rating. Please try again.';
      alert(message);
    } finally {
      hideLoader();
    }
  });
}