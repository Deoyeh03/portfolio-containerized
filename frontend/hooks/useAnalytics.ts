"use client";

import { useEffect, useRef } from "react";
import api from "@/lib/api";

export const useAnalytics = () => {
    const hasTracked = useRef(false);

    const trackEvent = async (eventType: string, metadata?: any) => {
        try {
            await api.post('/analytics/event', { eventType, metadata });
        } catch (error) {
            console.error("Analytics Error", error);
        }
    };

    const trackVisit = () => {
        if (hasTracked.current) return;
        trackEvent("visit");
        hasTracked.current = true;
    };

    return { trackEvent, trackVisit };
};
