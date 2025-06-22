// src/store/hooks/useNotification.ts
import { useMemo } from 'react';
import { useBoardStore } from '../index';

export const useNotifications = () => {
  // Individual selectors
  const notifications = useBoardStore(state => state.notifications);
  const loading = useBoardStore(state => state.loading);
  const error = useBoardStore(state => state.error);
  
  // Actions - Get them directly (they're stable in Zustand)
  const fetchNotifications = useBoardStore(state => state.fetchNotifications);
  const markNotificationAsRead = useBoardStore(state => state.markNotificationAsRead);
  const markAllNotificationsAsRead = useBoardStore(state => state.markAllNotificationsAsRead);
  const deleteNotification = useBoardStore(state => state.deleteNotification);
  const clearError = useBoardStore(state => state.clearError);
  const hasFetched = useBoardStore(state => state.hasFetched);


  // Computed values
  const computed = useMemo(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return {
      unreadCount,
      unreadNotifications: notifications.filter(n => !n.read),
      readNotifications: notifications.filter(n => n.read),
      recentNotifications: notifications.slice(0, 5),
      errorNotifications: notifications.filter(n => n.type === 'error'),
      successNotifications: notifications.filter(n => n.type === 'success'),
    };
  }, [notifications]);

  return {
    // State
    notifications,
    loading,
    error,
    hasFetched,
    // Actions
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearError,
    
    // Computed
    ...computed,
  };
};