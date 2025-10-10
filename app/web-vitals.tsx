'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals, initPerformanceMonitoring } from '@/lib/utils/performance';

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric as any);
  });

  useEffect(() => {
    // Initialize performance monitoring on mount
    initPerformanceMonitoring();
  }, []);

  return null;
}
