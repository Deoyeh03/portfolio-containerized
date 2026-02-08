import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
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
    clientAddress: {
        type: String,
    },
    projectDescription: {
        type: String,
        required: true,
    },
    items: [{
        description: String,
        quantity: Number,
        rate: Number,
        amount: Number,
    }],
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        default: 'draft',
    },
    notes: {
        type: String,
    },
    pdfUrl: {
        type: String, // Store generated PDF URL
    },
}, {
    timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);
