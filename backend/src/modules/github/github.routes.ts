import express from 'express';
import { handleGithubPush, simulateWebhook } from './github.controller';

const router = express.Router();

router.post('/webhook', handleGithubPush);
router.post('/simulate', simulateWebhook);

export default router;
