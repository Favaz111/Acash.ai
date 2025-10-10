'use client';

import { Input } from '@/components/ui/input';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { formatCurrency } from '@/lib/utils';

export default function FinancialStatusStep() {
  const { assessmentData, updateFinancialStatus } = useAssessmentStore();
  const { financialStatus } = assessmentData;

  const netIncome = (financialStatus.monthlyIncome || 0) - (financialStatus.monthlyExpenses || 0);

  return (
    <div className="space-y-6">
      <Input
        label="الدخل الشهري (ريال)"
        type="number"
        placeholder="10000"
        value={financialStatus.monthlyIncome || ''}
        onChange={(e) => updateFinancialStatus({ monthlyIncome: parseFloat(e.target.value) })}
      />

      <Input
        label="المصروفات الشهرية (ريال)"
        type="number"
        placeholder="7000"
        value={financialStatus.monthlyExpenses || ''}
        onChange={(e) => updateFinancialStatus({ monthlyExpenses: parseFloat(e.target.value) })}
      />

      {financialStatus.monthlyIncome && financialStatus.monthlyExpenses && (
        <div
          className={`p-4 rounded-lg ${netIncome >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <p className="text-sm text-gray-600 mb-1">صافي الدخل الشهري</p>
          <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatCurrency(netIncome)}
          </p>
        </div>
      )}

      <Input
        label="إجمالي المدخرات (ريال)"
        type="number"
        placeholder="50000"
        value={financialStatus.totalSavings || ''}
        onChange={(e) => updateFinancialStatus({ totalSavings: parseFloat(e.target.value) })}
        helperText="جميع الأموال المدخرة في البنوك والاستثمارات"
      />

      <Input
        label="إجمالي الديون (ريال)"
        type="number"
        placeholder="0"
        value={financialStatus.totalDebts || ''}
        onChange={(e) => updateFinancialStatus({ totalDebts: parseFloat(e.target.value) })}
        helperText="قروض، بطاقات ائتمان، ديون شخصية، إلخ"
      />
    </div>
  );
}
