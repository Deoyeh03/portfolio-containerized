"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, Plus, Trash2, Edit2, Check, X, Briefcase, Zap, Rocket } from "lucide-react";

type ContentType = "resume" | "skills" | "journey";

export default function ContentManager() {
    const [activeTab, setActiveTab] = useState<ContentType>("resume");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    const [formData, setFormData] = useState<any>({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/${activeTab}`);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error(`Error fetching ${activeTab}`, error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setEditingId(null);
        setIsAdding(false);
        setFormData({});
    }, [activeTab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'achievements' || name === 'techUsed') {
            setFormData((prev: any) => ({ ...prev, [name]: value.split('\n').filter((s: string) => s.trim() !== "") }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/${activeTab}/${editingId}`, formData);
            } else {
                await api.post(`/${activeTab}`, formData);
            }
            setIsAdding(false);
            setEditingId(null);
            setFormData({});
            fetchData();
        } catch (error) {
            console.error(`Error saving ${activeTab}`, error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/${activeTab}/${id}`);
            fetchData();
        } catch (error) {
            console.error(`Error deleting ${activeTab}`, error);
        }
    };

    const startEdit = (item: any) => {
        setEditingId(item._id);
        setFormData(item);
        setIsAdding(true);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-6">
                <button 
                    onClick={() => setActiveTab("resume")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "resume" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    <Briefcase size={16} /> Experience
                </button>
                <button 
                    onClick={() => setActiveTab("skills")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "skills" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    <Zap size={16} /> Skills
                </button>
                <button 
                    onClick={() => setActiveTab("journey")}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "journey" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
                >
                    <Rocket size={16} /> Journey
                </button>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold capitalize">{activeTab} Management</h3>
                {!isAdding && (
                    <button 
                        onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); }}
                        className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90"
                    >
                        <Plus size={18} /> Add New
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-black/40 border border-white/10 p-6 rounded-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid md:grid-cols-2 gap-4">
                        {activeTab === "resume" && (
                            <>
                                <input name="company" value={formData.company || ""} onChange={handleChange} placeholder="Company" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <input name="role" value={formData.role || ""} onChange={handleChange} placeholder="Role" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <input name="duration" value={formData.duration || ""} onChange={handleChange} placeholder="Duration (e.g. 2023 - Present)" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <textarea name="achievements" value={formData.achievements?.join('\n') || ""} onChange={handleChange} placeholder="Achievements (one per line)" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white md:col-span-2" rows={4} />
                                <textarea name="techUsed" value={formData.techUsed?.join('\n') || ""} onChange={handleChange} placeholder="Tech Used (one per line)" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white md:col-span-2" rows={2} />
                            </>
                        )}
                        {activeTab === "skills" && (
                            <>
                                <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Skill Name" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <input name="category" value={formData.category || ""} onChange={handleChange} placeholder="Category (e.g. Backend)" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <textarea name="summary" value={formData.summary || ""} onChange={handleChange} placeholder="Summary" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white md:col-span-2" required />
                            </>
                        )}
                        {activeTab === "journey" && (
                            <>
                                <input name="title" value={formData.title || ""} onChange={handleChange} placeholder="Point Title" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <input name="year" value={formData.year || ""} onChange={handleChange} placeholder="Year" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <input name="type" value={formData.type || ""} onChange={handleChange} placeholder="Type (frontend/backend)" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white" required />
                                <textarea name="description" value={formData.description || ""} onChange={handleChange} placeholder="Description" className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-white md:col-span-2" required />
                            </>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-primary text-black font-bold py-2.5 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                            <Check size={18} /> {editingId ? "Save Changes" : "Create Item"}
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-6 border border-white/10 rounded-lg hover:bg-white/5">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
                ) : data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-white/10 rounded-xl">No content found.</div>
                ) : (
                    data.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all">
                            <div>
                                <h4 className="font-bold text-white">{item.company || item.name || item.title}</h4>
                                <p className="text-xs text-muted-foreground">{item.role || item.category || item.year}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(item)} className="p-2 text-muted-foreground hover:text-white"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(item._id)} className="p-2 text-muted-foreground hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
