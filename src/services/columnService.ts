const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export interface CreateColumnData {
  board_id: string;
  title: string;
  color?: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ReorderColumnData {
  board_id: string;
  columns: { id: string; position: number }[];
}

export const columnService = {
  async createColumn(columnData: CreateColumnData): Promise<Column> {
    const response = await fetch(`${API_BASE_URL}/columns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(columnData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create column');
    }

    return data.column;
  },

  async getColumnsByBoard(boardId: string): Promise<Column[]> {
    const response = await fetch(`${API_BASE_URL}/columns/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch columns');
    }

    return data.columns;
  },

  async updateColumn(columnId: string, updates: { title?: string; color?: string }): Promise<Column> {
    const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update column');
    }

    return data.column;
  },

  async deleteColumn(columnId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete column');
    }
  },

  async reorderColumns(reorderData: ReorderColumnData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/columns/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reorderData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reorder columns');
    }
  },
};