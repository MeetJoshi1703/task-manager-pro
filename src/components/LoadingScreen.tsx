import React from 'react';
import { Kanban } from 'lucide-react';
import { useUI } from '../store/hooks';

const LoadingScreen: React.FC = () => {
  const { isDarkMode } = useUI();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Kanban className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          TaskFlow
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;