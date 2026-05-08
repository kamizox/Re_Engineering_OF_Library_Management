// src/components/BookFormModal.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORIES = ['CSE', 'IT', 'Fiction', 'Self-Help', 'Fantasy', 'Sci-Fi', 'Finance', 'Basic', 'ISE', 'Novel'];
// ✅ Only Available / Not Available (Borrow system removed)
const STATUSES = ['Available', 'Not Available'];

const EMPTY = {
  title: '', author: '', category: 'CSE', publishDate: '',
  coverImage: '', description: '', status: 'Available',
  rating: '', tags: '', totalCopies: 1, availableCopies: 1,
};

export default function BookFormModal({ book, onClose, onSubmit }) {
  const isEdit = !!book;
  const [form, setForm] = useState(isEdit ? {
    ...book,
    tags: Array.isArray(book.tags) ? book.tags.join(', ') : (book.tags || ''),
  } : EMPTY);
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [coverProgress, setCoverProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [coverPreview, setCoverPreview] = useState(book?.coverImage || null);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleCoverFile = (file) => {
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = e => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.author.trim()) return toast.error('Author is required');
    if (!form.publishDate) return toast.error('Publish date is required');

    setSaving(true);
    setUploadStatus('');
    setCoverProgress(0);
    setPdfProgress(0);

    try {
      const tagsArr = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const bookData = { ...form, tags: tagsArr, rating: form.rating ? parseFloat(form.rating) : null };

      const onProgress = (type, progress) => {
        if (type === 'cover') {
          setCoverProgress(progress);
          setUploadStatus(`Uploading cover image... ${progress}%`);
        } else if (type === 'pdf') {
          setPdfProgress(progress);
          setUploadStatus(`Processing PDF... ${progress}%`);
        }
      };

      setUploadStatus('Saving book data...');
      await onSubmit(bookData, pdfFile, coverFile, onProgress);
      toast.success(isEdit ? 'Book updated successfully!' : 'Book added to library!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save book. Check Cloudinary settings.');
    } finally {
      setSaving(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && !saving && onClose()}>
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink-100">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            {isEdit ? '✏️ Edit Book' : '➕ Add New Book'}
          </h2>
          <button onClick={() => !saving && onClose()} className="text-ink-400 hover:text-ink-900 text-2xl transition-colors">✕</button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Cover + Title + Author */}
          <div className="flex gap-5 items-start">
            <div className="w-28 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-ink-100 border-2 border-dashed border-ink-200 flex items-center justify-center relative group cursor-pointer"
              onClick={() => document.getElementById('cover-file-input').click()}>
              {coverPreview ? (
                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-xs text-ink-400 mt-1">Cover</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
              <input id="cover-file-input" type="file" accept="image/*" className="hidden"
                onChange={e => handleCoverFile(e.target.files[0])} />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="Book title"
                  className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Author *</label>
                <input value={form.author} onChange={e => update('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900 bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Availability</label>
              <select value={form.status} onChange={e => update('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900 bg-white">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Publish Date *</label>
              <input type="date" value={form.publishDate} onChange={e => update('publishDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Rating (0-5)</label>
              <input type="number" min="0" max="5" step="0.1" value={form.rating}
                onChange={e => update('rating', e.target.value)} placeholder="e.g. 4.5"
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Total Copies</label>
              <input type="number" min="0" value={form.totalCopies}
                onChange={e => update('totalCopies', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Available Copies</label>
              <input type="number" min="0" value={form.availableCopies}
                onChange={e => update('availableCopies', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => update('tags', e.target.value)}
              placeholder="Algorithms, Data Structures, Theory"
              className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Cover Image URL (optional)</label>
            <input value={form.coverImage} onChange={e => { update('coverImage', e.target.value); if (e.target.value) setCoverPreview(e.target.value); }}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900" />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Short description of the book..."
              className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900 resize-none" />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1.5 block">📄 Upload PDF (via Cloudinary)</label>
            <div
              className="border-2 border-dashed border-ink-200 hover:border-amber-400 rounded-xl p-5 text-center cursor-pointer transition-all"
              onClick={() => document.getElementById('pdf-file-input').click()}
            >
              {pdfFile ? (
                <div className="text-emerald-600">
                  <span className="text-2xl">✅</span>
                  <p className="text-sm font-medium mt-1">{pdfFile.name}</p>
                  <p className="text-xs text-ink-400">({(pdfFile.size / 1024 / 1024).toFixed(2)} MB) — Ready to upload</p>
                </div>
              ) : book?.pdfUrl ? (
                <div className="text-sky-600">
                  <span className="text-2xl">📄</span>
                  <p className="text-sm font-medium mt-1">PDF already uploaded</p>
                  <p className="text-xs text-ink-400">Click to replace</p>
                </div>
              ) : (
                <div className="text-ink-400">
                  <span className="text-3xl">📤</span>
                  <p className="text-sm font-medium mt-1">Click to select PDF</p>
                  <p className="text-xs mt-0.5">Max 5MB • PDF only • Stored securely</p>
                </div>
              )}
              <input id="pdf-file-input" type="file" accept=".pdf" className="hidden"
                onChange={e => setPdfFile(e.target.files[0] || null)} />
            </div>

            {/* PDF also via URL */}
            <div className="mt-2">
              <input value={form.pdfUrl || ''} onChange={e => update('pdfUrl', e.target.value)}
                placeholder="Or paste PDF URL directly (Google Drive, etc.)"
                className="w-full px-4 py-2.5 border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-ink-900 text-sm" />
            </div>
          </div>

          {/* Upload progress bars */}
          {saving && (
            <div className="space-y-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-sm font-semibold text-amber-700 flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-amber-400/40 border-t-amber-600 rounded-full animate-spin" />
                {uploadStatus || 'Processing...'}
              </p>
              {coverProgress > 0 && coverProgress < 100 && (
                <div>
                  <div className="flex justify-between text-xs text-ink-500 mb-1">
                    <span>Cover Image</span><span>{coverProgress}%</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300 rounded-full" style={{ width: `${coverProgress}%` }} />
                  </div>
                </div>
              )}
              {pdfProgress > 0 && pdfProgress < 100 && (
                <div>
                  <div className="flex justify-between text-xs text-ink-500 mb-1">
                    <span>PDF File</span><span>{pdfProgress}%</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 transition-all duration-300 rounded-full" style={{ width: `${pdfProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 border-t border-ink-100">
          <button onClick={() => !saving && onClose()}
            disabled={saving}
            className="flex-1 py-3 border-2 border-ink-200 text-ink-700 font-semibold rounded-xl hover:border-ink-400 transition-all disabled:opacity-40">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 bg-ink-900 text-white font-semibold rounded-xl hover:bg-ink-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-book"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {uploadStatus ? 'Uploading...' : 'Saving...'}</>
            ) : isEdit ? '✅ Update Book' : '➕ Add Book'}
          </button>
        </div>
      </div>
    </div>
  );
}
