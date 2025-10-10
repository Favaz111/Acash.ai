'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Zap,
  Download,
  Mail,
  AlertCircle,
  PercentCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
// @ts-ignore
import { ROICalculatorSchema } from '@/lib/validations/calculators';
import { generateROIPDF } from '@/lib/utils/pdf-generator';

interface ROIResult {
  initialInvestment: number;
  finalValue: number;
  timePeriod: number;
  roiPercentage: number;
  profit: number;
  annualizedReturn: number;
  status: 'profit' | 'loss' | 'breakeven';
}

interface Recommendation {
  type: 'primary' | 'secondary' | 'alternative';
  title: string;
  description: string;
  impact: string;
}

export default function ROICalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [finalValue, setFinalValue] = useState<number>(0);
  const [timePeriod, setTimePeriod] = useState<number>(0);
  const [results, setResults] = useState<ROIResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateROI = () => {
    // Validate inputs first
    const validation = ROICalculatorSchema.safeParse({
      initialInvestment,
      finalValue,
      periodYears: timePeriod,
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

    if (!initialInvestment || !finalValue || !timePeriod) return;

    const profit = finalValue - initialInvestment;
    const roiPercentage = (profit / initialInvestment) * 100;

    // Calculate annualized return (CAGR)
    const annualizedReturn =
      (Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1) * 100;

    // Determine status
    let status: 'profit' | 'loss' | 'breakeven';
    if (profit > 0) status = 'profit';
    else if (profit < 0) status = 'loss';
    else status = 'breakeven';

    const result: ROIResult = {
      initialInvestment,
      finalValue,
      timePeriod,
      roiPercentage,
      profit,
      annualizedReturn,
      status,
    };

    setResults(result);
    setRecommendations(generateRecommendations(result));
  };

  const generateRecommendations = (result: ROIResult): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on annualized return
    if (result.status === 'profit') {
      if (result.annualizedReturn > 15) {
        recs.push({
          type: 'primary',
          title: 'عائد ممتاز!',
          description: `عائد سنوي ${result.annualizedReturn.toFixed(1)}% يفوق متوسط السوق. استمر في استراتيجية الاستثمار الناجحة`,
          impact: 'إيجابي',
        });
      } else if (result.annualizedReturn > 8) {
        recs.push({
          type: 'primary',
          title: 'عائد جيد',
          description: `عائد سنوي ${result.annualizedReturn.toFixed(1)}% ضمن النطاق الجيد. فكر في تنويع المحفظة لزيادة العوائد`,
          impact: 'إيجابي',
        });
      } else if (result.annualizedReturn > 0) {
        recs.push({
          type: 'primary',
          title: 'عائد متواضع',
          description: `عائد سنوي ${result.annualizedReturn.toFixed(1)}% أقل من التضخم المتوقع. فكر في فرص استثمارية أفضل`,
          impact: 'متوسط',
        });
      }
    } else if (result.status === 'loss') {
      recs.push({
        type: 'primary',
        title: 'خسارة تحتاج مراجعة',
        description: `خسرت ${formatCurrency(Math.abs(result.profit))} (${Math.abs(result.roiPercentage).toFixed(1)}%). راجع استراتيجية الاستثمار وفكر في التنويع`,
        impact: 'عالي',
      });
    }

    // Recommendation 2: Time horizon
    if (result.timePeriod < 3 && result.status === 'profit') {
      recs.push({
        type: 'secondary',
        title: 'عائد سريع',
        description: `حققت عائد ${result.roiPercentage.toFixed(1)}% في ${result.timePeriod} سنة فقط. الاستثمار طويل المدى قد يضاعف العوائد`,
        impact: 'متوسط',
      });
    } else if (result.timePeriod >= 5 && result.status === 'profit') {
      recs.push({
        type: 'secondary',
        title: 'استثمار طويل المدى',
        description: `الاستثمار لمدة ${result.timePeriod} سنة يظهر التزام. استمر في المراجعة الدورية للمحفظة`,
        impact: 'متوسط',
      });
    }

    // Recommendation 3: Profit reinvestment
    if (result.status === 'profit' && result.profit > result.initialInvestment * 0.2) {
      const reinvestedValue = result.finalValue * 1.08; // 8% annual return assumption
      const potentialProfit = reinvestedValue - result.finalValue;
      recs.push({
        type: 'alternative',
        title: 'إعادة استثمار الأرباح',
        description: `بإعادة استثمار ${formatCurrency(result.finalValue)}، يمكنك تحقيق ${formatCurrency(potentialProfit)} إضافية سنويًا (بمعدل 8%)`,
        impact: 'عالي',
      });
    }

    // Recommendation 4: Diversification suggestion
    if (result.status === 'profit') {
      recs.push({
        type: 'alternative',
        title: 'تنويع المحفظة',
        description: 'وزع استثماراتك على أصول مختلفة (أسهم، عقارات، سندات) لتقليل المخاطر وزيادة الاستقرار',
        impact: 'متوسط',
      });
    } else if (result.status === 'loss') {
      recs.push({
        type: 'secondary',
        title: 'مراجعة توزيع الأصول',
        description: 'التنويع بين قطاعات مختلفة يقلل من مخاطر الخسارة. استشر مستشار مالي لإعادة بناء المحفظة',
        impact: 'عالي',
      });
    }

    return recs;
  };

  
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateROIPDF({
        initialInvestment: results.initialInvestment,
        finalValue: results.finalValue,
        timePeriod: results.timePeriod,
        roiPercentage: results.roiPercentage,
        profit: results.profit,
        annualizedReturn: results.annualizedReturn,
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
      case 'profit':
        return {
          icon: TrendingUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'ربح',
          emoji: '📈',
        };
      case 'loss':
        return {
          icon: TrendingDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'خسارة',
          emoji: '📉',
        };
      case 'breakeven':
        return {
          icon: Minus,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'التعادل',
          emoji: '➖',
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

  const getAnnualizedReturnColor = (rate: number) => {
    if (rate > 15) return 'text-green-600';
    if (rate > 8) return 'text-blue-600';
    if (rate > 0) return 'text-yellow-600';
    return 'text-red-600';
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
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة العائد على الاستثمار</h1>
          <p className="text-xl text-gray-600">احسب عائد استثماراتك وأدائها السنوي</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الاستثمار</CardTitle>
              <CardDescription>أدخل تفاصيل استثمارك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="الاستثمار الأولي (ريال)"
                  type="number"
                  placeholder="50000"
                  value={initialInvestment || ''}
                  onChange={(e) => {
                    setInitialInvestment(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, initialInvestment: '' }));
                  }}
                  helperText="المبلغ الذي استثمرته في البداية"
                />
                {errors['initialInvestment'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['initialInvestment']}</p>
                )}
              </div>

              <div>
                <Input
                  label="القيمة النهائية (ريال)"
                  type="number"
                  placeholder="75000"
                  value={finalValue || ''}
                  onChange={(e) => {
                    setFinalValue(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, finalValue: '' }));
                  }}
                  helperText="القيمة الحالية أو النهائية للاستثمار"
                />
                {errors['finalValue'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['finalValue']}</p>
                )}
              </div>

              <div>
                <Input
                  label="فترة الاستثمار (سنوات)"
                  type="number"
                  placeholder="5"
                  value={timePeriod || ''}
                  onChange={(e) => {
                    setTimePeriod(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, periodYears: '' }));
                  }}
                  helperText="عدد السنوات منذ بداية الاستثمار"
                />
                {errors['periodYears'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['periodYears']}</p>
                )}
              </div>

              <Button onClick={calculateROI} className="w-full" size="lg">
                احسب العائد على الاستثمار
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
                  {/* Status Card */}
                  <div
                    className={`p-6 ${getStatusInfo(results.status).bgColor} border-2 ${getStatusInfo(results.status).borderColor} rounded-xl text-center`}
                  >
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {(() => {
                        const StatusIcon = getStatusInfo(results.status).icon;
                        return <StatusIcon className={`w-8 h-8 ${getStatusInfo(results.status).color}`} />;
                      })()}
                      <p className={`text-3xl font-bold ${getStatusInfo(results.status).color}`}>
                        {getStatusInfo(results.status).text}
                      </p>
                      <span className="text-3xl">{getStatusInfo(results.status).emoji}</span>
                    </div>
                    <p className="text-sm text-gray-600">حالة الاستثمار</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">نسبة العائد الإجمالي</p>
                      <div className="flex items-center gap-2">
                        <PercentCircle className={`w-5 h-5 ${results.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <p className={`text-3xl font-bold ${results.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {results.roiPercentage >= 0 ? '+' : ''}{results.roiPercentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 border-2 rounded-lg ${results.profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-sm text-gray-600 mb-1">
                        {results.profit >= 0 ? 'الربح' : 'الخسارة'}
                      </p>
                      <div className="flex items-center gap-2">
                        <DollarSign className={`w-5 h-5 ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                        <p className={`text-2xl font-bold ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {results.profit >= 0 ? '+' : ''}{formatCurrency(results.profit)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">العائد السنوي المركب</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <p className={`text-2xl font-bold ${getAnnualizedReturnColor(results.annualizedReturn)}`}>
                          {results.annualizedReturn >= 0 ? '+' : ''}{results.annualizedReturn.toFixed(2)}%
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">متوسط العائد السنوي</p>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500">الاستثمار الأولي</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(results.initialInvestment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">القيمة النهائية</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(results.finalValue)}
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
                توصيات استثمارية ذكية
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
                احفظ تحليل الاستثمار
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
