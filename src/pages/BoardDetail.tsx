import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Plus, 
  Filter, 
  Search, 
  Users, 
  Settings,
  Calendar,
  Edit3,
  Trash2,
  X,
  Save,
  Zap,
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth, useBoards, useTasks, useColumns, useMembers, useUI } from '../store/hooks';
import TaskModal from '../components/TaskModal';


const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  
  // Use segregated hooks
  const { isAuthenticated } = useAuth();
  const { 
    selectedBoard, 
    setSelectedBoard, 
    boards, 
    starBoard, 
    loading: boardsLoading, 
    error: boardsError,
    fetchBoards,
    hasFetched: boardsHasFetched
  } = useBoards();
  
  const { 
    boardColumns, 
    fetchColumns, 
    loading: columnsLoading, 
    error: columnsError,
    hasFetched: columnsHasFetched
  } = useColumns();
  
  const { 
    boardTasks, 
    fetchTasks, 
    updateTask, 
    deleteTask, 
    loading: tasksLoading,
    hasFetched: tasksHasFetched
  } = useTasks();
  
  const { 
    boardMembers, 
    fetchMembers, 
    loading: membersLoading,
    hasFetched: membersHasFetched
  } = useMembers();
  
  const { 
    isDarkMode,
    openNewColumnModal,
    openAddMemberModal,
    openNewTaskModal,
    setSelectedColumn
  } = useUI();

  // Local state
  const [isInitialized, setIsInitialized] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    due_date: ''
  });

  // Initialize board data - runs only once per boardId
  useEffect(() => {
    if (!boardId || !isAuthenticated) {
      navigate('/boards');
      return;
    }

    const initializeBoard = async () => {
      setIsInitialized(false);
      
      try {
        // First, ensure we have boards loaded
        if (!boardsHasFetched && boards.length === 0) {
          await fetchBoards();
        }

        // Find the board in our current boards array
        const board = boards.find(b => b.id === boardId);
        
        if (!board) {
          console.error(`Board ${boardId} not found`);
          navigate('/boards');
          return;
        }

        // Set the selected board
        setSelectedBoard(board);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize board:', error);
        navigate('/boards');
      }
    };

    initializeBoard();
  }, [boardId, isAuthenticated, boardsHasFetched, boards, setSelectedBoard, navigate, fetchBoards]);

  // Fetch board-specific data - runs only when board is selected and we haven't fetched yet
  // Replace the current useEffect with this
