import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Hardcoded Admin logic for Portfolio (Simple & Secure enough for this scope)
    // In a real multi-user app, check DB.
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
            { id: 'admin_id', role: 'admin', email: adminEmail },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            token,
            user: {
                email: adminEmail,
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};
