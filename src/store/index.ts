import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CombinedStore } from './types/storeTypes';

// Import all slices
import { createAuthSlice } from './slices/authSlice';
import { createBoardSlice } from './slices/boardSlice';
import { createTaskSlice } from './slices/taskSlice';
import { createColumnSlice } from './slices/columnSlice';
import { createMemberSlice } from './slices/memberSlice';
import { createNotificationSlice } from './slices/notificationSlice';
import { createUISlice } from './slices/uiSlice';

// ============================================================================
// COMBINED STORE
// ============================================================================

export const useBoardStore = create<CombinedStore>()(
  devtools(
    (set, get) => ({
      // Combine all slices
      ...createAuthSlice(set, get),
      ...createBoardSlice(set, get),
      ...createTaskSlice(set, get),
      ...createColumnSlice(set, get),
      ...createMemberSlice(set, get),
      ...createNotificationSlice(set, get),
      ...createUISlice(set, get),
    }),
    {
      name: 'board-store',
      // Enable devtools only in development
      enabled: import.meta.env.DEV,
    }
  )
);

// ============================================================================
// STORE EXPORTS
// ============================================================================

// Export individual slices for testing
export { createAuthSlice } from './slices/authSlice';
export { createBoardSlice } from './slices/boardSlice';
export { createTaskSlice } from './slices/taskSlice';
export { createColumnSlice } from './slices/columnSlice';
export { createMemberSlice } from './slices/memberSlice';
export { createNotificationSlice } from './slices/notificationSlice';
export { createUISlice } from './slices/uiSlice';

// Export types
export type { CombinedStore } from './types/storeTypes';
export type * from './types/storeTypes';

// Export utilities
export * from './utils/storeUtils';

// ============================================================================
// STORE INITIALIZATION
// ============================================================================

// Initialize store on app start - but only once
let isInitialized = false;

if (typeof window !== 'undefined' && !isInitialized) {
  isInitialized = true;
  
  const store = useBoardStore.getState();
  
  // Load persisted preferences first
  const savedDarkMode = localStorage.getItem('isDarkMode');
  const savedViewMode = localStorage.getItem('viewMode');
  
  if (savedDarkMode !== null) {
    store.setIsDarkMode(JSON.parse(savedDarkMode));
  }
  
  if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
    store.setViewMode(savedViewMode as 'grid' | 'list');
  }
  
  // Check auth status on app load
  if (store.isAuthenticated) {
    store.checkAuthStatus().catch((error) => {
      console.error('[Store Init] Failed to check auth status:', error);
    });
  }
  
  // Log store initialization in development
  if (import.meta.env.DEV) {
    console.log('[Store] Initialized with state:', {
      isAuthenticated: store.isAuthenticated,
      currentView: store.currentView,
      isDarkMode: store.isDarkMode,
    });
  }
}

// ============================================================================
// STORE PERSISTENCE (Optional)
// ============================================================================

// Set up persistence subscriptions - but only once
let persistenceSetup = false;

if (typeof window !== 'undefined' && !persistenceSetup) {
  persistenceSetup = true;
  
  // Subscribe to dark mode changes
  let previousDarkMode = useBoardStore.getState().isDarkMode;
  useBoardStore.subscribe((state) => {
    if (state.isDarkMode !== previousDarkMode) {
      previousDarkMode = state.isDarkMode;
      localStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode));
    }
  });
  
  // Subscribe to view mode changes
  let previousViewMode = useBoardStore.getState().viewMode;
  useBoardStore.subscribe((state) => {
    if (state.viewMode !== previousViewMode) {
      previousViewMode = state.viewMode;
      localStorage.setItem('viewMode', state.viewMode);
    }
  });
}