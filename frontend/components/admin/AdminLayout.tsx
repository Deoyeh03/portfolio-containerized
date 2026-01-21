"use client";

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    FileText, 
    Briefcase, 
    Code2, 
    Settings, 
    LogOut,
    Users,
    Route,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Hero', icon: FileText, href: '/admin/hero' },
    { name: 'Roles', icon: Briefcase, href: '/admin/roles' },
    { name: 'Projects', icon: Code2, href: '/admin/projects' },
    { name: 'Skills', icon: Code2, href: '/admin/skills' },
    { name: 'Journey', icon: Route, href: '/admin/journey' },
    { name: 'Resume', icon: Users, href: '/admin/resume' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-black text-white flex">
                {/* Sidebar */}
                <aside className={cn(
                    "fixed left-0 top-0 h-full bg-white/5 border-r border-white/10 transition-all duration-300 z-50",
                    sidebarOpen ? "w-64" : "w-20"
                )}>
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
                        )}
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                    activePage === item.name.toLowerCase()
                                        ? "bg-primary/20 text-primary border border-primary/30"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={cn(
                    "flex-1 transition-all duration-300",
                    sidebarOpen ? "ml-64" : "ml-20"
                )}>
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
