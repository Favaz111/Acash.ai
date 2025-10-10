/**
 * AI Financial Advisor
 * Advanced financial analysis and recommendations using AI
 */

import { DebtItem, FinancialGoal, BudgetCategory } from '@/types/database';
// import type { User } from '@/types/database';

export interface FinancialProfile {
  userId: string;
  totalIncome: number;
  totalExpenses: number;
  totalDebt: number;
  totalSavings: number;
  monthlyDebtPayment: number;
  creditScore?: number;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  dependents: number;
}

export interface AIRecommendation {
  id: string;
  category: 'debt' | 'savings' | 'investment' | 'budget' | 'emergency' | 'retirement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  action: string;
  actionAr: string;
  potentialSavings?: number;
  timeToAchieve?: string;
  confidence: number; // 0-100
  reasoning: string;
  reasoningAr: string;
}

export interface FinancialHealthScore {
  overall: number; // 0-100
  categories: {
    debtManagement: number;
    savingsRate: number;
    budgetAdherence: number;
    emergencyFund: number;
    financialStability: number;
  };
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  trend: 'improving' | 'stable' | 'declining';
}

class AIFinancialAdvisor {
  // Calculate Financial Health Score
  calculateHealthScore(profile: FinancialProfile): FinancialHealthScore {
    const { totalIncome, totalExpenses, totalDebt, totalSavings, monthlyDebtPayment } = profile;

    // 1. Debt Management Score (0-100)
    const debtToIncome = totalIncome > 0 ? (monthlyDebtPayment / totalIncome) * 100 : 100;
    const debtManagement = Math.max(0, 100 - debtToIncome * 2);

    // 2. Savings Rate Score (0-100)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const savingsScore = Math.min(100, savingsRate * 5);

    // 3. Budget Adherence Score (0-100)
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
    const budgetAdherence = Math.max(0, 100 - Math.abs(expenseRatio - 70));

    // 4. Emergency Fund Score (0-100)
    const monthlyExpenses = totalExpenses;
    const emergencyFundMonths = monthlyExpenses > 0 ? totalSavings / monthlyExpenses : 0;
    const emergencyFund = Math.min(100, (emergencyFundMonths / 6) * 100);

    // 5. Financial Stability Score (0-100)
    const netWorth = totalSavings - totalDebt;
    const stabilityRatio = totalIncome > 0 ? (netWorth / (totalIncome * 12)) * 100 : 0;
    const financialStability = Math.max(0, Math.min(100, stabilityRatio + 50));

    // Overall Score (weighted average)
    const overall = Math.round(
      debtManagement * 0.25 +
        savingsScore * 0.2 +
        budgetAdherence * 0.2 +
        emergencyFund * 0.2 +
        financialStability * 0.15
    );

    // Grade calculation
    const grade: 'A' | 'B' | 'C' | 'D' | 'F' =
      overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F';

    return {
      overall,
      categories: {
        debtManagement: Math.round(debtManagement),
        savingsRate: Math.round(savingsScore),
        budgetAdherence: Math.round(budgetAdherence),
        emergencyFund: Math.round(emergencyFund),
        financialStability: Math.round(financialStability),
      },
      grade,
      trend: 'stable', // Would be calculated from historical data
    };
  }

