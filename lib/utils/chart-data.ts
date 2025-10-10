/**
 * Advanced Data Visualization Utilities
 * Chart data preparation and formatting
 */

import { DebtItem, BudgetCategory, Transaction, FinancialGoal } from '@/types/database';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonData {
  category: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

// Color palettes for charts
export const CHART_COLORS = {
  primary: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  success: ['#10b981', '#34d399', '#6ee7b7', '#d1fae5'],
  warning: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'],
  danger: ['#ef4444', '#f87171', '#fca5a5', '#fee2e2'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe'],
  gradient: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'],
};

// Debt breakdown by type
export function getDebtBreakdownData(debts: DebtItem[]): ChartDataPoint[] {
  const debtByType: Record<string, number> = {};

  debts.forEach((debt) => {
    const type = debt.type || 'other';
    debtByType[type] = (debtByType[type] || 0) + debt.totalAmount;
  });

  const total = Object.values(debtByType).reduce((sum, val) => sum + val, 0);

  const typeLabels: Record<string, { en: string; ar: string; color: string }> = {
    credit_card: { en: 'Credit Card', ar: 'بطاقة ائتمان', color: CHART_COLORS.danger[0] },
    personal_loan: { en: 'Personal Loan', ar: 'قرض شخصي', color: CHART_COLORS.warning[0] },
    car_loan: { en: 'Car Loan', ar: 'قرض سيارة', color: CHART_COLORS.primary[0] },
    mortgage: { en: 'Mortgage', ar: 'رهن عقاري', color: CHART_COLORS.purple[0] },
    student_loan: { en: 'Student Loan', ar: 'قرض طلابي', color: CHART_COLORS.success[0] },
    other: { en: 'Other', ar: 'أخرى', color: '#6b7280' },
  };

  return Object.entries(debtByType).map(([type, amount]) => ({
    label: typeLabels[type]?.ar || type,
    value: amount,
    color: typeLabels[type]?.color || '#6b7280',
    percentage: (amount / total) * 100,
  }));
}

// Budget spending visualization
export function getBudgetSpendingData(budgets: BudgetCategory[]): {
  allocated: ChartDataPoint[];
  spent: ChartDataPoint[];
  comparison: ComparisonData[];
} {
  const categoryColors: Record<string, string> = {
    housing: '#3b82f6',
    transportation: '#8b5cf6',
    food: '#10b981',
    utilities: '#f59e0b',
    healthcare: '#ef4444',
    entertainment: '#ec4899',
    shopping: '#06b6d4',
    education: '#6366f1',
    savings: '#14b8a6',
    other: '#6b7280',
  };

  const allocated: ChartDataPoint[] = budgets.map((budget) => ({
    label: budget.nameAr || budget.name,
    value: budget.allocated,
    color: categoryColors[budget.category] || '#6b7280',
  }));

  const spent: ChartDataPoint[] = budgets.map((budget) => ({
    label: budget.nameAr || budget.name,
    value: budget.spent,
    color: categoryColors[budget.category] || '#6b7280',
  }));

  const comparison: ComparisonData[] = budgets.map((budget) => ({
    category: budget.nameAr || budget.name,
    current: budget.spent,
    previous: budget.allocated,
    change: budget.spent - budget.allocated,
    changePercent:
      budget.allocated > 0 ? ((budget.spent - budget.allocated) / budget.allocated) * 100 : 0,
  }));

  return { allocated, spent, comparison };
}

// Debt payoff projection
export function getDebtPayoffProjection(
  debts: DebtItem[],
  months: number = 24
): TimeSeriesDataPoint[] {
  const projection: TimeSeriesDataPoint[] = [];
  const currentDate = new Date();

  let remainingDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  for (let i = 0; i <= months; i++) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);

    // Simple projection (doesn't account for interest)
    remainingDebt = Math.max(0, remainingDebt - totalMonthlyPayment);

    projection.push({
      date: date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' }),
      value: remainingDebt,
      label: `${remainingDebt.toLocaleString('ar-SA')} ر.س`,
    });

    if (remainingDebt === 0) break;
  }

  return projection;
}

// Income vs Expenses over time
export function getIncomeExpensesTimeline(
  transactions: Transaction[],
  months: number = 6
): {
  labels: string[];
  income: number[];
  expenses: number[];
  net: number[];
} {
  const now = new Date();
  const labels: string[] = [];
  const income: number[] = [];
  const expenses: number[] = [];
  const net: number[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    labels.push(date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }));

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      return tKey === monthKey;
    });

    const monthIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthExpenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    income.push(monthIncome);
    expenses.push(monthExpenses);
    net.push(monthIncome - monthExpenses);
  }

  return { labels, income, expenses, net };
}

