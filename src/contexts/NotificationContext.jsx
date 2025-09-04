import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchNotifications();
  setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    await markNotificationRead(id);
  setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsRead, reload: loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
