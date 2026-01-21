"use client";

import { motion } from "framer-motion";
import { Send, Mail, MapPin, Linkedin, Github } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact-form" className="py-32 bg-background relative overflow-hidden" suppressHydrationWarning>
            <div className="container px-6 mx-auto relative z-10" suppressHydrationWarning>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <div className="flex flex-col items-center">
                        <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                            Get In Touch
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center balance">
                            Let's discuss your next engineering challenge.
                        </h3>
                        <p className="text-muted-foreground text-lg mb-12 text-center max-w-2xl">
                            I'm currently available for freelance projects and senior full-time roles.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 w-full max-w-xl mb-12">
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="text-sm text-muted-foreground mb-1">Email</div>
                                <div className="font-bold text-white">onitiriish@gmail.com</div>
                            </div>

                            <div className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="text-sm text-muted-foreground mb-1">Location</div>
                                <div className="font-bold text-white">Lagos, Nigeria</div>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-4 bg-white/5 rounded-full text-white hover:bg-white/10 hover:text-primary border border-white/10 transition-all shadow-lg hover:shadow-primary/20"
                            >
                                <Linkedin className="w-6 h-6" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-4 bg-white/5 rounded-full text-white hover:bg-white/10 hover:text-primary border border-white/10 transition-all shadow-lg hover:shadow-primary/20"
                            >
                                <Github className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
