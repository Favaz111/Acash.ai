/**
 * Performance Monitoring Utilities
 * أدوات مراقبة الأداء
 */

/**
 * Web Vitals Metrics
 */
export interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  INP?: number; // Interaction to Next Paint
}

/**
 * Performance thresholds (Google's recommendations)
 */
export const PERFORMANCE_THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },
};

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating: string;
}) {
  const { name, value, rating } = metric;

  // Send to analytics (Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_label: rating,
      non_interaction: true,
    });
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      rating,
    });
  }
}

/**
 * Measure page load time
 */
export function measurePageLoadTime(): number | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return null;
  }

  return navigation.loadEventEnd - navigation.fetchStart;
}

/**
 * Measure Time to Interactive (TTI)
 */
export function measureTTI(): number | null {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return null;
  }

  return navigation.domInteractive - navigation.fetchStart;
}

/**
 * Get performance rating (good/needs-improvement/poor)
 */
export function getPerformanceRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[metricName];

  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Image loading optimization helper
 */
export function getOptimizedImageSrc(src: string, width: number, quality: number = 75): string {
  // If using Next.js Image component, this is handled automatically
  // This is a fallback for custom image optimization
  if (src.startsWith('http') && src.includes('unsplash')) {
    return `${src}?w=${width}&q=${quality}&auto=format`;
  }

  return src;
}

/**
 * Lazy load component helper
 */
export function shouldLazyLoad(threshold: number = 0.1): IntersectionObserverInit {
  return {
    root: null,
    rootMargin: '50px',
    threshold,
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): { used: number; limit: number } | null {
  if (typeof window === 'undefined' || !('memory' in performance)) {
    return null;
  }

  const memory = (performance as any).memory;

  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // Convert to MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576),
  };
}

/**
 * Network information
 */
export function getNetworkInfo(): { effectiveType: string; downlink: number } | null {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return null;
  }

  const connection = (navigator as any).connection;

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
  };
}

/**
 * Detect slow network
 */
export function isSlowNetwork(): boolean {
  const networkInfo = getNetworkInfo();

  if (!networkInfo) {
    return false;
  }

  return networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g';
}

/**
 * Bundle size analyzer helper
 */
export interface BundleSizeInfo {
  size: number;
  gzipSize?: number;
  files: Array<{ name: string; size: number }>;
}

/**
 * Performance budget checker
 */
export const PERFORMANCE_BUDGET = {
  maxBundleSize: 250 * 1024, // 250KB
  maxImageSize: 200 * 1024, // 200KB
  maxFontSize: 100 * 1024, // 100KB
  maxCSSSize: 50 * 1024, // 50KB
  maxJSSize: 200 * 1024, // 200KB
};

/**
 * Check if resource exceeds budget
 */
export function exceedsBudget(size: number, budgetKey: keyof typeof PERFORMANCE_BUDGET): boolean {
  return size > PERFORMANCE_BUDGET[budgetKey];
}

/**
 * Critical CSS extractor (for above-the-fold content)
 */
export function extractCriticalCSS(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const criticalSelectors: string[] = [];
  const viewportHeight = window.innerHeight;

  // Get all stylesheets
  const styleSheets = Array.from(document.styleSheets);

  styleSheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || []);

      rules.forEach((rule: any) => {
        if (rule.selectorText) {
          // Check if element is in viewport
          const elements = document.querySelectorAll(rule.selectorText);

          elements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewportHeight) {
              criticalSelectors.push(rule.cssText);
            }
          });
        }
      });
    } catch (e) {
      // CORS or other errors
      console.warn('Cannot access stylesheet:', e);
    }
  });

  return criticalSelectors;
}

/**
 * Preconnect to external domains
 */
export function preconnectDomains(domains: string[]): void {
  if (typeof document === 'undefined') {
    return;
  }

  domains.forEach((domain) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Resource hints for critical resources
 */
export function prefetchResource(url: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
