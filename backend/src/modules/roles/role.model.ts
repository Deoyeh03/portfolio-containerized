import mongoose from 'mongoose';

export interface IRole extends mongoose.Document {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'Briefcase',
        enum: ['Server', 'Database', 'Globe', 'Shield', 'Wrench', 'Briefcase', 'Code', 'Layers', 'Zap', 'Lock']
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model<IRole>('Role', roleSchema);
