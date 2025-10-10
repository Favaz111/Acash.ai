/**
 * Server-side Dictionary Loader
 * Provides type-safe i18n dictionaries for server components
 */

import type { Locale } from '@/i18n/config';

// Dictionary type based on our JSON structure
export type Dictionary = {
  common: {
    appName: string;
    welcome: string;
    loading: string;
    error: string;
    success: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    confirm: string;
    close: string;
  };
  home: {
    hero: {
      title: string;
      titleHighlight: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      freeBadge: string;
    };
    features: {
      title: string;
      subtitle: string;
      calculators: {
        title: string;
        description: string;
      };
      reports: {
        title: string;
        description: string;
      };
      security: {
        title: string;
        description: string;
      };
      speed: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  nav: {
    home: string;
    dashboard: string;
    tools: string;
    pricing: string;
    about: string;
    contact: string;
    login: string;
    register: string;
    logout: string;
    profile: string;
    settings: string;
  };
  auth: Record<string, string>;
  dashboard: Record<string, any>;
  tools: Record<string, any>;
  assessment: Record<string, any>;
  footer: Record<string, any>;
};

// Dictionary cache to avoid repeated file reads
const dictionaries: Record<Locale, Dictionary | null> = {
  ar: null,
  en: null,
};

/**
 * Load dictionary for a given locale
 * Server-side only - uses synchronous import
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  // Return cached dictionary if available
  if (dictionaries[locale]) {
    return dictionaries[locale]!;
  }

  // Load and cache dictionary
  const dictionary = (await import(`@/messages/${locale}.json`)).default as Dictionary;
  dictionaries[locale] = dictionary;

  return dictionary;
}

/**
 * Type-safe dictionary accessor
 * Usage: const t = await getDictionary(locale);
 */
export type { Locale };
