import { Request, Response } from 'express';
import Experience from './experience.model';
import Education from './education.model';

export const getExperiences = async (req: Request, res: Response) => {
    try {
        const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getEducation = async (req: Request, res: Response) => {
    try {
        const education = await Education.find().sort({ order: 1, createdAt: -1 });
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.create(req.body);
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

export const updateExperience = async (req: Request, res: Response) => {
    try {
        const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(experience);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

export const deleteExperience = async (req: Request, res: Response) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
