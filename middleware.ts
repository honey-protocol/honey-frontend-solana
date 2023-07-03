// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server';
export async function middleware(req: any, ev: any) {
  const { pathname } = req.nextUrl;
  if (pathname == '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/borrow';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
