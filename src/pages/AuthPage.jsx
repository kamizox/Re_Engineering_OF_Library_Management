// src/pages/AuthPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const result = await loginWithGoogle();
      const email = result.user?.email;
      toast.success('Welcome back!');
      // Admin auto-redirect to dashboard
      if (email === 'admin@libravault.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Google sign-in failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'reset') {
      if (!form.email) return toast.error('Enter your email');
      try {
        setLoading(true);
        await resetPassword(form.email);
        toast.success('Password reset email sent!');
        setMode('login');
      } catch (err) {
        toast.error('Failed to send reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!form.email || !form.password) return toast.error('Fill all required fields');
    if (mode === 'signup') {
      if (!form.name.trim()) return toast.error('Enter your name');
      if (form.password.length < 6) return toast.error('Password must be 6+ characters');
      if (form.password !== form.confirm) return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
        toast.success('Welcome back!');
        // Admin auto-redirect
        if (form.email === 'admin@libravault.com') {
          navigate('/admin');
          return;
        }
      } else {
        await signupWithEmail(form.email, form.password, form.name);
        toast.success('Account created! Welcome to LibraVault.');
      }
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/email-already-in-use' ? 'Email already registered'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : 'Authentication failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorative books pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: `${20 + Math.random() * 30}px`,
                height: `${80 + Math.random() * 120}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#f59e0b', '#10b981', '#0ea5e9', '#f43f5e', '#a78bfa'][i % 5],
                transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center animate-fade-in">
          <div className="text-8xl mb-6 float-anim">📚</div>
          <h1 className="font-display text-5xl font-bold text-white mb-4 leading-tight">
            LibraVault
          </h1>
          <p className="text-ink-300 text-xl font-light max-w-sm leading-relaxed">
            Your gateway to a world of knowledge. Discover, read, and manage books effortlessly.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            {[['📖', '500+', 'Books'], ['⭐', '4.8', 'Avg Rating'], ['👥', '1K+', 'Readers']].map(([icon, val, label]) => (
              <div key={label}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-white font-bold text-xl font-display">{val}</div>
                <div className="text-ink-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-ink-50">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-5xl">📚</span>
            <h1 className="font-display text-3xl font-bold text-ink-900 mt-2">LibraVault</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-modal p-8 border border-ink-100">
            {/* Mode tabs */}
            {mode !== 'reset' && (
              <div className="flex bg-ink-100 rounded-xl p-1 mb-8">
                {['login', 'signup'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      mode === m
                        ? 'bg-white text-ink-900 shadow-card'
                        : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            )}

            {mode === 'reset' && (
              <div className="mb-6">
                <button onClick={() => setMode('login')} className="flex items-center gap-2 text-ink-500 hover:text-ink-900 text-sm mb-4 transition-colors">
                  ← Back to Sign In
                </button>
                <h2 className="font-display text-2xl font-bold text-ink-900">Reset Password</h2>
                <p className="text-ink-500 text-sm mt-1">We'll send a reset link to your email.</p>
              </div>
            )}

            {/* Google button */}
            {mode !== 'reset' && (
              <>
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-ink-200 rounded-xl text-ink-700 font-medium hover:border-ink-400 hover:bg-ink-50 transition-all duration-200 disabled:opacity-50 mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-ink-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs text-ink-400 uppercase tracking-wider">or</span>
                  </div>
                </div>
              </>
            )}

            {/* Form fields */}
            <div className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors text-lg"
                    >
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-ink-900 placeholder-ink-400"
                  />
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="text-right mt-2">
                <button
                  onClick={() => setMode('reset')}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-ink-900 hover:bg-ink-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-book hover:shadow-book-hover active:translate-y-0.5"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </div>

          <p className="text-center text-ink-500 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
