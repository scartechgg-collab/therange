import { useState } from 'react';
import { motion } from 'framer-motion';
import { adminSignIn, ADMIN_EMAIL, AdminSession } from '../lib/supabase';
import { Logo } from '../components/Logo';

interface AdminLoginPageProps {
  onLogin: (session: AdminSession) => void;
}

export function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { session, error } = await adminSignIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    if (session) onLogin(session);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 24 }}
        className="w-full max-w-md solid-card rounded-3xl p-7 sm:p-10 neon-glow-strong relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-primary/15 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative text-center mb-8">
          <div className="flex justify-center mb-4"><Logo size={62} /></div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
          <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold mt-1">Range Cloud Hosting</p>
        </div>

        <div className="relative mb-6 flex items-center justify-center gap-2 rounded-xl bg-green-500/8 border border-green-500/25 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full status-online" />
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-green-400">
            Live · Secure Connection
          </span>
        </div>

        <form onSubmit={submit} className="relative space-y-5">
          <div>
            <label className="text-[10px] text-white/45 uppercase tracking-widest font-bold block mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/60 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] text-white/45 uppercase tracking-widest font-bold block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3"
            >
              <p className="text-xs text-red-400 font-semibold">{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 rounded-xl text-xs font-black text-white uppercase tracking-[0.15em] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Authenticating…
              </>
            ) : (
              <>🔐 Sign In</>
            )}
          </button>
        </form>

        <p className="relative mt-6 text-center text-[10px] text-white/25 leading-relaxed">
          Restricted area. Only <span className="text-white/45 font-mono">{ADMIN_EMAIL}</span> is authorised.
          <br />All access attempts are logged.
        </p>
      </motion.div>
    </div>
  );
}
