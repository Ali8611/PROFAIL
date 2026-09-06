import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'IMAGE';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!['IMAGE', 'AUDIO', 'VIDEO'].includes(type)) {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
    }

    // Gated check: Video upload requires premium
    if (type === 'VIDEO' && !user.isPremium) {
      return NextResponse.json(
        { error: 'Video backgrounds require a WANS Premium subscription' },
        { status: 403 }
      );
    }

    const result = await saveUploadedFile(file, type as 'IMAGE' | 'AUDIO' | 'VIDEO');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: 'File upload processing failed' }, { status: 500 });
  }
}
