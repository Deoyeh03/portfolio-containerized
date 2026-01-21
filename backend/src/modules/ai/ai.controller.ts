import { Request, Response } from 'express';
import { generateResponse } from './ai.service';

export const askAI = async (req: Request, res: Response) => {
    const { context, userQuestion, projectId } = req.body;

    if (!userQuestion) {
        res.status(400).json({ message: 'Question is required' });
        return;
    }

    try {
        const answer = await generateResponse(context, userQuestion, projectId);
        res.json({ answer });
    } catch (error) {
        console.error("AI Controller Error:", error); // Added explicit console log
        res.status(500).json({ message: 'AI generation failed', error: String(error) });
    }
};
