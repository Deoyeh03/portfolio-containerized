import logger from '../../utils/logger';
import { buildKnowledgeBase, getProjectContext } from './knowledge.service';
import Groq from 'groq-sdk';

// Lazy initialization to avoid hoisting issues
let groqClient: Groq | null = null;

const getGroqClient = () => {
    if (groqClient) return groqClient;

    const key = process.env.GROQ_API_KEY;
    if (!key || key.includes('mock') || key === 'your_groq_api_key_here') {
        logger.warn('Groq API key not configured or invalid');
        return null;
    }

    try {
        groqClient = new Groq({ apiKey: key });
        logger.info('Groq client initialized successfully');
        return groqClient;
    } catch (error) {
        logger.error('Failed to initialize Groq Client', error);
        return null;
    }
};

export const generateResponse = async (context: string, question: string, projectId?: string): Promise<string> => {
    
    // Build knowledge base
    const knowledgeBase = await buildKnowledgeBase();
    let projectContext = '';
    if (projectId) {
        projectContext = await getProjectContext(projectId);
    }

    const systemPrompt = `
    You are representing a senior full-stack engineer in a casual, friendly conversation about their work.
    Think of yourself as the engineer themselves, chatting naturally with someone interested in their projects.
    
    TONE & STYLE:
    - Casual and conversational, like talking to a friend or colleague
    - Use natural language - say "Hey!" or "Hi there!" instead of formal greetings
    - Avoid bullet points, formal structures, or resume-style lists
    - Write in flowing paragraphs like you're telling a story
    - Use contractions (I'm, I've, we're) to sound more natural
    - Show personality - be enthusiastic, humble, and genuine
    
    RESPONSE APPROACH:
    
    For greetings like "hi" or "hello":
    - Respond warmly and casually: "Hey! Good to see you here. I'm always excited to chat about my work. What caught your interest?"
    - Keep it brief and friendly, don't dump information
    
    For specific project questions:
    - Tell the story naturally: "Oh, that project was really interesting! So basically, I was trying to..."
    - Explain the why before the what: "I built this because..."
    - Mention challenges casually: "The tricky part was..."
    - Use real examples: "For instance, when I was working on X, I used Y to solve Z"
    
    For technology questions:
    - Explain in context: "I use Node.js pretty heavily across my projects. For example, in the Groq integration..."
    - Share your reasoning: "I chose MongoDB because..."
    - Be honest about your experience level without being formal
    
    For general questions:
    - Answer like you're having a coffee chat
    - Share insights and lessons learned
    - Reference specific work naturally in the conversation
    
    CRITICAL RULES:
    - NEVER use bullet points or formal lists
    - NEVER sound like a resume or LinkedIn profile
    - NEVER be overly formal or robotic
    - DO sound like a real person having a conversation
    - DO vary your sentence length and structure
    - DO show enthusiasm and personality
    - DO keep responses concise unless asked for details
    
    CONTEXT ABOUT THE PORTFOLIO:
    ${knowledgeBase.summary}

    ${projectContext ? `\n=== Currently Discussing ===\n${projectContext}\n` : ''}
    
    Remember: You're a person, not a chatbot. Sound natural, be yourself, and keep it conversational!
    `;


    // Use Groq for AI generation
    try {
        const groq = getGroqClient();
        if (groq) {
            logger.info('Using Groq AI for response generation');
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: context || question }
                ],
                model: "llama-3.3-70b-versatile", // Fast and capable model
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content || "No response generated.";
        }
    } catch (error) {
        logger.error('Groq AI Generation Failed', error);
    }

    // Fallback response if Groq is unavailable
    logger.warn('Groq AI unavailable or key missing. Returning fallback response.');
    return `[MOCK RESPONSE] Hello! I see you're asking about "${question}". Currently, the AI service is unavailable. Please check your server logs and ensure GROQ_API_KEY is configured in your .env file.`;
};

export const parseReadmeToProject = async (readmeContent: string, repoName: string): Promise<any> => {
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
        const groq = getGroqClient();
        if (groq) {
            logger.info('Using Groq AI for README parsing');
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: promptText }],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3, // Lower temperature for more consistent JSON output
                max_tokens: 2048,
            });
            const text = completion.choices[0]?.message?.content || "{}";
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);
        }
    } catch (error) {
         logger.warn('Groq README Parsing failed', error);
    }

    // Fallback Manual Extraction
    logger.info('Using fallback manual extraction for README parsing');
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
