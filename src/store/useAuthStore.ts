import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { authApi, type LoginRequest, type RegisterRequest } from "../api/auth";
import { apiErrorUtils } from "../utils/api-errors";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<User, "id" | "token"> & { password: string }
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const loginData: LoginRequest = {
            emailAddress: email,
            password,
          };

          const response = await authApi.login(loginData);

          // Map API response to User interface
          const user: User = {
            id: response.data.buyerId,
            email: response.data.emailAddress,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phone: response.data.phoneNumber || undefined,
            token: response.data.token,
          };

          set({
            user,
            token: response.data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          // Re-throw with user-friendly message
          const errorMessage = apiErrorUtils.getErrorMessage(error);
          throw new Error(errorMessage);
        }
      },

      register: async (userData) => {
        set({ isLoading: true });

        try {
          const registerData: RegisterRequest = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            emailAddress: userData.email,
            password: userData.password,
          };

          await authApi.register(registerData);

          // Registration successful - don't auto-login, user needs to verify email
          set({ isLoading: false });

          // Note: We don't set user/token here as registration doesn't return them
          // User will need to login after email verification
        } catch (error) {
          set({ isLoading: false });
          // Re-throw with user-friendly message
          const errorMessage = apiErrorUtils.getErrorMessage(error);
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        // Clear auth state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // Optional: Call logout API if needed
        authApi.logout().catch(() => {
          // Ignore logout API errors
        });
      },

      updateProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      checkAuthStatus: () => {
        const { token } = get();
        if (token) {
          // Basic token validation - you might want to add more sophisticated checks
          try {
            const parts = token.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              const currentTime = Math.floor(Date.now() / 1000);

              if (payload.exp <= currentTime) {
                // Token expired, logout
                get().logout();
              }
            }
          } catch (error) {
            // Invalid token, logout
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist user data and token
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
