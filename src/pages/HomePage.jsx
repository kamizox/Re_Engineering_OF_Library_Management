// src/pages/HomePage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import BookGrid from '../components/BookGrid';
import BookDetailModal from '../components/BookDetailModal';
import FilterPanel from '../components/FilterPanel';

const BOOKS_PER_PAGE = 15;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'rating', label: 'Top Rated' },
];

export default function HomePage() {
  const { books, loading, error, addReview } = useBooks();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all', minRating: 0, hasPdf: false, sort: 'newest' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = books.filter(b => {
      if (filters.category !== 'all' && b.category !== filters.category) return false;
      if (filters.status !== 'all' && b.status !== filters.status) return false;
      if (filters.minRating > 0 && (!b.rating || b.rating < filters.minRating)) return false;
      if (filters.hasPdf && !b.pdfUrl) return false;
      if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q) && !(b.category || '').toLowerCase().includes(q)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (filters.sort === 'title') return a.title.localeCompare(b.title);
      if (filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (filters.sort === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return list;
  }, [books, search, filters]);

  const totalPages = Math.ceil(filtered.length / BOOKS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  const handleSearch = (q) => { setSearch(q); setCurrentPage(1); };
  const handleFilters = (f) => { setFilters(f); setCurrentPage(1); };

  const stats = useMemo(() => ({
    available: books.filter(b => b.status === 'Available').length,
    notAvailable: books.filter(b => b.status === 'Not Available').length,
    withPdf: books.filter(b => b.pdfUrl).length,
  }), [books]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute text-8xl" style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%`, transform: `rotate(${(i - 4) * 8}deg)`, opacity: 0.3 }}>📚</div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-6">
              <span>✨</span> {books.length} books in collection
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-4">
              Discover Your<br />
              <span className="text-amber-400">Next Great Read</span>
            </h1>
            <p className="text-ink-300 text-lg mb-8">
              Explore, borrow, and read from our curated library. From textbooks to fiction — all in one place.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-xl">🔍</span>
              <input
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by title, author, or category..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all text-base"
              />
              {search && (
                <button onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-white">✕</button>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 mt-8">
              {[
                { icon: '✅', label: `${stats.available} Available` },
                { icon: '📤', label: `${stats.borrowed} Borrowed` },
                { icon: '📄', label: `${stats.withPdf} With PDF` },
              ].map(({ icon, label }) => (
                <div key={label} className="text-center">
                  <span className="text-xl">{icon}</span>
                  <p className="text-ink-300 text-sm mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          {/* Filter panel desktop */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <FilterPanel filters={filters} onChange={handleFilters} />
          </div>

          {/* Books area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(s => !s)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-ink-200 rounded-xl text-sm font-medium text-ink-700 hover:border-ink-400 transition-all"
                >
                  🔧 Filters
                </button>
                <span className="text-sm text-ink-500">
                  {loading ? 'Loading...' : filtered.length === books.length
                    ? `All ${books.length} books`
                    : `${filtered.length} of ${books.length} books`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filters.sort}
                  onChange={e => handleFilters({ ...filters, sort: e.target.value })}
                  className="px-3 py-2 border border-ink-200 rounded-xl text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {filtersOpen && (
              <div className="lg:hidden mb-5 animate-slide-up">
                <FilterPanel filters={filters} onChange={handleFilters} />
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm mb-5">
                ⚠️ {error}
              </div>
            )}

            <BookGrid books={paginated} loading={loading} onBookClick={setSelectedBook} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-ink-200 rounded-xl text-sm font-medium text-ink-700 hover:border-ink-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? 'bg-ink-900 text-white shadow-book'
                          : 'border border-ink-200 text-ink-700 hover:border-ink-400'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-ink-200 rounded-xl text-sm font-medium text-ink-700 hover:border-ink-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onAddReview={addReview}
        />
      )}
    </div>
  );
}
