// Base URL of the "Your Energy" API.
export const BASE_URL = 'https://your-energy.b.goit.study/api';

// API endpoint paths (relative to BASE_URL).
export const ENDPOINTS = {
  FILTERS: '/filters',
  EXERCISES: '/exercises',
  QUOTE: '/quote',
  SUBSCRIPTION: '/subscription',
};

// Allowed values for the `filter` query of GET /filters.
export const FILTER_TYPES = {
  MUSCLES: 'Muscles',
  BODY_PARTS: 'Body parts',
  EQUIPMENT: 'Equipment',
};

// localStorage keys.
export const STORAGE_KEYS = {
  FAVORITES: 'ye-favorites',
  QUOTE: 'ye-quote-of-the-day',
};

// Breakpoints in px (kept in sync with SCSS $breakpoints).
export const BREAKPOINTS = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1440,
};

// Default pagination limits per layout.
export const DEFAULT_LIMITS = {
  FILTERS_MOBILE: 9,
  FILTERS_DESKTOP: 12,
  EXERCISES_MOBILE: 8,
  EXERCISES_DESKTOP: 10,
};
