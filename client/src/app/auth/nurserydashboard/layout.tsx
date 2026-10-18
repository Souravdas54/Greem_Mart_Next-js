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

// export default async function NurseryDashboardLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const user = await getServerUser();

//     if (!user) {
//         redirect('/auth/signin');
//     }

//     if (user.role !== 'nursery_admin') {
//         const fallback =
//             user.role === 'super_admin' ? '/auth/superadmindashboard' :
//             user.role === 'user' ? '/auth/userdashboard' :
//             '/';
//         redirect(fallback);
//     }

//     return <>{children}</>;
// }