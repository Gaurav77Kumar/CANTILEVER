import { useState } from 'react'
import { useBlog } from '../context/BlogContext'

function AuthModal({ onClose }) {
  const { authenticate, setStatus } = useBlog()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const submit = async (event) => {
    event.preventDefault()
    try { await authenticate(mode, form); onClose() }
    catch (error) { setStatus(error.message) }
  }

  return <div className="modal-backdrop" onClick={onClose}><section className="auth-modal" onClick={(event) => event.stopPropagation()}><button className="close" onClick={onClose} aria-label="Close">×</button><p className="eyebrow">Welcome to Openbook</p><h2>{mode === 'login' ? 'Good to see you.' : 'Make yourself at home.'}</h2><form onSubmit={submit}>{mode === 'register' && <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />}<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" /><input required minLength="6" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password (6+ characters)" /><button className="button button-coral" type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</button></form><button className="switch-auth" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'New here? Create an account' : 'Already a member? Log in'}</button></section></div>
}

export default AuthModal
