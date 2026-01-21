"use client";

import { GitHubCalendar } from 'react-github-calendar';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from 'react';
import { Info, Server, Database, TrendingUp, Layers } from 'lucide-react';

export default function GitHubHeatmap() {
    const [activeInfo, setActiveInfo] = useState<"fullstack" | "scalable" | null>(null);

    return (
        <section id="activity" className="py-24 bg-background/50 border-t border-white/5">
            <div className="container px-6 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                        Development Cycles
                    </h2>
                    <h3 className="text-4xl font-bold text-white">
                        GitHub Contribution Graph
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-black/20 border border-white/10 p-6 md:p-10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group"
                >
                     {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 w-[500px] h-[300px] bg-primary/5 blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full" />

                    <div className="relative z-10 w-full flex justify-center overflow-x-auto pb-2">
                        <GitHubCalendar 
                            username="Deoyeh03" 
                            colorScheme='dark'
                            fontSize={12}
                            blockSize={13}
                            blockMargin={4}
                            theme={{
                                dark: ['#0f0f0f', '#06402B', '#037544', '#00cf78', '#00ff9d'],
                            }}
                        />
                    </div>
                    
                    <div className="mt-8 relative z-20 flex flex-wrap gap-8 justify-center">
                        {/* Interactive Legend 1 */}
                        <div className="relative">
                            <button 
                                onClick={() => setActiveInfo(activeInfo === "fullstack" ? null : "fullstack")}
                                onMouseEnter={() => setActiveInfo("fullstack")}
                                onMouseLeave={() => setActiveInfo(null)}
                                className="flex items-center gap-3 text-sm font-mono text-muted-foreground hover:text-white transition-colors cursor-help group/btn"
                            >
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                                Full-Stack Architecture
                                <Info size={14} className="opacity-50 group-hover/btn:opacity-100" />
                            </button>
                            
                            <AnimatePresence>
                                {activeInfo === "fullstack" && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0A0A0A] border border-white/20 p-4 rounded-xl shadow-2xl z-50 text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 text-primary">
                                            <Layers size={16} />
                                            <h4 className="font-bold text-xs uppercase tracking-wider">The "Full Stack" Approach</h4>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            Beyond just frontend/backend. It means owning the <span className="text-white font-bold">entire lifecycle</span>: from database schema design (MongoDB/SQL) to API security, UI implementation, and deployment pipelines.
                                        </p>
                                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A0A0A] border-b border-r border-white/20 rotate-45"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Interactive Legend 2 */}
                        <div className="relative">
                            <button 
                                onClick={() => setActiveInfo(activeInfo === "scalable" ? null : "scalable")}
                                onMouseEnter={() => setActiveInfo("scalable")}
                                onMouseLeave={() => setActiveInfo(null)}
                                className="flex items-center gap-3 text-sm font-mono text-muted-foreground hover:text-white transition-colors cursor-help group/btn"
                            >
                                <span className="w-3 h-3 bg-white/20 rounded-full group-hover/btn:bg-white/40 transition-colors" /> 
                                Scalable Systems
                                <Info size={14} className="opacity-50 group-hover/btn:opacity-100" />
                            </button>

                            <AnimatePresence>
                                {activeInfo === "scalable" && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0A0A0A] border border-white/20 p-4 rounded-xl shadow-2xl z-50 text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2 text-primary">
                                            <TrendingUp size={16} />
                                            <h4 className="font-bold text-xs uppercase tracking-wider">Building for Scale</h4>
                                        </div>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            Designing systems that handle growth gracefully. Using <span className="text-white font-bold">microservices</span>, caching strategies (Redis), load balancing, and efficient database queries to maintain performance under load.
                                        </p>
                                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A0A0A] border-b border-r border-white/20 rotate-45"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
