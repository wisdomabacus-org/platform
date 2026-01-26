export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 30000,
} as const;

export const APP_CONFIG = {
  APP_NAME: 'Wisdom Abacus Admin',
  VERSION: '1.0.0',
  SESSION_COOKIE_NAME: 'wisdom_admin_session',
} as const;

export const QUERY_KEYS = {
  AUTH: 'auth',
  USERS: 'users',
  COMPETITIONS: 'competitions',
  ENROLLMENTS: 'enrollments',
  PAYMENTS: 'payments',
  RESULTS: 'results',
  MOCK_TESTS: 'mock-tests',
  LIVE_CLASSES: 'live-classes',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USERS_DETAIL: '/users/:id',
  COMPETITIONS: '/competitions',
  COMPETITIONS_CREATE: '/competitions/create',
  COMPETITIONS_EDIT: '/competitions/:id/edit',
  COMPETITIONS_QUESTIONS: '/competitions/:id/questions',
  ENROLLMENTS: '/enrollments',
  PAYMENTS: '/payments',
  RESULTS: '/results',
  RESULTS_DETAIL: '/results/:id',
  MOCK_TESTS: '/mock-tests',
  MOCK_TESTS_CREATE: '/mock-tests/create',
  MOCK_TESTS_EDIT: '/mock-tests/:id/edit',
  MOCK_TESTS_QUESTIONS: '/mock-tests/:id/questions',
  LIVE_CLASSES: '/live-classes',
} as const;
