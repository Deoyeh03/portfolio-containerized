import express from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { 
    createInvoice, 
    getAllInvoices, 
    getInvoiceById, 
    updateInvoice, 
    deleteInvoice,
    generatePDF 
} from './invoice.controller';

const router = express.Router();

// All routes are protected (admin only)
router.use(protect);

router.post('/', createInvoice);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/:id/pdf', generatePDF);

export default router;
