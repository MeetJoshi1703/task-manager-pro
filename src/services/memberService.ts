const API_BASE_URL =import.meta.env.VITE_API_URL ||  'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

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

export const memberService = {
  async addMember(boardId: string, memberData: AddMemberData): Promise<Member> {
    const response = await fetch(`${API_BASE_URL}/members/${boardId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(memberData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add member');
    }

    return data.member;
  },

  async getMembers(boardId: string): Promise<Member[]> {
    const response = await fetch(`${API_BASE_URL}/members/${boardId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch members');
    }

    return data.members;
  },

  async updateMemberRole(boardId: string, userId: string, role: 'admin' | 'member' | 'viewer'): Promise<Member> {
    const response = await fetch(`${API_BASE_URL}/members/${boardId}/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update member role');
    }

    return data.member;
  },

  async removeMember(boardId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/members/${boardId}/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove member');
    }
  },
};