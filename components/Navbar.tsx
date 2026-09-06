'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Shield, Sparkles, User as UserIcon, LogOut, LayoutDashboard, Compass } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; role: string; isPremium: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-neon">
            <div className="w-full h-full bg-[#0d0d18] rounded-[10px] flex items-center justify-center font-black text-lg text-white tracking-wider">
              W
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-widest text-white group-hover:text-cyan-400 transition-colors">
            WANS<span className="text-purple-500">.</span>
          </span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
          <Link href="/explore" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/pricing" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Premium
          </Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="hover:text-red-400 text-red-400/90 transition-colors flex items-center gap-1.5 font-semibold">
              <Shield className="w-4 h-4 text-red-400" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right CTA / User controls */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                href={`/${user.username}`}
                className="hidden sm:inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 transition-colors"
              >
                /{user.username}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-neon transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-neon-cyan transition-all duration-200"
              >
                Create Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
