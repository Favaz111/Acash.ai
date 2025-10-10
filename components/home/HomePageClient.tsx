'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, TrendingUp, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/lib/dictionaries';

interface HomePageClientProps {
  dict: Dictionary;
  locale: string;
}

export default function HomePageClient({ dict, locale }: HomePageClientProps) {
  const isArabic = locale === 'ar';
  const { home } = dict;

  const features = [
    {
      icon: Calculator,
      title: home.features.calculators.title,
      desc: home.features.calculators.description,
    },
    {
      icon: TrendingUp,
      title: home.features.reports.title,
      desc: home.features.reports.description,
    },
    {
      icon: Shield,
      title: home.features.security.title,
      desc: home.features.security.description,
    },
    {
      icon: Zap,
      title: home.features.speed.title,
      desc: home.features.speed.description,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            {home.hero.title}{' '}
            <span className="bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              {home.hero.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              <Link href="/assessment/quick">
                {home.hero.ctaPrimary}
                <ArrowLeft className={`w-5 h-5 ${isArabic ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/tools">{home.hero.ctaSecondary}</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{home.hero.freeBadge}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {home.features.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {home.features.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-trust to-primary-innovation rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {home.cta.title}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {home.cta.subtitle}
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-lg">
            <Link href="/assessment/quick">
              {home.cta.button}
              <ArrowLeft className={`w-5 h-5 ${isArabic ? 'mr-2' : 'ml-2'}`} />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
