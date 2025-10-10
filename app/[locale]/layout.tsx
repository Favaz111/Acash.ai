import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isRTL, type Locale } from '@/i18n/config';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  // Determine text direction based on locale
  const currentLocale = locale as Locale;
  const textDirection = isRTL(currentLocale) ? 'rtl' : 'ltr';

  // Set proper language code (ar-SA for Arabic, en-US for English)
  const langCode = currentLocale === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <html lang={langCode} dir={textDirection} className={inter.className} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Riyadh">
          <QueryProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <AppLayout locale={locale}>{children}</AppLayout>
              </AnalyticsProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
