// Notification API service
import { api } from './api';

export const fetchNotifications = async () => {
  const res = await api.get('/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  await api.post(`/notifications/${id}/read`);
};
