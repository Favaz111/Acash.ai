import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, emailSchema } from '@/lib/validations/auth';
import {
  personalInfoSchema,
  financialStatusSchema,
  financialGoalsSchema,
} from '@/lib/validations/assessment';

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345', // أقل من 6
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty fields', () => {
      const invalidData = {
        email: '',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        displayName: 'أحمد محمد',
        email: 'ahmad@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        displayName: 'أحمد',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password (no uppercase)', () => {
      const invalidData = {
        displayName: 'أحمد',
        email: 'test@example.com',
        password: 'password123', // لا يوجد حرف كبير
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password (no number)', () => {
      const invalidData = {
        displayName: 'أحمد',
        email: 'test@example.com',
        password: 'Password', // لا يوجد رقم
        confirmPassword: 'Password',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short display name', () => {
      const invalidData = {
        displayName: 'أ', // حرف واحد فقط
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('emailSchema', () => {
    it('should validate correct email', () => {
      const result = emailSchema.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = emailSchema.safeParse({ email: 'invalid' });
      expect(result.success).toBe(false);
    });
  });
});

describe('Assessment Validations', () => {
  describe('personalInfoSchema', () => {
    it('should validate correct personal info', () => {
      const validData = {
        age: 30,
        maritalStatus: 'متزوج' as const,
        dependents: 2,
      };

      const result = personalInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject age below 18', () => {
      const invalidData = {
        age: 17,
        maritalStatus: 'أعزب' as const,
        dependents: 0,
      };

      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject age above 100', () => {
      const invalidData = {
        age: 101,
        maritalStatus: 'أعزب' as const,
        dependents: 0,
      };

      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative dependents', () => {
      const invalidData = {
        age: 25,
        maritalStatus: 'أعزب' as const,
        dependents: -1,
      };

      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid marital status', () => {
      const invalidData = {
        age: 25,
        maritalStatus: 'invalid' as any,
        dependents: 0,
      };

      const result = personalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('financialStatusSchema', () => {
    it('should validate correct financial data', () => {
      const validData = {
        monthlyIncome: 10000,
        monthlyExpenses: 7000,
        totalSavings: 50000,
        totalDebts: 20000,
      };

      const result = financialStatusSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative income', () => {
      const invalidData = {
        monthlyIncome: -1000,
        monthlyExpenses: 5000,
        totalSavings: 10000,
        totalDebts: 0,
      };

      const result = financialStatusSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject expenses > 2x income', () => {
      const invalidData = {
        monthlyIncome: 5000,
        monthlyExpenses: 11000, // أكثر من ضعف الدخل
        totalSavings: 0,
        totalDebts: 0,
      };

      const result = financialStatusSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow zero savings', () => {
      const validData = {
        monthlyIncome: 5000,
        monthlyExpenses: 5000,
        totalSavings: 0, // صفر مسموح
        totalDebts: 0,
      };

      const result = financialStatusSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('financialGoalsSchema', () => {
    it('should validate correct goals data', () => {
      const validData = {
        goals: ['emergency', 'house'],
        targetAmount: 100000,
        timeframe: 5,
      };

      const result = financialGoalsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty goals array', () => {
      const invalidData = {
        goals: [],
        targetAmount: 100000,
        timeframe: 5,
      };

      const result = financialGoalsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject more than 6 goals', () => {
      const invalidData = {
        goals: ['1', '2', '3', '4', '5', '6', '7'], // 7 أهداف
        targetAmount: 100000,
        timeframe: 5,
      };

      const result = financialGoalsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative target amount', () => {
      const invalidData = {
        goals: ['emergency'],
        targetAmount: -10000,
        timeframe: 5,
      };

      const result = financialGoalsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject very long timeframe', () => {
      const invalidData = {
        goals: ['house'],
        targetAmount: 500000,
        timeframe: 51, // أكثر من 50 سنة
      };

      const result = financialGoalsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
