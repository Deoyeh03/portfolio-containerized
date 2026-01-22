"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, MessageSquare, Download, Loader2 } from "lucide-react";
import { useResume, Experience } from "@/hooks/useApi";

export default function Resume() {
    const { data: experiences = [], isLoading: loading } = useResume();

    return (
        <section id="resume" className="py-32 bg-background border-t border-white/5">
            <div className="container px-6 mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                            Career Trajectory
                        </h2>
                        <h3 className="text-4xl font-bold text-white">
                            Professional Experience
                        </h3>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4" /> Download Resume
                    </button>
                </div>

                <div className="space-y-12">
                    {loading ? (
                         <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
                    ) : (
                        <div className="space-y-12">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h4 className="text-2xl font-bold text-white">{exp.role}</h4>
                                            <p className="text-primary font-mono">{exp.company}</p>
                                        </div>
                                        <div className="text-muted-foreground font-mono text-sm bg-white/5 px-4 py-1 rounded-full border border-white/10">
                                            {exp.duration}
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i} className="flex gap-3 text-muted-foreground">
                                                <span className="text-primary mt-1.5">•</span>
                                                {achievement}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex flex-wrap gap-2">
                                        {exp.techUsed.map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Footer - Icons Only */}
                <div id="contact" className="mt-32 py-16 border-t border-white/5">
                    <div className="flex justify-center gap-8">
                        <motion.a
                            href="mailto:onitiriish@gmail.com"
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="p-4 bg-white/5 rounded-full text-muted-foreground hover:text-primary hover:bg-white/10 transition-all border border-white/10"
                            title="Gmail"
                        >
                            <Mail className="w-6 h-6" />
                        </motion.a>

                        <motion.a
                            href="https://wa.me/2347014410215"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="p-4 bg-white/5 rounded-full text-muted-foreground hover:text-primary hover:bg-white/10 transition-all border border-white/10"
                            title="WhatsApp"
                        >
                            <MessageSquare className="w-6 h-6" />
                        </motion.a>

                        <motion.a
                            href="https://www.linkedin.com/in/onitiri-adeoye-backend/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="p-4 bg-white/5 rounded-full text-muted-foreground hover:text-primary hover:bg-white/10 transition-all border border-white/10"
                            title="LinkedIn"
                        >
                            <Linkedin className="w-6 h-6" />
                        </motion.a>

                        <motion.a
                            href="https://github.com/Deoyeh03"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="p-4 bg-white/5 rounded-full text-muted-foreground hover:text-primary hover:bg-white/10 transition-all border border-white/10"
                            title="GitHub"
                        >
                            <Github className="w-6 h-6" />
                        </motion.a>
                    </div>
                    <p className="text-center mt-8 text-muted-foreground/50 text-sm font-mono tracking-widest uppercase">
                        Built for performance by Onitiri Adeoye
                    </p>
                </div>
            </div>
        </section>
    );
}
