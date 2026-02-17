/**
 * Auth storage utilities for Remember Me.
 * When Remember Me is checked: use localStorage (persists across browser restarts).
 * When unchecked: use sessionStorage (clears when tab/browser closes).
 */

import { config } from './config';

const REMEMBER_ME_KEY = config.auth.rememberMeKey;
const AUTH_STORAGE_KEY = config.auth.storageKey;

/** Get storage based on Remember Me preference (stored in localStorage). */
export const getAuthStorage = (): Storage => {
  if (typeof window === 'undefined') return localStorage;
  const remember = localStorage.getItem(REMEMBER_ME_KEY);
  // Default to localStorage for backward compatibility (existing users)
  return remember === 'false' ? sessionStorage : localStorage;
};

/** Set Remember Me preference. Call before login. */
export const setRememberMe = (remember: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMEMBER_ME_KEY, String(remember));
  if (!remember) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

/** Get auth data from the appropriate storage. */
export const getAuthFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getAuthStorage().getItem(AUTH_STORAGE_KEY);
};

/** Custom StateStorage for Zustand persist - delegates to localStorage or sessionStorage. */
export const createAuthStorage = () => ({
  getItem: (name: string): string | null => getAuthStorage().getItem(name),
  setItem: (name: string, value: string): void => {
    getAuthStorage().setItem(name, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
});
