import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from './skill.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, admin, createSkill);
router.put('/:id', protect, admin, updateSkill);
router.delete('/:id', protect, admin, deleteSkill);

export default router;
