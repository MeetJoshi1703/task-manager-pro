import { create } from 'zustand';
import type { Board, Task, Column, User, CreateBoardData, CreateTaskData, CreateColumnData } from '../types/types';

interface BoardStore {
  // State
  boards: Board[];
  currentView: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks';
  selectedBoard: Board | null;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
  users: User[];

  // Modal states
  showNewBoardModal: boolean;
  showNewTaskModal: boolean;
  showNewColumnModal: boolean;
  selectedColumn: string;

  // Actions
  setCurrentView: (view: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks') => void;
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
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-10',
    members: ['Sarah Johnson', 'Mike Chen', 'Emma Davis'],
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
            createdBy: 'Sarah Johnson',
            assignedTo: ['Emma Davis'],
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
            createdBy: 'Sarah Johnson',
            assignedTo: ['Sarah Johnson'],
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
    members: ['Mike Chen', 'Emma Davis', 'John Smith'],
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
    createdBy: 'Emma Davis',
    createdAt: '2024-03-10',
    updatedAt: '2024-06-11',
    members: ['Emma Davis', 'Alex Wilson'],
    taskCount: 32,
    completedTasks: 12,
    priority: 'high',
    isStarred: true,
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    columns: []
  }
];

const initialUsers: User[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@company.com', avatar: '👩‍💼' },
  { id: '2', name: 'Mike Chen', email: 'mike@company.com', avatar: '👨‍💻' },
  { id: '3', name: 'Emma Davis', email: 'emma@company.com', avatar: '👩‍🎨' },
  { id: '4', name: 'John Smith', email: 'john@company.com', avatar: '👨‍💼' },
  { id: '5', name: 'Alex Wilson', email: 'alex@company.com', avatar: '👨‍🔬' }
];

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial State
  boards: initialBoards,
  currentView: 'dashboard',
  selectedBoard: null,
  viewMode: 'grid',
  searchTerm: '',
  filterPriority: 'all',
  isDarkMode: true,
  users: initialUsers,
  
  // Modal states
  showNewBoardModal: false,
  showNewTaskModal: false,
  showNewColumnModal: false,
  selectedColumn: '',

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

  // Board CRUD
  createBoard: (boardData) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title: boardData.title,
      description: boardData.description,
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      members: ['Current User'],
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
    const { selectedBoard } = get();
    if (!selectedBoard) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      createdBy: 'Current User',
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
      boards: state.boards.map(board => ({
        ...board,
        columns: board.columns.filter(column => column.id !== columnId)
      }))
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