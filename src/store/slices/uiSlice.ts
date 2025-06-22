
import type { UIState, UIActions, StoreSlice } from '../types/storeTypes';
import { getInitialUIState, logOperation } from '../utils/storeUtils';

export const createUISlice: StoreSlice<UIState & UIActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialUIState(),

  // ================================
  // UI STATE ACTIONS
  // ================================
  setCurrentView: (view) => {
    set(() => ({ currentView: view }));
    logOperation('setCurrentView', { view });
  },

  setViewMode: (mode) => {
    set(() => ({ viewMode: mode }));
    logOperation('setViewMode', { mode });
  },

  setIsDarkMode: (isDark) => {
    set(() => ({ isDarkMode: isDark }));
    logOperation('setIsDarkMode', { isDark });
  },

  // ================================
  // MODAL ACTIONS
  // ================================
  setShowNewBoardModal: (show) => {
    set(() => ({ showNewBoardModal: show }));
    logOperation('setShowNewBoardModal', { show });
  },

  setShowNewTaskModal: (show) => {
    set(() => ({ showNewTaskModal: show }));
    logOperation('setShowNewTaskModal', { show });
  },

  setShowNewColumnModal: (show) => {
    set(() => ({ showNewColumnModal: show }));
    logOperation('setShowNewColumnModal', { show });
  },

  setShowAddMemberModal: (show) => {
    set(() => ({ showAddMemberModal: show }));
    logOperation('setShowAddMemberModal', { show });
  },

  setSelectedColumn: (columnId) => {
    set(() => ({ selectedColumn: columnId }));
    logOperation('setSelectedColumn', { columnId });
  },
});