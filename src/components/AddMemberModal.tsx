import React, { useState } from 'react';
import { X, UserPlus, Mail, Shield } from 'lucide-react';
import { useBoardStore } from '../store';
import type { AddMemberData } from '../types/types';

const AddMemberModal: React.FC = () => {
  const { 
    showAddMemberModal, 
    setShowAddMemberModal, 
    addMember, 
    selectedBoard, 
    isDarkMode,
    loading,
    error 
  } = useBoardStore();
  const membersLoading = loading ;
  const [formData, setFormData] = useState<AddMemberData>({
    email: '',
    role: 'member'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoard || !formData.email.trim()) return;

    try {
      await addMember(selectedBoard.id, formData);
      setFormData({ email: '', role: 'member' });
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleClose = () => {
    setShowAddMemberModal(false);
    setFormData({ email: '', role: 'member' });
  };

  if (!showAddMemberModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Add Team Member</h2>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              disabled={membersLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter member's email address..."
                required
                disabled={membersLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' | 'viewer' })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500`}
                disabled={membersLoading}
              >
                <option value="viewer">Viewer - Can view boards and tasks</option>
                <option value="member">Member - Can create and edit tasks</option>
                <option value="admin">Admin - Can manage board settings</option>
              </select>
            </div>

            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="text-sm font-medium mb-2">Role Permissions:</h4>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                <li>• <strong>Viewer:</strong> Read-only access to boards and tasks</li>
                <li>• <strong>Member:</strong> Can create, edit, and comment on tasks</li>
                <li>• <strong>Admin:</strong> Can manage board settings and members</li>
              </ul>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'border-gray-600 hover:bg-gray-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                } transition-colors`}
                disabled={membersLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={membersLoading || !formData.email.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {membersLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Add Member</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;