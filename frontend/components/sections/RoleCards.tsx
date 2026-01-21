"use client";

import { useState } from "react";
import { Server, Layout, Shield, Zap, Wrench, UserCircle, Database, Globe, Lock, Code, Layers, Briefcase, Loader2 } from "lucide-react";
import TiltCard from "../ui/TiltCard";
import Modal from "../ui/Modal";

import { useRoles, Role } from "@/hooks/useApi"; // Import hook and type




// Icon mapping for dynamic icons from API
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Server,
    Database,
    Globe,
    Shield,
    Wrench,
    Briefcase,
    Code,
    Layers,
    Zap,
    Lock,
    Layout,
    UserCircle
};

export default function RoleCards() {
    const { data: roles = [], isLoading } = useRoles(); // Use hook
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // useEffect removed


    const getIcon = (iconName: string) => {
        return iconMap[iconName] || Briefcase;
    };

    if (isLoading) {
        return (
            <section id="about" className="py-32 relative bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </section>
        );
    }

    if (roles.length === 0) {
        return null; // Don't render if no roles
    }

    return (
        <section id="about" className="py-32 relative bg-background">
            <div className="container px-6 mx-auto">
                <div className="mb-16">
                    <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                        Capabilities
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight">
                        Building systems that scale with your business.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roles.map((role, index) => {
                        const IconComponent = getIcon(role.icon);
                        return (
                            <TiltCard
                                key={role._id}
                                index={index}
                                title={role.title}
                                subtitle={role.subtitle}
                                icon={IconComponent}
                                onClick={() => setSelectedRole(role)}
                            />
                        );
                    })}
                </div>
            </div>

            <Modal
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
                title={selectedRole?.title}
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 py-4 border-b border-white/5">
                        {selectedRole && (() => {
                            const IconComponent = getIcon(selectedRole.icon);
                            return <IconComponent className="w-12 h-12 text-primary" />;
                        })()}
                        <div>
                            <p className="text-white font-bold text-lg">{selectedRole?.subtitle}</p>
                            <p className="text-primary text-sm font-mono uppercase tracking-wider">Expertise Area</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground text-xl leading-relaxed">
                            {selectedRole?.description}
                        </p>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={() => setSelectedRole(null)}
                            className="w-full py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest text-sm"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
