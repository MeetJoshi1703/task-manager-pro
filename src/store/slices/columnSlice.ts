// src/store/slices/columnSlice.ts
import type { ColumnState, ColumnActions, StoreSlice } from '../types/storeTypes';
import { columnService } from '../../services/columnService';
import { 
  getInitialColumnState, 
  handleApiError,
  logOperation,
  logError,
  isValidColumn 
} from '../utils/storeUtils';

export const createColumnSlice: StoreSlice<ColumnState & ColumnActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialColumnState(),
  hasFetched: false,

  // ================================
  // COLUMN OPERATIONS
  // ================================
  fetchColumns: async (boardId) => {
      const state = get();

    set(() => ({ loading: true, error: null }));
    if (state.loading || state.hasFetched) {
      console.log('[Columns] Already fetched or loading, skipping...');
      return;
    }
    try {
      const columns = await columnService.getColumnsByBoard(boardId);
      const validColumns = columns.filter(isValidColumn);
      set(() => ({ boardColumns: columns, loading: false, hasFetched: true }));
      
      logOperation('fetchColumns', { boardId, count: validColumns.length });
    } catch (error: any) {
      logError('fetchColumns', error);
      handleApiError(error, get().logout, set);
      set(() => ({ loading: false, hasFetched: true }));
    }
  },

  createColumn: async (boardId, columnData) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const newColumn = await columnService.createColumn({
        board_id: boardId,
        title: columnData.title,
        color: columnData.color || '#6B7280',
      });
      
      if (!isValidColumn(newColumn)) {
        throw new Error('Invalid column data received from server');
      }
      
      set((state) => ({
        boardColumns: [...state.boardColumns, newColumn],
        boardTasks: { ...state.boardTasks, [newColumn.id]: [] },
        showNewColumnModal: false,
        loading: false,
      }));
      
      logOperation('createColumn', { columnId: newColumn.id, boardId, title: newColumn.title });
    } catch (error: any) {
      logError('createColumn', error);
      handleApiError(error, get().logout, set);
    }
  },

  updateColumn: async (columnId, updates) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedColumn = await columnService.updateColumn(columnId, updates);
      
      set((state) => ({
        boardColumns: state.boardColumns.map((c) =>
          c.id === columnId ? updatedColumn : c
        ),
        loading: false,
      }));
      
      logOperation('updateColumn', { columnId, updates: Object.keys(updates) });
    } catch (error: any) {
      logError('updateColumn', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteColumn: async (columnId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      await columnService.deleteColumn(columnId);
      
      set((state) => ({
        boardColumns: state.boardColumns.filter((c) => c.id !== columnId),
        boardTasks: Object.fromEntries(
          Object.entries(state.boardTasks).filter(([id]) => id !== columnId)
        ),
        loading: false,
      }));
      
      logOperation('deleteColumn', { columnId });
    } catch (error: any) {
      logError('deleteColumn', error);
      handleApiError(error, get().logout, set);
    }
  },

  reorderColumns: async (boardId, columns) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      await columnService.reorderColumns({ board_id: boardId, columns });
      
      set((state) => ({
        boardColumns: columns.map((col) => ({
          ...state.boardColumns.find((c) => c.id === col.id)!,
          position: col.position,
        })),
        loading: false,
      }));
      
      logOperation('reorderColumns', { boardId, columnsCount: columns.length });
    } catch (error: any) {
      logError('reorderColumns', error);
      handleApiError(error, get().logout, set);
    }
  },

  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Column');
  },
});

