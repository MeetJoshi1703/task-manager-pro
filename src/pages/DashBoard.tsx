import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Star,
  Plus,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertCircle,
  Activity,
  Kanban,
  ChevronRight,
  Zap,
  Award,
  Timer,
  X,
  PlusCircle
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const dummyBoards = [];
const dummyTasks = [];

const Dashboard = () => {
  const { 
    boards, 
    isDarkMode, 
    setCurrentView, 
    setSelectedBoard, 
    setShowNewBoardModal,
    users,
    fetchBoards,
    boardTasks,
    boardColumns,
    isAuthenticated,
    loading
  } = useBoardStore();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    boards: [],
    tasks: [],
    loading: true
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    const loadDashboardData = async () => {
      try {
        if (isAuthenticated) {
          await fetchBoards();
          setHasInitialized(true);
        } else {
          setDashboardData({
            boards: dummyBoards,
            tasks: dummyTasks,
            loading: false
          });
          setHasInitialized(true);
        }
      } catch (error) {
        console.error('Failed to load dashboard data, using dummy data:', error);
        setDashboardData({
          boards: dummyBoards,
          tasks: dummyTasks,
          loading: false
        });
        setHasInitialized(true);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, hasInitialized, fetchBoards]);

  useEffect(() => {
    if (!hasInitialized) return;
    
    if (isAuthenticated && boards.length > 0) {
      const realTasks = [];
      Object.values(boardTasks).forEach(columnTasks => {
        if (Array.isArray(columnTasks)) {
          realTasks.push(...columnTasks.map(task => ({
            ...task,
            boardTitle: boards.find(b => b.id === task.board_id)?.title || 'Unknown Board'
          })));
        }
      });

      setDashboardData({
        boards: boards,
        tasks: realTasks.length > 0 ? realTasks : dummyTasks,
        loading: false
      });
    }
  }, [boards, boardTasks, isAuthenticated, hasInitialized]);

  const { boards: currentBoards, tasks: currentTasks } = dashboardData;
  
  const totalBoards = currentBoards.length;
  const totalTasks = currentBoards.reduce((sum, board) => sum + (board.taskCount || 0), 0) || currentTasks.length;
  const completedTasks = currentBoards.reduce((sum, board) => sum + (board.completedTasks || 0), 0) || 
    currentTasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const starredBoards = currentBoards.filter(board => board.isStarred);
  
  const recentBoards = [...currentBoards]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 4);

  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = currentTasks
    .filter(task => task.dueDate && task.dueDate >= today && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);
  
  const overdueTasks = currentTasks
    .filter(task => task.dueDate && task.dueDate < today && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const recentActivity = currentBoards
    .map(board => ({
      id: board.id,
      type: 'board_update',
      title: `Updated ${board.title}`,
      time: board.updatedAt || board.createdAt || '2024-06-01',
      icon: Activity,
      color: 'text-blue-500'
    }))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, bgPattern }) => (
    <div className={`
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
      rounded-xl p-6 border hover:shadow-xl transition-all duration-300 cursor-pointer
      hover:scale-[1.02] group relative overflow-hidden
    `}>
      {bgPattern && (
        <div className="absolute inset-0 opacity-5">
          <div className={`w-32 h-32 ${color} rounded-full -top-8 -right-8 absolute`}></div>
          <div className={`w-20 h-20 ${color} rounded-full -bottom-4 -left-4 absolute`}></div>
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold mt-2 group-hover:scale-105 transition-transform ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {value}
            </p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          </div>
          <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition-transform shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center mt-4 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  const BoardCard = ({ board }) => {
    const progressPercentage = board.taskCount > 0 
      ? Math.round((board.completedTasks / board.taskCount) * 100) 
      : 0;

    return (
      <div 
        onClick={() => {
          setSelectedBoard(board);
          navigate(`/boards/${board.id}`);
        }}
        className={`
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          rounded-xl p-5 border hover:shadow-xl transition-all duration-300 cursor-pointer
          hover:scale-[1.02] group relative overflow-hidden
        `}
      >
        <div className={`absolute inset-0 ${board.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${board.color} rounded-lg flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}></div>
            <div className="flex items-center space-x-2">
              {board.isStarred && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                board.priority === 'high' ? 'bg-red-100 text-red-600' :
                board.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {board.priority}
              </span>
            </div>
          </div>
          
          <h3 className={`font-semibold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {board.title}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
            {board.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Progress</span>
              <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{progressPercentage}%</span>
            </div>
            
            <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Target className="w-4 h-4 mr-1" />
                  {board.taskCount || 0}
                </span>
                <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="w-4 h-4 mr-1" />
                  {board.members?.length || 0}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }) => {
    const isOverdue = task.dueDate && task.dueDate < today;
    const priorityColors = {
      low: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
      high: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      critical: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    };

    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
        rounded-lg p-4 border hover:shadow-md transition-all duration-200 cursor-pointer
      `}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {task.boardTitle}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColors[task.priority] || priorityColors.medium}`}>
              {task.priority}
            </span>
            {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>
        
        {task.dueDate && (
          <div className={`flex items-center mt-3 text-sm ${isOverdue ? 'text-red-600' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  // Empty state for when no data is loaded
  if (dashboardData.loading || loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto px-4">
          <PlusCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Get Started with Your First Board
          </h2>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No boards found. Create your first board to start organizing your projects and tasks!
          </p>
          <button
            onClick={() => setShowNewBoardModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center mx-auto group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Create New Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <TopBar 
        title="Dashboard" 
        subtitle={isAuthenticated ? "Welcome back! Here's what's happening with your projects." : "Demo Dashboard - Explore your project management workspace"}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                You're viewing demo data. Sign in to see your real projects and tasks.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Boards"
            value={totalBoards}
            subtitle="Active projects"
            icon={Kanban}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend={isAuthenticated ? "+12% from last month" : "Demo data"}
            bgPattern={true}
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            subtitle="Across all boards"
            icon={Target}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend={isAuthenticated ? "+8% from last week" : "Demo data"}
            bgPattern={true}
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            subtitle={`${completionRate}% completion rate`}
            icon={CheckCircle2}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend={isAuthenticated ? "+15% efficiency" : "Demo data"}
            bgPattern={true}
          />
          <StatCard
            title="Team Members"
            value={users.length || 5}
            subtitle="Active contributors"
            icon={Users}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            bgPattern={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Starred Boards</p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{starredBoards.length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overdue Tasks</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{overdueTasks.length}</p>
              </div>
              <Timer className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Completion Rate</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{completionRate}%</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <h2 className={`text-xl font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowNewBoardModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-3 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Create New Board</span>
                </button>
                <button 
                  onClick={() => navigate('/boards')}
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 group`}
                >
                  <Kanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View All Boards</span>
                </button>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Boards
                </h2>
                <button 
                  onClick={() => navigate('/boards')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium group"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>

              {recentBoards.length === 0 && (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  <Kanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No boards yet</p>
                  <p className="text-sm">Create your first board to get started!</p>
                </div>
              )}
            </div>

            {starredBoards.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
                  Starred Boards
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {starredBoards.slice(0, 4).map((board) => (
                    <BoardCard key={board.id} board={board} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Upcoming Tasks
                </h2>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {upcomingTasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
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

            {overdueTasks.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border border-red-200 dark:border-red-800`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-red-600 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Overdue Tasks
                  </h2>
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium">
                    {overdueTasks.length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Activity className="w-5 h-5 mr-2 text-purple-500" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 group">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(activity.time).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No recent activity</p>
                    <p className="text-sm">Activity will appear here as you work on projects</p>
                  </div>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" />
                  Performance Metrics
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tasks Completed This Week</span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Math.floor(completedTasks * 0.3)} / {Math.floor(totalTasks * 0.3)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Completion Time</span>
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2.3 days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Productivity Score</span>
                    <span className="font-bold text-green-600">{Math.min(95, completionRate + 10)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Award className="w-5 h-5 mr-2 text-green-500" />
              Project Health Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(totalBoards * 0.7)}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>On Track</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(totalBoards * 0.2)}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>At Risk</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(totalBoards * 0.1)}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Blocked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;