import React from 'react';

const NotificationList = ({ notifications, onMarkRead }) => (
  <div className="fixed top-16 right-2 w-80 max-w-full bg-white rounded-lg shadow-lg z-50 p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
    <h3 className="text-lg font-semibold mb-3">Notifications</h3>
    {notifications.length === 0 ? (
      <div className="text-gray-500 text-center py-8">No notifications</div>
    ) : (
      <ul className="space-y-3">
        {notifications.map(n => (
          <li key={n.id} className={`p-3 rounded-lg flex flex-col ${n.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
            <span className="text-sm text-gray-800">{n.message}</span>
            <span className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</span>
            {!n.isRead && (
              <button
                className="mt-2 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onMarkRead(n.id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NotificationList;
