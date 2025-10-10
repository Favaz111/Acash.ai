import { z } from 'zod';

/**
 * Schema للتحقق من صحة بيانات تسجيل الدخول
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema للتحقق من صحة بيانات التسجيل
 */
export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, 'الاسم مطلوب')
      .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
      .max(50, 'الاسم طويل جداً')
      .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, 'الاسم يحتوي على أحرف غير صالحة'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
    password: z
      .string()
      .min(1, 'كلمة المرور مطلوبة')
      .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
      .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
      .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema للتحقق من صحة البريد الإلكتروني فقط
 */
export const emailSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
});

export type EmailInput = z.infer<typeof emailSchema>;
