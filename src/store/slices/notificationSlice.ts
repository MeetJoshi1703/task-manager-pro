// ============================================================================
// NOTIFICATION SLICE
// ============================================================================

// src/store/slices/notificationSlice.ts
import type { NotificationState, NotificationActions, StoreSlice } from '../types/storeTypes';
import { notificationService } from '../../services/notificationService';
import { 
  getInitialNotificationState, 
  handleApiError,
  transformApiNotificationToNotification,
  logOperation,
  logError 
} from '../utils/storeUtils';

export const createNotificationSlice: StoreSlice<NotificationState & NotificationActions> = (set, get) => ({
  // ================================
  // INITIAL STATE
  // ================================
  ...getInitialNotificationState(),

  // ================================
  // NOTIFICATION OPERATIONS
  // ================================
  fetchNotifications: async () => {
    const state = get();
    if (state.loading) return; // Prevent multiple simultaneous calls
    
    set(() => ({ loading: true, error: null }));
    
    try {
      const apiNotifications = await notificationService.getNotifications();
      
      const notifications = apiNotifications.map(transformApiNotificationToNotification);
      
      set(() => ({ notifications, loading: false }));
      
      logOperation('fetchNotifications', { count: notifications.length });
    } catch (error: any) {
      logError('fetchNotifications', error);
      set(() => ({ 
        error: error.message || 'Failed to fetch notifications', 
        loading: false 
      }));
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
      }));
      
      logOperation('markNotificationAsRead', { notificationId });
    } catch (error: any) {
      logError('markNotificationAsRead', error);
      handleApiError(error, get().logout, set);
    }
  },

  markAllNotificationsAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
      
      logOperation('markAllNotificationsAsRead');
    } catch (error: any) {
      logError('markAllNotificationsAsRead', error);
      handleApiError(error, get().logout, set);
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
      }));
      
      logOperation('deleteNotification', { notificationId });
    } catch (error: any) {
      logError('deleteNotification', error);
      handleApiError(error, get().logout, set);
    }
  },

  getUnreadNotificationCount: () => {
    const { notifications } = get();
    const count = notifications.filter((n) => !n.read).length;
    logOperation('getUnreadNotificationCount', { count });
    return count;
  },

  clearError: () => {
    set(() => ({ error: null }));
    logOperation('clearError - Notification');
  },
});

