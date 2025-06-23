// src/store/slices/taskSlice.ts
import type { TaskState, TaskActions, StoreSlice } from '../types/storeTypes';
import { taskService } from '../../services/taskService';
import { 
  getInitialTaskState, 
  handleApiError,
  transformApiTaskToTask,
  searchTasks as searchTasksUtil,
  logOperation,
  logError,
  isValidTask 
} from '../utils/storeUtils';

export const createTaskSlice: StoreSlice<TaskState & TaskActions> = (set, get) => ({

  ...getInitialTaskState(),
  hasFetched: {}, // Add this

fetchTasks: async (columnId) => {
    const state = get();
    
    // Prevent infinite loading - check if already loading or fetched for this column
    if (state.loading || state.hasFetched[columnId]) {
      console.log(`[Tasks] Already fetched or loading for column ${columnId}, skipping...`);
      return;
    }

    set(() => ({ loading: true, error: null }));
    
    try {
      console.log(`[Tasks] Starting fetch for column: ${columnId}`);
      const tasks = await taskService.getTasksByColumn(columnId);
      
      if (!Array.isArray(tasks)) {
        console.warn(`[Tasks] Invalid API response for column ${columnId}: tasks is not an array`);
        // Handle gracefully - set empty array
        set((state) => ({
          boardTasks: { ...state.boardTasks, [columnId]: [] },
          loading: false,
          hasFetched: { ...state.hasFetched, [columnId]: true },
        }));
        return;
      }
      
      const validTasks = tasks.filter(isValidTask);
      
      set((state) => ({
        boardTasks: { ...state.boardTasks, [columnId]: validTasks },
        loading: false,
        hasFetched: { ...state.hasFetched, [columnId]: true },
      }));
      
      logOperation('fetchTasks', { columnId, count: validTasks.length });
      console.log(`[Tasks] Fetch completed successfully for column: ${columnId}`);
      
    } catch (error: any) {
      console.error(`[Tasks] Fetch failed for column: ${columnId}`, error);
      logError('fetchTasks', error);
      set((state) => ({
        error: error.message || 'Failed to fetch tasks',
        loading: false,
        hasFetched: { ...state.hasFetched, [columnId]: true }, // Mark as attempted even if failed
      }));
    }
  },

  fetchAllTasks: async () => {
    set(() => ({ loading: true, error: null }));
    
    try {
      console.log('[Tasks] Starting fetch all tasks...');
      const response = await taskService.getAllTasks();
      const tasks = response.tasks || [];
      
      if (!Array.isArray(tasks)) {
        throw new Error('Invalid API response: tasks is not an array');
      }
      
      const tasksByColumn = tasks.reduce((acc: Record<string, any[]>, apiTask: any) => {
        if (!isValidTask(apiTask)) {
          console.warn('[Tasks] Invalid task filtered out:', apiTask.id);
          return acc;
        }
        
        const transformedTask = transformApiTaskToTask(apiTask);
        const columnId = apiTask.column_id;
        acc[columnId] = acc[columnId] || [];
        acc[columnId].push(transformedTask);
        return acc;
      }, {});
      
      // Mark all columns as fetched
      const fetchedColumns = Object.keys(tasksByColumn).reduce((acc, columnId) => {
        acc[columnId] = true;
        return acc;
      }, {} as Record<string, boolean>);
      
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          ...tasksByColumn,
        },
        loading: false,
        hasFetched: { ...state.hasFetched, ...fetchedColumns },
      }));
      
      logOperation('fetchAllTasks', { 
        totalTasks: tasks.length, 
        columns: Object.keys(tasksByColumn).length 
      });
      console.log('[Tasks] Fetch all tasks completed successfully');
      
    } catch (error: any) {
      console.error('[Tasks] Fetch all tasks failed:', error);
      logError('fetchAllTasks', error);
      set(() => ({
        error: error.message || 'Failed to fetch all tasks',
        loading: false,
      }));
    }
  },

  createTask: async (columnId, taskData) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const taskPayload = {
        ...taskData,
        column_id: columnId,
        board_id: get().selectedBoard?.id || taskData.board_id,
      };
      
      const newTask = await taskService.createTask(taskPayload);
      
      if (!isValidTask(newTask)) {
        throw new Error('Invalid task data received from server');
      }
      
      const transformedTask = transformApiTaskToTask(newTask);
      
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          [columnId]: [...(state.boardTasks[columnId] || []), transformedTask],
        },
        showNewTaskModal: false,
        loading: false,
      }));
      
      logOperation('createTask', { taskId: newTask.id, columnId, title: newTask.title });
    } catch (error: any) {
      logError('createTask', error);
      handleApiError(error, get().logout, set);
    }
  },

  updateTask: async (taskId, updates) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, ...updatedTask } : t
          );
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('updateTask', { taskId, updates: Object.keys(updates) });
    } catch (error: any) {
      logError('updateTask', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteTask: async (taskId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      await taskService.deleteTask(taskId);
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].filter((t) => t.id !== taskId);
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('deleteTask', { taskId });
    } catch (error: any) {
      logError('deleteTask', error);
      handleApiError(error, get().logout, set);
    }
  },

  moveTask: async (moveData) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.moveTask(moveData);
      const transformedTask = transformApiTaskToTask(updatedTask);
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        const sourceColumnId = moveData.source_column_id;
        const targetColumnId = moveData.target_column_id;

        // Remove from source column
        if (sourceColumnId && newBoardTasks[sourceColumnId]) {
          newBoardTasks[sourceColumnId] = newBoardTasks[sourceColumnId].filter(
            (t) => t.id !== moveData.task_id
          );
        }

        // Add to target column
        if (targetColumnId && newBoardTasks[targetColumnId]) {
          const updatedTaskWithPosition = {
            ...transformedTask,
            column_id: targetColumnId,
            position: moveData.new_position,
          };
          
          newBoardTasks[targetColumnId] = [
            ...(newBoardTasks[targetColumnId] || []),
            updatedTaskWithPosition,
          ].sort((a, b) => a.position - b.position);
        }

        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('moveTask', { 
        taskId: moveData.task_id, 
        from: moveData.source_column_id, 
        to: moveData.target_column_id 
      });
    } catch (error: any) {
      logError('moveTask', error);
      handleApiError(error, get().logout, set);
    }
  },

  addAssignee: async (taskId, userId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.addAssignee(taskId, { user_id: userId });
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_assignees: updatedTask.task_assignees } : t
          );
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('addAssignee', { taskId, userId });
    } catch (error: any) {
      logError('addAssignee', error);
      handleApiError(error, get().logout, set);
    }
  },

  removeAssignee: async (taskId, userId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.removeAssignee(taskId, userId);
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_assignees: updatedTask.task_assignees } : t
          );
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('removeAssignee', { taskId, userId });
    } catch (error: any) {
      logError('removeAssignee', error);
      handleApiError(error, get().logout, set);
    }
  },

  addTag: async (taskId, tag) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.addTag(taskId, { tag });
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_tags: updatedTask.task_tags } : t
          );
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('addTag', { taskId, tag });
    } catch (error: any) {
      logError('addTag', error);
      handleApiError(error, get().logout, set);
    }
  },

  removeTag: async (taskId, tag) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const updatedTask = await taskService.removeTag(taskId, tag);
      
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_tags: updatedTask.task_tags } : t
          );
        });
        return { boardTasks: newBoardTasks, loading: false };
      });
      
      logOperation('removeTag', { taskId, tag });
    } catch (error: any) {
      logError('removeTag', error);
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // UTILITY FUNCTIONS
  // ================================
  getTaskById: (taskId) => {
    const { boardTasks } = get();
    for (const columnId in boardTasks) {
      const task = boardTasks[columnId].find((t) => t.id === taskId);
      if (task) {
        logOperation('getTaskById', { taskId, columnId });
        return { task, columnId };
      }
    }
    return null;
  },

  getTasksByStatus: (status) => {
    const { boardTasks } = get();
    const tasks = Object.values(boardTasks)
      .flat()
      .filter((t) => t.status === status);
    
    logOperation('getTasksByStatus', { status, count: tasks.length });
    return tasks;
  },

  getTasksByPriority: (priority) => {
    const { boardTasks } = get();
    const tasks = Object.values(boardTasks)
      .flat()
      .filter((t) => t.priority === priority);
    
    logOperation('getTasksByPriority', { priority, count: tasks.length });
    return tasks;
  },

  getTasksByAssignee: (userId) => {
    const { boardTasks } = get();
    const tasks = Object.values(boardTasks)
      .flat()
      .filter((t) => t.task_assignees?.some((a) => a.user_id === userId));
    
    logOperation('getTasksByAssignee', { userId, count: tasks.length });
    return tasks;
  },

  searchTasks: (searchTerm) => {
    const { boardTasks } = get();
    const tasks = searchTasksUtil(boardTasks, searchTerm);
    
    logOperation('searchTasks', { searchTerm, count: tasks.length });
    return tasks;
  },

  refreshBoardTasks: async (boardId) => {
    set(() => ({ loading: true, error: null }));
    
    try {
      const { boardColumns } = get();
      const relevantColumns = (boardColumns || []).filter((c) => c.board_id === boardId);
      
      logOperation('refreshBoardTasks', { boardId, columnsCount: relevantColumns.length });
      
      await Promise.all(relevantColumns.map((c) => get().fetchTasks(c.id)));
      
      set(() => ({ loading: false }));
      logOperation('refreshBoardTasks - completed', { boardId });
    } catch (error: any) {
      logError('refreshBoardTasks', error);
      handleApiError(error, get().logout, set);
    }
  },

  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Task');
  },
});