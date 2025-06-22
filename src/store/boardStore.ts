import { create } from 'zustand';
import type { Board, Task, Column, User, CreateBoardData } from '../types/types';
import { authService } from '../services/authService';
import { boardService } from '../services/boardService';
import { memberService, type Member, type AddMemberData } from '../services/memberService';
import { columnService, type CreateColumnData as CreateColumnServiceData } from '../services/columnService';
import { taskService, type CreateTaskData as CreateTaskServiceData, type UpdateTaskData, type MoveTaskData } from '../services/taskService';
import { notificationService, type NotificationResponse } from '../services/notificationService';

// ================================
// INTERFACES & TYPES
// ================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
  boardId?: string;
  boardTitle?: string; 
}


export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

interface BoardStore {
  
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  showAuthModal: boolean;
  authMode: 'login' | 'signup';
  boards: Board[];
  selectedBoard: Board | null;
  currentView: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks' | 'notifications' | 'settings';
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
  users: User[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  boardMembers: Member[];
  boardColumns: Column[];
  notificationsLoading: boolean;
  boardTasks: Record<string, Task[]>;
  membersLoading: boolean;
  columnsLoading: boolean;
  tasksLoading: boolean;
  showNewBoardModal: boolean;
  showNewTaskModal: boolean;
  showNewColumnModal: boolean;
  showAddMemberModal: boolean;
  selectedColumn: string;
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  setCurrentView: (view: BoardStore['currentView']) => void;
  setSelectedBoard: (board: Board | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchTerm: (term: string) => void;
  setFilterPriority: (priority: string) => void;
  setIsDarkMode: (isDark: boolean) => void;
  clearError: () => void;
  setShowNewBoardModal: (show: boolean) => void;
  setShowNewTaskModal: (show: boolean) => void;
  setShowNewColumnModal: (show: boolean) => void;
  setShowAddMemberModal: (show: boolean) => void;
  setSelectedColumn: (columnId: string) => void;
  fetchBoards: () => Promise<void>;
  createBoard: (boardData: CreateBoardData) => Promise<void>;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  starBoard: (boardId: string) => Promise<void>;
  fetchMembers: (boardId: string) => Promise<void>;
  addMember: (boardId: string, memberData: AddMemberData) => Promise<void>;
  updateMemberRole: (boardId: string, userId: string, role: 'admin' | 'member' | 'viewer') => Promise<void>;
  removeMember: (boardId: string, userId: string) => Promise<void>;
  fetchColumns: (boardId: string) => Promise<void>;
  createColumn: (boardId: string, columnData: CreateColumnData) => Promise<void>;
  updateColumn: (columnId: string, updates: { title?: string; color?: string }) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  reorderColumns: (boardId: string, columns: { id: string; position: number }[]) => Promise<void>;
  fetchTasks: (columnId: string) => Promise<void>;
  fetchAllTasks: () => Promise<void>;
  createTask: (columnId: string, taskData: CreateTaskServiceData) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (moveData: MoveTaskData) => Promise<void>;
  addAssignee: (taskId: string, userId: string) => Promise<void>;
  removeAssignee: (taskId: string, userId: string) => Promise<void>;
  addTag: (taskId: string, tag: string) => Promise<void>;
  removeTag: (taskId: string, tag: string) => Promise<void>;
  getFilteredBoards: () => Board[];
  getTaskById: (taskId: string) => { task: Task; columnId: string } | null;
  getTasksByStatus: (status: string) => Task[];
  getTasksByPriority: (priority: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  searchTasks: (searchTerm: string) => Task[];
  refreshBoardTasks: (boardId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getUnreadNotificationCount: () => number;

}

// ================================
// INITIAL DATA & HELPERS
// ================================

const initialUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', avatar: '👨‍💼' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', avatar: '👩‍💼' },
  { id: '3', name: 'Mike Chen', email: 'mike@company.com', avatar: '👨‍💻' },
  { id: '4', name: 'Emma Davis', email: 'emma@company.com', avatar: '👩‍🎨' },
  { id: '5', name: 'Alex Wilson', email: 'alex@company.com', avatar: '👨‍🔬' },
];

const demoUser: AuthUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@company.com',
  avatar: '👨‍💼',
  role: 'admin',
  joinedAt: '2024-01-15',
};

const isTokenValid = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

const handleApiError = (error: any, logout: () => void, set: any) => {
  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    logout();
    return;
  }
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  set({ error: errorMessage, loading: false, tasksLoading: false });
  console.error('[API Error]', error);
};

