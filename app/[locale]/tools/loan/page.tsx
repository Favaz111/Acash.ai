'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Calculator,
  TrendingDown,
  Calendar,
  DollarSign,
  CheckCircle,
  Zap,
  Download,
  Mail,
  AlertCircle,
  PercentCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LoanCalculatorSchema } from '@/lib/validations/calculators';
import { generateLoanPDF } from '@/lib/utils/pdf-generator';

interface LoanResult {
  principal: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  debtToIncomeRatio: number;
  amortizationPreview: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface Recommendation {
  type: 'primary' | 'secondary' | 'alternative';
  title: string;
  description: string;
  impact: string;
}

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [results, setResults] = useState<LoanResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateLoan = () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    const validation = LoanCalculatorSchema.safeParse({
      principal,
      interestRate,
      termYears: loanTerm,
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

    // Calculate monthly payment using amortization formula
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - principal;

    // Calculate debt-to-income ratio
    const debtToIncomeRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;

    // Determine status based on debt-to-income ratio
    let status: 'excellent' | 'good' | 'fair' | 'poor';
    if (debtToIncomeRatio === 0) status = 'good';
    else if (debtToIncomeRatio <= 28) status = 'excellent';
    else if (debtToIncomeRatio <= 36) status = 'good';
    else if (debtToIncomeRatio <= 43) status = 'fair';
    else status = 'poor';

    // Generate amortization schedule for first 6 months
    const amortizationPreview = [];
    let balance = principal;

    for (let month = 1; month <= Math.min(6, numberOfPayments); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      amortizationPreview.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    const result: LoanResult = {
      principal,
      interestRate,
      loanTerm,
      monthlyPayment,
      totalInterest,
      totalRepayment,
      debtToIncomeRatio,
      amortizationPreview,
      status,
    };

    setResults(result);
    setRecommendations(generateRecommendations(result));
  };

  const generateRecommendations = (result: LoanResult): Recommendation[] => {
    const recs: Recommendation[] = [];

    // Recommendation 1: Based on interest rate
    if (result.interestRate > 10) {
      recs.push({
        type: 'primary',
        title: 'فكر في إعادة التمويل',
        description: `معدل الفائدة ${result.interestRate.toFixed(1)}% مرتفع. إعادة التمويل بمعدل أقل يمكن أن توفر ${formatCurrency(result.totalInterest * 0.3)} أو أكثر`,
        impact: 'عالي',
      });
    }

    // Recommendation 2: Debt-to-income ratio
    if (result.debtToIncomeRatio > 36) {
      recs.push({
        type: 'primary',
        title: 'نسبة الدين مرتفعة',
        description: `نسبة الدين إلى الدخل ${result.debtToIncomeRatio.toFixed(0)}% أعلى من الحد الموصى به (36%). فكر في زيادة الدخل أو تقليل مبلغ القرض`,
        impact: 'عالي',
      });
    } else if (result.debtToIncomeRatio <= 28) {
      recs.push({
        type: 'primary',
        title: 'نسبة دين ممتازة!',
        description: `نسبة الدين إلى الدخل ${result.debtToIncomeRatio.toFixed(0)}% ضمن النطاق الصحي - وضع مالي جيد`,
        impact: 'إيجابي',
      });
    }

    // Recommendation 3: Total interest paid
    const interestPercentage = (result.totalInterest / result.principal) * 100;
    if (interestPercentage > 50) {
      recs.push({
        type: 'secondary',
        title: 'تقليل مدة القرض',
        description: `ستدفع ${formatCurrency(result.totalInterest)} فوائد (${interestPercentage.toFixed(0)}% من أصل القرض). تقليل المدة يوفر الفوائد`,
        impact: 'متوسط',
      });
    }

    // Recommendation 4: Early payment option
    const extraMonthly = result.monthlyPayment * 0.1;
    const savedInterest = result.totalInterest * 0.2;
    recs.push({
      type: 'alternative',
      title: 'دفعات إضافية شهرية',
      description: `إضافة ${formatCurrency(extraMonthly)} شهريًا يمكن أن توفر حوالي ${formatCurrency(savedInterest)} من الفوائد`,
      impact: 'متوسط',
    });

    return recs;
  };

  const handleDownloadPDF = () => {
    if (!results) return;

    try {
      generateLoanPDF({
        principal: results.principal,
        interestRate: results.interestRate,
        termYears: results.loanTerm,
        monthlyPayment: results.monthlyPayment,
        totalPayment: results.totalRepayment,
        totalInterest: results.totalInterest,
        amortizationSchedule: results.amortizationPreview,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'excellent':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'وضع ممتاز',
          emoji: '✅',
        };
      case 'good':
        return {
          icon: CheckCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          text: 'وضع جيد',
          emoji: '👍',
        };
      case 'fair':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'يحتاج انتباه',
          emoji: '⚡',
        };
      case 'poor':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'يحتاج مراجعة',
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
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة القروض</h1>
          <p className="text-xl text-gray-600">احسب الدفعات الشهرية وتكلفة القرض الإجمالية</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات القرض</CardTitle>
              <CardDescription>أدخل تفاصيل القرض المطلوب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="مبلغ القرض (ريال)"
                  type="number"
                  placeholder="200000"
                  value={principal || ''}
                  onChange={(e) => {
                    setPrincipal(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, principal: '' }));
                  }}
                  helperText="المبلغ الذي تريد اقتراضه"
                />
                {errors['principal'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['principal']}</p>
                )}
              </div>

              <div>
                <Input
                  label="معدل الفائدة السنوي (%)"
                  type="number"
                  placeholder="5.5"
                  step="0.1"
                  value={interestRate || ''}
                  onChange={(e) => {
                    setInterestRate(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, interestRate: '' }));
                  }}
                  helperText="نسبة الفائدة السنوية"
                />
                {errors['interestRate'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['interestRate']}</p>
                )}
              </div>

              <div>
                <Input
                  label="مدة القرض (سنوات)"
                  type="number"
                  placeholder="15"
                  value={loanTerm || ''}
                  onChange={(e) => {
                    setLoanTerm(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, loanTerm: '' }));
                  }}
                  helperText="عدد سنوات سداد القرض"
                />
                {errors['loanTerm'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['loanTerm']}</p>
                )}
              </div>

              <Input
                label="الدخل الشهري (اختياري)"
                type="number"
                placeholder="20000"
                value={monthlyIncome || ''}
                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
                helperText="لحساب نسبة الدين إلى الدخل"
              />

              <Button onClick={calculateLoan} className="w-full" size="lg">
                احسب تفاصيل القرض
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
                  {monthlyIncome > 0 && (
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
                          <p className="text-sm text-gray-600">
                            نسبة الدين إلى الدخل: {results.debtToIncomeRatio.toFixed(1)}%
                          </p>
                        </div>
                        <span className="text-2xl">{getStatusInfo(results.status).emoji}</span>
                      </div>
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">الدفعة الشهرية</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(results.monthlyPayment)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">إجمالي الفوائد</p>
                      <div className="flex items-center gap-2">
                        <PercentCircle className="w-5 h-5 text-green-600" />
                        <p className="text-xl font-bold text-green-600">
                          {formatCurrency(results.totalInterest)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ المستحق</p>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-purple-600" />
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(results.totalRepayment)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Amortization Preview */}
        {results && results.amortizationPreview.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                جدول السداد - أول 6 أشهر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-right py-3 px-4">الشهر</th>
                      <th className="text-right py-3 px-4">الدفعة</th>
                      <th className="text-right py-3 px-4">الأصل</th>
                      <th className="text-right py-3 px-4">الفائدة</th>
                      <th className="text-right py-3 px-4">الرصيد المتبقي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.amortizationPreview.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 font-semibold">{row.month}</td>
                        <td className="py-3 px-4">{formatCurrency(row.payment)}</td>
                        <td className="py-3 px-4 text-green-600">{formatCurrency(row.principal)}</td>
                        <td className="py-3 px-4 text-red-600">{formatCurrency(row.interest)}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                توصيات لتحسين وضع القرض
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
                احفظ نتائج القرض
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
