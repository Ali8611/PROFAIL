'use client';

import React, { useEffect, useState } from 'react';
import { Gamepad2, Shield } from 'lucide-react';

interface DiscordCardProps {
  discordId?: string | null;
  username?: string | null;
  avatar?: string | null;
  status?: string;
  activity?: string | null;
}

export default function DiscordCard({
  discordId,
  username = 'aliwasn1',
  avatar,
  status: initialStatus = 'offline',
  activity: initialActivity = null,
}: DiscordCardProps) {
  const [data, setData] = useState<{
    status: string;
    activity: string | null;
    avatarUrl: string | null;
    displayName: string;
    serverName?: string;
  } | null>(null);

  useEffect(() => {
    const targetId = discordId || (username?.toLowerCase() === 'aliwasn1' ? '925438310418112592' : null);

    if (targetId) {
      fetch(`/api/discord/presence?userId=${targetId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData({
              status: json.data.status || 'offline',
              activity: json.data.activity || null,
              avatarUrl: json.data.avatarUrl,
              displayName: json.data.globalName || json.data.username || username || 'ALI WANS',
              serverName: json.data.serverName,
            });
          }
        })
        .catch(() => {});
    }
  }, [discordId, username]);

  const currentStatus = data?.status || initialStatus;
  const currentAvatar = data?.avatarUrl || avatar;
  const currentActivity = data ? data.activity : initialActivity;
  const currentName = data?.displayName || username || 'ALI WANS';

  const statusColor =
    currentStatus === 'online'
      ? 'bg-emerald-500'
      : currentStatus === 'idle'
      ? 'bg-amber-500'
      : currentStatus === 'dnd'
      ? 'bg-rose-500'
      : 'bg-zinc-500';

  return (
    <div className="w-full bg-[#12131f]/80 backdrop-blur-md rounded-2xl border border-[#5865F2]/20 p-3.5 shadow-glass relative overflow-hidden transition-all duration-300 hover:border-[#5865F2]/50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with status indicator */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-[#5865F2]/20 border border-white/10">
              {currentAvatar ? (
                <img src={currentAvatar} alt={currentName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-white bg-[#5865F2]">
                  {currentName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Status dot */}
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${statusColor} border-2 border-[#12131f]`} />
          </div>

          {/* User & Activity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-white truncate">{currentName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5865F2]/30 text-[#8ea1ff] font-medium flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" />
                <span>𝓐𝓵 𝓦𝓐𝓝𝓢</span>
              </span>
            </div>

            {currentActivity ? (
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 truncate">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{currentActivity}</span>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-400 capitalize flex items-center gap-1">
                <span>{currentStatus === 'offline' ? 'غير متصل (Offline)' : currentStatus}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColor} ${currentStatus === 'online' ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    </div>
  );
}
