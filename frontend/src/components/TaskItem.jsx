import { CalendarDays, Check, Pencil, Trash2 } from 'lucide-react';
const statusLabels = { todo: 'To do', 'in-progress': 'In progress', completed: 'Completed' };
export default function TaskItem({ task, onEdit, onDelete, onToggle, busy }) {
  const completed = task.status === 'completed';
  const date = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const overdue = date && !completed && task.dueDate.slice(0, 10) < todayText;
  return <article className={`task-card ${completed ? 'is-complete' : ''}`}>
    <button className={`task-check ${completed ? 'checked' : ''}`} aria-label={`${completed ? 'Reopen' : 'Complete'} ${task.title}`} onClick={() => onToggle(task)} disabled={busy}>{completed && <Check size={15} />}</button>
    <div className="task-content"><div className="task-heading"><h3>{task.title}</h3><span className={`badge ${task.priority}`}><span className="priority-dot" />{task.priority}</span></div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta"><span className={`status ${task.status}`}><span />{statusLabels[task.status]}</span><span className={overdue ? 'overdue' : ''}><CalendarDays size={13} />{date ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'No due date'}{overdue && ' · Overdue'}</span></div>
    </div>
    <div className="task-actions"><button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)} disabled={busy}><Pencil size={16} /></button><button className="icon-button danger" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)} disabled={busy}><Trash2 size={16} /></button></div>
  </article>;
}
