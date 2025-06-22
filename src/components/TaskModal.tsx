import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, User, Tag } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import type { CreateTaskData } from '../types/types';

const TaskModal: React.FC = () => {
  const {
    showNewTaskModal,
    setShowNewTaskModal,
    selectedColumn,
    selectedBoard,
    createTask,
    boardMembers,
    isDarkMode,
    loading
  } = useBoardStore();

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    column_id: selectedColumn,
    board_id: selectedBoard?.id || '',
    assignee_ids: [],
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when selectedColumn or selectedBoard changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      column_id: selectedColumn,
      board_id: selectedBoard?.id || ''
    }));
  }, [selectedColumn, selectedBoard]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.column_id) {
      newErrors.column_id = 'Column is required';
    }

    if (!formData.board_id) {
      newErrors.board_id = 'Board is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createTask(formData.column_id, formData);
      handleClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      // Error will be handled by the store and displayed in UI
    }
  };

  const handleClose = () => {
    setShowNewTaskModal(false);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      column_id: selectedColumn,
      board_id: selectedBoard?.id || '',
      assignee_ids: [],
      tags: []
    });
    setTagInput('');
    setErrors({});
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (!formData.tags?.includes(trimmedTag)) {
        setFormData({ 
          ...formData, 
          tags: [...(formData.tags || []), trimmedTag] 
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const toggleAssignee = (userId: string) => {
    const currentAssignees = formData.assignee_ids || [];
    const isAssigned = currentAssignees.includes(userId);
    
    if (isAssigned) {
      setFormData({
        ...formData,
        assignee_ids: currentAssignees.filter(id => id !== userId)
      });
    } else {
      setFormData({
        ...formData,
        assignee_ids: [...currentAssignees, userId]
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  if (!showNewTaskModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Create New Task
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors disabled:opacity-50`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.title 
                    ? 'border-red-500' 
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter task title..."
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Task description..."
                rows={3}
                disabled={loading}
              />
            </div>
            
            {/* Priority and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTaskData['priority'] })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formatDate(formData.due_date || '')}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    disabled={loading}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Assignees */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Assign to
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {boardMembers.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignee_ids?.includes(member.user_id) || false}
                      onChange={() => toggleAssignee(member.user_id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center text-xs font-medium`}>
                      {member.profiles.full_name?.charAt(0) || member.profiles.email.charAt(0)}
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {member.profiles.full_name || member.profiles.email}
                    </span>
                  </label>
                ))}
                {boardMembers.length === 0 && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-2`}>
                    No team members found
                  </p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Add tags (press Enter)..."
                  disabled={loading}
                />
                <Tag className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      } gap-1`}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className={`${isDarkMode ? 'text-blue-400 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                        disabled={loading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                } transition-colors disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;