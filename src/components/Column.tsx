import React, { useState, useRef } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  X, 
  Save,
  GripVertical
} from 'lucide-react';
import type { Column as ColumnType } from '../types/types';
import { useBoardStore } from '../store/boardStore';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const { 
    isDarkMode, 
    setSelectedColumn, 
    setShowNewTaskModal, 
    updateColumn, 
    deleteColumn,
    moveTask
  } = useBoardStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTaskDragOver, setIsTaskDragOver] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddTask = () => {
    setSelectedColumn(column.id);
    setShowNewTaskModal(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      updateColumn(column.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Are you sure you want to delete the "${column.title}" column? All tasks in this column will be deleted.`)) {
      deleteColumn(column.id);
    }
    setShowDropdown(false);
  };

  // Enhanced Task Drag & Drop
  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent column drag events
    
    // Only accept task drags, not column drags
    const dragData = e.dataTransfer.getData('text/plain');
    if (!dragData.startsWith('column-')) {
      e.dataTransfer.dropEffect = 'move';
      setIsTaskDragOver(true);
    }
  };

  const handleTaskDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX: x, clientY: y } = e;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsTaskDragOver(false);
    }
  };

  const handleTaskDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent column drag events
    
    setIsTaskDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && !taskId.startsWith('column-')) {
      // Move task to this column at the end
      moveTask(taskId, column.id, column.tasks.length);
      
      // Success feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-shrink-0 w-80">
      {/* Enhanced Column Header */}
      <div className={`
        column-header ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        rounded-lg p-4 mb-4 border group transition-all duration-200
        hover:shadow-md ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}
      `}>
        <div className="flex items-center justify-between mb-2">
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className={`
                  flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                  } 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                `}
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{column.title}</h3>
              </div>
              
              <div className="flex items-center space-x-2 column-actions">
                <span className={`
                  px-2 py-1 rounded-full text-sm font-medium transition-all duration-200
                  ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}
                  ${column.tasks.length > 0 ? 'animate-pulse' : ''}
                `}>
                  {column.tasks.length}
                </span>
                
                {/* Enhanced Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`
                      p-2 rounded-lg transition-all duration-200 hover:scale-105
                      ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                      ${showDropdown ? 'bg-gray-200 dark:bg-gray-700' : ''}
                    `}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {showDropdown && (
                    <div className={`
                      absolute right-0 top-full mt-2 min-w-[140px] rounded-lg shadow-xl border z-20
                      ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                      animate-in fade-in slide-in-from-top-2 duration-200
                    `}>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowDropdown(false);
                        }}
                        className={`
                          flex items-center space-x-3 px-4 py-3 text-sm w-full text-left transition-colors
                          ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
                          rounded-t-lg
                        `}
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Column</span>
                      </button>
                      <hr className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />
                      <button
                        onClick={handleDeleteColumn}
                        className="flex items-center space-x-3 px-4 py-3 text-sm w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Column</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleAddTask}
                  className={`
                    p-2 rounded-lg transition-all duration-200 hover:scale-105
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                  `}
                  title="Add new task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Tasks Container */}
      <div 
        className={`
          space-y-3 min-h-[200px] rounded-lg p-3 transition-all duration-300
          ${isTaskDragOver 
            ? isDarkMode 
              ? 'bg-gray-700/50 border-2 border-dashed border-blue-400 shadow-lg' 
              : 'bg-blue-50 border-2 border-dashed border-blue-400 shadow-lg'
            : 'border-2 border-transparent'
          }
        `}
        onDragOver={handleTaskDragOver}
        onDragLeave={handleTaskDragLeave}
        onDrop={handleTaskDrop}
      >
        {column.tasks.map((task, index) => (
          <div
            key={task.id}
            className="transition-all duration-200 hover:scale-[1.02]"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <TaskCard task={task} />
          </div>
        ))}
        
        {/* Enhanced Add Task Button */}
        <button
          onClick={handleAddTask}
          className={`
            w-full p-4 border-2 border-dashed rounded-lg transition-all duration-200
            flex items-center justify-center space-x-2 group
            ${isDarkMode 
              ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-800/50' 
              : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 hover:bg-gray-50'
            }
            hover:scale-[1.02] hover:shadow-md
          `}
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Add Task</span>
        </button>
        
        {/* Enhanced Empty state */}
        {column.tasks.length === 0 && !isTaskDragOver && (
          <div className={`
            text-center py-8 transition-all duration-300
            ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
          `}>
            <div className="text-4xl mb-3 animate-bounce">📝</div>
            <p className="text-sm font-medium mb-1">No tasks yet</p>
            <p className="text-xs opacity-75">Drag tasks here or click the + button</p>
          </div>
        )}
        
        {/* Enhanced Drag over indicator */}
        {isTaskDragOver && (
          <div className={`
            text-center py-6 transition-all duration-300
            ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}
          `}>
            <div className="text-3xl mb-2 animate-pulse">📋</div>
            <p className="text-sm font-semibold">Drop task here</p>
            <div className={`
              mt-2 h-1 w-16 mx-auto rounded-full
              ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
              animate-pulse
            `} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;