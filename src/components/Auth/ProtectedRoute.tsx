import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Loading } from '../UI/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const location = useLocation();

  // Check auth status on mount and when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Preserve the intended destination in the redirect URL
    const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
    return <Navigate to={redirectUrl} replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;