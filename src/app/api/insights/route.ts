import { NextRequest, NextResponse } from 'next/server';
import { computeInsights } from '@/lib/analytics-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '30', 10);
    const validDays = isNaN(days) || days <= 0 ? 30 : Math.min(days, 365);

    const data = computeInsights(validDays);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
