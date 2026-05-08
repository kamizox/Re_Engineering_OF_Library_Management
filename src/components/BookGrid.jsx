// src/components/BookGrid.jsx
import { StarDisplay } from './StarRating';

const STATUS_STYLES = {
  Available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Not Available': 'bg-rose-100 text-rose-700 border-rose-200',
};

const STATUS_ICONS = {
  Available: '✅',
  'Not Available': '❌',
};

const CATEGORY_COLORS = {
  CSE: 'bg-violet-100 text-violet-700',
  IT: 'bg-blue-100 text-blue-700',
  Fiction: 'bg-pink-100 text-pink-700',
  'Self-Help': 'bg-orange-100 text-orange-700',
  Fantasy: 'bg-purple-100 text-purple-700',
  'Sci-Fi': 'bg-cyan-100 text-cyan-700',
  Finance: 'bg-green-100 text-green-700',
  default: 'bg-ink-100 text-ink-600',
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-ink-100">
      <div className="shimmer h-52 w-full" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-4 rounded w-3/4" />
        <div className="shimmer h-3 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="shimmer h-6 rounded-full w-16" />
          <div className="shimmer h-6 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book, onClick }) {
  const statusStyle = STATUS_STYLES[book.status] || STATUS_STYLES.Available;
  const catColor = CATEGORY_COLORS[book.category] || CATEGORY_COLORS.default;

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-card hover:shadow-book-hover transition-all duration-300 cursor-pointer group hover:-translate-y-1 animate-fade-in"
      onClick={() => onClick(book)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(book)}
    >
      {/* Cover */}
      <div className="relative h-52 bg-gradient-to-br from-ink-100 to-ink-200 overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 to-ink-100">
            <span className="text-5xl">📖</span>
            <span className="text-xs text-ink-400 font-medium">No Cover</span>
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 ${statusStyle}`}>
          <span>{STATUS_ICONS[book.status] || '📖'}</span>
          {book.status || 'Available'}
        </div>

        {/* PDF badge */}
        {book.pdfUrl && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
            PDF
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-ink-900 text-base leading-tight line-clamp-2 group-hover:text-amber-700 transition-colors mb-1">
          {book.title}
        </h3>
        <p className="text-ink-500 text-sm mb-3 truncate">by {book.author}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
            {book.category}
          </span>
          {book.rating && (
            <div className="flex items-center gap-1">
              <StarDisplay rating={book.rating} size="sm" />
              <span className="text-xs text-ink-500 font-medium">{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {book.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-ink-400 bg-ink-50 px-2 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function BookGrid({ books, loading, onBookClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <span className="text-6xl">📭</span>
        <h3 className="font-display text-2xl font-bold text-ink-800 mt-4">No books found</h3>
        <p className="text-ink-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {books.map(book => (
        <BookCard key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  );
}
