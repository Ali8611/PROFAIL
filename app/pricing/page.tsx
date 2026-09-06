import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col pt-16 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Your Profile</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Elevate Your Digital Presence
          </h1>
          <p className="text-sm text-zinc-400">
            Choose the plan that fits your style. Unlock video backgrounds, custom themes, and full styling freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE TIER */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starter</span>
                <h3 className="text-2xl font-black text-white">Free Forever</h3>
                <p className="text-xs text-zinc-400 mt-1">Everything you need to build your primary link in bio.</p>
              </div>

              <div className="text-3xl font-black text-white">$0</div>

              <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/10">
                {[
                  'Custom /username URL',
                  'Up to 8 Social Links',
                  'Standard Color & Gradient Backgrounds',
                  'Integrated Music Player',
                  'Spotify & Discord Sync Cards',
                  'Interactive Guestbook',
                  'QR Code Generator',
                  '7-Day Basic Analytics',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs text-center transition-colors block"
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM TIER */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-950/40 via-[#130d2a] to-[#0d091a] border border-purple-500/40 backdrop-blur-xl flex flex-col justify-between space-y-8 shadow-neon relative">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-extrabold text-[10px] tracking-wider uppercase shadow-md">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Premium VIP</span>
                <h3 className="text-2xl font-black text-white">WANS Pro</h3>
                <p className="text-xs text-zinc-400 mt-1">Ultimate power and visual styling for top creators.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$4.99</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200 pt-4 border-t border-white/10">
                {[
                  'Everything in Free, plus:',
                  'Unlimited Social Links & Custom Platforms',
                  'Full Motion Video Backgrounds (MP4 / WebM)',
                  'Custom Profile CSS & Raw Styling Control',
                  '💎 Exclusive Diamond Premium Profile Badge',
                  'Remove "Made with WANS" branding',
                  '30-Day Advanced Analytics & Device Insights',
                  'Early access to new features & VIP support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs text-center shadow-neon-cyan transition-transform hover:scale-[1.01] block"
            >
              Upgrade in Dashboard
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
