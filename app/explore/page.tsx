import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { Search, Compass, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  searchParams: { q?: string };
}

export default async function ExplorePage({ searchParams }: Props) {
  const query = searchParams.q || '';

  const users = await prisma.user.findMany({
    where: {
      isBanned: false,
      profile: { isNot: null },
      OR: query
        ? [
            { username: { contains: query } },
            { profile: { displayName: { contains: query } } },
            { profile: { bio: { contains: query } } },
          ]
        : undefined,
    },
    include: {
      profile: {
        include: {
          _count: { select: { views: true, links: true } },
        },
      },
      badges: {
        where: { isVisible: true },
        include: { badge: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 36,
  });

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex flex-col pt-16 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Community</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Explore WANS Profiles
          </h1>
          <p className="text-sm text-zinc-400">
            Find pro gamers, developers, designers, and creators from around the world.
          </p>

          {/* Search Bar */}
          <form method="GET" action="/explore" className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by username, name, or keywords..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 shadow-glass transition-colors"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-5.5" />
          </form>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((u) => {
            const prof = u.profile!;
            return (
              <Link
                key={u.id}
                href={`/${u.username}`}
                className="group relative p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-glass hover:scale-[1.02]"
              >
                {/* Avatar with accent ring */}
                <div
                  className="w-20 h-20 rounded-full p-1 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${prof.accentColor || '#00f0ff'}, transparent)`,
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-black/50">
                    {prof.avatarUrl ? (
                      <img
                        src={prof.avatarUrl}
                        alt={prof.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-xl"
                        style={{ color: prof.accentColor }}
                      >
                        {prof.displayName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {prof.displayName}
                  </h3>
                  <p className="text-xs font-medium text-zinc-400">@{u.username}</p>
                </div>

                {prof.bio && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed px-1">
                    {prof.bio}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {u.badges.slice(0, 3).map((ub) => (
                    <span
                      key={ub.badgeId}
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                      style={{
                        backgroundColor: `${ub.badge.color}15`,
                        borderColor: `${ub.badge.color}30`,
                        color: ub.badge.color,
                      }}
                    >
                      {ub.badge.icon} {ub.badge.name}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 w-full flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{prof._count.links} links</span>
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="text-center py-20 text-zinc-500 space-y-2">
            <p className="text-base font-semibold">No profiles found matching "{query}"</p>
            <p className="text-xs">Try searching for a different username or browse all profiles.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
