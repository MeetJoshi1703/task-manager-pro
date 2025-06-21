import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Target,
  Calendar,
  Trash2,
  Settings,
  MarkAsUnread,
  Filter,
  Search
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';
import TopBar from '../components/TopBar';

const Notifications: React.FC = () => {
  const { isDarkMode } = useBoardStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      type: 'task_assigned',
      title: 'New task assigned',
      message: 'You have been assigned to "Design Landing Page" in Product Launch Q2',
      timestamp: '2 minutes ago',
      read: false,
      icon: Target,
      color: 'text-blue-500',
      actionUser: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'deadline_approaching',
      title: 'Deadline approaching',
      message: 'Task "Backend API Development" is due tomorrow',
      timestamp: '1 hour ago',
      read: false,
      icon: Clock,
      color: 'text-orange-500'
    },
    {
      id: '3',
      type: 'task_completed',
      title: 'Task completed',
      message: 'Mike Chen completed "Database Schema Design"',
      timestamp: '3 hours ago',
      read: true,
      icon: CheckCircle2,
      color: 'text-green-500',
      actionUser: 'Mike Chen'
    },
    {
      id: '4',
      type: 'comment_added',
      title: 'New comment',
      message: 'Emma Davis commented on "UI Mockups Review"',
      timestamp: '5 hours ago',
      read: true,
      icon: User,
      color: 'text-purple-500',
      actionUser: 'Emma Davis'
    },
    {
      id: '5',
      type: 'board_invite',
      title: 'Board invitation',
      message: 'You have been invited to join "Website Redesign" board',
      timestamp: '1 day ago',
      read: false,
      icon: User,
      color: 'text-indigo-500',
      actionUser: 'John Smith'
    },
    {
      id: '6',
      type: 'overdue',
      title: 'Task overdue',
      message: 'Task "User Testing" is now overdue',
      timestamp: '2 days ago',
      read: true,
      icon: AlertCircle,
      color: 'text-red-500'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read) ||
                         notification.type === filter;
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationItem = ({ notification }: { notification: any }) => {
    const Icon = notification.icon;
    
    return (
      <div className={`
        ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
        border rounded-lg p-4 transition-all duration-200 cursor-pointer
        ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}
      `}>
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${notification.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {notification.timestamp}
                  </span>
                  {notification.actionUser && (
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {notification.actionUser}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <button className={`opacity-0 group-hover:opacity-100 p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-all`}>
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TopBar 
        title="Notifications" 
        subtitle={`You have ${unreadCount} unread notifications`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total</p>
                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unread</p>
                <p className={`text-2xl font-bold mt-1 text-blue-600`}>{unreadCount}</p>
              </div>
              <MarkAsUnread className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today</p>
                <p className={`text-2xl font-bold mt-1 text-green-600`}>
                  {notifications.filter(n => n.timestamp.includes('hour') || n.timestamp.includes('minute')).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-blue-500 w-80`}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="task_assigned">Task Assignments</option>
              <option value="deadline_approaching">Deadlines</option>
              <option value="task_completed">Completions</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <button className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              Mark All Read
            </button>
            <button className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} transition-colors`}>
              Clear All
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4 group">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {searchTerm || filter !== 'all' ? 'No notifications match your criteria' : 'No notifications yet'}
              </h3>
              <p className="mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Notifications about your tasks and boards will appear here'
                }
              </p>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;