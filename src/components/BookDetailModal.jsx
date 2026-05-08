// src/components/BookDetailModal.jsx
import { useState } from 'react';
import { StarDisplay, StarInput } from './StarRating';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  Available: 'bg-emerald-100 text-emerald-700',
  'Not Available': 'bg-rose-100 text-rose-700',
};


// ✅ PDF Viewer — handles both base64 (Firebase) and URL (external)
function PdfViewer({ book }) {
  const isBase64 = book.pdfUrl?.startsWith('data:');

  const handleDownload = () => {
    if (isBase64) {
      // Convert base64 to blob and download
      const link = document.createElement('a');
      link.href = book.pdfUrl;
      link.download = `${book.title}.pdf`;
      link.click();
    } else {
      window.open(book.pdfUrl, '_blank');
    }
  };

  return (
    <div className="animate-fade-in h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-ink-900 text-sm truncate max-w-[60%]">📖 {book.title}</h4>
        <button
          onClick={handleDownload}
          className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
        >
          ⬇️ Download PDF
        </button>
      </div>
      {/* ✅ iframe works perfectly with base64 data URLs — no 401 ever! */}
      <iframe
        src={book.pdfUrl}
        className="w-full rounded-xl border border-ink-100 bg-gray-50"
        style={{ height: '62vh', minHeight: '400px' }}
        title={book.title}
      />
    </div>
  );
}

export default function BookDetailModal({ book, onClose, onAddReview }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('info');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const reviews = book.reviews ? Object.values(book.reviews) : [];

  const handleReview = async () => {
    if (!reviewForm.comment.trim()) return toast.error('Write a review comment');
    setSubmitting(true);
    try {
      await onAddReview(book.id, {
        ...reviewForm,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL || null,
      });
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review added!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-ink-100">
          <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-ink-100">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink-900 leading-tight">{book.title}</h2>
                <p className="text-ink-500 mt-1">by <span className="font-medium text-ink-700">{book.author}</span></p>
              </div>
              <button onClick={onClose} className="text-ink-400 hover:text-ink-900 text-2xl transition-colors flex-shrink-0">✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[book.status] || 'bg-ink-100 text-ink-600'}`}>
                {book.status || 'Available'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ink-100 text-ink-700">{book.category}</span>
              {book.rating && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                  ⭐ {book.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 px-6">
          {['info', 'reviews', ...(book.pdfUrl ? ['read'] : [])].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-all capitalize ${
                tab === t ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'
              }`}
            >
              {t === 'read' ? '📄 Read PDF' : t === 'reviews' ? `⭐ Reviews (${reviews.length})` : '📋 Details'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {tab === 'info' && (
            <div className="space-y-5 animate-fade-in">
              {book.description && (
                <div>
                  <h4 className="font-semibold text-ink-900 mb-2">About this Book</h4>
                  <p className="text-ink-600 leading-relaxed">{book.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['📅 Published', book.publishDate],
                  ['📂 Category', book.category],
                  ['🔢 Total Copies', book.totalCopies || 'N/A'],
                  ['✅ Available', book.availableCopies !== undefined ? book.availableCopies : 'N/A'],
                ].map(([label, val]) => (
                  <div key={label} className="p-3 bg-ink-50 rounded-xl">
                    <p className="text-xs text-ink-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-ink-800">{val}</p>
                  </div>
                ))}
              </div>
              {book.tags && book.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-ink-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {book.pdfUrl && (
                  <>
                    <button onClick={() => setTab('read')} className="flex items-center gap-2 px-5 py-2.5 bg-ink-900 text-white rounded-xl font-semibold hover:bg-ink-800 transition-all shadow-book">
                      📖 Read Book
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = book.pdfUrl;
                        link.download = `${book.title}.pdf`;
                        link.click();
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-ink-200 text-ink-700 rounded-xl font-semibold hover:border-ink-400 transition-all">
                      ⬇️ Download PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-5 animate-fade-in">
              {/* Add review */}
              {user ? (
                <div className="p-4 bg-ink-50 rounded-xl">
                  <h4 className="font-semibold text-ink-900 mb-3">Write a Review</h4>
                  <StarInput value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                  <textarea
                    rows={3}
                    placeholder="Share your thoughts about this book..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    className="w-full mt-3 p-3 border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                  <button
                    onClick={handleReview}
                    disabled={submitting}
                    className="mt-2 px-5 py-2 bg-ink-900 text-white text-sm font-semibold rounded-xl hover:bg-ink-800 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <a href="/auth" className="font-semibold underline">Sign in</a> to write a review.
                </div>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <p className="text-ink-400 text-sm text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-ink-50 rounded-xl">
                    {r.userPhoto ? (
                      <img src={r.userPhoto} alt={r.userName} className="w-9 h-9 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-ink-800 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {(r.userName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-ink-900">{r.userName || 'Anonymous'}</span>
                        <StarDisplay rating={r.rating} size="sm" />
                      </div>
                      <p className="text-ink-600 text-sm">{r.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'read' && book.pdfUrl && (
            <PdfViewer book={book} />
          )}
        </div>
      </div>
    </div>
  );
}
