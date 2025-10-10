import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  totalDebts: number;
}

interface FinancialOverviewWidgetProps {
  data: FinancialData;
}

export function FinancialOverviewWidget({ data }: FinancialOverviewWidgetProps) {
  const netIncome = data.monthlyIncome - data.monthlyExpenses;
  const netWorth = data.totalSavings - data.totalDebts;
  const savingsRate =
    data.monthlyIncome > 0 ? ((netIncome / data.monthlyIncome) * 100).toFixed(1) : '0';

  const stats = [
    {
      label: 'الدخل الشهري',
      value: data.monthlyIncome,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'المصروفات الشهرية',
      value: data.monthlyExpenses,
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'المدخرات',
      value: data.totalSavings,
      icon: Wallet,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'الديون',
      value: data.totalDebts,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>نظرة مالية عامة</CardTitle>
        <CardDescription>ملخص وضعك المالي الحالي</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(stat.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">صافي الدخل الشهري</span>
            <span
              className={`text-lg font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatCurrency(netIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">صافي الثروة</span>
            <span
              className={`text-lg font-semibold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatCurrency(netWorth)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">معدل الادخار</span>
            <span className="text-lg font-semibold text-blue-600">{savingsRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
