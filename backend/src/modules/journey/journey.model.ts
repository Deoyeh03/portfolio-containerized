import mongoose from 'mongoose';

const journeyPointSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String, // "frontend", "backend", "milestone"
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

const JourneyPoint = mongoose.model('JourneyPoint', journeyPointSchema);
export default JourneyPoint;
