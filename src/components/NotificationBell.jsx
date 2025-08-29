import React from 'react';

const NotificationBell = ({ count, onClick }) => (
  <button
    className="relative p-2 rounded-full bg-white shadow hover:bg-gray-100 focus:outline-none"
    style={{ minWidth: 44, minHeight: 44 }}
    onClick={onClick}
    aria-label="Notifications"
  >
    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {count > 0 && (
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full" style={{ minWidth: 20, minHeight: 20 }}>
        {count}
      </span>
    )}
  </button>
);

export default NotificationBell;
