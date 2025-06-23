import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useColumns = () => {
  // Individual selectors
  const boardColumns = useBoardStore(state => state.boardColumns);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  const hasFetched = useBoardStore(state => state.hasFetched);

  // Actions
  const fetchColumns = useBoardStore(state => state.fetchColumns);
  const createColumn = useBoardStore(state => state.createColumn);
  const updateColumn = useBoardStore(state => state.updateColumn);
  const deleteColumn = useBoardStore(state => state.deleteColumn);
  const reorderColumns = useBoardStore(state => state.reorderColumns);
  const clearError = useBoardStore(state => state.clearError);

  // Computed values
  const computed = useMemo(() => ({
    sortedColumns: [...boardColumns].sort((a, b) => (a.position || 0) - (b.position || 0)),
  }), [boardColumns]);

  return {
    // State
    boardColumns,
    loading,
    error,
    hasFetched,
    
    // Actions
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    clearError,

    
    // Computed
    ...computed,
  };
};

