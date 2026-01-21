import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import Project from '../projects/project.model';
import { parseReadmeToProject } from '../ai/ai.service';
import logger from '../../utils/logger';

// Secret from your .env
const GITHUB_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'my_dev_secret';

const verifySignature = (req: Request) => {
    const signature = req.headers['x-hub-signature-256'] as string;
    const body = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = 'sha256=' + hmac.update(body).digest('hex');
    return signature === digest;
};

export const handleGithubPush = async (req: Request, res: Response) => {
    try {
        // 1. Validation (Skip in dev mode if needed, but good practice)
        if (process.env.NODE_ENV === 'production' && !verifySignature(req)) {
             return res.status(401).json({ message: 'Invalid signature' });
        }

        const { repository, ref, commits } = req.body;

        // 2. Filter: Only care about pushes to main/master that include README.md changes
        const isMainBranch = ref === 'refs/heads/main' || ref === 'refs/heads/master';
        const hasReadmeUpdate = commits.some((commit: any) => 
            commit.added.includes('README.md') || commit.modified.includes('README.md')
        );

        if (!isMainBranch || !hasReadmeUpdate) {
            return res.status(200).json({ message: 'Ignored: Not main branch or README not changed' });
        }

        logger.info(`Processing GitHub Push for ${repository.full_name}`);

        // 3. Fetch Raw README
        // https://raw.githubusercontent.com/USER/REPO/main/README.md
        const rawUrl = `https://raw.githubusercontent.com/${repository.full_name}/${ref.replace('refs/heads/', '')}/README.md`;
        const { data: readmeContent } = await axios.get(rawUrl);

        // 4. AI Magic: Parse README
        const extractedData = await parseReadmeToProject(readmeContent, repository.name);

        // 5. Upsert to Database
        // We use the repo name as a stable identifier, or the slug
        const slug = repository.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const project = await Project.findOneAndUpdate(
            { slug },
            {
                ...extractedData,
                title: extractedData.title || repository.name, // Fallback
                slug,
                isPublished: true, // Auto-publish?
                // Append repository link if not present?
                // 'links.github': repository.html_url 
            },
            { new: true, upsert: true }
        );

        logger.info(`Project ${slug} updated/created via Auto-Sync`);

        res.status(200).json({ success: true, project: project.title });

    } catch (error) {
        logger.error('GitHub Webhook Error', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};

export const simulateWebhook = async (req: Request, res: Response) => {
    try {
        const { repoName, readmeContent } = req.body;
        
        logger.info(`Simulating GitHub Push for ${repoName}`);

        const extractedData = await parseReadmeToProject(readmeContent, repoName);
        
        const slug = repoName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const project = await Project.findOneAndUpdate(
            { slug },
            {
                ...extractedData,
                title: extractedData.title || repoName,
                slug,
                isPublished: true
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: extractedData, project });

    } catch (error) {
        logger.error('Simulation Error', error);
        res.status(500).json({ message: (error as any).message });
    }
}
