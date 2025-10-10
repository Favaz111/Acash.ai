import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Resolve the locale
  let locale = await requestLocale;

  // Validate locale
  if (!locale || !locales.includes(locale as any)) {
    locale = 'ar'; // fallback to Arabic
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
