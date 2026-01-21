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

    const projectSummary = projects.map(p => 
        `${p.title} (${p.category}): ${p.summary}`
    ).join('\n');

    return `
# Professional Profile

## Experience
${experienceSummary}

## Technical Skills
${Object.entries(skillsByCategory).map(([cat, skills]: [string, any]) => 
    `${cat}: ${skills.join(', ')}`
).join('\n')}

## Key Projects
${projectSummary}

## Tech Journey Highlights
${journey.slice(0, 5).map((j: any) => `${j.year}: ${j.title}`).join('\n')}
    `.trim();
};
