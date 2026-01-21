import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import hpp from 'hpp';

// Security middlewares
import { apiLimiter, aiLimiter, authLimiter, analyticsLimiter } from './middlewares/rateLimiter.middleware';
import { sanitizeData, sanitizeInput, validateContentType } from './middlewares/sanitize.middleware';

// Config
dotenv.config();

const app: Application = express();

// Security Headers - Enhanced Helmet Configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS Configuration - Restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001'
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin, allowed origins, local development, or any Vercel deployment
        const isAllowed = 
            !origin || 
            allowedOrigins.includes(origin) || 
            origin.endsWith('.vercel.app') || 
            origin.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            logger.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input Sanitization
app.use(sanitizeData); // MongoDB injection prevention
app.use(sanitizeInput); // Trim and clean inputs
app.use(validateContentType); // Validate content types
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Logging
app.use(morgan('dev', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Portfolio API',
            version: '1.0.0',
            description: 'API for Cinematic Portfolio Backend',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/modules/**/*.routes.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
import authRoutes from './modules/auth/auth.routes';
import projectRoutes from './modules/projects/project.routes';
import aiRoutes from './modules/ai/ai.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import adminRoutes from './modules/admin/admin.routes';
import experienceRoutes from './modules/resume/experience.routes';
import skillRoutes from './modules/skills/skill.routes';
import journeyRoutes from './modules/journey/journey.routes';
import githubRoutes from './modules/github/github.routes';
import heroRoutes from './modules/hero/hero.routes';
import roleRoutes from './modules/roles/role.routes';
import settingsRoutes from './modules/settings/settings.routes';
import { errorHandler } from './middlewares/error.middleware';

// Mount Routes with Rate Limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/analytics', analyticsLimiter, analyticsRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/resume', apiLimiter, experienceRoutes);
app.use('/api/skills', apiLimiter, skillRoutes);
app.use('/api/journey', apiLimiter, journeyRoutes);
app.use('/api/hero', apiLimiter, heroRoutes);
app.use('/api/roles', apiLimiter, roleRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);
app.use('/api/webhooks', githubRoutes); // No rate limit for webhooks

// Error Handler (must be last)
app.use(errorHandler);

export default app;
