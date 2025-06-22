// ============================================================================
// MEMBER SLICE
// ============================================================================

// src/store/slices/memberSlice.ts
import type { MemberState, MemberActions, StoreSlice } from '../types/storeTypes';
import { memberService } from '../../services/memberService';
import { 
  getInitialMemberState, 
  handleApiError,
  logOperation,
  logError 
} from '../utils/storeUtils';

export const createMemberSlice: StoreSlice<MemberState & MemberActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialMemberState(),
    hasFetched: false, // Add this line


  // ================================
  // MEMBER OPERATIONS
  // ================================

  fetchMembers: async (boardId) => {
  const state = get();
  if (state.loading || state.hasFetched) {
    console.log('[Members] Already fetched or loading, skipping...');
    return;
  }
  
  set(() => ({ loading: true, error: null }));
  
  try {
    const members = await memberService.getMembers(boardId);
    set(() => ({ 
      boardMembers: members, 
      loading: false,
      hasFetched: true 
    }));
    
    logOperation('fetchMembers', { boardId, count: members.length });
  } catch (error: any) {
    logError('fetchMembers', error);
    handleApiError(error, get().logout, set);
    set(() => ({ hasFetched: true })); // Mark as attempted even on error
  }
},
  addMember: async (boardId, memberData) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const newMember = await memberService.addMember(boardId, memberData);
      
      set((state) => ({
        boardMembers: [...state.boardMembers, newMember],
        showAddMemberModal: false,
        loading: false,
      }));
      
      logOperation('addMember', { boardId, email: memberData.email, role: memberData.role });
    } catch (error: any) {
      logError('addMember', error);
      handleApiError(error, get().logout, set);
    }
  },

  updateMemberRole: async (boardId, userId, role) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedMember = await memberService.updateMemberRole(boardId, userId, role);
      
      set((state) => ({
        boardMembers: state.boardMembers.map((m) =>
          m.user_id === userId ? updatedMember : m
        ),
        loading: false,
      }));
      
      logOperation('updateMemberRole', { boardId, userId, role });
    } catch (error: any) {
      logError('updateMemberRole', error);
      handleApiError(error, get().logout, set);
    }
  },

  removeMember: async (boardId, userId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      await memberService.removeMember(boardId, userId);
      
      set((state) => ({
        boardMembers: state.boardMembers.filter((m) => m.user_id !== userId),
        loading: false,
      }));
      
      logOperation('removeMember', { boardId, userId });
    } catch (error: any) {
      logError('removeMember', error);
      handleApiError(error, get().logout, set);
    }
  },

  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Member');
  },
});

