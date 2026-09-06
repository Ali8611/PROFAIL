import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${appUrl}/api/auth/discord/callback`;

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=discord_code_missing`);
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === 'dummy_discord_id') {
    return NextResponse.redirect(`${appUrl}/login?error=discord_not_configured`);
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Discord token error:', await tokenResponse.text());
      return NextResponse.redirect(`${appUrl}/login?error=discord_token_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch Discord User details
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=discord_user_fetch_failed`);
    }

    const discordUser = await userResponse.json();
    // Fields: id, username, global_name, avatar, email
    const discordId = discordUser.id;
    const discordUsername = discordUser.username;
    const globalName = discordUser.global_name || discordUsername;
    const email = discordUser.email || `${discordUsername}_${discordId.slice(-4)}@discord.wans.gg`;
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png?size=256`
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';

    const isOwner = discordId === '925438310418112592' || discordUsername.toLowerCase() === 'aliwasn1';

    // 3. Find or Create User in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ discordId }, { email }, ...(isOwner ? [{ username: 'aliwasn1' }, { username: 'WANS' }] : [])],
      },
      include: { profile: true },
    });

    if (!user) {
      // Clean username (alphanumeric, max 20)
      let cleanUsername = isOwner ? 'aliwasn1' : discordUsername.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15);
      if (!cleanUsername || cleanUsername.length < 3) cleanUsername = `wans_${discordId.slice(-4)}`;

      // Check collision if not owner
      if (!isOwner) {
        const existingName = await prisma.user.findUnique({ where: { username: cleanUsername } });
        if (existingName) {
          cleanUsername = `${cleanUsername}_${crypto.randomBytes(2).toString('hex')}`;
        }
      }

      const randomPassword = await hashPassword(crypto.randomBytes(16).toString('hex'));

      user = await prisma.user.create({
        data: {
          username: cleanUsername,
          email,
          passwordHash: randomPassword,
          role: isOwner ? 'ADMIN' : 'USER',
          isPremium: isOwner ? true : false,
          discordId,
          discordUsername,
          discordAvatar: avatarUrl,
          profile: {
            create: {
              displayName: globalName || (isOwner ? 'aliwasn1' : discordUsername),
              avatarUrl,
              bio: isOwner ? '👑 Founder & Owner of WANS Platform.' : `Hey! I logged in via Discord to WANS.`,
              themeId: 'cyber',
              accentColor: '#00f5d4',
              links: {
                create: [
                  {
                    platform: 'Discord',
                    label: 'Discord Profile',
                    url: `https://discord.com/users/${discordId}`,
                    style: 'neon',
                    order: 0,
                  },
                ],
              },
            },
          },
        },
        include: { profile: true },
      });

      // Award Badges
      const badgesToAward = isOwner ? ['owner', 'dev', 'verified', 'premium'] : ['early'];
      for (const badgeSlug of badgesToAward) {
        const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
        if (badge) {
          await prisma.userBadge.upsert({
            where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
            create: { userId: user.id, badgeId: badge.id, isVisible: true },
            update: { isVisible: true },
          });
        }
      }
    } else {
      // Update discord details & sync avatar and promote if owner
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          discordId,
          discordUsername,
          discordAvatar: avatarUrl,
          ...(isOwner ? { role: 'ADMIN', isPremium: true } : {}),
        },
      });
      user.role = updatedUser.role;

      // Sync avatar to profile
      if (user.profile) {
        await prisma.profile.update({
          where: { id: user.profile.id },
          data: {
            avatarUrl: avatarUrl,
            ...(isOwner ? { displayName: globalName || 'aliwasn1' } : {}),
          },
        });
      }

      if (isOwner) {
        const badgesToAward = ['owner', 'dev', 'verified', 'premium'];
        for (const badgeSlug of badgesToAward) {
          const badge = await prisma.badge.findUnique({ where: { slug: badgeSlug } });
          if (badge) {
            await prisma.userBadge.upsert({
              where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
              create: { userId: user.id, badgeId: badge.id, isVisible: true },
              update: { isVisible: true },
            });
          }
        }
      }
    }

    // 4. Issue session token and cookie
    const sessionToken = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.set(AUTH_COOKIE.name, sessionToken, AUTH_COOKIE.options);
    return response;
  } catch (error) {
    console.error('Discord callback handling error:', error);
    return NextResponse.redirect(`${appUrl}/login?error=discord_internal_error`);
  }
}
