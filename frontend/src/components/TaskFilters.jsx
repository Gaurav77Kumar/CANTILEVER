import { SlidersHorizontal } from 'lucide-react';
export default function TaskFilters({ filters, onChange }) {
  return <div className="filters">
    <span className="filter-label"><SlidersHorizontal size={16} /> Filter & sort</span>
    <label className="filter-control">Priority<select value={filters.priority} onChange={(e) => onChange('priority', e.target.value)}><option value="">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
    <label className="filter-control">Sort by<select value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option></select></label>
  </div>;
}
