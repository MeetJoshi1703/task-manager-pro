// Base interfaces for the Task Board Application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  tags: string[];
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  tasks: Task[];
  color: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: string[];
  taskCount: number;
  completedTasks: number;
  priority: 'low' | 'medium' | 'high';
  isStarred: boolean;
  color: string;
  columns: Column[];
}

// Form data interfaces
export interface CreateBoardData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assignedTo: string[];
  tags: string[];
}

export interface CreateColumnData {
  title: string;
  color: string;
}

// App state interfaces
export interface AppState {
  currentView: 'boards' | 'board-detail';
  selectedBoard: Board | null;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
}

// Filter and search types
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ViewMode = 'grid' | 'list';
export type CurrentView = 'boards' | 'board-detail';