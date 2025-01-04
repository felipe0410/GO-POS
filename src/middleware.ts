import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // const excludedPaths = ['/_next', '/static', '/sign_in', '/sign_up', '/font', '.'];
    // const headersStore = headers();
    // const responseCookies = new ResponseCookies(headersStore as Headers);
    // const csrfTokenCookie = responseCookies.get("user");
    // const res = NextResponse.next();
    // res.headers.append('Access-Control-Allow-Origin', '*');
    // res.headers.append('Access-Control-Allow-Credentials', 'true');
    // const getCookie = request?.cookies?.get('user')?.value ?? "";
    // const userCookie = getCookie?.length ?? 0;
    // const pathname = request.nextUrl.pathname
    // if (['/sign_in', '/sign_up'].some(path => pathname.includes(path)) && userCookie > 0) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }
    // if (excludedPaths.some(path => pathname.includes(path))) {
    //     return NextResponse.next();
    // }
    // if (userCookie > 0) {
    //     return NextResponse.next();
    // }
    // return NextResponse.redirect(new URL('/sign_in', request.url));
}

export const config = {
    matcher: [
        // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};