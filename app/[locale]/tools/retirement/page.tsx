'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  Sparkles,
  ArrowRight,
  Palmtree,
  Calendar,
  DollarSign,
  CheckCircle,
  Zap,
  Download,
  Mail,
  AlertCircle,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
// @ts-ignore
import { RetirementCalculatorSchema } from '@/lib/validations/calculators';
import { generateRetirementPDF } from '@/lib/utils/pdf-generator';

interface RetirementResult {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  yearsToRetirement: number;
  projectedFund: number;
  inflationAdjustedNeeds: number;
  monthlyRetirementIncome: number;
  feasibilityScore: number;
  gap: number;
  status: 'on-track' | 'needs-boost' | 'critical';
}

interface Recommendation {
  type: 'primary' | 'secondary' | 'alternative';
  title: string;
  description: string;
  impact: string;
}

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [results, setResults] = useState<RetirementResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateRetirement = () => {
    // Validate inputs first
    const validation = RetirementCalculatorSchema.safeParse({
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    // Additional validation for retirement age > current age
    if (retirementAge <= currentAge) {
      setErrors({ retirementAge: 'سن التقاعد يجب أن يكون أكبر من العمر الحالي' });
      return;
    }
    setErrors({});

    if (!currentAge || !retirementAge || retirementAge <= currentAge) return;

    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

    // Assumptions
    const annualReturn = 0.08; // 8% average annual return
    const monthlyReturn = annualReturn / 12;
    const inflationRate = 0.03; // 3% annual inflation

    // Calculate future value of current savings
    const futureValueCurrentSavings =
      currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);

    // Calculate future value of monthly contributions (Future Value of Annuity)
    const futureValueContributions =
      monthlyContribution *
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

    const projectedFund = futureValueCurrentSavings + futureValueContributions;

    // Calculate inflation-adjusted retirement needs
    // Assume need 70% of final year income, using 4% withdrawal rule
    const estimatedMonthlyExpenses = monthlyContribution / 0.15; // Assumes 15% savings rate
    const retirementMonthlyNeeds = estimatedMonthlyExpenses * 0.7;
    const inflationAdjustedNeeds =
      retirementMonthlyNeeds * Math.pow(1 + inflationRate, yearsToRetirement);

    // Annual needs in retirement
    const annualNeedsInRetirement = inflationAdjustedNeeds * 12;

    // Required fund (using 4% safe withdrawal rule)
    const requiredFund = annualNeedsInRetirement * 25;

    // Gap analysis
    const gap = requiredFund - projectedFund;

    // Monthly income from projected fund (4% withdrawal rule)
    const monthlyRetirementIncome = (projectedFund * 0.04) / 12;

    // Calculate feasibility score (0-100)
    let feasibilityScore = 50;

    // Factor 1: Fund adequacy
    const fundRatio = projectedFund / requiredFund;
    if (fundRatio >= 1.2) feasibilityScore += 40;
    else if (fundRatio >= 1.0) feasibilityScore += 30;
    else if (fundRatio >= 0.7) feasibilityScore += 15;
    else feasibilityScore -= 10;

    // Factor 2: Time to retirement
    if (yearsToRetirement >= 20) feasibilityScore += 10;
    else if (yearsToRetirement >= 10) feasibilityScore += 5;
    else if (yearsToRetirement < 5) feasibilityScore -= 10;

    // Factor 3: Current savings momentum
    if (currentSavings > 0) {
      const savingsRate = currentSavings / (currentAge * monthlyContribution * 12);
      if (savingsRate > 0.5) feasibilityScore += 10;
    }

    feasibilityScore = Math.max(0, Math.min(100, feasibilityScore));

    // Determine status
    let status: 'on-track' | 'needs-boost' | 'critical';
    if (feasibilityScore >= 70) status = 'on-track';
    else if (feasibilityScore >= 40) status = 'needs-boost';
    else status = 'critical';

    const result: RetirementResult = {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      yearsToRetirement,
      projectedFund,
      inflationAdjustedNeeds,
      monthlyRetirementIncome,
      feasibilityScore: Math.round(feasibilityScore),
      gap,
      status,
    };

    setResults(result);
    setRecommendations(generateRecommendations(result));
  };

  const generateRecommendations = (result: RetirementResult): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on gap analysis
    if (result.gap > 0) {
      const additionalMonthly = Math.ceil(
        (result.gap * 0.08) / 12 / ((Math.pow(1.08, result.yearsToRetirement) - 1) / 0.08)
      );
      recs.push({
        type: 'primary',
        title: 'سد الفجوة التقاعدية',
        description: `يوجد نقص ${formatCurrency(result.gap)}. زيادة الادخار بـ ${formatCurrency(additionalMonthly)} شهريًا يسد الفجوة`,
        impact: 'عالي',
      });
    } else {
      const surplus = Math.abs(result.gap);
      recs.push({
        type: 'primary',
        title: 'خطة تقاعدية ممتازة!',
        description: `لديك فائض ${formatCurrency(surplus)} عن الاحتياج. فكر في التقاعد المبكر أو تحسين نمط الحياة`,
        impact: 'إيجابي',
      });
    }

    // Recommendation 2: Time-based advice
    if (result.yearsToRetirement < 10 && result.status !== 'on-track') {
      recs.push({
        type: 'primary',
        title: 'وقت حرج - تحرك سريع',
        description: `باقي ${result.yearsToRetirement} سنوات فقط. ضاعف الادخار الشهري أو أجّل التقاعد 5 سنوات`,
        impact: 'عالي',
      });
    } else if (result.yearsToRetirement >= 20) {
      recs.push({
        type: 'secondary',
        title: 'الوقت في صالحك',
        description: `لديك ${result.yearsToRetirement} سنة. الادخار المنتظم الآن سيتضاعف بفضل الفائدة المركبة`,
        impact: 'إيجابي',
      });
    }

    // Recommendation 3: Investment strategy
    if (result.yearsToRetirement > 15) {
      recs.push({
        type: 'secondary',
        title: 'استراتيجية استثمارية نشطة',
        description: 'مع الأفق الزمني الطويل، فكر في زيادة نسبة الأسهم في المحفظة (60-70%) لعوائد أعلى',
        impact: 'متوسط',
      });
    } else if (result.yearsToRetirement <= 10) {
      recs.push({
        type: 'secondary',
        title: 'تقليل المخاطر تدريجيًا',
        description: 'اقترب التقاعد. انقل جزء من المحفظة إلى أصول أقل مخاطرة (سندات، صناديق متوازنة)',
        impact: 'متوسط',
      });
    }

    // Recommendation 4: Maximize contributions
    if (result.monthlyContribution > 0) {
      const increasedContribution = result.monthlyContribution * 1.1;
      const additionalFund =
        (increasedContribution - result.monthlyContribution) *
        ((Math.pow(1 + 0.08 / 12, result.yearsToRetirement * 12) - 1) / (0.08 / 12));
      recs.push({
        type: 'alternative',
        title: 'زيادة الادخار تدريجيًا',
        description: `زيادة الادخار بنسبة 10% فقط إلى ${formatCurrency(increasedContribution)} تضيف ${formatCurrency(additionalFund)} للرصيد التقاعدي`,
        impact: 'عالي',
      });
    }

    // Recommendation 5: Healthcare consideration
    if (result.yearsToRetirement <= 15) {
      recs.push({
        type: 'alternative',
        title: 'خصص ميزانية للرعاية الصحية',
        description: 'احسب 15-20% من ميزانية التقاعد لتكاليف الرعاية الصحية المتزايدة مع التقدم في العمر',
        impact: 'متوسط',
      });
    }

    return recs;
  };

  
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateRetirementPDF({
        currentAge: results.currentAge,
        retirementAge: results.retirementAge,
        currentSavings: results.currentSavings,
        monthlyContribution: results.monthlyContribution,
        yearsToRetirement: results.yearsToRetirement,
        projectedFund: results.projectedFund,
        monthlyRetirementIncome: results.monthlyRetirementIncome,
        gap: results.gap,
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
      case 'on-track':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'على المسار الصحيح',
          emoji: '✅',
        };
      case 'needs-boost':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'يحتاج تعزيز',
          emoji: '⚡',
        };
      case 'critical':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'وضع حرج',
          emoji: '🚨',
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
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-warning rounded-2xl mb-4">
            <Palmtree className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة التقاعد</h1>
          <p className="text-xl text-gray-600">خطط لمستقبل مريح ومستقر ماليًا</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات التقاعد</CardTitle>
              <CardDescription>أدخل بياناتك للتخطيط التقاعدي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="العمر الحالي"
                  type="number"
                  placeholder="35"
                  value={currentAge || ''}
                  onChange={(e) => {
                    setCurrentAge(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, currentAge: '' }));
                  }}
                  helperText="كم عمرك الآن؟"
                />
                {errors['currentAge'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['currentAge']}</p>
                )}
              </div>

              <div>
                <Input
                  label="سن التقاعد المستهدف"
                  type="number"
                  placeholder="60"
                  value={retirementAge || ''}
                  onChange={(e) => {
                    setRetirementAge(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, retirementAge: '' }));
                  }}
                  helperText="متى تريد التقاعد؟"
                />
                {errors['retirementAge'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['retirementAge']}</p>
                )}
              </div>

              <div>
                <Input
                  label="المدخرات الحالية (ريال)"
                  type="number"
                  placeholder="100000"
                  value={currentSavings || ''}
                  onChange={(e) => {
                    setCurrentSavings(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, currentSavings: '' }));
                  }}
                  helperText="ما لديك من مدخرات الآن"
                />
                {errors['currentSavings'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['currentSavings']}</p>
                )}
              </div>

              <div>
                <Input
                  label="الادخار الشهري (ريال)"
                  type="number"
                  placeholder="3000"
                  value={monthlyContribution || ''}
                  onChange={(e) => {
                    setMonthlyContribution(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, monthlyContribution: '' }));
                  }}
                  helperText="المبلغ الذي تدخره شهريًا للتقاعد"
                />
                {errors['monthlyContribution'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['monthlyContribution']}</p>
                )}
              </div>

              <Button onClick={calculateRetirement} className="w-full" size="lg">
                احسب خطة التقاعد
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
                    <p className="text-sm text-gray-600 mb-2">درجة جدوى الخطة</p>
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

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الرصيد التقاعدي المتوقع</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(results.projectedFund)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الدخل الشهري المتوقع</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(results.monthlyRetirementIncome)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">بناء على قاعدة 4%</p>
                    </div>

                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">سنوات حتى التقاعد</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <p className="text-2xl font-bold text-gray-900">
                          {results.yearsToRetirement} <span className="text-sm">سنة</span>
                        </p>
                      </div>
                    </div>

                    {/* Gap Analysis */}
                    {results.gap !== 0 && (
                      <div
                        className={`p-4 rounded-lg border ${
                          results.gap > 0
                            ? 'bg-red-50 border-red-200'
                            : 'bg-green-50 border-green-200'
                        }`}
                      >
                        <p className="text-sm text-gray-600 mb-1">
                          {results.gap > 0 ? 'الفجوة التقاعدية' : 'الفائض التقاعدي'}
                        </p>
                        <p
                          className={`text-xl font-bold ${results.gap > 0 ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {results.gap > 0 ? '-' : '+'}{formatCurrency(Math.abs(results.gap))}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {results.gap > 0 ? 'يحتاج تغطية' : 'فوق الاحتياج'}
                        </p>
                      </div>
                    )}
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
                توصيات لتحسين خطة التقاعد
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

        {/* Save Results CTA */}
        {results && (
          <Card className="mt-8 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                احفظ خطة التقاعد
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
                <Button onClick={handleDownloadPDF} className="sm:w-auto bg-green-600 hover:bg-green-700">
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
