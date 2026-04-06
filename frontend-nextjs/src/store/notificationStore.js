import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  // Actions
  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [
        { id: Date.now().toString(), read: false, createdAt: new Date().toISOString(), ...notification },
        ...state.notifications,
      ];
      return {
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifs = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unread = notifs.filter((n) => !n.read).length;
      return { notifications: notifs, unreadCount: unread };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const filtered = state.notifications.filter((n) => n.id !== id);
      const unread = filtered.filter((n) => !n.read).length;
      return { notifications: filtered, unreadCount: unread };
    }),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));