  // Generate AI Recommendations
  generateRecommendations(
    profile: FinancialProfile,
    debts: DebtItem[],
    goals: FinancialGoal[],
    budgets: BudgetCategory[]
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // 1. High-Interest Debt Priority
    const highInterestDebts = debts.filter((d) => d.interestRate > 15);
    if (highInterestDebts.length > 0) {
      const totalHighInterest = highInterestDebts.reduce((sum, d) => sum + d.totalAmount, 0);
      recommendations.push({
        id: 'debt-high-interest',
        category: 'debt',
        priority: 'high',
        title: 'Prioritize High-Interest Debt',
        titleAr: 'أولوية سداد الديون عالية الفائدة',
        description: `You have ${highInterestDebts.length} high-interest debts totaling ${totalHighInterest.toLocaleString()} SAR. Focus on paying these first using the avalanche method.`,
        descriptionAr: `لديك ${highInterestDebts.length} ديون عالية الفائدة بإجمالي ${totalHighInterest.toLocaleString()} ريال. ركز على سدادها أولاً باستخدام طريقة الانهيار الجليدي.`,
        action: 'Increase payments on highest-interest debt',
        actionAr: 'زيادة المدفوعات على الديون ذات الفائدة الأعلى',
        potentialSavings: totalHighInterest * 0.15,
        timeToAchieve: '12-24 months',
        confidence: 95,
        reasoning:
          'High-interest debt costs you more money over time. Prioritizing it saves significant interest.',
        reasoningAr:
          'الديون عالية الفائدة تكلفك المزيد من المال بمرور الوقت. إعطاؤها الأولوية يوفر فوائد كبيرة.',
      });
    }

    // 2. Emergency Fund Recommendation
    const monthlyExpenses = profile.totalExpenses;
    const emergencyFundGoal = monthlyExpenses * 6;
    const emergencyFundGap = emergencyFundGoal - profile.totalSavings;

    if (emergencyFundGap > 0) {
      recommendations.push({
        id: 'emergency-fund',
        category: 'emergency',
        priority: profile.totalSavings < monthlyExpenses * 3 ? 'high' : 'medium',
        title: 'Build Emergency Fund',
        titleAr: 'بناء صندوق الطوارئ',
        description: `You need ${emergencyFundGap.toLocaleString()} SAR more to reach 6 months of expenses (${emergencyFundGoal.toLocaleString()} SAR).`,
        descriptionAr: `تحتاج ${emergencyFundGap.toLocaleString()} ريال إضافية للوصول إلى 6 أشهر من النفقات (${emergencyFundGoal.toLocaleString()} ريال).`,
        action: `Save ${Math.round(emergencyFundGap / 12).toLocaleString()} SAR monthly`,
        actionAr: `وفر ${Math.round(emergencyFundGap / 12).toLocaleString()} ريال شهرياً`,
        timeToAchieve: '12 months',
        confidence: 90,
        reasoning:
          'An emergency fund protects you from unexpected expenses without going into debt.',
        reasoningAr: 'صندوق الطوارئ يحميك من النفقات غير المتوقعة دون الحاجة للاستدانة.',
      });
    }

    // 3. Budget Optimization
    const totalBudget = budgets.reduce((sum, b) => sum + (b.allocated || 0), 0);
    const budgetUtilization = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);

    if (budgetUtilization > totalBudget * 0.9) {
      recommendations.push({
        id: 'budget-optimization',
        category: 'budget',
        priority: 'medium',
        title: 'Optimize Your Budget',
        titleAr: 'تحسين ميزانيتك',
        description: `You're using ${Math.round((budgetUtilization / totalBudget) * 100)}% of your budget. Review and adjust categories.`,
        descriptionAr: `تستخدم ${Math.round((budgetUtilization / totalBudget) * 100)}% من ميزانيتك. راجع الفئات وعدّلها.`,
        action: 'Review top spending categories',
        actionAr: 'راجع فئات الإنفاق الرئيسية',
        potentialSavings: totalBudget * 0.1,
        timeToAchieve: '1 month',
        confidence: 85,
        reasoning: 'Budget optimization helps identify unnecessary expenses and increase savings.',
        reasoningAr: 'تحسين الميزانية يساعد في تحديد النفقات غير الضرورية وزيادة المدخرات.',
      });
    }

    // 4. Debt Consolidation Opportunity
    if (debts.length >= 3) {
      const avgInterestRate = debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length;
      if (avgInterestRate > 10) {
        recommendations.push({
          id: 'debt-consolidation',
          category: 'debt',
          priority: 'medium',
          title: 'Consider Debt Consolidation',
          titleAr: 'فكر في دمج الديون',
          description: `With ${debts.length} debts at ${avgInterestRate.toFixed(1)}% average interest, consolidation could save you money.`,
          descriptionAr: `مع ${debts.length} ديون بمتوسط فائدة ${avgInterestRate.toFixed(1)}%، قد يوفر لك الدمج المال.`,
          action: 'Explore consolidation options',
          actionAr: 'استكشف خيارات الدمج',
          potentialSavings: profile.totalDebt * 0.05,
          timeToAchieve: '3-6 months',
          confidence: 75,
          reasoning:
            'Consolidating multiple debts into one lower-interest loan simplifies payments and reduces interest.',
          reasoningAr: 'دمج عدة ديون في قرض واحد بفائدة أقل يبسط المدفوعات ويقلل الفوائد.',
        });
      }
    }

