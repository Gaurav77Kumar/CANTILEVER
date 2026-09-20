import { createContext, useContext, useEffect, useState } from 'react';
import api, { errorMessage } from '../api/axios.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  function logout() {
    localStorage.removeItem('taskflow-token');
    setUser(null);
  }
  async function restore() {
    setLoading(true);
    setSessionError('');
    try {
      if (localStorage.getItem('taskflow-token')) {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      }
    } catch (error) {
      if (error.response?.status !== 401) setSessionError(errorMessage(error));
    } finally { setLoading(false); }
  }
  useEffect(() => {
    restore();
    window.addEventListener('session-expired', logout);
    return () => window.removeEventListener('session-expired', logout);
  }, []);
  async function authenticate(mode, values) {
    const { data } = await api.post(`/auth/${mode}`, values);
    localStorage.setItem('taskflow-token', data.token);
    setUser(data.user);
    setSessionError('');
  }
  return <AuthContext.Provider value={{ user, loading, sessionError, restore, authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
