// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  public status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Generic API client
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Network error occurred');
  }
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: () =>
      apiRequest('/auth/logout', { method: 'POST' }),
    refreshToken: () =>
      apiRequest('/auth/refresh', { method: 'POST' }),
  },

  // Products endpoints
  products: {
    getAll: (params?: { category?: string; search?: string; page?: number }) =>
      apiRequest(`/products${params ? '?' + new URLSearchParams(params as any) : ''}`),
    getById: (id: string) =>
      apiRequest(`/products/${id}`),
    getByCategory: (category: string) =>
      apiRequest(`/products/category/${category}`),
    search: (query: string) =>
      apiRequest(`/products/search?q=${encodeURIComponent(query)}`),
  },

  // Cart endpoints
  cart: {
    get: () => apiRequest('/cart'),
    add: (productId: string, quantity: number) =>
      apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    update: (productId: string, quantity: number) =>
      apiRequest('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      }),
    remove: (productId: string) =>
      apiRequest(`/cart/remove/${productId}`, { method: 'DELETE' }),
    clear: () =>
      apiRequest('/cart/clear', { method: 'DELETE' }),
  },

  // Orders endpoints
  orders: {
    getAll: () => apiRequest('/orders'),
    getById: (id: string) => apiRequest(`/orders/${id}`),
    create: (orderData: any) =>
      apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
  },

  // User endpoints
  user: {
    getProfile: () => apiRequest('/user/profile'),
    updateProfile: (userData: any) =>
      apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    getAddresses: () => apiRequest('/user/addresses'),
    addAddress: (address: any) =>
      apiRequest('/user/addresses', {
        method: 'POST',
        body: JSON.stringify(address),
      }),
    updateAddress: (id: string, address: any) =>
      apiRequest(`/user/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(address),
      }),
    deleteAddress: (id: string) =>
      apiRequest(`/user/addresses/${id}`, { method: 'DELETE' }),
  },
};

export { ApiError };