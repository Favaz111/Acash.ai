import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/i18n/config';
import HomePageClient from '@/components/home/HomePageClient';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return <HomePageClient dict={dict} locale={locale} />;
}
