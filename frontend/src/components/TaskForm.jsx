import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import api, { errorMessage } from '../api/axios.js';

export default function TaskForm({ task, onClose, onSaved }) {
  const dialog = useRef(null);
  const [values, setValues] = useState({ title: task?.title || '', description: task?.description || '', status: task?.status || 'todo', priority: task?.priority || 'medium', dueDate: task?.dueDate?.slice(0, 10) || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { dialog.current.showModal(); }, []);
  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      if (task) await api.patch(`/tasks/${task._id}`, values);
      else await api.post('/tasks', values);
      onSaved();
    } catch (err) { setError(errorMessage(err)); setBusy(false); }
  }
  return <dialog ref={dialog} className="task-dialog" aria-labelledby="task-form-title" onCancel={(e) => { e.preventDefault(); if (!busy) onClose(); }}>
    <div className="dialog-heading"><div><span className="section-kicker">ONE STEP AT A TIME</span><h2 id="task-form-title">{task ? 'Edit task' : 'Create a task'}</h2></div><button className="icon-button" onClick={onClose} disabled={busy} aria-label="Close"><X size={20} /></button></div>
    <form onSubmit={submit}>
      <fieldset disabled={busy}>
        <label>Task title<input autoFocus name="title" placeholder="What would you like to get done?" required maxLength={160} value={values.title} onChange={change} /></label>
        <label>Description <span className="muted">(optional)</span><textarea name="description" placeholder="Add a little context…" rows={4} maxLength={4000} value={values.description} onChange={change} /></label>
        <div className="form-row"><label>Status<select name="status" value={values.status} onChange={change}><option value="todo">To do</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></label><label>Priority<select name="priority" value={values.priority} onChange={change}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label></div>
        <label>Due date <span className="muted">(optional)</span><input type="date" name="dueDate" value={values.dueDate} onChange={change} /></label>
      </fieldset>
      {error && <p role="alert" className="error-message">{error}</p>}
      <div className="dialog-footer"><button type="button" className="button" disabled={busy} onClick={onClose}>Cancel</button><button className="button primary" disabled={busy}>{busy ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button></div>
    </form>
  </dialog>;
}
