import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // const excludedPaths = ['/_next', '/static', '/sign_in', '/sign_up', '/font', '.'];
    // const headersStore = headers();
    // console.log('responseCookies:::>', headersStore)
    // const responseCookies = new ResponseCookies(headersStore as Headers);
    // console.log('responseCookies:::>', responseCookies)
    // const csrfTokenCookie = responseCookies.get("user");
    // console.log('csrfTokenCookie:::>', csrfTokenCookie)
    // const res = NextResponse.next();
    // res.headers.append('Access-Control-Allow-Origin', '*');
    // res.headers.append('Access-Control-Allow-Credentials', 'true');
    // const getCookie = request?.cookies?.get('user')?.value ?? "";
    // const allCookies = request.cookies.getAll()
    // console.log('allCookies', allCookies)
    // console.log('request.cookies::::>', request.cookies)
    // console.log('getCookie::::>', getCookie)
    // const userCookie = getCookie?.length ?? 0;
    // console.log("userCookie:::>>", userCookie)
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};