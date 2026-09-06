import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wans.gg';

  const users = await prisma.user.findMany({
    where: { isBanned: false },
    select: { username: true, updatedAt: true },
    take: 500,
  });

  const profileUrls = users.map((u) => ({
    url: `${baseUrl}/${u.username}`,
    lastModified: u.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...profileUrls,
  ];
}
