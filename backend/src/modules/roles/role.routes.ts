import express from 'express';
import { getRoles, getRole, createRole, updateRole, deleteRole } from './role.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', protect, admin, createRole);
router.put('/:id', protect, admin, updateRole);
router.delete('/:id', protect, admin, deleteRole);

export default router;
