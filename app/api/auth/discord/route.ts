import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${appUrl}/api/auth/discord/callback`;

  if (!clientId || clientId === 'dummy_discord_id') {
    return NextResponse.json(
      { error: 'DISCORD_CLIENT_ID is not configured in .env' },
      { status: 500 }
    );
  }

  const scope = encodeURIComponent('identify email');
  const encodedRedirect = encodeURIComponent(redirectUri);

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodedRedirect}&response_type=code&scope=${scope}`;

  return NextResponse.redirect(discordAuthUrl);
}
