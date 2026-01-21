import express from 'express';
import { getExperiences, getEducation, createExperience, updateExperience, deleteExperience } from './experience.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getExperiences);
router.get('/education', getEducation);
router.post('/', protect, admin, createExperience);
router.put('/:id', protect, admin, updateExperience);
router.delete('/:id', protect, admin, deleteExperience);

export default router;
