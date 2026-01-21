import { Request, Response } from 'express';
import SiteSettings from './settings.model';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await SiteSettings.findOne();
        
        // If no settings exist, create defaults
        if (!settings) {
            settings = await SiteSettings.create({});
        }
        
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response) => {
    try {
        let settings = await SiteSettings.findOne();
        
        if (!settings) {
            const newSettings = new SiteSettings(req.body);
            settings = await newSettings.save();
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings' });
    }
};
