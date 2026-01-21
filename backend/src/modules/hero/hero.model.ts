import mongoose from 'mongoose';

export interface IHero extends mongoose.Document {
    greeting: string;
    headline: string;
    highlightWord: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const heroSchema = new mongoose.Schema({
    greeting: {
        type: String,
        required: true,
        default: 'System Online // V.3.0'
    },
    headline: {
        type: String,
        required: true,
        default: 'Engineering the future with systems that speak for themselves.'
    },
    highlightWord: {
        type: String,
        default: 'systems'
    },
    description: {
        type: String,
        required: true,
        default: 'Senior Full-Stack Engineer specializing in scalable backend architecture, real-time systems, and experimental interfaces.'
    },
    ctaText: {
        type: String,
        default: 'Explore Projects'
    },
    ctaLink: {
        type: String,
        default: '#projects'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model<IHero>('Hero', heroSchema);
