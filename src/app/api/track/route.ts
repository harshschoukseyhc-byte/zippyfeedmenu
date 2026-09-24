import { NextRequest, NextResponse } from 'next/server';
import { saveEvent, ServerEvent } from '@/lib/analytics-server';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    if (!raw || typeof raw !== 'object' || !raw.event) {
      return NextResponse.json({ error: 'Invalid event format' }, { status: 400 });
    }

    const event: ServerEvent = {
      event: String(raw.event),
      timestamp: Number(raw.timestamp) || Date.now(),
      sessionId: String(raw.sessionId || 'anon'),
      data: raw.data && typeof raw.data === 'object' ? raw.data : {},
    };

    await saveEvent(event);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
