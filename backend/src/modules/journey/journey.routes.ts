import express from 'express';
import { getJourneyPoints, createJourneyPoint, updateJourneyPoint, deleteJourneyPoint } from './journey.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getJourneyPoints);
router.post('/', protect, admin, createJourneyPoint);
router.put('/:id', protect, admin, updateJourneyPoint);
router.delete('/:id', protect, admin, deleteJourneyPoint);

export default router;
