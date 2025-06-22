import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useTasks = () => {
  // Individual selectors
  const boardTasks = useBoardStore(state => state.boardTasks);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  
  // Actions
  const fetchTasks = useBoardStore(state => state.fetchTasks);
  const fetchAllTasks = useBoardStore(state => state.fetchAllTasks);
  const createTask = useBoardStore(state => state.createTask);
  const updateTask = useBoardStore(state => state.updateTask);
  const deleteTask = useBoardStore(state => state.deleteTask);
  const moveTask = useBoardStore(state => state.moveTask);
  const addAssignee = useBoardStore(state => state.addAssignee);
  const removeAssignee = useBoardStore(state => state.removeAssignee);
  const addTag = useBoardStore(state => state.addTag);
  const removeTag = useBoardStore(state => state.removeTag);
  const getTaskById = useBoardStore(state => state.getTaskById);
  const getTasksByStatus = useBoardStore(state => state.getTasksByStatus);
  const getTasksByPriority = useBoardStore(state => state.getTasksByPriority);
  const getTasksByAssignee = useBoardStore(state => state.getTasksByAssignee);
  const searchTasks = useBoardStore(state => state.searchTasks);
  const refreshBoardTasks = useBoardStore(state => state.refreshBoardTasks);
  const clearError = useBoardStore(state => state.clearError);

  // Computed values
  const computed = useMemo(() => {
    const allTasks = Object.values(boardTasks).flat();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const overdueTasks = allTasks.filter(task => 
      task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
    );

    return {
      allTasks,
      totalTasks,
      completedTasks,
      completionRate,
      overdueTasks,
      todoTasks: allTasks.filter(task => task.status === 'todo'),
      inProgressTasks: allTasks.filter(task => task.status === 'in_progress'),
      blockedTasks: allTasks.filter(task => task.status === 'blocked'),
      highPriorityTasks: allTasks.filter(task => task.priority === 'high' || task.priority === 'critical'),
    };
  }, [boardTasks]);

  return {
    // State
    boardTasks,
    loading,
    error,
    
    // Actions
    fetchTasks,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addAssignee,
    removeAssignee,
    addTag,
    removeTag,
    getTaskById,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByAssignee,
    searchTasks,
    refreshBoardTasks,
    clearError,
    
    // Computed
    ...computed,
  };
};
