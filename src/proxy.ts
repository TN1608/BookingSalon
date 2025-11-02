import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const publicRoutes = ['/login', '/register', '/'];

    const {pathname} = req.nextUrl;

    // Only protect routes matched by config.matcher
    // if (pathname.startsWith('/dashboard') && !token) {
    //     return NextResponse.redirect(new URL('/login', req.url));
    // }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
}