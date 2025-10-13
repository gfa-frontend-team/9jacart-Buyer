import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkAuthStatus } = useAuthStore();

  // Initialize auth status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return <>{children}</>;
};

export default AuthProvider;