// src/utils/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    ME: '/api/v1/auth/me',
  },
  // User endpoints
  USERS: {
    BASE: '/api/v1/users',
    PROFILE: '/api/v1/users/profile',
    PASSWORD: '/api/v1/users/password',
    EMPLOYEES: '/api/v1/users/employees',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
    BLOCK: (id: string) => `/api/v1/users/${id}/block`,
    UNBLOCK: (id: string) => `/api/v1/users/${id}/unblock`,
  },
} as const;

export const STORAGE_KEYS = {
  USER: 'user',
} as const;

export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  USERS: {
    LIST: ['users', 'list'],
    BY_ID: (id: string) => ['users', 'by-id', id],
    PROFILE: ['users', 'profile'],
  },
} as const;