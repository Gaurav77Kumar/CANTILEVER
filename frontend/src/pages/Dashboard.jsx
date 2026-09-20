import { useEffect, useRef, useState } from 'react';
import { CheckCheck, LayoutDashboard, LogOut, Plus, ArrowUpRight, ListTodo, CircleCheck, Clock3, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api, { errorMessage } from '../api/axios.js';
import TaskFilters from '../components/TaskFilters.jsx';
import TaskItem from '../components/TaskItem.jsx';
import TaskForm from '../components/TaskForm.jsx';

const tabs = [['', 'All tasks'], ['todo', 'To do'], ['in-progress', 'In progress'], ['completed', 'Completed']];
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState({ status: '', priority: '', sort: 'newest' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ tasks: [], total: 0, pages: 0 });
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const deleteDialog = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    api.get('/tasks', { params: { ...filters, page }, signal: controller.signal }).then(({ data: result }) => {
      if (page > Math.max(1, result.pages)) setPage(Math.max(1, result.pages));
      else setData(result);
    }).catch((err) => { if (err.code !== 'ERR_CANCELED') setError(errorMessage(err)); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [filters, page, refresh]);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(tabs.map(([status]) => api.get('/tasks', { params: { status }, signal: controller.signal })))
      .then((results) => setCounts(results.map((result) => result.data.total)))
      .catch(() => { if (!controller.signal.aborted) setCounts(null); });
    return () => controller.abort();
  }, [refresh]);
  useEffect(() => { if (deleting) deleteDialog.current.showModal(); }, [deleting]);
  function changeFilter(key, value) { setPage(1); setFilters((old) => ({ ...old, [key]: value })); }
  function saved() { setEditor(null); setRefresh((n) => n + 1); setNotice('Task saved. A little more organized.'); }
  async function toggle(task) {
    setBusy(true); setError(''); setNotice('');
    try { await api.patch(`/tasks/${task._id}`, { status: task.status === 'completed' ? 'todo' : 'completed' }); setRefresh((n) => n + 1); setNotice('Task updated.'); }
    catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError('');
    try { await api.delete(`/tasks/${deleting._id}`); setDeleting(null); setRefresh((n) => n + 1); setNotice('Task deleted.'); }
    catch (err) { setDeleting(null); setError(errorMessage(err)); }
    finally { setBusy(false); }
  }
  const completion = counts?.[0] ? Math.round(counts[3] / counts[0] * 100) : 0;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><CheckCheck size={23} /></span>taskflow<span className="brand-dot">.</span></div>
      <span className="nav-caption">WORKSPACE</span>
      <button className="nav-item active" onClick={() => { setFilters({ status: '', priority: '', sort: 'newest' }); setPage(1); }}><LayoutDashboard size={19} />My tasks<span>{counts?.[0] ?? '–'}</span></button>
      <div className="sidebar-note"><Sparkles size={21} /><h3>Little by little,<br />a lot gets done.</h3><p>Focus on the next step.<br />The rest will follow.</p></div>
      <div className="account"><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>Personal workspace</small></div><button className="icon-button" onClick={logout} aria-label="Log out" title="Log out"><LogOut size={18} /></button></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><span>Workspace <span className="slash">/</span> <strong>My tasks</strong></span><span className="today">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span></header>
      <main className="dashboard">
        <div className="page-heading"><div><span className="section-kicker">MAKE ROOM FOR WHAT MATTERS</span><h1>Your day, organized<span>.</span></h1><p className="muted">Hi {user.name.split(' ')[0]}, let’s turn a little focus into real progress.</p></div><button className="button primary" onClick={() => setEditor({ task: null })}><Plus size={18} />New task</button></div>
        <section className="stats" aria-label="Task overview">
          {[['Total tasks', counts?.[0], ListTodo, 'Everything in one place', 'green'], ['In progress', counts?.[2], Clock3, 'A little closer every day', 'amber'], ['Completed', counts?.[3], CircleCheck, 'Small wins, real progress', 'purple']].map(([label, count, Icon, caption, color]) => <div className="stat-card" key={label}><div className="stat-top"><span>{label}</span><span className={`stat-icon ${color}`}><Icon size={19} /></span></div><strong>{count ?? '–'}</strong><small>{caption}</small></div>)}
        </section>
        <section className="task-section" aria-labelledby="tasks-heading">
          <div className="section-heading"><div><h2 id="tasks-heading">Your tasks <span>{counts?.[0] ?? '–'}</span></h2><p>A clear view of what’s next.</p></div><span className="workspace-label"><span />Personal workspace</span></div>
          <div className="task-toolbar"><div className="tabs" aria-label="Task status">{tabs.map(([value, label], index) => <button key={value} className={filters.status === value ? 'selected' : ''} aria-pressed={filters.status === value} onClick={() => changeFilter('status', value)}>{label}<span>{counts?.[index] ?? '–'}</span></button>)}</div><TaskFilters filters={filters} onChange={changeFilter} /></div>
          {notice && <p className="success-message" role="status">{notice}</p>}
          {error && <div className="error-message" role="alert">{error} <button className="text-button" onClick={() => setRefresh((n) => n + 1)}>Try again</button></div>}
          {loading ? <div className="empty-state" role="status">Getting your tasks ready…</div> : !error && !data.tasks.length ? <div className="empty-state"><span className="empty-icon"><ListTodo size={30} /></span><h3>{filters.status || filters.priority ? 'A clear view. No matches.' : 'A fresh start awaits.'}</h3><p>{filters.status || filters.priority ? 'Try a different filter to find your tasks.' : 'Create your first task and take one small step forward.'}</p><button className="button primary" onClick={() => setEditor({ task: null })}><Plus size={16} />Create a task</button></div> : <div className="task-list">{data.tasks.map((task) => <TaskItem key={task._id} task={task} busy={busy} onEdit={(task) => setEditor({ task })} onDelete={setDeleting} onToggle={toggle} />)}</div>}
          {data.pages > 1 && !loading && <div className="pagination"><span>Page {page} of {data.pages} · {data.total} tasks</span><button className="icon-button" disabled={page === 1} aria-label="Previous page" onClick={() => setPage(page - 1)}><ChevronLeft size={19} /></button><button className="icon-button" disabled={page >= data.pages} aria-label="Next page" onClick={() => setPage(page + 1)}><ChevronRight size={19} /></button></div>}
        </section>
        <footer className="dashboard-footer"><span><Sparkles size={15} /> Progress, not perfection.</span><span>{counts ? `${completion}% of your tasks complete` : 'Your space to make progress'}<ArrowUpRight size={15} /></span></footer>
      </main>
    </div>
    {editor && <TaskForm task={editor.task} onClose={() => setEditor(null)} onSaved={saved} />}
    {deleting && <dialog ref={deleteDialog} className="task-dialog delete-dialog" aria-labelledby="delete-title" onCancel={(e) => { e.preventDefault(); if (!busy) setDeleting(null); }}><h2 id="delete-title">Delete this task?</h2><p>“{deleting.title}” will be permanently deleted. This cannot be undone.</p><div className="dialog-footer"><button className="button" disabled={busy} onClick={() => setDeleting(null)}>Keep task</button><button className="button delete-button" disabled={busy} onClick={remove}>{busy ? 'Deleting…' : 'Delete task'}</button></div></dialog>}
  </div>;
}
