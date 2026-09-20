import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const { user, loading, sessionError, restore, logout } = useAuth();
  if (loading) return <div className="loading-screen" role="status"><span className="brand-mark">✓</span> Opening your workspace…</div>;
  if (sessionError) return <main className="loading-screen"><p role="alert">{sessionError}</p><button className="button primary" onClick={restore}>Try again</button><button className="button" onClick={() => { logout(); restore(); }}>Back to sign in</button></main>;
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage key="login" />} />
    <Route path="/register" element={user ? <Navigate to="/" replace /> : <AuthPage key="register" register />} />
    <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
