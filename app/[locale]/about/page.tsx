import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { Target, Heart, TrendingUp, Shield, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'عن Acash.ai - منصة التخطيط المالي الذكية',
  description:
    'تعرف على Acash.ai، منصة التخطيط المالي الشخصي المدعومة بالذكاء الاصطناعي. مهمتنا هي تمكينك من تحقيق الحرية المالية والاستقلال المالي.',
  keywords: [
    'عن Acash.ai',
    'التخطيط المالي',
    'الذكاء الاصطناعي المالي',
    'إدارة الأموال',
    'الحرية المالية',
    'التقنية المالية',
  ],
  openGraph: {
    title: 'عن Acash.ai - منصة التخطيط المالي الذكية',
    description:
      'تعرف على مهمتنا في تمكين الأفراد من تحقيق الحرية المالية من خلال التخطيط الذكي والأدوات المتقدمة.',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'عن Acash.ai - منصة التخطيط المالي الذكية',
    description:
      'تعرف على مهمتنا في تمكين الأفراد من تحقيق الحرية المالية من خلال التخطيط الذكي والأدوات المتقدمة.',
  },
  alternates: {
    canonical: 'https://acash.ai/about',
  },
};

const teamValues = [
  {
    icon: Target,
    title: 'رؤيتنا',
    description:
      'نسعى لجعل التخطيط المالي الذكي متاحًا للجميع، وتمكين كل فرد من تحقيق الحرية المالية والاستقلال المالي.',
  },
  {
    icon: Heart,
    title: 'مهمتنا',
    description:
      'نوفر أدوات ذكية ومبسطة تساعدك على فهم وضعك المالي، وضع أهداف واقعية، وبناء مستقبل مالي آمن.',
  },
  {
    icon: Shield,
    title: 'قيمنا',
    description:
      'الشفافية، الأمان، والثقة هي أساس عملنا. نحافظ على خصوصية بياناتك ونقدم لك نصائح موضوعية بدون مصالح خفية.',
  },
];

const features = [
  'تشخيص مالي شامل مدعوم بالذكاء الاصطناعي',
  'أدوات تخطيط مجانية وقوية',
  'خطط عمل مخصصة حسب وضعك المالي',
  'واجهة بسيطة وسهلة الاستخدام',
  'محتوى تعليمي غني بالعربية',
  'دعم فني سريع ومتجاوب',
];

const milestones = [
  {
    year: '2024',
    title: 'الانطلاقة',
    description: 'إطلاق النسخة التجريبية من Acash.ai وبداية الرحلة',
  },
  {
    year: '2025',
    title: 'التوسع',
    description: 'إضافة أدوات متقدمة وتوسيع قاعدة المستخدمين',
  },
  {
    year: '2026+',
    title: 'المستقبل',
    description: 'بناء منصة شاملة للتخطيط المالي الشامل في المنطقة',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">عن Acash.ai</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            منصة التخطيط المالي الشخصي المدعومة بالذكاء الاصطناعي.
            <br />
            نساعدك على فهم وضعك المالي وبناء مستقبل أفضل.
          </p>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary-trust transition-all">
                <CardHeader>
                  <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Acash.ai */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا Acash.ai؟</h2>
            <p className="text-lg text-gray-600">
              نجمع بين قوة الذكاء الاصطناعي وبساطة التصميم لتقديم تجربة فريدة
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">رحلتنا</h2>
            <p className="text-lg text-gray-600">من فكرة إلى منصة رائدة</p>
          </div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-r-4 border-r-primary-trust">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-trust to-primary-innovation text-white flex items-center justify-center font-bold flex-shrink-0">
                      {milestone.year}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary-trust to-primary-innovation rounded-2xl p-12 text-white">
          <TrendingUp className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك المالية اليوم</h2>
          <p className="text-lg mb-8 opacity-90">
            انضم لآلاف المستخدمين الذين حققوا تقدمًا حقيقيًا في وضعهم المالي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/assessment/quick">
                ابدأ التشخيص المجاني
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white text-white"
              asChild
            >
              <Link href="/tools">تصفح الأدوات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">هل لديك أسئلة أو اقتراحات؟</p>
        <Button variant="outline" asChild>
          <Link href="/contact">تواصل معنا</Link>
        </Button>
      </section>
    </div>
  );
}
