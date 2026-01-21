import mongoose from 'mongoose';

export interface ISiteSettings extends mongoose.Document {
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
    createdAt: Date;
    updatedAt: Date;
}

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'Portfolio'
    },
    logoUrl: {
        type: String,
        default: '/logo.png'
    },
    favicon: {
        type: String,
        default: '/favicon.ico'
    },
    socialLinks: {
        github: { type: String, default: 'https://github.com/Deoyeh03' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    seo: {
        title: { type: String, default: 'Portfolio - Senior Full-Stack Engineer' },
        description: { type: String, default: 'Backend-focused full-stack engineer specializing in scalable systems' },
        keywords: [{ type: String }]
    },
    theme: {
        primaryColor: { type: String, default: '#00ff9d' },
        accentColor: { type: String, default: '#0a0a0a' }
    }
}, { timestamps: true });

export default mongoose.model<ISiteSettings>('SiteSettings', settingsSchema);
