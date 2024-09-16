import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token');

    const publicRoutes = ['/', '/login', '/register'];

    if (!token) {
        
        if (!publicRoutes.includes(pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        if (pathname === '/login' || pathname === '/register') {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',               
        '/login',          
        '/register',       
        '/about/:path*',   
        '/dashboard/:path*', 
        '/profile/:path*', 
    ],
}
