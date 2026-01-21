import express from 'express';
import { getDashboardStats } from './admin.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);

export default router;
