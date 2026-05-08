// src/pages/AdminDashboard.jsx
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import BookFormModal from '../components/BookFormModal';
import { StarDisplay } from '../components/StarRating';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  Available: 'bg-emerald-100 text-emerald-700',
  'Not Available': 'bg-rose-100 text-rose-700',
};

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter(b =>
      !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [books, search]);

  const stats = useMemo(() => ({
    total: books.length,
    available: books.filter(b => b.status === 'Available').length,
    notAvailable: books.filter(b => b.status === 'Not Available').length,
    withPdf: books.filter(b => b.pdfUrl).length,
  }), [books]);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🔒</span>
          <h2 className="font-display text-2xl font-bold mt-4 text-ink-900">Admin Access Only</h2>
          <p className="text-ink-500 mt-2">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (book) => {
    try {
      await deleteBook(book.id);
      toast.success(`"${book.title}" deleted`);
      setDeleteConfirm(null);
    } catch {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">Admin Dashboard</h1>
          <p className="text-ink-500 mt-1">Manage your library collection</p>
        </div>
        <button
          onClick={() => { setEditBook(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-ink-900 text-white font-semibold rounded-xl hover:bg-ink-800 transition-all shadow-book hover:shadow-book-hover"
        >
          ➕ Add Book
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Books', value: stats.total, icon: '📚', color: 'bg-ink-900 text-white' },
          { label: 'Available', value: stats.available, icon: '✅', color: 'bg-emerald-50 text-emerald-800' },
          { label: 'Not Available', value: stats.notAvailable, icon: '❌', color: 'bg-rose-50 text-rose-800' },
          { label: 'With PDF', value: stats.withPdf, icon: '📄', color: 'bg-sky-50 text-sky-800' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`rounded-2xl p-5 ${color} border border-ink-100`}>
            <span className="text-2xl">{icon}</span>
            <p className="font-display text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm font-medium opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search books by title or author..."
          className="w-full pl-11 pr-4 py-3 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-ink-900"
        />
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50">
                {['Book', 'Category', 'Status', 'Rating', 'PDF', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-ink-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="shimmer h-4 rounded w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map(book => (
                <tr key={book.id} className="border-b border-ink-50 hover:bg-ink-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 rounded overflow-hidden bg-ink-100 flex-shrink-0">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center text-lg">📖</div>}
                      </div>
                      <div>
                        <p className="font-medium text-ink-900 text-sm line-clamp-1">{book.title}</p>
                        <p className="text-xs text-ink-500">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 bg-ink-100 text-ink-700 text-xs font-medium rounded-full">{book.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[book.status] || 'bg-ink-100 text-ink-600'}`}>
                      {book.status || 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {book.rating ? (
                      <div className="flex items-center gap-1">
                        <StarDisplay rating={book.rating} size="sm" />
                        <span className="text-xs text-ink-500">{book.rating.toFixed(1)}</span>
                      </div>
                    ) : <span className="text-xs text-ink-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {book.pdfUrl ? (
                      <a href={book.pdfUrl} target="_blank" rel="noreferrer"
                        className="px-2.5 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full hover:bg-sky-200 transition-colors">
                        📄 View
                      </a>
                    ) : <span className="text-xs text-ink-300">None</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditBook(book); setShowForm(true); }}
                        className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(book)}
                        className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-200 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-ink-400">
            <span className="text-4xl">📭</span>
            <p className="mt-3">No books found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <BookFormModal
          book={editBook}
          onClose={() => { setShowForm(false); setEditBook(null); }}
          onSubmit={editBook
            ? (data, pdf, cover, onProgress) => updateBook(editBook.id, data, pdf, cover, onProgress)
            : addBook
          }
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-modal p-6 max-w-sm w-full animate-scale-in">
            <h3 className="font-display text-xl font-bold text-ink-900 mb-2">Delete Book?</h3>
            <p className="text-ink-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border-2 border-ink-200 text-ink-700 font-semibold rounded-xl hover:border-ink-400 transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-all">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
