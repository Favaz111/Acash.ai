import { z } from 'zod';

// ==========================================
// DATABASE SCHEMA TYPES & VALIDATION
// ==========================================

// User Schema (Phase One - Free Tier Only)
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  preferences: z
    .object({
      language: z.enum(['ar', 'en']).default('ar'),
      currency: z.enum(['SAR', 'AED', 'USD', 'EUR']).default('SAR'),
      notifications: z.boolean().default(true),
      theme: z.enum(['light', 'dark', 'system']).default('system'),
    })
    .optional(),
});

export type User = z.infer<typeof UserSchema>;

// UserProfile type for auth operations
export type UserProfile = Omit<User, 'uid'> & {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};

// Financial Status Schema
export const FinancialStatusSchema = z.object({
  monthlyIncome: z.number().nonnegative(),
  monthlyExpenses: z.number().nonnegative(),
  totalSavings: z.number().nonnegative(),
  totalDebts: z.number().nonnegative(),
  hasEmergencyFund: z.boolean(),
  emergencyFundMonths: z.number().nonnegative().optional(),
  updatedAt: z.date(),
});

export type FinancialStatus = z.infer<typeof FinancialStatusSchema>;

// Assessment Result Schema
export const AssessmentResultSchema = z.object({
  score: z.number().min(0).max(100),
  level: z.enum(['poor', 'fair', 'good', 'very_good', 'excellent']),
  label: z.string(),
  description: z.string(),
  icon: z.string(),
  recommendations: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  nextSteps: z.array(z.string()),
  calculatedAt: z.date(),
});

export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;

// Debt Item Schema
export const DebtItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  nameAr: z.string().optional(), // Arabic name for bilingual support
  type: z.enum(['credit_card', 'personal_loan', 'car_loan', 'mortgage', 'student_loan', 'other']),
  totalAmount: z.number().positive(),
  currentBalance: z.number().nonnegative(),
  interestRate: z.number().nonnegative().max(100),
  monthlyPayment: z.number().positive(),
  minimumPayment: z.number().positive().optional(),
  nextPaymentDate: z.date().optional(), // Next payment due date
  status: z.enum(['active', 'paid_off', 'defaulted']).default('active').optional(),
  dueDate: z.number().min(1).max(31).optional(), // Day of month
  lender: z.string().optional(),
  accountNumber: z.string().optional(),
  startDate: z.date().optional(),
  targetPayoffDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DebtItem = z.infer<typeof DebtItemSchema>;

// Add computed property type for remainingBalance (alias for currentBalance)
export type DebtItemWithComputed = DebtItem & {
  remainingBalance?: number; // Alias for currentBalance
};

// Debt Calculation Result Schema
export const DebtCalculationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  debtId: z.string().optional(),
  calculationType: z.enum(['single', 'snowball', 'avalanche', 'custom']),
  inputs: z.object({
    totalDebt: z.number().positive(),
    interestRate: z.number().nonnegative(),
    monthlyPayment: z.number().positive(),
    extraPayment: z.number().nonnegative().optional(),
    targetMonths: z.number().positive().optional(),
  }),
  results: z.object({
    months: z.number().positive(),
    years: z.number().nonnegative(),
    remainingMonths: z.number().nonnegative(),
    totalPaid: z.number().positive(),
    totalInterest: z.number().nonnegative(),
    healthScore: z.number().min(0).max(100),
    recommendations: z.array(z.any()),
    simulations: z.array(z.any()).optional(),
  }),
  createdAt: z.date(),
});

export type DebtCalculation = z.infer<typeof DebtCalculationSchema>;

// Budget Category Schema
export const BudgetCategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  nameAr: z.string().optional(), // Arabic name for bilingual support
  type: z.enum(['income', 'expense', 'savings']),
  category: z.enum([
    'salary',
    'business',
    'investments',
    'other_income',
    'housing',
    'transportation',
    'food',
    'utilities',
    'insurance',
    'healthcare',
    'entertainment',
    'personal',
    'debt_payment',
    'education',
    'charity',
    'other_expense',
    'emergency_fund',
    'retirement',
    'investments_savings',
    'goals',
  ]),
  plannedAmount: z.number().nonnegative(),
  actualAmount: z.number().nonnegative().optional(),
  allocated: z.number().nonnegative().optional(), // Monthly budget allocation
  spent: z.number().nonnegative().optional(), // Amount spent this month
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
  year: z.number().int().optional(), // Year for easier filtering
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

// Financial Goal Schema
export const FinancialGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  nameAr: z.string().optional(), // Arabic name for bilingual support
  type: z.enum([
    'emergency_fund',
    'debt_payoff',
    'retirement',
    'home_purchase',
    'education',
    'vacation',
    'investment',
    'business',
    'other',
  ]),
  category: z.string().optional(), // Additional categorization
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().default(0),
  targetDate: z.date(),
  startDate: z.date().optional(), // Goal start date
  monthlyContribution: z.number().nonnegative().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z
    .enum(['not_started', 'in_progress', 'paused', 'completed', 'abandoned'])
    .default('not_started'),
  description: z.string().optional(),
  icon: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
});

export type FinancialGoal = z.infer<typeof FinancialGoalSchema>;

// Add computed property type for deadline (alias for targetDate)
export type FinancialGoalWithComputed = FinancialGoal & {
  deadline?: Date; // Alias for targetDate
};

// Transaction Schema (for Premium users)
export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string(),
  description: z.string().optional(),
  date: z.date(),
  budgetCategoryId: z.string().optional(),
  goalId: z.string().optional(),
  debtId: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// ==========================================
// FIRESTORE COLLECTION PATHS
// ==========================================

export const COLLECTIONS = {
  USERS: 'users',
  DEBTS: (userId: string) => `users/${userId}/debts`,
  CALCULATIONS: (userId: string) => `users/${userId}/calculations`,
  BUDGETS: (userId: string) => `users/${userId}/budgets`,
  GOALS: (userId: string) => `users/${userId}/goals`,
  TRANSACTIONS: (userId: string) => `users/${userId}/transactions`,
} as const;

// ==========================================
// TYPE GUARDS
// ==========================================

export function isUser(data: unknown): data is User {
  return UserSchema.safeParse(data).success;
}

export function isDebtItem(data: unknown): data is DebtItem {
  return DebtItemSchema.safeParse(data).success;
}

export function isFinancialGoal(data: unknown): data is FinancialGoal {
  return FinancialGoalSchema.safeParse(data).success;
}

export function isBudgetCategory(data: unknown): data is BudgetCategory {
  return BudgetCategorySchema.safeParse(data).success;
}

// ==========================================
// HELPER TYPES
// ==========================================

export type SubscriptionTier = User['subscriptionTier'];
export type DebtType = DebtItem['type'];
export type GoalType = FinancialGoal['type'];
export type TransactionType = Transaction['type'];
