import React, { useState, useEffect } from 'react';
import { X, Save, Tag, Kanban, ArrowRight } from 'lucide-react';
import { useBoardStore } from './store/boardStore';
import BoardView from './pages/BoardView';
import BoardDetail from './pages/BoardDetail';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import TeamMembers from './pages/TeamMembers';
import MyTasks from './pages/MyTasks';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AuthModal from './components/AuthModal';
import AddMemberModal from './components/AddMemberModal';
import type { CreateBoardData, CreateTaskData, CreateColumnData } from './types/types';
// import { default as NewTaskModal } from './components/TaskModal';

// Landing Page Component for Unauthenticated Users
const LandingPage: React.FC = () => {
  const { isDarkMode, setShowAuthModal, setAuthMode, loginAsDemo } = useBoardStore();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} flex flex-col`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Kanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TaskFlow</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Project Management Made Simple
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Kanban className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Organize your projects with beautiful, intuitive Kanban boards
            </p>
            <p className={`text-lg mb-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto`}>
              Streamline your workflow, collaborate with your team, and track progress with our modern project management solution.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Kanban className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Kanban Boards</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Visual workflow management with drag-and-drop functionality
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Assign tasks, track progress, and communicate with your team
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Save className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Stay synchronized with instant updates and notifications
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 flex items-center space-x-2 text-lg font-medium"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={loginAsDemo}
              className={`px-8 py-4 rounded-xl border-2 border-dashed ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              } transition-all duration-200 flex items-center space-x-2 text-lg font-medium`}
            >
              <span>Try Demo Mode</span>
              <Kanban className="w-5 h-5" />
            </button>
          </div>

          <p className={`text-sm mt-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No credit card required • Get started in seconds
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2024 TaskFlow. Built with React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const { 
    isAuthenticated,
    isDarkMode,
    showNewBoardModal,
    setShowNewBoardModal,
    showNewColumnModal,
    setShowNewColumnModal,
    selectedBoard,
    createBoard,
    createColumn,
    checkAuthStatus
  } = useBoardStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setIsCheckingAuth(false);
    };
    
    initializeAuth();
  }, [checkAuthStatus]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Kanban className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            TaskFlow
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AuthModal />
      </Router>
    );
  }

  // New Board Modal
  const NewBoardModal = () => {
    const [formData, setFormData] = useState<CreateBoardData>({
      title: '',
      description: '',
      priority: 'medium',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
    });

    const colorOptions = [
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-yellow-500 to-orange-500',
      'bg-gradient-to-br from-red-500 to-pink-500',
      'bg-gradient-to-br from-gray-500 to-gray-700',
      'bg-gradient-to-br from-teal-500 to-blue-600'
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim()) {
        createBoard(formData);
        setFormData({ 
          title: '', 
          description: '', 
          priority: 'medium', 
          color: colorOptions[0] 
        });
      }
    };

    const handleClose = () => {
      setShowNewBoardModal(false);
      setFormData({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        color: colorOptions[0] 
      });
    };

    if (!showNewBoardModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Board</h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Board Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter board title..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Board description..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateBoardData['priority'] })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-full h-12 ${color} rounded-lg border-2 ${formData.color === color ? 'border-white shadow-lg scale-105' : 'border-transparent'} transition-all hover:scale-105`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // New Column Modal
  const NewColumnModal = () => {
    const [formData, setFormData] = useState<CreateColumnData>({
      title: '',
      color: 'bg-gray-100'
    });

    const columnColors = [
      { color: 'bg-gray-100', name: 'Gray' },
      { color: 'bg-blue-100', name: 'Blue' },
      { color: 'bg-green-100', name: 'Green' },
      { color: 'bg-yellow-100', name: 'Yellow' },
      { color: 'bg-purple-100', name: 'Purple' },
      { color: 'bg-red-100', name: 'Red' },
      { color: 'bg-indigo-100', name: 'Indigo' },
      { color: 'bg-pink-100', name: 'Pink' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim() && selectedBoard) {
        createColumn(selectedBoard.id, formData);
        setFormData({ title: '', color: 'bg-gray-100' });
      }
    };

    const handleClose = () => {
      setShowNewColumnModal(false);
      setFormData({ title: '', color: 'bg-gray-100' });
    };

    if (!showNewColumnModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Column</h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Column Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. To Do, In Progress, Done..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {columnColors.map((colorOption, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: colorOption.color })}
                      className={`w-full h-12 ${colorOption.color} rounded-lg border-2 ${formData.color === colorOption.color ? 'border-gray-400 shadow-lg scale-105' : 'border-transparent'} transition-all hover:scale-105 flex items-center justify-center`}
                      title={colorOption.name}
                    >
                      <span className="text-xs font-medium text-gray-700">{colorOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Create Column
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className={`font-sans flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/boards" element={<BoardView />} />
              <Route path="/boards/:boardId" element={<BoardDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/team" element={<TeamMembers />} />
              <Route path="/tasks" element={<MyTasks />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>

        {/* Modals */}
        <NewBoardModal />
        {/* <NewTaskModal /> */}
        <NewColumnModal />
        <AuthModal />
         <AddMemberModal />
      </div>
    </Router>
  );
};

export default App;