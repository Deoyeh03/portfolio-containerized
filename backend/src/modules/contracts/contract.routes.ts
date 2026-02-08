import express from 'express';
import { protect } from '../../middlewares/auth.middleware';
import { 
    createContract, 
    getAllContracts, 
    getContractById, 
    updateContract, 
    deleteContract 
} from './contract.controller';

const router = express.Router();

// All routes are protected (admin only)
router.use(protect);

router.post('/', createContract);
router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router;
