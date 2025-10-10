/**
 * Tests for Formatting Utilities
 * شامل لجميع دوال التنسيق
 */

import {
  formatCurrency,
  formatCurrencyIntl,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  formatTime,
  formatDuration,
  toArabicNumerals,
  toWesternNumerals,
} from '../formatters';

describe('Currency Formatting', () => {
  describe('formatCurrency', () => {
    it('should format SAR correctly', () => {
      expect(formatCurrency(5000, 'SAR')).toBe('5,000.00 ر.س');
      expect(formatCurrency(1234.56, 'SAR')).toBe('1,234.56 ر.س');
      expect(formatCurrency(0, 'SAR')).toBe('0.00 ر.س');
    });

    it('should format USD correctly', () => {
      expect(formatCurrency(5000, 'USD')).toBe('$5,000.00');
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('should format EUR correctly', () => {
      expect(formatCurrency(5000, 'EUR')).toBe('€5,000.00');
    });

    it('should format AED correctly', () => {
      expect(formatCurrency(5000, 'AED')).toBe('5,000.00 د.إ');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-500, 'SAR')).toBe('-500.00 ر.س');
    });

    it('should default to SAR for unknown currency', () => {
      expect(formatCurrency(1000, 'XYZ')).toBe('1,000.00 ر.س');
    });
  });

  describe('formatCurrencyIntl', () => {
    it('should format SAR with Arabic locale', () => {
      const result = formatCurrencyIntl(5000, 'SAR', 'ar');
      expect(result).toContain('5');
      expect(result).toContain('000');
    });

    it('should format USD with English locale', () => {
      const result = formatCurrencyIntl(5000, 'USD', 'en');
      expect(result).toContain('$');
      expect(result).toContain('5,000');
    });
  });
});

