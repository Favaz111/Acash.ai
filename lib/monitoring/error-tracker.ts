/**
 * Error Tracking Service
 * Centralized error handling and reporting
 */

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  page?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  environment: string;
  version: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private enabled: boolean;
  private environment: string;
  private version: string;

  private constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true';
    this.environment = process.env.NODE_ENV || 'development';
    this.version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Capture an error
  captureError(error: Error, context: ErrorContext = {}) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
      timestamp: Date.now(),
      level: 'error',
      environment: this.environment,
      version: this.version,
    };

    this.sendReport(report);
    this.logToConsole(report);
  }

  // Capture an exception with context
  captureException(error: unknown, context: ErrorContext = {}) {
    if (error instanceof Error) {
      this.captureError(error, context);
    } else {
      this.captureMessage(String(error), 'error', context);
    }
  }

  // Capture a message
  captureMessage(
    message: string,
    level: 'error' | 'warning' | 'info' = 'info',
    context: ErrorContext = {}
  ) {
    const report: ErrorReport = {
      message,
      context: {
        ...context,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
      timestamp: Date.now(),
      level,
      environment: this.environment,
      version: this.version,
    };

    this.sendReport(report);
    this.logToConsole(report);
  }

  // Send report to backend or external service
  private async sendReport(report: ErrorReport) {
    if (!this.enabled) return;

    try {
      // Send to API endpoint
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
        keepalive: true,
      });

      // If Sentry is configured, send there too
      if (process.env.NEXT_PUBLIC_SENTRY_DSN && typeof window !== 'undefined') {
        // Sentry SDK will automatically capture errors
        // This is just a placeholder for custom Sentry integration
      }
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  // Log to console (only in development)
  private logToConsole(report: ErrorReport) {
    if (this.environment !== 'production') {
      const emoji = report.level === 'error' ? '🔴' : report.level === 'warning' ? '🟡' : 'ℹ️';
      console.group(`${emoji} Error Report - ${report.level.toUpperCase()}`);
      console.log('Message:', report.message);
      console.log('Context:', report.context);
      if (report.stack) console.log('Stack:', report.stack);
      console.log('Timestamp:', new Date(report.timestamp).toISOString());
      console.groupEnd();
    }
  }

  // Set user context
  setUserContext(userId: string, userEmail?: string) {
    if (typeof window !== 'undefined') {
      (window as any).__ERROR_TRACKER_USER_CONTEXT = { userId, userEmail };
    }
  }

  // Clear user context
  clearUserContext() {
    if (typeof window !== 'undefined') {
      delete (window as any).__ERROR_TRACKER_USER_CONTEXT;
    }
  }

  // Get user context
  private getUserContext(): { userId?: string; userEmail?: string } {
    if (typeof window !== 'undefined') {
      return (window as any).__ERROR_TRACKER_USER_CONTEXT || {};
    }
    return {};
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

// Helper functions for common error scenarios
export const trackError = {
  // Authentication errors
  authError: (error: Error, action: string) => {
    errorTracker.captureError(error, {
      component: 'Authentication',
      action,
      metadata: { type: 'auth_error' },
    });
  },

  // API errors
  apiError: (error: Error, endpoint: string, method: string) => {
    errorTracker.captureError(error, {
      component: 'API',
      action: `${method} ${endpoint}`,
      metadata: { type: 'api_error', endpoint, method },
    });
  },

  // Database errors
  dbError: (error: Error, operation: string, collection?: string) => {
    errorTracker.captureError(error, {
      component: 'Database',
      action: operation,
      metadata: { type: 'db_error', collection },
    });
  },

  // UI errors
  uiError: (error: Error, component: string, action?: string) => {
    errorTracker.captureError(error, {
      component: `UI/${component}`,
      action,
      metadata: { type: 'ui_error' },
    });
  },

  // Payment errors
  paymentError: (error: Error, action: string, amount?: number) => {
    errorTracker.captureError(error, {
      component: 'Payment',
      action,
      metadata: { type: 'payment_error', amount },
    });
  },

  // Validation errors
  validationError: (message: string, field?: string, value?: any) => {
    errorTracker.captureMessage(message, 'warning', {
      component: 'Validation',
      metadata: { type: 'validation_error', field, value },
    });
  },

  // Network errors
  networkError: (error: Error, url?: string) => {
    errorTracker.captureError(error, {
      component: 'Network',
      metadata: { type: 'network_error', url },
    });
  },

  // Performance issues
  performanceWarning: (message: string, metric: string, value: number) => {
    errorTracker.captureMessage(message, 'warning', {
      component: 'Performance',
      metadata: { type: 'performance_warning', metric, value },
    });
  },
};

// Initialize global error handlers
export function initErrorTracking() {
  if (typeof window !== 'undefined') {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      errorTracker.captureError(event.error, {
        component: 'Global',
        action: 'unhandled_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorTracker.captureMessage(`Unhandled Promise Rejection: ${event.reason}`, 'error', {
        component: 'Global',
        action: 'unhandled_promise_rejection',
      });
    });

    // Catch console errors (optional)
    if (process.env.NEXT_PUBLIC_TRACK_CONSOLE_ERRORS === 'true') {
      const originalError = console.error;
      console.error = (...args) => {
        errorTracker.captureMessage(args.map((arg) => String(arg)).join(' '), 'error', {
          component: 'Console',
        });
        originalError.apply(console, args);
      };
    }
  }
}

export default errorTracker;
