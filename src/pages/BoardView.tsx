import React, { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import BoardList from '../components/BoardList';
import { Search, Filter, Plus, Grid3X3, List, Loader2 } from 'lucide-react';

const BoardView: React.FC = () => {
  const { 
    setShowNewBoardModal, 
    viewMode, 
    setViewMode, 
    searchTerm, 
    setSearchTerm, 
    filterPriority, 
    setFilterPriority, 
    isDarkMode, 
    fetchBoards, 
    loading, 
    error,
    boards
  } = useBoardStore();

  useEffect(() => {
    // Only fetch boards if we don't have any data yet
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [fetchBoards, boards.length]);

  const handleRetry = () => {
    fetchBoards();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Boards
              </h1>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Organize your projects and collaborate with your team
              </p>
            </div>
            
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <button
                onClick={() => setShowNewBoardModal(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Plus className="w-5 h-5" />
                <span>Create Board</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search boards..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
              />
            </div>

            {/* Filter and View Controls */}
            <div className="flex items-center space-x-3">
              {/* Priority Filter */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={`pl-10 pr-8 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors appearance-none cursor-pointer`}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} p-1`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
              </div>
              <p className={`mt-4 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading boards...
              </p>
              <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Please wait while we fetch your data
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className={`rounded-xl border ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-800 text-red-200' 
                : 'bg-red-50 border-red-200 text-red-800'
            } p-8 text-center`}>
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Unable to Load Boards</h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                {error}
              </p>
              <button
                onClick={handleRetry}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-red-800 hover:bg-red-700 text-red-100'
                    : 'bg-red-100 hover:bg-red-200 text-red-800'
                }`}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && boards.length === 0 && (
            <div className={`rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } p-12 text-center`}>
              <div className="text-6xl mb-6">📋</div>
              <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No boards yet
              </h3>
              <p className={`text-sm mb-6 max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get started by creating your first board to organize your projects and collaborate with your team.
              </p>
              <button
                onClick={() => setShowNewBoardModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Board</span>
              </button>
            </div>
          )}

          {/* Boards List */}
          {!loading && !error && boards.length > 0 && (
            <div className="animate-in fade-in duration-500">
              <BoardList />
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {!loading && !error && boards.length > 0 && (
          <div className={`mt-8 p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Showing {boards.length} board{boards.length !== 1 ? 's' : ''}
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Total tasks: {boards.reduce((acc, board) => acc + board.taskCount, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardView;