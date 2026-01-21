import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Models
import Experience from './src/modules/resume/experience.model';
import Education from './src/modules/resume/education.model';
import Skill from './src/modules/skills/skill.model';
import JourneyPoint from './src/modules/journey/journey.model';
import Project from './src/modules/projects/project.model';
import Hero from './src/modules/hero/hero.model';
import Role from './src/modules/roles/role.model';
import SiteSettings from './src/modules/settings/settings.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const seedRealData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Clear Old Data
        await Experience.deleteMany({});
        await Education.deleteMany({});
        await Skill.deleteMany({});
        await JourneyPoint.deleteMany({});
        await Project.deleteMany({});
        console.log('Cleared old data');

        // 2. Seed Experience
        const experiencesData = [
            {
                company: "Freelance / Personal Projects",
                role: "Backend Developer",
                duration: "Jan 2024 – Present",
                achievements: [
                    "Built RESTful APIs with Node.js, Express.js, and MongoDB for multiple web apps.",
                    "Implemented JWT authentication, middleware authorization, and data validation using Joi and Zod.",
                    "Integrated Socket.io for real-time user interactions (follow/follower system).",
                    "Wrote clean, reusable controller logic following the MVC pattern."
                ],
                techUsed: ["Node.js", "Express.js", "MongoDB", "JWT", "Socket.io", "Joi", "Zod"]
            },
            {
                company: "Nigenius, Lagos, Nigeria",
                role: "Coding & Robotic Tutor",
                duration: "August 2023 - Present",
                achievements: [
                    "Introduced coding and Robotic to the new generation of children using Coding Environment, e.g Pictoblox, mblock, Makecode, Scratch.",
                    "Worked with Robotic Kits, e.g MicroBit, mblock, Arduino Uno(Diy)."
                ],
                techUsed: ["Block Coding", "Robotics", "Arduino", "MicroBit"]
            },
            {
                company: "PureJim, Remote",
                role: "Intern Backend Developer",
                duration: "FEBRUARY 2025 - Present",
                achievements: [
                    "Contributing to backend development in a remote team environment."
                ],
                techUsed: ["Node.js", "Backend Development"]
            }
        ];
        await Experience.insertMany(experiencesData);
        console.log('Seeded Experience');

        // 3. Seed Education
        const educationData = [
            {
                institution: "Lagos State University, Nigeria",
                degree: "B.Sc Computer Science",
                duration: "OCTOBER 2020 - OCTOBER 2025"
            }
        ];
        await Education.insertMany(educationData);
        console.log('Seeded Education');

        // 4. Seed Skills
        const skillsData = [
            // Backend
            { name: "Node.js", category: "Backend", summary: "Server-side JavaScript runtime", icon: "Server" },
            { name: "Express.js", category: "Backend", summary: "Web framework for Node.js", icon: "Cpu" },
            { name: "MongoDB", category: "Backend", summary: "NoSQL Database", icon: "Database" },
            { name: "RESTful API", category: "Backend", summary: "API Design & Architecture", icon: "Globe" },
            { name: "JWT/Auth", category: "Backend", summary: "Security & Authorization", icon: "Shield" },
            { name: "Socket.io", category: "Backend", summary: "Real-time communication", icon: "Zap" },
            { name: "Postman", category: "Backend", summary: "API Testing & Documentation", icon: "Terminal" },
            // Frontend
            { name: "React.js", category: "Frontend", summary: "Modern UI library", icon: "Code2" },
            { name: "Next.js", category: "Frontend", summary: "React Framework", icon: "Zap" },
            { name: "TypeScript", category: "Frontend", summary: "Typed JavaScript", icon: "Terminal" },
            { name: "PWA", category: "Frontend", summary: "Web App Capabilities", icon: "Layers" },
            // Languages
            { name: "JavaScript", category: "Languages", summary: "Core programming language", icon: "Code2" },
            { name: "Python", category: "Languages", summary: "Basic proficiency", icon: "Code2" },
        ];
        await Skill.insertMany(skillsData);
        console.log('Seeded Skills');

        // 5. Seed Journey Points (Mapping from skills/experience)
        const journeyData = [
            { title: "Frontend Languages", year: "2024", description: "Using HTML & CSS for semantic layouts, login forms, and building clean, usable interfaces.", type: "frontend", icon: "Layout" },
            { title: "Modern JavaScript", year: "2024", description: "Using JS for frontend logic, API fetching, and complex user interaction management.", type: "frontend", icon: "Code2" },
            { title: "React UI Systems", year: "2024", description: "Building functional components with state/props for dashboards and data rendering.", type: "frontend", icon: "FileCode" },
            { title: "Node.js Architecture", year: "2025", description: "Building the engine: handling server logic, background tasks, and high-performance APIs.", type: "backend", icon: "Server" },
            { title: "API Systems (Express)", year: "2025", description: "Structuring secure routes, middleware, and authentication for scalable backends.", type: "backend", icon: "Cpu" },
            { title: "Database Strategy", year: "2025", description: "Modeling complex data schemas with MongoDB and Mongoose for production apps.", type: "backend", icon: "Database" },
            { title: "Real-Time Socket.io", year: "2025", description: "Enabling bidirectional communication for instant chat and live update systems.", type: "backend", icon: "Zap" },
            { title: "Security & Auth", year: "2025", description: "Implementing JWT, bcrypt, and RBAC to protect data and manage user sessions safely.", type: "backend", icon: "Shield" },
            { title: "Job Queues (BullMQ)", year: "2025", description: "Scaling background processing and scrapers with Redis-backed task management.", type: "backend", icon: "Repeat" },
        ];
        await JourneyPoint.insertMany(journeyData);
        console.log('Seeded Journey Points');

        const projectsData = [
            {
                title: "OmniSignal AI",
                slug: "omnisignal-ai",
                category: "AI Infrastructure",
                summary: "Scalable AI Monorepo utilizing microservices architecture and Docker orchestration for high-performance AI applications.",
                fullDescription: `Built a comprehensive AI infrastructure monorepo designed for scalability and performance:
                - **Monorepo Architecture**: leveraged Nx for efficient code sharing and build caching across multiple services.
                - **Microservices**: Deployed independent services for API Gateway, Auth, and AI processing using Docker.
                - **DevOps**: Automated CI/CD pipelines ensuring robust testing and deployment workflows.
                - **Tech Stack**: Built with Node.js, TypeScript, and Docker, focusing on modularity and maintainability.`,
                techStack: ["Nx", "Docker", "Node.js", "TypeScript", "Microservices"],
                isPublished: true,
                githubUrl: "https://github.com/Deoyeh03/OmniSignal" 
            },
            {
                title: "InsightOs",
                slug: "insightos",
                category: "AI Dashboard",
                summary: "Production-grade AI-powered dashboard featuring server-side AI abstraction and a premium glassmorphism UI.",
                fullDescription: `Developed a high-performance AI dashboard tailored for modern SaaS applications:
                - **Modern Frontend**: Crafted with Next.js 14+ (App Router) and Tailwind CSS for a responsive, glassmorphism-inspired UI.
                - **AI Integration**: Implemented a provider-agnostic AI abstraction layer to seamlessly switch between LLM providers.
                - **Data Persistence**: Utilized MongoDB for robust activity logging and user data management.
                - **Performance**: Optimized for speed and SEO with server-side rendering and efficient state management.`,
                techStack: ["Next.js 14+", "MongoDB", "Tailwind CSS", "AI Integration", "TypeScript"],
                isPublished: true,
                githubUrl: "https://github.com/Deoyeh03/insightos"
            },
            {
                title: "VigilOps",
                slug: "vigilops",
                category: "DevOps & Security",
                summary: "Secure backend infrastructure implementing Row Level Security (RLS) and containerized deployment pipelines.",
                fullDescription: `Engineered a security-first backend infrastructure focused on data protection and operational efficiency:
                - **Security**: Implemented Row Level Security (RLS) in PostgreSQL to ensure granular data access control.
                - **Containerization**: Fully Dockerized services for consistent environments across development and production.
                - **Backend Logic**: robust API architecture using Node.js and TypeScript with strict validation layers.
                - **Observability**: Integrated logging and monitoring for real-time system health checks.`,
                techStack: ["Docker", "PostgreSQL", "RLS", "TypeScript", "Node.js"],
                isPublished: true,
                githubUrl: "https://github.com/Deoyeh03/VigilOps"
            },
            {
                title: "Article Scraper System",
                slug: "article-scraper",
                category: "Automation",
                summary: "Full-stack async web scraping system with background job processing and reliable data extraction.",
                fullDescription: `Architected a resilient web scraping platform capable of handling high-volume data extraction:
                - **Async Processing**: Implemented BullMQ for reliable background job processing and queue management.
                - **Scraping Engine**: Powered by Cheerio for efficient HTML parsing and data extraction.
                - **Backend**: Built on Node.js and Express to handle concurrent requests and API endpoints.
                - **Reliability**: Designed with error handling and retry mechanisms to ensure data integrity.`,
                techStack: ["Node.js", "Express", "Cheerio", "BullMQ", "Redis"],
                isPublished: true,
                githubUrl: "https://github.com/Deoyeh03/article-scrapper-system"
            },
            {
                title: "TaskManager SaaS",
                slug: "taskmanager-saas",
                category: "SaaS Platform",
                summary: "Enterprise-grade task management SaaS with Role-Based Access Control (RBAC) and real-time collaboration features.",
                fullDescription: `Delivered a full-feature task management solution for enterprise collaboration:
                - **Real-Time Collaboration**: Integrated Socket.io for instant updates on tasks and team communications.
                - **Security**: Enforced Role-Based Access Control (RBAC) to manage user permissions and data security.
                - **Full Stack**: Unified experience with a React frontend and Node.js/Express backend backed by MongoDB.
                - **Scalability**: Designed database schemas and API endpoints to support growing user bases and data volumes.`,
                techStack: ["Node.js", "Express", "MongoDB", "React", "Socket.io"],
                isPublished: true,
                githubUrl: "https://github.com/Deoyeh03/taskmanager-server",
                liveUrl: "https://taskmanager-client.vercel.app"
            }
        ];
        await Project.insertMany(projectsData);
        console.log('Seeded Projects');

        // 7. Seed Hero
        await Hero.deleteMany({});
        await Hero.create({
            greeting: 'System Online // V.3.0',
            headline: 'Engineering the future with systems that speak for themselves.',
            highlightWord: 'systems',
            description: 'Senior Full-Stack Engineer specializing in scalable backend architecture, real-time systems, and experimental interfaces.',
            ctaText: 'Explore Projects',
            ctaLink: '#projects',
            isActive: true
        });
        console.log('Seeded Hero');

        // 8. Seed Roles
        await Role.deleteMany({});
        const rolesData = [
            {
                title: 'Backend Engineer',
                subtitle: 'Node.js, Express.js, MongoDB',
                description: 'Building robust, scalable server-side applications with clean architecture and best practices.',
                icon: 'Server',
                order: 0
            },
            {
                title: 'Full-Stack Developer',
                subtitle: 'Backend-Driven Full-Stack',
                description: 'Creating end-to-end solutions with strong backend foundations and modern frontend experiences.',
                icon: 'Layers',
                order: 1
            },
            {
                title: 'API & Auth Engineer',
                subtitle: 'Secure, Scalable APIs',
                description: 'Designing RESTful APIs with JWT authentication, rate limiting, and comprehensive security measures.',
                icon: 'Shield',
                order: 2
            },
            {
                title: 'Real-Time Systems',
                subtitle: 'Socket.io, WebSockets',
                description: 'Implementing live features like chat, notifications, and collaborative editing.',
                icon: 'Zap',
                order: 3
            },
            {
                title: 'Internal Tools Builder',
                subtitle: 'Admin Panels, Dashboards',
                description: 'Creating custom admin interfaces and analytics dashboards for business operations.',
                icon: 'Wrench',
                order: 4
            },
            {
                title: 'Product Engineer',
                subtitle: 'Technical & Strategic',
                description: 'Bridging technical implementation with product vision to deliver user-focused solutions.',
                icon: 'Briefcase',
                order: 5
            }
        ];
        await Role.insertMany(rolesData);
        console.log('Seeded Roles');

        // 9. Seed Site Settings
        await SiteSettings.deleteMany({});
        await SiteSettings.create({
            siteName: 'Portfolio',
            logoUrl: '/logo.png',
            favicon: '/favicon.ico',
            socialLinks: {
                github: 'https://github.com/Deoyeh03',
                linkedin: '',
                twitter: '',
                email: ''
            },
            seo: {
                title: 'Portfolio - Senior Full-Stack Engineer',
                description: 'Backend-focused full-stack engineer specializing in scalable systems',
                keywords: ['Backend Engineer', 'Full-Stack Developer', 'Node.js', 'React', 'TypeScript']
            },
            theme: {
                primaryColor: '#00ff9d',
                accentColor: '#0a0a0a'
            }
        });
        console.log('Seeded Site Settings');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding real data:', error);
        process.exit(1);
    }
};

seedRealData();
