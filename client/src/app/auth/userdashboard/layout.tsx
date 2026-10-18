// import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';

// async function getServerUser() {
//     const cookieStore = await cookies();
//     const cookieHeader = cookieStore.toString();

//     try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
//             method: 'GET',
//             headers: { cookie: cookieHeader },
//             cache: 'no-store',
//         });
//         if (!res.ok) return null;
//         const data = await res.json();
//         return data?.user ?? null;
//     } catch {
//         return null;
//     }
// }

// export default async function UserDashboardLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const user = await getServerUser();

//     if (!user) {
//         redirect('/auth/signin');
//     }

//     if (user.role !== 'user') {
//         const fallback =
//             user.role === 'super_admin' ? '/auth/superadmindashboard' :
//             user.role === 'nursery_admin' ? '/auth/nurserydashboard' :
//             '/';
//         redirect(fallback);
//     }

//     return <>{children}</>;
// }