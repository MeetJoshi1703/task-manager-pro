import React from 'react';
import { 
  LayoutDashboard,
  Kanban,
  Users,
  Calendar,
  Settings,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useBoards, useTasks, useMembers, useNotifications, useUI } from '../store/hooks';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  // Use new hooks instead of useBoardStore
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { boards } = useBoards();
  const { allTasks } = useTasks();
  const { memberCount } = useMembers();
  const { unreadCount } = useNotifications();
  const { isDarkMode, setShowNewBoardModal } = useUI();
  

  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active section based on current route
  const activeSection = location.pathname.startsWith('/boards') ? 'boards' : 
    location.pathname === '/dashboard' ? 'dashboard' :
    location.pathname === '/calendar' ? 'calendar' :
    location.pathname === '/team' ? 'team' :
    location.pathname === '/tasks' ? 'tasks' : 
    location.pathname === '/notifications' ? 'notifications' :
    location.pathname === '/settings' ? 'settings' : '';

  // Calculate real counts
  const totalBoards = boards.length;
  
  // Calculate user's tasks count
  const userTasksCount = React.useMemo(() => {
    if (!currentUser?.id) return 0;
    
    return allTasks.filter(task => 
      task.assignedTo?.includes(currentUser.id) || 
      task.created_by === currentUser.id ||
      task.createdBy === currentUser.id
    ).length;
  }, [allTasks, currentUser?.id]);

  const navigationItems = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, comingSoon: false, path: '/dashboard' },
        { id: 'boards', label: 'Boards', icon: Kanban, badge: totalBoards > 0 ? totalBoards.toString() : null, comingSoon: false, path: '/boards' },
        { id: 'calendar', label: 'Calendar', icon: Calendar, badge: null, comingSoon: false, path: '/calendar' },
      ]
    },
    {
      section: 'workspace',
      title: 'Workspace',
      items: [
        { id: 'team', label: 'Team Members', icon: Users, badge: memberCount > 0 ? memberCount.toString() : null, comingSoon: false, path: '/team' },
        { id: 'tasks', label: 'My Tasks', icon: Target, badge: userTasksCount > 0 ? userTasksCount.toString() : null, comingSoon: false, path: '/tasks' },
      ]
    },
    {
      section: 'communication',
      title: 'Communication',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount.toString() : null, comingSoon: false, path: '/notifications' },
      ]
    }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleNavClick = (path: string, comingSoon: boolean) => {
    if (comingSoon) return;
    navigate(path);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't render sidebar if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200'} 
      border-r transition-all duration-300 ease-in-out flex flex-col h-screen
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Kanban className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">TaskFlow</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Project Management
                </p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
              <Kanban className="w-5 h-5 text-white" />
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
                ${isCollapsed ? 'mx-auto mt-2' : ''}
              `}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setShowNewBoardModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Board</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((section) => (
          <div key={section.section} className={`mb-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed && (
              <h3 className={`
                text-xs font-semibold uppercase tracking-wider mb-3
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {section.title}
              </h3>
            )}
            
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path, item.comingSoon)}
                    disabled={item.comingSoon}
                    className={`
                      w-full flex items-center rounded-lg transition-all duration-200
                      ${isCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5 justify-start'}
                      ${isActive 
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                        : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                      ${item.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                      group relative
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                    
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className={`
                              px-2 py-1 text-xs rounded-full font-medium
                              ${isActive 
                                ? 'bg-white text-blue-600' 
                                : isDarkMode 
                                  ? 'bg-gray-700 text-gray-300' 
                                  : 'bg-gray-200 text-gray-600'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                          
                          {item.comingSoon && (
                            <span className={`
                              px-2 py-1 text-xs rounded-full font-medium
                              ${isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'}
                            `}>
                              Soon
                            </span>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className={`
                        absolute left-full ml-2 px-2 py-1 rounded-lg text-sm font-medium
                        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none whitespace-nowrap z-50
                      `}>
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 text-blue-400">({item.badge})</span>
                        )}
                        {item.comingSoon && (
                          <span className="ml-2 text-yellow-400">(Soon)</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile & Bottom Actions */}
      <div className={`border-t border-gray-200 dark:border-gray-800 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {/* Bottom Navigation Items */}
        <div className="space-y-1 mb-4">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path, false)}
                className={`
                  w-full flex items-center rounded-lg transition-colors duration-200
                  ${isCollapsed ? 'p-3 justify-center' : 'px-3 py-2 justify-start'}
                  ${isActive 
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                  group relative
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                
                {isCollapsed && (
                  <div className={`
                    absolute left-full ml-2 px-2 py-1 rounded-lg text-sm font-medium
                    ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none whitespace-nowrap z-50
                  `}>
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile */}
        <div className={`
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'} 
          rounded-lg p-3 flex items-center space-x-3
          ${isCollapsed ? 'justify-center' : ''}
        `}>
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {getUserInitials(currentUser?.name)}
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
          )}
          
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className={`
                p-1 rounded transition-colors
                ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              `}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          
          {/* Logout button for collapsed state */}
          {isCollapsed && (
            <div className="group relative">
              <button 
                onClick={handleLogout}
                className={`
                  p-1 rounded transition-colors
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
                `}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              
              <div className={`
                absolute left-full ml-2 px-2 py-1 rounded-lg text-sm font-medium
                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                pointer-events-none whitespace-nowrap z-50 bottom-0
              `}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
