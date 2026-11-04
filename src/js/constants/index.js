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
