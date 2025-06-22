import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useBoards, useUI } from '../store/hooks';
import type { CreateBoardData } from '../types/types';

const NewBoardModal: React.FC = () => {
  const { createBoard } = useBoards();
  const { showNewBoardModal, setShowNewBoardModal, isDarkMode } = useUI();
  
  const [formData, setFormData] = useState<CreateBoardData>({
    title: '',
    description: '',
    priority: 'medium',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-500'
  });

  const colorOptions = [
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-emerald-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-pink-500',
    'bg-gradient-to-br from-gray-500 to-gray-700',
    'bg-gradient-to-br from-teal-500 to-blue-600'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      try {
        await createBoard(formData);
        resetForm();
        setShowNewBoardModal(false);
      } catch (error) {
        console.error('Failed to create board:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      color: colorOptions[0] 
    });
  };

  const handleClose = () => {
    setShowNewBoardModal(false);
    resetForm();
  };

  if (!showNewBoardModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Create New Board</h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Board Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter board title..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Board description..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateBoardData['priority'] })}
                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Color Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-full h-12 ${color} rounded-lg border-2 ${formData.color === color ? 'border-white shadow-lg scale-105' : 'border-transparent'} transition-all hover:scale-105`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Create Board
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBoardModal;