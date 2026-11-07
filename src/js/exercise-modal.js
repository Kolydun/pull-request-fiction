import { getExerciseById } from './api/energyApi.js';
import { showLoader, hideLoader } from './helpers/loader.js';
import { openModal } from './modal.js';
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  FAVORITES_CHANGED_EVENT,
} from './storage.js';

export const RATING_OPEN_EVENT = 'rating:open';
const START_SELECTOR = '[data-action="start"][data-id]';
const MAX_RATING = 5;

const exerciseCache = new Map();
let lastRequestId = 0;
let isInitialized = false;

export function initModal() {
  if (isInitialized) return;
  isInitialized = true;

  document.addEventListener('click', (event) => {
    const startBtn = event.target.closest(START_SELECTOR);
    if (startBtn) openExerciseModal(startBtn.dataset.id);
  });

  document.addEventListener(FAVORITES_CHANGED_EVENT, () => {
    const favBtn = document.querySelector(
      '[data-modal-content] [data-favorite-btn]'
    );
    if (favBtn) updateFavoriteButton(favBtn, isFavorite(favBtn.dataset.id));
  });
}

export async function openExerciseModal(id) {
  if (!id) return;

  const requestId = ++lastRequestId;
  let exercise = exerciseCache.get(id);

  if (!exercise) {
    try {
      showLoader();
      exercise = await getExerciseById(id);
      exerciseCache.set(id, exercise);
    } catch {
      if (requestId === lastRequestId) openModal(createErrorElement());
      return;
    } finally {
      hideLoader();
    }
  }

  if (requestId !== lastRequestId) return;

  openModal(createExerciseElement(exercise));
}

function createExerciseElement(exercise) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = createExerciseMarkup(exercise);
  const card = wrapper.firstElementChild;

  const favBtn = card.querySelector('[data-favorite-btn]');
  updateFavoriteButton(favBtn, isFavorite(exercise._id));
  favBtn.addEventListener('click', () => {
    if (isFavorite(exercise._id)) {
      removeFavorite(exercise._id);
    } else {
      addFavorite(exercise);
    }
    updateFavoriteButton(favBtn, isFavorite(exercise._id));
  });

  card.querySelector('[data-rating-btn]').addEventListener('click', () => {
    document.dispatchEvent(
      new CustomEvent(RATING_OPEN_EVENT, { detail: { id: exercise._id } })
    );
  });

  return card;
}

function createExerciseMarkup({
  _id,
  name,
  gifUrl,
  rating,
  target,
  bodyPart,
  equipment,
  popularity,
  burnedCalories,
  time,
  description,
}) {
  const title = escapeHtml(name ?? 'Exercise');
  const ratingValue = clampRating(rating);
  const calories = `${burnedCalories ?? 0}/${time ?? 3} min`;

  const media = gifUrl
    ? `<img class="ex-modal__img" src="${escapeHtml(gifUrl)}" alt="${title}" width="270" height="259" />`
    : '';

  const stats = [
    ['Target', target],
    ['Body Part', bodyPart],
    ['Equipment', equipment],
    ['Popular', popularity],
    ['Burned Calories', calories],
  ]
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
    .map(
      ([label, value]) => `
        <li class="ex-modal__stat">
          <p class="ex-modal__stat-label">${label}</p>
          <p class="ex-modal__stat-value">${escapeHtml(value)}</p>
        </li>`
    )
    .join('');

  return `
    <article class="ex-modal ${media ? '' : 'ex-modal--no-media'}" aria-labelledby="ex-modal-title">
      ${media}
      <div class="ex-modal__info">
        <h2 class="ex-modal__title" id="ex-modal-title">${title}</h2>
        <div class="ex-modal__rating">
          <span class="ex-modal__rating-value">${ratingValue.toFixed(1)}</span>
          ${createStarsMarkup(ratingValue)}
        </div>
        <ul class="ex-modal__stats">${stats}</ul>
        ${description ? `<p class="ex-modal__desc">${escapeHtml(description)}</p>` : ''}
        <div class="ex-modal__actions">
          <button class="ex-modal__btn ex-modal__btn--light ex-modal__btn--fav" type="button" data-favorite-btn data-id="${escapeHtml(_id)}" aria-pressed="false">
            <span class="ex-modal__fav-label ex-modal__fav-label--add">Add to favorites ${HEART_ICON}</span>
            <span class="ex-modal__fav-label ex-modal__fav-label--remove">Remove from favorites ${TRASH_ICON}</span>
          </button>
          <button class="ex-modal__btn ex-modal__btn--outline" type="button" data-rating-btn>Give a rating</button>
        </div>
      </div>
    </article>`;
}

function updateFavoriteButton(button, inFavorites) {
  button.setAttribute('aria-pressed', String(inFavorites));
}

function createStarsMarkup(value) {
  const stars = STAR_ICON.repeat(MAX_RATING);
  const percent = (value / MAX_RATING) * 100;
  return `
    <div class="ex-modal__stars" role="img" aria-label="Rating ${value.toFixed(1)} out of ${MAX_RATING}">
      <div class="ex-modal__stars-row">${stars}</div>
      <div class="ex-modal__stars-row ex-modal__stars-row--filled" style="width: ${percent}%">${stars}</div>
    </div>`;
}

function createErrorElement() {
  const wrapper = document.createElement('div');
  wrapper.className = 'ex-modal ex-modal--error';
  wrapper.innerHTML = `
    <p class="ex-modal__error">
      Sorry, we couldn't load this exercise. Please try again later.
    </p>`;
  return wrapper;
}

function clampRating(rating) {
  const value = Number(rating);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), MAX_RATING);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const STAR_ICON = `
  <svg class="ex-modal__star" width="18" height="18" viewBox="-2.3 -2.3 28.6 28.6" aria-hidden="true">
    <path d="M12 2.5l2.94 6.06 6.66.92-4.84 4.65 1.18 6.62L12 17.6l-5.94 3.15 1.18-6.62L2.4 9.48l6.66-.92z" />
  </svg>`;

const HEART_ICON = `
  <svg class="ex-modal__btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
  </svg>`;

const TRASH_ICON = `
  <svg class="ex-modal__btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14M10 10v6M14 10v6" />
  </svg>`;
