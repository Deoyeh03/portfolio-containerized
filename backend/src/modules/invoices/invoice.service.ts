import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    projectDescription: string;
    items: Array<{
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    issueDate: Date;
    dueDate: Date;
    notes?: string;
}

export const generateInvoicePDF = async (invoiceData: InvoiceData): Promise<string> => {
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `invoice-${invoiceData.invoiceNumber}.pdf`;
    const filePath = path.join(__dirname, '../../../uploads/invoices', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(28).fillColor('#4CAF50').text('INVOICE', 50, 50);
    
    doc.fontSize(10).fillColor('#000000');
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 400, 50);
    doc.text(`Issue Date: ${new Date(invoiceData.issueDate).toDateString()}`, 400, 65);
    doc.text(`Due Date: ${new Date(invoiceData.dueDate).toDateString()}`, 400, 80);

    // Developer Info (Left)
    doc.fontSize(10);
    doc.text('From:', 50, 120);
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('[Your Name]', 50, 140);
    doc.fontSize(10).font('Helvetica');
    doc.text('Senior Full-Stack Engineer', 50, 155);
    doc.text('[Your Email]', 50, 170);
    doc.text('[Your Address]', 50, 185);

    // Client Info (Right)
    doc.fontSize(10);
    doc.text('Bill To:', 350, 120);
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(invoiceData.clientName, 350, 140);
    doc.fontSize(10).font('Helvetica');
    doc.text(invoiceData.clientEmail, 350, 155);
    if (invoiceData.clientAddress) {
        doc.text(invoiceData.clientAddress, 350, 170);
    }

    // Project Description
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Project:', 50, 220);
    doc.fontSize(10).font('Helvetica');
    doc.text(invoiceData.projectDescription, 50, 235, { width: 500 });

    // Items Table
    const tableTop = 280;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Description', 50, tableTop);
    doc.text('Qty', 320, tableTop);
    doc.text('Rate', 380, tableTop);
    doc.text('Amount', 480, tableTop, { align: 'right' });

    doc.strokeColor('#CCCCCC').moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Items
    let yPosition = tableTop + 25;
    doc.font('Helvetica');
    invoiceData.items.forEach((item) => {
        doc.text(item.description, 50, yPosition, { width: 250 });
        doc.text(item.quantity.toString(), 320, yPosition);
        doc.text(`${invoiceData.currency} ${item.rate.toFixed(2)}`, 380, yPosition);
        doc.text(`${invoiceData.currency} ${item.amount.toFixed(2)}`, 480, yPosition, { align: 'right' });
        yPosition += 25;
    });

    // Totals
    yPosition += 10;
    doc.strokeColor('#CCCCCC').moveTo(350, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 15;

    doc.text('Subtotal:', 350, yPosition);
    doc.text(`${invoiceData.currency} ${invoiceData.subtotal.toFixed(2)}`, 480, yPosition, { align: 'right' });

    yPosition += 20;
    doc.text('Tax:', 350, yPosition);
    doc.text(`${invoiceData.currency} ${invoiceData.tax.toFixed(2)}`, 480, yPosition, { align: 'right' });

    yPosition += 20;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total:', 350, yPosition);
    doc.text(`${invoiceData.currency} ${invoiceData.total.toFixed(2)}`, 480, yPosition, { align: 'right' });

    // Notes
    if (invoiceData.notes) {
        yPosition += 50;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Notes:', 50, yPosition);
        doc.font('Helvetica');
        doc.text(invoiceData.notes, 50, yPosition + 15, { width: 500 });
    }

    // Footer
    doc.fontSize(8).fillColor('#888888');
    doc.text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
};
