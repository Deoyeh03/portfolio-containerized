import logger from './logger';

interface SecurityEvent {
    type: 'AUTH_FAILURE' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'SUSPICIOUS_ACTIVITY' | 'UNAUTHORIZED_ACCESS';
    ip: string;
    endpoint: string;
    method?: string;
    userAgent?: string;
    details?: any;
}

export const logSecurityEvent = (event: SecurityEvent) => {
    const logData = {
        ...event,
        timestamp: new Date().toISOString(),
        severity: getSeverity(event.type),
    };
    
    // Log based on severity
    if (logData.severity === 'high') {
        logger.error('Security Event', logData);
    } else {
        logger.warn('Security Event', logData);
    }
    
    // In production, send to monitoring service (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
        // TODO: Integrate with monitoring service
        // Example: Sentry.captureMessage('Security Event', { level: 'warning', extra: logData });
    }
};

const getSeverity = (type: SecurityEvent['type']): 'high' | 'medium' | 'low' => {
    switch (type) {
        case 'UNAUTHORIZED_ACCESS':
        case 'SUSPICIOUS_ACTIVITY':
            return 'high';
        case 'AUTH_FAILURE':
        case 'INVALID_INPUT':
            return 'medium';
        case 'RATE_LIMIT':
            return 'low';
        default:
            return 'medium';
    }
};

export const trackFailedAuth = (ip: string, endpoint: string, reason: string) => {
    logSecurityEvent({
        type: 'AUTH_FAILURE',
        ip,
        endpoint,
        details: { reason }
    });
};

export const trackRateLimitHit = (ip: string, endpoint: string) => {
    logSecurityEvent({
        type: 'RATE_LIMIT',
        ip,
        endpoint,
        details: { message: 'Rate limit exceeded' }
    });
};