    // 5. Savings Goals Progress
    const activeGoals = goals.filter((g) => g.status === 'in_progress');
    const behindScheduleGoals = activeGoals.filter((g) => {
      if (!g.startDate) return false;
      const progress = (g.currentAmount / g.targetAmount) * 100;
      const timeElapsed = Date.now() - g.startDate.getTime();
      const totalTime = g.targetDate.getTime() - g.startDate.getTime();
      const expectedProgress = (timeElapsed / totalTime) * 100;
      return progress < expectedProgress - 10;
    });

    if (behindScheduleGoals.length > 0) {
      recommendations.push({
        id: 'savings-acceleration',
        category: 'savings',
        priority: 'medium',
        title: 'Accelerate Savings Goals',
        titleAr: 'تسريع أهداف الادخار',
        description: `${behindScheduleGoals.length} of your goals are behind schedule. Consider increasing contributions.`,
        descriptionAr: `${behindScheduleGoals.length} من أهدافك متأخرة عن الجدول. فكر في زيادة المساهمات.`,
        action: 'Increase monthly contributions by 15%',
        actionAr: 'زيادة المساهمات الشهرية بنسبة 15%',
        timeToAchieve: 'Ongoing',
        confidence: 80,
        reasoning: 'Falling behind on goals requires increased effort to stay on track.',
        reasoningAr: 'التأخر عن الأهداف يتطلب جهداً إضافياً للبقاء على المسار.',
      });
    }

    // 6. Income Optimization
    if (profile.totalIncome > 0 && profile.totalExpenses / profile.totalIncome > 0.8) {
      recommendations.push({
        id: 'income-optimization',
        category: 'budget',
        priority: 'high',
        title: 'Increase Income or Reduce Expenses',
        titleAr: 'زيادة الدخل أو تقليل النفقات',
        description:
          'Your expenses are 80%+ of income. This leaves little room for savings or emergencies.',
        descriptionAr: 'نفقاتك 80%+ من الدخل. هذا لا يترك مجالاً كبيراً للادخار أو الطوارئ.',
        action: 'Explore side income or cut non-essential expenses',
        actionAr: 'استكشف دخل إضافي أو قلل النفقات غير الأساسية',
        potentialSavings: profile.totalIncome * 0.2,
        timeToAchieve: '3-6 months',
        confidence: 85,
        reasoning:
          'A healthy financial situation requires income significantly higher than expenses.',
        reasoningAr: 'الوضع المالي الصحي يتطلب دخلاً أعلى بكثير من النفقات.',
      });
    }

