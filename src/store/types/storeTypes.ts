// src/store/types/storeTypes.ts
import type {
  Board,
  Task,
  Column,
  User,
  AuthUser,
  CreateBoardData,
  CreateColumnData,
  CreateTaskRequestData,
  UpdateTaskData,
  MoveTaskData,
  AddMemberData,
  Member,
  Notification,
  CurrentView,
  ViewMode,
} from '../../types/types';

// ============================================================================
// AUTH SLICE STATE
// ============================================================================
export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  showAuthModal: boolean;
  authMode: 'login' | 'signup';
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// BOARD SLICE STATE
// ============================================================================
export interface BoardState {
  boards: Board[];
  selectedBoard: Board | null;
  searchTerm: string;
  filterPriority: string;
  loading: boolean;
  error: string | null;
}

export interface BoardActions {
  setSelectedBoard: (board: Board | null) => void;
  setSearchTerm: (term: string) => void;
  setFilterPriority: (priority: string) => void;
  fetchBoards: () => Promise<void>;
  createBoard: (boardData: CreateBoardData) => Promise<void>;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  starBoard: (boardId: string) => Promise<void>;
  getFilteredBoards: () => Board[];
  clearError: () => void;
}

// ============================================================================
// TASK SLICE STATE
// ============================================================================
export interface TaskState {
  boardTasks: Record<string, Task[]>; // columnId -> tasks
  loading: boolean;
  error: string | null;
}

export interface TaskActions {
  fetchTasks: (columnId: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  createTask: (columnId: string, taskData: CreateTaskRequestData) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (moveData: MoveTaskData) => Promise<void>;
  addAssignee: (taskId: string, userId: string) => Promise<void>;
  removeAssignee: (taskId: string, userId: string) => Promise<void>;
  addTag: (taskId: string, tag: string) => Promise<void>;
  removeTag: (taskId: string, tag: string) => Promise<void>;
  getTaskById: (taskId: string) => { task: Task; columnId: string } | null;
  getTasksByStatus: (status: string) => Task[];
  getTasksByPriority: (priority: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  searchTasks: (searchTerm: string) => Task[];
  refreshBoardTasks: (boardId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// COLUMN SLICE STATE
// ============================================================================
export interface ColumnState {
  boardColumns: Column[];
  loading: boolean;
  error: string | null;
}

export interface ColumnActions {
  fetchColumns: (boardId: string) => Promise<void>;
  createColumn: (boardId: string, columnData: CreateColumnData) => Promise<void>;
  updateColumn: (columnId: string, updates: { title?: string; color?: string }) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (boardId: string, columns: { id: string; position: number }[]) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// MEMBER SLICE STATE
// ============================================================================
export interface MemberState {
  boardMembers: Member[];
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface MemberActions {
  fetchMembers: (boardId: string) => Promise<void>;
  addMember: (boardId: string, memberData: AddMemberData) => Promise<void>;
  updateMemberRole: (boardId: string, userId: string, role: 'admin' | 'member' | 'viewer') => Promise<void>;
  removeMember: (boardId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// NOTIFICATION SLICE STATE
// ============================================================================
export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export interface NotificationActions {
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getUnreadNotificationCount: () => number;
  clearError: () => void;
}

// ============================================================================
// UI SLICE STATE
// ============================================================================
export interface UIState {
  currentView: CurrentView;
  viewMode: ViewMode;
  isDarkMode: boolean;
  showNewBoardModal: boolean;
  showNewTaskModal: boolean;
  showNewColumnModal: boolean;
  showAddMemberModal: boolean;
  selectedColumn: string;
}

export interface UIActions {
  setCurrentView: (view: CurrentView) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setShowNewBoardModal: (show: boolean) => void;
  setShowNewTaskModal: (show: boolean) => void;
  setShowNewColumnModal: (show: boolean) => void;
  setShowAddMemberModal: (show: boolean) => void;
  setSelectedColumn: (columnId: string) => void;
}

// ============================================================================
// COMBINED STORE TYPE
// ============================================================================
export interface CombinedStore extends
  AuthState,
  BoardState,
  TaskState,
  ColumnState,
  MemberState,
  NotificationState,
  UIState,
  AuthActions,
  BoardActions,
  TaskActions,
  ColumnActions,
  MemberActions,
  NotificationActions,
  UIActions {}

// ============================================================================
// SLICE CREATOR TYPES
// ============================================================================
export type StoreSlice<T> = (
  set: (fn: (state: CombinedStore) => Partial<CombinedStore>) => void,
  get: () => CombinedStore
) => T;