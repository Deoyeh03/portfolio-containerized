import express from 'express';
import { logEvent, getStats } from './analytics.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.post('/event', logEvent);
router.get('/stats', protect, admin, getStats); // Admin only

export default router;
