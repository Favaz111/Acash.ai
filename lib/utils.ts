import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دالة مساعدة لدمج class names مع Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق الأرقام بالعربية
 */
export function formatNumber(num: number, locale: string = 'ar-SA'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * تنسيق العملة
 */
export function formatCurrency(amount: number, currency: string = 'SAR', locale: string = 'ar-SA'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
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
