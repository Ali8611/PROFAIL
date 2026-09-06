import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || '925438310418112592';
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = '1444410192421982300'; // سيرفرك 𝓐𝓵 𝓦𝓐𝓝𝓢

  if (!botToken) {
    return NextResponse.json({ success: false, error: 'Bot token not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch user data from Discord API via Bot
    const userRes = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 15 }, // Cache 15s
    });

    let userData: any = null;
    if (userRes.ok) {
      userData = await userRes.json();
    }

    // 2. Fetch member from your server
    const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 15 },
    });

    let memberData: any = null;
    if (memberRes.ok) {
      memberData = await memberRes.json();
    }

    // 3. Check Lanyard for live status/activity fallback
    let lanyardStatus = 'offline';
    let lanyardActivity: string | null = null;
    let spotifyData: any = null;

    try {
      const lanRes = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
        cache: 'no-store',
      });
      if (lanRes.ok) {
        const lanJson = await lanRes.json();
        if (lanJson.success && lanJson.data) {
          lanyardStatus = lanJson.data.discord_status || 'offline';
          const currentActivity = lanJson.data.activities?.find((a: any) => a.type === 0 || a.type === 4);
          lanyardActivity = currentActivity
            ? currentActivity.type === 4
              ? currentActivity.state
              : currentActivity.name
            : null;
          if (lanJson.data.listening_to_spotify && lanJson.data.spotify) {
            spotifyData = lanJson.data.spotify;
          }
        }
      }
    } catch (_) {}

    const avatarHash = memberData?.avatar || userData?.avatar;
    const avatarUrl = avatarHash
      ? `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${avatarHash.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : 'https://cdn.discordapp.com/avatars/925438310418112592/1860ada08abd649208090ae5d5dddf55.png?size=512';

    return NextResponse.json({
      success: true,
      data: {
        userId,
        username: userData?.username || 'aliwans1',
        globalName: userData?.global_name || memberData?.nick || 'ALI WANS',
        serverNick: memberData?.nick || null,
        avatarUrl,
        status: lanyardStatus,
        activity: lanyardActivity,
        spotify: spotifyData,
        inServer: Boolean(memberData),
        serverName: '𝓐𝓵 𝓦𝓐𝓝𝓢',
      },
    });
  } catch (error) {
    console.error('Discord bot API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
