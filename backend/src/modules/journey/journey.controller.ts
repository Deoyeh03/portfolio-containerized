import { Request, Response } from 'express';
import JourneyPoint from './journey.model';

export const getJourneyPoints = async (req: Request, res: Response) => {
    try {
        const points = await JourneyPoint.find().sort({ order: 1, year: -1 });
        res.json(points);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createJourneyPoint = async (req: Request, res: Response) => {
    try {
        const point = await JourneyPoint.create(req.body);
        res.status(201).json(point);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

export const updateJourneyPoint = async (req: Request, res: Response) => {
    try {
        const point = await JourneyPoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(point);
    } catch (error) {
        res.status(400).json({ message: 'Update failed' });
    }
};

export const deleteJourneyPoint = async (req: Request, res: Response) => {
    try {
        await JourneyPoint.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
