"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { Github, Globe, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import { useProjects, Project } from "@/hooks/useApi"; // Import hook
import { useAnalytics } from "@/hooks/useAnalytics";

// Dynamically import Swiper to avoid SSR issues
const Swiper = dynamic(() => import('swiper/react').then(mod => mod.Swiper), { ssr: false });
const SwiperSlide = dynamic(() => import('swiper/react').then(mod => mod.SwiperSlide), { ssr: false });

// Dynamically import motion to avoid hydration issues
const motion = dynamic(() => import('framer-motion').then(mod => mod.motion), { ssr: false });

import { Navigation, Pagination, EffectCoverflow, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Using imported Project type from useApi


export default function Projects() {
    const projectsQuery = useProjects();
    const projects: Project[] = projectsQuery.data || [];
    const isLoading = projectsQuery.isLoading;
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // useEffect removed


    const { trackEvent } = useAnalytics();

    const handleOpenModal = (project: Project) => {
        setSelectedProject(project);
        trackEvent("project_view", { projectId: project._id, title: project.title });
    };

    if (isLoading) {
        return (
            <div className="py-32 flex justify-center items-center">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
        );
    }

    return (
        <section id="projects" className="py-32 bg-background border-t border-white/5 relative overflow-hidden" suppressHydrationWarning>
            <div className="container px-6 mx-auto relative z-10">
                <div className="mb-16">
                    <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                        Selected Works
                    </h2>
                    <h3 className="text-4xl font-bold text-white">
                        Engineering Case Studies
                    </h3>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, EffectCoverflow, Mousewheel]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    simulateTouch={true}
                    touchRatio={1}
                    touchAngle={45}
                    threshold={5}
                    longSwipes={true}
                    longSwipesRatio={0.5}
                    longSwipesMs={300}
                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 1,
                        releaseOnEdges: true,
                    }}
                    navigation={false}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    pagination={{ clickable: true }}
                    className="projects-swiper !pb-20 !overflow-visible"
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 30 },
                        1024: { slidesPerView: 2.5, spaceBetween: 40 }
                    }}
                >
                    {projects.map((project, index) => (
                        <SwiperSlide key={project._id} className="max-w-xl">
                            {motion && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    onClick={() => handleOpenModal(project)}
                                    className="group cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
                                >
                                    {/* Card Content - Live Preview or Image */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                                        {project.liveUrl ? (
                                            <div className="absolute inset-0 z-0">
                                                <iframe 
                                                    src={project.liveUrl} 
                                                    className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                                    tabIndex={-1}
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-auto" />
                                            </div>
                                        ) : project.screenshot ? (
                                            <Image 
                                                src={project.screenshot} 
                                                alt={project.title} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                                            />
                                        ) : project.media && project.media.length > 0 ? (
                                            <Image 
                                                src={project.media[0]} 
                                                alt={project.title} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-6xl font-black italic select-none group-hover:text-primary/20 transition-colors">
                                                {project.title.substring(0, 2)}
                                            </div>
                                        )}
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
                                        
                                        <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                                            <div className="text-primary font-mono text-xs mb-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 w-fit flex items-center gap-1">
                                                {project.liveUrl && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block mr-1"></span>}
                                                {project.category}
                                            </div>
                                            <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h4>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Background elements for depth */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Modal */}
            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={selectedProject?.title}
            >
                {selectedProject && (
                    <div className="space-y-8">
                        {/* Top Section: Overview + Tech Stack */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Overview */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">Overview</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {selectedProject.summary}
                                    </p>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {selectedProject.liveUrl && (
                                        <a 
                                            href={selectedProject.liveUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                                        >
                                            <Globe size={18} /> Live Demo
                                        </a>
                                    )}
                                    {selectedProject.githubUrl && (
                                        <a 
                                            href={selectedProject.githubUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
                                        >
                                            <Github size={18} /> Source Code
                                        </a>
                                    )}
                                    {!selectedProject.liveUrl && !selectedProject.githubUrl && (
                                        <div className="text-muted-foreground text-sm italic">
                                            No links available for this project
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h4 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">
                                    Core Tech Stack
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.techStack.map(tech => (
                                        <span key={tech} className="px-3 py-1.5 bg-white/5 text-white border border-white/10 rounded-lg text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Technical Deep Dive */}
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6">Technical Deep Dive</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Feature Card 1 - Clean Architecture */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <h4 className="text-white font-bold mb-2">Clean Architecture</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Separation of concerns using MVC/Service pattern on the backend ensures scalability.
                                    </p>
                                </div>

                                {/* Feature Card 2 - Security */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-white font-bold mb-2">RBAC Security</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Custom middleware implementing Role-Based Access Control protecting granular API endpoints.
                                    </p>
                                </div>

                                {/* Feature Card 3 - Real-Time */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-white font-bold mb-2">Real-Time Engine</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Socket.io event-driven architecture for instant task updates and chat features.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ask the Architect - AI Section */}
                        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="text-primary font-bold text-sm">AI</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">Ask the Architect</h4>
                                    <p className="text-muted-foreground text-sm">
                                        The AI agent has full context on this project&apos;s repo. Ask about decisions, bugs fixed, or scalability.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                                <span className="text-primary/60 text-sm font-mono">
                                    [ AI Chat Placeholder - Connects to Vertex AI ]
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}

