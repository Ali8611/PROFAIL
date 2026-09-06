'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: login.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = '/api/auth/discord';
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-black font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-cyan-500/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-glass space-y-6 relative z-10">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-[#0d0d18] rounded-[10px] flex items-center justify-center font-black text-white text-lg">
                W
              </div>
            </div>
            <span className="text-2xl font-black tracking-widest text-white">
              WANS<span className="text-purple-500">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-zinc-400">Log in to manage your cyber identity</p>
        </div>

        {/* Discord OAuth Button */}
        <button
          type="button"
          onClick={handleDiscordLogin}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-xs transition-transform hover:scale-[1.01] shadow-md"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
          </svg>
          <span>Continue with Discord</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Username or Email</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. WANS or user@example.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <span className="text-[11px] text-zinc-500">Default seed: Password123!</span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-neon-cyan transition-transform hover:scale-[1.01] disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
