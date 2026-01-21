import { Request, Response, NextFunction } from 'express';

// Custom MongoDB sanitization that doesn't modify read-only properties
export const sanitizeData = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize body
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    
    // Sanitize params
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    
    next();
};

// Helper function to recursively sanitize objects
function sanitizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    
    const sanitized: any = {};
    for (const key in obj) {
        // Remove keys that start with $ or contain .
        if (!key.startsWith('$') && !key.includes('.')) {
            sanitized[key] = sanitizeObject(obj[key]);
        }
    }
    return sanitized;
}

// Custom sanitizer for trimming string inputs
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Trim whitespace
                req.body[key] = req.body[key].trim();
                
                // Remove null bytes
                req.body[key] = req.body[key].replace(/\0/g, '');
            }
        });
    }
    
    next();
};

// Validate content type for POST/PUT requests
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'];
        
        if (!contentType || (!contentType.includes('application/json') && !contentType.includes('multipart/form-data'))) {
            return res.status(415).json({
                success: false,
                message: 'Unsupported Media Type. Please use application/json or multipart/form-data'
            });
        }
    }
    next();
};
