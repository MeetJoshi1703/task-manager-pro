import type { Board, CreateBoardData } from '../types/types';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const boardService = {
  async createBoard(boardData: CreateBoardData): Promise<Board> {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: boardData.title,
        description: boardData.description,
        color: boardData.color.replace('bg-gradient-to-br from-', '').replace(' to-', '/'), // Convert to backend format (e.g., 'indigo-500/purple-500')
        priority: boardData.priority,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create board');
    }

    return {
      ...data.board,
      createdAt: data.board.created_at,
      updatedAt: data.board.updated_at,
      members: data.board.board_members?.map((m: any) => m.profiles?.full_name || m.user_id) || [],
      taskCount: 0,
      completedTasks: 0,
      columns: [],
      isStarred: data.board.is_starred,
      color: boardData.color, // Retain frontend gradient format
    };
  },

  async getBoards(): Promise<Board[]> {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch boards');
    }

    return data.boards.map((board: any) => ({
      id: board.id,
      title: board.title,
      description: board.description || '',
      createdBy: board.created_by,
      createdAt: board.created_at,
      updatedAt: board.updated_at,
      members: board.board_members?.map((m: any) => m.profiles?.full_name || m.user_id) || [],
      taskCount: 0, // Will be updated in column/task integration
      completedTasks: 0,
      priority: board.priority,
      isStarred: board.is_starred,
      color: `bg-gradient-to-br from-${board.color.split('/')[0]} to-${board.color.split('/')[1]}`,
      columns: [],
    }));
  },

  async getBoardById(boardId: string): Promise<Board> {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch board');
    }

    return {
      id: data.board.id,
      title: data.board.title,
      description: data.board.description || '',
      createdBy: data.board.created_by,
      createdAt: data.board.created_at,
      updatedAt: data.board.updated_at,
      members: data.board.board_members?.map((m: any) => m.profiles?.full_name || m.user_id) || [],
      taskCount: data.board.columns?.reduce((count: number, col: any) => count + (col.tasks?.length || 0), 0) || 0,
      completedTasks: data.board.columns?.reduce((count: number, col: any) => count + (col.tasks?.filter((t: any) => t.status === 'completed').length || 0), 0) || 0,
      priority: data.board.priority,
      isStarred: data.board.is_starred,
      color: `bg-gradient-to-br from-${data.board.color.split('/')[0]} to-${data.board.color.split('/')[1]}`,
      columns: data.board.columns?.map((col: any) => ({
        id: col.id,
        title: col.title,
        boardId: col.board_id,
        order: col.position,
        color: col.color,
        tasks: col.tasks?.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          createdBy: task.created_by,
          assignedTo: task.task_assignees?.map((a: any) => a.profiles?.full_name || a.user_id) || [],
          priority: task.priority,
          dueDate: task.due_date,
          tags: task.task_tags?.map((t: any) => t.tag) || [],
          columnId: task.column_id,
          order: task.position,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        })) || [],
      })) || [],
    };
  },

  async updateBoard(boardId: string, updates: Partial<Board>): Promise<Board> {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: updates.title,
        description: updates.description,
        color: updates.color?.replace('bg-gradient-to-br from-', '').replace(' to-', '/'),
        priority: updates.priority,
        is_starred: updates.isStarred,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update board');
    }

    return {
      ...data.board,
      createdAt: data.board.created_at,
      updatedAt: data.board.updated_at,
      members: data.board.board_members?.map((m: any) => m.profiles?.full_name || m.user_id) || [],
      taskCount: 0,
      completedTasks: 0,
      columns: [],
      isStarred: data.board.is_starred,
      color: updates.color || `bg-gradient-to-br from-${data.board.color.split('/')[0]} to-${data.board.color.split('/')[1]}`,
    };
  },

  async deleteBoard(boardId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete board');
    }
  },

  async starBoard(boardId: string): Promise<Board> {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}/star`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to star board');
    }

    return {
      ...data.board,
      createdAt: data.board.created_at,
      updatedAt: data.board.updated_at,
      members: data.board.board_members?.map((m: any) => m.profiles?.full_name || m.user_id) || [],
      taskCount: 0,
      completedTasks: 0,
      columns: [],
      isStarred: data.board.is_starred,
      color: `bg-gradient-to-br from-${data.board.color.split('/')[0]} to-${data.board.color.split('/')[1]}`,
    };
  },
};