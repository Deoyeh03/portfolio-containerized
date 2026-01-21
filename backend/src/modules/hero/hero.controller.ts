import { Request, Response } from 'express';
import Hero from './hero.model';

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
export const getHero = async (req: Request, res: Response) => {
    try {
        let hero = await Hero.findOne({ isActive: true });
        
        // If no hero exists, create default
        if (!hero) {
            hero = await Hero.create({
                greeting: 'System Online // V.3.0',
                headline: 'Engineering the future with systems that speak for themselves.',
                highlightWord: 'systems',
                description: 'Senior Full-Stack Engineer specializing in scalable backend architecture, real-time systems, and experimental interfaces.',
                ctaText: 'Explore Projects',
                ctaLink: '#projects',
                isActive: true
            });
        }
        
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hero content' });
    }
};

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Private/Admin
export const updateHero = async (req: Request, res: Response) => {
    try {
        const { greeting, headline, highlightWord, description, ctaText, ctaLink } = req.body;
        
        let hero = await Hero.findOne({ isActive: true });
        
        if (!hero) {
            hero = await Hero.create({
                greeting,
                headline,
                highlightWord,
                description,
                ctaText,
                ctaLink,
                isActive: true
            });
        } else {
            hero.greeting = greeting || hero.greeting;
            hero.headline = headline || hero.headline;
            hero.highlightWord = highlightWord || hero.highlightWord;
            hero.description = description || hero.description;
            hero.ctaText = ctaText || hero.ctaText;
            hero.ctaLink = ctaLink || hero.ctaLink;
            await hero.save();
        }
        
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: 'Error updating hero content' });
    }
};
