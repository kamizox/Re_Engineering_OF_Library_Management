// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-900 text-ink-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-3xl">📚</span>
              <span className="font-display font-bold text-2xl text-white">LibraVault</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-400 max-w-xs">
              A modern library management system built with React & Firebase. Discover, borrow, and manage books effortlessly.
            </p>
            <div className="flex gap-3 mt-5">
              {['🌐', '📧', '🐦'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-ink-700 flex items-center justify-center transition-colors text-lg">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Browse Books' },
                { to: '/auth', label: 'Sign In / Register' },
                { to: '/admin', label: 'Admin Dashboard' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-ink-400 hover:text-white text-sm transition-colors">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['CSE', 'IT', 'Fiction', 'Self-Help', 'Fantasy', 'Sci-Fi', 'Finance'].map(cat => (
                <span key={cat} className="px-3 py-1 bg-ink-800 hover:bg-amber-600 text-ink-300 hover:text-white rounded-full text-xs font-medium cursor-pointer transition-all">
                  {cat}
                </span>
              ))}
            </div>

            <div className="mt-6 p-4 bg-ink-800 rounded-xl">
              <p className="text-xs text-ink-400 mb-1 uppercase tracking-wider">Built with</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['React 18', 'Firebase', 'Tailwind CSS', 'Vite 5'].map(t => (
                  <span key={t} className="px-2 py-0.5 bg-ink-700 text-ink-300 text-xs rounded font-mono">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ink-500 text-xs">
            © {year} LibraVault — Library Management System. Software Re-Engineering Project.
          </p>
          <p className="text-ink-600 text-xs">
            Originally by P. Jagadeesh · Redesigned & Advanced v2.0
          </p>
        </div>
      </div>
    </footer>
  );
}
