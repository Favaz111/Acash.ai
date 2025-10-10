'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CreditCard,
  TrendingUp,
  AlertCircle,
  FileText,
  Mail,
  Download,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
// @ts-ignore
import { DebtCalculatorSchema } from '@/lib/validations/calculators';
import { calculateSingleDebt } from '@/lib/utils/debt-calculator';
import { generateDebtReportPDF } from '@/lib/utils/pdf-generator';

interface DebtCalculationResult {
  months: number;
  years: number;
  remainingMonths: number;
  totalPaid: number;
  totalInterest: number;
  principalPaid: number;
  error?: string;
}

interface DebtResults {
  months: number;
  years: number;
  remainingMonths: number;
  totalPaid: number;
  totalInterest: number;
  principalPaid: number;
  resultWithExtra?: DebtCalculationResult;
  recommendations: any[];
  simulations: any[];
  healthScore: number;
  insights: any[];
  finalPayment: number;
  extraPayment: number;
  error?: string;
}

interface DebtError {
  error: string;
}

// أنواع الديون
const DEBT_TYPES = [
  { id: 'credit_card', label: 'بطاقة ائتمانية', avgRate: 24 },
  { id: 'personal_loan', label: 'قرض شخصي', avgRate: 12 },
  { id: 'car_loan', label: 'قرض سيارة', avgRate: 8 },
  { id: 'mortgage', label: 'قرض عقاري', avgRate: 4 },
  { id: 'other', label: 'أخرى', avgRate: 10 },
];

