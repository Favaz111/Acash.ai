import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://acash.ai';
  const currentDate = new Date();

  const routes = [
    '',
    '/about',
    '/tools',
    '/tools/debt-calculator',
    '/tools/budget-planner',
    '/tools/goal-tracker',
    '/assessment',
    '/auth/login',
    '/auth/register',
    '/dashboard',
    '/pricing',
    '/contact',
    '/blog',
    '/help',
    '/privacy',
    '/terms',
  ];

  const sitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : route.startsWith('/blog') ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/tools') ? 0.9 : 0.8,
  }));

  // Add language alternates
  const multilingualRoutes = routes.map((route) => [
    {
      url: `${baseUrl}/ar${route}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en${route}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]);

  return [...sitemap, ...multilingualRoutes.flat()];
}
