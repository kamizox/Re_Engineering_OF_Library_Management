// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out. See you soon!');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Browse' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
            <div>
              <span className="font-display font-bold text-xl text-ink-900 tracking-tight">LibraVault</span>
              <span className="hidden sm:block text-[10px] text-ink-400 -mt-1 tracking-widest uppercase">Library Management</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === to
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User area */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(s => !s)}
                  className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl hover:bg-ink-100 transition-all group"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-amber-400" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-ink-700 max-w-24 truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-ink-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-modal border border-ink-100 py-1.5 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-ink-100">
                      <p className="text-sm font-medium text-ink-900 truncate">{user.displayName || 'User'}</p>
                      <p className="text-xs text-ink-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Admin</span>
                      )}
                    </div>
                    {navLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                      >
                        {label === 'Browse' ? '🏠' : '⚙️'} {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2 bg-ink-900 text-white text-sm font-semibold rounded-xl hover:bg-ink-800 transition-all shadow-book hover:shadow-book-hover active:translate-y-0.5"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu btn */}
            <button className="md:hidden p-2 rounded-lg hover:bg-ink-100" onClick={() => setMenuOpen(s => !s)}>
              <svg className="w-5 h-5 text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-ink-100 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                {label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50">
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
