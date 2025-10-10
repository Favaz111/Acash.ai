'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  Sparkles,
  ArrowRight,
  Target,
  // TrendingUp,
  Calendar,
  // DollarSign,
  CheckCircle,
  Zap,
  Download,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { SavingsGoalCalculatorSchema } from '@/lib/validations/calculators';
import { generateSavingsPDF } from '@/lib/utils/pdf-generator';

interface SavingsResult {
  goalAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  monthsToGoal: number;
  totalToSave: number;
  achievementDate: Date;
  feasibilityScore: number;
  status: 'achievable' | 'challenging' | 'unrealistic';
}

interface Recommendation {
  type: 'primary' | 'secondary' | 'alternative';
  title: string;
  description: string;
  impact: string;
}

export default function SavingsGoalCalculatorPage() {
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [results, setResults] = useState<SavingsResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateSavings = () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const validation = SavingsGoalCalculatorSchema.safeParse({
      goalAmount,
      currentSavings,
      monthlyContribution,
      monthlyIncome,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    if (!goalAmount || !monthlyContribution) return;

    const totalToSave = Math.max(0, goalAmount - currentSavings);
    const monthsToGoal = monthlyContribution > 0 ? Math.ceil(totalToSave / monthlyContribution) : 0;

    const achievementDate = new Date();
    achievementDate.setMonth(achievementDate.getMonth() + monthsToGoal);

    // Calculate feasibility score (0-100)
    let feasibilityScore = 50; // Base score

    // Factor 1: Savings rate relative to goal
    if (monthlyContribution > 0) {
      const monthlySavingsRate = (monthlyContribution / goalAmount) * 100;
      feasibilityScore += Math.min(30, monthlySavingsRate * 3);
    }

    // Factor 2: Current progress
    if (currentSavings > 0) {
      const progressPercentage = (currentSavings / goalAmount) * 100;
      feasibilityScore += Math.min(20, progressPercentage / 5);
    }

    // Factor 3: Income ratio (if provided)
    if (monthlyIncome > 0) {
      const savingsRate = (monthlyContribution / monthlyIncome) * 100;
      if (savingsRate < 15) feasibilityScore -= 10; // Too low
      else if (savingsRate > 50) feasibilityScore -= 15; // Unsustainable
      else feasibilityScore += 10; // Healthy range
    }

    feasibilityScore = Math.max(0, Math.min(100, feasibilityScore));

    // Determine status
    let status: 'achievable' | 'challenging' | 'unrealistic';
    if (feasibilityScore >= 70) status = 'achievable';
    else if (feasibilityScore >= 40) status = 'challenging';
    else status = 'unrealistic';

    const result: SavingsResult = {
      goalAmount,
      currentSavings,
      monthlyContribution,
      monthsToGoal,
      totalToSave,
      achievementDate,
      feasibilityScore: Math.round(feasibilityScore),
      status,
    };

    setResults(result);
    setRecommendations(generateRecommendations(result, monthlyIncome));
  };

  const generateRecommendations = (
    result: SavingsResult,
    income: number
  ): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on timeline
    if (result.monthsToGoal > 36) {
      const newMonthly = Math.ceil(result.totalToSave / 24);
      recs.push({
        type: 'primary',
        title: 'تسريع الادخار إلى سنتين',
        description: `زيادة الادخار الشهري إلى ${formatCurrency(newMonthly)} لتحقيق الهدف في 24 شهرًا بدلاً من ${result.monthsToGoal} شهرًا`,
        impact: 'عالي',
      });
    } else if (result.monthsToGoal <= 6) {
      recs.push({
        type: 'primary',
        title: 'هدف قريب المنال!',
        description: `أنت على بعد ${result.monthsToGoal} أشهر فقط من تحقيق هدفك - حافظ على نفس الوتيرة`,
        impact: 'إيجابي',
      });
    }

    // Recommendation 2: Income-based suggestion
    if (income > 0) {
      const currentRate = (result.monthlyContribution / income) * 100;
      const idealRate = 20;
      const idealContribution = (income * idealRate) / 100;

      if (currentRate < 15) {
        recs.push({
          type: 'secondary',
          title: `زيادة معدل الادخار إلى ${idealRate}%`,
          description: `ادخر ${formatCurrency(idealContribution)} شهريًا (${idealRate}% من دخلك) لتحقيق الهدف أسرع`,
          impact: 'متوسط',
        });
      }
    }

    // Recommendation 3: Current savings boost
    if (result.currentSavings < result.goalAmount * 0.1) {
      const boostTarget = result.goalAmount * 0.2;
      recs.push({
        type: 'alternative',
        title: 'دفعة أولية قوية',
        description: `ابدأ بدفعة أولية ${formatCurrency(boostTarget)} (20% من الهدف) لتقليل المدة بشكل كبير`,
        impact: 'عالي',
      });
    }

    return recs;
  };

  const handleDownloadPDF = () => {
    if (!results) return;

    try {
      generateSavingsPDF({
        goalAmount: results.goalAmount,
        currentSavings: results.currentSavings,
        monthlyContribution: results.monthlyContribution,
        monthsToGoal: results.monthsToGoal,
        totalToSave: results.totalToSave,
        feasibilityScore: results.feasibilityScore,
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
      case 'achievable':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'هدف قابل للتحقيق',
          emoji: '✅',
        };
      case 'challenging':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'يحتاج جهد إضافي',
          emoji: '⚡',
        };
      case 'unrealistic':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'يحتاج مراجعة الخطة',
          emoji: '⚠️',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'غير محدد',
          emoji: '❓',
        };
    }
  };

  const getFeasibilityInfo = (score: number) => {
    if (score >= 80) {
      return { color: 'text-green-600', bgColor: 'bg-green-50', status: 'ممتاز', emoji: '🎯' };
    } else if (score >= 60) {
      return { color: 'text-blue-600', bgColor: 'bg-blue-50', status: 'جيد', emoji: '👍' };
    } else if (score >= 40) {
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', status: 'متوسط', emoji: '⚡' };
    } else {
      return { color: 'text-red-600', bgColor: 'bg-red-50', status: 'ضعيف', emoji: '🔴' };
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
            <span className="text-2xl font-bold text-gradient-primary">Acash.ai</span>
          </Link>

          <Link
            href="/tools"
            className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الأدوات المالية</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-success rounded-2xl mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة أهداف الادخار</h1>
          <p className="text-xl text-gray-600">خطط لتحقيق أهدافك المالية بذكاء</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات هدف الادخار</CardTitle>
              <CardDescription>أدخل تفاصيل هدفك المالي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="قيمة الهدف المالي (ريال)"
                  type="number"
                  placeholder="50000"
                  value={goalAmount || ''}
                  onChange={(e) => {
                    setGoalAmount(parseFloat(e.target.value));
                    if (errors['goalAmount']) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors['goalAmount'];
                        return newErrors;
                      });
                    }
                  }}
                  helperText="المبلغ الذي تريد الوصول إليه"
                />
                {errors['goalAmount'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['goalAmount']}</p>
                )}
              </div>

              <div>
                <Input
                  label="المدخرات الحالية (ريال)"
                  type="number"
                  placeholder="10000"
                  value={currentSavings || ''}
                  onChange={(e) => {
                    setCurrentSavings(parseFloat(e.target.value));
                    if (errors['currentSavings']) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors['currentSavings'];
                        return newErrors;
                      });
                    }
                  }}
                  helperText="المبلغ المدخر حاليًا"
                />
                {errors['currentSavings'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['currentSavings']}</p>
                )}
              </div>

              <div>
                <Input
                  label="الادخار الشهري (ريال)"
                  type="number"
                  placeholder="2000"
                  value={monthlyContribution || ''}
                  onChange={(e) => {
                    setMonthlyContribution(parseFloat(e.target.value));
                    if (errors['monthlyContribution']) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors['monthlyContribution'];
                        return newErrors;
                      });
                    }
                  }}
                  helperText="المبلغ الذي ستدخره شهريًا"
                />
                {errors['monthlyContribution'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyContribution']}</p>
                )}
              </div>

              <div>
                <Input
                  label="الدخل الشهري (اختياري)"
                  type="number"
                  placeholder="15000"
                  value={monthlyIncome || ''}
                  onChange={(e) => {
                    setMonthlyIncome(parseFloat(e.target.value));
                    if (errors['monthlyIncome']) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors['monthlyIncome'];
                        return newErrors;
                      });
                    }
                  }}
                  helperText="لتقييم جدوى الخطة"
                />
                {errors['monthlyIncome'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyIncome']}</p>
                )}
              </div>

              <Button onClick={calculateSavings} className="w-full" size="lg">
                احسب خطة الادخار
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
                  {/* Feasibility Score */}
                  <div
                    className={`p-6 ${getFeasibilityInfo(results.feasibilityScore).bgColor} rounded-xl text-center`}
                  >
                    <p className="text-sm text-gray-600 mb-2">جدوى الخطة</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-5xl">
                        {getFeasibilityInfo(results.feasibilityScore).emoji}
                      </span>
                      <p
                        className={`text-5xl font-bold ${getFeasibilityInfo(results.feasibilityScore).color}`}
                      >
                        {results.feasibilityScore}
                      </p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${getFeasibilityInfo(results.feasibilityScore).color}`}
                    >
                      {getFeasibilityInfo(results.feasibilityScore).status}
                    </p>
                  </div>

                  {/* Status Card */}
                  <div
                    className={`p-4 ${getStatusInfo(results.status).bgColor} border ${getStatusInfo(results.status).borderColor} rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const StatusIcon = getStatusInfo(results.status).icon;
                        return <StatusIcon className={`w-6 h-6 ${getStatusInfo(results.status).color}`} />;
                      })()}
                      <div className="flex-1">
                        <p className={`font-bold ${getStatusInfo(results.status).color}`}>
                          {getStatusInfo(results.status).text}
                        </p>
                      </div>
                      <span className="text-2xl">{getStatusInfo(results.status).emoji}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الفترة الزمنية</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <p className="text-2xl font-bold text-gray-900">
                          {results.monthsToGoal} <span className="text-sm">شهر</span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">تاريخ التحقيق</p>
                      <p className="text-lg font-bold text-gray-900">
                        {results.achievementDate.toLocaleDateString('ar-SA', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">المبلغ المطلوب</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(results.totalToSave)}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">التقدم الحالي</p>
                      <p className="text-xl font-bold text-blue-600">
                        {((results.currentSavings / results.goalAmount) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                توصيات ذكية لتحقيق هدفك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      rec.type === 'primary'
                        ? 'bg-blue-50 border-blue-200'
                        : rec.type === 'secondary'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{rec.title}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-white border">
                            {rec.impact}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Export */}
        {results && (
          <Card className="mt-8 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                احفظ خطة الادخار
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                <Button
                  onClick={handleDownloadPDF}
                  className="sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
