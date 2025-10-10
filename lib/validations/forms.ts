/**
 * Form Validation Schemas
 * Zod schemas for all user inputs
 */

import { z } from 'zod';

// ==========================================
// AUTHENTICATION FORMS
// ==========================================

export const RegisterSchema = z
  .object({
    displayName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم طويل جداً'),
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    password: z
      .string()
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .max(100, 'كلمة المرور طويلة جداً'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

// ==========================================
// DEBT CALCULATOR FORMS
// ==========================================

export const DebtCalculatorSchema = z.object({
  totalDebt: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('مبلغ الدين يجب أن يكون أكبر من صفر')
    .max(100000000, 'المبلغ كبير جداً'),
  interestRate: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('نسبة الفائدة يجب أن تكون صفر أو أكبر')
    .max(100, 'نسبة الفائدة يجب أن تكون أقل من 100%'),
  monthlyPayment: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الدفعة الشهرية يجب أن تكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  debtType: z.enum([
    'credit_card',
    'personal_loan',
    'car_loan',
    'mortgage',
    'student_loan',
    'other',
  ]),
  targetMonths: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('عدد الأشهر يجب أن يكون أكبر من صفر')
    .max(600, 'المدة طويلة جداً')
    .optional(),
  extraPayment: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الدفعة الإضافية يجب أن تكون صفر أو أكبر')
    .optional(),
});

export type DebtCalculatorFormData = z.infer<typeof DebtCalculatorSchema>;

export const DebtItemSchema = z.object({
  name: z.string().min(1, 'اسم الدين مطلوب').max(100, 'الاسم طويل جداً'),
  type: z.enum(['credit_card', 'personal_loan', 'car_loan', 'mortgage', 'student_loan', 'other']),
  totalAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .max(100000000, 'المبلغ كبير جداً'),
  currentBalance: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الرصيد لا يمكن أن يكون سالباً')
    .max(100000000, 'المبلغ كبير جداً'),
  interestRate: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('نسبة الفائدة يجب أن تكون صفر أو أكبر')
    .max(100, 'نسبة الفائدة يجب أن تكون أقل من 100%'),
  monthlyPayment: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الدفعة الشهرية يجب أن تكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  minimumPayment: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الحد الأدنى للدفعة يجب أن يكون أكبر من صفر')
    .optional(),
  lender: z.string().max(100, 'الاسم طويل جداً').optional(),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
});

export type DebtItemFormData = z.infer<typeof DebtItemSchema>;

// ==========================================
// BUDGET FORMS
// ==========================================

export const BudgetCategorySchema = z.object({
  name: z.string().min(1, 'اسم الفئة مطلوب').max(100, 'الاسم طويل جداً'),
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
  plannedAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المبلغ لا يمكن أن يكون سالباً')
    .max(10000000, 'المبلغ كبير جداً'),
  actualAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المبلغ لا يمكن أن يكون سالباً')
    .max(10000000, 'المبلغ كبير جداً')
    .optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'صيغة الشهر غير صحيحة (YYYY-MM)'),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
});

export type BudgetCategoryFormData = z.infer<typeof BudgetCategorySchema>;

// ==========================================
// GOAL FORMS
// ==========================================

export const FinancialGoalSchema = z.object({
  name: z.string().min(1, 'اسم الهدف مطلوب').max(100, 'الاسم طويل جداً'),
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
  targetAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('المبلغ المستهدف يجب أن يكون أكبر من صفر')
    .max(1000000000, 'المبلغ كبير جداً'),
  currentAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المبلغ الحالي لا يمكن أن يكون سالباً')
    .default(0),
  targetDate: z.date({ message: 'التاريخ غير صحيح' }),
  monthlyContribution: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المساهمة الشهرية لا يمكن أن تكون سالبة')
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  description: z.string().max(500, 'الوصف طويل جداً').optional(),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
});

export type FinancialGoalFormData = z.infer<typeof FinancialGoalSchema>;

// ==========================================
// ASSESSMENT FORMS
// ==========================================

export const QuickAssessmentSchema = z.object({
  monthlyIncome: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الدخل الشهري لا يمكن أن يكون سالباً')
    .max(10000000, 'المبلغ كبير جداً'),
  monthlyExpenses: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المصروفات لا يمكن أن تكون سالبة')
    .max(10000000, 'المبلغ كبير جداً'),
  totalSavings: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المدخرات لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً'),
  totalDebts: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الديون لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً'),
  hasEmergencyFund: z.boolean(),
  emergencyFundMonths: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('عدد الأشهر لا يمكن أن يكون سالباً')
    .max(24, 'عدد الأشهر كبير جداً')
    .optional(),
});

export type QuickAssessmentFormData = z.infer<typeof QuickAssessmentSchema>;

// ==========================================
// CONTACT/SUPPORT FORMS
// ==========================================

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  subject: z.string().min(3, 'الموضوع قصير جداً').max(200, 'الموضوع طويل جداً'),
  message: z.string().min(10, 'الرسالة قصيرة جداً').max(2000, 'الرسالة طويلة جداً'),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// ==========================================
// VALIDATION HELPERS
// ==========================================

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validateSARAmount(amount: number): boolean {
  return z.number().nonnegative().max(1000000000).safeParse(amount).success;
}

export function validatePercentage(value: number): boolean {
  return z.number().min(0).max(100).safeParse(value).success;
}

export function validatePhoneNumber(phone: string): boolean {
  // Saudi phone number format: +966XXXXXXXXX or 05XXXXXXXX
  const saudiPhoneRegex = /^(\+966|966|05)[0-9]{8,9}$/;
  return saudiPhoneRegex.test(phone);
}

export function validateIBAN(iban: string): boolean {
  // Saudi IBAN format: SA followed by 22 digits
  const saudiIBANRegex = /^SA[0-9]{22}$/;
  return saudiIBANRegex.test(iban);
}
