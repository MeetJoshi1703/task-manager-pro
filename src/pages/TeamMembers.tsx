import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  MoreHorizontal,
  Edit3,
  Trash2,
  UserPlus,
  Filter,
  Download,
  Settings,
  Crown,
  Shield,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { useAuth, useBoards, useTasks, useMembers, useUI } from '../store/hooks';

import { type Member } from '../services/memberService';
import TopBar from '../components/TopBar';

const TeamMembers: React.FC = () => {
    const { isAuthenticated } = useAuth();
  const { boards, selectedBoard, setSelectedBoard } = useBoards();
  const { boardTasks } = useTasks();
  const {
    boardMembers,
    loading: membersLoading,
    error,
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
    clearError,
    hasFetched // Add this if you implement the hasFetched pattern
  } = useMembers();
  const { isDarkMode } = useUI();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddMember, setShowAddMember] = useState(false);

  // Fetch members when component mounts or selectedBoard changes
  useEffect(() => {
  if (isAuthenticated && selectedBoard?.id && !hasFetched) {
    fetchMembers(selectedBoard.id);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated, selectedBoard?.id, hasFetched]);


  // If no board is selected, select the first one
  useEffect(() => {
    if (isAuthenticated && boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0]);
    }
  }, [isAuthenticated, boards, selectedBoard, setSelectedBoard]);

  // Calculate member statistics from real data
  const getMemberStats = (memberId: string, memberEmail: string) => {
    let totalTasks = 0;
    let completedTasks = 0;
    let activeBoardsCount = 0;

    if (!isAuthenticated) return { totalTasks: 0, completedTasks: 0, activeBoardsCount: 0, completionRate: 0 };

    // Count tasks from boardTasks (real data)
    Object.values(boardTasks).forEach(columnTasks => {
      if (Array.isArray(columnTasks)) {
        columnTasks.forEach(task => {
          if (task.assignees?.includes(memberId) || task.created_by === memberId) {
            totalTasks++;
            if (task.status === 'completed') {
              completedTasks++;
            }
          }
        });
      }
    });

    // Count active boards where member has tasks
    boards.forEach(board => {
      const hasTasksInBoard = Object.values(boardTasks).some(columnTasks => 
        Array.isArray(columnTasks) && columnTasks.some(task => 
          task.board_id === board.id && 
          (task.assignees?.includes(memberId) || task.created_by === memberId)
        )
      );
      if (hasTasksInBoard) activeBoardsCount++;
    });

    return {
      totalTasks,
      completedTasks,
      activeBoardsCount,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  // Filter members
  const filteredMembers = useMemo(() => {
    return boardMembers.filter(member => {
      const matchesSearch = 
        member.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || 
        member.role?.toLowerCase().includes(roleFilter.toLowerCase());
      
      return matchesSearch && matchesRole;
    });
  }, [boardMembers, searchTerm, roleFilter]);

  const AddMemberModal = () => {
    const [formData, setFormData] = useState({
      email: '',
      role: 'member' as 'admin' | 'member' | 'viewer'
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.email.trim() || !selectedBoard?.id) return;

      try {
        await addMember(selectedBoard.id, {
          email: formData.email,
          role: formData.role
        });
        
        // Reset form and close modal
        setFormData({ email: '', role: 'member' });
        setShowAddMember(false);
      } catch (err) {
        console.error('Failed to invite member:', err);
        // Error is handled by the store
      }
    };

    if (!showAddMember) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Invite Team Member</h2>
              <button
                onClick={() => setShowAddMember(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter email address..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'member' | 'viewer'})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                  disabled={membersLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={membersLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {membersLoading ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const MemberCard = ({ member }: { member: Member }) => {
    const stats = getMemberStats(member.user_id, member.profiles?.email || '');

    const getRoleIcon = (role: string) => {
      if (role === 'owner' || role === 'admin') return <Crown className="w-4 h-4 text-yellow-500" />;
      if (role === 'member') return <Shield className="w-4 h-4 text-blue-500" />;
      return <UserIcon className="w-4 h-4 text-gray-500" />;
    };

    const getStatusColor = () => {
      // For now, assuming all members are active
      return 'bg-green-500';
    };

    const handleRoleUpdate = async (newRole: string) => {
      if (!selectedBoard?.id) return;
      
      try {
        await updateMemberRole(selectedBoard.id, member.user_id, newRole as 'admin' | 'member' | 'viewer');
      } catch (err) {
        console.error('Failed to update role:', err);
      }
    };

    const handleRemoveMember = async () => {
      if (!window.confirm('Are you sure you want to remove this member?') || !selectedBoard?.id) return;
      
      try {
        await removeMember(selectedBoard.id, member.user_id);
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    };

    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:shadow-lg transition-all duration-200`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || 'U'}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}></div>
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {member.profiles?.full_name || 'Unknown User'}
              </h3>
              <div className="flex items-center space-x-2">
                {getRoleIcon(member.role)}
                <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {member.role}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {member.profiles?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.open(`mailto:${member.profiles?.email}`)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Mail className="w-4 h-4" />
            </button>
            {member.role !== 'owner' && (
              <button 
                onClick={handleRemoveMember}
                disabled={membersLoading}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors text-red-500 disabled:opacity-50`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalTasks}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.activeBoardsCount}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Boards</p>
          </div>
          <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-2xl font-bold text-green-600`}>{stats.completionRate}%</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completion</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Joined: {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'Recently'}
          </span>
          <div className="flex items-center space-x-2">
            {member.role !== 'owner' && (
              <select
                value={member.role}
                onChange={(e) => handleRoleUpdate(e.target.value)}
                disabled={membersLoading}
                className={`px-3 py-1 text-sm rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} disabled:opacity-50`}
              >
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (membersLoading && boardMembers.length === 0) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <TopBar title="Team Members" subtitle="Manage your team and track member productivity" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading team members...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <TopBar title="Team Members" subtitle="Manage your team and track member productivity" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign in to view team members
            </h3>
            <p className="text-gray-500">You need to be authenticated to manage team members.</p>
          </div>
        </div>
      </div>
    );
  }

  // No board selected state
  if (!selectedBoard) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <TopBar title="Team Members" subtitle="Manage your team and track member productivity" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No board selected
            </h3>
            <p className="text-gray-500">Select a board to view its team members.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from real data
  const totalMembers = boardMembers.length;
  const onlineMembers = boardMembers.length; // Assuming all are active for now
  const avgCompletion = boardMembers.length > 0 
    ? Math.round(boardMembers.reduce((acc, member) => {
        const stats = getMemberStats(member.user_id, member.profiles?.email || '');
        return acc + stats.completionRate;
      }, 0) / boardMembers.length)
    : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="Team Members" 
        subtitle={`Manage members for "${selectedBoard.title}"`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              <button 
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Board Selector */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Board
          </label>
          <select
            value={selectedBoard.id}
            onChange={(e) => {
              const board = boards.find(b => b.id === e.target.value);
              if (board) setSelectedBoard(board);
            }}
            className={`px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500`}
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.title}
              </option>
            ))}
          </select>
        </div>

        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Members</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Members</p>
                <p className={`text-3xl font-bold mt-1 text-green-600`}>{onlineMembers}</p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Board</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Completion</p>
                <p className={`text-3xl font-bold mt-1 text-orange-600`}>{avgCompletion}%</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 w-80`}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Roles</option>
              <option value="owner">Owners</option>
              <option value="admin">Admins</option>
              <option value="member">Members</option>
              <option value="viewer">Viewers</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.user_id} member={member} />
          ))}
        </div>

        {filteredMembers.length === 0 && !membersLoading && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {boardMembers.length === 0 ? 'No team members yet' : 'No members match your filters'}
            </h3>
            <p className="mb-6">
              {boardMembers.length === 0 
                ? 'Invite your first team member to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite Team Member</span>
            </button>
          </div>
        )}
      </div>

      <AddMemberModal />
    </div>
  );
};

export default TeamMembers;