import React from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  BarChart3,
  Star,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import Column from '../components/Column';

const BoardDetail: React.FC = () => {
  const { 
    selectedBoard, 
    setCurrentView, 
    isDarkMode, 
    setIsDarkMode,
    setShowNewColumnModal,
    starBoard
  } = useBoardStore();

  if (!selectedBoard) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Board not found</h2>
          <button
            onClick={() => setCurrentView('boards')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = selectedBoard.taskCount > 0 
    ? Math.round((selectedBoard.completedTasks / selectedBoard.taskCount) * 100) 
    : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button and board info */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('boards')}
                className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors flex items-center space-x-2`}
                title="Back to boards"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className={`w-8 h-8 ${selectedBoard.color} rounded-lg flex-shrink-0`}></div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold truncate">{selectedBoard.title}</h1>
                  <button
                    onClick={() => starBoard(selectedBoard.id)}
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
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                  {selectedBoard.description}
                </p>
              </div>
            </div>
            
            {/* Right side - Stats and actions */}
            <div className="flex items-center space-x-4">
              {/* Board Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{progressPercentage}% Complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Updated {selectedBoard.updatedAt}</span>
                </div>
              </div>
              
              {/* Team Members */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div className="flex -space-x-2">
                  {selectedBoard.members.slice(0, 4).map((member, index) => (
                    <div 
                      key={index} 
                      className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-sm font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                      title={member}
                    >
                      {member.charAt(0)}
                    </div>
                  ))}
                  {selectedBoard.members.length > 4 && (
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                      +{selectedBoard.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title="Board settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Board Progress</span>
            <span className="text-sm">{selectedBoard.completedTasks} of {selectedBoard.taskCount} tasks completed</span>
          </div>
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Board Content - Kanban Columns */}
      <div className="p-6">
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {selectedBoard.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          
          {/* Add Column Button */}
          <div className="flex-shrink-0 w-80">
            <button 
              onClick={() => setShowNewColumnModal(true)}
              className={`w-full p-6 border-2 border-dashed ${
                isDarkMode 
                  ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 hover:bg-gray-50'
              } rounded-lg transition-all flex flex-col items-center justify-center space-y-2 min-h-[200px] group`}
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add Column</span>
              <span className="text-sm opacity-75">Create a new list</span>
            </button>
          </div>
        </div>
        
        {/* Empty state for boards with no columns */}
        {selectedBoard.columns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Get started with your board</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Create columns like "To Do", "In Progress", and "Done" to organize your tasks
            </p>
            <button 
              onClick={() => setShowNewColumnModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Column</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;