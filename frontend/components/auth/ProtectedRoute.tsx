"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated()) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
