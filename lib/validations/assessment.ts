import { z } from 'zod';

/**
 * Schema للمعلومات الشخصية
 */
export const personalInfoSchema = z.object({
  age: z
    .number({
      message: 'العمر يجب أن يكون رقماً',
    })
    .int({ message: 'العمر يجب أن يكون رقماً صحيحاً' })
    .min(18, { message: 'يجب أن يكون عمرك 18 سنة على الأقل' })
    .max(100, { message: 'قيمة غير صالحة للعمر' }),
  maritalStatus: z.enum(['أعزب', 'متزوج', 'مطلق', 'أرمل'], {
    message: 'الحالة الاجتماعية مطلوبة',
  }),
  dependents: z
    .number({
      message: 'عدد المعالين يجب أن يكون رقماً',
    })
    .int({ message: 'عدد المعالين يجب أن يكون رقماً صحيحاً' })
    .min(0, { message: 'عدد المعالين لا يمكن أن يكون سالباً' })
    .max(20, { message: 'عدد المعالين كبير جداً' }),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

/**
 * Schema للوضع المالي
 */
export const financialStatusSchema = z
  .object({
    monthlyIncome: z
      .number({
        message: 'الدخل الشهري يجب أن يكون رقماً',
      })
      .positive({ message: 'الدخل الشهري يجب أن يكون أكبر من صفر' })
      .max(10000000, { message: 'قيمة الدخل غير منطقية' }),
    monthlyExpenses: z
      .number({
        message: 'المصروفات الشهرية يجب أن تكون رقماً',
      })
      .nonnegative({ message: 'المصروفات لا يمكن أن تكون سالبة' })
      .max(10000000, { message: 'قيمة المصروفات غير منطقية' }),
    totalSavings: z
      .number({
        message: 'المدخرات يجب أن تكون رقماً',
      })
      .nonnegative({ message: 'المدخرات لا يمكن أن تكون سالبة' })
      .max(1000000000, { message: 'قيمة المدخرات غير منطقية' }),
    totalDebts: z
      .number({
        message: 'الديون يجب أن تكون رقماً',
      })
      .nonnegative({ message: 'الديون لا يمكن أن تكون سالبة' })
      .max(1000000000, { message: 'قيمة الديون غير منطقية' }),
  })
  .refine((data) => data.monthlyExpenses <= data.monthlyIncome * 2, {
    message: 'المصروفات أكبر بكثير من الدخل - يرجى المراجعة',
    path: ['monthlyExpenses'],
  });

export type FinancialStatusInput = z.infer<typeof financialStatusSchema>;

/**
 * Schema للأهداف المالية
 */
export const financialGoalsSchema = z.object({
  goals: z
    .array(z.string())
    .min(1, { message: 'يجب اختيار هدف واحد على الأقل' })
    .max(6, { message: 'لا يمكن اختيار أكثر من 6 أهداف' }),
  targetAmount: z
    .number({
      message: 'المبلغ المستهدف يجب أن يكون رقماً',
    })
    .positive({ message: 'المبلغ المستهدف يجب أن يكون أكبر من صفر' })
    .max(1000000000, { message: 'المبلغ المستهدف غير منطقي' }),
  timeframe: z
    .number({
      message: 'الإطار الزمني يجب أن يكون رقماً',
    })
    .int()
    .positive()
    .max(50, { message: 'الإطار الزمني طويل جداً' }),
});

export type FinancialGoalsInput = z.infer<typeof financialGoalsSchema>;

/**
 * Schema كامل للتشخيص المالي
 */
export const fullAssessmentSchema = z.object({
  personalInfo: personalInfoSchema,
  financialStatus: financialStatusSchema,
  financialGoals: financialGoalsSchema,
});

export type FullAssessmentInput = z.infer<typeof fullAssessmentSchema>;
