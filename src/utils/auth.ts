import { config } from '../lib/config';
import { getAuthFromStorage, getAuthStorage } from '../lib/authStorage';

// Token management utilities
export const tokenUtils = {
  // Get token from auth storage (localStorage or sessionStorage based on Remember Me)
  getToken: (): string | null => {
    try {
      const authStorage = getAuthFromStorage();
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return null;
  },

  // Set token in auth storage (used by Zustand store)
  setToken: (token: string): void => {
    try {
      const storage = getAuthStorage();
      const authStorage = storage.getItem(config.auth.storageKey);
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        parsed.state.token = token;
        storage.setItem(config.auth.storageKey, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  },

  // Remove token from auth storage
  removeToken: (): void => {
    try {
      const storage = getAuthStorage();
      const authStorage = storage.getItem(config.auth.storageKey);
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        delete parsed.state.token;
        storage.setItem(config.auth.storageKey, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  },

  // Check if token exists and is valid (basic check)
  isTokenValid: (): boolean => {
    const token = tokenUtils.getToken();
    if (!token) return false;
    
    try {
      // Basic JWT structure check (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  },

  // Get user info from token payload
  getUserFromToken: (): any | null => {
    const token = tokenUtils.getToken();
    if (!token) return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return {
        email: payload.email as string,
        role: payload.role as string,
        exp: payload.exp as number,
      };
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  },
};