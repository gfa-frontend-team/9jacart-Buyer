import { apiClient } from './client';

// Auth API request types
export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

// Auth API response types
export interface LoginSuccessResponse {
  status: number;
  error: boolean;
  message: string;
  data: {
    buyerId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string | null;
    token: string;
  };
}

export interface RegisterSuccessResponse {
  status: number;
  error: boolean;
  message: string;
}

export interface AuthErrorResponse {
  status: number;
  error: number;
  messages: {
    error?: string;
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
  };
}

// Auth API endpoints
export const authApi = {
  // Login endpoint
  login: async (credentials: LoginRequest): Promise<LoginSuccessResponse> => {
    return apiClient.post<LoginSuccessResponse>('/buyer/login', credentials);
  },

  // Register endpoint
  register: async (userData: RegisterRequest): Promise<RegisterSuccessResponse> => {
    return apiClient.post<RegisterSuccessResponse>('/buyer/signup', userData);
  },

  // Logout (if needed for server-side logout)
  logout: async (): Promise<void> => {
    // For now, just a placeholder - implement if backend has logout endpoint
    return Promise.resolve();
  },
};