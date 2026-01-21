"use client";

import { motion } from "framer-motion";
import {
    Code2, Database, Globe, Server, Terminal, Cpu, Cloud,
    Shield, Layers, Zap, Layout, GanttChart
} from "lucide-react";

const techStack = [
    {
        category: "Frontend & UI",
        items: [
            { name: "Next.js", icon: Globe, desc: "App Router, SSR/RSC" },
            { name: "React", icon: Code2, desc: "Hooks, Context, Patterns" },
            { name: "TypeScript", icon: Terminal, desc: "Strict Typing" },
            { name: "TailwindCSS", icon: Layout, desc: "Design System" },
            { name: "Framer Motion", icon: Zap, desc: "Complex Animations" },
            { name: "Three.js", icon: Layers, desc: "3D WebGL Experiences" },
        ],
    },
    {
        category: "Backend & Systems",
        items: [
            { name: "Node.js", icon: Server, desc: "Event-Loop Runtime" },
            { name: "Express/Nest", icon: Cpu, desc: "Scalable API Arch" },
            { name: "MongoDB", icon: Database, desc: "NoSQL Schema Design" },
            { name: "Socket.io", icon: Zap, desc: "Real-time Events" },
            { name: "Redis", icon: Layers, desc: "Caching & Pub/Sub" },
            { name: "Auth (JWT)", icon: Shield, desc: "Stateless Security" },
        ],
    },
    {
        category: "DevOps & Tools",
        items: [
            { name: "Docker", icon: Cloud, desc: "Containerization" },
            { name: "AWS", icon: Cloud, desc: "S3, EC2 Basics" },
            { name: "Git", icon: GanttChart, desc: "Version Control" },
            { name: "Sentry", icon: Shield, desc: "Error Monitoring" },
        ],
    },
];

export default function TechStack() {
    return (
        <section id="tech" className="py-32 bg-background relative overflow-hidden">
            <div className="container px-6 mx-auto relative z-10">
                <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                    The Toolbox
                </h2>
                <h3 className="text-4xl font-bold text-white mb-16">
                    Technologies & Frameworks
                </h3>

                <div className="space-y-16">
                    {techStack.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h4 className="text-xl font-bold text-white mb-8 border-l-2 border-primary pl-4">
                                {category.category}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {category.items.map((item, itemIndex) => (
                                    <motion.div
                                        key={itemIndex}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: itemIndex * 0.05 }}
                                        viewport={{ once: true }}
                                        className="group relative p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-primary/50 transition-all cursor-default"
                                    >
                                        <div className="mb-3">
                                            <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="font-bold text-white text-sm">{item.name}</div>

                                        {/* Hover Info */}
                                        <div className="absolute inset-0 bg-background/95 backdrop-blur flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-center">
                                            <span className="text-xs text-primary font-mono">{item.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />
        </section>
    );
}
