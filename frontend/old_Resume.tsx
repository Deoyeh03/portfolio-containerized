"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, Calendar } from "lucide-react";

interface Experience {
    company: string;
    role: string;
    period: string;
    description: string[];
}

const experiences: Experience[] = [
    {
        company: "TechFlow Systems",
        role: "Senior Full-Stack Engineer",
        period: "2021 - Present",
        description: [
            "Architected a real-time collaboration platform serving 10k+ daily users.",
            "Reduced API latency by 40% through Redis caching strategies.",
            "Led a team of 4 juniors, establishing code review standards.",
        ],
    },
    {
        company: "DataStream Corp",
        role: "Backend Developer",
        period: "2019 - 2021",
        description: [
            "Built resilient microservices using Node.js and NestJS.",
            "Implemented OAuth2 authentication across 3 internal products.",
            "Optimized MongoDB aggregations for analytics dashboard.",
        ],
    },
    {
        company: "Creative Web Agency",
        role: "Junior Web Developer",
        period: "2018 - 2019",
        description: [
            "Developed responsive UI components using React and GSAP.",
            "Collaborated with designers to implement pixel-perfect layouts.",
        ],
    },
];

export default function Resume() {
    return (
        <section id="contact" className="py-32 bg-background border-t border-white/5">
            {/* Note: ID contact used for Nav link compatibility, though this is Resume */}
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

                <div className="space-y-12 max-w-4xl mx-auto">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-8 border-l border-white/10 hover:border-primary transition-colors group"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />

                            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                                <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                    {exp.company}
                                </h4>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                                    <Calendar className="w-4 h-4" /> {exp.period}
                                </div>
                            </div>

                            <h5 className="text-lg text-white/80 mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" /> {exp.role}
                            </h5>

                            <ul className="space-y-2">
                                {exp.description.map((item, i) => (
                                    <li key={i} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                                        <span className="mt-2 w-1 h-1 rounded-full bg-white/20" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Footer */}
                <div className="mt-32 text-center">
                    <h3 className="text-3xl font-bold text-white mb-6">Ready to build something extraordinary?</h3>
                    <a href="mailto:hello@example.com" className="text-xl text-primary underline underline-offset-4 hover:text-white transition-colors">
                        hello@example.com
                    </a>
                </div>
            </div>
        </section>
    );
}
