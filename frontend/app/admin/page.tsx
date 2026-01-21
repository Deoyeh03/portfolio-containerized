"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProjectManager from '@/components/admin/ProjectManager';
import ContentManager from '@/components/admin/ContentManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

interface DashboardStats {
    projects: number;
    visits: number;
    aiInteractions: number;
    systemStatus: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const { logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (error: any) {
                console.error('Dashboard stats error:', error);
                if (error.response?.status === 401) {
                    // User not authenticated, redirect to login
                    logout();
                    router.push('/admin/login');
                }
            }
        };
        fetchStats();
    }, [logout, router]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-black text-white p-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            Command Center
                        </h1>
                        <p className="text-muted-foreground mt-2">Welcome back, Administrator.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleLogout} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 flex items-center gap-2">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Active Projects" value={stats?.projects ?? '-'} />
                    <StatCard title="Total Visits" value={stats?.visits ?? '-'} />
                    <StatCard title="AI Interactions" value={stats?.aiInteractions ?? '-'} />
                    <StatCard title="System Status" value={typeof stats?.systemStatus === 'object' ? `${stats.systemStatus.database} | ${stats.systemStatus.ai}` : stats?.systemStatus ?? 'Checking...'} />
                </div>

                {/* Project Management */}
                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AnalyticsDashboard />
                    <div className="space-y-4">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl h-full">
                            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                            <div className="text-sm text-muted-foreground text-center py-12">
                                Activity logs coming soon...
                            </div>
                        </div>
                    </div>
                </div>

                <ProjectManager />
                <ContentManager />
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
}
