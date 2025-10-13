// HTTP client with interceptors for API communication
import { config } from '../lib/config';

const API_BASE_URL = config.api.baseUrl;

export class ApiError extends Error {
  public status: number;
  public data?: unknown;
  
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Generic API client with interceptors
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    // Get token from localStorage (Zustand persist storage)
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return null;
  }

  private getBasicAuthHeader(): string {
    // Basic Auth credentials for API access
    const { username, password } = config.api.basicAuth;
    const credentials = btoa(`${username}:${password}`);
    return `Basic ${credentials}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useBearer: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Determine which authentication to use
    if (useBearer) {
      // Use Bearer token for protected endpoints
      const token = this.getAuthToken();
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      } else {
        throw new ApiError(401, 'Authentication token required');
      }
    } else {
      // Use Basic Auth for public endpoints
      config.headers = {
        ...config.headers,
        'Authorization': this.getBasicAuthHeader(),
      };
    }

    try {
      console.log('API Request:', { url, method: config.method, headers: config.headers });
      
      const response = await fetch(url, config);
      
      console.log('API Response:', { status: response.status, statusText: response.statusText });
      
      // Parse response
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        // Handle API error responses
        throw new ApiError(
          response.status, 
          data.messages?.error || data.message || `HTTP error! status: ${response.status}`,
          data
        );
      }
      
      console.log('API Success Response:', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('Network/Parse Error:', error);
      // Network or parsing error
      throw new ApiError(0, 'Network error occurred');
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, options?: RequestInit, useBearer?: boolean): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, useBearer);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit, useBearer?: boolean): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, useBearer);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit, useBearer?: boolean): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, useBearer);
  }

  async delete<T>(endpoint: string, options?: RequestInit, useBearer?: boolean): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' }, useBearer);
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);