import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// New hooks instead of useBoardStore
import { useAuth, useUI } from './store/hooks';

// Components
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import AddMemberModal from './components/AddMemberModal';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';

// Modals
import NewBoardModal from './components/NewBoardModal';
import NewColumnModal from './components/NewColumnModal';

// Pages
import BoardView from './pages/BoardView';
import BoardDetail from './pages/BoardDetail';
import Dashboard from './pages/DashBoard';
import Calendar from './pages/Calendar';
import TeamMembers from './pages/TeamMembers';
import MyTasks from './pages/MyTasks';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// Main App Content (authenticated)
const AuthenticatedApp: React.FC = () => {
  const { isDarkMode } = useUI();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`font-sans flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/boards" element={<BoardView />} />
            <Route path="/boards/:boardId" element={<BoardDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      {/* Authenticated-only Modals */}
      <NewBoardModal />
      <NewColumnModal />
      <AddMemberModal />
    </div>
  );
};

// Auth state wrapper
const AuthWrapper: React.FC = () => {
  const { isAuthenticated, checkAuthStatus, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Failed to check auth status:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    // Only run once on mount
    if (!isInitialized) {
      initializeAuth();
    }
  }, [checkAuthStatus, isInitialized]);

  // Show loading screen while checking authentication
  if (!isInitialized || loading) {
    return <LoadingScreen />;
  }

  // Show different content based on auth status
  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* AuthModal for unauthenticated users */}
        <AuthModal />
      </>
    );
  }

  // Authenticated app
  return <AuthenticatedApp />;
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthWrapper />
    </Router>
  );
};

export default App;