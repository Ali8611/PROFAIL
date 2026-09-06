'use client';

import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface DiscordCardProps {
  username?: string | null;
  avatar?: string | null;
  status?: string;
  activity?: string | null;
}

export default function DiscordCard({
  username = 'WANS_User',
  avatar,
  status = 'online',
  activity = 'Playing GTA V',
}: DiscordCardProps) {
  return (
    <div className="w-full bg-[#1e1f29]/80 backdrop-blur-md rounded-2xl border border-[#5865F2]/20 p-3.5 shadow-glass relative overflow-hidden transition-all duration-300 hover:border-[#5865F2]/40">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with status indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#5865F2]/20 border border-white/10">
              {avatar ? (
                <img src={avatar} alt={username || 'Discord'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-[#5865F2]">
                  D
                </div>
              )}
            </div>
            {/* Status dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1e1f29]" />
          </div>

          {/* User & Activity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-white truncate">{username}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5865F2]/30 text-[#8ea1ff] font-medium">
                Discord
              </span>
            </div>

            {activity ? (
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 truncate">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{activity}</span>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-400">Online & Ready</p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
