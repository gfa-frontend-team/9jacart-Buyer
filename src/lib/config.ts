// App configuration
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Store',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  },
  features: {
    // Feature flags for development
    enablePayments: false,
    enableReviews: true,
    enableWishlist: true,
    enableNotifications: false,
  },
  ui: {
    // UI configuration
    itemsPerPage: 12,
    maxCartItems: 99,
    imageQuality: 80,
  },
} as const;