import { Request, Response } from 'express';
import Analytics from '../analytics/analytics.model';
import Project from '../projects/project.model';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const projectCount = await Project.countDocuments();
        const visitCount = await Analytics.countDocuments({ eventType: 'visit' });
        const aiCount = await Analytics.countDocuments({ eventType: 'ai_chat' });

        // Real-time Health Checks
        const dbStatus = await (require('mongoose').connection.readyState === 1 ? 'Healthy' : 'Disconnected');
        
        // Simple AI check (check if keys exist)
        const aiStatus = (process.env.GOOGLE_AI_KEY || process.env.OPENAI_API_KEY) ? 'Configured' : 'Missing Keys';

        res.json({
            projects: projectCount,
            visits: visitCount,
            aiInteractions: aiCount,
            systemStatus: {
                database: dbStatus,
                ai: aiStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};
