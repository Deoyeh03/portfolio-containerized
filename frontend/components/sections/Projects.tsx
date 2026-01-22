"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { Github, Globe, Loader2, Terminal, Layers } from "lucide-react";
import ReactMarkdown from 'react-markdown';
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
                                    {/* Card Content - Website Preview / Screenshot */}
                                    <div className="relative aspect-video w-full overflow-hidden bg-[#0A0A0A]">
                                        {project.screenshot ? (
                                            <div className="absolute inset-0 z-0">
                                                <Image 
                                                    src={project.screenshot} 
                                                    alt={project.title} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                                            </div>
                                        ) : project.liveUrl ? (
                                            <div className="absolute inset-0 z-0">
                                                <iframe 
                                                    src={project.liveUrl} 
                                                    className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700 blur-[1px] group-hover:blur-0"
                                                    tabIndex={-1}
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors pointer-events-auto" />
                                            </div>
                                        ) : (
                                            // Fallback: Terminal / System Preview (for backend projects without visual link)
                                            <div className="absolute inset-0 p-6 flex flex-col justify-between font-mono text-xs bg-[#0F0F0F] select-none overflow-hidden">
                                                {/* Terminal Header */}
                                                <div className="flex gap-1.5 mb-2 opacity-50">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                                </div>
                                                
                                                {/* Code/Logs */}
                                                <div className="space-y-1 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-2">
                                                        <span className="text-blue-500">➜</span>
                                                        <span className="text-purple-500">~/{project.slug}</span>
                                                        <span className="text-white">npm run deploy</span>
                                                    </div>
                                                    <div className="pl-4 border-l border-white/10 mt-2 space-y-0.5 text-[10px]">
                                                        <div className="text-green-500/80">✔ Building backend microservices...</div>
                                                        <div>• Optimizing Docker containers</div>
                                                        <div>• Verifying MongoDB schema</div>
                                                        <div className="text-green-500/80">✔ Deployment successful</div>
                                                        <div className="animate-pulse text-primary mt-1">
                                                            &gt; Server listening on port 5000...
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mini Visualization (Abstract Graph) */}
                                                <div className="absolute bottom-0 right-0 w-32 h-20 opacity-20 group-hover:opacity-40 transition-opacity">
                                                    <div className="flex items-end justify-end gap-0.5 h-full px-4 pb-4">
                                                        {[60, 40, 75, 50, 90, 30, 80, 55, 95, 45].map((h, i) => (
                                                            <div 
                                                                key={i} 
                                                                className="w-1.5 bg-primary rounded-t-sm" 
                                                                style={{ height: `${h}%` }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Overlay Gradient (Consistent across all types) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none" />
                                        
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

                        {/* Details / About Section */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-white/10">
                            {/* Main Content (Markdown) */}
                            <div className="md:col-span-8 space-y-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        About the Project
                                    </h3>
                                    <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-white prose-strong:text-primary prose-a:text-primary hover:prose-a:underline">
                                        <ReactMarkdown>{selectedProject.fullDescription}</ReactMarkdown>
                                    </div>
                                </div>

                                {selectedProject.architecture && (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-primary" /> Architecture & Data Flow
                                        </h4>
                                        <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
                                            <ReactMarkdown>{selectedProject.architecture}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {selectedProject.challenges && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Terminal className="w-5 h-5 text-primary" /> Engineering Challenges
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                                            &ldquo;{selectedProject.challenges}&rdquo;
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Info */}
                            <div className="md:col-span-4 space-y-8">
                                {/* Key Stats / Meta */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">Project Meta</h4>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-[10px] uppercase text-muted-foreground font-mono">Category</span>
                                            <span className="text-white font-medium">{selectedProject.category}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg border border-white/10">
                                            <span className="text-[10px] uppercase text-muted-foreground font-mono">Status</span>
                                            <span className="text-green-500 font-bold flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Live & Active
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Legend */}
                                <div>
                                    <h4 className="text-xs font-mono text-primary tracking-widest uppercase mb-4">Skillset Used</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.techStack.map(tech => (
                                            <span key={tech} className="px-3 py-1.5 bg-black/50 text-white border border-white/10 rounded-md text-xs font-medium hover:border-primary/50 transition-colors">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
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

