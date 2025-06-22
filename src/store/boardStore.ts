import { create } from 'zustand';
import type { 
  Board, 
  Task, 
  Column, 
  User, 
  AuthUser,
  CreateBoardData,
  CreateColumnData,
  CreateTaskRequestData,
  CreateColumnRequestData,
  UpdateTaskData,
  MoveTaskData,
  AddAssigneeData,
  AddTagData,
  AddMemberData,
  Member,
  Notification,
  NotificationResponse,
  CurrentView,
  ViewMode,
  Priority,
  ApiError
} from '../types/types';

// Service imports (only importing services, not types)
import { authService } from '../services/authService';
import { boardService } from '../services/boardService';
import { memberService } from '../services/memberService';
import { columnService } from '../services/columnService';
import { taskService } from '../services/taskService';
import { notificationService } from '../services/notificationService';



interface BoardStore {

  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  showAuthModal: boolean;
  authMode: 'login' | 'signup';


  boards: Board[];
  selectedBoard: Board | null;
  currentView: CurrentView;
  viewMode: ViewMode;
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
  users: User[];
  notifications: Notification[];

  loading: boolean;
  error: string | null;
  boardsLoading: boolean;
  membersLoading: boolean;
  columnsLoading: boolean;
  tasksLoading: boolean;
  notificationsLoading: boolean;


  boardMembers: Member[];
  boardColumns: Column[];
  boardTasks: Record<string, Task[]>; // columnId -> tasks

  showNewBoardModal: boolean;
  showNewTaskModal: boolean;
  showNewColumnModal: boolean;
  showAddMemberModal: boolean;
  selectedColumn: string;

  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;

  setCurrentView: (view: CurrentView) => void;
  setSelectedBoard: (board: Board | null) => void;
  setViewMode: (mode: ViewMode) => void;
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
  createTask: (columnId: string, taskData: CreateTaskRequestData) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (moveData: MoveTaskData) => Promise<void>;
  addAssignee: (taskId: string, userId: string) => Promise<void>;
  removeAssignee: (taskId: string, userId: string) => Promise<void>;
  addTag: (taskId: string, tag: string) => Promise<void>;
  removeTag: (taskId: string, tag: string) => Promise<void>;


  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  getUnreadNotificationCount: () => number;


