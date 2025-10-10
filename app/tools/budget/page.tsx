'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Zap,
  Download,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BudgetCalculatorSchema } from '@/lib/validations/calculators';
import { generateBudgetPDF } from '@/lib/utils/pdf-generator';

interface BudgetResult {
  balance: number;
  status: 'surplus' | 'balanced' | 'deficit';
  balancePercentage: number;
  savingsRate: number;
  healthScore: number;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  impact: string;
  benefits: string[];
}

export default function BudgetCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [results, setResults] = useState<BudgetResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateBudget = () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const validation = BudgetCalculatorSchema.safeParse({
      monthlyIncome,
      monthlyExpenses,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    const balance = monthlyIncome - monthlyExpenses;
    const balancePercentage = (balance / monthlyIncome) * 100;
    const savingsRate = balance > 0 ? balancePercentage : 0;

    let status: 'surplus' | 'balanced' | 'deficit';
    if (balance > monthlyIncome * 0.05) {
      status = 'surplus';
    } else if (balance >= -monthlyIncome * 0.05 && balance <= monthlyIncome * 0.05) {
      status = 'balanced';
    } else {
      status = 'deficit';
    }

    // Calculate health score (0-100)
    let healthScore = 50; // Base score

    if (balance > 0) {
      healthScore += Math.min(30, (savingsRate / 20) * 30); // Up to 30 points for savings rate
    } else {
      healthScore -= Math.min(40, Math.abs(balancePercentage) * 2); // Penalty for deficit
    }

    if (monthlyExpenses / monthlyIncome < 0.7) {
      healthScore += 20; // Bonus for low expense ratio
    }

    healthScore = Math.max(0, Math.min(100, healthScore));

    const result: BudgetResult = {
      balance,
      status,
      balancePercentage,
      savingsRate,
      healthScore: Math.round(healthScore),
    };

    setResults(result);
    setRecommendations(generateRecommendations(monthlyIncome, monthlyExpenses, result));
  };

  const generateRecommendations = (
    income: number,
    expenses: number,
    result: BudgetResult
  ): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on balance status
    if (result.status === 'deficit') {
      const deficit = Math.abs(result.balance);
      const reductionTarget = expenses * 0.2; // 20% reduction target
      recs.push({
        priority: 'high',
        title: 'تقليل المصروفات بنسبة 20%',
        impact: 'عالي',
        benefits: [
          `توفير ${formatCurrency(reductionTarget)} شهرياً`,
          `تحويل العجز إلى فائض ${formatCurrency(reductionTarget - deficit)}`,
          'تحسين الصحة المالية بشكل كبير',
        ],
      });
    } else if (result.status === 'balanced') {
      const savingsTarget = income * 0.2;
      recs.push({
        priority: 'high',
        title: 'بناء هامش ادخار 20%',
        impact: 'عالي',
        benefits: [
          `ادخار ${formatCurrency(savingsTarget)} شهرياً`,
          `بناء ${formatCurrency(savingsTarget * 12)} سنوياً`,
          'حماية مالية ضد الطوارئ',
        ],
      });
    } else {
      const currentSavings = result.balance;
      const target = income * 0.3;
      if (currentSavings < target) {
        recs.push({
          priority: 'medium',
          title: 'زيادة الادخار إلى 30%',
          impact: 'متوسط',
          benefits: [
            `زيادة الادخار من ${formatCurrency(currentSavings)} إلى ${formatCurrency(target)}`,
            `ادخار إضافي ${formatCurrency(target - currentSavings)} شهرياً`,
            'تسريع بناء الثروة',
          ],
        });
      }
    }

    // Recommendation 2: Income increase
    const incomeIncrease = income * 0.15;
    recs.push({
      priority: 'medium',
      title: 'زيادة الدخل بنسبة 15%',
      impact: 'متوسط',
      benefits: [
        `دخل إضافي ${formatCurrency(incomeIncrease)} شهرياً`,
        `إمكانية ادخار ${formatCurrency(incomeIncrease)} إضافية`,
        'تحسين مستوى المعيشة',
      ],
    });

    // Recommendation 3: Expense tracking
    recs.push({
      priority: 'low',
      title: 'تتبع المصروفات التفصيلية',
      impact: 'منخفض',
      benefits: ['اكتشاف نقاط الهدر المالي', 'توفير 5-10% من المصروفات', 'وعي مالي أفضل'],
    });

    return recs;
  };

  const handleDownloadPDF = () => {
    if (!results) return;

    try {
      generateBudgetPDF({
        monthlyIncome,
        monthlyExpenses,
        balance: results.balance,
        status: results.status,
        balancePercentage: results.balancePercentage,
        savingsRate: results.savingsRate,
        healthScore: results.healthScore,
        recommendations,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'surplus':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'فائض - وضع جيد',
          emoji: '✅',
        };
      case 'balanced':
        return {
          icon: Minus,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'متوازن - يحتاج تحسين',
          emoji: '⚖️',
        };
      case 'deficit':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'عجز - يحتاج إجراء فوري',
          emoji: '⚠️',
        };
      default:
        return {
          icon: Minus,
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
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-success rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة الميزانية الأساسية</h1>
          <p className="text-xl text-gray-600">احسب دخلك ومصروفاتك واعرف الفائض أو العجز بوضوح</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>أدخل معلومات الميزانية</CardTitle>
              <CardDescription>املأ الحقول أدناه لحساب ميزانيتك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="الدخل الشهري (ريال)"
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
                  helperText="الدخل الصافي بعد الخصومات"
                />
                {errors['monthlyIncome'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyIncome']}</p>
                )}
              </div>

              <div>
                <Input
                  label="المصروفات الشهرية (ريال)"
                  type="number"
                  placeholder="10000"
                  value={monthlyExpenses || ''}
                  onChange={(e) => {
                    setMonthlyExpenses(parseFloat(e.target.value));
                    if (errors['monthlyExpenses']) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors['monthlyExpenses'];
                        return newErrors;
                      });
                    }
                  }}
                  helperText="إجمالي جميع المصروفات"
                />
                {errors['monthlyExpenses'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyExpenses']}</p>
                )}
              </div>

              <Button onClick={calculateBudget} className="w-full" size="lg">
                احسب الميزانية
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
                    <p className="text-sm text-gray-600 mb-2">الصحة المالية</p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الرصيد الشهري</p>
                      <p
                        className={`text-2xl font-bold ${results.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {formatCurrency(Math.abs(results.balance))}
                      </p>
                      {results.balance >= 0 ? (
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>فائض</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                          <TrendingDown className="w-4 h-4" />
                          <span>عجز</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">نسبة الادخار</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.savingsRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">من الدخل</p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الدخل الشهري</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(monthlyIncome)}
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">المصروفات الشهرية</p>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(monthlyExpenses)}
                      </p>
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
                توصيات ذكية لتحسين ميزانيتك
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

        {/* Quick Tips */}
        {results && (
          <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">💡 نصائح سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">قاعدة 50/30/20</p>
                    <p className="text-sm text-blue-800">
                      50% ضروريات، 30% رغبات، 20% ادخار واستثمار
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">تتبع يومي</p>
                    <p className="text-sm text-blue-800">
                      راجع مصروفاتك يومياً لمدة شهر لاكتشاف نقاط الهدر
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">صندوق الطوارئ</p>
                    <p className="text-sm text-blue-800">
                      ابدأ بادخار 3-6 أشهر من مصروفاتك الأساسية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">أتمتة الادخار</p>
                    <p className="text-sm text-blue-800">حول مبلغ ثابت تلقائياً في بداية كل شهر</p>
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
                احصل على تقرير الميزانية المفصل
              </CardTitle>
              <CardDescription>تقرير PDF شامل (4 صفحات) يحتوي على:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    'تحليل الميزانية الحالية',
                    'درجة الصحة المالية',
                    'التوصيات الذكية (3 توصيات)',
                    'جدول التحسينات المقترحة',
                    'خطة عمل شهرية',
                    'نصائح وأدوات إضافية',
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
                  <Button
                    onClick={handleDownloadPDF}
                    className="sm:w-auto bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}
