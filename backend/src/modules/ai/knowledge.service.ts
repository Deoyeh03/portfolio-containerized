import Project from '../projects/project.model';
import Experience from '../resume/experience.model';
import Skill from '../skills/skill.model';
import JourneyPoint from '../journey/journey.model';

interface KnowledgeContext {
    projects: any[];
    experience: any[];
    skills: any[];
    journey: any[];
    summary: string;
}

export const buildKnowledgeBase = async (): Promise<KnowledgeContext> => {
    try {
        const [projects, experience, skills, journey] = await Promise.all([
            Project.find({ isPublished: true }).select('-__v'),
            Experience.find().sort({ order: 1 }).select('-__v'),
            Skill.find().sort({ order: 1 }).select('-__v'),
            JourneyPoint.find().sort({ order: 1 }).select('-__v'),
        ]);

        const summary = generateContextSummary(projects, experience, skills, journey);

        return {
            projects,
            experience,
            skills,
            journey,
            summary,
        };
    } catch (error) {
        console.error('Error building knowledge base:', error);
        throw error;
    }
};

export const getProjectContext = async (slug: string): Promise<string> => {
    try {
        const project = await Project.findOne({ slug });
        if (!project) return '';

        return `
Project: ${project.title}
Category: ${project.category}
Summary: ${project.summary}
Tech Stack: ${project.techStack.join(', ')}
${project.architecture ? `\nArchitecture:\n${project.architecture}` : ''}
${project.challenges ? `\nEngineering Challenges:\n${project.challenges}` : ''}
${project.fullDescription ? `\nFull Description:\n${project.fullDescription}` : ''}
        `.trim();
    } catch (error) {
        console.error('Error getting project context:', error);
        return '';
    }
};

const generateContextSummary = (projects: any[], experience: any[], skills: any[], journey: any[]): string => {
    const skillsByCategory = skills.reduce((acc: any, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill.name);
        return acc;
    }, {});

    const experienceSummary = experience.map(exp => 
        `${exp.role} at ${exp.company} (${exp.duration})`
    ).join('; ');

    // Enhanced project summary with full details
    const projectDetails = projects.map(p => {
        let details = `\n### ${p.title}\n`;
        details += `**Category**: ${p.category}\n`;
        details += `**Summary**: ${p.summary}\n`;
        details += `**Tech Stack**: ${p.techStack.join(', ')}\n`;
        
        if (p.fullDescription) {
            details += `**Description**: ${p.fullDescription}\n`;
        }
        
        if (p.architecture) {
            details += `**Architecture**: ${p.architecture}\n`;
        }
        
        if (p.challenges) {
            details += `**Challenges**: ${p.challenges}\n`;
        }
        
        if (p.features && p.features.length > 0) {
            details += `**Key Features**: ${p.features.join(', ')}\n`;
        }
        
        if (p.liveUrl) {
            details += `**Live URL**: ${p.liveUrl}\n`;
        }
        
        if (p.githubUrl) {
            details += `**GitHub**: ${p.githubUrl}\n`;
        }
        
        return details;
    }).join('\n');

    return `
# Professional Profile

## Personal Information
I am a senior full-stack engineer with a strong focus on backend development and scalable systems.

## Current Experience
${experienceSummary}

## Technical Skills & Proficiencies
${Object.entries(skillsByCategory).map(([cat, skills]: [string, any]) => 
    `**${cat}**: ${skills.join(', ')}`
).join('\n')}

## Portfolio Projects (Detailed)
${projectDetails}

## Technology Journey
${journey.slice(0, 8).map((j: any) => `**${j.year}**: ${j.title}${j.description ? ' - ' + j.description : ''}`).join('\n')}

## Professional Capabilities
- Full-stack development with emphasis on backend architecture
- RESTful API design and implementation
- Database design and optimization (MongoDB, SQL)
- Real-time systems with WebSockets
- AI integration using Groq SDK for high-performance inference
- DevOps and deployment automation
- Authentication and security best practices
    `.trim();
};
