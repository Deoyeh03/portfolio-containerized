"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Code2, Server, Database, Shield, Zap,
    Layers, Cpu, Layout, FileCode, MessageSquare,
    Repeat, Globe, Github, Box, PenTool, Terminal,
    Braces, Rocket, Cloud, Loader2
} from "lucide-react";
import { useSkills } from "@/hooks/useApi";

interface Skill {
    _id: string;
    name: string;
    category: string;
    summary: string;
}

export default function TechStack() {
    const { data: skills = [], isLoading: loading } = useSkills();
    const [activeCategory, setActiveCategory] = useState("All");
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const iconMap: Record<string, any> = {
        "Next.js": Layout,
        "TypeScript": FileCode,
        "React": Braces,
        "Tailwind": PenTool,
        "Framer": Rocket,
        "Node.js": Server,
        "Express": Cpu,
        "MongoDB": Database,
        "Socket.io": Zap,
        "JWT/Auth": Shield,
        "BullMQ": Repeat,
        "Clean Architecture": Layers,
        "Git": Github,
        "Docker": Box,
    };

    const categories = ["All", ...Array.from(new Set(skills.map(s => s.category)))];

    const filteredSkills = activeCategory === "All" 
        ? skills 
        : skills.filter(skill => skill.category === activeCategory);

    if (loading) return <div className="py-32 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;

    return (
        <section id="tech-stack" className="py-32 bg-background relative overflow-hidden" suppressHydrationWarning>
            <div className="container px-6 mx-auto relative z-10" suppressHydrationWarning>
                <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                    The Toolbox
                </h2>
                <h3 className="text-4xl font-bold text-white mb-16">
                    Technologies & Frameworks
                </h3>

                <div className="flex flex-wrap gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                                activeCategory === cat 
                                ? "bg-primary text-black border-primary" 
                                : "bg-white/5 text-muted-foreground border-white/10 hover:border-primary/50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSkills.map((skill) => {
                            const Icon = iconMap[skill.name] || Terminal;
                            return (
                                <motion.div
                                    key={skill._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ y: -5 }}
                                    onMouseEnter={() => setHoveredSkill(skill._id)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                    className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors flex flex-col items-center gap-4 cursor-help"
                                >
                                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                                        <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{skill.name}</span>

                                    {/* Tooltip */}
                                    <AnimatePresence>
                                        {hoveredSkill === skill._id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute bottom-full left-0 right-0 mb-4 z-50 p-4 rounded-xl bg-black/90 border border-white/20 backdrop-blur-xl shadow-2xl pointer-events-none"
                                            >
                                                <div className="text-xs font-mono text-primary mb-1 uppercase tracking-tighter">{skill.category}</div>
                                                <div className="text-sm text-white leading-tight">{skill.summary}</div>
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white/20" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />
        </section>
    );
}
