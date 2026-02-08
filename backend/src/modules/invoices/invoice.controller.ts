import { Request, Response } from 'express';
import Invoice from './invoice.model';
import { generateInvoicePDF } from './invoice.service';
import logger from '../../utils/logger';

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const invoiceData = req.body;
        
        // Generate invoice number if not provided
        if (!invoiceData.invoiceNumber) {
            const count = await Invoice.countDocuments();
            invoiceData.invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;
        }

        const invoice = new Invoice(invoiceData);
        await invoice.save();

        res.status(201).json(invoice);
    } catch (error) {
        logger.error('Create Invoice Error', error);
        res.status(500).json({ message: 'Failed to create invoice', error: String(error) });
    }
};

export const getAllInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        logger.error('Get Invoices Error', error);
        res.status(500).json({ message: 'Failed to fetch invoices', error: String(error) });
    }
};

export const getInvoiceById = async (req: Request, res: Response) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        logger.error('Get Invoice Error', error);
        res.status(500).json({ message: 'Failed to fetch invoice', error: String(error) });
    }
};

export const updateInvoice = async (req: Request, res: Response) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        logger.error('Update Invoice Error', error);
        res.status(500).json({ message: 'Failed to update invoice', error: String(error) });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        logger.error('Delete Invoice Error', error);
        res.status(500).json({ message: 'Failed to delete invoice', error: String(error) });
    }
};

export const generatePDF = async (req: Request, res: Response) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const pdfPath = await generateInvoicePDF(invoice.toObject());
        
        // Update invoice with PDF path
        invoice.pdfUrl = pdfPath;
        await invoice.save();

        // Send the PDF file
        res.download(pdfPath);
    } catch (error) {
        logger.error('Generate PDF Error', error);
        res.status(500).json({ message: 'Failed to generate PDF', error: String(error) });
    }
};