    // Sort by priority (high > medium > low) and confidence
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.confidence - a.confidence;
    });
  }

  // Smart Goal Suggestions
  suggestFinancialGoals(profile: FinancialProfile): Partial<FinancialGoal>[] {
    const suggestions: Partial<FinancialGoal>[] = [];
    const monthlyIncome = profile.totalIncome;
    const monthlyExpenses = profile.totalExpenses;
    const monthlySurplus = monthlyIncome - monthlyExpenses;

    // Emergency Fund Goal
    if (profile.totalSavings < monthlyExpenses * 6) {
      suggestions.push({
        name: 'Emergency Fund - 6 Months',
        nameAr: 'صندوق الطوارئ - 6 أشهر',
        targetAmount: monthlyExpenses * 6,
        currentAmount: profile.totalSavings,
        category: 'emergency',
        priority: 'high',
        description: 'Build a safety net for unexpected expenses',
        // descriptionAr: 'بناء شبكة أمان للنفقات غير المتوقعة',
      });
    }

    // Debt Freedom Goal
    if (profile.totalDebt > 0) {
      suggestions.push({
        name: 'Debt Freedom',
        nameAr: 'التحرر من الديون',
        targetAmount: profile.totalDebt,
        currentAmount: 0,
        category: 'debt_payoff',
        priority: 'high',
        description: 'Become completely debt-free',
        // descriptionAr: 'التحرر الكامل من الديون',
      });
    }

    // Retirement Savings (10% of annual income)
    const retirementGoal = monthlyIncome * 12 * 0.1;
    suggestions.push({
      name: 'Retirement Savings - Year 1',
      nameAr: 'مدخرات التقاعد - السنة الأولى',
      targetAmount: retirementGoal,
      currentAmount: 0,
      category: 'retirement',
      priority: 'medium',
      description: 'Start building retirement savings (10% of annual income)',
      // descriptionAr: 'بدء بناء مدخرات التقاعد (10% من الدخل السنوي)',
    });

    // Home Down Payment (if surplus allows)
    if (monthlySurplus > 2000) {
      suggestions.push({
        name: 'Home Down Payment',
        nameAr: 'مقدم شراء منزل',
        targetAmount: 100000,
        currentAmount: 0,
        category: 'home',
        priority: 'low',
        description: 'Save for a home down payment',
        // descriptionAr: 'الادخار لمقدم شراء منزل',
      });
    }

    return suggestions;
  }

  // Personalized Insights
  generateInsights(
    profile: FinancialProfile,
    healthScore: FinancialHealthScore
  ): { text: string; textAr: string; type: 'success' | 'warning' | 'info' }[] {
    const insights: { text: string; textAr: string; type: 'success' | 'warning' | 'info' }[] = [];

    // Overall Health Insight
    if (healthScore.overall >= 80) {
      insights.push({
        text: `Excellent financial health! You're in the top 20% of users.`,
        textAr: `صحة مالية ممتازة! أنت ضمن أفضل 20% من المستخدمين.`,
        type: 'success',
      });
    } else if (healthScore.overall >= 60) {
      insights.push({
        text: `Good financial health, but there's room for improvement.`,
        textAr: `صحة مالية جيدة، لكن هناك مجال للتحسين.`,
        type: 'info',
      });
    } else {
      insights.push({
        text: `Your financial health needs attention. Follow our recommendations.`,
        textAr: `صحتك المالية تحتاج اهتماماً. اتبع توصياتنا.`,
        type: 'warning',
      });
    }

    // Debt-to-Income Ratio
    const debtToIncome =
      profile.totalIncome > 0 ? (profile.monthlyDebtPayment / profile.totalIncome) * 100 : 0;
    if (debtToIncome > 40) {
      insights.push({
        text: `Your debt payments are ${debtToIncome.toFixed(1)}% of income. Aim for under 36%.`,
        textAr: `مدفوعات ديونك ${debtToIncome.toFixed(1)}% من الدخل. اهدف لأقل من 36%.`,
        type: 'warning',
      });
    } else if (debtToIncome > 0) {
      insights.push({
        text: `Your debt-to-income ratio (${debtToIncome.toFixed(1)}%) is healthy.`,
        textAr: `نسبة الدين للدخل (${debtToIncome.toFixed(1)}%) صحية.`,
        type: 'success',
      });
    }

    // Savings Rate
    const savingsRate =
      profile.totalIncome > 0
        ? ((profile.totalIncome - profile.totalExpenses) / profile.totalIncome) * 100
        : 0;
    if (savingsRate >= 20) {
      insights.push({
        text: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`,
        textAr: `عمل رائع! تدخر ${savingsRate.toFixed(1)}% من دخلك.`,
        type: 'success',
      });
    } else if (savingsRate >= 10) {
      insights.push({
        text: `You're saving ${savingsRate.toFixed(1)}%. Try to increase to 20% for faster goals.`,
        textAr: `تدخر ${savingsRate.toFixed(1)}%. حاول الزيادة إلى 20% لأهداف أسرع.`,
        type: 'info',
      });
    } else if (savingsRate > 0) {
      insights.push({
        text: `Your savings rate (${savingsRate.toFixed(1)}%) is low. Aim for at least 10%.`,
        textAr: `معدل ادخارك (${savingsRate.toFixed(1)}%) منخفض. اهدف لـ 10% على الأقل.`,
        type: 'warning',
      });
    } else {
      insights.push({
        text: `You're not saving any money. This is risky - start with 5% of income.`,
        textAr: `لا تدخر أي أموال. هذا خطر - ابدأ بـ 5% من الدخل.`,
        type: 'warning',
      });
    }

    return insights;
  }
}

// Export singleton instance
export const aiAdvisor = new AIFinancialAdvisor();

// Helper functions
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'yellow';
  return 'red';
}

export function getHealthScoreLabel(score: number): { en: string; ar: string } {
  if (score >= 90) return { en: 'Excellent', ar: 'ممتاز' };
  if (score >= 80) return { en: 'Very Good', ar: 'جيد جداً' };
  if (score >= 70) return { en: 'Good', ar: 'جيد' };
  if (score >= 60) return { en: 'Fair', ar: 'مقبول' };
  if (score >= 40) return { en: 'Poor', ar: 'ضعيف' };
  return { en: 'Critical', ar: 'حرج' };
}
