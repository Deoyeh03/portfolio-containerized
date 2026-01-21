import express from 'express';
import { askAI } from './ai.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public or Protected? Usually public for portfolio visitors, maybe rate limited.
router.post('/ask', askAI);

export default router;
