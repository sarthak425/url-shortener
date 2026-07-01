import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (username, password) => api.post('/auth/login', { username, password });
export const register = (username, email, password) => api.post('/auth/register', { username, email, password });
export const shortenUrl = (originalUrl, customAlias) => api.post('/urls/shorten', { originalUrl, customAlias });
export const getUserUrls = () => api.get('/urls');
export const updateUrl = (id, originalUrl, customAlias) => api.put(`/urls/${id}`, { originalUrl, customAlias });
export const deleteUrl = (id) => api.delete(`/urls/${id}`);
export const getUrlAnalytics = (id) => api.get(`/urls/${id}/analytics`);

export default api;
