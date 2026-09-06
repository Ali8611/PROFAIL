'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileCard, { ProfileCardData } from '@/components/ProfileCard';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Music,
  BarChart3,
  Layers,
  CheckCircle,
  Zap,
  Globe,
  Share2,
} from 'lucide-react';

const DEMO_PROFILE: ProfileCardData = {
  id: 'demo-1',
  userId: 'user-demo',
  username: 'WANS',
  displayName: 'WANS',
  bio: 'Lead Architect & Cyber Creator.\nBuilding the future of gaming profiles and decentralized identity.',
  location: 'Neo Tokyo / Cyber City',
  pronouns: 'he/him',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
  backgroundType: 'GRADIENT',
  backgroundColor: '#0c071a',
  accentColor: '#00f0ff',
  textColor: '#ffffff',
  cardColor: 'rgba(18, 14, 32, 0.85)',
  backgroundBlur: 4,
  overlayOpacity: 0.4,
  fontFamily: 'Inter',
  effectGlow: true,
  effectFloat: true,
  themeId: 'cyber',
  isGuestbookEnabled: false,
  musicAutoplay: false,
  musicLoop: true,
  showSpotify: true,
  showDiscord: true,
  discordActivity: 'Building WANS 2.0 with Next.js',
  spotifyTrack: 'Resonance',
  spotifyArtist: 'HOME',
  spotifyCover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
  spotifyUrl: 'https://open.spotify.com',
  badges: [
    { slug: 'owner', name: 'Owner', icon: '👑', color: '#ffd166' },
    { slug: 'developer', name: 'Developer', icon: '🛠', color: '#00f0ff' },
    { slug: 'verified', name: 'Verified', icon: '✓', color: '#3a86ff' },
    { slug: 'premium', name: 'Premium', icon: '💎', color: '#ff007f' },
  ],
  links: [
    { id: '1', platform: 'GitHub', label: 'GitHub Repository', url: 'https://github.com', style: 'neon' },
    { id: '2', platform: 'Discord', label: 'WANS Official Discord', url: 'https://discord.gg', style: 'glass' },
    { id: '3', platform: 'X', label: 'Follow on X', url: 'https://x.com', style: 'filled' },
  ],
  musicTrack: {
    id: 'm1',
    title: 'Synthwave Odyssey',
    artist: 'Cyber Dreamers',
    audioUrl: 'https://cdn.freesound.org/previews/573/573539_11861866-lq.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
  },
};