  getFilteredBoards: () => Board[];
  getTaskById: (taskId: string) => { task: Task; columnId: string } | null;
  getTasksByStatus: (status: string) => Task[];
  getTasksByPriority: (priority: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  searchTasks: (searchTerm: string) => Task[];
  refreshBoardTasks: (boardId: string) => Promise<void>;
}


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

const handleApiError = (error: ApiError, logout: () => void, set: any) => {
  console.error('[API Error]', error);
  
  if (error.statusCode === 401 || error.message?.includes('unauthorized')) {
    logout();
    return;
  }

  const errorMessage = error.message || 'An unexpected error occurred';
  set({ 
    error: errorMessage, 
    loading: false, 
    boardsLoading: false,
    membersLoading: false,
    columnsLoading: false,
    tasksLoading: false,
    notificationsLoading: false
  });
};

const transformApiTaskToTask = (apiTask: any): Task => ({
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


export const useBoardStore = create<BoardStore>((set, get) => ({
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
  users: [],
  notifications: [],
  loading: false,
  error: null,
  boardsLoading: false,
  membersLoading: false,
  columnsLoading: false,
  tasksLoading: false,
  notificationsLoading: false,
  boardMembers: [],
  boardColumns: [],
  boardTasks: {},
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

  checkAuthStatus: async () => {
    if (!isTokenValid()) {
      get().logout();
      return;
    }
    
    set({ loading: true, error: null });
    try {
      const user = await authService.getCurrentUser();
      set({ isAuthenticated: true, currentUser: user });
      
      // Fetch initial data in parallel
      await Promise.all([
        get().fetchBoards(),
        get().fetchAllTasks(),
        get().fetchNotifications(),
      ]);
      
      set({ loading: false });
      console.log('[Auth] Successfully initialized app with user data');
    } catch (error: any) {
      console.error('[Auth] Error during auth check:', error);
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
      const errorMessage = error.statusCode === 409 
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
      notifications: [],
      selectedBoard: null,
      currentView: 'dashboard',
      boardMembers: [],
      boardColumns: [],
      boardTasks: {},
      error: null,
      loading: false,
      boardsLoading: false,
      membersLoading: false,
      columnsLoading: false,
      tasksLoading: false,
      notificationsLoading: false,
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
    set({ boardsLoading: true, error: null });
    try {
      const boards = await boardService.getBoards();
      set({ boards, boardsLoading: false });
      console.log(`[Boards] Fetched ${boards.length} boards`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  createBoard: async (boardData) => {
    set({ boardsLoading: true, error: null });
    try {
      const newBoard = await boardService.createBoard(boardData);
      set((state) => ({
        boards: [...state.boards, newBoard],
        showNewBoardModal: false,
        boardsLoading: false,
      }));
      console.log(`[Boards] Created board: ${newBoard.id}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  updateBoard: async (boardId, updates) => {
    set({ boardsLoading: true, error: null });
    try {
      const updatedBoard = await boardService.updateBoard(boardId, updates);
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        boardsLoading: false,
      }));
      console.log(`[Boards] Updated board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  deleteBoard: async (boardId) => {
    set({ boardsLoading: true, error: null });
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
        boardsLoading: false,
      }));
      console.log(`[Boards] Deleted board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  starBoard: async (boardId) => {
    set({ boardsLoading: true, error: null });
    try {
      const updatedBoard = await boardService.starBoard(boardId);
      set((state) => ({
        boards: state.boards.map((b) => (b.id === boardId ? updatedBoard : b)),
        selectedBoard: state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard,
        boardsLoading: false,
      }));
      console.log(`[Boards] Starred board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // MEMBER OPERATIONS
  // ================================
  fetchMembers: async (boardId) => {
    set({ membersLoading: true, error: null });
    try {
      const members = await memberService.getMembers(boardId);
      set({ boardMembers: members, membersLoading: false });
      console.log(`[Members] Fetched ${members.length} members for board: ${boardId}`);
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
      console.log(`[Members] Added member to board: ${boardId}`);
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
      console.log(`[Members] Updated role for user: ${userId} in board: ${boardId}`);
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
      console.log(`[Members] Removed user: ${userId} from board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // COLUMN OPERATIONS
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
      console.log(`[Columns] Fetched ${columns.length} columns for board: ${boardId}`);
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
      console.log(`[Columns] Created column: ${newColumn.id} in board: ${boardId}`);
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
      console.log(`[Columns] Updated column: ${columnId}`);
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
      console.log(`[Columns] Deleted column: ${columnId}`);
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
      console.log(`[Columns] Reordered columns for board: ${boardId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // TASK OPERATIONS
  // ================================
  fetchTasks: async (columnId) => {
    set({ tasksLoading: true, error: null });
    try {
      const tasks = await taskService.getTasksByColumn(columnId);
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          [columnId]: tasks || [],
        },
        tasksLoading: false,
      }));
      console.log(`[Tasks] Fetched ${tasks?.length || 0} tasks for column: ${columnId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  fetchAllTasks: async () => {
    set({ tasksLoading: true, error: null });
    try {
      const response = await taskService.getAllTasks();
      const tasks = response.tasks || [];
      
      const tasksByColumn = tasks.reduce((acc: Record<string, Task[]>, apiTask: any) => {
        const transformedTask = transformApiTaskToTask(apiTask);
        const columnId = apiTask.column_id;
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
      
      console.log(`[Tasks] Fetched ${tasks.length} tasks across ${Object.keys(tasksByColumn).length} columns`);
    } catch (error: any) {
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
      const transformedTask = transformApiTaskToTask(newTask);
      
      set((state) => ({
        boardTasks: {
          ...state.boardTasks,
          [columnId]: [...(state.boardTasks[columnId] || []), transformedTask],
        },
        showNewTaskModal: false,
        tasksLoading: false,
      }));
      console.log(`[Tasks] Created task: ${newTask.id} in column: ${columnId}`);
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
      console.log(`[Tasks] Updated task: ${taskId}`);
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
      console.log(`[Tasks] Deleted task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  moveTask: async (moveData) => {
    set({ tasksLoading: true, error: null });
    try {
      const updatedTask = await taskService.moveTask(moveData);
      const transformedTask = transformApiTaskToTask(updatedTask);
      
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
            { ...transformedTask, column_id: targetColumnId, position: moveData.new_position },
          ].sort((a, b) => a.position - b.position);
        }

        return { boardTasks: newBoardTasks, tasksLoading: false };
      });
      console.log(`[Tasks] Moved task: ${moveData.task_id} to column: ${moveData.target_column_id}`);
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
      console.log(`[Tasks] Added assignee: ${userId} to task: ${taskId}`);
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
      console.log(`[Tasks] Removed assignee: ${userId} from task: ${taskId}`);
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
      console.log(`[Tasks] Added tag: ${tag} to task: ${taskId}`);
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
      console.log(`[Tasks] Removed tag: ${tag} from task: ${taskId}`);
    } catch (error: any) {
      handleApiError(error, get().logout, set);
    }
  },

  // ================================
  // NOTIFICATION OPERATIONS
  // ================================
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
      console.log(`[Notifications] Fetched ${notifications.length} notifications`);
    } catch (error: any) {
      console.error('[Notifications] Error fetching notifications:', error);
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
      
      console.log(`[Notifications] Marked notification ${notificationId} as read`);
    } catch (error: any) {
      console.error('[Notifications] Error marking notification as read:', error);
      handleApiError(error, get().logout, set);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
      
      console.log('[Notifications] Marked all notifications as read');
    } catch (error: any) {
      console.error('[Notifications] Error marking all notifications as read:', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));
      
      console.log(`[Notifications] Deleted notification ${notificationId}`);
    } catch (error: any) {
      console.error('[Notifications] Error deleting notification:', error);
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
      console.log(`[Tasks] Refreshing tasks for boardId: ${boardId}, ${relevantColumns.length} columns`);
      await Promise.all(relevantColumns.map((c) => get().fetchTasks(c.id)));
      console.log(`[Tasks] Successfully refreshed tasks for boardId: ${boardId}`);
      set({ tasksLoading: false });
    } catch (error: any) {
      console.error('[Tasks] Error refreshing tasks:', error);
      handleApiError(error, get().logout, set);
    }
  },
}));