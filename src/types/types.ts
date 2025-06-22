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

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
  color: string;
  tasks: Task[];
}

// Task-related interfaces and types
// Add these to your types/types.ts file or create a separate tasks.ts file

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

// Create Task Data (for API calls)
export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  column_id: string;
  board_id: string;
  assignee_ids?: string[];
  tags?: string[];
}

// Update Task Data
export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  position?: number;
}

// Move Task Data
export interface MoveTaskData {
  task_id: string;
  target_column_id: string;
  source_column_id?: string;
  new_position: number;
}

// Task Service Response Types
export interface TaskResponse {
  task: Task;
  message?: string;
}

export interface TasksResponse {
  tasks: Task[];
  message?: string;
}

// Task Filter Options
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

// Task Comment
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

// Task Attachment
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

// Extended Task interface with additional features
export interface ExtendedTask extends Task {
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  activity?: TaskActivity[];
  time_spent?: number; // in minutes
  estimated_time?: number; // in minutes
}

// Task Form Data (for UI forms)
export interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  assignedTo: string[];
  tags: string[];
  estimatedTime?: number;
}


export interface TaskQuickAction {
  id: string;
  label: string;
  icon: string;
  action: (task: Task) => void;
  condition?: (task: Task) => boolean;
}


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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

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