export default function HomePage() {
  const [activeTheme, setActiveTheme] = useState('cyan');
  const [demoState, setDemoState] = useState(DEMO_PROFILE);

  const handleThemeSwitch = (accent: string, bg: string, themeName: string) => {
    setActiveTheme(themeName);
    setDemoState({
      ...demoState,
      accentColor: accent,
      backgroundColor: bg,
    });
  };

  return (
    <div className="flex-1 flex flex-col pt-16 bg-[#09090f] text-white selection:bg-cyan-500 selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6">
        {/* Glow blobs background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-cyan-500/20 to-pink-500/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-400 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              <span>Next-Gen Cyber & Gaming Profiles</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Your Identity. <br />
                Your Profile. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                  Your WANS.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
                Create your own personal profile, customize every detail, connect your social
                accounts, stream music, and share your identity with one simple link.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-neon-cyan hover:scale-[1.02] transition-all duration-200"
              >
                <span>Create Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
              >
                <span>Explore Profiles</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 text-zinc-400 hover:text-white font-medium text-sm transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-zinc-500 font-medium">Customizable</p>
              </div>
              <div>
                <p className="text-2xl font-black text-cyan-400">10+</p>
                <p className="text-xs text-zinc-500 font-medium">Cyber Themes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-purple-400">&lt; 0.1s</p>
                <p className="text-xs text-zinc-500 font-medium">Load Time</p>
              </div>
            </div>
          </div>

          {/* Right Hero Demo Profile Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Theme switcher bar */}
            <div className="mb-4 flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-xs text-zinc-400 px-2 font-medium">Interactive Demo:</span>
              <button
                onClick={() => handleThemeSwitch('#00f0ff', '#0c071a', 'cyan')}
                className={`w-6 h-6 rounded-full bg-cyan-400 border-2 transition-transform ${
                  activeTheme === 'cyan' ? 'scale-110 border-white shadow-neon-cyan' : 'border-transparent opacity-60'
                }`}
                title="Cyber Cyan"
              />
              <button
                onClick={() => handleThemeSwitch('#9d4edd', '#120424', 'purple')}
                className={`w-6 h-6 rounded-full bg-purple-500 border-2 transition-transform ${
                  activeTheme === 'purple' ? 'scale-110 border-white shadow-neon' : 'border-transparent opacity-60'
                }`}
                title="Royal Purple"
              />
              <button
                onClick={() => handleThemeSwitch('#ff0055', '#24040e', 'crimson')}
                className={`w-6 h-6 rounded-full bg-rose-500 border-2 transition-transform ${
                  activeTheme === 'crimson' ? 'scale-110 border-white shadow-neon-pink' : 'border-transparent opacity-60'
                }`}
                title="Crimson Blood"
              />
              <button
                onClick={() => handleThemeSwitch('#10b981', '#051f15', 'emerald')}
                className={`w-6 h-6 rounded-full bg-emerald-400 border-2 transition-transform ${
                  activeTheme === 'emerald' ? 'scale-110 border-white shadow-neon-cyan' : 'border-transparent opacity-60'
                }`}
                title="Emerald Matrix"
              />
            </div>

            {/* Profile Mock Card */}
            <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
              <ProfileCard profile={demoState} isLivePreview={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Marquee */}
      <section className="py-12 border-y border-white/10 bg-[#0c0c16]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Popular Community Profiles</h3>
              <p className="text-xs text-zinc-400">Discover creators and gamers rocking WANS</p>
            </div>
            <Link
              href="/explore"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View all profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { username: 'HACKER', role: 'Security Researcher', badges: ['🛠 Dev', '⭐ Early'], color: '#10b981', avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=200&fit=crop' },
              { username: 'WANS', role: 'Founder & Architect', badges: ['👑 Owner', '💎 Pro'], color: '#00f0ff', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' },
              { username: 'GAMER', role: 'Pro Streamer', badges: ['🎮 Gamer', '🔥 Popular'], color: '#9d4edd', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop' },
              { username: 'DEVELOPER', role: 'Open Source', badges: ['✓ Verified', '🛠 Dev'], color: '#38bdf8', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
            ].map((p) => (
              <Link
                key={p.username}
                href={`/${p.username}`}
                className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center space-y-3 shadow-glass"
              >
                <div
                  className="w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${p.color}, transparent)` }}
                >
                  <img src={p.avatar} alt={p.username} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    /{p.username}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">{p.role}</p>
                </div>
                <div className="flex gap-1">
                  {p.badges.map((b) => (
                    <span key={b} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-semibold">
                      {b}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Engineered for Creators & Gamers
          </h2>
          <p className="text-sm text-zinc-400">
            Everything you need to express your personality, showcase your achievements, and track your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Theme Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Switch between 10+ custom themes including Cyberpunk Neon, Obsidian Dark, Royal Nebula, and Frosted Glass, or craft your own color palette.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Profile Music & Spotify</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Attach background tunes with a full HTML5 audio player or showcase what you are currently jamming to via real-time Spotify cards.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/5 border border-white/10 space-y-4 hover:border-pink-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Real Privacy Analytics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track page impressions, mobile vs. desktop visitor ratios, top referrers, and per-link click rates in real time without tracking invasive data.
            </p>
          </div>
        </div>
      </section>

      {/* Ready CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-white/15 p-8 sm:p-14 text-center space-y-6 backdrop-blur-xl shadow-neon">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Claim Your Unique Handle Today
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Join thousands of gamers, developers, and creators who represent their identity on WANS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 transition-transform hover:scale-105 shadow-lg"
            >
              Get Started Now — It's Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
