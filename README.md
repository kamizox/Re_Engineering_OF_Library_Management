# 📚 LibraVault — Advanced Library Management System v2.0

A fully advanced, production-grade library management system built with **React 18 + Vite 5 + Firebase + Tailwind CSS**.

## ✨ Features

### 🔐 Authentication
- Email/Password Sign Up & Sign In
- Google OAuth Sign In
- Password Reset via email
- Protected routes for admin

### 📚 Library Features
- Browse all books with beautiful card grid
- **Advanced Filtering** — Category, Status (Available/Borrowed/Coming Soon), Min Rating, PDF-only
- **Sorting** — Newest, Oldest, Title A–Z, Top Rated
- Search by title, author, or category
- Pagination (15 books/page)
- Real-time updates via Firebase

### 📖 Book Details
- Book detail modal with tabs: Info, Reviews, Read PDF
- Read PDF directly in browser (iframe viewer)
- Download PDF button
- Star rating display
- Tags, availability, copies info

### ⭐ Reviews System
- Logged-in users can add star ratings + comments
- Auto-recalculates average rating

### 🛠️ Admin Dashboard (All logged-in users in demo mode)
- Stats overview (total, available, borrowed, with PDF)
- Add, Edit, Delete books
- Upload cover image (file or URL)
- Upload PDF (stored in Firebase Storage)
- Inline table management

### 🎨 Design
- Playfair Display + DM Sans fonts
- Warm ink/amber color palette
- Smooth animations and transitions
- Fully responsive (mobile + desktop)
- Sticky navbar with user dropdown

---

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Firebase Setup
The app is pre-configured with your Firebase project. Make sure these are enabled in Firebase Console:
- **Authentication** → Email/Password + Google providers
- **Realtime Database** → Set rules to allow read/write for authenticated users
- **Storage** → Enable for PDF and cover image uploads

**Recommended Firebase Rules (Realtime Database):**
```json
{
  "rules": {
    "books": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**Firebase Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 📁 Project Structure
```
src/
├── components/
│   ├── Navbar.jsx          # Sticky header with auth
│   ├── Footer.jsx          # Rich footer
│   ├── BookGrid.jsx        # Responsive book card grid
│   ├── BookDetailModal.jsx # Book detail with PDF viewer & reviews
│   ├── BookFormModal.jsx   # Add/Edit book form with file uploads
│   ├── FilterPanel.jsx     # Advanced filter sidebar
│   └── StarRating.jsx      # Star display + input components
├── context/
│   └── AuthContext.jsx     # Firebase auth state
├── firebase/
│   └── config.js           # Firebase initialization
├── hooks/
│   └── useBooks.js         # Book CRUD + Firebase Storage upload
├── pages/
│   ├── AuthPage.jsx        # Login/Signup/Reset page
│   ├── HomePage.jsx        # Browse library page
│   └── AdminDashboard.jsx  # Admin management dashboard
├── App.jsx                 # Router setup
└── main.jsx                # Entry point
```

---

## 🔧 Tech Stack
- **React 18** + **Vite 5**
- **Firebase 10** (Realtime DB + Auth + Storage)
- **Tailwind CSS 3** — Utility-first styling
- **React Router 6** — Client-side routing
- **react-hot-toast** — Toast notifications
