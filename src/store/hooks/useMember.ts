import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useMembers = () => {
  // Individual selectors
  const boardMembers = useBoardStore(state => state.boardMembers);
  const users = useBoardStore(state => state.users);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  
  // Actions
  const fetchMembers = useBoardStore(state => state.fetchMembers);
  const addMember = useBoardStore(state => state.addMember);
  const updateMemberRole = useBoardStore(state => state.updateMemberRole);
  const removeMember = useBoardStore(state => state.removeMember);
  const clearError = useBoardStore(state => state.clearError);

  // Computed values
  const computed = useMemo(() => ({
    memberCount: boardMembers.length,
    adminMembers: boardMembers.filter(member => member.role === 'admin'),
    regularMembers: boardMembers.filter(member => member.role === 'member'),
    viewerMembers: boardMembers.filter(member => member.role === 'viewer'),
  }), [boardMembers]);

  return {
    // State
    boardMembers,
    users,
    loading,
    error,
    
    // Actions
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    clearError,
    
    // Computed
    ...computed,
  };
};

