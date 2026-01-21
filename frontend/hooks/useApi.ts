import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// Define types based on your usage
export interface Role {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    order: number;
}

export interface Project {
    _id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    fullDescription: string;
    techStack: string[];
    architecture?: string;
    challenges?: string;
    isPublished: boolean;
    liveUrl?: string;
    githubUrl?: string;
    screenshot?: string;
    media?: string[];
    aiSummary?: string;
}

// Keys for caching
export const QUERY_KEYS = {
    roles: 'roles',
    projects: 'projects',
    hero: 'hero',
    techStack: 'techStack',
    journey: 'journey',
    skills: 'skills',
    resume: 'resume',
};

// Hooks
export const useRoles = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.roles],
        queryFn: async () => {
            const { data } = await api.get<Role[]>('/roles');
            return data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useJourney = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.journey],
        queryFn: async () => {
            const { data } = await api.get('/journey');
            return data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useSkills = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.skills],
        queryFn: async () => {
            const { data } = await api.get('/skills');
            return data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useResume = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.resume],
        queryFn: async () => {
            const { data } = await api.get('/resume');
            return data;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
};

export const useProjects = () => {
    return useQuery<Project[]>({
        queryKey: [QUERY_KEYS.projects],
        queryFn: async () => {
            try {
                const { data } = await api.get('/projects');
                return data;
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Return empty array as fallback
                return [];
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useHero = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.hero],
        queryFn: async () => {
            const { data } = await api.get('/hero');
            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};
