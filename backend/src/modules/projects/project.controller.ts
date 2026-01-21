import { Request, Response } from 'express';
import Project from './project.model';
import logger from '../../utils/logger';

// @desc    Get all published projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({ isPublished: true });
        res.json(projects);
    } catch (error) {
        logger.error('Error fetching projects', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req: Request, res: Response) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        if (project) {
            // If not published and user is not admin, hide? 
            // For simplicity, just return if found, or restrict query.
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error: any) {
        logger.error('Error creating project', error);
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            project.title = req.body.title || project.title;
            project.summary = req.body.summary || project.summary;
            project.fullDescription = req.body.fullDescription || project.fullDescription;
            project.techStack = req.body.techStack || project.techStack;
            project.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : project.isPublished;
            project.liveUrl = req.body.liveUrl !== undefined ? req.body.liveUrl : project.liveUrl;
            project.githubUrl = req.body.githubUrl !== undefined ? req.body.githubUrl : project.githubUrl;
            project.screenshot = req.body.screenshot !== undefined ? req.body.screenshot : project.screenshot;
            project.architecture = req.body.architecture !== undefined ? req.body.architecture : project.architecture;
            project.challenges = req.body.challenges !== undefined ? req.body.challenges : project.challenges;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
