import { STORAGE_KEYS } from './constants';
import type { User } from '../types/auth';

export const storage = {
  // User management
  getUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Clear all auth data
  clearAuth: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Check if user is stored (auth status will be verified via API call)
  hasStoredUser: (): boolean => {
    const user = storage.getUser();
    return !!user;
  },
};