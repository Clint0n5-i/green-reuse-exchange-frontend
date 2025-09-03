// Notification API service
import axios from 'axios';

export const fetchNotifications = async () => {
  const res = await axios.get('/api/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  await axios.post(`/api/notifications/${id}/read`);
};