export default function DebtCalculatorPage() {
  const [totalDebt, setTotalDebt] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(2500);
  const [debtType, setDebtType] = useState<string>('personal_loan');
  const [targetMonths, setTargetMonths] = useState<number | null>(null);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [results, setResults] = useState<DebtResults | DebtError | null>(null);
  const [email, setEmail] = useState('');
  const [showPDFSuccess, setShowPDFSuccess] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDebt = () => {
    // Validate inputs first
    const validation = DebtCalculatorSchema.safeParse({
      totalDebt,
      interestRate,
      monthlyPayment,
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
    // إذا كان المستخدم يريد فترة محددة، نحسب الدفعة المطلوبة
    let finalPayment = monthlyPayment;

    if (targetMonths && targetMonths > 0) {
      // حساب الدفعة المطلوبة للوصول للهدف
      const monthlyRate = interestRate / 100 / 12;
      if (monthlyRate === 0) {
        finalPayment = totalDebt / targetMonths;
      } else {
        // صيغة حساب الدفعة الشهرية
        finalPayment =
          (totalDebt * monthlyRate * Math.pow(1 + monthlyRate, targetMonths)) /
          (Math.pow(1 + monthlyRate, targetMonths) - 1);
      }
    }

    const result = calculateSingleDebt(totalDebt, interestRate, finalPayment);

    if ('error' in result) {
      setResults({ error: result.error } as DebtError);
      return;
    }

    // حساب النتائج مع الدفعة الإضافية
    let resultWithExtra = result;
    if (extraPayment > 0) {
      const extraResult = calculateSingleDebt(totalDebt, interestRate, finalPayment + extraPayment);
      if ('error' in extraResult) {
        setResults({ error: extraResult.error } as DebtError);
        return;
      }
      resultWithExtra = extraResult;
    }

    // حساب التوصيات والمحاكاة
    const recommendations = generateSmartRecommendations(
      totalDebt,
      interestRate,
      finalPayment,
      result,
      debtType
    );
    const simulations = generateSimulations(totalDebt, interestRate, finalPayment);
    const healthScore = calculateHealthScore(result, totalDebt, finalPayment, interestRate);
    const insights = generatePersonalizedInsights(
      healthScore,
      result,
      totalDebt,
      finalPayment,
      debtType
    );

    setResults({
      ...result,
      resultWithExtra,
      recommendations,
      simulations,
      healthScore,
      insights,
      finalPayment,
      extraPayment,
    });
  };

  // حساب درجة الصحة المالية
  const calculateHealthScore = (
    result: DebtCalculationResult,
    debt: number,
    payment: number,
    rate: number
  ): number => {
    let score = 100;

    // عامل 1: نسبة الدين للدفعة (40 نقطة)
    const debtToPaymentRatio = debt / payment;
    if (debtToPaymentRatio > 40) score -= 40;
    else if (debtToPaymentRatio > 30) score -= 30;
    else if (debtToPaymentRatio > 20) score -= 20;
    else if (debtToPaymentRatio > 15) score -= 10;

    // عامل 2: نسبة الفائدة للأصل (30 نقطة)
    const interestRatio = (result.totalInterest / debt) * 100;
    if (interestRatio > 50) score -= 30;
    else if (interestRatio > 30) score -= 20;
    else if (interestRatio > 15) score -= 10;
    else if (interestRatio > 5) score -= 5;

    // عامل 3: معدل الفائدة السنوي (20 نقطة)
    if (rate > 20) score -= 20;
    else if (rate > 15) score -= 15;
    else if (rate > 10) score -= 10;
    else if (rate > 5) score -= 5;

    // عامل 4: مدة السداد (10 نقاط)
    if (result.years > 5) score -= 10;
    else if (result.years > 3) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  // توليد رؤى شخصية محفزة
  const generatePersonalizedInsights = (
    score: number,
    result: DebtCalculationResult,
    debt: number,
    _payment: number,
    type: string
  ): any[] => {
    const insights = [];
    const interestRatio = (result.totalInterest / debt) * 100;
    const typeLabel = DEBT_TYPES.find((t) => t.id === type)?.label || 'الدين';

    // رؤية حسب النتيجة
    if (score >= 80) {
      insights.push({
        type: 'excellent',
        icon: '🌟',
        title: 'وضعك المالي ممتاز!',
        message: `أنت على الطريق الصحيح. ${typeLabel} الخاص بك تحت السيطرة تماماً، وخطة السداد الحالية فعّالة جداً.`,
      });
    } else if (score >= 60) {
      insights.push({
        type: 'good',
        icon: '👍',
        title: 'وضعك جيد، مع فرص للتحسين',
        message: `${typeLabel} الخاص بك قابل للإدارة. بتعديلات بسيطة، يمكنك توفير آلاف الريالات وتسريع رحلتك للحرية المالية.`,
      });
    } else if (score >= 40) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'انتبه: وضعك يحتاج تحسين فوري',
        message: `${typeLabel} يستهلك جزءاً كبيراً من دخلك. لكن لا تقلق، هناك حلول فعّالة يمكن أن تخفف العبء بسرعة.`,
      });
    } else {
      insights.push({
        type: 'critical',
        icon: '🚨',
        title: 'تحذير: وضعك يحتاج تدخل عاجل',
        message: `${typeLabel} في وضع حرج. ولكن بخطة محكمة وإجراءات فورية، يمكنك استعادة السيطرة المالية تدريجياً.`,
      });
    }

    // رؤية حسب الفوائد
    if (interestRatio > 30) {
      insights.push({
        type: 'cost',
        icon: '💸',
        title: `أنت تدفع ${interestRatio.toFixed(0)}% زيادة كفوائد!`,
        message: `من كل ${formatCurrency(debt + result.totalInterest)} ستدفعها، ${formatCurrency(result.totalInterest)} فوائد فقط. إعادة التمويل قد توفر لك نصف هذا المبلغ.`,
      });
    }

    // رؤية تحفيزية
    const potentialSavings = result.totalInterest * 0.3; // افتراض توفير 30%
    insights.push({
      type: 'motivation',
      icon: '🎯',
      title: 'هدفك القادم',
      message: `مع التحسينات الصحيحة، يمكنك توفير ما يصل إلى ${formatCurrency(potentialSavings)} وإنهاء ${typeLabel} قبل الموعد بأشهر.`,
    });

    return insights;
  };

  // توليد توصيات ذكية ومخصصة
  const generateSmartRecommendations = (
    debt: number,
    rate: number,
    payment: number,
    result: DebtCalculationResult,
    type: string
  ): any[] => {
    const recommendations = [];
    const typeLabel = DEBT_TYPES.find((t) => t.id === type)?.label || 'الدين';

    // توصية 1: زيادة الدفعة (ديناميكية)
    const increaseAmount = payment * 0.2; // 20% زيادة
    const increasedPayment = payment + increaseAmount;
    const increasedResult = calculateSingleDebt(debt, rate, increasedPayment);

    if (!('error' in increasedResult)) {
      const savings = result.totalInterest - increasedResult.totalInterest;
      const monthsSaved = result.months - increasedResult.months;
      const yearsSaved = Math.floor(monthsSaved / 12);
      const remainingMonths = monthsSaved % 12;

      recommendations.push({
        id: 1,
        priority: 'high',
        title: '🚀 زد دفعتك الشهرية',
        description: `بزيادة ${formatCurrency(increaseAmount)} فقط على دفعتك الحالية`,
        impact: 'عالي جداً',
        benefits: [
          `✨ توفير ${formatCurrency(savings)} من الفوائد`,
          `⏰ إنهاء ${typeLabel} ${yearsSaved > 0 ? `${yearsSaved} سنة` : ''} ${remainingMonths > 0 ? `و ${remainingMonths} شهر` : ''} أبكر`,
          `💪 تحرر مالي أسرع بكثير`,
        ],
        actionable: `ابدأ الشهر القادم بدفع ${formatCurrency(increasedPayment)} بدلاً من ${formatCurrency(payment)}`,
      });
    }

    // توصية 2: إعادة التمويل (إذا كانت الفائدة عالية)
    if (rate > 10) {
      const targetRate = rate * 0.6; // خفض 40%
      const refinanceResult = calculateSingleDebt(debt, targetRate, payment);

      if (!('error' in refinanceResult)) {
        const savings = result.totalInterest - refinanceResult.totalInterest;

        recommendations.push({
          id: 2,
          priority: 'high',
          title: '💡 أعد التمويل بفائدة أقل',
          description: `نسبة الفائدة الحالية ${rate}% مرتفعة جداً. يمكنك الحصول على معدل أفضل`,
          impact: 'عالي',
          benefits: [
            `💰 توفير ${formatCurrency(savings)} من الفوائد`,
            `📉 خفض الفائدة من ${rate}% إلى ${targetRate.toFixed(1)}%`,
            `😌 راحة بال ودفعات أخف`,
          ],
          actionable: `قارن عروض البنوك الآن - حتى 1% فرق يعني آلاف الريالات`,
        });
      }
    }

    // توصية 3: استراتيجية الدفعات الإضافية (مخصصة)
    const bonusScenario = calculateSingleDebt(debt, rate, payment + 200);
    if (!('error' in bonusScenario)) {
      const savings = result.totalInterest - bonusScenario.totalInterest;

      recommendations.push({
        id: 3,
        priority: 'medium',
        title: '🎁 استخدم المكافآت والدخل الإضافي',
        description: 'أي دخل إضافي (مكافأة، عيدية، راتب 13) اجعله دفعة إضافية',
        impact: 'متوسط إلى عالي',
        benefits: [
          `📈 كل ${formatCurrency(200)} إضافية توفر ${formatCurrency(savings / 12)} شهرياً`,
          `🏃 تسريع السداد بدون تأثير على ميزانيتك الشهرية`,
          `✅ الحرية المالية بخطوات بسيطة`,
        ],
        actionable: 'خصص 50% من أي دخل إضافي لسداد الدين',
      });
    }

    // توصية 4: تجميد الديون الجديدة
    if (type === 'credit_card') {
      recommendations.push({
        id: 4,
        priority: 'critical',
        title: '🔒 جمّد البطاقة الائتمانية فوراً',
        description: 'استخدام البطاقة أثناء السداد يُفشل خطتك بالكامل',
        impact: 'حرج',
        benefits: [
          `🛑 إيقاف تراكم الفوائد الجديدة (${rate}% سنوياً!)`,
          `🎯 تركيز 100% على السداد`,
          `💪 انضباط مالي يُغير حياتك`,
        ],
        actionable: 'احذف بيانات البطاقة من التطبيقات، أو احتفظ بها في مكان بعيد',
      });
    }

    // توصية 5: تحسين الميزانية (إذا كان الدين كبير)
    const debtToPaymentRatio = debt / payment;
    if (debtToPaymentRatio > 20) {
      recommendations.push({
        id: 5,
        priority: 'medium',
        title: '📊 راجع ميزانيتك بعمق',
        description: 'ابحث عن 10% فقط من مصروفاتك يمكن توجيهها للدين',
        impact: 'متوسط',
        benefits: [
          `🔍 اكتشاف نقاط الهدر الخفية`,
          `💵 تحويل ${formatCurrency(payment * 0.1)} إضافية للسداد`,
          `🧘 تحكم أفضل في مالك`,
        ],
        actionable: 'استخدم أداة "الميزانية الذكية" لتحليل مصروفاتك بدقة',
      });
    }

    return recommendations;
  };

  // توليد المحاكاة
  const generateSimulations = (debt: number, rate: number, currentPayment: number): any[] => {
    const simulations: any[] = [];
    const increases = [
      { amount: 200, label: 'زيادة صغيرة' },
      { amount: 500, label: 'زيادة متوسطة' },
      { amount: 1000, label: 'زيادة كبيرة' },
    ];

    increases.forEach(({ amount, label }) => {
      const result = calculateSingleDebt(debt, rate, currentPayment + amount);
      if (!('error' in result)) {
        const currentResult = calculateSingleDebt(debt, rate, currentPayment);
        if (!('error' in currentResult)) {
          const savings = currentResult.totalInterest - result.totalInterest;
          const monthsSaved = currentResult.months - result.months;

          simulations.push({
            payment: currentPayment + amount,
            label,
            increase: amount,
            months: result.months,
            years: result.years,
            remainingMonths: result.remainingMonths,
            totalInterest: result.totalInterest,
            savings,
            monthsSaved,
            savingsPercentage: (savings / currentResult.totalInterest) * 100,
          });
        }
      }
    });

    return simulations;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80)
      return {
        label: 'ممتاز',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        icon: '🌟',
      };
    if (score >= 60)
      return {
        label: 'جيد',
        color: 'blue',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        icon: '👍',
      };
    if (score >= 40)
      return {
        label: 'يحتاج تحسين',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        icon: '⚠️',
      };
    return {
      label: 'حرج',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      icon: '🚨',
    };
  };

  const handleDownloadPDF = () => {
    if (!results || 'error' in results) return;

    try {
      generateDebtReportPDF({
        debtType: DEBT_TYPES.find((t) => t.id === debtType)?.label || 'دين',
        totalDebt,
        interestRate,
        monthlyPayment: results.finalPayment,
        healthScore: results.healthScore,
        years: results.years,
        remainingMonths: results.remainingMonths,
        months: results.months,
        totalPaid: results.totalPaid,
        totalInterest: results.totalInterest,
        recommendations: results.recommendations,
        simulations: results.simulations,
      });

      setShowPDFSuccess(true);
      setTimeout(() => setShowPDFSuccess(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  const handleSendEmail = () => {
    if (!email) {
      alert('الرجاء إدخال البريد الإلكتروني');
      return;
    }
    setShowEmailSuccess(true);
    setTimeout(() => setShowEmailSuccess(false), 3000);
    // TODO: Implement actual email sending
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

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary-trust transition-colors"
            >
              لوحة التحكم
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-trust transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الأدوات</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🏦 حاسبة سداد الديون الذكية
          </h1>
                      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        احسب مدة السداد واحصل على توصيات شخصية لتوفير آلاف الريالات
                      </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span>✨</span>
            <span>مجاني بالكامل - قيمة حقيقية</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>معلومات الدين</CardTitle>
                <CardDescription>املأ البيانات بدقة للحصول على أفضل توصيات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الدين</label>
                  <select
                    value={debtType}
                    onChange={(e) => {
                      setDebtType(e.target.value);
                      const type = DEBT_TYPES.find((t) => t.id === e.target.value);
                      if (type && interestRate === 0) {
                        setInterestRate(type.avgRate);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {DEBT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Input
                    label="إجمالي الدين (ريال)"
                    type="number"
                    placeholder="50000"
                    value={totalDebt || ''}
                    onChange={(e) => {
                      setTotalDebt(parseFloat(e.target.value) || 0);
                      setErrors((prev) => ({ ...prev, totalDebt: '' }));
                    }}
                  />
                  {errors['totalDebt'] && (
                    <p className="text-sm text-red-600 mt-1">{errors['totalDebt']}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="نسبة الفائدة السنوية (%)"
                    type="number"
                    step="0.1"
                    placeholder="12"
                    value={interestRate >= 0 ? interestRate : ''}
                    onChange={(e) => {
                      setInterestRate(parseFloat(e.target.value) || 0);
                      setErrors((prev) => ({ ...prev, interestRate: '' }));
                    }}
                    helperText="أدخل 0 إذا لم يكن هناك فائدة"
                  />
                  {errors['interestRate'] && (
                    <p className="text-sm text-red-600 mt-1">{errors['interestRate']}</p>
                  )}
                </div>

                <div>
                  <Input
                    label="الدفعة الشهرية الحالية (ريال)"
                    type="number"
                    placeholder="2500"
                    value={monthlyPayment || ''}
                    onChange={(e) => {
                      setMonthlyPayment(parseFloat(e.target.value) || 0);
                      setErrors((prev) => ({ ...prev, monthlyPayment: '' }));
                    }}
                  />
                  {errors['monthlyPayment'] && (
                    <p className="text-sm text-red-600 mt-1">{errors['monthlyPayment']}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    ⚡ خيارات متقدمة (اختياري)
                  </p>

                  <Input
                    label="🎯 هل لديك فترة مستهدفة للسداد؟"
                    type="number"
                    placeholder="24"
                    value={targetMonths || ''}
                    onChange={(e) => setTargetMonths(parseInt(e.target.value) || null)}
                    helperText="عدد الأشهر التي تريد إنهاء الدين خلالها"
                  />

                  <Input
                    label="💰 دفعة إضافية شهرية ممكنة؟"
                    type="number"
                    placeholder="500"
                    value={extraPayment || ''}
                    onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                    helperText="كم يمكنك إضافته فوق الدفعة الأساسية؟"
                  />
                </div>

                <Button onClick={calculateDebt} className="w-full" size="lg">
                  <TrendingUp className="w-5 h-5 ml-2" />
                  احسب وضعي المالي
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {results && results.error && (
              <Card className="border-red-300 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-6 h-6" />
                    <p className="font-medium">{results.error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {results && !('error' in results) && (
              <>
                {/* Personal Insight - أول رؤية فقط */}
                {!('error' in results) && results.insights && results.insights[0] && (
                  <Card
                    className={`border-2 ${
                      results.insights[0].type === 'excellent'
                        ? 'border-green-500 bg-green-50'
                        : results.insights[0].type === 'good'
                          ? 'border-blue-500 bg-blue-50'
                          : results.insights[0].type === 'warning'
                            ? 'border-yellow-500 bg-yellow-50'
                            : results.insights[0].type === 'critical'
                              ? 'border-red-500 bg-red-50'
                              : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{results.insights[0].icon}</span>
                        <div className="flex-1" dir="rtl">
                          <h3 className="text-xl font-bold mb-2">{results.insights[0].title}</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {results.insights[0].message}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Health Score */}
                <Card
                  className={`border-2 ${getHealthStatus(results.healthScore).borderColor} ${getHealthStatus(results.healthScore).bgColor}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">
                          {getHealthStatus(results.healthScore).icon}
                        </span>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">درجة الصحة المالية</p>
                          <p
                            className={`text-3xl font-bold text-${getHealthStatus(results.healthScore).color}-700`}
                          >
                            {results.healthScore}/100
                          </p>
                          <p className="text-lg font-semibold text-gray-700">
                            {getHealthStatus(results.healthScore).label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Results - مبسطة */}
                <Card className="border-2 border-blue-500">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle dir="rtl">📊 خطة السداد</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div
                        className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
                        dir="rtl"
                      >
                        <p className="text-sm text-gray-600 mb-1">⏰ مدة السداد</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-700">
                          {results.years} {results.years === 1 ? 'سنة' : 'سنوات'}
                          {results.remainingMonths > 0 &&
                            ` و ${results.remainingMonths} ${results.remainingMonths === 1 ? 'شهر' : 'أشهر'}`}
                        </p>
                      </div>

                      <div
                        className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
                        dir="rtl"
                      >
                        <p className="text-sm text-gray-600 mb-1">💰 إجمالي المدفوع</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-700">
                          {formatCurrency(results.totalPaid)}
                        </p>
                      </div>

                      <div
                        className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200"
                        dir="rtl"
                      >
                        <p className="text-sm text-gray-600 mb-1">📈 الفوائد</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-700">
                          {formatCurrency(results.totalInterest)}
                        </p>
                      </div>

                      <div
                        className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                        dir="rtl"
                      >
                        <p className="text-sm text-gray-600 mb-1">💵 الدفعة الشهرية</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-700">
                          {formatCurrency(results.finalPayment)}
                        </p>
                      </div>
                    </div>

                    {/* Extra Payment Impact */}
                    {extraPayment > 0 && results.resultWithExtra && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-300">
                        <p className="font-bold text-emerald-900 mb-2">
                          ✨ تأثير الدفعة الإضافية ({formatCurrency(extraPayment)}/شهر):
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-xs text-gray-600">التوفير</p>
                            <p className="text-lg font-bold text-emerald-700">
                              {formatCurrency(
                                results.totalInterest - results.resultWithExtra.totalInterest
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">وقت أسرع</p>
                            <p className="text-lg font-bold text-emerald-700">
                              {results.months - results.resultWithExtra.months} شهر
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">مدة جديدة</p>
                            <p className="text-lg font-bold text-emerald-700">
                              {results.resultWithExtra.years}س{' '}
                              {results.resultWithExtra.remainingMonths}ش
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Smart Recommendations - أول 2 فقط */}
                <Card className="border-2 border-orange-500">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                    <CardTitle dir="rtl">💡 توصيات ذكية</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    {results.recommendations.slice(0, 2).map((rec: any, index: number) => (
                      <div
                        key={rec.id}
                        className={`p-5 rounded-xl border-2 ${
                          rec.priority === 'high'
                            ? 'bg-orange-50 border-orange-300'
                            : rec.priority === 'critical'
                              ? 'bg-red-50 border-red-300'
                              : 'bg-blue-50 border-blue-300'
                        }`}
                        dir="rtl"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              rec.priority === 'critical'
                                ? 'bg-red-600'
                                : rec.priority === 'high'
                                  ? 'bg-orange-500'
                                  : 'bg-blue-500'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
                            <p className="text-gray-700 text-sm mb-3">{rec.description}</p>

                            <div className="space-y-1">
                              {rec.benefits.slice(0, 2).map((benefit: string, i: number) => (
                                <p key={i} className="text-sm text-gray-700">
                                  {benefit}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Simulations - مبسطة */}
                <Card className="border-2 border-green-500">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle dir="rtl">📈 محاكاة سريعة</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {results.simulations.map((sim: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200"
                          dir="rtl"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">{sim.label}</p>
                              <p className="text-xl font-bold text-emerald-700">
                                {formatCurrency(sim.payment)} / شهر
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-gray-600">توفير</p>
                              <p className="text-xl font-bold text-green-700">
                                {formatCurrency(sim.savings)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* PDF Export */}
                <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>📄 تقريرك الشخصي المفصل</span>
                    </CardTitle>
                    <CardDescription>تقرير PDF احترافي (7 صفحات) جاهز للتحميل</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'تحليل شامل لوضعك المالي',
                        'جدول سداد مفصل (12 شهر)',
                        'التوصيات الذكية بالتفصيل',
                        'محاكاة السيناريوهات',
                        'خطة عمل خطوة بخطوة',
                        'نصائح نفسية للالتزام',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-green-600">✅</span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Input
                        label="البريد الإلكتروني (اختياري)"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        helperText="سنرسل التقرير مباشرة لبريدك"
                      />

                      {showEmailSuccess && (
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                          ✅ تم إرسال التقرير لبريدك بنجاح!
                        </div>
                      )}

                      {showPDFSuccess && (
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                          ✅ جاري تحميل التقرير...
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSendEmail}
                          className="flex-1"
                          variant="outline"
                          disabled={!email}
                        >
                          <Mail className="w-4 h-4 ml-2" />
                          أرسل لإيميلي
                        </Button>
                        <Button onClick={handleDownloadPDF} className="flex-1">
                          <Download className="w-4 h-4 ml-2" />
                          تحميل PDF
                        </Button>
                      </div>
                      <p className="text-xs text-center text-gray-500">
                        💡 التقرير يُحدّث تلقائياً عند تغيير البيانات
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium CTA */}
                <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">🌟 هل لديك أكثر من دين؟</h3>
                      <p className="text-gray-600 mb-4">
                        النسخة المتقدمة تساعدك على إدارة جميع ديونك بخطة موحدة ذكية
                      </p>

                      {/* Progress Save Feature */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm mb-4">
                        <span>💾</span>
                        <span>تقدمك الحالي سيُحفظ تلقائياً في النسخة المتقدمة</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {[
                        {
                          icon: '💾',
                          title: 'حفظ تلقائي للتقدم',
                          desc: 'بياناتك وتحليلك محفوظة دائماً',
                        },
                        {
                          icon: '✨',
                          title: 'ديون متعددة',
                          desc: 'أضف جميع ديونك وشاهد الصورة الكاملة',
                        },
                        { icon: '🎯', title: 'استراتيجيتين ذكيتين', desc: 'Snowball و Avalanche' },
                        { icon: '📊', title: 'جدول سداد 24 شهر', desc: 'خطة مفصلة شهر بشهر' },
                        { icon: '🔄', title: 'محاكاة متقدمة', desc: 'قارن سيناريوهات لا نهائية' },
                        { icon: '📄', title: 'تقرير 15 صفحة', desc: 'تحليل عميق واحترافي' },
                        { icon: '📈', title: 'تتبع وتنبيهات', desc: 'في Dashboard مع تذكيرات' },
                        {
                          icon: '🔐',
                          title: 'آمن ومشفر',
                          desc: 'بياناتك محمية بأعلى معايير الأمان',
                        },
                      ].map((feature, i) => (
                        <div key={i} className="p-3 bg-white rounded-lg">
                          <p className="font-semibold mb-1">
                            <span className="mr-2">{feature.icon}</span>
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-600">{feature.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-purple-600 text-white p-4 rounded-xl text-center mb-4">
                      <p className="font-bold text-lg mb-1">🎁 عرض خاص لك</p>
                      <p className="text-sm opacity-90">شهر مجاني كامل - بدون بطاقة ائتمان</p>
                      <p className="text-xs opacity-75 mt-1">
                        + احصل على تقريرك المجاني الحالي محفوظاً
                      </p>
                    </div>

                    <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                      <Link href="/tools/debt-management">
                        <Rocket className="w-5 h-5 ml-2" />
                        احفظ تقدمي وجرب النسخة المتقدمة
                      </Link>
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-3">
                      * يمكنك الإلغاء في أي وقت • لا يوجد التزام • تقدمك محفوظ حتى بعد الإلغاء
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            {!results && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="pt-16 pb-16 text-center">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg mb-2">أدخل معلومات الدين واضغط &quot;احسب&quot;</p>
                  <p className="text-sm text-gray-400">ستحصل على تحليل شامل مخصص لوضعك</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
