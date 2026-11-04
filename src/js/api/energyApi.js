import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../constants/index.js';

const api = axios.create({ baseURL: BASE_URL });

/**
 * Remove undefined/null/empty params so they don't hit the URL as `key=`.
 */
function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

/**
 * GET /filters — category cards (Muscles | Body parts | Equipment).
 */
export async function getFilters({ filter, page, limit } = {}) {
  const { data } = await api.get(ENDPOINTS.FILTERS, {
    params: cleanParams({ filter, page, limit }),
  });
  return data;
}

/**
 * GET /exercises — exercises filtered by category and/or keyword.
 */
export async function getExercises({
  bodypart,
  muscles,
  equipment,
  keyword,
  page,
  limit,
} = {}) {
  const { data } = await api.get(ENDPOINTS.EXERCISES, {
    params: cleanParams({ bodypart, muscles, equipment, keyword, page, limit }),
  });
  return data;
}

/**
 * GET /exercises/:id — a single exercise for the details modal.
 */
export async function getExerciseById(id) {
  const { data } = await api.get(`${ENDPOINTS.EXERCISES}/${id}`);
  return data;
}

/**
 * PATCH /exercises/:id/rating — submit a rating + review.
 */
export async function rateExercise(id, { rate, email, review }) {
  const { data } = await api.patch(`${ENDPOINTS.EXERCISES}/${id}/rating`, {
    rate,
    email,
    review,
  });
  return data;
}

/**
 * GET /quote — quote of the day.
 */
export async function getQuote() {
  const { data } = await api.get(ENDPOINTS.QUOTE);
  return data;
}

/**
 * POST /subscription — footer newsletter subscription.
 */
export async function subscribe(email) {
  const { data } = await api.post(ENDPOINTS.SUBSCRIPTION, { email });
  return data;
}
