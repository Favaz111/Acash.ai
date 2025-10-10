import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * دالة مساعدة لدمج class names مع Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق الأرقام بالإنجليزية بدون كسور عشرية
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(num));
}

/**
 * تنسيق العملة بالإنجليزية بدون كسور عشرية
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return (
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(rounded) + ' ر.س'
  );
}

/**
 * تنسيق التاريخ
 */
export function formatDate(date: Date, locale: string = 'ar-SA'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
