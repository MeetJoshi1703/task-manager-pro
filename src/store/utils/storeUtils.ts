// src/store/utils/storeUtils.ts
import type { Task, ApiError } from '../../types/types';
import type { CombinedStore } from '../types/storeTypes';

// ============================================================================
// TOKEN UTILITIES
// ============================================================================
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const clearTokens = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};

export const setTokens = (accessToken: string, refreshToken?: string): void => {
  localStorage.setItem('authToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

// ============================================================================
// ERROR HANDLING
// ============================================================================
export const handleApiError = (
  error: ApiError,
  logout: () => void,
  set: (fn: (state: CombinedStore) => Partial<CombinedStore>) => void
) => {
  console.error('[API Error]', error);

  if (error.statusCode === 401 || error.message?.includes('unauthorized')) {
    logout();
    return;
  }

  const errorMessage = error.message || 'An unexpected error occurred';
  set(() => ({
    error: errorMessage,
    loading: false,
    boardsLoading: false,
    membersLoading: false,
    columnsLoading: false,
    tasksLoading: false,
    notificationsLoading: false,
  }));
};

// ============================================================================
// DATA TRANSFORMERS
// ============================================================================
export const transformApiTaskToTask = (apiTask: any): Task => ({
  id: apiTask.id,
  title: apiTask.title,
  description: apiTask.description || '',
  status: apiTask.status,
  priority: apiTask.priority,
  position: apiTask.position,
  due_date: apiTask.due_date,
  created_by: apiTask.created_by,
  column_id: apiTask.column_id,
  board_id: apiTask.board_id,
  created_at: apiTask.created_at,
  updated_at: apiTask.updated_at,
  task_assignees: apiTask.task_assignees || [],
  task_tags: apiTask.task_tags || [],
  // Frontend compatibility fields
  createdBy: apiTask.created_by,
  assignedTo: apiTask.task_assignees?.map((a: any) => a.user_id) || [],
  dueDate: apiTask.due_date,
  tags: apiTask.task_tags?.map((t: any) => t.tag) || [],
  columnId: apiTask.column_id,
  order: apiTask.position,
  createdAt: apiTask.created_at,
  updatedAt: apiTask.updated_at,
});

export const transformApiNotificationToNotification = (apiNotif: any) => ({
  id: apiNotif.id,
  title: apiNotif.title,
  message: apiNotif.message,
  type: apiNotif.type,
  timestamp: apiNotif.timestamp,
  read: apiNotif.read,
  actionUrl: apiNotif.action_url,
  avatar: apiNotif.avatar,
  boardId: apiNotif.board_id,
  boardTitle: apiNotif.boards?.title,
});

// ============================================================================
// STATE RESET UTILITIES
// ============================================================================
export const getInitialAuthState = () => ({
  isAuthenticated: isTokenValid(),
  currentUser: null,
  showAuthModal: false,
  authMode: 'login' as const,
  loading: false,
  error: null,
});

export const getInitialBoardState = () => ({
  boards: [],
  selectedBoard: null,
  searchTerm: '',
  filterPriority: 'all',
  loading: false,
  error: null,
});

export const getInitialTaskState = () => ({
  boardTasks: {},
  loading: false,
  error: null,
});

export const getInitialColumnState = () => ({
  boardColumns: [],
  loading: false,
  error: null,
});

export const getInitialMemberState = () => ({
  boardMembers: [],
  users: [],
  loading: false,
  error: null,
});

export const getInitialNotificationState = () => ({
  notifications: [],
  loading: false,
  error: null,
});

export const getInitialUIState = () => ({
  currentView: 'dashboard' as const,
  viewMode: 'grid' as const,
  isDarkMode: true,
  showNewBoardModal: false,
  showNewTaskModal: false,
  showNewColumnModal: false,
  showAddMemberModal: false,
  selectedColumn: '',
});

// ============================================================================
// LOGGING UTILITIES
// ============================================================================
export const logOperation = (operation: string, details?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[Store] ${operation}`, details);
  }
};

export const logError = (operation: string, error: any) => {
  if (import.meta.env.DEV) {
    console.error(`[Store Error] ${operation}`, error);
  }
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================
export const isValidBoard = (board: any): boolean => {
  return board && typeof board.id === 'string' && typeof board.title === 'string';
};

export const isValidTask = (task: any): boolean => {
  return task && typeof task.id === 'string' && typeof task.title === 'string';
};

export const isValidColumn = (column: any): boolean => {
  return column && typeof column.id === 'string' && typeof column.title === 'string';
};

// ============================================================================
// SEARCH & FILTER UTILITIES
// ============================================================================
export const filterBoards = (boards: any[], searchTerm: string, filterPriority: string) => {
  return boards.filter((board) => {
    const matchesSearch =
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (board.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesPriority = filterPriority === 'all' || board.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });
};

export const searchTasks = (boardTasks: Record<string, Task[]>, searchTerm: string): Task[] => {
  const lowerSearch = searchTerm.toLowerCase();
  return Object.values(boardTasks)
    .flat()
    .filter(
      (t) =>
        t.title.toLowerCase().includes(lowerSearch) ||
        (t.description?.toLowerCase().includes(lowerSearch) ?? false)
    );
};