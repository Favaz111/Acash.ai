import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles, TrendingUp, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login"
              className="text-gray-700 hover:text-primary-trust transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/auth/register"
              className="px-6 py-2.5 gradient-primary text-white rounded-lg hover:shadow-lg transition-all"
            >
              ابدأ مجاناً
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-primary-trust rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>مدعوم بالذكاء الاصطناعي المتقدم</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            رحلتك نحو
            <span className="block gradient-primary bg-clip-text text-transparent mt-2">
              الاستقلال المالي الكامل
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            منصة مالية ذكية تحلل وضعك المالي، تقدم لك خطة عمل مخصصة، وترافقك خطوة بخطوة نحو أهدافك المالية
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/assessment"
              className="w-full sm:w-auto px-8 py-4 gradient-primary text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>ابدأ التشخيص المجاني</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/tools"
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-primary-trust hover:text-primary-trust transition-all"
            >
              استكشف الأدوات المالية
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>مجاني 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>آمن ومشفّر</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span>نتائج فورية</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className={`w-14 h-14 ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            © 2025 Acash.ai - جميع الحقوق محفوظة
          </p>
          <p className="text-xs mt-2">
            نحو استقرار مالي وبناء ثروة ذكية
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Sparkles,
    gradient: "gradient-primary",
    title: "تشخيص مالي شامل",
    description: "تحليل عميق لوضعك المالي الحالي مع تقرير مفصل وخطة عمل مخصصة"
  },
  {
    icon: TrendingUp,
    gradient: "gradient-success",
    title: "أدوات مالية ذكية",
    description: "مجموعة متكاملة من الأدوات لإدارة الديون، الميزانية، الاستثمار والمزيد"
  },
  {
    icon: Shield,
    gradient: "gradient-premium",
    title: "مساعد مالي ذكي",
    description: "مساعد شخصي مدعوم بالذكاء الاصطناعي يرافقك في رحلتك المالية"
  }
];
