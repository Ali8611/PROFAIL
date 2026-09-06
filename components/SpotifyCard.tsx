'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SpotifyCardProps {
  track?: string | null;
  artist?: string | null;
  cover?: string | null;
  url?: string | null;
}

export default function SpotifyCard({
  track = 'Blinding Lights',
  artist = 'The Weeknd',
  cover = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
  url = 'https://open.spotify.com',
}: SpotifyCardProps) {
  return (
    <div className="w-full bg-[#121212]/90 backdrop-blur-md rounded-2xl border border-emerald-500/20 p-3.5 shadow-glass relative overflow-hidden transition-all duration-300 hover:border-emerald-500/40">
      {/* Spotify Green Accent Glow */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#1db954]/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Cover */}
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 relative">
            <img
              src={cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop'}
              alt={track || 'Spotify Track'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <svg className="w-3.5 h-3.5 fill-[#1db954]" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                Listening to Spotify
              </span>
            </div>
            <h4 className="text-xs font-bold text-white truncate">{track}</h4>
            <p className="text-[11px] text-zinc-400 truncate">{artist}</p>
          </div>
        </div>

        {/* Action button */}
        <a
          href={url || 'https://open.spotify.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#1db954]/20 hover:bg-[#1db954]/30 text-emerald-400 border border-emerald-500/30 transition-all"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Animated equalizer bars */}
      <div className="flex items-end gap-1 mt-2.5 h-2 px-1">
        <div className="w-1 bg-[#1db954] rounded-full h-full animate-[pulse_1s_ease-in-out_infinite]" />
        <div className="w-1 bg-[#1db954] rounded-full h-1/2 animate-[pulse_1.4s_ease-in-out_infinite]" />
        <div className="w-1 bg-[#1db954] rounded-full h-3/4 animate-[pulse_0.8s_ease-in-out_infinite]" />
        <div className="w-1 bg-[#1db954] rounded-full h-2/3 animate-[pulse_1.2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
