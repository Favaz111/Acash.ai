/**
 * Calculator Validation Schemas
 * Zod schemas for all calculator inputs with Arabic error messages
 */

import { z } from 'zod';

// ==========================================
// BUDGET CALCULATOR
// ==========================================

export const BudgetCalculatorSchema = z.object({
  monthlyIncome: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الدخل الشهري يجب أن يكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  monthlyExpenses: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المصروفات الشهرية لا يمكن أن تكون سالبة')
    .max(10000000, 'المبلغ كبير جداً'),
});

export type BudgetCalculatorFormData = z.infer<typeof BudgetCalculatorSchema>;

// ==========================================
// SAVINGS GOAL CALCULATOR
// ==========================================

export const SavingsGoalCalculatorSchema = z.object({
  goalAmount: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('قيمة الهدف يجب أن تكون أكبر من صفر')
    .max(1000000000, 'المبلغ كبير جداً'),
  currentSavings: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المدخرات الحالية لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً'),
  monthlyContribution: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الادخار الشهري يجب أن يكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  monthlyIncome: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الدخل الشهري لا يمكن أن يكون سالباً')
    .max(10000000, 'المبلغ كبير جداً')
    .optional(),
});

export type SavingsGoalCalculatorFormData = z.infer<typeof SavingsGoalCalculatorSchema>;

// ==========================================
// DEBT CALCULATOR
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
});

export type DebtCalculatorFormData = z.infer<typeof DebtCalculatorSchema>;

// ==========================================
// EMERGENCY FUND CALCULATOR
// ==========================================

export const EmergencyFundCalculatorSchema = z.object({
  monthlyExpenses: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('المصروفات الشهرية يجب أن تكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  targetMonths: z
    .number({ message: 'يجب إدخال رقم' })
    .int('عدد الأشهر يجب أن يكون رقم صحيح')
    .min(1, 'عدد الأشهر يجب أن يكون شهر واحد على الأقل')
    .max(24, 'عدد الأشهر يجب أن يكون 24 شهر كحد أقصى'),
  currentSavings: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المدخرات الحالية لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
});

export type EmergencyFundCalculatorFormData = z.infer<typeof EmergencyFundCalculatorSchema>;

// ==========================================
// LOAN CALCULATOR
// ==========================================

export const LoanCalculatorSchema = z.object({
  principal: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('مبلغ القرض يجب أن يكون أكبر من صفر')
    .max(100000000, 'المبلغ كبير جداً'),
  interestRate: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('نسبة الفائدة يجب أن تكون صفر أو أكبر')
    .max(100, 'نسبة الفائدة يجب أن تكون أقل من 100%'),
  termYears: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('مدة القرض يجب أن تكون أكبر من صفر')
    .max(50, 'مدة القرض يجب أن تكون 50 سنة كحد أقصى'),
});

export type LoanCalculatorFormData = z.infer<typeof LoanCalculatorSchema>;

// ==========================================
// ROI CALCULATOR
// ==========================================

export const ROICalculatorSchema = z.object({
  initialInvestment: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('الاستثمار الأولي يجب أن يكون أكبر من صفر')
    .max(1000000000, 'المبلغ كبير جداً'),
  finalValue: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('القيمة النهائية يجب أن تكون أكبر من صفر')
    .max(1000000000, 'المبلغ كبير جداً'),
  periodYears: z
    .number({ message: 'يجب إدخال رقم' })
    .positive('فترة الاستثمار يجب أن تكون أكبر من صفر')
    .max(100, 'الفترة يجب أن تكون 100 سنة كحد أقصى'),
  additionalCosts: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('التكاليف الإضافية لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
});

export type ROICalculatorFormData = z.infer<typeof ROICalculatorSchema>;

// ==========================================
// RETIREMENT CALCULATOR
// ==========================================

export const RetirementCalculatorSchema = z.object({
  currentAge: z
    .number({ message: 'يجب إدخال رقم' })
    .int('العمر يجب أن يكون رقم صحيح')
    .min(18, 'العمر يجب أن يكون 18 سنة على الأقل')
    .max(80, 'العمر يجب أن يكون 80 سنة كحد أقصى'),
  retirementAge: z
    .number({ message: 'يجب إدخال رقم' })
    .int('سن التقاعد يجب أن يكون رقم صحيح')
    .min(50, 'سن التقاعد يجب أن يكون 50 سنة على الأقل')
    .max(90, 'سن التقاعد يجب أن يكون 90 سنة كحد أقصى'),
  currentSavings: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المدخرات الحالية لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً'),
  monthlyContribution: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('المساهمة الشهرية لا يمكن أن تكون سالبة')
    .max(10000000, 'المبلغ كبير جداً'),
  expectedReturn: z
    .number({ message: 'يجب إدخال رقم' })
    .min(-50, 'العائد المتوقع يجب أن يكون أكبر من -50%')
    .max(100, 'العائد المتوقع يجب أن يكون أقل من 100%')
    .optional(),
});

export type RetirementCalculatorFormData = z.infer<typeof RetirementCalculatorSchema>;

// Cross-field validation for retirement calculator
export const RetirementCalculatorSchemaRefined = RetirementCalculatorSchema.refine(
  (data) => data.retirementAge > data.currentAge,
  {
    message: 'سن التقاعد يجب أن يكون أكبر من العمر الحالي',
    path: ['retirementAge'],
  }
);

// ==========================================
// ZAKAT CALCULATOR
// ==========================================

export const ZakatCalculatorSchema = z.object({
  cash: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('النقد لا يمكن أن يكون سالباً')
    .max(1000000000, 'المبلغ كبير جداً'),
  gold: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('قيمة الذهب لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
  silver: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('قيمة الفضة لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
  investments: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الاستثمارات لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
  businessAssets: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('أصول العمل لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
  liabilities: z
    .number({ message: 'يجب إدخال رقم' })
    .nonnegative('الديون المستحقة لا يمكن أن تكون سالبة')
    .max(1000000000, 'المبلغ كبير جداً')
    .optional(),
});

export type ZakatCalculatorFormData = z.infer<typeof ZakatCalculatorSchema>;

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validates form data and returns errors
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });

  return { success: false, errors };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: Record<string, string>, field: string): string | undefined {
  return errors[field];
}

/**
 * Check if field has error
 */
export function hasFieldError(errors: Record<string, string>, field: string): boolean {
  return field in errors;
}
