import React from 'react';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Moon, 
  Sun,
  Bell,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showViewToggle?: boolean;
  showFilters?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  showViewToggle = false,
  showFilters = false 
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    filterPriority, 
    setFilterPriority,
    viewMode, 
    setViewMode,
    isDarkMode, 
    setIsDarkMode,
    setShowNewBoardModal,
    getUnreadNotificationCount,
    currentUser,
    isAuthenticated,
    logout
  } = useBoardStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = getUnreadNotificationCount();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    navigate('/settings'); // Or navigate to profile page if you have one
  };

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user role badge
  const getUserRoleBadge = (role?: string) => {
    if (!role) return 'Free';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'owner':
        return 'Owner';
      case 'member':
        return 'Pro';
      case 'viewer':
        return 'View';
      default:
        return 'Free';
    }
  };

  const getBadgeColor = (role?: string) => {
    if (!role) return 'bg-gray-100 text-gray-800';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'member':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'viewer':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            {isAuthenticated && currentUser && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeColor(currentUser.role)}`}>
                {getUserRoleBadge(currentUser.role)}
              </span>
            )}
          </div>
          
          {/* Header Actions - only show if authenticated */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button
                onClick={handleNotificationClick}
                className={`relative p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors ${
                  location.pathname === '/notifications' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''
                }`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button
                onClick={handleSettingsClick}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors ${
                  location.pathname === '/settings' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button 
                  onClick={handleProfileClick}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title="User profile"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {getUserInitials(currentUser?.name)}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="block font-medium text-sm">
                      {currentUser?.name || 'User'}
                    </span>
                    <span className={`block text-xs capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser?.role || 'member'}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-sm">{currentUser?.name || 'User'}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser?.email || 'user@example.com'}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className={`w-full text-left px-3 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors flex items-center space-x-2`}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile & Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-3 py-2 text-sm ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors flex items-center space-x-2 text-red-600 dark:text-red-400`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* New Board Button - only show on relevant pages */}
              {(location.pathname === '/boards' || location.pathname === '/dashboard') && (
                <button
                  onClick={() => setShowNewBoardModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Board</span>
                </button>
              )}
            </div>
          )}

          {/* Login Button - show if not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle for unauthenticated users */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Title */}
            <div>
              <h2 className="text-3xl font-bold">{title}</h2>
              {subtitle && (
                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Search and Controls - only show if requested and authenticated */}
            {isAuthenticated && (showSearch || showViewToggle || showFilters) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                {showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search boards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full sm:w-80 pl-10 pr-4 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    />
                  </div>
                )}
                
                {/* Filters and View Controls */}
                <div className="flex items-center space-x-2">
                  {/* Priority Filter */}
                  {showFilters && (
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className={`px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 transition-colors`}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  )}
                  
                  {/* View Mode Toggle */}
                  {showViewToggle && (
                    <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} overflow-hidden`}>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-blue-500 text-white' 
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        title="Grid view"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-blue-500 text-white' 
                            : isDarkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        title="List view"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;