// Update the useEffect to check the specific board
useEffect(() => {
  if (!selectedBoard?.id || !isInitialized) return;

  const loadBoardData = async () => {
    try {
      console.log(`[Debug] Loading data for board: ${selectedBoard.id}`);
      console.log(`[Debug] columnsHasFetched for this board:`, columnsHasFetched[selectedBoard.id]);
      
      // Check if columns were fetched for this specific board
      if (!columnsHasFetched[selectedBoard.id]) {
        console.log(`[Debug] Fetching columns for board: ${selectedBoard.id}`);
        await fetchColumns(selectedBoard.id);
        console.log(`[Debug] Columns after fetch:`, boardColumns);
      }

      // Similar logic for members
      if (!membersHasFetched[selectedBoard.id]) {
        await fetchMembers(selectedBoard.id);
      }
    } catch (error) {
      console.error('Failed to load board data:', error);
    }
  };

  loadBoardData();
}, [selectedBoard?.id, isInitialized, columnsHasFetched, membersHasFetched, fetchColumns, fetchMembers, boardColumns]);
  // Fetch tasks for each column - runs only when columns are loaded and tasks haven't been fetched
  useEffect(() => {
    if (!boardColumns || boardColumns.length === 0) return;

    const loadTasks = async () => {
      const promises = boardColumns
        .filter(column => column.board_id === selectedBoard?.id)
        .map(column => {
          // Only fetch if we haven't fetched tasks for this column yet
          if (!tasksHasFetched[column.id]) {
            return fetchTasks(column.id);
          }
          return Promise.resolve();
        });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, [boardColumns, selectedBoard?.id, tasksHasFetched, fetchTasks]);

  // Event handlers
  const handleBack = useCallback(() => navigate('/boards'), [navigate]);
  
  const handleStarBoard = useCallback(() => {
    if (selectedBoard) {
      starBoard(selectedBoard.id);
    }
  }, [selectedBoard, starBoard]);
  
  const handleAddColumn = useCallback(() => openNewColumnModal(), [openNewColumnModal]);
  
  const handleAddMember = useCallback(() => openAddMemberModal(), [openAddMemberModal]);
  
  const handleAddTask = useCallback((columnId: string) => {
    setSelectedColumn(columnId);
    openNewTaskModal(columnId);
  }, [setSelectedColumn, openNewTaskModal]);

  // Task editing handlers
  const handleEditTask = useCallback((task: any) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date || ''
    });
  }, []);

  const handleSaveTask = useCallback(async () => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask, editForm);
      setEditingTask(null);
      setEditForm({ title: '', description: '', priority: 'medium', due_date: '' });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [editingTask, editForm, updateTask]);

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
    setEditForm({ title: '', description: '', priority: 'medium', due_date: '' });
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  }, [deleteTask]);

  const handleRetry = useCallback(() => {
    if (selectedBoard?.id) {
      fetchColumns(selectedBoard.id);
      fetchMembers(selectedBoard.id);
    } else {
      fetchBoards();
    }
  }, [selectedBoard?.id, fetchColumns, fetchMembers, fetchBoards]);

  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 'high': return isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 'medium': return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 'low': return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      default: return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Zap className="w-3 h-3" />;
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  // Calculate stats with proper null checks
  const currentBoardColumns = boardColumns?.filter(col => col.board_id === selectedBoard?.id) || [];
  const currentBoardTasks = currentBoardColumns.reduce((acc, column) => {
    const columnTasks = boardTasks[column.id] || [];
    return [...acc, ...columnTasks];
  }, [] as any[]);
  
  const totalTasks = currentBoardTasks.length;
  const completedTasks = currentBoardTasks.filter(task => task.status === 'completed').length;

  // Loading state
  const isLoading = !isInitialized || boardsLoading || columnsLoading;
  
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <Loader2 className={`w-12 h-12 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
          </div>
          <p className={`mt-4 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading board...
          </p>
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  // Error state
  const error = boardsError || columnsError;
  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Board
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <div className="space-x-3">
            <button
              onClick={handleBack}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } transition-colors`}
            >
              Back to Boards
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Board not found
  if (!selectedBoard) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Board Not Found
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The board you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  // Task Card Component
  const TaskCard = ({ task, columnId }: { task: any; columnId: string }) => {
    const isEditing = editingTask === task.id;
    const isOverdue = task.due_date && new Date(task.due_date) < new Date();

    if (isEditing) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3`}>
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Task title..."
            />
            
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className={`w-full px-3 py-2 text-sm rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Task description..."
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                className={`px-2 py-1 text-sm rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              
              <input
                type="date"
                value={editForm.due_date}
                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                className={`px-2 py-1 text-sm rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className={`px-3 py-1 text-sm rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                <X className="w-3 h-3" />
              </button>
              <button
                onClick={handleSaveTask}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                <Save className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${
          isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
        } border rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer group`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h4 className={`font-medium text-sm leading-tight flex-1 pr-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {task.title}
          </h4>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditTask(task);
              }}
              className={`p-1 rounded ${
                isDarkMode 
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              } transition-colors`}
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id);
              }}
              className={`p-1 rounded ${
                isDarkMode 
                  ? 'hover:bg-red-900 text-gray-400 hover:text-red-300' 
                  : 'hover:bg-red-100 text-gray-400 hover:text-red-600'
              } transition-colors`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
            {task.description}
          </p>
        )}
        
        {/* Priority and Due Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)} flex items-center space-x-1`}>
            {getPriorityIcon(task.priority)}
            <span className="capitalize">{task.priority}</span>
          </span>
          
          {task.due_date && (
            <div className={`text-xs flex items-center space-x-1 ${
              isOverdue ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>
        
        {/* Assignees */}
        {task.task_assignees && task.task_assignees.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              {task.task_assignees.slice(0, 3).map((assignee: any, index: number) => (
                <div 
                  key={index} 
                  className={`w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 ${
                    isDarkMode ? 'border-gray-800' : 'border-white'
                  }`}
                  title={assignee.profiles?.full_name || 'User'}
                >
                  {assignee.profiles?.full_name?.charAt(0) || 'U'}
                </div>
              ))}
              {task.task_assignees.length > 3 && (
                <div className={`w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs border-2 ${
                  isDarkMode ? 'border-gray-800' : 'border-white'
                }`}>
                  +{task.task_assignees.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {task.task_tags && task.task_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.task_tags.slice(0, 2).map((tagObj: any, index: number) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-1 rounded ${
                  isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tagObj.tag}
              </span>
            ))}
            {task.task_tags.length > 2 && (
              <span className={`text-xs px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                +{task.task_tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors flex items-center space-x-2`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className={`w-8 h-8 ${selectedBoard.color} rounded-lg flex-shrink-0`}></div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold truncate">{selectedBoard.title}</h1>
                  <button
                    onClick={handleStarBoard}
                    className={`p-1 rounded transition-colors ${
                      selectedBoard.isStarred 
                        ? 'text-yellow-500' 
                        : isDarkMode 
                          ? 'text-gray-400 hover:text-yellow-400' 
                          : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${selectedBoard.isStarred ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                  {selectedBoard.description}
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {/* Members */}
                <div className="flex -space-x-2">
                  {(boardMembers || []).slice(0, 3).map((member, index) => (
                    <div 
                      key={member.id || index}
                      className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                      title={member.profiles?.full_name || member.profiles?.email}
                    >
                      {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || 'U'}
                    </div>
                  ))}
                  {(boardMembers || []).length > 3 && (
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                      +{boardMembers.length - 3}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddMember}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title="Add member"
                >
                  <Users className="w-4 h-4" />
                </button>

                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Filter className="w-4 h-4" />
                </button>
                
                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Search className="w-4 h-4" />
                </button>
                
                <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{totalTasks}</span>
                </div>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Team Members
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
          {columnsLoading && !currentBoardColumns.length ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
              </div>
              <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading columns...</span>
            </div>
          ) : currentBoardColumns && currentBoardColumns.length > 0 ? (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {currentBoardColumns
                .sort((a, b) => a.position - b.position)
                .map((column) => (
                  <div key={column.id} className="flex-shrink-0 w-72">
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {column.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                            {(boardTasks[column.id] || []).length}
                          </span>
                          <button 
                            onClick={() => handleAddTask(column.id)}
                            className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} transition-colors`}
                            title="Add task"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-3 min-h-[200px]">
                        {tasksLoading && !boardTasks[column.id] ? (
                          <div className="text-center py-4">
                            <div className="relative">
                              <Loader2 className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-2`} />
                            </div>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading tasks...</span>
                          </div>
                        ) : boardTasks[column.id] && boardTasks[column.id].length > 0 ? (
                          boardTasks[column.id].map((task) => (
                            <TaskCard key={task.id} task={task} columnId={column.id} />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-2xl mb-2">📝</div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              No tasks yet
                            </p>
                            <button
                              onClick={() => handleAddTask(column.id)}
                              className={`mt-2 text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}
                            >
                              Add your first task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {/* Add Column Button */}
              <div className="flex-shrink-0 w-72">
                <button 
                  onClick={handleAddColumn}
                  className={`w-full h-32 border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-gray-500 text-gray-400' : 'border-gray-300 hover:border-gray-400 text-gray-500'} rounded-lg flex items-center justify-center transition-colors group`}
                >
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Add Column</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No columns yet
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your first column to start organizing tasks.
              </p>
              <button 
                onClick={handleAddColumn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal />
    </div>
  );
};

export default BoardDetail;