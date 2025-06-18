import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Tag, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  X,
  Save
} from 'lucide-react';
import type { Task } from '../types/types';
import { useBoardStore } from '../store/boardStore';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { isDarkMode, updateTask, deleteTask, users } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo,
    tags: task.tags
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Zap className="w-3 h-3" />;
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleSave = () => {
    updateTask(task.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      tags: task.tags
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  if (isEditing) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 border`}>
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Task title..."
          />
          
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className={`w-full px-3 py-2 text-sm rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Task description..."
            rows={2}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editForm.priority}
              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Task['priority'] })}
              className={`px-2 py-1 text-sm rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              className={`px-2 py-1 text-sm rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className={`px-3 py-1 text-sm rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
            >
              <X className="w-3 h-3" />
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              <Save className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md group`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm leading-tight flex-1 pr-2">{task.title}</h4>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'} transition-colors`}
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)} flex items-center space-x-1`}>
          {getPriorityIcon(task.priority)}
          <span className="capitalize">{task.priority}</span>
        </span>
        
        {/* Due date indicator */}
        {task.dueDate && (
          <div className={`text-xs flex items-center space-x-1 ${
            isOverdue ? 'text-red-500' : 
            isDueSoon ? 'text-yellow-500' : 
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      {/* Description */}
      {task.description && (
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
          {task.description}
        </p>
      )}
      
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded flex items-center space-x-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <Tag className="w-2 h-2" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assigned users */}
        <div className="flex items-center space-x-2">
          {task.assignedTo.length > 0 && (
            <div className="flex -space-x-1">
              {task.assignedTo.slice(0, 2).map((assignee, index) => {
                const user = users.find(u => u.name === assignee);
                return (
                  <div
                    key={index}
                    className={`w-6 h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}
                    title={assignee}
                  >
                    {user?.avatar || assignee.charAt(0)}
                  </div>
                );
              })}
              {task.assignedTo.length > 2 && (
                <div className={`w-6 h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                  +{task.assignedTo.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Created by */}
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center space-x-1`}>
          <User className="w-3 h-3" />
          <span>By {task.createdBy}</span>
        </div>
      </div>
      
      {/* Overdue indicator */}
      {isOverdue && (
        <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Overdue</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;