"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';

interface HeroData {
    _id?: string;
    greeting: string;
    headline: string;
    highlightWord: string;
    description: string;
    ctaText: string;
    ctaLink: string;
}

export default function HeroEditorPage() {
    const [hero, setHero] = useState<HeroData>({
        greeting: '',
        headline: '',
        highlightWord: '',
        description: '',
        ctaText: '',
        ctaLink: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const res = await api.get('/hero');
            setHero(res.data);
        } catch (error) {
            console.error('Error fetching hero:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/hero', hero);
            setMessage('Hero content saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving hero content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout activePage="hero">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="hero">
            <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Hero Section</h1>
                        <p className="text-muted-foreground mt-1">Edit the main hero content displayed on homepage</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Greeting Text
                        </label>
                        <input
                            type="text"
                            value={hero.greeting}
                            onChange={(e) => setHero({ ...hero, greeting: e.target.value })}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                            placeholder="System Online // V.3.0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Main Headline
                        </label>
                        <textarea
                            value={hero.headline}
                            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none resize-none"
                            placeholder="Engineering the future with systems that speak for themselves."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Highlight Word (shown in primary color)
                        </label>
                        <input
                            type="text"
                            value={hero.highlightWord}
                            onChange={(e) => setHero({ ...hero, highlightWord: e.target.value })}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                            placeholder="systems"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Description
                        </label>
                        <textarea
                            value={hero.description}
                            onChange={(e) => setHero({ ...hero, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none resize-none"
                            placeholder="Senior Full-Stack Engineer specializing in..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                CTA Button Text
                            </label>
                            <input
                                type="text"
                                value={hero.ctaText}
                                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                                placeholder="Explore Projects"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                CTA Button Link
                            </label>
                            <input
                                type="text"
                                value={hero.ctaLink}
                                onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:border-primary focus:outline-none"
                                placeholder="#projects"
                            />
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
                    <div className="bg-gradient-to-br from-black to-gray-900 border border-white/10 p-8 rounded-2xl">
                        <p className="text-primary font-mono text-sm tracking-widest mb-4 uppercase">
                            {hero.greeting}
                        </p>
                        <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4 leading-tight">
                            {hero.headline.split(hero.highlightWord).map((part, i, arr) => (
                                <span key={i}>
                                    {part}
                                    {i < arr.length - 1 && <span className="text-primary">{hero.highlightWord}</span>}
                                </span>
                            ))}
                        </h1>
                        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed mb-6">
                            {hero.description}
                        </p>
                        <button className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white font-medium">
                            {hero.ctaText}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
