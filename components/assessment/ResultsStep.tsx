'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { CheckCircle2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { formatCurrency } from '@/lib/utils';

export default function ResultsStep() {
  const router = useRouter();
  const { assessmentData, setResults } = useAssessmentStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // حساب النتائج
    const calculateResults = () => {
      const { financialStatus } = assessmentData;

      // حساب النقاط الصحية المالية (من 100)
      let score = 0;

      // نسبة الادخار
      const savingsRate = financialStatus.monthlyIncome
        ? ((financialStatus.monthlyIncome - (financialStatus.monthlyExpenses || 0)) /
            financialStatus.monthlyIncome) *
          100
        : 0;

      if (savingsRate > 20) score += 30;
      else if (savingsRate > 10) score += 20;
      else if (savingsRate > 0) score += 10;

      // نسبة الديون
      const debtRatio = financialStatus.monthlyIncome
        ? ((financialStatus.totalDebts || 0) / (financialStatus.monthlyIncome * 12)) * 100
        : 0;

      if (debtRatio < 30) score += 30;
      else if (debtRatio < 50) score += 20;
      else if (debtRatio < 100) score += 10;

      // صندوق الطوارئ
      const emergencyFund =
        (financialStatus.totalSavings || 0) / (financialStatus.monthlyExpenses || 1);

      if (emergencyFund >= 6) score += 40;
      else if (emergencyFund >= 3) score += 30;
      else if (emergencyFund >= 1) score += 20;
      else score += 10;

      const results = {
        healthScore: Math.min(score, 100),
        recommendations: generateRecommendations(score, savingsRate, debtRatio, emergencyFund),
        actionPlan: [],
      };

      setResults(results);
      setLoading(false);
    };

    calculateResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRecommendations = (
    _score: number,
    savingsRate: number,
    debtRatio: number,
    emergencyFund: number
  ): string[] => {
    const recommendations: string[] = [];

    if (savingsRate < 20) {
      recommendations.push('حاول زيادة نسبة الادخار إلى 20% على الأقل من دخلك الشهري');
    }

    if (debtRatio > 30) {
      recommendations.push('ركّز على سداد الديون ذات الفائدة العالية أولاً');
    }

    if (emergencyFund < 6) {
      recommendations.push('ابنِ صندوق طوارئ يكفي لـ 6 أشهر من مصروفاتك');
    }

    if (recommendations.length === 0) {
      recommendations.push('وضعك المالي ممتاز! حافظ على هذا المستوى');
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">جاري تحليل وضعك المالي...</p>
      </div>
    );
  }

  const { results } = assessmentData;
  const healthScore = results?.healthScore || 0;
  const { financialStatus } = assessmentData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'متوسط';
    return 'يحتاج تحسين';
  };

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <h3 className="text-lg text-gray-600 mb-4">درجة الصحة المالية</h3>
        <div className={`text-6xl font-bold ${getScoreColor(healthScore)} mb-2`}>{healthScore}</div>
        <p className={`text-xl font-semibold ${getScoreColor(healthScore)}`}>
          {getScoreLabel(healthScore)}
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">صافي الدخل الشهري</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(
              (financialStatus.monthlyIncome || 0) - (financialStatus.monthlyExpenses || 0)
            )}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">إجمالي المدخرات</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(financialStatus.totalSavings || 0)}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          التوصيات الرئيسية
        </h4>
        {results?.recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg"
          >
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{rec}</p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="pt-6 space-y-3">
        <Button onClick={() => router.push('/tools')} className="w-full" size="lg">
          استكشف الأدوات المالية
        </Button>
        <Button onClick={() => router.push('/')} variant="outline" className="w-full">
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}
