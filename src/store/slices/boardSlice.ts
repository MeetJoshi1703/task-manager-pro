// src/store/slices/boardSlice.ts
import type { BoardState, BoardActions, StoreSlice } from '../types/storeTypes';
import { boardService } from '../../services/boardService';
import { 
  getInitialBoardState, 
  handleApiError,
  filterBoards,
  logOperation,
  logError,
  isValidBoard 
} from '../utils/storeUtils';

export const createBoardSlice: StoreSlice<BoardState & BoardActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialBoardState(),

  // ================================
  // STATE SETTERS
  // ================================
  setSelectedBoard: (board) => {
    set(() => ({ selectedBoard: board }));
    logOperation('setSelectedBoard', { boardId: board?.id });
  },

  setSearchTerm: (term) => {
    set(() => ({ searchTerm: term }));
    logOperation('setSearchTerm', { term });
  },

  setFilterPriority: (priority) => {
    set(() => ({ filterPriority: priority }));
    logOperation('setFilterPriority', { priority });
  },

  // ================================
  // BOARD CRUD OPERATIONS
  // ================================
  fetchBoards: async () => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const boards = await boardService.getBoards();
      
      // Validate boards data
      const validBoards = boards.filter(isValidBoard);
      if (validBoards.length !== boards.length) {
        console.warn('[Boards] Some boards failed validation and were filtered out');
      }
      
      set(() => ({ boards: validBoards, loading: false }));
      logOperation('fetchBoards', { count: validBoards.length });
    } catch (error: any) {
      logError('fetchBoards', error);
      handleApiError(error, get().logout, set);
    }
  },

  createBoard: async (boardData) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const newBoard = await boardService.createBoard(boardData);
      
      if (!isValidBoard(newBoard)) {
        throw new Error('Invalid board data received from server');
      }
      
      set((state) => ({
        boards: [...state.boards, newBoard],
        showNewBoardModal: false,
        loading: false,
      }));
      
      logOperation('createBoard', { boardId: newBoard.id, title: newBoard.title });
    } catch (error: any) {
      logError('createBoard', error);
      handleApiError(error, get().logout, set);
    }
  },

  updateBoard: async (boardId, updates) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedBoard = await boardService.updateBoard(boardId, updates);
      
      if (!isValidBoard(updatedBoard)) {
        throw new Error('Invalid updated board data received from server');
      }
      
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        loading: false,
      }));
      
      logOperation('updateBoard', { boardId, updates: Object.keys(updates) });
    } catch (error: any) {
      logError('updateBoard', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteBoard: async (boardId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      await boardService.deleteBoard(boardId);
      
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
        selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard,
        // Clean up related data
        boardColumns: state.boardColumns?.filter((c) => c.board_id !== boardId) || [],
        boardTasks: Object.fromEntries(
          Object.entries(state.boardTasks || {}).filter(([colId]) =>
            !(state.boardColumns || []).find((c) => c.id === colId && c.board_id === boardId)
          )
        ),
        loading: false,
      }));
      
      logOperation('deleteBoard', { boardId });
    } catch (error: any) {
      logError('deleteBoard', error);
      handleApiError(error, get().logout, set);
    }
  },

  starBoard: async (boardId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedBoard = await boardService.starBoard(boardId);
      
      if (!isValidBoard(updatedBoard)) {
        throw new Error('Invalid starred board data received from server');
      }
      
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        loading: false,
      }));
      
      logOperation('starBoard', { boardId, isStarred: updatedBoard.isStarred });
    } catch (error: any) {
      logError('starBoard', error);
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // UTILITY FUNCTIONS
  // ================================
  getFilteredBoards: () => {
    const { boards, searchTerm, filterPriority } = get();
    const filtered = filterBoards(boards, searchTerm, filterPriority);
    logOperation('getFilteredBoards', { 
      total: boards.length, 
      filtered: filtered.length,
      searchTerm,
      filterPriority 
    });
    return filtered;
  },

  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Board');
  },
});