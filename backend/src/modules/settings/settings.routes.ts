import express from 'express';
import { getSettings, updateSettings } from './settings.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);

export default router;
