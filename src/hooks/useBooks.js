// src/hooks/useBooks.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref as dbRef, get, push, set, remove, update, onValue } from 'firebase/database';

// ✅ Cloudinary config (FREE - 25GB free storage)
const CLOUDINARY_CLOUD_NAME = 'dgrqafarv'; // 👈 Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'library_upload'; // 👈 Your Unsigned preset name

const SEED_BOOKS = [
  { title: 'Cryptography & Network Security', author: 'William Stallings', category: 'IT', publishDate: '2022-11-11', coverImage: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=600&fit=crop', description: 'A comprehensive guide to modern cryptography and security protocols.', status: 'Available', rating: 4.5, tags: ['Security', 'Networking', 'Encryption'], totalCopies: 5, availableCopies: 3 },
  { title: 'Database Management Systems', author: 'Ramez Elmasri', category: 'IT', publishDate: '2022-12-22', coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=600&fit=crop', description: 'DBMS fundamentals including ER diagrams, SQL, normalization, and transactions.', status: 'Available', rating: 4.2, tags: ['Database', 'SQL', 'Design'], totalCopies: 4, availableCopies: 4 },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', category: 'CSE', publishDate: '2022-12-20', coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=600&fit=crop', description: 'The definitive textbook on AI covering search, knowledge, reasoning, and machine learning.', status: 'Available', rating: 4.8, tags: ['AI', 'Machine Learning', 'Algorithms'], totalCopies: 3, availableCopies: 1 },
  { title: 'Clean Code', author: 'Robert C. Martin', category: 'CSE', publishDate: '2008-08-01', coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=600&fit=crop', description: 'A handbook of agile software craftsmanship.', status: 'Not Available', rating: 4.9, tags: ['Programming', 'Best Practices', 'Refactoring'], totalCopies: 2, availableCopies: 0 },
  { title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', publishDate: '2018-10-16', coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', description: 'Tiny changes, remarkable results.', status: 'Available', rating: 4.7, tags: ['Habits', 'Productivity', 'Psychology'], totalCopies: 6, availableCopies: 4 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', publishDate: '1925-04-10', coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', description: 'A masterpiece of American literature.', status: 'Available', rating: 4.3, tags: ['Classic', 'American Literature', 'Drama'], totalCopies: 3, availableCopies: 2 },
  { title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'CSE', publishDate: '2022-04-20', coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop', description: 'The classic OS book — processes, memory, file systems, and security.', status: 'Available', rating: 4.4, tags: ['OS', 'Systems', 'Computer Science'], totalCopies: 5, availableCopies: 3 },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', category: 'Fantasy', publishDate: '1997-06-26', coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop', description: 'The legendary fantasy series about the boy wizard.', status: 'Not Available', rating: 4.9, tags: ['Fantasy', 'Magic', 'Adventure'], totalCopies: 4, availableCopies: 0 },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'CSE', publishDate: '2009-07-31', coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=600&fit=crop', description: 'CLRS — the gold standard algorithms textbook.', status: 'Available', rating: 4.6, tags: ['Algorithms', 'Data Structures', 'Theory'], totalCopies: 2, availableCopies: 1 },
  { title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', publishDate: '2020-09-08', coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop', description: 'Timeless lessons on wealth, greed, and happiness.', status: 'Available', rating: 4.6, tags: ['Finance', 'Psychology', 'Investing'], totalCopies: 3, availableCopies: 2 },
  { title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', publishDate: '1965-08-01', coverImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop', description: 'The epic sci-fi masterpiece set on Arrakis.', status: 'Available', rating: 4.8, tags: ['Sci-Fi', 'Epic', 'Classic'], totalCopies: 3, availableCopies: 3 },
  { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'IT', publishDate: '2021-03-15', coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=600&fit=crop', description: 'A comprehensive text on computer networking.', status: 'Available', rating: 4.3, tags: ['Networking', 'Protocols', 'Internet'], totalCopies: 4, availableCopies: 2 },
];

// ✅ KEY FIX: PDF bhi "image" resource type se upload karo
// Cloudinary "image" type se upload ki gayi files PUBLICLY accessible hoti hain
// "raw" type files free plan mein private hoti hain (401 error)
//
async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  // ✅ ALWAYS use "image" resource type — PDFs bhi is se upload ho jaate hain
  // aur publicly accessible rehte hain (no 401 error!)
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        // ✅ For PDFs uploaded as "image", convert URL to get the PDF back
        // Cloudinary stores PDFs as images but the original file is still accessible
        let url = data.secure_url;
        // If it's a PDF, replace /image/upload/ with correct format
        if (file.type === 'application/pdf') {
          // Get the PDF version of the uploaded file
          url = data.secure_url
            .replace('/image/upload/', '/image/upload/fl_attachment/')
            .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.pdf');
          // If no extension was added, just use the original secure_url with .pdf
          if (!url.endsWith('.pdf')) {
            url = data.secure_url.replace('/upload/', '/upload/') + '';
            // Use the raw URL directly - Cloudinary keeps original file
            url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${data.public_id}.pdf`;
          }
          // Best approach: use the delivery URL with fl_attachment false
          url = data.secure_url.replace('/image/upload/', '/raw/upload/').replace(/\.[^/.]+$/, '.pdf');
        }
        resolve(url);
      } else {
        let errMsg = 'Upload failed.';
        try {
          const errData = JSON.parse(xhr.responseText);
          errMsg = errData.error?.message || errMsg;
        } catch {}
        reject(new Error(errMsg + ' Check your Cloudinary cloud name and upload preset (must be Unsigned).'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload. Check your internet connection.')));
    xhr.open('POST', url);
    xhr.send(formData);
  });
}

// ✅ Better approach: Convert PDF to base64 and store in Firebase directly
// For small PDFs (< 500KB) this is the most reliable approach
async function storePdfAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('PDF too large for direct storage. Max 5MB. Use a URL instead.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // data:application/pdf;base64,...
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsDataURL(file);
  });
}

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const booksRef = dbRef(db, 'books');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(booksRef, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setBooks(list);
        } else {
          await seedBooks();
        }
      } catch (err) {
        setError('Failed to load books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, () => {
      setError('Failed to load books. Check your connection.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function seedBooks() {
    for (const book of SEED_BOOKS) {
      await push(booksRef, { ...book, createdAt: Date.now() });
    }
  }

  async function addBook(bookData, pdfFile = null, coverFile = null, onProgress = null) {
    const newRef = push(booksRef);
    let pdfUrl = bookData.pdfUrl || null;
    let coverImage = bookData.coverImage || null;

    if (coverFile) {
      onProgress?.('cover', 10);
      coverImage = await uploadToCloudinary(coverFile, p => onProgress?.('cover', p));
    }
    if (pdfFile) {
      onProgress?.('pdf', 10);
      // ✅ Store PDF as base64 in Firebase — always works, no 401 ever!
      pdfUrl = await storePdfAsBase64(pdfFile);
    }

    await set(newRef, { ...bookData, pdfUrl, coverImage, createdAt: Date.now() });
  }

  async function updateBook(id, bookData, pdfFile = null, coverFile = null, onProgress = null) {
    const bookRef = dbRef(db, `books/${id}`);
    let updates = { ...bookData };

    if (coverFile) {
      updates.coverImage = await uploadToCloudinary(coverFile, p => onProgress?.('cover', p));
    }
    if (pdfFile) {
      onProgress?.('pdf', 10);
      updates.pdfUrl = await storePdfAsBase64(pdfFile);
    }

    await update(bookRef, { ...updates, updatedAt: Date.now() });
  }

  async function deleteBook(id) {
    await remove(dbRef(db, `books/${id}`));
  }

  async function addReview(bookId, review) {
    const reviewsRef = dbRef(db, `books/${bookId}/reviews`);
    await push(reviewsRef, { ...review, createdAt: Date.now() });

    const bookSnap = await get(dbRef(db, `books/${bookId}`));
    if (bookSnap.exists()) {
      const book = bookSnap.val();
      const reviews = book.reviews ? Object.values(book.reviews) : [];
      const allReviews = [...reviews, review];
      const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
      await update(dbRef(db, `books/${bookId}`), { rating: Math.round(avgRating * 10) / 10 });
    }
  }

  return { books, loading, error, addBook, updateBook, deleteBook, addReview };
}
