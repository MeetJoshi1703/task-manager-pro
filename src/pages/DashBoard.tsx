import React from 'react';
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
  Timer
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const Dashboard: React.FC = () => {
  const { 
    boards, 
    isDarkMode, 
    setCurrentView, 
    setSelectedBoard, 
    setShowNewBoardModal,
    users 
  } = useBoardStore();

  // Calculate dashboard stats
  const totalBoards = boards.length;
  const totalTasks = boards.reduce((sum, board) => sum + board.taskCount, 0);
  const completedTasks = boards.reduce((sum, board) => sum + board.completedTasks, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const starredBoards = boards.filter(board => board.isStarred);
  
  // Get recent boards (sorted by updated date)
  const recentBoards = [...boards]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  // Calculate upcoming tasks and overdue tasks
  const allTasks = boards.flatMap(board => 
    board.columns.flatMap(column => 
      column.tasks.map(task => ({ ...task, boardTitle: board.title }))
    )
  );
  
  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = allTasks.filter(task => task.dueDate && task.dueDate >= today).slice(0, 5);
  const overdueTasks = allTasks.filter(task => task.dueDate && task.dueDate < today);

  // Activity feed (mock data based on board updates)
  const recentActivity = boards
    .map(board => ({
      id: board.id,
      type: 'board_update',
      title: `Updated ${board.title}`,
      time: board.updatedAt,
      icon: Activity,
      color: 'text-blue-500'
    }))
    .slice(0, 6);

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, bgPattern }: any) => (
    <div className={`
      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
      rounded-xl p-6 border hover:shadow-xl transition-all duration-300 cursor-pointer
      hover:scale-[1.02] group relative overflow-hidden
    `}>
      {/* Background Pattern */}
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

  const BoardCard = ({ board }: any) => {
    const progressPercentage = board.taskCount > 0 
      ? Math.round((board.completedTasks / board.taskCount) * 100) 
      : 0;

    return (
      <div 
        onClick={() => {
          setSelectedBoard(board);
          setCurrentView('board-detail');
        }}
        className={`
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          rounded-xl p-5 border hover:shadow-xl transition-all duration-300 cursor-pointer
          hover:scale-[1.02] group relative overflow-hidden
        `}
      >
        {/* Background Gradient */}
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
                  {board.taskCount}
                </span>
                <span className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="w-4 h-4 mr-1" />
                  {board.members.length}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }: any) => {
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
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColors[task.priority]}`}>
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

//   <TopBar 
//         title="My Boards"
//         subtitle="Manage your projects and collaborate with your team"
//         showSearch={true}
//         showViewToggle={true}
//         showFilters={true}
//       />
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Global TopBar */}
      <TopBar 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your projects."
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Boards"
            value={totalBoards}
            subtitle="Active projects"
            icon={Kanban}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="+12% from last month"
            bgPattern={true}
          />
          <StatCard
            title="Total Tasks"
            value={totalTasks}
            subtitle="Across all boards"
            icon={Target}
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend="+8% from last week"
            bgPattern={true}
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            subtitle={`${completionRate}% completion rate`}
            icon={CheckCircle2}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend="+15% efficiency"
            bgPattern={true}
          />
          <StatCard
            title="Team Members"
            value={users.length}
            subtitle="Active contributors"
            icon={Users}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            bgPattern={true}
          />
        </div>

        {/* Quick Stats Row */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Boards & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
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
                  onClick={() => setCurrentView('boards')}
                  className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 group`}
                >
                  <Kanban className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View All Boards</span>
                </button>
              </div>
            </div>

            {/* Recent Boards */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-semibold flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Boards
                </h2>
                <button 
                  onClick={() => setCurrentView('boards')}
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
            </div>

            {/* Starred Boards */}
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

          {/* Right Column - Tasks & Activity */}
          <div className="space-y-8">
            {/* Upcoming Tasks */}
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

            {/* Overdue Tasks */}
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

            {/* Recent Activity */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
              <h2 className={`text-xl font-semibold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Activity className="w-5 h-5 mr-2 text-purple-500" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 group">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.title}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.time}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;