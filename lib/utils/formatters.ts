/**
 * Formatting Utilities
 * دوال لتنسيق العملات والتواريخ والأرقام مع دعم i18n
 */

import { type Locale } from '@/i18n/config';

// ==========================================
// CURRENCY FORMATTING
// ==========================================

export interface CurrencyConfig {
  code: string;
  symbol: string;
  symbolPosition: 'before' | 'after';
  decimals: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const currencies: Record<string, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    symbolPosition: 'after',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    symbolPosition: 'after',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    symbolPosition: 'before',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    symbolPosition: 'before',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
};

/**
 * Format currency with locale support
 * @param amount - Amount to format
 * @param currencyCode - Currency code (SAR, USD, etc.)
 * @param locale - Locale for formatting
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'SAR',
  locale?: Locale
): string {
  const config = currencies[currencyCode] || currencies.SAR;

  // Format number with separators
  const formattedNumber = formatNumber(
    amount,
    config.decimals,
    config.thousandsSeparator,
    config.decimalSeparator
  );

  // Add currency symbol
  if (config.symbolPosition === 'before') {
    return `${config.symbol}${formattedNumber}`;
  } else {
    return `${formattedNumber} ${config.symbol}`;
  }
}

/**
 * Format currency using Intl.NumberFormat (more accurate but heavier)
 */
export function formatCurrencyIntl(
  amount: number,
  currencyCode: string = 'SAR',
  locale: Locale = 'ar'
): string {
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ==========================================
// NUMBER FORMATTING
// ==========================================

/**
 * Format number with custom separators
 */
export function formatNumber(
  value: number,
  decimals: number = 2,
  thousandsSeparator: string = ',',
  decimalSeparator: string = '.'
): string {
  const fixedValue = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixedValue.split('.');

  // Add thousands separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

  if (decimals > 0 && decimalPart) {
    return `${formattedInteger}${decimalSeparator}${decimalPart}`;
  }

  return formattedInteger;
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatCompactNumber(value: number, locale?: Locale): string {
  if (value < 1000) {
    return value.toString();
  }

  const abbreviations =
    locale === 'ar' ? ['', 'ألف', 'مليون', 'مليار', 'ترليون'] : ['', 'K', 'M', 'B', 'T'];

  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  const suffix = abbreviations[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = value / scale;

  return `${scaled.toFixed(1)}${suffix}`;
}

// ==========================================
// DATE FORMATTING
// ==========================================

/**
 * Format date with locale support
 */
export function formatDate(date: Date | string, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.DateTimeFormat(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date as short format (DD/MM/YYYY or MM/DD/YYYY)
 */
export function formatDateShort(date: Date | string, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.DateTimeFormat(localeCode, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Format date as relative time (e.g., "منذ 3 أيام", "3 days ago")
 */
export function formatRelativeTime(date: Date | string, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    numeric: 'auto',
  });

  if (diffYears > 0) {
    return rtf.format(-diffYears, 'year');
  } else if (diffMonths > 0) {
    return rtf.format(-diffMonths, 'month');
  } else if (diffDays > 0) {
    return rtf.format(-diffDays, 'day');
  } else if (diffHours > 0) {
    return rtf.format(-diffHours, 'hour');
  } else if (diffMinutes > 0) {
    return rtf.format(-diffMinutes, 'minute');
  } else {
    return rtf.format(-diffSeconds, 'second');
  }
}

/**
 * Format date as time (HH:MM)
 */
export function formatTime(date: Date | string, locale: Locale = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';

  return new Intl.DateTimeFormat(localeCode, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en',
  }).format(dateObj);
}

// ==========================================
// DURATION FORMATTING
// ==========================================

/**
 * Format duration in months to years and months
 */
export function formatDuration(months: number, locale: Locale = 'ar'): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(locale === 'ar' ? `${years} سنة` : `${years} year${years > 1 ? 's' : ''}`);
  }

  if (remainingMonths > 0) {
    parts.push(
      locale === 'ar'
        ? `${remainingMonths} شهر`
        : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
    );
  }

  return parts.join(locale === 'ar' ? ' و ' : ' and ');
}

// ==========================================
// ARABIC NUMERALS CONVERSION
// ==========================================

/**
 * Convert Western numerals to Arabic numerals (٠١٢٣...)
 */
export function toArabicNumerals(value: string | number): string {
  const str = value.toString();
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Convert Arabic numerals to Western numerals (0123...)
 */
export function toWesternNumerals(value: string): string {
  const westernNumerals: Record<string, string> = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  return value.replace(/[٠-٩]/g, (digit) => westernNumerals[digit] || digit);
}
