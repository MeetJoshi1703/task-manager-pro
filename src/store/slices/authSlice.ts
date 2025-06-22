// src/store/slices/authSlice.ts
import type { AuthState, AuthActions, StoreSlice } from '../types/storeTypes';
import { authService } from '../../services/authService';
import { 
  getInitialAuthState, 
  handleApiError, 
  setTokens, 
  clearTokens,
  logOperation,
  logError 
} from '../utils/storeUtils';

export const createAuthSlice: StoreSlice<AuthState & AuthActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialAuthState(),

  // ================================
  // ACTIONS
  // ================================
  setShowAuthModal: (show) => {
    set(() => ({ showAuthModal: show }));
    logOperation('setShowAuthModal', { show });
  },

  setAuthMode: (mode) => {
    set(() => ({ authMode: mode }));
    logOperation('setAuthMode', { mode });
  },

  checkAuthStatus: async () => {
    const { isAuthenticated, logout } = get();
    
    if (!isAuthenticated) {
      logout();
      return;
    }

    set(() => ({ loading: true, error: null }));
    
    try {
      const user = await authService.getCurrentUser();
      set(() => ({ 
        isAuthenticated: true, 
        currentUser: user,
        loading: false 
      }));
      
      // Fetch initial data in parallel
      const store = get();
      await Promise.all([
        store.fetchBoards?.(),
        store.fetchAllTasks?.(),
        store.fetchNotifications?.(),
      ]);
      
      logOperation('checkAuthStatus', { userId: user.id });
    } catch (error: any) {
      logError('checkAuthStatus', error);
      handleApiError(error, get().logout, set);
    }
  },

  login: async (email, password) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const response = await authService.login(email, password);
      setTokens(response.access_token, response.refresh_token);
      
      set(() => ({
        isAuthenticated: true,
        currentUser: response.user,
        showAuthModal: false,
        loading: false,
      }));
      
      await get().checkAuthStatus();
      logOperation('login', { userId: response.user.id, email });
      
      return { success: true };
    } catch (error: any) {
      logError('login', error);
      handleApiError(error, get().logout, set);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  },

  signup: async (name, email, password) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const response = await authService.signup(name, email, password);
      setTokens(response.access_token, response.refresh_token);
      
      set(() => ({
        isAuthenticated: true,
        currentUser: response.user,
        showAuthModal: false,
        loading: false,
        // Reset other state for new user
        boards: [],
        notifications: [],
      }));
      
      logOperation('signup', { userId: response.user.id, email });
      return { success: true };
    } catch (error: any) {
      logError('signup', error);
      
      const errorMessage = error.statusCode === 409 
        ? 'Email already exists'
        : error.statusCode === 400
          ? error.errors?.password || 'Invalid input data'
          : 'Failed to create account';
      
      set(() => ({ error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  },

  loginAsDemo: async () => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const email = import.meta.env.VITE_DEMO_EMAIL;
      const password = import.meta.env.VITE_DEMO_PASSWORD;

      if (!email || !password) {
        throw new Error('Demo credentials not configured');
      }

      const response = await authService.login(email, password);
      setTokens(response.access_token, response.refresh_token);

      set(() => ({
        isAuthenticated: true,
        currentUser: response.user,
        showAuthModal: false,
        loading: false,
      }));

      await get().checkAuthStatus();
      logOperation('loginAsDemo', { userId: response.user.id });
      
      return { success: true };
    } catch (error: any) {
      logError('loginAsDemo', error);
      handleApiError(error, get().logout, set);
      return { success: false, error: error.message || 'Demo login failed' };
    }
  },

logout: () => {
  // Prevent multiple logout calls
  const currentState = get();
  if (!currentState.isAuthenticated) {
    return; // Already logged out
  }

  clearTokens();
  
  set(() => ({
    // Reset auth state
    isAuthenticated: false,
    currentUser: null,
    showAuthModal: false,
    authMode: 'login',
    loading: false,
    error: null,
    
    // Reset all other state
    boards: [],
    selectedBoard: null,
    currentView: 'dashboard',
    boardMembers: [],
    boardColumns: [],
    boardTasks: {},
    notifications: [],
    users: [],
    
    // Reset loading states
    boardsLoading: false,
    membersLoading: false,
    columnsLoading: false,
    tasksLoading: false,
    notificationsLoading: false,
  }));
  
  logOperation('logout');
},


  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Auth');
  },
});