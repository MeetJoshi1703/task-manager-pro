// src/store/hooks/useUI.ts
import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useUI = () => {
  // Individual selectors for optimal performance and no infinite loops
  const currentView = useBoardStore(state => state.currentView);
  const viewMode = useBoardStore(state => state.viewMode);
  const isDarkMode = useBoardStore(state => state.isDarkMode);
  const showNewBoardModal = useBoardStore(state => state.showNewBoardModal);
  const showNewTaskModal = useBoardStore(state => state.showNewTaskModal);
  const showNewColumnModal = useBoardStore(state => state.showNewColumnModal);
  const showAddMemberModal = useBoardStore(state => state.showAddMemberModal);
  const selectedColumn = useBoardStore(state => state.selectedColumn);
  
  // Actions (these are stable by default in Zustand)
  const setCurrentView = useBoardStore(state => state.setCurrentView);
  const setViewMode = useBoardStore(state => state.setViewMode);
  const setIsDarkMode = useBoardStore(state => state.setIsDarkMode);
  const setShowNewBoardModal = useBoardStore(state => state.setShowNewBoardModal);
  const setShowNewTaskModal = useBoardStore(state => state.setShowNewTaskModal);
  const setShowNewColumnModal = useBoardStore(state => state.setShowNewColumnModal);
  const setShowAddMemberModal = useBoardStore(state => state.setShowAddMemberModal);
  const setSelectedColumn = useBoardStore(state => state.setSelectedColumn);
  const setAuthMode = useBoardStore(state => state.setAuthMode);
  const setShowAuthModal = useBoardStore(state => state.setShowAuthModal);

  // Stable helper functions using useMemo
  const helpers = useMemo(() => ({
    toggleDarkMode: () => setIsDarkMode(!isDarkMode),
    toggleViewMode: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid'),
    
    openNewBoardModal: () => setShowNewBoardModal(true),
    closeNewBoardModal: () => setShowNewBoardModal(false),
    
    openNewTaskModal: (columnId?: string) => {
      if (columnId) setSelectedColumn(columnId);
      setShowNewTaskModal(true);
    },
    closeNewTaskModal: () => {
      setShowNewTaskModal(false);
      setSelectedColumn('');
    },
    
    openNewColumnModal: () => setShowNewColumnModal(true),
    closeNewColumnModal: () => setShowNewColumnModal(false),
    
    openAddMemberModal: () => setShowAddMemberModal(true),
    closeAddMemberModal: () => setShowAddMemberModal(false),

    // Auth helpers with safe fallback checks
    setAuthMode: (mode: 'login' | 'signup') => {
      if (setAuthMode) {
        setAuthMode(mode);
      }
    },

    setShowAuthModal: (show: boolean) => {
      if (setShowAuthModal) {
        setShowAuthModal(show);
      }
    },
  }), [
    isDarkMode, viewMode,
    setIsDarkMode, setViewMode, setShowNewBoardModal, 
    setShowNewTaskModal, setShowNewColumnModal, setShowAddMemberModal, 
    setSelectedColumn, setAuthMode, setShowAuthModal
  ]);

  // Computed values using useMemo
  const computed = useMemo(() => ({
    isGridView: viewMode === 'grid',
    isListView: viewMode === 'list',
    hasAnyModalOpen: showNewBoardModal || showNewTaskModal || 
                     showNewColumnModal || showAddMemberModal,
  }), [viewMode, showNewBoardModal, showNewTaskModal, 
       showNewColumnModal, showAddMemberModal]);

  return {
    // State
    currentView,
    viewMode,
    isDarkMode,
    showNewBoardModal,
    showNewTaskModal,
    showNewColumnModal,
    showAddMemberModal,
    selectedColumn,
    
    // Direct actions
    setCurrentView,
    setViewMode,
    setIsDarkMode,
    setShowNewBoardModal,
    setShowNewTaskModal,
    setShowNewColumnModal,
    setShowAddMemberModal,
    setSelectedColumn,
    
    // Helper functions
    ...helpers,
    
    // Computed
    ...computed,
  };
};