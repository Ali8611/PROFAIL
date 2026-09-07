'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileCard, { ProfileCardData } from '@/components/ProfileCard';
import {
  LayoutDashboard,
  User,
  Link2,
  Palette,
  Music,
  Award,
  MessageSquare,
  BarChart3,
  Settings,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Check,
  AlertCircle,
  Eye,
  MousePointer,
  Sparkles,
  Upload,
  Pin,
  MoveUp,
  MoveDown,
  Monitor,
  Smartphone,
  Shield,
  LogOut,
} from 'lucide-react';
import { THEME_PRESETS } from '@/lib/theme-engine';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'links' | 'appearance' | 'music' | 'badges' | 'guestbook' | 'analytics' | 'account'>('editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ text: string; error?: boolean } | null>(null);

  // User and Profile Data
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [guestbook, setGuestbook] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Form states for adding a new link
  const [newLink, setNewLink] = useState({
    platform: 'GitHub',
    label: '',
    url: '',
    style: 'neon',
  });

  // Music edit state
  const [musicState, setMusicState] = useState({
    title: '',
    artist: '',
    audioUrl: '',
    coverUrl: '',
    isHidden: false,
    autoplay: false,
    loop: true,
  });

  // Uploading states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setProfile(data.user.profile);
      setLinks(data.user.profile?.links || []);
      setBadges(data.user.badges || []);

      if (data.user.profile?.musicTrack) {
        setMusicState({
          title: data.user.profile.musicTrack.title || '',
          artist: data.user.profile.musicTrack.artist || '',
          audioUrl: data.user.profile.musicTrack.audioUrl || '',
          coverUrl: data.user.profile.musicTrack.coverUrl || '',
          isHidden: data.user.profile.musicTrack.isHidden || false,
          autoplay: data.user.profile.musicAutoplay || false,
          loop: data.user.profile.musicLoop ?? true,
        });
      }

      // Fetch public profile data to populate guestbook
      if (data.user.username) {
        const pRes = await fetch(`/api/profile/${data.user.username}`);
        if (pRes.ok) {
          const pData = await pRes.json();
          setGuestbook(pData.profile.profile.guestbook || []);
        }
      }

      // Fetch analytics
      if (data.user.profile?.id) {
        // Mock / aggregate endpoint or direct calculation
        const aRes = await fetch(`/api/profile/${data.user.username}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          // Set sample/real metrics
          setAnalytics({
            totalViews: aData.profile?.profile?.views?.length || 12,
            todayViews: 5,
            weekViews: 28,
            linkClicks: data.user.profile.links.reduce((acc: number, l: any) => acc + (l.clickCount || 0), 0),
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Save profile updates
  const handleSaveProfile = async (customPayload?: any) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const rawPayload = customPayload || profile;
      // Sanitize null values to empty strings or defaults
      const payload: any = {};
      for (const [key, value] of Object.entries(rawPayload)) {
        if (value === null) {
          payload[key] = '';
        } else {
          payload[key] = value;
        }
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveStatus({ text: data.error || 'فشل حفظ التعديلات', error: true });
      } else {
        setProfile(data.profile);
        setSaveStatus({ text: 'تم حفظ التعديلات بنجاح! ✅' });
        setTimeout(() => setSaveStatus(null), 3500);
      }
    } catch (err) {
      setSaveStatus({ text: 'Network error', error: true });
    } finally {
      setSaving(false);
    }
  };

  // Add Link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.label || !newLink.url) return;
    try {
      const res = await fetch('/api/profile/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });
      const data = await res.json();
      if (res.ok) {
        setLinks([...links, data.link]);
        setNewLink({ platform: 'GitHub', label: '', url: '', style: 'neon' });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Link
  const handleDeleteLink = async (id: string) => {
    if (!confirm('Remove this link?')) return;
    try {
      const res = await fetch(`/api/profile/links?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks(links.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reorder Link
  const handleMoveLink = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;

    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    const reorderPayload = newLinks.map((l, i) => ({ id: l.id, order: i }));
    setLinks(newLinks);

    await fetch('/api/profile/links', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reorder: reorderPayload }),
    });
  };

  // Save Music Track
  const handleSaveMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musicState),
      });
      // also update autoplay and loop on profile
      await handleSaveProfile({
        ...profile,
        musicAutoplay: musicState.autoplay,
        musicLoop: musicState.loop,
      });
      if (res.ok) {
        alert('تم حفظ إعدادات الموسيقى بنجاح! ✅');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الموسيقى');
    }
  };

  // Toggle Badge
  const handleToggleBadge = async (badgeId: string, currentVis: boolean) => {
    try {
      const res = await fetch('/api/profile/badges', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId, isVisible: !currentVis }),
      });
      if (res.ok) {
        setBadges(
          badges.map((b) => (b.badgeId === badgeId ? { ...b, isVisible: !currentVis } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'IMAGE' | 'AUDIO' | 'VIDEO', field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'avatarUrl') setUploadingAvatar(true);
    if (field === 'backgroundUrl') setUploadingBg(true);
    if (field === 'audioUrl') setUploadingMusic(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Upload failed');
      } else {
        if (field === 'avatarUrl') {
          const updated = { ...profile, avatarUrl: data.url };
          setProfile(updated);
          handleSaveProfile(updated);
        } else if (field === 'backgroundUrl') {
          const updated = { ...profile, backgroundUrl: data.url };
          setProfile(updated);
          handleSaveProfile(updated);
        } else if (field === 'audioUrl') {
          setMusicState({ ...musicState, audioUrl: data.url });
        }
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploadingAvatar(false);
      setUploadingBg(false);
      setUploadingMusic(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold">Loading your WANS studio...</span>
        </div>
      </div>
    );
  }

  // Live preview combined object
  const previewData: ProfileCardData = {
    ...profile,
    username: user.username,
    role: user.role,
    isPremium: user.isPremium,
    badges: badges.filter((b) => b.isVisible),
    links,
    musicTrack: musicState.audioUrl ? musicState : null,
    isMusicHidden: musicState.isHidden,
    musicAutoplay: musicState.autoplay,
    musicLoop: musicState.loop,
    guestbook,
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top App Header */}
      <header className="h-16 border-b border-white/10 bg-[#0d0d18] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-[#0d0d18] rounded-[6px] flex items-center justify-center font-black text-white text-sm">
                W
              </div>
            </div>
            <span className="text-lg font-black tracking-wider text-white">WANS</span>
          </Link>

          <span className="text-zinc-600">/</span>

          <Link
            href={`/${user.username}`}
            target="_blank"
            className="text-xs font-semibold text-zinc-300 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <span>/{user.username}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span
              className={`text-xs ${
                saveStatus.error ? 'text-rose-400' : 'text-emerald-400'
              } flex items-center gap-1 font-semibold animate-in fade-in`}
            >
              <Check className="w-3.5 h-3.5" />
              {saveStatus.text}
            </span>
          )}

          <button
            onClick={() => handleSaveProfile()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-neon-cyan transition-transform hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout (3 columns on desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* COLUMN 1: Navigation Sidebar */}
        <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0b0b14] p-4 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
          {[
            { id: 'overview', label: '📊 نظرة عامة', icon: LayoutDashboard },
            { id: 'editor', label: '👤 تعديل البروفايل', icon: User },
            { id: 'links', label: '🔗 الروابط الاجتماعية', icon: Link2 },
            { id: 'appearance', label: '🎨 المظهر والثيمات', icon: Palette },
            { id: 'music', label: '🎵 مشغل الموسيقى', icon: Music },
            { id: 'badges', label: '🏆 الشارات والبادجات', icon: Award },
            { id: 'guestbook', label: '💬 سجل الزوار', icon: MessageSquare },
            { id: 'analytics', label: '📈 التحليلات والزيارات', icon: BarChart3 },
            { id: 'account', label: '⚙️ إعدادات الحساب', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="hidden lg:block mt-auto pt-6 border-t border-white/5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-950/30 to-indigo-950/30 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">
                  {user.isPremium ? 'عضوية VIP مميزة 💎' : 'الحساب المجاني'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {user.isPremium ? 'جميع المميزات مفتوحة بدون أي قيود.' : 'قم بالترقية للحصول على ثيمات الفيديو والأكواد المخصصة.'}
              </p>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: Tab Settings Panel */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-3xl space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Overview</h2>
                <p className="text-xs text-zinc-400">Monitor engagement and profile performance</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs">Total Views</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{analytics?.totalViews || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs">Link Clicks</span>
                    <MousePointer className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{analytics?.linkClicks || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs">Active Links</span>
                    <Link2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{links.length}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs">Badges</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-white">{badges.length}</p>
                </div>
              </div>

              {/* Profile Completion Checklist */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white">Profile Checklist</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>Custom Avatar</span>
                    <span className={profile.avatarUrl ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {profile.avatarUrl ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>Add Social Links</span>
                    <span className={links.length > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {links.length > 0 ? `${links.length} Links Active` : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span>Set Profile Music</span>
                    <span className={musicState.audioUrl ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {musicState.audioUrl ? 'Music Set' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Identity & Profile Info</h2>
                <p className="text-xs text-zinc-400">Customize how visitors view your identity</p>
              </div>

              {/* Avatar Upload */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <label className="text-xs font-semibold text-zinc-300">Profile Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-black/50 border border-white/20 flex-shrink-0">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-cyan-400">
                        {profile.displayName?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'IMAGE', 'avatarUrl')}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingAvatar ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <p className="text-[11px] text-zinc-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-medium text-zinc-400">Or Image URL</label>
                  <input
                    type="url"
                    value={profile.avatarUrl || ''}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    placeholder="https://example.com/avatar.png"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName || ''}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Pronouns</label>
                  <input
                    type="text"
                    value={profile.pronouns || ''}
                    placeholder="e.g. he/him, they/them"
                    onChange={(e) => setProfile({ ...profile, pronouns: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    placeholder="e.g. Neo Tokyo, Global, Orbit"
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio || ''}
                    placeholder="Write something memorable about yourself..."
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Integrations (Spotify & Discord Activity) */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Integrations & Status</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Show Discord Activity</p>
                      <p className="text-[11px] text-zinc-400">Display current game or custom status</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.showDiscord}
                      onChange={(e) => setProfile({ ...profile, showDiscord: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400"
                    />
                  </div>

                  {profile.showDiscord && (
                    <input
                      type="text"
                      placeholder="e.g. Playing GTA V, Coding in VS Code"
                      value={profile.discordActivity || ''}
                      onChange={(e) => setProfile({ ...profile, discordActivity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    />
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                      <p className="text-xs font-semibold text-white">Show Spotify Listening Card</p>
                      <p className="text-[11px] text-zinc-400">Display current or featured track</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.showSpotify}
                      onChange={(e) => setProfile({ ...profile, showSpotify: e.target.checked })}
                      className="w-4 h-4 accent-emerald-400"
                    />
                  </div>

                  {profile.showSpotify && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Track name"
                        value={profile.spotifyTrack || ''}
                        onChange={(e) => setProfile({ ...profile, spotifyTrack: e.target.value })}
                        className="px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Artist"
                        value={profile.spotifyArtist || ''}
                        onChange={(e) => setProfile({ ...profile, spotifyArtist: e.target.value })}
                        className="px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Social Links</h2>
                <p className="text-xs text-zinc-400">Manage, style, and reorder links on your profile</p>
              </div>

              {/* Add New Link Form */}
              <form onSubmit={handleAddLink} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Add Social Link</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Platform</label>
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white"
                    >
                      {['GitHub', 'Discord', 'X', 'YouTube', 'Twitch', 'Instagram', 'TikTok', 'Steam', 'Telegram', 'Website', 'Custom'].map(
                        (p) => (
                          <option key={p} value={p} className="bg-zinc-900">
                            {p}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Style</label>
                    <select
                      value={newLink.style}
                      onChange={(e) => setNewLink({ ...newLink, style: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white"
                    >
                      <option value="neon" className="bg-zinc-900">Neon Glow</option>
                      <option value="glass" className="bg-zinc-900">Frosted Glass</option>
                      <option value="filled" className="bg-zinc-900">Filled</option>
                      <option value="outline" className="bg-zinc-900">Outline</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Button Label</label>
                    <input
                      type="text"
                      placeholder="e.g. My GitHub Repos"
                      value={newLink.label}
                      onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300">Target URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
                >
                  Add Link
                </button>
              </form>

              {/* Links List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Links</h3>
                {links.map((link, idx) => (
                  <div
                    key={link.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{link.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-400 font-semibold uppercase">
                          {link.platform}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{link.url}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{link.clickCount || 0} clicks recorded</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveLink(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveLink(idx, 'down')}
                        disabled={idx === links.length - 1}
                        className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: APPEARANCE & THEMES */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Appearance & Theme Engine</h2>
                <p className="text-xs text-zinc-400">Change colors, visual effects, and backgrounds</p>
              </div>

              {/* Theme Presets */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Themes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((t) => {
                    const isSelected = profile.themeId === t.slug;
                    return (
                      <button
                        key={t.slug}
                        onClick={() => {
                          setProfile({
                            ...profile,
                            themeId: t.slug,
                            accentColor: t.accent,
                            backgroundColor: t.bgType === 'COLOR' ? t.background : profile.backgroundColor,
                            cardColor: t.cardBg,
                            backgroundType: t.bgType,
                          });
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-neon-cyan'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.accent }} />
                          <span className="text-xs font-bold text-white truncate">{t.name}</span>
                        </div>
                        {t.isPremium && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                            VIP
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Custom Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1.5">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={profile.accentColor || '#00f0ff'}
                        onChange={(e) => setProfile({ ...profile, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={profile.accentColor || '#00f0ff'}
                        onChange={(e) => setProfile({ ...profile, accentColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs rounded bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1.5">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={profile.backgroundColor || '#0a0a0f'}
                        onChange={(e) => setProfile({ ...profile, backgroundColor: e.target.value })}
                        className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={profile.backgroundColor || '#0a0a0f'}
                        onChange={(e) => setProfile({ ...profile, backgroundColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs rounded bg-black/50 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-400 block mb-1.5">Background Type</label>
                    <select
                      value={profile.backgroundType}
                      onChange={(e) => setProfile({ ...profile, backgroundType: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/50 border border-white/10 text-white"
                    >
                      <option value="COLOR" className="bg-zinc-900">Solid Color</option>
                      <option value="GRADIENT" className="bg-zinc-900">Gradient</option>
                      <option value="IMAGE" className="bg-zinc-900">Image</option>
                      <option value="VIDEO" className="bg-zinc-900">Video (Premium)</option>
                    </select>
                  </div>
                </div>

                {/* Background Image / Video Upload */}
                {['IMAGE', 'VIDEO'].includes(profile.backgroundType) && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Background Media</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        id="bg-upload"
                        accept={profile.backgroundType === 'VIDEO' ? 'video/*' : 'image/*'}
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            profile.backgroundType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
                            'backgroundUrl'
                          )
                        }
                        className="hidden"
                      />
                      <label
                        htmlFor="bg-upload"
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer transition-colors inline-flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingBg ? 'Uploading media...' : 'Upload Background'}</span>
                      </label>
                      <input
                        type="url"
                        placeholder={
                          profile.backgroundType === 'VIDEO'
                            ? 'YouTube URL (e.g. https://youtu.be/...) or direct MP4/WebM'
                            : 'Or enter direct image URL'
                        }
                        value={profile.backgroundUrl || ''}
                        onChange={(e) => setProfile({ ...profile, backgroundUrl: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500"
                      />
                    </div>
                    {profile.backgroundType === 'VIDEO' && (
                      <p className="text-[11px] text-zinc-400 pt-1">
                        🎬 يدعم خلفيات فيديو يوتيوب المباشرة (مثل <span className="text-cyan-400">https://youtu.be/...</span>) أو ملفات الفيديو المرفوعة MP4.
                      </p>
                    )}
                  </div>
                )}

                {/* Effects (Blur, Opacity, Float, Glow) */}
                <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-400">Background Blur: {profile.backgroundBlur}px</label>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={profile.backgroundBlur}
                      onChange={(e) => setProfile({ ...profile, backgroundBlur: Number(e.target.value) })}
                      className="w-full mt-1.5 accent-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-400">
                      Overlay Darkening: {Math.round((profile.overlayOpacity || 0.4) * 100)}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={profile.overlayOpacity}
                      onChange={(e) => setProfile({ ...profile, overlayOpacity: Number(e.target.value) })}
                      className="w-full mt-1.5 accent-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="glow-check"
                      checked={profile.effectGlow}
                      onChange={(e) => setProfile({ ...profile, effectGlow: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400"
                    />
                    <label htmlFor="glow-check" className="text-xs font-semibold text-white">
                      Neon Edge Glow
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="float-check"
                      checked={profile.effectFloat}
                      onChange={(e) => setProfile({ ...profile, effectFloat: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400"
                    />
                    <label htmlFor="float-check" className="text-xs font-semibold text-white">
                      Floating Animation
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Profile Music Player</h2>
                <p className="text-xs text-zinc-400">Add an MP3 background audio player for visitors</p>
              </div>

              <form onSubmit={handleSaveMusic} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300">Track Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Nightcall"
                      value={musicState.title}
                      onChange={(e) => setMusicState({ ...musicState, title: e.target.value })}
                      required
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300">Artist Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kavinsky"
                      value={musicState.artist}
                      onChange={(e) => setMusicState({ ...musicState, artist: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  {/* Audio Upload */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-300">Audio File / URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="file"
                        id="music-upload"
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e, 'AUDIO', 'audioUrl')}
                        className="hidden"
                      />
                      <label
                        htmlFor="music-upload"
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer transition-colors inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMusic ? 'Uploading...' : 'Upload MP3'}</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://...mp3"
                        value={musicState.audioUrl}
                        onChange={(e) => setMusicState({ ...musicState, audioUrl: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300">Cover Artwork URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://...cover.jpg"
                      value={musicState.coverUrl}
                      onChange={(e) => setMusicState({ ...musicState, coverUrl: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  {/* Music Options */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition-colors">
                      <input
                        type="checkbox"
                        id="hide-player-check"
                        checked={musicState.isHidden}
                        onChange={(e) => setMusicState({ ...musicState, isHidden: e.target.checked })}
                        className="w-4 h-4 mt-0.5 accent-cyan-400 cursor-pointer"
                      />
                      <label htmlFor="hide-player-check" className="cursor-pointer">
                        <span className="block text-xs font-bold text-white">
                          إخفاء مشغل الموسيقى (تشغيل في الخلفية فقط)
                        </span>
                        <span className="block text-[11px] text-zinc-400 leading-normal mt-0.5">
                          تشتغل الموسيقى تلقائياً في الخلفية عند زيارة البروفايل دون ظهور بطاقة المشغل، مع زر أنيق للتحكم بالصوت (كتم/تشغيل) في الزاوية العلوية.
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="autoplay-check"
                          checked={musicState.autoplay}
                          onChange={(e) => setMusicState({ ...musicState, autoplay: e.target.checked })}
                          className="w-4 h-4 accent-cyan-400"
                        />
                        <label htmlFor="autoplay-check" className="text-xs text-white">
                          تشغيل تلقائي (Auto-play)
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="loop-check"
                          checked={musicState.loop}
                          onChange={(e) => setMusicState({ ...musicState, loop: e.target.checked })}
                          className="w-4 h-4 accent-cyan-400"
                        />
                        <label htmlFor="loop-check" className="text-xs text-white">
                          تكرار التشغيل (Loop)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs"
                  >
                    Save Music
                  </button>
                  {musicState.audioUrl && (
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/profile/music', { method: 'DELETE' });
                        setMusicState({
                          title: '',
                          artist: '',
                          audioUrl: '',
                          coverUrl: '',
                          isHidden: false,
                          autoplay: false,
                          loop: true,
                        });
                      }}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove Player
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Awarded Badges</h2>
                <p className="text-xs text-zinc-400">Toggle which badges appear on your public profile</p>
              </div>

              <div className="space-y-3">
                {badges.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">No badges awarded yet.</div>
                ) : (
                  badges.map((ub) => (
                    <div
                      key={ub.badgeId}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ub.badge.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{ub.badge.name}</h4>
                          <p className="text-xs text-zinc-400">{ub.badge.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBadge(ub.badgeId, ub.isVisible)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          ub.isVisible
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-white/5 text-zinc-500 border border-white/10'
                        }`}
                      >
                        {ub.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: GUESTBOOK */}
          {activeTab === 'guestbook' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Guestbook Moderation</h2>
                  <p className="text-xs text-zinc-400">Moderate messages signed by visitors</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-300">Enable Guestbook</span>
                  <input
                    type="checkbox"
                    checked={profile.isGuestbookEnabled}
                    onChange={(e) => {
                      const updated = { ...profile, isGuestbookEnabled: e.target.checked };
                      setProfile(updated);
                      handleSaveProfile(updated);
                    }}
                    className="w-4 h-4 accent-cyan-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {guestbook.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500">No guestbook messages yet.</div>
                ) : (
                  guestbook.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{c.authorName}</span>
                          {c.isPinned && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                              PINNED
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 break-words">{c.message}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await fetch('/api/guestbook', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ commentId: c.id, isPinned: !c.isPinned }),
                            });
                            setGuestbook(
                              guestbook.map((x) => (x.id === c.id ? { ...x, isPinned: !c.isPinned } : x))
                            );
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                          title="Pin/Unpin"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm('Delete comment?')) return;
                            await fetch(`/api/guestbook?id=${c.id}`, { method: 'DELETE' });
                            setGuestbook(guestbook.filter((x) => x.id !== c.id));
                          }}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Analytics & Performance</h2>
                <p className="text-xs text-zinc-400">Detailed privacy-friendly visitor stats</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs text-zinc-400">Devices</span>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-cyan-400" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-bold">68%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-400" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-bold">32%</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs text-zinc-400">Top Referrers</span>
                  <div className="space-y-1 pt-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Direct</span>
                      <span className="font-bold text-white">54%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Discord</span>
                      <span className="font-bold text-white">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300">X / Twitter</span>
                      <span className="font-bold text-white">18%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Account Settings</h2>
                <p className="text-xs text-zinc-400">Manage login credentials and security</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Username</label>
                  <input
                    type="text"
                    disabled
                    value={user.username}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-zinc-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-500">Contact admin to request a username change</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-zinc-400 cursor-not-allowed"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">VIP Membership Status</p>
                    <p className="text-[11px] text-zinc-400">
                      {user.isPremium ? 'Active Premium VIP' : 'Free Tier'}
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Manage Plan
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* COLUMN 3: Real-Time Live Profile Preview (Desktop only) */}
        <aside className="hidden xl:block w-[460px] border-l border-white/10 bg-[#07070d] p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Instant Preview</span>
            </span>
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Open in new tab</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="w-full transform scale-[0.88] origin-top">
            <ProfileCard profile={previewData} isLivePreview={true} />
          </div>
        </aside>
      </div>
    </div>
  );
}
