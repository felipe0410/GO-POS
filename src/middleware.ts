import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
    const excludedPaths = ['/_next', '/static', '/sign_in', '/sign_up', '/font', '.'];
    const getCookie = request.cookies.get('user')?.value;
    const userCookie = getCookie?.length;
    console.log('userCookie;;;>', userCookie)
    console.log('llegue aqui1::>', request.url)
    if (['/sign_in', '/sign_up'].some(path => request.url.includes(path)) && userCookie) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    console.log('llegue aqui2::>', request.url)
    console.log('test::>', excludedPaths.some(path => ("https://0.0.0.0:8080/TableShipments").includes(path)))
    if (excludedPaths.some(path => request.url.includes(path))) {
        return NextResponse.next();
    }
    console.log('llegue aqui3::>', request.url)
    if (userCookie) {
        return NextResponse.next();
    }
    console.log('llegue aqui4::>', request.url)
    return new Response(
        '<script>window.location.href="/sign_in";</script>',
        {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );
    // return NextResponse.redirect(new URL('/sign_in', request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};