"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Home, Briefcase, Code2, Mail, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
    { name: "Hero", icon: Home, id: "hero" },
    { name: "Journey", icon: Code2, id: "journey" },
    { name: "Projects", icon: Briefcase, id: "projects" },
    { name: "Tech", icon: Code2, id: "tech-stack" },
    { name: "Activity", icon: Code2, id: "activity" },
    { name: "Contact", icon: Mail, id: "contact" },
];

export default function FloatingNav() {
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState("hero");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        navItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [mounted]);

    const scrollToSection = (id: string) => {
        setActive(id);
        setMobileMenuOpen(false); // Close mobile menu on navigation
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Desktop Floating Nav (lg+) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 p-2"
            >
                <div className="flex flex-col gap-4 bg-background/50 backdrop-blur-md border border-white/10 p-3 rounded-full">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-white/10"
                            aria-label={item.name}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors duration-300",
                                    active === item.id ? "text-primary" : "text-muted-foreground group-hover:text-white"
                                )}
                            />

                            {/* Tooltip Label */}
                            <span className="absolute left-full ml-3 px-2 py-1 bg-background/80 backdrop-blur-sm border border-white/10 rounded text-xs text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                                {item.name}
                            </span>

                            {/* Active Indicator */}
                            {active === item.id && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-white/5 rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Logo */}
            <div className="fixed top-6 left-6 z-50 pointer-events-none mix-blend-difference">
                 <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>

            {/* Mobile Hamburger Button (< lg) */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed top-6 right-6 z-50 lg:hidden p-3 bg-background/80 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all"
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Menu className="w-6 h-6 text-white" />
                )}
            </motion.button>

            {/* Mobile Menu Overlay (< lg) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 h-full w-64 bg-background border-l border-white/10 p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-6 mt-20">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                                            active === item.id
                                                ? "bg-primary/20 text-primary border border-primary/30"
                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-base font-medium">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
