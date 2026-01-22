"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, Plus, Trash2, Edit2, Check, X, Eye, Code, Layers, ShieldCheck, Cpu, ToggleLeft, ToggleRight, Clock, Copy, Github, Globe } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import Modal from "@/components/ui/Modal"; // Ensure this path is correct based on your project structure

export interface Project {
    _id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    fullDescription: string;
    techStack: string[];
    architecture?: string;
    challenges?: string;
    isPublished: boolean;
    liveUrl?: string; // Added field
    githubUrl?: string; // Added field
    screenshot?: string;
    media?: string[];
    aiSummary?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    
    const [formData, setFormData] = useState<Partial<Project>>({
        title: "",
        slug: "",
        category: "",
        summary: "",
        fullDescription: "",
        techStack: [],
        architecture: "",
        challenges: "",
        isPublished: false,
        liveUrl: "",
        githubUrl: "",
        screenshot: "",
    });

    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects"); 
            setProjects(res.data);
            setLoading(false);
        } catch (error: any) {
            console.error("Error fetching projects", error);
            setLoading(false);
            if (error.response?.status === 401) {
                window.location.href = '/admin/login';
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'techStack') {
            setFormData(prev => ({ ...prev, techStack: value.split(',').map(s => s.trim()).filter(s => s !== "") }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/projects/${editingId}`, formData);
            } else {
                await api.post("/projects", formData);
            }
            closeModal();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project", error);
        }
    };

    const handleTogglePublish = async (projectId: string, currentStatus: boolean) => {
        try {
            await api.put(`/projects/${projectId}`, { isPublished: !currentStatus });
            fetchProjects();
        } catch (error) {
            console.error("Error toggling publish status", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project", error);
        }
    };

    const handleDuplicate = async (project: Project) => {
        try {
            const duplicatedProject = {
                ...project,
                title: `${project.title} (Copy)`,
                slug: `${project.slug}-copy`,
                isPublished: false,
                _id: undefined
            };
            await api.post("/projects", duplicatedProject);
            fetchProjects();
        } catch (error) {
            console.error("Error duplicating project", error);
        }
    };

    const openModalForCreate = () => {
        setEditingId(null);
        setFormData({ title: "", slug: "", category: "", summary: "", fullDescription: "", techStack: [], architecture: "", challenges: "", isPublished: false, liveUrl: "", githubUrl: "", screenshot: "" });
        setIsModalOpen(true);
        setActiveTab("edit");
    };

    const openModalForEdit = (project: Project) => {
        setEditingId(project._id);
        setFormData(project);
        setIsModalOpen(true);
        setActiveTab("edit");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Engineering Case Studies</h2>
                <button 
                    onClick={openModalForCreate}
                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
                >
                    <Plus size={18} /> New Architecture
                </button>
            </div>

            {/* Project Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-24 text-muted-foreground border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                        <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No system case studies deployed.</p>
                        <p className="text-sm">Start building your engineering narrative.</p>
                    </div>
                ) : (
                    projects.map(project => (
                        <div key={project._id} className="group flex flex-col bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-primary/30 transition-all h-full">
                            <div className="p-6 flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Layers size={20} />
                                    </div>
                                    {project.isPublished ? (
                                        <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-1 rounded-full border border-green-500/20 font-bold">PUBLISHED</span>
                                    ) : (
                                        <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-1 rounded-full border border-red-500/20 font-bold">DRAFT</span>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h4>
                                    <p className="text-sm text-primary/70 mb-2">{project.category}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.summary}</p>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5"><Globe size={10}/> Live</a>}
                                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5"><Github size={10}/> Code</a>}
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between rounded-b-xl">
                                <span className="flex items-center gap-1 text-[10px] font-mono opacity-50">
                                    <Clock size={10} />
                                    {new Date(project.updatedAt || project.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleTogglePublish(project._id, project.isPublished)}
                                        className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-primary transition-colors"
                                        title={project.isPublished ? "Unpublish" : "Publish"}
                                    >
                                        {project.isPublished ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                    </button>
                                    <button onClick={() => handleDuplicate(project)} className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white transition-colors" title="Duplicate">
                                        <Copy size={16} />
                                    </button>
                                    <button onClick={() => openModalForEdit(project)} className="p-2 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white transition-colors" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(project._id)} className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit/Create Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit System Architecture" : "New Engineering Case Study"}>
                <div className="mt-4">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10 mb-6">
                        <button 
                            onClick={() => setActiveTab("edit")}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${activeTab === "edit" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                        >
                            <Code size={16} /> Edit Details
                        </button>
                        <button 
                            onClick={() => setActiveTab("preview")}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${activeTab === "preview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                        >
                            <Eye size={16} /> Live Preview
                        </button>
                    </div>

                    {activeTab === "edit" ? (
                        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">Title</label>
                                    <input 
                                        name="title" value={formData.title} onChange={handleChange} required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="Enterprise TaskManager"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">Slug</label>
                                    <input 
                                        name="slug" value={formData.slug} onChange={handleChange} required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="taskmanager-v1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">Category</label>
                                    <input 
                                        name="category" value={formData.category} onChange={handleChange} required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="Distributed Systems"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">Tech Stack (CSV)</label>
                                    <input 
                                        name="techStack" value={formData.techStack?.join(', ')} onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="Node.js, Redis, Docker"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary uppercase">Engineering Summary</label>
                                <textarea 
                                    name="summary" value={formData.summary} onChange={handleChange} required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary h-20 transition-all"
                                    placeholder="High-level overview of the system impact..."
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">Live Demo URL</label>
                                    <input 
                                        name="liveUrl" value={formData.liveUrl} onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary uppercase">GitHub Repository URL</label>
                                    <input 
                                        name="githubUrl" value={formData.githubUrl} onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all"
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary uppercase flex items-center gap-2">
                                    <Globe size={12} /> Project Card Image (Screenshot URL)
                                </label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            name="screenshot" value={formData.screenshot} onChange={handleChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary transition-all text-sm"
                                            placeholder="https://example.com/screenshot.png"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">Tip: Use a high-quality 16:9 image showing the Hero section.</p>
                                    </div>
                                    {formData.screenshot && (
                                        <div className="relative w-24 aspect-video rounded-lg border border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
                                            <img src={formData.screenshot} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary uppercase">Architecture (Markdown)</label>
                                <textarea 
                                    name="architecture" value={formData.architecture} onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 font-mono text-sm text-white focus:outline-none focus:border-primary h-32 transition-all"
                                    placeholder="### Data Flow\n- User -> Nginx -> Express..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary uppercase">Engineering Challenges</label>
                                <textarea 
                                    name="challenges" value={formData.challenges} onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary h-32 transition-all"
                                    placeholder="Describe a critical bottleneck and how you solved it..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary uppercase">Full Case Study (Markdown)</label>
                                <textarea 
                                    name="fullDescription" value={formData.fullDescription} onChange={handleChange} required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-primary h-40 transition-all"
                                    placeholder="Detailed project breakdown..."
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isPublished} 
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                    className="w-5 h-5 accent-primary"
                                />
                                <span className="text-sm font-bold">Publish to Global Portfolio</span>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 mt-4 pb-1">
                                <button type="submit" className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-all">
                                    <Check size={18} /> {editingId ? "Update System" : "Deploy Case Study"}
                                </button>
                                <button type="button" onClick={closeModal} className="px-8 border border-white/10 rounded-lg hover:bg-white/5 flex items-center gap-2 transition-all">
                                    <X size={18} /> Discard
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-500 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="border-b border-white/10 pb-6">
                                <h1 className="text-4xl font-bold text-white mb-2">{formData.title || "Untitled Project"}</h1>
                                <p className="text-primary font-mono text-sm tracking-widest uppercase">{formData.category || "General Engineering"}</p>
                            </div>
                            <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-white">
                                <ReactMarkdown>{formData.fullDescription || "_No description provided._"}</ReactMarkdown>
                                {formData.architecture && (
                                    <>
                                        <h3 className="flex items-center gap-2 text-white mt-8"><Layers className="w-5 h-5 text-primary" /> Architecture</h3>
                                        <ReactMarkdown>{formData.architecture}</ReactMarkdown>
                                    </>
                                )}
                                {formData.challenges && (
                                    <>
                                        <h3 className="flex items-center gap-2 text-white mt-8"><Cpu className="w-5 h-5 text-primary" /> Engineering Challenges</h3>
                                        <p className="text-muted-foreground">{formData.challenges}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
