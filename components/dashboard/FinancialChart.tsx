'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3 } from 'lucide-react';

interface FinancialChartProps {
  type: 'line' | 'bar' | 'pie';
  title: string;
  description?: string;
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

/**
 * Financial Chart Component
 * رسوم بيانية للبيانات المالية باستخدام recharts
 */
export function FinancialChart({
  type,
  title,
  description,
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  colors = COLORS,
}: FinancialChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
                dot={{ fill: colors[0] || '#0066CC', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey={xAxisKey} stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const percent = props.percent || 0;
                  const name = props.name || '';
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'line':
        return <TrendingUp className="w-5 h-5" />;
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'pie':
        return <PieIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getIcon()}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}

/**
 * Monthly Trend Chart
 * رسم بياني للاتجاه الشهري
 */
export function MonthlyTrendChart({ data }: { data: Array<{ month: string; amount: number }> }) {
  return (
    <FinancialChart
      type="line"
      title="الاتجاه الشهري"
      description="تتبع المصروفات والمدخرات على مدار الأشهر"
      data={data}
      dataKey="amount"
      xAxisKey="month"
      colors={['#6366f1']}
    />
  );
}

/**
 * Budget Distribution Chart
 * رسم بياني لتوزيع الميزانية
 */
export function BudgetDistributionChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <FinancialChart
      type="pie"
      title="توزيع الميزانية"
      description="كيف تُوزّع مصروفاتك؟"
      data={data}
      dataKey="value"
      colors={['#10b981', '#f59e0b', '#ef4444']}
    />
  );
}

/**
 * Debt Progress Chart
 * رسم بياني لتقدم سداد الديون
 */
export function DebtProgressChart({ data }: { data: Array<{ name: string; remaining: number }> }) {
  return (
    <FinancialChart
      type="bar"
      title="تقدم سداد الديون"
      description="المبالغ المتبقية على كل دين"
      data={data}
      dataKey="remaining"
      xAxisKey="name"
      colors={['#ef4444']}
    />
  );
}

/**
 * Goals Progress Chart
 * رسم بياني لتقدم الأهداف المالية
 */
export function GoalsProgressChart({
  data,
}: {
  data: Array<{ name: string; current: number; target: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <CardTitle className="text-lg">تقدم الأهداف المالية</CardTitle>
        </div>
        <CardDescription>نسبة إنجاز كل هدف مالي</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="current" fill="#10b981" radius={[8, 8, 0, 0]} name="المبلغ الحالي" />
            <Bar dataKey="target" fill="#e5e7eb" radius={[8, 8, 0, 0]} name="المبلغ المستهدف" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
