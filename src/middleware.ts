import { NextResponse } from 'next/server';
// import { setGlobalOptions } from "firebase-functions/v2";

// setGlobalOptions({ maxInstances: 10 });

import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    const excludedPaths = ['/_next', '/static', '/sign_in', '/sign_up', '/font', '.'];
    const getCookie = request.cookies.get('user')?.value;
    const userCookie = getCookie?.length;
    if (['/sign_in', '/sign_up'].some(path => request.url.includes(path)) && userCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (excludedPaths.some(path => request.url.includes(path))) {
        return NextResponse.next();
    }
    if (userCookie) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/sign_in', request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};