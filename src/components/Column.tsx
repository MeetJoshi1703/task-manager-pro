import React, { useState } from 'react';
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      // Move task to this column at the end
      moveTask(taskId, column.id, column.tasks.length);
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      {/* Column Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 mb-4 border group`}>
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
                className={`flex-1 px-2 py-1 text-sm rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className={`p-1 ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'} rounded transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 flex-1">
                <GripVertical className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} cursor-grab`} />
                <h3 className="font-semibold text-lg">{column.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} px-2 py-1 rounded-full text-sm`}>
                  {column.tasks.length}
                </span>
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown menu - simplified for now */}
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 hidden group-hover:block">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDeleteColumn}
                      className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddTask}
                  className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tasks Container */}
      <div 
        className={`space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
          isDragOver 
            ? isDarkMode 
              ? 'bg-gray-700/50 border-2 border-dashed border-blue-400' 
              : 'bg-blue-50 border-2 border-dashed border-blue-300'
            : 'border-2 border-transparent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {/* Add Task Button */}
        <button
          onClick={handleAddTask}
          className={`w-full p-4 border-2 border-dashed ${
            isDarkMode 
              ? 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
              : 'border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 hover:bg-gray-50'
          } rounded-lg transition-all flex items-center justify-center space-x-2 group`}
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Add Task</span>
        </button>
        
        {/* Empty state */}
        {column.tasks.length === 0 && !isDragOver && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Drag tasks here or click the + button</p>
          </div>
        )}
        
        {/* Drag over indicator */}
        {isDragOver && (
          <div className={`text-center py-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <div className="text-2xl mb-1">📋</div>
            <p className="text-sm font-medium">Drop task here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;