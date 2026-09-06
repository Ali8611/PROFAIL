import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, AUTH_COOKIE } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input data' },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    // Check if user or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: { equals: username } }, { email: { equals: email } }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already in use' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and initial default profile
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        profile: {
          create: {
            displayName: username,
            bio: `Hey there! Welcome to my official WANS profile.`,
            themeId: 'cyber',
            accentColor: '#00f0ff',
            links: {
              create: [
                {
                  platform: 'Website',
                  label: 'My Website',
                  url: 'https://wans.gg',
                  style: 'neon',
                  order: 0,
                },
              ],
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Auto-award "Early User" badge
    const earlyBadge = await prisma.badge.findUnique({ where: { slug: 'early' } });
    if (earlyBadge) {
      await prisma.userBadge.create({
        data: {
          userId: newUser.id,
          badgeId: earlyBadge.id,
          isVisible: true,
        },
      });
    }

    // Generate session token
    const token = signToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
