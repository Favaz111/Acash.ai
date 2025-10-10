import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format positive numbers correctly in SAR', () => {
    expect(formatCurrency(1000)).toBe('1,000 ر.س');
    expect(formatCurrency(10000)).toBe('10,000 ر.س');
    expect(formatCurrency(100000)).toBe('100,000 ر.س');
    expect(formatCurrency(1000000)).toBe('1,000,000 ر.س');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('0 ر.س');
  });

  it('should format negative numbers correctly', () => {
    expect(formatCurrency(-1000)).toBe('-1,000 ر.س');
    expect(formatCurrency(-50000)).toBe('-50,000 ر.س');
  });

  it('should handle decimal numbers without showing decimals', () => {
    expect(formatCurrency(1000.99)).toBe('1,001 ر.س');
    expect(formatCurrency(1000.49)).toBe('1,000 ر.س');
    expect(formatCurrency(1000.5)).toBe('1,001 ر.س');
  });

  it('should handle very large numbers', () => {
    expect(formatCurrency(10000000)).toBe('10,000,000 ر.س');
    expect(formatCurrency(999999999)).toBe('999,999,999 ر.س');
  });

  it('should handle very small positive numbers', () => {
    expect(formatCurrency(0.1)).toBe('0 ر.س');
    expect(formatCurrency(0.9)).toBe('1 ر.س');
    expect(formatCurrency(1)).toBe('1 ر.س');
  });
});

describe('formatNumber', () => {
  it('should format positive numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(10000)).toBe('10,000');
    expect(formatNumber(100000)).toBe('100,000');
  });

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should format negative numbers correctly', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
    expect(formatNumber(-50000)).toBe('-50,000');
  });

  it('should handle decimal numbers without showing decimals', () => {
    expect(formatNumber(1000.99)).toBe('1,001');
    expect(formatNumber(1000.49)).toBe('1,000');
    expect(formatNumber(1000.5)).toBe('1,001');
  });

  it('should use English numerals (not Arabic)', () => {
    const result = formatNumber(12345);
    expect(result).toBe('12,345');
    // Verify it's NOT Arabic numerals (١٢٣٤٥)
    expect(result).not.toContain('١');
    expect(result).not.toContain('٢');
    expect(result).not.toContain('٣');
  });
});
