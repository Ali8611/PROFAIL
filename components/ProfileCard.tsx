'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  QrCode,
  Flag,
  CheckCircle,
} from 'lucide-react';
import SocialLinksList from './SocialLinksList';
import MusicPlayer from './MusicPlayer';
import SpotifyCard from './SpotifyCard';
import DiscordCard from './DiscordCard';
import GuestbookSection from './GuestbookSection';
import QrModal from './QrModal';
import ReportModal from './ReportModal';

export interface ProfileCardData {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string | null;
  location?: string | null;
  pronouns?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  backgroundType: string;
  backgroundUrl?: string | null;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  cardColor: string;
  backgroundBlur: number;
  overlayOpacity: number;
  fontFamily: string;
  effectGlow: boolean;
  effectFloat: boolean;
  themeId?: string | null;
  customCss?: string | null;
  isGuestbookEnabled: boolean;
  musicAutoplay: boolean;
  musicLoop: boolean;
  showSpotify: boolean;
  showDiscord: boolean;
  discordActivity?: string | null;
  spotifyTrack?: string | null;
  spotifyArtist?: string | null;
  spotifyCover?: string | null;
  spotifyUrl?: string | null;
  isPremium?: boolean;
  role?: string;
  createdAt?: string | Date;
  links?: any[];
  badges?: any[];
  musicTrack?: any | null;
  guestbook?: any[];
}

interface ProfileCardProps {
  profile: ProfileCardData;
  isOwner?: boolean;
  isLivePreview?: boolean;
}

