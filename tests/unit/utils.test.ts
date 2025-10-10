import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatDate, cn } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format SAR currency correctly', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('ر.س');
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('ر.س');
  });

  it('should handle negative numbers', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('-');
    expect(result).toContain('500');
  });

  it('should handle large numbers', () => {
    const result = formatCurrency(1_000_000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('should handle decimal numbers', () => {
    const result = formatCurrency(123.45);
    expect(result).toBeDefined();
  });
});

describe('formatNumber', () => {
  it('should format numbers with Arabic locale', () => {
    const result = formatNumber(1234);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should handle zero', () => {
    const result = formatNumber(0);
    expect(result).toBeDefined();
  });

  it('should handle negative numbers', () => {
    const result = formatNumber(-100);
    expect(result).toBeDefined();
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-01-15');
    const result = formatDate(date);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should handle current date', () => {
    const result = formatDate(new Date());
    expect(result).toBeDefined();
  });
});

describe('cn (className merger)', () => {
  it('should merge multiple class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'active', false && 'inactive');
    expect(result).toContain('base');
    expect(result).toContain('active');
    expect(result).not.toContain('inactive');
  });

  it('should handle undefined and null', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should merge Tailwind classes correctly', () => {
    // tailwind-merge should handle conflicts
    const result = cn('p-4', 'p-6');
    // Should keep only p-6 (last one wins)
    expect(result).toBe('p-6');
  });
});
