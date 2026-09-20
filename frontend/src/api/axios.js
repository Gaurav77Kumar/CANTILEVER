import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !['/auth/login', '/auth/register'].includes(error.config?.url)) {
    window.dispatchEvent(new Event('session-expired'));
  }
  return Promise.reject(error);
});
export const errorMessage = (error) => error.response?.data?.message || 'Unable to connect. Check that the server is running and try again.';
export default api;
