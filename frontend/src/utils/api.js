import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
// Uses environment variable in production, proxy in development
const api = axios.create({
  baseURL: import.meta.env.PROD ? `${API_BASE_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Utility to get user info from token
export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Simple JWT decode (without library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

// Ad API functions
export const adAPI = {
  // Get ads for public display
  getAds: (position, page) => api.get(`/ads?position=${position}&page=${page}`),

  // Admin functions
  getAllAds: () => api.get('/ads/admin'),
  createAd: (adData) => api.post('/ads', adData),
  updateAd: (id, adData) => api.put(`/ads/${id}`, adData),
  deleteAd: (id) => api.delete(`/ads/${id}`),
  toggleAd: (id) => api.patch(`/ads/${id}/toggle`),
  seedAds: () => api.post('/ads/seed'),

  // Tracking functions
  trackImpression: (id) => api.patch(`/ads/${id}/impression`),
  trackClick: (id) => api.patch(`/ads/${id}/click`)
};

export default api;

