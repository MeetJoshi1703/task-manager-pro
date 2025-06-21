import React, { useState } from 'react';
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
  User as UserIcon
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const TeamMembers: React.FC = () => {
  const { boards, users, isDarkMode } = useBoardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddMember, setShowAddMember] = useState(false);

  // Calculate member statistics
  const getMemberStats = (userId: string, userName: string) => {
    let totalTasks = 0;
    let completedTasks = 0;
    let activeBoardsCount = 0;

    boards.forEach(board => {
      if (board.members.includes(userName)) {
        activeBoardsCount++;
        board.columns.forEach(column => {
          column.tasks.forEach(task => {
            if (task.assignedTo.includes(userName)) {
              totalTasks++;
              // Check if task is in a "done" or "completed" column
              if (column.title.toLowerCase().includes('done') || 
                  column.title.toLowerCase().includes('complete')) {
                completedTasks++;
              }
            }
          });
        });
      }
    });

    return {
      totalTasks,
      completedTasks,
      activeBoardsCount,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  // Mock roles for demonstration
  const memberRoles = {
    'Sarah Johnson': 'Project Manager',
    'Mike Chen': 'Senior Developer',
    'Emma Davis': 'UI/UX Designer',
    'John Smith': 'Developer',
    'Alex Wilson': 'QA Engineer'
  };

  const memberStatus = {
    'Sarah Johnson': 'online',
    'Mike Chen': 'online',
    'Emma Davis': 'away',
    'John Smith': 'offline',
    'Alex Wilson': 'online'
  };

  // Filter members
  const filteredMembers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const role = memberRoles[user.name] || 'Member';
    const matchesRole = roleFilter === 'all' || role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const AddMemberModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      role: 'Member'
    });

    if (!showAddMember) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Team Member</h2>
              <button
                onClick={() => setShowAddMember(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter full name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter email address..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Member">Member</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="QA Engineer">QA Engineer</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const MemberCard = ({ user }: { user: any }) => {
    const stats = getMemberStats(user.id, user.name);
    const role = memberRoles[user.name] || 'Member';
    const status = memberStatus[user.name] || 'offline';

    const getRoleIcon = (role: string) => {
      if (role.includes('Manager')) return <Crown className="w-4 h-4 text-yellow-500" />;
      if (role.includes('Senior')) return <Shield className="w-4 h-4 text-blue-500" />;
      return <UserIcon className="w-4 h-4 text-gray-500" />;
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'online': return 'bg-green-500';
        case 'away': return 'bg-yellow-500';
        default: return 'bg-gray-400';
      }
    };

    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:shadow-lg transition-all duration-200`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {user.avatar || user.name.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(status)} rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}></div>
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
              <div className="flex items-center space-x-2">
                {getRoleIcon(role)}
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{role}</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
              <Mail className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
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
            Last active: {status === 'online' ? 'Now' : '2 hours ago'}
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Message
            </button>
            <button className={`px-3 py-1 text-sm rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="Team Members" 
        subtitle="Manage your team and track member productivity"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Members</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Online Now</p>
                <p className={`text-3xl font-bold mt-1 text-green-600`}>
                  {Object.values(memberStatus).filter(status => status === 'online').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Boards</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{boards.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Completion</p>
                <p className={`text-3xl font-bold mt-1 text-orange-600`}>
                  {Math.round(users.reduce((acc, user) => {
                    const stats = getMemberStats(user.id, user.name);
                    return acc + stats.completionRate;
                  }, 0) / users.length) || 0}%
                </p>
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
              <option value="manager">Managers</option>
              <option value="developer">Developers</option>
              <option value="designer">Designers</option>
              <option value="qa">QA Engineers</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
              <Download className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((user) => (
            <MemberCard key={user.id} user={user} />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No team members found</h3>
            <p className="mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add First Member</span>
            </button>
          </div>
        )}
      </div>

      <AddMemberModal />
    </div>
  );
};

export default TeamMembers;