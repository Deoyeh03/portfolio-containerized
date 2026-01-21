"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Loader2 } from "lucide-react";
import CanvasWrapper from "../canvas/CanvasWrapper";
import HeroScene from "../canvas/HeroScene";
import { useHero, Hero as HeroType } from "@/hooks/useApi"; // Import hook

// Use the type from the hook (I need to ensure it's exported or redefine compatible interface)
// Since useApi exports data as any or generic, I'll rely on the interface here but casting might be needed 
// or I should just use the hooked data.


export default function Hero() {
    // Default fallback data matching the original catch block
    const defaultHero = {
        greeting: 'System Online // V.3.0',
        headline: 'Engineering the future with systems that speak for themselves.',
        highlightWord: 'systems',
        description: 'Senior Full-Stack Engineer specializing in scalable backend architecture, real-time systems, and experimental interfaces.',
        ctaText: 'Explore Projects',
        ctaLink: '#projects'
    };

    const { data: heroData, isLoading } = useHero();
    const hero = heroData || defaultHero;

    // Remove old useEffect logic


    // Render headline with highlighted word
    const renderHeadline = (headline: string, highlightWord: string) => {
        if (!highlightWord) return headline;
        const parts = headline.split(highlightWord);
        return parts.map((part, i, arr) => (
            <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-primary">{highlightWord}</span>}
            </span>
        ));
    };

    if (isLoading) {
        return (
            <section id="hero" className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
            </section>
        );
    }

    // Debug log to verify data availability during render
    console.log("Rendering Hero with data:", hero);

    return (
        <section id="hero" className="relative h-screen w-full overflow-hidden bg-black" suppressHydrationWarning>
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <CanvasWrapper>
                    <HeroScene />
                </CanvasWrapper>
            </div>

            {/* Overlay Content */}
            <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-6 lg:px-8 pointer-events-none">
                <div className="max-w-4xl pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                    <h2 className="text-primary font-mono text-sm tracking-widest mb-4 uppercase">
                        {hero.greeting}
                    </h2>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4 md:mb-6 leading-tight">
                        {renderHeadline(hero.headline, hero.highlightWord)}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6 md:mb-8">
                        {hero.description}
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-colors"
                    >
                        {hero.ctaText}
                    </motion.button>
                </motion.div>
            </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground z-10"
            >
                <ArrowDown className="w-6 h-6" />
            </motion.div>

            {/* Gradient Overlay for seamless transition to next section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none" />
        </section>
    );
}