describe('Number Formatting', () => {
  describe('formatNumber', () => {
    it('should format numbers with thousands separator', () => {
      expect(formatNumber(1000, 2, ',', '.')).toBe('1,000.00');
      expect(formatNumber(1000000, 2, ',', '.')).toBe('1,000,000.00');
    });

    it('should handle decimals correctly', () => {
      expect(formatNumber(1234.567, 2, ',', '.')).toBe('1,234.57');
      expect(formatNumber(1234.567, 0, ',', '.')).toBe('1,235');
    });

    it('should handle custom separators', () => {
      expect(formatNumber(1234.56, 2, ' ', ',')).toBe('1 234,56');
    });

    it('should handle zero', () => {
      expect(formatNumber(0, 2, ',', '.')).toBe('0.00');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(18.5)).toBe('18.5%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should respect decimal places', () => {
      expect(formatPercentage(18.567, 2)).toBe('18.57%');
      expect(formatPercentage(18.567, 0)).toBe('19%');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format small numbers as-is', () => {
      expect(formatCompactNumber(500, 'en')).toBe('500');
      expect(formatCompactNumber(999, 'en')).toBe('999');
    });

    it('should format thousands in English', () => {
      expect(formatCompactNumber(5000, 'en')).toBe('5.0K');
      expect(formatCompactNumber(1500, 'en')).toBe('1.5K');
    });

    it('should format millions in English', () => {
      expect(formatCompactNumber(5000000, 'en')).toBe('5.0M');
      expect(formatCompactNumber(1500000, 'en')).toBe('1.5M');
    });

    it('should format thousands in Arabic', () => {
      expect(formatCompactNumber(5000, 'ar')).toBe('5.0ألف');
    });

    it('should format millions in Arabic', () => {
      expect(formatCompactNumber(5000000, 'ar')).toBe('5.0مليون');
    });
  });
});

describe('Date Formatting', () => {
  const testDate = new Date('2025-10-05T14:30:00Z');

  describe('formatDate', () => {
    it('should format date in Arabic locale', () => {
      const result = formatDate(testDate, 'ar');
      expect(result).toContain('2025');
      expect(result).toContain('أكتوبر');
    });

    it('should format date in English locale', () => {
      const result = formatDate(testDate, 'en');
      expect(result).toContain('2025');
      expect(result).toContain('October');
    });

    it('should handle string dates', () => {
      const result = formatDate('2025-10-05', 'en');
      expect(result).toContain('2025');
    });
  });

  describe('formatDateShort', () => {
    it('should format short date in Arabic', () => {
      const result = formatDateShort(testDate, 'ar');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format short date in English', () => {
      const result = formatDateShort(testDate, 'en');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe('formatTime', () => {
    it('should format time in 24-hour format for Arabic', () => {
      const result = formatTime(testDate, 'ar');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should format time in 12-hour format for English', () => {
      const result = formatTime(testDate, 'en');
      expect(result).toContain('M'); // AM or PM
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent dates', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const resultAr = formatRelativeTime(yesterday, 'ar');
      const resultEn = formatRelativeTime(yesterday, 'en');

      expect(typeof resultAr).toBe('string');
      expect(typeof resultEn).toBe('string');
    });
  });

  describe('formatDuration', () => {
    it('should format months only', () => {
      expect(formatDuration(6, 'en')).toBe('6 months');
      expect(formatDuration(6, 'ar')).toBe('6 شهر');
    });

    it('should format years only', () => {
      expect(formatDuration(12, 'en')).toBe('1 year');
      expect(formatDuration(24, 'en')).toBe('2 years');
      expect(formatDuration(12, 'ar')).toBe('1 سنة');
    });

    it('should format years and months', () => {
      expect(formatDuration(18, 'en')).toBe('1 year and 6 months');
      expect(formatDuration(18, 'ar')).toBe('1 سنة و 6 شهر');
      expect(formatDuration(30, 'en')).toBe('2 years and 6 months');
    });

    it('should handle zero months', () => {
      expect(formatDuration(0, 'en')).toBe('');
      expect(formatDuration(0, 'ar')).toBe('');
    });
  });
});

describe('Arabic Numerals', () => {
  describe('toArabicNumerals', () => {
    it('should convert Western numerals to Arabic', () => {
      expect(toArabicNumerals('123')).toBe('١٢٣');
      expect(toArabicNumerals('0')).toBe('٠');
      expect(toArabicNumerals('9876543210')).toBe('٩٨٧٦٥٤٣٢١٠');
    });

    it('should convert numbers to Arabic numerals', () => {
      expect(toArabicNumerals(123)).toBe('١٢٣');
      expect(toArabicNumerals(0)).toBe('٠');
    });

    it('should preserve non-numeric characters', () => {
      expect(toArabicNumerals('Price: 100 SAR')).toBe('Price: ١٠٠ SAR');
    });
  });

  describe('toWesternNumerals', () => {
    it('should convert Arabic numerals to Western', () => {
      expect(toWesternNumerals('١٢٣')).toBe('123');
      expect(toWesternNumerals('٠')).toBe('0');
      expect(toWesternNumerals('٩٨٧٦٥٤٣٢١٠')).toBe('9876543210');
    });

    it('should preserve non-Arabic-numeric characters', () => {
      expect(toWesternNumerals('السعر: ١٠٠ ريال')).toBe('السعر: 100 ريال');
    });

    it('should handle mixed content', () => {
      expect(toWesternNumerals('Test ١٢٣ ABC')).toBe('Test 123 ABC');
    });
  });
});

describe('Edge Cases', () => {
  it('should handle very large numbers', () => {
    expect(formatCurrency(999999999, 'SAR')).toBe('999,999,999.00 ر.س');
    expect(formatCompactNumber(1000000000, 'en')).toBe('1.0B');
  });

  it('should handle very small decimals', () => {
    expect(formatNumber(0.001, 3, ',', '.')).toBe('0.001');
  });

  it('should handle negative percentages', () => {
    expect(formatPercentage(-5.5)).toBe('-5.5%');
  });
});
