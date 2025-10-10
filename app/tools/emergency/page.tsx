'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  // TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Lock,
  Download,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
// @ts-ignore - imported for future validation
import { EmergencyFundCalculatorSchema } from '@/lib/validations/calculators';
import { generateEmergencyPDF } from '@/lib/utils/pdf-generator';

interface EmergencyFundResult {
  targetAmount: number;
  monthsNeeded: number;
  monthlySavings: number;
  currentProgress: number;
  healthScore: number;
  status: 'safe' | 'moderate' | 'at-risk';
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  impact: string;
  benefits: string[];
}

export default function EmergencyFundPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [employmentType, setEmploymentType] = useState<string>('موظف');
  const [results, setResults] = useState<EmergencyFundResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateEmergencyFund = () => {
    // Validate inputs
    const validation = EmergencyFundCalculatorSchema.safeParse({
      monthlyExpenses,
      currentSavings,
      dependents,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (!monthlyExpenses) return;

    // تحديد عدد الأشهر المطلوبة حسب نوع العمل والمعالين
    let monthsRequired = 3; // الحد الأدنى

    if (employmentType === 'موظف') {
      monthsRequired = 3;
    } else if (employmentType === 'عمل حر') {
      monthsRequired = 6;
    } else if (employmentType === 'صاحب عمل') {
      monthsRequired = 9;
    }

    // زيادة الأشهر حسب المعالين
    if (dependents > 0) {
      monthsRequired += Math.min(dependents, 3); // حد أقصى 3 أشهر إضافية
    }

    const targetAmount = monthlyExpenses * monthsRequired;
    const progressPercentage = (currentSavings / targetAmount) * 100;
    const remaining = Math.max(0, targetAmount - currentSavings);

    // حساب المدة المطلوبة (نفترض ادخار 20% من المصروفات)
    const suggestedMonthlySavings = monthlyExpenses * 0.2;
    const monthsNeeded = remaining > 0 ? Math.ceil(remaining / suggestedMonthlySavings) : 0;

    // تحديد الحالة
    let status: 'safe' | 'moderate' | 'at-risk';
    if (progressPercentage >= 100) {
      status = 'safe';
    } else if (progressPercentage >= 50) {
      status = 'moderate';
    } else {
      status = 'at-risk';
    }

    // حساب درجة الأمان (0-100)
    let healthScore = 0;

    if (progressPercentage >= 100) {
      healthScore = 100;
    } else if (progressPercentage >= 75) {
      healthScore = 80 + (progressPercentage - 75) * 0.8; // 80-100
    } else if (progressPercentage >= 50) {
      healthScore = 60 + (progressPercentage - 50) * 0.8; // 60-80
    } else if (progressPercentage >= 25) {
      healthScore = 40 + (progressPercentage - 25) * 0.8; // 40-60
    } else {
      healthScore = progressPercentage * 1.6; // 0-40
    }

    const result: EmergencyFundResult = {
      targetAmount,
      monthsNeeded,
      monthlySavings: suggestedMonthlySavings,
      currentProgress: progressPercentage,
      healthScore: Math.round(healthScore),
      status,
    };

    setResults(result);
    setRecommendations(generateRecommendations(result, monthlyExpenses, currentSavings));
  };

  const generateRecommendations = (
    result: EmergencyFundResult,
    expenses: number,
    savings: number
  ): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on progress
    if (result.currentProgress < 100) {
      const remaining = result.targetAmount - savings;
      const aggressive = expenses * 0.3;
      const monthsAggressive = Math.ceil(remaining / aggressive);

      recs.push({
        priority: 'high',
        title: 'زيادة الادخار الشهري إلى 30%',
        impact: 'عالي',
        benefits: [
          `بناء صندوق الطوارئ في ${monthsAggressive} شهر`,
          `توفير ${formatCurrency(aggressive)} شهرياً`,
          'حماية مالية أسرع',
        ],
      });
    }

    // Recommendation 2: Automation
    recs.push({
      priority: 'high',
      title: 'أتمتة الادخار',
      impact: 'عالي',
      benefits: ['تحويل تلقائي في بداية كل شهر', 'تجنب إغراء الإنفاق', 'انضباط مالي أفضل'],
    });

    // Recommendation 3: Separate account
    recs.push({
      priority: 'medium',
      title: 'حساب منفصل لصندوق الطوارئ',
      impact: 'متوسط',
      benefits: ['عدم الخلط مع المدخرات العادية', 'سهولة التتبع', 'تقليل إغراء السحب'],
    });

    return recs;
  };

  
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateEmergencyPDF({
        monthlyExpenses,
        targetAmount: results.targetAmount,
        currentSavings,
        monthsNeeded: results.monthsNeeded,
        monthlySavings: results.monthlySavings,
        healthScore: results.healthScore,
        status: results.status,
        recommendations,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'safe':
        return {
          icon: Shield,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'آمن - صندوق كامل',
          emoji: '✅',
        };
      case 'moderate':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'معتدل - يحتاج تطوير',
          emoji: '⚠️',
        };
      case 'at-risk':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'في خطر - ابدأ الآن',
          emoji: '🚨',
        };
      default:
        return {
          icon: Shield,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'غير محدد',
          emoji: '❓',
        };
    }
  };

  const getHealthScoreInfo = (score: number) => {
    if (score >= 80) {
      return { color: 'text-green-600', bgColor: 'bg-green-50', status: 'ممتاز', emoji: '🌟' };
    } else if (score >= 60) {
      return { color: 'text-blue-600', bgColor: 'bg-blue-50', status: 'جيد', emoji: '👍' };
    } else if (score >= 40) {
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', status: 'مقبول', emoji: '⚠️' };
    } else {
      return { color: 'text-red-600', bgColor: 'bg-red-50', status: 'ضعيف', emoji: '🔴' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>

          <Link
            href="/tools"
            className="flex items-center gap-2 text-gray-700 hover:text-primary-trust transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الأدوات المالية</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-premium rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة صندوق الطوارئ</h1>
          <p className="text-xl text-gray-600">احسب المبلغ المثالي لصندوق الطوارئ حسب وضعك</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>أدخل معلوماتك</CardTitle>
              <CardDescription>املأ الحقول أدناه لحساب صندوق الطوارئ المثالي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="المصروفات الشهرية الأساسية (ريال)"
                  type="number"
                  placeholder="8000"
                  value={monthlyExpenses || ''}
                  onChange={(e) => {
                    setMonthlyExpenses(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, monthlyExpenses: '' }));
                  }}
                  helperText="المصروفات الضرورية فقط (إيجار، طعام، فواتير)"
                />
                {errors['monthlyExpenses'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyExpenses']}</p>
                )}
              </div>

              <div>
                <Input
                  label="مدخراتك الحالية (ريال)"
                  type="number"
                  placeholder="10000"
                  value={currentSavings || ''}
                  onChange={(e) => {
                    setCurrentSavings(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, currentSavings: '' }));
                  }}
                  helperText="المبلغ المخصص لصندوق الطوارئ"
                />
                {errors['currentSavings'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['currentSavings']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع العمل</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="موظف">موظف</option>
                  <option value="عمل حر">عمل حر</option>
                  <option value="صاحب عمل">صاحب عمل</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">يؤثر على عدد الأشهر المطلوبة</p>
              </div>

              <div>
                <Input
                  label="عدد المعالين"
                  type="number"
                  placeholder="0"
                  value={dependents || ''}
                  onChange={(e) => {
                    setDependents(parseInt(e.target.value));
                    setErrors((prev) => ({ ...prev, dependents: '' }));
                  }}
                  helperText="الزوج/الزوجة + الأطفال"
                />
                {errors['dependents'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['dependents']}</p>
                )}
              </div>

              <Button onClick={calculateEmergencyFund} className="w-full" size="lg">
                احسب صندوق الطوارئ
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>نتائج الحساب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Health Score */}
                  <div
                    className={`p-6 ${getHealthScoreInfo(results.healthScore).bgColor} rounded-xl text-center`}
                  >
                    <p className="text-sm text-gray-600 mb-2">درجة الأمان المالي</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-5xl">
                        {getHealthScoreInfo(results.healthScore).emoji}
                      </span>
                      <p
                        className={`text-5xl font-bold ${getHealthScoreInfo(results.healthScore).color}`}
                      >
                        {results.healthScore}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${getHealthScoreInfo(results.healthScore).color}`}
                    >
                      {getHealthScoreInfo(results.healthScore).status}
                    </p>
                  </div>

                  {/* Status Card */}
                  <div
                    className={`p-4 ${getStatusInfo(results.status).bgColor} border ${getStatusInfo(results.status).borderColor} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const StatusIcon = getStatusInfo(results.status).icon;
                        return (
                          <StatusIcon
                            className={`w-6 h-6 ${getStatusInfo(results.status).color}`}
                          />
                        );
                      })()}
                      <div className="flex-1">
                        <p className={`font-bold ${getStatusInfo(results.status).color}`}>
                          {getStatusInfo(results.status).text}
                        </p>
                      </div>
                      <span className="text-2xl">{getStatusInfo(results.status).emoji}</span>
                    </div>
                  </div>

                  {/* Main Results */}
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                      <p className="text-sm opacity-90 mb-1">المبلغ المستهدف</p>
                      <p className="text-3xl font-bold">{formatCurrency(results.targetAmount)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">التقدم الحالي</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {results.currentProgress.toFixed(0)}%
                        </p>
                      </div>

                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">المدة المتوقعة</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {results.monthsNeeded} {results.monthsNeeded === 1 ? 'شهر' : 'شهور'}
                        </p>
                      </div>

                      <div className="col-span-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">الادخار الشهري المقترح</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-green-700">
                            {formatCurrency(results.monthlySavings)}
                          </p>
                          <p className="text-sm text-green-600">
                            ({((results.monthlySavings / monthlyExpenses) * 100).toFixed(0)}% من
                            المصروفات)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">التقدم</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(currentSavings)} / {formatCurrency(results.targetAmount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(results.currentProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                توصيات ذكية لبناء صندوق الطوارئ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{rec.title}</h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(rec.priority)}`}
                          >
                            {rec.impact}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {rec.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Visualization */}
        {results && results.monthsNeeded > 0 && (
          <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">📅 خطة البناء المرحلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <h4 className="font-semibold text-gray-900">الشهر 1-3</h4>
                  </div>
                  <p className="text-sm text-gray-700">بناء الأساس (شهر واحد من المصروفات)</p>
                  <p className="text-xs text-blue-600 mt-1">
                    الهدف: {formatCurrency(monthlyExpenses)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <h4 className="font-semibold text-gray-900">الشهر 4-8</h4>
                  </div>
                  <p className="text-sm text-gray-700">التوسع (3 أشهر من المصروفات)</p>
                  <p className="text-xs text-purple-600 mt-1">
                    الهدف: {formatCurrency(monthlyExpenses * 3)}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <h4 className="font-semibold text-gray-900">الإكمال</h4>
                  </div>
                  <p className="text-sm text-gray-700">الوصول للهدف الكامل</p>
                  <p className="text-xs text-green-600 mt-1">
                    الهدف: {formatCurrency(results.targetAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        {results && (
          <Card className="mt-8 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">💡 نصائح مهمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">لا تستخدمه إلا للطوارئ</p>
                    <p className="text-sm text-green-800">فقط للأزمات الحقيقية، ليس للرغبات</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">احفظه في حساب منفصل</p>
                    <p className="text-sm text-green-800">سهل الوصول لكن بعيد عن الإغراءات</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">أعد بناءه فوراً</p>
                    <p className="text-sm text-green-800">بعد أي استخدام، ابدأ البناء من جديد</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">راجعه كل 6 أشهر</p>
                    <p className="text-sm text-green-800">المصروفات تتغير، حدّث الصندوق</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Export Section */}
        {results && (
          <Card className="mt-8 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                احصل على تقرير صندوق الطوارئ
              </CardTitle>
              <CardDescription>تقرير PDF مفصل (5 صفحات) يحتوي على:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    'تحليل وضعك الحالي',
                    'المبلغ المستهدف وسبب اختياره',
                    'خطة البناء المرحلية',
                    'التوصيات الذكية (3 توصيات)',
                    'جدول الادخار الشهري',
                    'نصائح الحفاظ على الصندوق',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Mail className="w-4 h-4 ml-2" />
                    إرسال بالبريد
                  </Button>
                  <Button onClick={handleDownloadPDF} className="sm:w-auto bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 ml-2" />
                    تحميل PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium CTA */}
        {results && (
          <Card className="mt-8 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-purple-900">هل تريد خطة تنفيذية متقدمة؟</CardTitle>
              </div>
              <CardDescription>صندوق الطوارئ المتقدم (Premium) يقدم لك:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {[
                  'خطة بناء تدريجية مفصلة (24 شهر)',
                  'محاكاة سيناريوهات الطوارئ',
                  'توقعات زمنية دقيقة',
                  'تكامل مع Dashboard للتتبع',
                  'تنبيهات ذكية شهرية',
                  'تقارير تقدم دورية',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/tools/emergency-fund-advanced">
                    <Lock className="w-5 h-5 ml-2" />
                    جرب صندوق الطوارئ المتقدم (30 يوم مجاناً)
                  </Link>
                </Button>
                <p className="text-sm text-gray-600">بدون بطاقة ائتمان - يمكنك الإلغاء في أي وقت</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
