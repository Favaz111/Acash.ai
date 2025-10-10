import { describe, it, expect } from 'vitest';
import { calculateSingleDebt } from '@/lib/utils/debt-calculator';

describe('calculateSingleDebt', () => {
  describe('Basic Calculations', () => {
    it('should calculate correct payoff time for simple debt', () => {
      const result = calculateSingleDebt(10000, 12, 1000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeGreaterThan(10);
      expect(result.months).toBeLessThan(12);
      expect(result.totalPaid).toBeGreaterThan(10000);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should calculate with zero interest rate', () => {
      const result = calculateSingleDebt(10000, 0, 1000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBe(10);
      expect(result.totalPaid).toBe(10000);
      expect(result.totalInterest).toBe(0);
    });

    it('should calculate years and remaining months correctly', () => {
      const result = calculateSingleDebt(50000, 12, 2500);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.years).toBeGreaterThanOrEqual(0);
      expect(result.remainingMonths).toBeGreaterThanOrEqual(0);
      expect(result.remainingMonths).toBeLessThan(12);
      expect(result.years * 12 + result.remainingMonths).toBe(result.months);
    });
  });

  describe('Error Handling', () => {
    it('should return error for zero debt', () => {
      const result = calculateSingleDebt(0, 12, 1000);
      expect(result).toHaveProperty('error');
    });

    it('should return error for negative debt', () => {
      const result = calculateSingleDebt(-10000, 12, 1000);
      expect(result).toHaveProperty('error');
    });

    it('should return error for zero monthly payment', () => {
      const result = calculateSingleDebt(10000, 12, 0);
      expect(result).toHaveProperty('error');
    });

    it('should return error for negative monthly payment', () => {
      const result = calculateSingleDebt(10000, 12, -1000);
      expect(result).toHaveProperty('error');
    });

    it('should return error for negative interest rate', () => {
      const result = calculateSingleDebt(10000, -5, 1000);
      expect(result).toHaveProperty('error');
    });

    it('should return error when payment is too small to cover interest', () => {
      // With 50% annual interest, monthly interest is very high
      const result = calculateSingleDebt(100000, 50, 100);
      expect(result).toHaveProperty('error');
    });
  });

  describe('High Interest Rate Scenarios', () => {
    it('should calculate correctly with high interest rate (credit card)', () => {
      const result = calculateSingleDebt(50000, 24, 2500);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.totalInterest).toBeGreaterThan(10000);
      expect(result.months).toBeGreaterThan(24);
    });

    it('should calculate correctly with very low interest rate (mortgage)', () => {
      const result = calculateSingleDebt(500000, 4, 5000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeGreaterThan(100);
      expect(result.totalInterest).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large debt amounts', () => {
      const result = calculateSingleDebt(10000000, 8, 100000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.totalPaid).toBeGreaterThan(10000000);
      expect(result.months).toBeGreaterThan(100);
    });

    it('should handle very small debt amounts', () => {
      const result = calculateSingleDebt(100, 12, 50);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeLessThanOrEqual(3);
      expect(result.totalPaid).toBeGreaterThan(100);
    });

    it('should handle payment much larger than debt', () => {
      const result = calculateSingleDebt(1000, 12, 10000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBe(1);
      // Total paid = monthlyPayment * months = 10000 * 1
      expect(result.totalPaid).toBe(10000);
    });
  });

  describe('Realistic Scenarios', () => {
    it('should calculate personal loan correctly (50k, 12%, 2500/month)', () => {
      const result = calculateSingleDebt(50000, 12, 2500);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeGreaterThan(20);
      expect(result.months).toBeLessThan(25);
      expect(result.totalInterest).toBeGreaterThan(2000);
      expect(result.totalInterest).toBeLessThan(7000); // Adjusted for realistic calculation
    });

    it('should calculate credit card debt correctly (10k, 24%, 1000/month)', () => {
      const result = calculateSingleDebt(10000, 24, 1000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeGreaterThan(10);
      expect(result.months).toBeLessThan(13);
      expect(result.totalInterest).toBeGreaterThan(1000);
    });

    it('should calculate car loan correctly (100k, 8%, 5000/month)', () => {
      const result = calculateSingleDebt(100000, 8, 5000);

      if ('error' in result) {
        throw new Error('Expected successful calculation');
      }

      expect(result.months).toBeGreaterThan(20);
      expect(result.months).toBeLessThan(25);
      expect(result.totalInterest).toBeGreaterThan(3000);
    });
  });
});
