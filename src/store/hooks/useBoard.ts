import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useBoards = () => {
  // Individual selectors for optimal performance - these are stable
  const boards = useBoardStore(state => state.boards);
  const selectedBoard = useBoardStore(state => state.selectedBoard);
  const searchTerm = useBoardStore(state => state.searchTerm);
  const filterPriority = useBoardStore(state => state.filterPriority);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  
  // Actions (these are stable by default in Zustand)
  const setSelectedBoard = useBoardStore(state => state.setSelectedBoard);
  const setSearchTerm = useBoardStore(state => state.setSearchTerm);
  const setFilterPriority = useBoardStore(state => state.setFilterPriority);
  const fetchBoards = useBoardStore(state => state.fetchBoards);
  const createBoard = useBoardStore(state => state.createBoard);
  const updateBoard = useBoardStore(state => state.updateBoard);
  const deleteBoard = useBoardStore(state => state.deleteBoard);
  const starBoard = useBoardStore(state => state.starBoard);
  const getFilteredBoards = useBoardStore(state => state.getFilteredBoards);
  const clearError = useBoardStore(state => state.clearError);

  // Memoize computed properties
  const computed = useMemo(() => ({
    filteredBoards: getFilteredBoards(),
    starredBoards: boards.filter(board => board.isStarred),
    recentBoards: [...boards]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4),
  }), [boards, getFilteredBoards]);

  return {
    // State
    boards,
    selectedBoard,
    searchTerm,
    filterPriority,
    loading,
    error,
    
    // Actions
    setSelectedBoard,
    setSearchTerm,
    setFilterPriority,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    starBoard,
    getFilteredBoards,
    clearError,
    
    // Computed
    ...computed,
  };
};