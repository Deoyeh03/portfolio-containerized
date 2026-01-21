import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    duration: {
        type: String, // e.g., "Jan 202 - Present"
        required: true,
    },
    achievements: [{
        type: String,
    }],
    techUsed: [{
        type: String,
    }],
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Experience = mongoose.model('Experience', experienceSchema);
export default Experience;
