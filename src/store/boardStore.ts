import { create } from 'zustand';
import type { Board, Task, Column, User, CreateBoardData, CreateTaskData, CreateColumnData } from '../types/types';

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
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

interface BoardStore {
  // Auth State
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  showAuthModal: boolean;
  authMode: 'login' | 'signup';

  // State
  boards: Board[];
  currentView: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks' | 'notifications' | 'settings';
  selectedBoard: Board | null;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
  users: User[];
  notifications: Notification[];

  // Modal states
  showNewBoardModal: boolean;
  showNewTaskModal: boolean;
  showNewColumnModal: boolean;
  selectedColumn: string;

  // Auth Actions
  setShowAuthModal: (show: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;

  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  getUnreadNotificationCount: () => number;

  // Actions
  setCurrentView: (view: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks' | 'notifications' | 'settings') => void;
  setSelectedBoard: (board: Board | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchTerm: (term: string) => void;
  setFilterPriority: (priority: string) => void;
  setIsDarkMode: (isDark: boolean) => void;
  
  // Modal actions
  setShowNewBoardModal: (show: boolean) => void;
  setShowNewTaskModal: (show: boolean) => void;
  setShowNewColumnModal: (show: boolean) => void;
  setSelectedColumn: (columnId: string) => void;

  // CRUD operations
  createBoard: (boardData: CreateBoardData) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  
  createTask: (columnId: string, taskData: CreateTaskData) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetColumnId: string, newOrder: number) => void;
  
  createColumn: (boardId: string, columnData: CreateColumnData) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (boardId: string, fromIndex: number, toIndex: number) => void; 

  // Utility functions
  getFilteredBoards: () => Board[];
  starBoard: (boardId: string) => void;
}

const initialBoards: Board[] = [
  {
    id: '1',
    title: 'Product Launch Q2',
    description: 'Coordinating all activities for the upcoming product launch',
    createdBy: 'John Doe',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10',
    members: ['John Doe', 'Sarah Johnson', 'Mike Chen'],
    taskCount: 24,
    completedTasks: 18,
    priority: 'high',
    isStarred: true,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        boardId: '1',
        order: 0,
        color: 'bg-slate-100',
        tasks: [
          {
            id: 'task-1',
            title: 'Design Landing Page',
            description: 'Create mockups for the new product landing page with modern design',
            createdBy: 'John Doe',
            assignedTo: ['Sarah Johnson'],
            priority: 'high',
            dueDate: '2024-06-20',
            tags: ['Design', 'UI/UX'],
            columnId: 'col-1',
            order: 0,
            createdAt: '2024-06-15',
            updatedAt: '2024-06-15'
          }
        ]
      },
      {
        id: 'col-2',
        title: 'In Progress',
        boardId: '1',
        order: 1,
        color: 'bg-blue-100',
        tasks: [
          {
            id: 'task-2',
            title: 'Backend API Development',
            description: 'Implement REST APIs for user management and product catalog',
            createdBy: 'Mike Chen',
            assignedTo: ['Mike Chen'],
            priority: 'critical',
            dueDate: '2024-06-18',
            tags: ['Backend', 'API'],
            columnId: 'col-2',
            order: 0,
            createdAt: '2024-06-10',
            updatedAt: '2024-06-16'
          }
        ]
      },
      {
        id: 'col-3',
        title: 'Review',
        boardId: '1',
        order: 2,
        color: 'bg-yellow-100',
        tasks: []
      },
      {
        id: 'col-4',
        title: 'Done',
        boardId: '1',
        order: 3,
        color: 'bg-green-100',
        tasks: [
          {
            id: 'task-3',
            title: 'Market Research',
            description: 'Comprehensive analysis of competitor products and pricing',
            createdBy: 'John Doe',
            assignedTo: ['John Doe'],
            priority: 'medium',
            dueDate: '2024-06-15',
            tags: ['Research', 'Marketing'],
            columnId: 'col-4',
            order: 0,
            createdAt: '2024-06-01',
            updatedAt: '2024-06-14'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern tech stack',
    createdBy: 'Mike Chen',
    createdAt: '2024-02-01',
    updatedAt: '2024-06-12',
    members: ['Mike Chen', 'Sarah Johnson', 'John Smith'],
    taskCount: 16,
    completedTasks: 8,
    priority: 'medium',
    isStarred: false,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    columns: []
  },
  {
    id: '3',
    title: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-03-10',
    updatedAt: '2024-06-11',
    members: ['Sarah Johnson', 'Alex Wilson'],
    taskCount: 32,
    completedTasks: 12,
    priority: 'high',
    isStarred: true,
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    columns: []
  }
];

const initialUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', avatar: '👨‍💼' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', avatar: '👩‍💼' },
  { id: '3', name: 'Mike Chen', email: 'mike@company.com', avatar: '👨‍💻' },
  { id: '4', name: 'Emma Davis', email: 'emma@company.com', avatar: '👩‍🎨' },
  { id: '5', name: 'Alex Wilson', email: 'alex@company.com', avatar: '👨‍🔬' }
];

const demoUser: AuthUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@company.com',
  avatar: '👨‍💼',
  role: 'admin',
  joinedAt: '2024-01-15'
};

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Due Tomorrow',
    message: 'Design Landing Page is due tomorrow in Product Launch Q2 board',
    type: 'warning',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    boardId: '1',
    avatar: '⏰'
  },
  {
    id: '2',
    title: 'New Task Assigned',
    message: 'Mike Chen assigned you to Backend API Development',
    type: 'info',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    boardId: '1',
    avatar: '👨‍💻'
  },
  {
    id: '3',
    title: 'Task Completed',
    message: 'Market Research has been marked as complete',
    type: 'success',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    boardId: '1',
    avatar: '✅'
  }
];

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Auth Initial State
  isAuthenticated: false,
  currentUser: null,
  showAuthModal: false,
  authMode: 'login',

  // Initial State
  boards: [],
  currentView: 'dashboard',
  selectedBoard: null,
  viewMode: 'grid',
  searchTerm: '',
  filterPriority: 'all',
  isDarkMode: true,
  users: [],
  notifications: [],

  // Modal states
  showNewBoardModal: false,
  showNewTaskModal: false,
  showNewColumnModal: false,
  selectedColumn: '',

  // Auth Actions
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  setAuthMode: (mode) => set({ authMode: mode }),

  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo
    if (email === 'demo@taskflow.com' && password === 'demo123') {
      set({
        isAuthenticated: true,
        currentUser: demoUser,
        showAuthModal: false,
        boards: initialBoards,
        users: initialUsers,
        notifications: initialNotifications
      });
      return { success: true };
    } else if (email && password) {
      // Allow any email/password combination for demo
      set({
        isAuthenticated: true,
        currentUser: {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          avatar: '👤',
          role: 'member',
          joinedAt: new Date().toISOString().split('T')[0]
        },
        showAuthModal: false,
        boards: initialBoards,
        users: initialUsers,
        notifications: initialNotifications
      });
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  },

  signup: async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const newUser: AuthUser = {
        id: Date.now().toString(),
        name,
        email,
        avatar: name.charAt(0).toUpperCase(),
        role: 'member',
        joinedAt: new Date().toISOString().split('T')[0]
      };
      
      set({
        isAuthenticated: true,
        currentUser: newUser,
        showAuthModal: false,
        boards: initialBoards,
        users: initialUsers,
        notifications: initialNotifications
      });
      return { success: true };
    }
    
    return { success: false, error: 'Please fill all fields' };
  },

  loginAsDemo: () => {
    set({
      isAuthenticated: true,
      currentUser: demoUser,
      showAuthModal: false,
      boards: initialBoards,
      users: initialUsers,
      notifications: initialNotifications
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      currentUser: null,
      boards: [],
      users: [],
      notifications: [],
      selectedBoard: null,
      currentView: 'dashboard'
    });
  },

  // State setters
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedBoard: (board) => set({ selectedBoard: board }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
  
  // Modal setters
  setShowNewBoardModal: (show) => set({ showNewBoardModal: show }),
  setShowNewTaskModal: (show) => set({ showNewTaskModal: show }),
  setShowNewColumnModal: (show) => set({ showNewColumnModal: show }),
  setSelectedColumn: (columnId) => set({ selectedColumn: columnId }),

  // Notification actions
  markNotificationAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(notification => ({ ...notification, read: true }))
    }));
  },

  deleteNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(notification => notification.id !== notificationId)
    }));
  },

  getUnreadNotificationCount: () => {
    const { notifications } = get();
    return notifications.filter(notification => !notification.read).length;
  },

  // Board CRUD
  createBoard: (boardData) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const newBoard: Board = {
      id: Date.now().toString(),
      title: boardData.title,
      description: boardData.description,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      members: [currentUser.name],
      taskCount: 0,
      completedTasks: 0,
      priority: boardData.priority,
      isStarred: false,
      color: boardData.color,
      columns: [
        {
          id: `col-${Date.now()}-1`,
          title: 'To Do',
          boardId: Date.now().toString(),
          order: 0,
          color: 'bg-slate-100',
          tasks: []
        },
        {
          id: `col-${Date.now()}-2`,
          title: 'In Progress',
          boardId: Date.now().toString(),
          order: 1,
          color: 'bg-blue-100',
          tasks: []
        },
        {
          id: `col-${Date.now()}-3`,
          title: 'Done',
          boardId: Date.now().toString(),
          order: 2,
          color: 'bg-green-100',
          tasks: []
        }
      ]
    };
    
    set((state) => ({
      boards: [...state.boards, newBoard],
      showNewBoardModal: false
    }));
  },

  updateBoard: (boardId, updates) => {
    set((state) => ({
      boards: state.boards.map(board =>
        board.id === boardId ? { ...board, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : board
      )
    }));
  },

  deleteBoard: (boardId) => {
    set((state) => ({
      boards: state.boards.filter(board => board.id !== boardId),
      selectedBoard: state.selectedBoard?.id === boardId ? null : state.selectedBoard
    }));
  },

  // Task CRUD
  createTask: (columnId, taskData) => {
    const { selectedBoard, currentUser } = get();
    if (!selectedBoard || !currentUser) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      createdBy: currentUser.name,
      assignedTo: taskData.assignedTo,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
      columnId,
      order: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    set((state) => {
      const updatedBoards = state.boards.map(board => {
        if (board.id === selectedBoard.id) {
          return {
            ...board,
            columns: board.columns.map(column => {
              if (column.id === columnId) {
                return {
                  ...column,
                  tasks: [...column.tasks, newTask]
                };
              }
              return column;
            }),
            taskCount: board.taskCount + 1
          };
        }
        return board;
      });

      return {
        boards: updatedBoards,
        selectedBoard: updatedBoards.find(b => b.id === selectedBoard.id) || null,
        showNewTaskModal: false,
        selectedColumn: ''
      };
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      boards: state.boards.map(board => ({
        ...board,
        columns: board.columns.map(column => ({
          ...column,
          tasks: column.tasks.map(task =>
            task.id === taskId 
              ? { ...task, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
              : task
          )
        }))
      }))
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      boards: state.boards.map(board => ({
        ...board,
        columns: board.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        })),
        taskCount: Math.max(0, board.taskCount - 1)
      }))
    }));
  },

  moveTask: (taskId, targetColumnId, newOrder) => {
    set((state) => {
      let taskToMove: Task | null = null;
      
      // Find and remove the task
      const boardsWithTaskRemoved = state.boards.map(board => ({
        ...board,
        columns: board.columns.map(column => ({
          ...column,
          tasks: column.tasks.filter(task => {
            if (task.id === taskId) {
              taskToMove = { ...task, columnId: targetColumnId, order: newOrder };
              return false;
            }
            return true;
          })
        }))
      }));

      if (!taskToMove) return state;

      // Add task to target column
      const finalBoards = boardsWithTaskRemoved.map(board => ({
        ...board,
        columns: board.columns.map(column => {
          if (column.id === targetColumnId) {
            const updatedTasks = [...column.tasks, taskToMove as Task].sort((a, b) => a.order - b.order);
            return { ...column, tasks: updatedTasks };
          }
          return column;
        })
      }));

      return { ...state, boards: finalBoards };
    });
  },

  // Column CRUD
  createColumn: (boardId, columnData) => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: columnData.title,
      boardId,
      order: 0,
      color: columnData.color || 'bg-gray-100',
      tasks: []
    };

    set((state) => {
      const updatedBoards = state.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            columns: [...board.columns, { ...newColumn, order: board.columns.length }]
          };
        }
        return board;
      });

      return {
        boards: updatedBoards,
        selectedBoard: state.selectedBoard?.id === boardId 
          ? updatedBoards.find(b => b.id === boardId) || state.selectedBoard
          : state.selectedBoard,
        showNewColumnModal: false
      };
    });
  },

  updateColumn: (columnId, updates) => {
    set((state) => ({
      boards: state.boards.map(board => ({
        ...board,
        columns: board.columns.map(column =>
          column.id === columnId ? { ...column, ...updates } : column
        )
      }))
    }));
  },

  deleteColumn: (columnId) => {
    set((state) => ({
      boards: state.boards.filter(board => board.id !== columnId)
    }));
  },

  reorderColumns: (boardId, fromIndex, toIndex) => {
    set((state) => {
      const updatedBoards = state.boards.map(board => {
        if (board.id === boardId) {
          const newColumns = [...board.columns];
          
          // Remove the dragged column and insert it at the new position
          const [draggedColumn] = newColumns.splice(fromIndex, 1);
          newColumns.splice(toIndex, 0, draggedColumn);
          
          // Update the order property for all columns
          const reorderedColumns = newColumns.map((column, index) => ({
            ...column,
            order: index
          }));

          return {
            ...board,
            columns: reorderedColumns,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return board;
      });

      return {
        boards: updatedBoards,
        selectedBoard: state.selectedBoard?.id === boardId 
          ? updatedBoards.find(b => b.id === boardId) || state.selectedBoard
          : state.selectedBoard
      };
    });
  },

  // Utility functions
  getFilteredBoards: () => {
    const { boards, searchTerm, filterPriority } = get();
    return boards.filter(board => {
      const matchesSearch = board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           board.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || board.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  },

  starBoard: (boardId) => {
    set((state) => ({
      boards: state.boards.map(board =>
        board.id === boardId ? { ...board, isStarred: !board.isStarred } : board
      )
    }));
  }
}));