// ================================
// ZUSTAND STORE IMPLEMENTATION
// ================================

export const useBoardStore = create<BoardStore>((set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  isAuthenticated: isTokenValid(),
  currentUser: null,
  showAuthModal: false,
  authMode: 'login',
  boards: [],
  selectedBoard: null,
  currentView: 'dashboard',
  viewMode: 'grid',
  searchTerm: '',
  filterPriority: 'all',
  isDarkMode: true,
  users: initialUsers,
  notifications: [],
  loading: false,
  error: null,
  boardMembers: [],
  boardColumns: [],
  boardTasks: {},
  membersLoading: false,
  columnsLoading: false,
  tasksLoading: false,
  notificationsLoading: false,
  showNewBoardModal: false,
  showNewTaskModal: false,
  showNewColumnModal: false,
  showAddMemberModal: false,
  selectedColumn: '',

  // ================================
  // AUTHENTICATION ACTIONS
  // ================================

  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setAuthMode: (mode) => set({ authMode: mode }),

  // Update your checkAuthStatus function to include notifications
  checkAuthStatus: async () => {
    if (!isTokenValid()) {
      get().logout();
      return;
    }
    set({ loading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ isAuthenticated: true, currentUser: user });
      
      // Fetch initial data
      await Promise.all([
        get().fetchBoards(),
        get().fetchAllTasks(),
        get().fetchNotifications(), // Add this line
      ]);
      
      set({ loading: false });
      console.log('[checkAuthStatus] Initialized app with user data');
    } catch (error: any) {
      console.error('[checkAuthStatus] Error during auth check:', error);
      handleApiError(error, get().logout, set);
    }
  },


  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      set({
        isAuthenticated: true,
        currentUser: response.user,
        showAuthModal: false,
      });
      await get().checkAuthStatus();
      return { success: true };
    } catch (error: any) {
      handleApiError(error, get().logout, set);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.signup(name, email, password);
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      set({
        isAuthenticated: true,
        currentUser: response.user,
        showAuthModal: false,
        boards: [],
        notifications: [],
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.statusCode === 409
          ? 'Email already exists'
          : error.statusCode === 400
            ? error.errors?.password || 'Invalid input data'
            : 'Failed to create account';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

loginAsDemo: async () => {
  set({ loading: true, error: null });
  try {
    const email = import.meta.env.VITE_DEMO_EMAIL;
    const password = import.meta.env.VITE_DEMO_PASSWORD;

    const response = await authService.login(email, password);
    localStorage.setItem('authToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);

    set({
      isAuthenticated: true,
      currentUser: response.user,
      showAuthModal: false,
    });

    await get().checkAuthStatus();
    return { success: true };
  } catch (error: any) {
    handleApiError(error, get().logout, set);
    return { success: false, error: error.message || 'Demo login failed' };
  }
},


  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    set({
      isAuthenticated: false,
      currentUser: null,
      boards: [],
      users: [],
      notifications: [], // Clear notifications
      selectedBoard: null,
      currentView: 'dashboard',
      boardMembers: [],
      boardColumns: [],
      boardTasks: {},
      error: null,
      loading: false,
      tasksLoading: false,
      notificationsLoading: false, // Reset loading state
    });
  },

  // ================================
  // CORE APPLICATION ACTIONS
  // ================================

  setCurrentView: (view) => set({ currentView: view }),
  setSelectedBoard: (board) => set({ selectedBoard: board }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
  clearError: () => set({ error: null }),

  // ================================
  // MODAL ACTIONS
  // ================================

  setShowNewBoardModal: (show) => set({ showNewBoardModal: show }),
  setShowNewTaskModal: (show) => set({ showNewTaskModal: show }),
  setShowNewColumnModal: (show) => set({ showNewColumnModal: show }),
  setShowAddMemberModal: (show) => set({ showAddMemberModal: show }),
  setSelectedColumn: (columnId) => set({ selectedColumn: columnId }),



  // ================================
  // BOARD CRUD OPERATIONS
  // ================================

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const boards = await boardService.getBoards();
      set({ boards, loading: false });
      console.log(`[fetchBoards] Fetched ${boards.length} boards`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  createBoard: async (boardData) => {
    set({ loading: true, error: null });
    try {
      const newBoard = await boardService.createBoard(boardData);
      set((state) => ({
        boards: [...state.boards, newBoard],
        showNewBoardModal: false,
        loading: false,
      }));
      console.log(`[createBoard] Created board: ${newBoard.id}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  updateBoard: async (boardId, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedBoard = await boardService.updateBoard(boardId, updates);
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        loading: false,
      }));
      console.log(`[updateBoard] Updated board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  deleteBoard: async (boardId) => {
    set({ loading: true, error: null });
    try {
      await boardService.deleteBoard(boardId);
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== boardId),
        selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard,
        boardColumns: state.boardColumns.filter((c) => c.board_id !== boardId),
        boardTasks: Object.fromEntries(
          Object.entries(state.boardTasks).filter(([colId]) =>
            !state.boardColumns.find((c) => c.id === colId && c.board_id === boardId)
          )
        ),
        loading: false,
      }));
      console.log(`[deleteBoard] Deleted board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  starBoard: async (boardId) => {
    set({ loading: true, error: null });
    try {
      const updatedBoard = await boardService.starBoard(boardId);
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        loading: false,
      }));
      console.log(`[starBoard] Starred board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // MEMBER CRUD OPERATIONS
  // ================================

  fetchMembers: async (boardId) => {
    set({ membersLoading: true, error: null });
    try {
      const members = await memberService.getMembers(boardId);
      set({ boardMembers: members, membersLoading: false });
      console.log(`[fetchMembers] Fetched ${members.length} members for board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  addMember: async (boardId, memberData) => {
    set({ membersLoading: true, error: null });
    try {
      const newMember = await memberService.addMember(boardId, memberData);
      set((state) => ({
        boardMembers: [...state.boardMembers, newMember],
        showAddMemberModal: false,
        membersLoading: false,
      }));
      console.log(`[addMember] Added member to board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  updateMemberRole: async (boardId, userId, role) => {
    set({ membersLoading: true, error: null });
    try {
      const updatedMember = await memberService.updateMemberRole(boardId, userId, role);
      set((state) => ({
        boardMembers: state.boardMembers.map((m) =>
          m.user_id === userId ? updatedMember : m
        ),
        membersLoading: false,
      }));
      console.log(`[updateMemberRole] Updated role for user: ${userId} in board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  removeMember: async (boardId, userId) => {
    set({ membersLoading: true, error: null });
    try {
      await memberService.removeMember(boardId, userId);
      set((state) => ({
        boardMembers: state.boardMembers.filter((m) => m.user_id !== userId),
        membersLoading: false,
      }));
      console.log(`[removeMember] Removed user: ${userId} from board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // COLUMN CRUD OPERATIONS
  // ================================

  fetchColumns: async (boardId) => {
    set({ columnsLoading: true, error: null });
    try {
      const columns = await columnService.getColumnsByBoard(boardId);
      set((state) => ({
        boardColumns: [
          ...state.boardColumns.filter((c) => c.board_id !== boardId),
          ...columns,
        ],
        columnsLoading: false,
      }));
      console.log(`[fetchColumns] Fetched ${columns.length} columns for board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  createColumn: async (boardId, columnData) => {
    set({ columnsLoading: true, error: null });
    try {
      const newColumn = await columnService.createColumn({
        board_id: boardId,
        title: columnData.title,
        color: columnData.color || '#6B7280',
      });
      set((state) => ({
        boardColumns: [...state.boardColumns, newColumn],
        boardTasks: { ...state.boardTasks, [newColumn.id]: [] },
        showNewColumnModal: false,
        columnsLoading: false,
      }));
      console.log(`[createColumn] Created column: ${newColumn.id} in board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  updateColumn: async (columnId, updates) => {
    set({ columnsLoading: true, error: null });
    try {
      const updatedColumn = await columnService.updateColumn(columnId, updates);
      set((state) => ({
        boardColumns: state.boardColumns.map((c) =>
          c.id === columnId ? updatedColumn : c
        ),
        columnsLoading: false,
      }));
      console.log(`[updateColumn] Updated column: ${columnId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  deleteColumn: async (columnId) => {
    set({ columnsLoading: true, error: null });
    try {
      await columnService.deleteColumn(columnId);
      set((state) => ({
        boardColumns: state.boardColumns.filter((c) => c.id !== columnId),
        boardTasks: Object.fromEntries(
          Object.entries(state.boardTasks).filter(([id]) => id !== columnId)
        ),
        columnsLoading: false,
      }));
      console.log(`[deleteColumn] Deleted column: ${columnId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  reorderColumns: async (boardId, columns) => {
    set({ columnsLoading: true, error: null });
    try {
      await columnService.reorderColumns({ board_id: boardId, columns });
      set((state) => ({
        boardColumns: columns.map((col) => ({
          ...state.boardColumns.find((c) => c.id === col.id)!,
          position: col.position,
        })),
        columnsLoading: false,
      }));
      console.log(`[reorderColumns] Reordered columns for board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // TASK CRUD OPERATIONS
  // ================================

  fetchTasks: async (columnId) => {
    console.log(`[fetchTasks] Fetching tasks for columnId: ${columnId}`);
    set({ tasksLoading: true, error: null });
    try {
      const tasks = await taskService.getTasksByColumn(columnId);
      console.log(`[fetchTasks] Successfully fetched ${tasks?.length || 0} tasks for columnId: ${columnId}`);
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          [columnId]: tasks || [],
        },
        tasksLoading: false,
      }));
    } catch (error: any) {
      console.error(`[fetchTasks] Error fetching tasks for columnId: ${columnId}`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      handleApiError(error, get().logout, set);
    }
  },
fetchAllTasks: async () => {
  console.log('[fetchAllTasks] Fetching all tasks for current user');
  set({ tasksLoading: true, error: null });
  try {
    const response = await taskService.getAllTasks();
    const tasks = response.tasks; // Extract tasks array from response
    
    const tasksByColumn = tasks.reduce((acc: Record<string, Task[]>, task: any) => {
      // Transform API response to match your Task interface
      const transformedTask: Task = {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        position: task.position,
        due_date: task.due_date,
        created_by: task.created_by,
        columnId: task.column_id, // Map column_id to columnId
        created_at: task.created_at,
        updated_at: task.updated_at,
        board_id: task.board_id,
        assignees: task.task_assignees.map((assignee: any) => assignee.user_id),
        tags: task.task_tags.map((tag: any) => tag.tag),
      };
      
      const columnId = task.column_id;
      acc[columnId] = acc[columnId] || [];
      acc[columnId].push(transformedTask);
      return acc;
    }, {});
    
    set((state) => ({
      boardTasks: {
        ...state.boardTasks,
        ...tasksByColumn,
      },
      tasksLoading: false,
    }));
    
    console.log(`[fetchAllTasks] Successfully fetched ${tasks.length} tasks across ${Object.keys(tasksByColumn).length} columns`);
  } catch (error: any) {
    console.error('[fetchAllTasks] Error fetching all tasks:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    handleApiError(error, get().logout, set);
  }
},
  createTask: async (columnId, taskData) => {
    set({ tasksLoading: true, error: null });
    try {
      const taskPayload = {
        ...taskData,
        column_id: columnId,
        board_id: get().selectedBoard?.id || taskData.board_id,
      };
      const newTask = await taskService.createTask(taskPayload);
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          [columnId]: [...(state.boardTasks[columnId] || []), newTask],
        },
        showNewTaskModal: false,
        tasksLoading: false,
      }));
      console.log(`[createTask] Created task: ${newTask.id} in column: ${columnId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  updateTask: async (taskId, updates) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, ...updatedTask } : t
          );
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[updateTask] Updated task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  deleteTask: async (taskId) => {
    set({ tasksLoading: true, error: null });
    try {
      await taskService.deleteTask(taskId);
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].filter((t) => t.id !== taskId);
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[deleteTask] Deleted task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  moveTask: async (moveData) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.moveTask(moveData);
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        const sourceColumnId = moveData.source_column_id;
        const targetColumnId = moveData.target_column_id;

        if (sourceColumnId && newBoardTasks[sourceColumnId]) {
          newBoardTasks[sourceColumnId] = newBoardTasks[sourceColumnId].filter(
            (t) => t.id !== moveData.task_id
          );
        }

        if (targetColumnId && newBoardTasks[targetColumnId]) {
          newBoardTasks[targetColumnId] = [
            ...(newBoardTasks[targetColumnId] || []),
            { ...updatedTask, column_id: targetColumnId, position: moveData.new_position },
          ].sort((a, b) => a.position - b.position);
        }

        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[moveTask] Moved task: ${moveData.task_id} to column: ${moveData.target_column_id}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  addAssignee: async (taskId, userId) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.addAssignee(taskId, { user_id: userId });
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_assignees: updatedTask.task_assignees } : t
          );
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[addAssignee] Added assignee: ${userId} to task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  removeAssignee: async (taskId, userId) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.removeAssignee(taskId, userId);
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_assignees: updatedTask.task_assignees } : t
          );
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[removeAssignee] Removed assignee: ${userId} from task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  addTag: async (taskId, tag) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.addTag(taskId, { tag });
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_tags: updatedTask.task_tags } : t
          );
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[addTag] Added tag: ${tag} to task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  removeTag: async (taskId, tag) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.removeTag(taskId, tag);
      set((state) => {
        const newBoardTasks = { ...state.boardTasks };
        Object.keys(newBoardTasks).forEach((columnId) => {
          newBoardTasks[columnId] = newBoardTasks[columnId].map((t) =>
            t.id === taskId ? { ...t, task_tags: updatedTask.task_tags } : t
          );
        });
        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[removeTag] Removed tag: ${tag} from task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },
  // ================================
  // NOTIFICATION ACTIONS
  // ================================
// In your boardStore.ts, wrap fetchNotifications with useCallback equivalent
fetchNotifications: async () => {
  const state = get();
  if (state.notificationsLoading) return; // Prevent multiple simultaneous calls
  
  set({ notificationsLoading: true, error: null });
  try {
    const apiNotifications = await notificationService.getNotifications();
    
    // Transform API response to match store interface
    const notifications: Notification[] = apiNotifications.map((notif) => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      timestamp: notif.timestamp,
      read: notif.read,
      actionUrl: notif.action_url,
      avatar: notif.avatar,
      boardId: notif.board_id,
      boardTitle: notif.boards?.title,
    }));

    set({ notifications, notificationsLoading: false });
    console.log(`[fetchNotifications] Fetched ${notifications.length} notifications`);
  } catch (error: any) {
    console.error('[fetchNotifications] Error fetching notifications:', error);
    set({ 
      error: error.message || 'Failed to fetch notifications', 
      notificationsLoading: false 
    });
  }
},

  markNotificationAsRead: async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
      
      console.log(`[markNotificationAsRead] Marked notification ${notificationId} as read`);
    } catch (error: any) {
      console.error('[markNotificationAsRead] Error marking notification as read:', error);
      handleApiError(error, get().logout, set);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
      
      console.log('[markAllNotificationsAsRead] Marked all notifications as read');
    } catch (error: any) {
      console.error('[markAllNotificationsAsRead] Error marking all notifications as read:', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));
      
      console.log(`[deleteNotification] Deleted notification ${notificationId}`);
    } catch (error: any) {
      console.error('[deleteNotification] Error deleting notification:', error);
      handleApiError(error, get().logout, set);
    }
  },

  getUnreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,


  // ================================
  // UTILITY FUNCTIONS
  // ================================

  getFilteredBoards: () => {
    const { boards, searchTerm, filterPriority } = get();
    return boards.filter((board) => {
      const matchesSearch =
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (board.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesPriority = filterPriority === 'all' || board.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  },

  getTaskById: (taskId) => {
    const { boardTasks } = get();
    for (const columnId in boardTasks) {
      const task = boardTasks[columnId].find((t) => t.id === taskId);
      if (task) return { task, columnId };
    }
    return null;
  },

  getTasksByStatus: (status) => {
    const { boardTasks } = get();
    return Object.values(boardTasks)
      .flat()
      .filter((t) => t.status === status);
  },

  getTasksByPriority: (priority) => {
    const { boardTasks } = get();
    return Object.values(boardTasks)
      .flat()
      .filter((t) => t.priority === priority);
  },

  getTasksByAssignee: (userId) => {
    const { boardTasks } = get();
    return Object.values(boardTasks)
      .flat()
      .filter((t) => t.task_assignees?.some((a) => a.user_id === userId));
  },

  searchTasks: (searchTerm) => {
    const { boardTasks } = get();
    const lowerSearch = searchTerm.toLowerCase();
    return Object.values(boardTasks)
      .flat()
      .filter(
        (t) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          (t.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
  },

  refreshBoardTasks: async (boardId) => {
    set({ tasksLoading: true, error: null });
    try {
      const { boardColumns } = get();
      const relevantColumns = boardColumns.filter((c) => c.board_id === boardId);
      console.log(`[refreshBoardTasks] Refreshing tasks for boardId: ${boardId}, ${relevantColumns.length} columns`);
      await Promise.all(relevantColumns.map((c) => get().fetchTasks(c.id)));
      console.log(`[refreshBoardTasks] Successfully refreshed tasks for boardId: ${boardId}`);
      set({ tasksLoading: false });
    } catch (error: any) {
      console.error('[refreshBoardTasks] Error refreshing tasks:', error);
      handleApiError(error, get().logout, set);
    }
  },
}));