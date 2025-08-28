import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const isAdminEndpoint = config.url.startsWith('/admin');
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');
        const isAuthEndpoint = config.url.startsWith('/auth');

        if (isAdminEndpoint && adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        } else if (token && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const itemService = {
    getAllItems: () => api.get('/items'),
    getAvailableItems: () => api.get('/items/available'),
    getItemsByCategory: (category) => api.get(`/items/category/${category}`),
    getItemsByLocation: (location) => api.get(`/items/location/${location}`),
    searchItems: (searchTerm, location) => {
        const params = { searchTerm };
        if (location) params.location = location;
        return api.get('/items/search', { params });
    },
    getItemById: (id) => api.get(`/items/${id}`),
    createItem: (itemData) => api.post('/items', itemData),
    createItemWithUpload: (formData) => api.post('/items/upload', formData),
    updateItem: async (id, itemData) => {
        try {
            return await api.put(`/items/${id}`, itemData);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to update item';
            if (typeof window !== 'undefined' && window.toast) window.toast.error(`Update failed: ${msg}`);
            throw error;
        }
    },
    claimItem: async (id) => {
        try {
            return await api.put(`/items/${id}/claim`);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to claim item';
            if (typeof window !== 'undefined' && window.toast) window.toast.error(`Claim failed: ${msg}`);
            throw error;
        }
    },
    unclaimItem: async (id) => {
        try {
            return await api.put(`/items/${id}/unclaim`);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to unclaim item';
            if (typeof window !== 'undefined' && window.toast) window.toast.error(`Unclaim failed: ${msg}`);
            throw error;
        }
    },
    deleteItem: async (id) => {
        try {
            return await api.delete(`/items/${id}`);
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to delete item';
            if (typeof window !== 'undefined' && window.toast) window.toast.error(`Delete failed: ${msg}`);
            throw error;
        }
    },
};

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
};

export const adminService = {
    getAllItems: () => api.get('/admin/items'),
    deleteItem: (id) => api.delete(`/admin/items/${id}`, { headers: { 'Content-Type': 'application/json' }, data: {} }),
    // User management (requires backend support)
    getUsers: () => api.get('/admin/users'),
    suspendUser: (id, reason) => api.put(`/admin/users/${id}/suspend`, reason, { headers: { 'Content-Type': 'text/plain' } }),
    unsuspendUser: (id) => api.put(`/admin/users/${id}/unsuspend`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
