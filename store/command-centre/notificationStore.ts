import { create } from 'zustand';
import { OperationalEvent } from '@/types/operational-models';

interface NotificationState {
  notifications: OperationalEvent[];
  addNotification: (notification: OperationalEvent) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications] 
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
