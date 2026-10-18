// import { NextRequest, NextResponse } from 'next/server';

// // Map each protected path prefix to the roles allowed to access it
// const PROTECTED_ROUTES: { prefix: string; roles: string[] }[] = [
//     { prefix: '/auth/superadmindashboard', roles: ['super_admin'] },
//     { prefix: '/auth/nurserydashboard', roles: ['nursery_admin'] },
//     { prefix: '/auth/userdashboard', roles: ['user'] },
// ];

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     const matchedRoute = PROTECTED_ROUTES.find(route =>
//         pathname.startsWith(route.prefix)
//     );

//     if (!matchedRoute) {
//         return NextResponse.next();
//     }

//     // Forward the browser's cookies to your backend's /auth/me
//     const cookieHeader = request.headers.get('cookie') ?? '';

//     try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
//             method: 'GET',
//             headers: { cookie: cookieHeader },
//         });

//         if (!res.ok) {
//             return NextResponse.redirect(new URL('/auth/signin', request.url));
//         }

//         const data = await res.json();
//         const role: string | undefined = data?.user?.role;

//         if (!role || !matchedRoute.roles.includes(role)) {
//             // Logged in, but wrong role → send to their correct home, not signin
//             const fallback =
//                 role === 'super_admin' ? '/auth/superadmindashboard' :
//                     role === 'nursery_admin' ? '/auth/nurserydashboard' :
//                         role === 'user' ? '/auth/userdashboard' :
//                             '/';
//             return NextResponse.redirect(new URL(fallback, request.url));
//         }

//         return NextResponse.next();
//     } catch {
//         return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }
// }

// export const config = {
//     matcher: [
//         '/auth/superadmindashboard/:path*',
//         '/auth/nurserydashboard/:path*',
//         '/auth/userdashboard/:path*',
//     ],
// };