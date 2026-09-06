'use client';

import React, { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';

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
  status: initialStatus = 'online',
  activity: initialActivity,
}: DiscordCardProps) {
  const [liveData, setLiveData] = useState<{
    status: string;
    activity: string | null;
    avatarUrl: string | null;
    displayName: string;
  } | null>(null);

  useEffect(() => {
    // If we have a discordId or default to aliwasn1's ID
    const targetId = discordId || (username?.toLowerCase() === 'aliwasn1' ? '925438310418112592' : null);

    if (targetId) {
      // Fetch live presence from Lanyard API
      fetch(`https://api.lanyard.rest/v1/users/${targetId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const data = json.data;
            const discordUser = data.discord_user;
            
            // Build avatar URL
            let liveAvatar = avatar;
            if (discordUser?.avatar) {
              const ext = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
              liveAvatar = `https://cdn.discordapp.com/avatars/${targetId}/${discordUser.avatar}.${ext}?size=256`;
            }

            // Find current game or custom status activity
            const currentActivity = data.activities?.find((a: any) => a.type === 0 || a.type === 4);
            const activityText = currentActivity
              ? currentActivity.type === 4
                ? currentActivity.state
                : currentActivity.name
              : null;

            setLiveData({
              status: data.discord_status || 'offline',
              activity: activityText,
              avatarUrl: liveAvatar || null,
              displayName: discordUser?.global_name || discordUser?.username || username || 'Discord User',
            });
          }
        })
        .catch(() => {
          // Fallback to static
        });
    }
  }, [discordId, username, avatar]);

  const currentStatus = liveData?.status || initialStatus;
  const currentAvatar = liveData?.avatarUrl || avatar;
  const currentActivity = liveData ? liveData.activity : initialActivity;
  const currentName = liveData?.displayName || username || 'aliwasn1';

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
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#5865F2]/30 text-[#8ea1ff] font-medium">
                Discord
              </span>
            </div>

            {currentActivity ? (
              <div className="flex items-center gap-1.5 text-xs text-zinc-300 truncate">
                <Gamepad2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{currentActivity}</span>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-400 capitalize">{currentStatus}</p>
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
