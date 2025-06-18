import React from 'react';
import { 
  Star, 
  CheckCircle, 
  Clock, 
  MoreHorizontal,
  Zap,
  AlertCircle
} from 'lucide-react';
import type { Board } from '../types/types';
import { useBoardStore } from '../store/boardStore';

interface BoardCardProps {
  board: Board;
  viewMode: 'grid' | 'list';
}

const BoardCard: React.FC<BoardCardProps> = ({ board, viewMode }) => {
  const { setSelectedBoard, setCurrentView, isDarkMode, starBoard } = useBoardStore();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleBoardClick = () => {
    setSelectedBoard(board);
    setCurrentView('board-detail');
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    starBoard(board.id);
  };

  const progressPercentage = board.taskCount > 0 ? (board.completedTasks / board.taskCount) * 100 : 0;

  if (viewMode === 'list') {
    return (
      <tr 
        className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} cursor-pointer transition-colors`} 
        onClick={handleBoardClick}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${board.color} rounded-lg mr-4 flex-shrink-0`}></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{board.title}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                {board.description}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(board.priority)} flex items-center space-x-1 w-fit`}>
            {getPriorityIcon(board.priority)}
            <span className="capitalize">{board.priority}</span>
          </span>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div 
              className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mr-2`} 
              style={{width: '100px'}}
            >
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {board.completedTasks}/{board.taskCount}
            </span>
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex -space-x-2">
            {board.members.slice(0, 3).map((member, index) => (
              <div 
                key={index} 
                className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-sm font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                title={member}
              >
                {member.charAt(0)}
              </div>
            ))}
            {board.members.length > 3 && (
              <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                +{board.members.length - 3}
              </div>
            )}
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStarClick}
              className={`p-1 rounded transition-colors ${board.isStarred ? 'text-yellow-500' : isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className={`w-4 h-4 ${board.isStarred ? 'fill-current' : ''}`} />
            </button>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {board.updatedAt}
            </span>
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button 
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </td>
      </tr>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleBoardClick}
      className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border overflow-hidden group`}
    >
      {/* Card Header with Gradient */}
      <div className={`h-32 ${board.color} relative`}>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleStarClick}
            className={`p-1 rounded transition-colors ${board.isStarred ? 'text-yellow-300' : 'text-white/70 hover:text-yellow-300'}`}
          >
            <Star className={`w-4 h-4 ${board.isStarred ? 'fill-current' : ''}`} />
          </button>
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(board.priority)} flex items-center space-x-1`}>
            {getPriorityIcon(board.priority)}
            <span className="capitalize">{board.priority}</span>
          </span>
        </div>
        
        {/* Members avatars */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex -space-x-2">
            {board.members.slice(0, 3).map((member, index) => (
              <div 
                key={index} 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-medium backdrop-blur-sm border border-white/30"
                title={member}
              >
                {member.charAt(0)}
              </div>
            ))}
            {board.members.length > 3 && (
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium backdrop-blur-sm border border-white/30">
                +{board.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {board.title}
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
          {board.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <CheckCircle className="w-4 h-4" />
              <span>{board.completedTasks}/{board.taskCount}</span>
            </div>
            <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock className="w-4 h-4" />
              <span>{board.updatedAt}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Progress
            </span>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;