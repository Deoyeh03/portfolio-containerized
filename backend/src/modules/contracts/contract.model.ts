import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
    contractNumber: {
        type: String,
        required: true,
        unique: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    clientCompany: {
        type: String,
    },
    projectTitle: {
        type: String,
        required: true,
    },
    projectScope: {
        type: String,
        required: true,
    },
    deliverables: [{
        title: String,
        description: String,
        deadline: Date,
    }],
    paymentTerms: {
        totalAmount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'USD',
        },
        milestones: [{
            description: String,
            percentage: Number,
            amount: Number,
            dueDate: Date,
        }],
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'signed', 'active', 'completed', 'terminated'],
        default: 'draft',
    },
    terms: {
        type: String,
        required: true,
    },
    pdfUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Contract', contractSchema);
