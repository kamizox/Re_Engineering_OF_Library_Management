// src/components/FilterPanel.jsx
export const CATEGORIES = ['All', 'CSE', 'IT', 'Fiction', 'Self-Help', 'Fantasy', 'Sci-Fi', 'Finance', 'Basic', 'ISE', 'Novel'];
// ✅ Removed Borrowed and Coming Soon
export const STATUSES = ['All', 'Available', 'Not Available'];

export default function FilterPanel({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <aside className="bg-white rounded-2xl border border-ink-100 shadow-card p-5 sticky top-20 space-y-6">
      <h3 className="font-display font-bold text-ink-900 text-lg flex items-center gap-2">
        <span>🔧</span> Filters
      </h3>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3 block">Category</label>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => set('category', cat === 'All' ? 'all' : cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                (filters.category === 'all' && cat === 'All') || filters.category === cat
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3 block">Availability</label>
        <div className="space-y-1">
          {STATUSES.map(status => (
            <button
              key={status}
              onClick={() => set('status', status === 'All' ? 'all' : status)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                (filters.status === 'all' && status === 'All') || filters.status === status
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {status === 'Available' ? '✅ Available' : status === 'Not Available' ? '❌ Not Available' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3 block">
          Min Rating: <span className="text-amber-600">{filters.minRating > 0 ? `${filters.minRating}★` : 'Any'}</span>
        </label>
        <input
          type="range"
          min="0" max="5" step="0.5"
          value={filters.minRating}
          onChange={e => set('minRating', parseFloat(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs text-ink-400 mt-1">
          <span>Any</span><span>5★</span>
        </div>
      </div>

      {/* Has PDF */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasPdf}
            onChange={e => set('hasPdf', e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          <span className="text-sm font-medium text-ink-700">PDF Available Only</span>
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ category: 'all', status: 'all', minRating: 0, hasPdf: false, sort: 'newest' })}
        className="w-full py-2 border-2 border-ink-200 text-ink-600 text-sm font-medium rounded-xl hover:border-ink-400 hover:text-ink-900 transition-all"
      >
        Reset Filters
      </button>
    </aside>
  );
}
