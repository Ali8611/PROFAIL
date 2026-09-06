'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Users,
  Award,
  Flag,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'badges' | 'reports'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // New badge form state
  const [newBadge, setNewBadge] = useState({
    slug: '',
    name: '',
    icon: '👑',
    description: '',
    color: '#00f0ff',
  });

  const fetchData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/login');
        return;
      }
      const meData = await meRes.json();
      if (meData.user?.role !== 'ADMIN') {
        alert('Forbidden: Admin access required');
        router.push('/dashboard');
        return;
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }

      // Fetch badges
      const badgesRes = await fetch('/api/admin/badges');
      if (badgesRes.ok) {
        const bData = await badgesRes.json();
        setBadges(bData.badges || []);
      }

      // Fetch reports
      const reportsRes = await fetch('/api/admin/reports');
      if (reportsRes.ok) {
        const rData = await reportsRes.json();
        setReports(rData.reports || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBan = async (userId: string, currentBan: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBanned: !currentBan }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, isBanned: !currentBan } : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePremium = async (userId: string, currentPrem: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isPremium: !currentPrem }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, isPremium: !currentPrem } : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBadge),
      });
      const data = await res.json();
      if (res.ok) {
        setBadges([...badges, data.badge]);
        setNewBadge({ slug: '', name: '', icon: '👑', description: '', color: '#00f0ff' });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignBadge = async (userId: string, badgeId: string) => {
    try {
      await fetch('/api/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'assign', userId, badgeId }),
      });
      alert('Badge assigned successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReport = async (reportId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      if (res.ok) {
        setReports(reports.map((r) => (r.id === reportId ? { ...r, status } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold">Loading WANS Admin Core...</span>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Admin Header */}
      <header className="h-16 border-b border-red-500/20 bg-[#12080c] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-sm shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-white">WANS Administration</h1>
            <p className="text-[10px] text-red-400 font-mono">ROOT_LEVEL_PRIVILEGES</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Dashboard</span>
        </Link>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Global Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400">Total Users</span>
            <p className="text-2xl font-black text-white">{users.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400">Total Badges</span>
            <p className="text-2xl font-black text-cyan-400">{badges.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400">Pending Reports</span>
            <p className="text-2xl font-black text-rose-400">
              {reports.filter((r) => r.status === 'PENDING').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-zinc-400">VIP Members</span>
            <p className="text-2xl font-black text-purple-400">
              {users.filter((u) => u.isPremium).length}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'users' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'badges' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Manage Badges ({badges.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'reports' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white bg-white/5'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Moderation Queue ({reports.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <input
                  type="text"
                  placeholder="Search user by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">VIP</th>
                    <th className="p-3.5">Assign Badge</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Link href={`/${u.username}`} target="_blank" className="hover:underline text-cyan-400">
                            /{u.username}
                          </Link>
                          {u.profile?.displayName && (
                            <span className="text-zinc-400 font-normal">({u.profile.displayName})</span>
                          )}
                        </div>
                        <div className="text-zinc-500 text-[11px]">{u.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-zinc-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isBanned ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {u.isBanned ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePremium(u.id, u.isPremium)}
                          title="Click to Grant or Revoke Free Lifetime Premium"
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            u.isPremium
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border border-pink-400/50 shadow-purple-500/20'
                              : 'bg-white/5 hover:bg-purple-600/30 text-zinc-300 hover:text-white border border-white/10 hover:border-purple-500/40'
                          }`}
                        >
                          {u.isPremium ? (
                            <>
                              <span>💎</span>
                              <span>VIP Member</span>
                            </>
                          ) : (
                            <>
                              <span className="text-purple-400">+</span>
                              <span>Grant Free VIP</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3.5">
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleAssignBadge(u.id, e.target.value);
                          }}
                          defaultValue=""
                          className="px-2 py-1 rounded bg-black/50 border border-white/10 text-white text-[11px]"
                        >
                          <option value="" disabled>
                            + Award Badge
                          </option>
                          {badges.map((b) => (
                            <option key={b.id} value={b.id} className="bg-zinc-900">
                              {b.icon} {b.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleBan(u.id, u.isBanned)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold ${
                            u.isBanned ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BADGES */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <form onSubmit={handleCreateBadge} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Create New Community Badge</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Slug (e.g. champion)"
                  value={newBadge.slug}
                  onChange={(e) => setNewBadge({ ...newBadge, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                />
                <input
                  type="text"
                  placeholder="Display Name (e.g. Champion)"
                  value={newBadge.name}
                  onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                />
                <input
                  type="text"
                  placeholder="Icon (e.g. 🏆)"
                  value={newBadge.icon}
                  onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
                />
                <input
                  type="color"
                  value={newBadge.color}
                  onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
                  className="w-full h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                />
              </div>
              <input
                type="text"
                placeholder="Description / Requirements"
                value={newBadge.description}
                onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Create Badge
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.name}</h4>
                      <p className="text-[10px] text-zinc-400">{b.description}</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    style={{ borderColor: b.color, color: b.color }}
                  >
                    {b.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-500">Moderation queue is clean. Zero pending reports!</div>
            ) : (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        [{r.targetType}] {r.reason}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        r.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    {r.details && <p className="text-xs text-zinc-300">{r.details}</p>}
                    <p className="text-[10px] text-zinc-500">Target ID: {r.targetId}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateReport(r.id, 'RESOLVED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Resolve & Action
                    </button>
                    <button
                      onClick={() => handleUpdateReport(r.id, 'DISMISSED')}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
