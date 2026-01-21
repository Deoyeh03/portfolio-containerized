import logger from '../../utils/logger';
import { buildKnowledgeBase, getProjectContext } from './knowledge.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Lazy initialization to avoid hoisting issues
let geminiModel: any = null;
let openaiClient: OpenAI | null = null;

const getGeminiModel = () => {
    if (geminiModel) return geminiModel;
    
    const key = process.env.GOOGLE_AI_KEY;
    if (!key || key.includes('mock') || key === 'your_google_ai_key_here') {
        return null;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        return geminiModel;
    } catch (error) {
        logger.error('Failed to initialize Gemini Model', error);
        return null;
    }
};

const getOpenAIClient = () => {
    if (openaiClient) return openaiClient;

    const key = process.env.OPENAI_API_KEY;
    if (!key || key.includes('mock') || key === 'your_openai_api_key_here') {
        return null;
    }

    try {
        openaiClient = new OpenAI({ apiKey: key });
        return openaiClient;
    } catch (error) {
        logger.error('Failed to initialize OpenAI Client', error);
        return null;
    }
};

export const generateResponse = async (context: string, question: string, projectId?: string): Promise<string> => {
    
    // Build knowledge base (shared for both)
    const knowledgeBase = await buildKnowledgeBase();
    let projectContext = '';
    if (projectId) {
        projectContext = await getProjectContext(projectId);
    }

    const systemPrompt = `
    You are an AI assistant representing a senior full-stack engineer. 
    You have direct access to their professional database.

    PROFILE CONTEXT:
    ${knowledgeBase.summary}

    ${projectContext ? `CURRENT PROJECT CONTEXT:\n${projectContext}\n` : ''}

    INSTRUCTIONS:
    1. Answer in the first person ("I").
    2. Be concise, professional, and technically accurate.
    3. Only reference facts provided in the PROFILE CONTEXT.
    4. If the answer isn't in the context, say you don't have that specific info but mention your general expertise.
    `;

    // 1. Try Gemini First
    try {
        const model = getGeminiModel();
        if (model) {
            const prompt = `${systemPrompt}\n\nUSER QUESTION: "${context || question}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
    } catch (error) {
        logger.warn('Gemini Generation Failed. Attempting Failover to OpenAI...', error);
    }

    // 2. Fallback to OpenAI
    try {
        const openai = getOpenAIClient();
        if (openai) {
            logger.info('Using OpenAI Fallback');
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: context || question }
                ],
                model: "gpt-3.5-turbo",
            });
            return completion.choices[0].message.content || "No response generated.";
        }
    } catch (error) {
        logger.error('OpenAI Generation Failed', error);
    }

    // 3. Final Mock Fallback
    logger.warn('All AI Providers failed or keys missing. Returning Mock Response.');
    return `[MOCK RESPONSE] Hello! I see you're asking about "${question}". Currently, both Gemini and OpenAI services are unavailable (or keys are invalid). Please check your server logs and .env configuration.`;
};

export const parseReadmeToProject = async (readmeContent: string, repoName: string): Promise<any> => {
    // Shared Prompt
    const promptText = `
    Act as a Technical Documentation Expert. Analyze this README content and extract structured data for a portfolio project case study.
    
    Repo Name: ${repoName}

    README CONTENT:
    ${readmeContent}

    JSON OUTPUT FORMAT (Return ONLY raw JSON, no markdown formatting):
    {
        "title": "Project Title",
        "summary": "One sentence elevator pitch (max 100 chars)",
        "fullDescription": "Detailed technical overview (2-3 paragraphs)",
        "techStack": ["Array", "of", "Technologies"],
        "architecture": "Architecture details if found, else null",
        "challenges": "Engineering challenges if found, else null",
        "category": "Inferred Category (e.g., Backend, Frontend, Full Stack, DevOps)"
    }
    `;

    try {
        // Try Gemini
        const model = getGeminiModel();
        if (model) {
            const result = await model.generateContent(promptText);
            const response = await result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        }
        
    } catch (error) {
        logger.warn('Gemini README Parsing failed', error);
    }

    try {
        // Try OpenAI
        const openai = getOpenAIClient();
        if (openai) {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: promptText }],
                model: "gpt-3.5-turbo",
            });
            const text = completion.choices[0].message.content || "{}";
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        }
    } catch (error) {
         logger.warn('OpenAI README Parsing failed', error);
    }

    // Fallback Manual Extraction
    return {
        title: repoName.charAt(0).toUpperCase() + repoName.slice(1).replace(/-/g, ' '),
        summary: "Project synced from GitHub (AI Extraction Unavailable).",
        fullDescription: readmeContent.slice(0, 500) + "...",
        techStack: ["TypeScript", "Node.js", "React"], 
        architecture: "Standard MVC Architecture",
        challenges: "Data synchronization and real-time updates.",
        category: "Full Stack"
    };
};
