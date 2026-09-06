import crypto from 'crypto';
import { prisma } from './prisma';

export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'wans_analytics_salt').digest('hex').substring(0, 16);
}

export function parseDevice(ua: string): { device: string; browser: string } {
  const uaLower = ua.toLowerCase();
  let device = 'desktop';
  if (/mobile|android|iphone|ipod/i.test(uaLower)) {
    device = 'mobile';
  } else if (/ipad|tablet/i.test(uaLower)) {
    device = 'tablet';
  }

  let browser = 'Chrome';
  if (/firefox/i.test(uaLower)) browser = 'Firefox';
  else if (/safari/i.test(uaLower) && !/chrome/i.test(uaLower)) browser = 'Safari';
  else if (/edg/i.test(uaLower)) browser = 'Edge';
  else if (/opera|opr/i.test(uaLower)) browser = 'Opera';

  return { device, browser };
}

export async function trackProfileView(params: {
  profileId: string;
  ip: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    const ipHash = hashIp(params.ip);
    const { device, browser } = parseDevice(params.userAgent || '');
    const cleanReferrer = params.referrer ? new URL(params.referrer).hostname : 'Direct';

    // Anti-spam: check if viewed in last 30 minutes by same IP
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentView = await prisma.profileView.findFirst({
      where: {
        profileId: params.profileId,
        visitorIpHash: ipHash,
        timestamp: { gte: thirtyMinutesAgo },
      },
    });

    if (recentView) {
      return; // Deduplicate
    }

    await prisma.profileView.create({
      data: {
        profileId: params.profileId,
        visitorIpHash: ipHash,
        userAgent: (params.userAgent || '').substring(0, 255),
        deviceType: device,
        browser,
        referrer: cleanReferrer,
        country: 'Global',
      },
    });
  } catch (err) {
    console.error('Track profile view error:', err);
  }
}

export async function trackLinkClick(linkId: string, referrer?: string) {
  try {
    const cleanReferrer = referrer ? new URL(referrer).hostname : 'Direct';

    await prisma.$transaction([
      prisma.linkClick.create({
        data: {
          linkId,
          referrer: cleanReferrer,
        },
      }),
      prisma.socialLink.update({
        where: { id: linkId },
        data: { clickCount: { increment: 1 } },
      }),
    ]);
  } catch (err) {
    console.error('Track link click error:', err);
  }
}

export async function getProfileAnalytics(profileId: string) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, viewsToday, viewsThisWeek, viewsThisMonth, allViews, links] = await Promise.all([
    prisma.profileView.count({ where: { profileId } }),
    prisma.profileView.count({ where: { profileId, timestamp: { gte: startOfToday } } }),
    prisma.profileView.count({ where: { profileId, timestamp: { gte: sevenDaysAgo } } }),
    prisma.profileView.count({ where: { profileId, timestamp: { gte: thirtyDaysAgo } } }),
    prisma.profileView.findMany({
      where: { profileId, timestamp: { gte: sevenDaysAgo } },
      select: { timestamp: true, deviceType: true, browser: true, referrer: true },
    }),
    prisma.socialLink.findMany({
      where: { profileId },
      select: { id: true, platform: true, label: true, url: true, clickCount: true },
      orderBy: { clickCount: 'desc' },
    }),
  ]);

  // Daily breakdown for past 7 days
  const dailyBreakdown: { [date: string]: number } = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    dailyBreakdown[key] = 0;
  }

  allViews.forEach((v) => {
    const key = new Date(v.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    if (dailyBreakdown[key] !== undefined) {
      dailyBreakdown[key]++;
    }
  });

  // Device split
  let mobileCount = 0;
  let desktopCount = 0;
  const referrersCount: { [ref: string]: number } = {};

  allViews.forEach((v) => {
    if (v.deviceType === 'mobile') mobileCount++;
    else desktopCount++;

    const ref = v.referrer || 'Direct';
    referrersCount[ref] = (referrersCount[ref] || 0) + 1;
  });

  const totalLinkClicks = links.reduce((sum, l) => sum + l.clickCount, 0);

  return {
    totalViews,
    viewsToday,
    viewsThisWeek,
    viewsThisMonth,
    dailyChart: Object.entries(dailyBreakdown).map(([day, views]) => ({ day, views })),
    devices: {
      mobile: mobileCount,
      desktop: desktopCount,
      mobilePercentage: allViews.length ? Math.round((mobileCount / allViews.length) * 100) : 0,
    },
    topReferrers: Object.entries(referrersCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count })),
    links: links.map((l) => ({
      ...l,
      percentage: totalLinkClicks > 0 ? Math.round((l.clickCount / totalLinkClicks) * 100) : 0,
    })),
    totalLinkClicks,
  };
}
