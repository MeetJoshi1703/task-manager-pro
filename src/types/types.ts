
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  access_token: string;
  refresh_token: string;
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

export interface CreateBoardData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  color: string;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  color: string;
  tasks: Task[];
  // Backend fields for API responses
  board_id?: string;
  position?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateColumnData {
  title: string;
  color: string;
}

export interface CreateColumnRequestData {
  board_id: string;
  title: string;
  color?: string;
}

export interface ReorderColumnData {
  board_id: string;
  columns: { id: string; position: number }[];
}



export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  created_at: string;
  updated_at: string;
  column_id: string;
  board_id: string;
  created_by: string;
  position: number;
  task_assignees?: TaskAssignee[];
  task_tags?: TaskTag[];
  // Frontend compatibility fields
  createdBy?: string;
  assignedTo?: string[];
  dueDate?: string;
  tags?: string[];
  columnId?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskAssignee {
  id: string;
  task_id: string;
  user_id: string;
  assigned_at: string;
  profiles: {
    id: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

export interface TaskTag {
  id: string;
  task_id: string;
  tag: string;
  created_at: string;
}

// Task Creation (Frontend form)
export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assignedTo: string[];
  tags: string[];
}

// Task Creation (API request)
export interface CreateTaskRequestData {
  column_id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  board_id?: string;
  assignees?: string[];
  tags?: string[];
  assignee_ids?: string[];
}

// Task Update
export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  position?: number;
}

// Task Movement
export interface MoveTaskData {
  task_id: string;
  target_column_id: string;
  source_column_id?: string;
  new_position: number;
}

// Task API Responses
export interface TaskResponse {
  task: Task;
  message?: string;
}

export interface TasksResponse {
  tasks: Task[];
  message?: string;
}

// Task Filters
export interface TaskFilters {
  status?: string[];
  priority?: string[];
  assignee_id?: string;
  due_date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search?: string;
}

// Task Statistics
export interface TaskStats {
  total: number;
  completed: number;
  in_progress: number;
  todo: number;
  blocked: number;
  overdue: number;
  completion_rate: number;
}

// Task Activity/History
export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  action: 'created' | 'updated' | 'moved' | 'assigned' | 'commented' | 'completed';
  details: string;
  created_at: string;
  user: {
    id: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

// Task Comments
export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

// Task Attachments
export interface TaskAttachment {
  id: string;
  task_id: string;
  filename: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

// Extended Task with additional features
export interface ExtendedTask extends Task {
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  activity?: TaskActivity[];
  time_spent?: number; // in minutes
  estimated_time?: number; // in minutes
}

// Task Form Data (UI forms)
export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assignedTo: string[];
  tags: string[];
  estimatedTime?: number;
}

// Task Quick Actions
export interface TaskQuickAction {
  id: string;
  label: string;
  icon: string;
  action: (task: Task) => void;
  condition?: (task: Task) => boolean;
}

// Task Templates
export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  estimated_time?: number;
  checklist?: string[];
}

// Bulk Operations
export interface BulkTaskOperation {
  task_ids: string[];
  operation: 'delete' | 'move' | 'assign' | 'update_status' | 'update_priority';
  data?: {
    column_id?: string;
    assignee_id?: string;
    status?: string;
    priority?: string;
  };
}

// Task Service Data Types
export interface AddAssigneeData {
  user_id: string;
}

export interface AddTagData {
  tag: string;
}

export interface AddCommentData {
  content: string;
}

export interface AddAttachmentData {
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
}

// ============================================================================
// MEMBER TYPES
// ============================================================================

export interface Member {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joined_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface AddMemberData {
  email: string;
  role?: 'admin' | 'member' | 'viewer';
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

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

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action_url?: string;
  avatar?: string;
  board_id?: string;
  user_id: string;
  boards?: {
    id: string;
    title: string;
  };
}

// ============================================================================
// APP STATE TYPES
// ============================================================================

export interface AppState {
  currentView: 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks' | 'notifications' | 'settings';
  selectedBoard: Board | null;
  viewMode: 'grid' | 'list';
  searchTerm: string;
  filterPriority: string;
  isDarkMode: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type BoardPriority = 'low' | 'medium' | 'high';
export type ViewMode = 'grid' | 'list';
export type CurrentView = 'dashboard' | 'boards' | 'board-detail' | 'calendar' | 'team' | 'tasks' | 'notifications' | 'settings';
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
  errors?: string[];
}


export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}