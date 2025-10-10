'use client';

import { Link } from '@/i18n/navigation';
import {
  // Sparkles,
  Wallet,
  Shield,
  CreditCard,
  Target,
  TrendingUp,
  HandCoins,
  Lock,
  Zap,
  Star,
} from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const freeTools = [
  {
    id: 'debt-management',
    title: '🏦 حاسبة سداد الديون',
    description: 'احسب مدة السداد واحصل على توصيات ذكية لتوفير آلاف الريالات',
    icon: CreditCard,
    gradient: 'gradient-primary',
    href: '/tools/debt-management',
  },
  {
    id: 'smart-budget',
    title: '💰 الميزانية الأساسية',
    description: 'احسب دخلك ومصروفاتك واعرف الفائض أو العجز بوضوح',
    icon: Wallet,
    gradient: 'gradient-success',
    href: '/tools/smart-budget',
  },
  {
    id: 'goal-tracker',
    title: '🎯 متتبع الأهداف',
    description: 'تتبع أهدافك المالية وتقدمك نحو تحقيقها',
    icon: Target,
    gradient: 'gradient-premium',
    href: '/tools/goal-tracker',
  },
  {
    id: 'zakat',
    title: '🤲 حاسبة الزكاة',
    description: 'احسب زكاة أموالك وأصولك بدقة شرعية',
    icon: HandCoins,
    gradient: 'gradient-success',
    href: '/tools/zakat',
  },
];

const premiumTools = [
  {
    id: 'debt-management',
    title: '🏦 إدارة الديون المتقدمة',
    description: 'إدارة ديون متعددة + استراتيجيتين ذكيتين (كرة الثلج والانهيار الجليدي)',
    icon: CreditCard,
    gradient: 'gradient-primary',
    href: '/tools/debt-management',
    features: ['ديون متعددة', 'استراتيجيتين ذكيتين', 'جدول سداد 24 شهر', 'تتبع تلقائي'],
  },
  {
    id: 'smart-budget',
    title: '💰 الميزانية الذكية',
    description: 'تحليل 50/30/20 المتقدم + توصيات تلقائية + تتبع شهري',
    icon: Wallet,
    gradient: 'gradient-success',
    href: '/tools/smart-budget',
    features: ['قاعدة 50/30/20', 'تحليل بصري', 'توصيات تلقائية', 'تتبع شهري'],
  },
  {
    id: 'emergency-fund-advanced',
    title: '🏥 صندوق الطوارئ المتقدم',
    description: 'خطة بناء تدريجية + توقعات زمنية + محاكاة الطوارئ',
    icon: Shield,
    gradient: 'gradient-premium',
    href: '/tools/emergency-fund',
    features: ['خطة تدريجية', 'توقعات زمنية', 'محاكاة طوارئ', 'تكامل Dashboard'],
  },
  {
    id: 'financial-freedom',
    title: '🎯 الحرية المالية (FIRE)',
    description: 'احسب رقم الحرية المالية + مدة الوصول + خطة مرحلية',
    icon: Target,
    gradient: 'gradient-primary',
    href: '/tools/financial-freedom',
    features: ['رقم الحرية', 'خطة FIRE', 'محاكاة متعددة', 'تقرير مفصل'],
  },
  {
    id: 'investment-planner',
    title: '📈 مخطط الاستثمار',
    description: 'بناء محفظة استثمارية متنوعة + تحليل مخاطر + إعادة توازن',
    icon: TrendingUp,
    gradient: 'gradient-premium',
    href: '/tools/investment-planner',
    features: ['محفظة مخصصة', 'تحليل مخاطر', 'إعادة توازن', 'تتبع أداء'],
  },
];

function ToolsContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🛠️ الأدوات المالية الذكية
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              أدوات مجانية قيّمة + أدوات متقدمة لتحليل أعمق
            </p>
          </div>

          {/* Free Tools Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">📦 الأدوات المجانية</h2>
                <p className="text-gray-600">قيمة حقيقية - نتائج غنية - توصيات عملية</p>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                ✨ مجاني بالكامل
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freeTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.id} href={tool.href}>
                    <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-primary">
                      <CardHeader>
                        <div
                          className={`w-14 h-14 ${tool.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <CardTitle className="text-lg">{tool.title}</CardTitle>
                        <CardDescription className="text-sm">{tool.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Premium Tools Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">⭐ الأدوات المتقدمة</h2>
                <p className="text-gray-600">تحليل أعمق - استراتيجيات متقدمة - تتبع تلقائي</p>
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Premium</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={tool.id}
                    className="h-full border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all relative group"
                  >
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <CardHeader>
                      <div
                        className={`w-14 h-14 ${tool.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform opacity-60`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-lg mb-2">{tool.title}</CardTitle>
                      <CardDescription className="text-sm mb-4">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {tool.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        size="sm"
                        asChild
                      >
                        <Link href={tool.href}>
                          <Lock className="w-4 h-4 ml-2" />
                          جرب مجاناً
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Premium CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-2">🎁 عرض خاص - شهر مجاني</h3>
              <p className="mb-4 opacity-90">
                جرب جميع الأدوات المتقدمة مجاناً لمدة 30 يوم - بدون بطاقة ائتمان
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Star className="w-5 h-5 ml-2" />
                ابدأ تجربتك المجانية
              </Button>
              <p className="text-xs mt-3 opacity-75">* يمكنك الإلغاء في أي وقت</p>
            </div>
          </div>

          {/* Assessment CTA */}
          <div className="text-center p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">🩺 هل تريد خطة مالية مخصصة؟</h2>
            <p className="text-lg mb-6 opacity-90">
              ابدأ التشخيص المالي المجاني واحصل على توصيات وخطة عمل مخصصة لك
            </p>
            <Link
              href="/assessment/quick"
              className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:shadow-2xl transition-all"
            >
              ابدأ التشخيص السريع (دقيقتان)
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="text-sm">© 2025 Acash.ai - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <ErrorBoundary>
      <ToolsContent />
    </ErrorBoundary>
  );
}
