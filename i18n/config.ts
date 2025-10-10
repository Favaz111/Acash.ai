/**
 * i18n Configuration
 * Internationalization settings for next-intl
 */

export const locales = ['ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ar: '🇸🇦',
  en: '🇺🇸',
};

// RTL locales
export const rtlLocales: Locale[] = ['ar'];

export function isRTL(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Currency per locale
export const localeCurrency: Record<Locale, string> = {
  ar: 'SAR',
  en: 'USD',
};

// Date format per locale
export const localeDateFormat: Record<Locale, string> = {
  ar: 'dd/MM/yyyy',
  en: 'MM/dd/yyyy',
};