// Financial goals progress
export function getGoalsProgressData(goals: FinancialGoal[]): {
  goals: ChartDataPoint[];
  timeline: { goal: string; data: TimeSeriesDataPoint[] }[];
} {
  const goalsData: ChartDataPoint[] = goals.map((goal, index) => ({
    label: goal.nameAr || goal.name,
    value: (goal.currentAmount / goal.targetAmount) * 100,
    color: CHART_COLORS.gradient[index % CHART_COLORS.gradient.length],
    percentage: (goal.currentAmount / goal.targetAmount) * 100,
  }));

  const timeline = goals.map((goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.targetDate);
    const monthsDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    const data: TimeSeriesDataPoint[] = [];
    const monthlyTarget = goal.targetAmount / monthsDiff;

    for (let i = 0; i <= monthsDiff; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);

      data.push({
        date: date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
        value: monthlyTarget * i,
        label: `${(monthlyTarget * i).toLocaleString('ar-SA')} ر.س`,
      });
    }

    return {
      goal: goal.nameAr || goal.name,
      data,
    };
  });

  return { goals: goalsData, timeline };
}

// Net worth over time
export function getNetWorthTimeline(
  transactions: Transaction[],
  debts: DebtItem[],
  months: number = 12
): TimeSeriesDataPoint[] {
  const now = new Date();
  const timeline: TimeSeriesDataPoint[] = [];

  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  let cumulativeNet = 0;

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      return tKey === monthKey;
    });

    const monthNet = monthTransactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);

    cumulativeNet += monthNet;
    const netWorth = cumulativeNet - totalDebt;

    timeline.push({
      date: date.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
      value: netWorth,
      label: `${netWorth.toLocaleString('ar-SA')} ر.س`,
    });
  }

  return timeline;
}

// Spending by category (pie/donut chart)
export function getSpendingByCategory(transactions: Transaction[]): ChartDataPoint[] {
  const categorySpending: Record<string, number> = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const category = t.category || 'other';
      categorySpending[category] = (categorySpending[category] || 0) + t.amount;
    });

  const total = Object.values(categorySpending).reduce((sum, val) => sum + val, 0);

  const categoryLabels: Record<string, { ar: string; color: string }> = {
    housing: { ar: 'السكن', color: '#3b82f6' },
    transportation: { ar: 'المواصلات', color: '#8b5cf6' },
    food: { ar: 'الطعام', color: '#10b981' },
    utilities: { ar: 'المرافق', color: '#f59e0b' },
    healthcare: { ar: 'الرعاية الصحية', color: '#ef4444' },
    entertainment: { ar: 'الترفيه', color: '#ec4899' },
    shopping: { ar: 'التسوق', color: '#06b6d4' },
    education: { ar: 'التعليم', color: '#6366f1' },
    other: { ar: 'أخرى', color: '#6b7280' },
  };

  return Object.entries(categorySpending)
    .map(([category, amount]) => ({
      label: categoryLabels[category]?.ar || category,
      value: amount,
      color: categoryLabels[category]?.color || '#6b7280',
      percentage: (amount / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);
}

// Monthly comparison (current vs previous)
export function getMonthlyComparison(transactions: Transaction[]): {
  current: { income: number; expenses: number; net: number };
  previous: { income: number; expenses: number; net: number };
  change: { income: number; expenses: number; net: number };
} {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const prevDate = new Date(now);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const currentTxns = transactions.filter((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return key === currentMonth;
  });

  const previousTxns = transactions.filter((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return key === previousMonth;
  });

  const current = {
    income: currentTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expenses: currentTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    net: 0,
  };
  current.net = current.income - current.expenses;

  const previous = {
    income: previousTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expenses: previousTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    net: 0,
  };
  previous.net = previous.income - previous.expenses;

  return {
    current,
    previous,
    change: {
      income: current.income - previous.income,
      expenses: current.expenses - previous.expenses,
      net: current.net - previous.net,
    },
  };
}

// Savings rate over time
export function getSavingsRateTimeline(
  transactions: Transaction[],
  months: number = 6
): TimeSeriesDataPoint[] {
  const now = new Date();
  const timeline: TimeSeriesDataPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const monthTxns = transactions.filter((t) => {
      const tDate = new Date(t.date);
      const tKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      return tKey === monthKey;
    });

    const income = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    timeline.push({
      date: date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
      value: savingsRate,
      label: `${savingsRate.toFixed(1)}%`,
    });
  }

  return timeline;
}

// Top spending categories (top 5)
export function getTopSpendingCategories(
  transactions: Transaction[],
  limit: number = 5
): ChartDataPoint[] {
  const categorySpending = getSpendingByCategory(transactions);
  return categorySpending.slice(0, limit);
}

// Financial health trend
export function getHealthScoreTrend(
  historicalScores: { date: Date; score: number }[]
): TimeSeriesDataPoint[] {
  return historicalScores.map((item) => ({
    date: item.date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' }),
    value: item.score,
    label: `${item.score}%`,
  }));
}
