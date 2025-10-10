'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Analytics configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Google Analytics pageview
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// Google Analytics event
export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track custom events
export const trackEvent = {
  // Auth events
  signUp: (method: string) => event({ action: 'sign_up', category: 'engagement', label: method }),
  login: (method: string) => event({ action: 'login', category: 'engagement', label: method }),
  logout: () => event({ action: 'logout', category: 'engagement' }),

  // Tool usage events
  useDebtCalculator: () =>
    event({ action: 'use_debt_calculator', category: 'tools', label: 'debt_calculator' }),
  useBudgetPlanner: () =>
    event({ action: 'use_budget_planner', category: 'tools', label: 'budget_planner' }),
  useGoalTracker: () =>
    event({ action: 'use_goal_tracker', category: 'tools', label: 'goal_tracker' }),

  // Conversion events
  upgradeToPremium: (tier: string) =>
    event({ action: 'upgrade_to_premium', category: 'conversion', label: tier }),
  cancelSubscription: (tier: string) =>
    event({ action: 'cancel_subscription', category: 'conversion', label: tier }),

  // Engagement events
  completeAssessment: () =>
    event({ action: 'complete_assessment', category: 'engagement', label: 'financial_assessment' }),
  createDebt: () => event({ action: 'create_debt', category: 'engagement', label: 'debt' }),
  createGoal: () => event({ action: 'create_goal', category: 'engagement', label: 'goal' }),
  createBudget: () => event({ action: 'create_budget', category: 'engagement', label: 'budget' }),

  // Share events
  shareCalculation: (platform: string) =>
    event({ action: 'share', category: 'social', label: platform }),
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// TypeScript declarations for gtag moved to global types
// See types/index.d.ts or other global declaration file
