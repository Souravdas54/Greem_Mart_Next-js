// 'use client';

// import { useAuth } from '@/app/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export function RoleGuard({
//     allowedRole,
//     children,
// }: {
//     allowedRole: string;
//     children: React.ReactNode;
// }) {
//     const { user, isLoading, isLoggedIn } = useAuth();
//     const router = useRouter();

//     useEffect(() => {
//         if (isLoading) return;

//         if (!isLoggedIn || !user) {
//             router.replace('/auth/signin');
//             return;
//         }

//         if (user.role !== allowedRole) {
//             const fallback =
//                 user.role === 'super_admin' ? '/auth/superadmindashboard' :
//                     user.role === 'nursery_admin' ? '/auth/nurserydashboard' :
//                         user.role === 'user' ? '/auth/userdashboard' :
//                             '/';
//             router.replace(fallback);
//         }
//     }, [isLoading, isLoggedIn, user, allowedRole, router]);

//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
//             </div>
//         );
//     }

//     if (!isLoggedIn || !user || user.role !== allowedRole) {
//         return null;
//     }

//     return <>{children}</>;
// }