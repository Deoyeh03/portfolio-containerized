import express from 'express';
import { getHero, updateHero } from './hero.controller';
import { protect } from '../../middlewares/auth.middleware';
import { admin } from '../../middlewares/rbac.middleware';

const router = express.Router();

router.get('/', getHero);
router.put('/', protect, admin, updateHero);

export default router;
