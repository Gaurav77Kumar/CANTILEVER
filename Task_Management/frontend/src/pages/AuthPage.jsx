import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCheck, Layers3, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../api/axios.js';

export default function AuthPage({ register = false }) {
  const { authenticate } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const change = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError(''); setBusy(true);
    try { await authenticate(register ? 'register' : 'login', values); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  return <main className="auth-layout">
    <section className="auth-story">
      <div className="brand"><span className="brand-mark"><CheckCheck size={23} /></span>taskflow<span className="brand-dot">.</span></div>
      <div className="story-content">
        <span className="eyebrow"><Sparkles size={15} /> LESS CHAOS. MORE CLARITY.</span>
        <h1>Big ideas.<br />Small steps.<br /><span>Real progress.</span></h1>
        <p>A little structure goes a long way. Bring your tasks together and make room for what matters.</p>
        <div className="preview-card" aria-hidden="true">
          <div className="preview-header"><span><Layers3 size={18} /> A little more focused</span><span className="tiny-label">YOUR DAY</span></div>
          <div className="preview-task"><span className="preview-check"><Check size={14} /></span><s>Make a plan for the week</s><span className="badge low">Done</span></div>
          <div className="preview-task"><span className="preview-check"><Check size={14} /></span><s>Clear a little headspace</s><span className="badge low">Done</span></div>
          <div className="preview-task"><span className="empty-check" />Take the next small step<span className="badge medium">Up next</span></div>
          <div className="preview-progress"><span /></div><small>Every small step counts.</small>
        </div>
      </div>
      <div className="story-footer">A calmer way to get things done.<span>One task at a time.</span></div>
    </section>
    <section className="auth-panel">
      <div className="auth-top">{register ? 'Already have an account?' : 'New here?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'} <ArrowRight size={14} /></Link></div>
      <div className="auth-form-wrap">
        <span className="section-kicker">YOUR PERSONAL WORKSPACE</span>
        <h2>{register ? 'Make space for progress.' : 'Welcome back.'}</h2>
        <p className="muted">{register ? 'A fresh start for your tasks. Let’s get you set up.' : 'Pick up where you left off. You’ve got this.'}</p>
        <form onSubmit={submit} className="auth-form">
          {register && <label>Full name<input name="name" autoComplete="name" placeholder="Your name" value={values.name} onChange={change} required maxLength={80} /></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={change} required maxLength={254} /></label>
          <label>Password<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} placeholder={register ? 'Create a strong password' : 'Enter your password'} value={values.password} onChange={change} required minLength={8} maxLength={72} /></label>
          {register && <small className="muted">Use at least 8 characters, up to 72 bytes.</small>}
          {error && <p className="error-message" role="alert">{error}</p>}
          <button className="button primary auth-submit" disabled={busy}>{busy ? 'Just a moment…' : register ? 'Create account' : 'Sign in'}<ArrowRight size={18} /></button>
        </form>
        <p className="auth-note"><Check size={15} /> Your tasks. Your space. Your pace.</p>
      </div>
      <footer className="auth-footer">TASKFLOW <span>Designed for a more intentional day.</span></footer>
    </section>
  </main>;
}
