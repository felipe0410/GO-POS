import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const excludedPaths = ['/_next', '/static', '/sign_in', '/sign_up', '/font', '.'];
    const allowOrigin = 'https://go-pos-add98.web.app'; // Reemplazar con tu dominio de Firebase Hosting
    const res = NextResponse.next()
    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Origin', allowOrigin)
    res.headers.append('Access-Control-Allow-Credentials', 'true')
    const getCookie = request?.cookies?.get('user')?.value ?? "";
    const allCookies = request.cookies.getAll()
    console.log('allCookies', allCookies)
    console.log('request.cookies::::>', request.cookies)
    console.log('getCookie::::>', getCookie)
    const userCookie = getCookie?.length ?? 0;
    console.log("userCookie:::>>", userCookie)
    const pathname = request.nextUrl.pathname
    console.log('request.nextUrl::>', request.nextUrl)
    if (['/sign_in', '/sign_up'].some(path => pathname.includes(path)) && userCookie > 0) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (excludedPaths.some(path => pathname.includes(path))) {
        return NextResponse.next();
    }
    if (userCookie > 0) {
        return NextResponse.next();
    }
    // return new Response(
    //     '<script>window.location.href="/sign_in";</script>',
    //     {
    //         status: 200,
    //         headers: {
    //             'Content-Type': 'text/html',
    //         },
    //     }
    // );
    return NextResponse.redirect(new URL('/sign_in', request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};