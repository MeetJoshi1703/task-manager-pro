import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  Filter,
  List,
  Grid3X3,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const Calendar: React.FC = () => {
  const { boards, isDarkMode, setShowNewTaskModal, setSelectedColumn } = useBoardStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [selectedFilters, setSelectedFilters] = useState({
    priority: 'all',
    board: 'all',
    assignee: 'all'
  });

  // Get all tasks with due dates
  const allTasks = useMemo(() => {
    return boards.flatMap(board => 
      board.columns.flatMap(column => 
        column.tasks
          .filter(task => task.dueDate)
          .map(task => ({
            ...task,
            boardTitle: board.title,
            boardColor: board.color,
            boardId: board.id,
            columnId: column.id
          }))
      )
    );
  }, [boards]);

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      if (selectedFilters.priority !== 'all' && task.priority !== selectedFilters.priority) return false;
      if (selectedFilters.board !== 'all' && task.boardId !== selectedFilters.board) return false;
      if (selectedFilters.assignee !== 'all' && !task.assignedTo.includes(selectedFilters.assignee)) return false;
      return true;
    });
  }, [allTasks, selectedFilters]);

  // Calendar utilities
  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonth - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonth - i)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }
    
    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth]);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredTasks.filter(task => task.dueDate === dateStr);
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Quick add task function
  const handleQuickAddTask = (date: Date) => {
    // You'll need to implement this based on your task creation flow
    // For now, we'll use a simple approach
    const firstBoard = boards[0];
    if (firstBoard && firstBoard.columns.length > 0) {
      setSelectedColumn(firstBoard.columns[0].id);
      setShowNewTaskModal(true);
    }
  };

  const TaskPriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
      <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${colors[priority] || colors.medium}`}>
        {priority}
      </span>
    );
  };

  const CalendarDay = ({ dayData }: { dayData: any }) => {
    const { day, isCurrentMonth, date } = dayData;
    const tasksForDay = getTasksForDate(date);
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today && !isToday;

    return (
      <div 
        className={`
          min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 
          ${isCurrentMonth 
            ? isDarkMode ? 'bg-gray-800' : 'bg-white' 
            : isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }
          ${isToday ? 'ring-2 ring-blue-500' : ''}
          hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer
          group
        `}
        onClick={() => handleQuickAddTask(date)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`
            text-sm font-medium
            ${isToday ? 'text-blue-600 font-bold' : ''}
            ${!isCurrentMonth ? 'text-gray-400' : isDarkMode ? 'text-white' : 'text-gray-900'}
            ${isPast && isCurrentMonth ? 'opacity-60' : ''}
          `}>
            {day}
          </span>
          {isToday && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>

        <div className="space-y-1">
          {tasksForDay.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className={`
                p-1.5 rounded text-xs truncate
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                transition-colors cursor-pointer group/task
              `}
              onClick={(e) => {
                e.stopPropagation();
                // Handle task click - could open task details
              }}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {task.title}
                </span>
                <TaskPriorityBadge priority={task.priority} />
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                {task.boardTitle}
              </div>
            </div>
          ))}
          
          {tasksForDay.length > 3 && (
            <div className={`text-xs text-center py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              +{tasksForDay.length - 3} more
            </div>
          )}
          
          {tasksForDay.length === 0 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`text-xs text-center py-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} border border-dashed border-gray-300 dark:border-gray-600 rounded`}>
                + Add task
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AgendaView = () => {
    const upcomingTasks = filteredTasks
      .filter(task => new Date(task.dueDate!) >= today)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 20);

    const overdueTasks = filteredTasks
      .filter(task => new Date(task.dueDate!) < today)
      .sort((a, b) => new Date(b.dueDate!).getTime() - new Date(a.dueDate!).getTime());

    return (
      <div className="space-y-6">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border border-red-200 dark:border-red-800`}>
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Overdue ({overdueTasks.length})
            </h3>
            <div className="space-y-3">
              {overdueTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Upcoming Tasks ({upcomingTasks.length})
          </h3>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No upcoming tasks</p>
                <p className="text-sm">You're all caught up! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TaskCard = ({ task }: { task: any }) => {
    const isOverdue = new Date(task.dueDate!) < today;
    const dueDate = new Date(task.dueDate!);

    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} 
        rounded-lg p-4 transition-colors cursor-pointer
      `}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {task.boardTitle}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className={`flex items-center ${isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <CalendarIcon className="w-4 h-4 mr-1" />
                {dueDate.toLocaleDateString()}
              </span>
              {task.assignedTo.length > 0 && (
                <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="w-4 h-4 mr-1" />
                  {task.assignedTo.length}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <TaskPriorityBadge priority={task.priority} />
            {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="Calendar" 
        subtitle="Manage your schedule and track task deadlines"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousMonth}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className={`text-xl font-semibold min-w-[200px] text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={goToNextMonth}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilters.priority}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value }))}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={selectedFilters.board}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, board: e.target.value }))}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Boards</option>
                {boards.map(board => (
                  <option key={board.id} value={board.id}>{board.title}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} overflow-hidden`}>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 text-sm transition-colors flex items-center space-x-1 ${
                  viewMode === 'month' 
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Month</span>
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-2 text-sm transition-colors flex items-center space-x-1 ${
                  viewMode === 'agenda' 
                    ? 'bg-blue-500 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Agenda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        {viewMode === 'month' ? (
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className={`p-4 text-center font-medium ${isDarkMode ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-gray-50'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dayData, index) => (
                <CalendarDay key={index} dayData={dayData} />
              ))}
            </div>
          </div>
        ) : (
          <AgendaView />
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Tasks</p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{filteredTasks.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Due Today</p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getTasksForDate(today).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {filteredTasks.filter(task => new Date(task.dueDate!) < today).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>This Week</p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredTasks.filter(task => {
                    const taskDate = new Date(task.dueDate!);
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay());
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return taskDate >= startOfWeek && taskDate <= endOfWeek;
                  }).length}
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;