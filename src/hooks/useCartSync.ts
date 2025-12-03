import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

/**
 * Hook to handle cart migration on authentication state changes
 * - On login: migrates guest cart to server (one time only)
 * - On logout: clears server cart, starts fresh guest cart
 */
export const useCartSync = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { migrateGuestCartOnLogin, handleLogout, loadServerCart } = useCartStore();
  
  // Track previous auth state to detect changes
  const prevAuthState = useRef<{ isAuthenticated: boolean; userId: string | null }>({
    isAuthenticated: false,
    userId: null,
  });
  
  // Track if initial load has been done
  const hasInitialized = useRef(false);

  useEffect(() => {
    const currentUserId = user?.id || null;
    const prevState = prevAuthState.current;
    
    // Initial load: if user is authenticated and cart hasn't been loaded yet
    if (!hasInitialized.current && isAuthenticated && user) {
      hasInitialized.current = true;
      console.log('🔄 Initial load: User is authenticated, loading cart...');
      loadServerCart().catch(console.error);
      prevAuthState.current = {
        isAuthenticated,
        userId: currentUserId,
      };
      return;
    }
    
    // Only act on actual auth state changes
    if (prevState.isAuthenticated !== isAuthenticated || prevState.userId !== currentUserId) {
      console.log('🔄 Auth state changed:', { 
        wasAuth: prevState.isAuthenticated, 
        nowAuth: isAuthenticated,
        prevUser: prevState.userId,
        currentUser: currentUserId
      });

      if (isAuthenticated && user && !prevState.isAuthenticated) {
        // User just logged in - migrate guest cart to server
        console.log('🔄 User logged in, migrating guest cart to server...');
        migrateGuestCartOnLogin().catch(console.error);
      } else if (!isAuthenticated && prevState.isAuthenticated) {
        // User just logged out - clear server data, start fresh
        console.log('🔄 User logged out, clearing server cart data...');
        handleLogout();
      } else if (isAuthenticated && prevState.isAuthenticated && prevState.userId !== currentUserId) {
        // Different user logged in - load their cart
        console.log('🔄 Different user logged in, loading their cart...');
        loadServerCart().catch(console.error);
      }

      // Update previous state
      prevAuthState.current = {
        isAuthenticated,
        userId: currentUserId,
      };
    }
  }, [isAuthenticated, user?.id, user, migrateGuestCartOnLogin, handleLogout, loadServerCart]);

  // Return current auth status
  return {
    isAuthenticated,
  };
};