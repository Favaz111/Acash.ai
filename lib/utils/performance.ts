/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and send to analytics
 */

import { trackEvent } from '@/components/providers/AnalyticsProvider';

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

// Track Core Web Vitals
export function reportWebVitals(metric: WebVitalsMetric) {
  const { name, value, rating } = metric;

  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: rating,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      rating,
    });
  }

  // Send to monitoring service (e.g., Sentry, LogRocket)
  if (process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true') {
    sendToMonitoring(metric);
  }
}

// Send metrics to monitoring service
function sendToMonitoring(metric: WebVitalsMetric) {
  const body = JSON.stringify(metric);
  const url = '/api/monitoring/web-vitals';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send web vitals:', error);
    });
  }
}

// Performance marks and measures
export const performance = {
  // Mark a performance timestamp
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },

  // Measure time between two marks
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        return measure?.duration || 0;
      } catch (error) {
        console.error('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },

  // Clear marks and measures
  clear: (name?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      if (name) {
        window.performance.clearMarks(name);
        window.performance.clearMeasures(name);
      } else {
        window.performance.clearMarks();
        window.performance.clearMeasures();
      }
    }
  },

  // Track custom timing
  trackTiming: (category: string, variable: string, time: number, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: time,
        event_category: category,
        event_label: label,
      });
    }
  },
};

// Track page load time
export function trackPageLoad() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      performance.trackTiming('Page Load', 'Total Load Time', pageLoadTime);
      performance.trackTiming('Page Load', 'Connect Time', connectTime);
      performance.trackTiming('Page Load', 'Render Time', renderTime);

      if (process.env.NODE_ENV === 'development') {
        console.log('Page Load Metrics:', {
          total: `${pageLoadTime}ms`,
          connect: `${connectTime}ms`,
          render: `${renderTime}ms`,
        });
      }
    });
  }
}

// Track API response time
export async function trackApiCall<T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> {
  const startTime = performance.now?.() || Date.now();

  try {
    const result = await apiCall();
    const duration = (performance.now?.() || Date.now()) - startTime;

    performance.trackTiming('API Call', endpoint, duration, 'success');

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${endpoint}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = (performance.now?.() || Date.now()) - startTime;
    performance.trackTiming('API Call', endpoint, duration, 'error');
    throw error;
  }
}

// Monitor JavaScript errors
export function setupErrorMonitoring() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      trackEvent.event({
        action: 'javascript_error',
        category: 'error',
        label: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
      });

      // Send to error tracking service
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry will automatically capture this
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      trackEvent.event({
        action: 'unhandled_promise_rejection',
        category: 'error',
        label: event.reason?.message || 'Unknown error',
      });
    });
  }
}

// Resource timing observer
export function observeResourceTiming() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;

        // Track slow resources (>1000ms)
        if (resourceEntry.duration > 1000) {
          trackEvent.event({
            action: 'slow_resource',
            category: 'performance',
            label: resourceEntry.name,
            value: Math.round(resourceEntry.duration),
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    trackPageLoad();
    setupErrorMonitoring();
    observeResourceTiming();
  }
}
