import React, { useState, useMemo } from 'react';
import {
  Target,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  List,
  Grid3X3,
  Plus,
  User,
  Tag,
  MoreHorizontal,
  Edit3,
  Trash2,
  Star,
  Flag
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const MyTasks: React.FC = () => {
  const { boards, isDarkMode } = useBoardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const currentUser = 'Current User'; // In a real app, this would come from auth

  // Get all tasks assigned to current user
  const myTasks = useMemo(() => {
    const tasks = [];
    boards.forEach(board => {
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          if (task.assignedTo.includes(currentUser) || task.createdBy === currentUser) {
            tasks.push({
              ...task,
              boardTitle: board.title,
              boardColor: board.color,
              columnTitle: column.title,
              status: column.title.toLowerCase().includes('done') || column.title.toLowerCase().includes('complete') ? 'completed' : 'active',
              isOverdue: task.dueDate && new Date(task.dueDate) < new Date() && !column.title.toLowerCase().includes('done')
            });
          }
        });
      });
    });
    return tasks;
  }, [boards, currentUser]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = myTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.boardTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'completed' && task.status === 'completed') ||
                           (statusFilter === 'active' && task.status === 'active') ||
                           (statusFilter === 'overdue' && task.isOverdue);
      
      return matchesSearch && matchesPriority && matchesStatus;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'board':
          comparison = a.boardTitle.localeCompare(b.boardTitle);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [myTasks, searchTerm, priorityFilter, statusFilter, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = myTasks.length;
    const completed = myTasks.filter(task => task.status === 'completed').length;
    const overdue = myTasks.filter(task => task.isOverdue).length;
    const dueToday = myTasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today && task.status !== 'completed';
    }).length;
    
    return { total, completed, overdue, dueToday, completionRate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [myTasks]);

  const TaskPriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${colors[priority] || colors.medium}`}>
        {priority}
      </span>
    );
  };

  const TaskCard = ({ task, compact = false }: { task: any; compact?: boolean }) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
      if (diffDays > 1) return `In ${diffDays} days`;
      return date.toLocaleDateString();
    };

    if (compact) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border hover:shadow-md transition-all duration-200 cursor-pointer`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{task.boardTitle}</p>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <TaskPriorityBadge priority={task.priority} />
              {task.isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
          {task.dueDate && (
            <div className={`flex items-center mt-3 text-sm ${task.isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border hover:shadow-lg transition-all duration-200 cursor-pointer group`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`w-12 h-12 ${task.boardColor} rounded-lg flex-shrink-0 opacity-80`}></div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2`}>{task.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Target className="w-4 h-4 mr-1" />
                  {task.boardTitle}
                </span>
                <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Flag className="w-4 h-4 mr-1" />
                  {task.columnTitle}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TaskPriorityBadge priority={task.priority} />
            {task.isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
            {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            <button className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-all`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {task.dueDate && (
              <span className={`flex items-center text-sm ${task.isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex space-x-1">
                  {task.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      +{task.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              View
            </button>
            <button className={`px-3 py-1 text-sm rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="My Tasks" 
        subtitle="Track and manage all your assigned tasks"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Tasks</p>
                <p className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
                <p className={`text-3xl font-bold mt-1 text-green-600`}>{stats.completed}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stats.completionRate}% rate</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Due Today</p>
                <p className={`text-3xl font-bold mt-1 text-orange-600`}>{stats.dueToday}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</p>
                <p className={`text-3xl font-bold mt-1 text-red-600`}>{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 w-80`}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="board">Board</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>

            {/* View Toggle */}
            <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} overflow-hidden`}>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Display */}
        {filteredAndSortedTasks.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAndSortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact={viewMode === 'list'} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all' 
                ? 'No tasks match your filters' 
                : 'No tasks assigned to you'
              }
            </h3>
            <p className="mb-6">
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Tasks assigned to you will appear here'
              }
            </p>
            {(searchTerm || priorityFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriorityFilter('all');
                  setStatusFilter('all');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Quick Stats Summary */}
        {filteredAndSortedTasks.length > 0 && (
          <div className={`mt-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredAndSortedTasks.filter(t => t.priority === 'critical').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Critical</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredAndSortedTasks.filter(t => t.priority === 'high').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>High Priority</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredAndSortedTasks.filter(t => t.dueDate && new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due This Week</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Set(filteredAndSortedTasks.map(t => t.boardTitle)).size}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Boards</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;