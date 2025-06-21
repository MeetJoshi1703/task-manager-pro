import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';
import { useBoardStore } from './store/boardStore';
import BoardView from './pages/BoardView';
import BoardDetail from './pages/BoardDetail';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import TeamMembers from './pages/TeamMembers'; // Add this import
import MyTasks from './pages/MyTasks'; // Add this import
import Sidebar from './components/Sidebar';
import type { CreateBoardData, CreateTaskData, CreateColumnData } from './types/types';

const App: React.FC = () => {
  const { 
    currentView,
    isDarkMode,
    showNewBoardModal,
    setShowNewBoardModal,
    showNewTaskModal,
    setShowNewTaskModal,
    showNewColumnModal,
    setShowNewColumnModal,
    selectedColumn,
    selectedBoard,
    createBoard,
    createTask,
    createColumn,
    users
  } = useBoardStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // New Board Modal
  const NewBoardModal = () => {
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

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim()) {
        createBoard(formData);
        setFormData({ 
          title: '', 
          description: '', 
          priority: 'medium', 
          color: colorOptions[0] 
        });
      }
    };

    const handleClose = () => {
      setShowNewBoardModal(false);
      setFormData({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        color: colorOptions[0] 
      });
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

  // New Task Modal
  const NewTaskModal = () => {
    const [formData, setFormData] = useState<CreateTaskData>({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: [],
      tags: []
    });
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim() && selectedColumn) {
        createTask(selectedColumn, formData);
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          assignedTo: [],
          tags: []
        });
        setTagInput('');
      }
    };

    const handleClose = () => {
      setShowNewTaskModal(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: [],
        tags: []
      });
      setTagInput('');
    };

    const addTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault();
        if (!formData.tags.includes(tagInput.trim())) {
          setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
        }
        setTagInput('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    if (!showNewTaskModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Task</h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter task title..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTaskData['priority'] })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Assign To</label>
                <select
                  multiple
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: Array.from(e.target.selectedOptions, option => option.value) })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500`}
                  size={3}
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.avatar} {user.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Add tags... (Press Enter to add)"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} flex items-center space-x-1`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // New Column Modal
  const NewColumnModal = () => {
    const [formData, setFormData] = useState<CreateColumnData>({
      title: '',
      color: 'bg-gray-100'
    });

    const columnColors = [
      { color: 'bg-gray-100', name: 'Gray' },
      { color: 'bg-blue-100', name: 'Blue' },
      { color: 'bg-green-100', name: 'Green' },
      { color: 'bg-yellow-100', name: 'Yellow' },
      { color: 'bg-purple-100', name: 'Purple' },
      { color: 'bg-red-100', name: 'Red' },
      { color: 'bg-indigo-100', name: 'Indigo' },
      { color: 'bg-pink-100', name: 'Pink' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.title.trim() && selectedBoard) {
        createColumn(selectedBoard.id, formData);
        setFormData({ title: '', color: 'bg-gray-100' });
      }
    };

    const handleClose = () => {
      setShowNewColumnModal(false);
      setFormData({ title: '', color: 'bg-gray-100' });
    };

    if (!showNewColumnModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Create New Column</h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Column Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="e.g. To Do, In Progress, Done..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {columnColors.map((colorOption, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: colorOption.color })}
                      className={`w-full h-12 ${colorOption.color} rounded-lg border-2 ${formData.color === colorOption.color ? 'border-gray-400 shadow-lg scale-105' : 'border-transparent'} transition-all hover:scale-105 flex items-center justify-center`}
                      title={colorOption.name}
                    >
                      <span className="text-xs font-medium text-gray-700">{colorOption.name}</span>
                    </button>
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
                  Create Column
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`font-sans flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Pages */}
        <div className="flex-1 overflow-auto">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'boards' && <BoardView />}
          {currentView === 'board-detail' && <BoardDetail />}
          {currentView === 'calendar' && <Calendar />}
          {currentView === 'team' && <TeamMembers />}
          {currentView === 'tasks' && <MyTasks />}
        </div>
      </div>
      
      {/* Modals */}
      <NewBoardModal />
      <NewTaskModal />
      <NewColumnModal />
    </div>
  );
};

export default App;