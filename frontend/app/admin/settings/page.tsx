"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';

interface SiteSettings {
    _id?: string;
    siteName: string;
    logoUrl: string;
    favicon: string;
    socialLinks: {
        github: string;
        linkedin: string;
        twitter: string;
        email: string;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    theme: {
        primaryColor: string;
        accentColor: string;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [keywords, setKeywords] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data);
            setKeywords(res.data.seo?.keywords?.join(', ') || '');
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const updatedSettings = {
                ...settings,
                seo: {
                    ...settings.seo,
                    keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
                }
            };
            await api.put('/settings', updatedSettings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading || !settings) {
        return (
            <AdminLayout activePage="settings">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout activePage="settings">
            <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
                        <p className="text-muted-foreground mt-1">Configure global site settings and branding</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Settings
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message}
                    </div>
                )}

                {/* General Settings */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">General</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Logo URL</label>
                            <input
                                type="text"
                                value={settings.logoUrl}
                                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Social Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub</label>
                            <input
                                type="text"
                                value={settings.socialLinks.github}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, github: e.target.value } })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">LinkedIn</label>
                            <input
                                type="text"
                                value={settings.socialLinks.linkedin}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Twitter</label>
                            <input
                                type="text"
                                value={settings.socialLinks.twitter}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                            <input
                                type="email"
                                value={settings.socialLinks.email}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, email: e.target.value } })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">SEO</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Page Title</label>
                            <input
                                type="text"
                                value={settings.seo.title}
                                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Meta Description</label>
                            <textarea
                                value={settings.seo.description}
                                onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })}
                                rows={2}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Keywords (comma-separated)</label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                placeholder="Backend Engineer, Full-Stack, Node.js"
                            />
                        </div>
                    </div>
                </div>

                {/* Theme Settings */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.theme.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                                    className="w-12 h-12 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.theme.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                                    className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.theme.accentColor}
                                    onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                                    className="w-12 h-12 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={settings.theme.accentColor}
                                    onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                                    className="flex-1 px-4 py-3 bg-black border border-white/10 rounded-lg text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