export default function ProfileCard({
  profile,
  isOwner = false,
  isLivePreview = false,
}: ProfileCardProps) {
  const [liveAvatar, setLiveAvatar] = useState<string | null>(profile.avatarUrl || null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${profile.username}`
      : `https://wans.gg/${profile.username}`;

  const hasBadges = profile.badges && profile.badges.length > 0;
  const isOwnerBadge = profile.badges?.some(
    (b: any) => b.badge?.slug === 'owner' || b.slug === 'owner'
  );
  const isVerifiedBadge = profile.badges?.some(
    (b: any) => b.badge?.slug === 'verified' || b.slug === 'verified'
  );

  useEffect(() => {
    if (profile.avatarUrl) {
      setLiveAvatar(profile.avatarUrl);
    }
  }, [profile.avatarUrl]);

  useEffect(() => {
    const targetDiscordId = (profile as any).user?.discordId || (profile.username?.toLowerCase() === 'aliwasn1' ? '925438310418112592' : null);
    if (targetDiscordId) {
      fetch(`https://api.lanyard.rest/v1/users/${targetDiscordId}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data?.discord_user?.avatar) {
            const ext = json.data.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
            setLiveAvatar(`https://cdn.discordapp.com/avatars/${targetDiscordId}/${json.data.discord_user.avatar}.${ext}?size=512`);
          }
        })
        .catch(() => {});
    }
  }, [profile.username]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden font-sans">
      {/* Background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {profile.backgroundType === 'VIDEO' && profile.backgroundUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={profile.backgroundUrl}
            className="w-full h-full object-cover"
            style={{ filter: `blur(${profile.backgroundBlur || 0}px)` }}
          />
        ) : profile.backgroundType === 'IMAGE' && profile.backgroundUrl ? (
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${profile.backgroundUrl})`,
              filter: `blur(${profile.backgroundBlur || 0}px)`,
            }}
          />
        ) : profile.backgroundType === 'GRADIENT' ? (
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(circle at 50% 10%, ${profile.accentColor}33 0%, ${profile.backgroundColor} 75%)`,
            }}
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: profile.backgroundColor }} />
        )}

        {/* Overlay opacity layer */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: profile.overlayOpacity ?? 0.4 }}
        />
      </div>

      {/* Profile Main Card */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
          profile.effectFloat ? 'animate-float' : ''
        }`}
        style={{
          backgroundColor: profile.cardColor || 'rgba(18, 18, 28, 0.85)',
          borderColor: profile.effectGlow ? `${profile.accentColor}40` : 'rgba(255, 255, 255, 0.1)',
          boxShadow: profile.effectGlow
            ? `0 0 35px -8px ${profile.accentColor}44, 0 8px 32px 0 rgba(0, 0, 0, 0.37)`
            : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          color: profile.textColor || '#ffffff',
          fontFamily: profile.fontFamily || 'Inter',
        }}
      >
        {/* Top bar tools (QR & Report) */}
        {!isLivePreview && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
            <button
              onClick={() => setShowQrModal(true)}
              title="View QR Code"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              title="Report Profile"
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-400 border border-white/10 transition-colors"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Identity Header */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          {/* Avatar Container with Glow & Verification */}
          <div className="relative group">
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 transition-transform duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${profile.accentColor}, #ffffff22)`,
                boxShadow: profile.effectGlow ? `0 0 25px -4px ${profile.accentColor}` : 'none',
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-black/60">
                {liveAvatar || profile.avatarUrl ? (
                  <img
                    src={liveAvatar || profile.avatarUrl!}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center font-black text-3xl"
                    style={{ color: profile.accentColor }}
                  >
                    {profile.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Badges icons on avatar */}
            {isVerifiedBadge && (
              <div
                className="absolute bottom-1 right-1 p-1.5 rounded-full bg-cyan-500 text-black shadow-lg"
                title="Verified Identity"
              >
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            {isOwnerBadge && (
              <div
                className="absolute -top-1 right-2 p-1.5 rounded-full bg-amber-400 text-black shadow-lg"
                title="Owner"
              >
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Names and Pronouns */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-white">
                {profile.displayName}
              </h1>
              {profile.pronouns && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-medium">
                  {profile.pronouns}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-zinc-400">@{profile.username}</p>
          </div>

          {/* Badges List */}
          {hasBadges && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {profile.badges?.map((ub: any) => {
                const badge = ub.badge || ub;
                return (
                  <div
                    key={badge.id || badge.slug}
                    title={badge.description}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: `${badge.color || profile.accentColor}22`,
                      color: badge.color || profile.accentColor,
                      borderColor: `${badge.color || profile.accentColor}44`,
                    }}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed whitespace-pre-line px-2">
              {profile.bio}
            </p>
          )}

          {/* Location & Join Date */}
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Joined{' '}
                {new Date(profile.createdAt || Date.now()).toLocaleDateString(undefined, {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Widgets Section */}
        <div className="mt-6 space-y-3">
          {/* Music Track */}
          {profile.musicTrack && !profile.musicTrack.isHidden && (
            <MusicPlayer
              title={profile.musicTrack.title}
              artist={profile.musicTrack.artist}
              audioUrl={profile.musicTrack.audioUrl}
              coverUrl={profile.musicTrack.coverUrl}
              autoplay={profile.musicAutoplay}
              loop={profile.musicLoop}
              accentColor={profile.accentColor}
            />
          )}

          {/* Spotify Widget */}
          {profile.showSpotify && (
            <SpotifyCard
              discordId={(profile as any).user?.discordId || (profile.username?.toLowerCase() === 'aliwasn1' ? '925438310418112592' : null)}
              username={profile.username}
              track={profile.spotifyTrack}
              artist={profile.spotifyArtist}
              cover={profile.spotifyCover}
              url={profile.spotifyUrl}
            />
          )}

          {/* Discord Presence Widget */}
          {profile.showDiscord && (
            <DiscordCard
              discordId={(profile as any).user?.discordId || (profile.username?.toLowerCase() === 'aliwasn1' ? '925438310418112592' : null)}
              username={profile.username}
              avatar={liveAvatar || profile.avatarUrl}
              activity={profile.discordActivity}
            />
          )}

          {/* Social Links List */}
          <div className="pt-2">
            <SocialLinksList links={profile.links || []} accentColor={profile.accentColor} />
          </div>

          {/* Guestbook Section */}
          {profile.isGuestbookEnabled && !isLivePreview && (
            <div className="pt-4 border-t border-white/10">
              <GuestbookSection
                profileId={profile.id}
                initialComments={profile.guestbook || []}
                isOwner={isOwner}
                accentColor={profile.accentColor}
              />
            </div>
          )}
        </div>

        {/* Footer Brand watermark */}
        {(!profile.isPremium || !profile.customCss?.includes('hide-wans-brand')) && (
          <div className="mt-8 pt-4 border-t border-white/5 text-center">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-[8px] font-bold text-white">
                W
              </div>
              <span>WANS Identity</span>
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        username={profile.username}
        url={profileUrl}
        accentColor={profile.accentColor}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="PROFILE"
        targetId={profile.id}
        profileId={profile.id}
      />
    </div>
  );
}
