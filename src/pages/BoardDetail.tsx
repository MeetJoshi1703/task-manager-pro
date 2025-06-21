import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Calendar, 
  BarChart3,
  Star,
  Settings,
  Moon,
  Sun,
  GripVertical
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import Column from '../components/Column';

// Move AddColumnModal outside the main component
const AddColumnModal: React.FC = () => {
  const [columnTitle, setColumnTitle] = useState('');
  const { showNewColumnModal, setShowNewColumnModal, createColumn, selectedBoard, isDarkMode } = useBoardStore();
  
  if (!showNewColumnModal || !selectedBoard) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnTitle.trim()) {
      createColumn(selectedBoard.id, {
        title: columnTitle.trim(),
        color: 'bg-gray-100' // Default color, you can make this customizable
      });
      setColumnTitle('');
      setShowNewColumnModal(false);
    }
  };

  const handleClose = () => {
    setColumnTitle('');
    setShowNewColumnModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 w-full max-w-md mx-4`}>
        <h2 className="text-xl font-semibold mb-4">Add New Column</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Title
            </label>
            <input
              type="text"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              placeholder="Enter column title..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!columnTitle.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Draggable Column Wrapper Component - Back to Working V1 Logic
const DraggableColumn: React.FC<{ 
  column: any; 
  index: number; 
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDarkMode: boolean;
}> = ({ 
  column, 
  index, 
  isDragOver,
  onDragStart, 
  onDragOver, 
  onDragEnter, 
  onDragLeave, 
  onDrop, 
  onDragEnd,
  isDarkMode 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    // Only allow dragging from the drag handle
    const target = e.target as HTMLElement;
    const isDragHandle = target.closest('.column-drag-handle');
    
    if (!isDragHandle) {
      e.preventDefault();
      return;
    }
    
    setIsDragging(true);
    onDragStart(e, index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  };

  return (
    <div
      draggable={false}
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        flex-shrink-0 w-80 relative transition-all duration-300 ease-out
        ${isDragging ? 'opacity-60 scale-[0.98] rotate-1 z-50' : 'opacity-100 scale-100 rotate-0'}
        ${isDragOver ? `transform scale-105 ${isDarkMode ? 'shadow-blue-400/30' : 'shadow-blue-500/30'} shadow-lg` : ''}
        ${isHovered && !isDragging ? 'transform scale-[1.02]' : ''}
      `}
      style={{
        filter: isDragging ? 'blur(1px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Enhanced Drag Handle - Fixed positioning */}
      <div 
        draggable={true}
        onDragStart={handleDragStart}
        className={`
        column-drag-handle absolute -left-3 top-6 z-20 p-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing
        ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600' : 'bg-white hover:bg-gray-50 border border-gray-200'} 
        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
        transition-all duration-200
        hover:scale-110 active:scale-95
      `}>
        <GripVertical className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
      
      {/* Drop Zone Indicator */}
      {isDragOver && (
        <div className={`
          absolute inset-0 rounded-lg border-2 border-dashed pointer-events-none z-10
          ${isDarkMode ? 'border-blue-400 bg-blue-900/10' : 'border-blue-500 bg-blue-50/50'}
          animate-pulse
        `}>
          <div className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            px-4 py-2 rounded-lg font-medium text-sm
            ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
            shadow-lg
          `}>
            Drop column here
          </div>
        </div>
      )}
      
      <div className="group">
        <Column column={column} />
      </div>
    </div>
  );
};

const BoardDetail: React.FC = () => {
  const { 
    selectedBoard, 
    setCurrentView, 
    isDarkMode, 
    setIsDarkMode,
    setShowNewColumnModal,
    starBoard,
    reorderColumns // You'll need to add this method to your store
  } = useBoardStore();

  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Back to V1 Working Drag Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedColumnIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    
    // Create a custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumnIndex !== null && draggedColumnIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear dragOverIndex if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedColumnIndex !== null && draggedColumnIndex !== dropIndex) {
      // Call store method to reorder columns
      reorderColumns(selectedBoard.id, draggedColumnIndex, dropIndex);
    }
    
    setDraggedColumnIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedColumnIndex(null);
    setDragOverIndex(null);
  };

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
        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {selectedBoard.columns
            .sort((a, b) => a.order - b.order)
            .map((column, index) => (
            <DraggableColumn
              key={column.id}
              column={column}
              index={index}
              isDragOver={dragOverIndex === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDarkMode={isDarkMode}
            />
          ))}
          
          {/* Enhanced Add Column Button */}
          <div className="flex-shrink-0 w-80">
            <button 
              onClick={() => setShowNewColumnModal(true)}
              className={`
                w-full p-6 border-2 border-dashed rounded-lg transition-all duration-200
                flex flex-col items-center justify-center space-y-2 min-h-[200px] group
                ${isDarkMode 
                  ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 hover:bg-gray-50'
                }
                hover:scale-[1.02] hover:shadow-lg
              `}
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
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
      
      {/* Add the modal at the end */}
      <AddColumnModal />
    </div>
  );
};

export default BoardDetail;