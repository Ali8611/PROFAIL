import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await requireAdmin();
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { username: true, email: true } },
        profile: { select: { displayName: true, user: { select: { username: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, reports });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { reportId, status } = body;

    if (!reportId || !['PENDING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json({ error: 'Valid report ID and status required' }, { status: 400 });
    }

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
