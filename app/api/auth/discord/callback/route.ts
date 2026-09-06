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

    // 3. Find or Create User in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ discordId }, { email }],
      },
      include: { profile: true },
    });

    if (!user) {
      // Clean username (alphanumeric, max 20)
      let cleanUsername = discordUsername.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15);
      if (!cleanUsername || cleanUsername.length < 3) cleanUsername = `wans_${discordId.slice(-4)}`;

      // Check collision
      const existingName = await prisma.user.findUnique({ where: { username: cleanUsername } });
      if (existingName) {
        cleanUsername = `${cleanUsername}_${crypto.randomBytes(2).toString('hex')}`;
      }

      const randomPassword = await hashPassword(crypto.randomBytes(16).toString('hex'));

      user = await prisma.user.create({
        data: {
          username: cleanUsername,
          email,
          passwordHash: randomPassword,
          discordId,
          discordUsername,
          discordAvatar: avatarUrl,
          profile: {
            create: {
              displayName: globalName,
              avatarUrl,
              bio: `Hey! I logged in via Discord to WANS.`,
              themeId: 'neon-purple',
              accentColor: '#5865F2',
              links: {
                create: [
                  {
                    platform: 'Discord',
                    label: 'Add on Discord',
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

      // Award "Early User" badge
      const earlyBadge = await prisma.badge.findUnique({ where: { slug: 'early' } });
      if (earlyBadge) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: earlyBadge.id,
            isVisible: true,
          },
        });
      }
    } else {
      // Update discord details if needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          discordId,
          discordUsername,
          discordAvatar: avatarUrl,
        },
      });
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
