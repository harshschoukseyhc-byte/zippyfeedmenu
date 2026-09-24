import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const table = url.searchParams.get('table');
  const source = url.searchParams.get('s') || 'qr';

  const redirectUrl = new URL('/', req.nextUrl);
  redirectUrl.searchParams.set('source', source);
  if (table) {
    redirectUrl.searchParams.set('table', table);
  }

  return NextResponse.redirect(redirectUrl, 307);
}
