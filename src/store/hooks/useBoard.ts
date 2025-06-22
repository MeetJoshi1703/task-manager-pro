import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useBoards = () => {
  // Individual selectors for optimal performance
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
  const clearError = useBoardStore(state => state.clearError);
  const hasFetched = useBoardStore(state => state.hasFetched); // Add this

  // Compute filtered boards directly instead of using the store function
  const computed = useMemo(() => {
    // Filter boards inline instead of calling getFilteredBoards()
    let filtered = boards;
    
    if (searchTerm) {
      filtered = filtered.filter(board => 
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(board => board.priority === filterPriority);
    }

    return {
      filteredBoards: filtered,
      starredBoards: boards.filter(board => board.isStarred),
      recentBoards: [...boards]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 4),
    };
  }, [boards, searchTerm, filterPriority]); // Only depend on actual state values

  return {
    // State
    boards,
    selectedBoard,
    searchTerm,
    filterPriority,
    loading,
    error,
    hasFetched,
    // Actions
    setSelectedBoard,
    setSearchTerm,
    setFilterPriority,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    starBoard,
    clearError,
    
    // Computed
    ...computed,
  };
};