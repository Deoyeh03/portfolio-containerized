import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectBySlug } from './project.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

// Public
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);

export default router;
