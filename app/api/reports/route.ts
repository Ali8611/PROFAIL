import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { reportSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid report' }, { status: 400 });
    }

    const user = await getSessionUser();

    const report = await prisma.report.create({
      data: {
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        profileId: parsed.data.profileId || null,
        reason: parsed.data.reason,
        details: parsed.data.details || '',
        reporterId: user ? user.id : null,
      },
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
