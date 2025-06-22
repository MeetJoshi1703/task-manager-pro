import { useBoardStore } from '../index';

export const useAuth = () => {
  // Individual selectors for optimal performance
  const isAuthenticated = useBoardStore(state => state.isAuthenticated);
  const currentUser = useBoardStore(state => state.currentUser);
  const showAuthModal = useBoardStore(state => state.showAuthModal);
  const authMode = useBoardStore(state => state.authMode);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  
  // Actions (these are stable by default in Zustand)
  const setShowAuthModal = useBoardStore(state => state.setShowAuthModal);
  const setAuthMode = useBoardStore(state => state.setAuthMode);
  const login = useBoardStore(state => state.login);
  const signup = useBoardStore(state => state.signup);
  const loginAsDemo = useBoardStore(state => state.loginAsDemo);
  const logout = useBoardStore(state => state.logout);
  const checkAuthStatus = useBoardStore(state => state.checkAuthStatus);
  const clearError = useBoardStore(state => state.clearError);

  return {
    // State
    isAuthenticated,
    currentUser,
    showAuthModal,
    authMode,
    loading,
    error,
    
    // Actions
    setShowAuthModal,
    setAuthMode,
    login,
    signup,
    loginAsDemo,
    logout,
    checkAuthStatus,
    clearError,
  };
};
