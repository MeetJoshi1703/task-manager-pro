import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  SortAsc,
  SortDesc,
  List,
  Grid3X3,
  Tag,
  MoreHorizontal,
  Flag,
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';
import type { Task, Board, Column } from '../types/types';

interface TaskWithMeta extends Task {
  boardTitle: string;
  boardColor: string;
  columnTitle: string;
  isOverdue: boolean;
}

const MyTasks: React.FC = () => {
  const navigate = useNavigate();
  const {
    boards,
    boardColumns,
    isDarkMode,
    isAuthenticated,
    boardTasks,
    currentUser,
    updateTask,
    deleteTask,
    setSelectedBoard,
    fetchAllTasks,
  } = useBoardStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on mount if boardTasks is empty
  useEffect(() => {
    if (isAuthenticated && Object.keys(boardTasks).length === 0 && currentUser) {
      console.log('[MyTasks] boardTasks is empty, fetching all tasks for user:', currentUser.id);
      setLoading(true);
      fetchAllTasks()
        .catch((err) => {
          console.error('[MyTasks] Error fetching tasks:', err);
          setError('Failed to load tasks. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isAuthenticated, boardTasks, currentUser, fetchAllTasks]);

  // Extract user's tasks with metadata
  const myTasks = useMemo(() => {
    if (!isAuthenticated || !currentUser) return [];

    const tasks: TaskWithMeta[] = [];
    const currentUserId = currentUser.id;

    // Create a board lookup for efficiency
    const boardMap = new Map<string, Board>(boards.map((b) => [b.id, b]));
    // Create a column lookup for efficiency
    const columnMap = new Map<string, Column>(boardColumns.map((c) => [c.id, c]));

    // Iterate through boardTasks
    Object.entries(boardTasks).forEach(([columnId, columnTasks]) => {
      if (Array.isArray(columnTasks)) {
        columnTasks.forEach((task) => {
          // Check if task is assigned to or created by current user
          const isAssignedToMe =
            task.task_assignees?.some((assignee) => assignee.user_id === currentUserId) ||
            task.created_by === currentUserId;

          if (isAssignedToMe) {
            const board = boardMap.get(task.board_id);
            const column = columnMap.get(columnId);

            tasks.push({
              ...task,
              boardTitle: board?.title || 'Unknown Board',
              boardColor: board?.color || 'bg-gray-500',
              columnTitle: column?.title || 'Unknown Column',
              isOverdue:
                task.due_date &&
                new Date(task.due_date) < new Date() &&
                task.status !== 'completed',
            });
          }
        });
      }
    });

    console.log(`[MyTasks] Found ${tasks.length} tasks for user: ${currentUserId}`);
    return tasks;
  }, [boardTasks, boards, boardColumns, currentUser, isAuthenticated]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = myTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        task.boardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.columnTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && task.status === 'completed') ||
        (statusFilter === 'active' && task.status !== 'completed') ||
        (statusFilter === 'overdue' && task.isOverdue);

      return matchesSearch && matchesPriority && matchesStatus;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'due_date':
          if (!a.due_date && !b.due_date) comparison = 0;
          else if (!a.due_date) comparison = 1;
          else if (!b.due_date) comparison = -1;
          else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          comparison =
            (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2);
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
    const completed = myTasks.filter((task) => task.status === 'completed').length;
    const overdue = myTasks.filter((task) => task.isOverdue).length;
    const dueToday = myTasks.filter((task) => {
      if (!task.due_date) return false;
      const today = new Date();
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getFullYear() === today.getFullYear() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getDate() === today.getDate() &&
        task.status !== 'completed'
      );
    }).length;

    return {
      total,
      completed,
      overdue,
      dueToday,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [myTasks]);

  const TaskPriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${
          colors[priority as keyof typeof colors] ?? colors.medium
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleTaskClick = (task: TaskWithMeta) => {
    const board = boards.find((b) => b.id === task.board_id);
    if (board) {
      setSelectedBoard(board);
      navigate(`/boards/${board.id}`);
    } else {
      setError('Board not found');
    }
  };

  const handleStatusUpdate = async (task: TaskWithMeta, newStatus: string) => {
    try {
      setLoading(true);
      await updateTask(task.id, { status: newStatus });
      setError(null);
    } catch (err: any) {
      console.error('[MyTasks] Failed to update task status:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);
      await deleteTask(taskId);
      setError(null);
    } catch (err: any) {
      console.error('[MyTasks] Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > 1) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const TaskCard = ({ task, compact = false }: { task: TaskWithMeta; compact?: boolean }) => {
    if (compact) {
      return (
        <div
          onClick={() => handleTaskClick(task)}
          className={`${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          } rounded-lg p-4 border hover:shadow-md transition-all duration-200 cursor-pointer`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {task.title}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {task.boardTitle} • {task.columnTitle}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <TaskPriorityBadge priority={task.priority} />
              {task.isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
              {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </div>
          </div>
          {task.due_date && (
            <div
              className={`flex items-center mt-3 text-sm ${
                task.isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(task.due_date)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl p-6 border hover:shadow-lg transition-all duration-200 group`}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-start space-x-4 flex-1 cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div
              className={`w-12 h-12 ${task.boardColor} rounded-lg flex-shrink-0 opacity-80`}
            ></div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {task.title}
              </h3>
              <p
                className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2`}
              >
                {task.description || 'No description'}
              </p>
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
            <button
              className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-all`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {task.due_date && (
              <span
                className={`flex items-center text-sm ${
                  task.isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(task.due_date)}
              </span>
            )}
            {task.task_tags && task.task_tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex space-x-1">
                  {task.task_tags.slice(0, 2).map((tagObj: { tag: string }, index: number) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tagObj.tag}
                    </span>
                  ))}
                  {task.task_tags.length > 2 && (
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      +{task.task_tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {task.status !== 'completed' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(task, 'completed');
                }}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Mark Complete
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(task, 'in_progress');
                }}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Reopen
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
              disabled={loading}
              className={`px-3 py-1 text-sm rounded-lg border ${
                isDarkMode
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              } transition-colors disabled:opacity-50`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <TopBar title="My Tasks" subtitle="Track and manage all your assigned tasks" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3
              className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Sign in to view your tasks
            </h3>
            <p className="text-gray-500">You need to be authenticated to see your assigned tasks.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar title="My Tasks" subtitle="Track and manage all your assigned tasks" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Loading tasks...
              </p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Tasks
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {stats.total}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Completed
                </p>
                <p className={`text-3xl font-bold mt-1 text-green-600`}>{stats.completed}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stats.completionRate}% rate
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Due Today
                </p>
                <p className={`text-3xl font-bold mt-1 text-orange-600`}>{stats.dueToday}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Overdue
                </p>
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
                placeholder="Search tasks, boards, or columns..."
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
                <option value="all">All Statuses</option>
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
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="board">Board</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                } transition-colors`}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>

            {/* View Toggle */}
            <div
              className={`flex rounded-lg border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              } overflow-hidden`}
            >
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
          <div
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredAndSortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} compact={viewMode === 'list'} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3
              className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'No tasks match your filters'
                : 'No tasks assigned to you'}
            </h3>
            <p className="mb-6">
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Tasks assigned to you will appear here'}
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
          <div
            className={`mt-8 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-xl p-6 border`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Quick Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {filteredAndSortedTasks.filter((t) => t.priority === 'critical').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Critical
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {filteredAndSortedTasks.filter((t) => t.priority === 'high').length}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  High Priority
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {
                    filteredAndSortedTasks.filter(
                      (t) =>
                        t.due_date &&
                        new Date(t.due_date) <=
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                        new Date(t.due_date) >= new Date()
                    ).length
                  }
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Due This Week
                </p>
              </div>
              <div>
                <p
                  className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {new Set(filteredAndSortedTasks.map((t) => t.boardTitle)).size}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Active Boards
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;