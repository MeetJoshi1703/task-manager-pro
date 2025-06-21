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
  Settings
} from 'lucide-react';
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
    currentView
  } = useBoardStore();

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
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">Pro</span>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button
              className={`relative p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </button>

            {/* Settings */}
            <button
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
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
            
            {/* User Profile */}
            <button className={`flex items-center space-x-2 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                J
              </div>
              <span className="hidden md:block font-medium">John Doe</span>
            </button>
            
            {/* New Board Button - only show on relevant pages */}
            {(currentView === 'boards' || currentView === 'dashboard') && (
              <button
                onClick={() => setShowNewBoardModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Board</span>
              </button>
            )}
          </div>
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

            {/* Search and Controls - only show if requested */}
            {(showSearch || showViewToggle || showFilters) && (
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