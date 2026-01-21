import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g., "Backend", "Frontend", "DevOps"
        required: true,
    },
    proficiency: {
        type: Number, // 1-100
        default: 80,
    },
    summary: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // lucide icon name
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
