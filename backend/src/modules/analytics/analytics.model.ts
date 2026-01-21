import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    eventType: { type: String, required: true }, // e.g., 'modal_open', 'ai_chat', 'visit'
    metadata: { type: Object }, // details like projectId, or question asked
    ipHash: { type: String }, // Anonymized IP
}, { timestamps: true });

export default mongoose.model('Analytics', analyticsSchema);
