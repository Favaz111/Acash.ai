/**
 * Tests for Debt Calculator
 * اختبارات شاملة لحاسبة الديون
 */

import {
  calculateDebtPayoff,
  calculateMonthlyPayment,
  calculateTotalInterest,
  type DebtCalculationResult,
} from '../debt-calculator';

describe('Debt Calculator', () => {
  describe('calculateDebtPayoff', () => {
    it('should calculate debt payoff correctly', () => {
      const result = calculateDebtPayoff(10000, 18, 500);

      expect(result).toBeDefined();
      expect(result.monthsToPayoff).toBeGreaterThan(0);
      expect(result.totalPaid).toBeGreaterThan(10000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.paymentSchedule).toBeDefined();
    });

    it('should handle zero interest rate', () => {
      const result = calculateDebtPayoff(10000, 0, 500);

      expect(result.monthsToPayoff).toBe(20); // 10000 / 500
      expect(result.totalInterest).toBe(0);
      expect(result.totalPaid).toBe(10000);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateDebtPayoff(-1000, 18, 500)).toThrow();
      expect(() => calculateDebtPayoff(10000, -5, 500)).toThrow();
      expect(() => calculateDebtPayoff(10000, 18, 0)).toThrow();
    });

    it('should handle minimum payment below interest', () => {
      // If monthly payment is less than monthly interest, debt never pays off
      const result = calculateDebtPayoff(10000, 50, 10);

      // Should return a reasonable max months or throw
      expect(result.monthsToPayoff).toBeGreaterThan(0);
    });

    it('should calculate payment schedule correctly', () => {
      const result = calculateDebtPayoff(1000, 12, 100);

      expect(result.paymentSchedule).toBeInstanceOf(Array);
      expect(result.paymentSchedule.length).toBe(result.monthsToPayoff);

      // First payment
      const firstPayment = result.paymentSchedule[0];
      expect(firstPayment.month).toBe(1);
      expect(firstPayment.payment).toBeCloseTo(100, 2);
      expect(firstPayment.principal).toBeGreaterThan(0);
      expect(firstPayment.interest).toBeGreaterThan(0);
      expect(firstPayment.balance).toBeLessThan(1000);

      // Last payment
      const lastPayment = result.paymentSchedule[result.paymentSchedule.length - 1];
      expect(lastPayment.balance).toBeCloseTo(0, 2);
    });
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate correct monthly payment', () => {
      const payment = calculateMonthlyPayment(10000, 18, 24);

      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeGreaterThan(10000 / 24); // More than simple division
    });

    it('should handle zero interest', () => {
      const payment = calculateMonthlyPayment(10000, 0, 24);

      expect(payment).toBeCloseTo(10000 / 24, 2);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateMonthlyPayment(-1000, 18, 24)).toThrow();
      expect(() => calculateMonthlyPayment(10000, -5, 24)).toThrow();
      expect(() => calculateMonthlyPayment(10000, 18, 0)).toThrow();
    });

    it('should calculate higher payment for shorter term', () => {
      const payment12 = calculateMonthlyPayment(10000, 18, 12);
      const payment24 = calculateMonthlyPayment(10000, 18, 24);

      expect(payment12).toBeGreaterThan(payment24);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest correctly', () => {
      const interest = calculateTotalInterest(10000, 18, 500);

      expect(interest).toBeGreaterThan(0);
      expect(interest).toBeLessThan(10000); // Interest shouldn't exceed principal for reasonable scenarios
    });

    it('should return zero for zero interest rate', () => {
      const interest = calculateTotalInterest(10000, 0, 500);

      expect(interest).toBe(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateTotalInterest(-1000, 18, 500)).toThrow();
      expect(() => calculateTotalInterest(10000, -5, 500)).toThrow();
      expect(() => calculateTotalInterest(10000, 18, 0)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small balances', () => {
      const result = calculateDebtPayoff(100, 18, 50);

      expect(result.monthsToPayoff).toBeLessThan(12);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should handle very large balances', () => {
      const result = calculateDebtPayoff(1000000, 18, 10000);

      expect(result.monthsToPayoff).toBeGreaterThan(0);
      expect(result.totalPaid).toBeGreaterThan(1000000);
    });

    it('should handle high interest rates', () => {
      const result = calculateDebtPayoff(10000, 50, 1000);

      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.monthsToPayoff).toBeGreaterThan(0);
    });

    it('should handle low interest rates', () => {
      const result = calculateDebtPayoff(10000, 1, 500);

      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalInterest).toBeLessThan(calculateTotalInterest(10000, 18, 500));
    });
  });

  describe('Real-World Scenarios', () => {
    it('should calculate credit card debt correctly', () => {
      // Credit card: 5000 SAR at 18% APR, 250 SAR/month
      const result = calculateDebtPayoff(5000, 18, 250);

      expect(result.monthsToPayoff).toBeGreaterThan(12);
      expect(result.monthsToPayoff).toBeLessThan(36);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should calculate car loan correctly', () => {
      // Car loan: 50000 SAR at 5% APR, 48 months
      const monthlyPayment = calculateMonthlyPayment(50000, 5, 48);
      const result = calculateDebtPayoff(50000, 5, monthlyPayment);

      expect(result.monthsToPayoff).toBeCloseTo(48, 0);
      expect(result.totalPaid).toBeGreaterThan(50000);
    });

    it('should calculate mortgage correctly', () => {
      // Simplified mortgage: 300000 SAR at 4% APR, 30 years
      const monthlyPayment = calculateMonthlyPayment(300000, 4, 360);
      const result = calculateDebtPayoff(300000, 4, monthlyPayment);

      expect(result.monthsToPayoff).toBeCloseTo(360, 1);
      expect(result.totalInterest).toBeGreaterThan(100000);
    });
  });
});
