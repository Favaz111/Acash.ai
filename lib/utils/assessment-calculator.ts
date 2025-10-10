/**
 * حسابات التشخيص المالي
 */

import {
  HEALTH_SCORE_LEVELS,
  DEBT_TO_INCOME_RATIOS,
  EMERGENCY_FUND_CRITERIA,
  IDEAL_BUDGET_RATIOS,
} from '@/lib/constants/assessment';

export interface QuickAssessmentData {
  monthlyIncome: number;
  fixedObligationsPercentage: number;
  hasClearGoals: boolean;
  savingHabits: 'none' | 'irregular' | 'regular' | 'percentage';
  financialKnowledge: 'beginner' | 'intermediate' | 'advanced';
}

export interface AdvancedAssessmentData extends QuickAssessmentData {
  monthlyExpenses: number;
  totalSavings: number;
  totalDebts: number;
  age: number;
  dependents: number;
  hasEmergencyFund: boolean;
  emergencyFundMonths: number;
  investmentExperience: 'none' | 'beginner' | 'intermediate' | 'advanced';
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface HealthScoreResult {
  score: number;
  level: keyof typeof HEALTH_SCORE_LEVELS;
  label: string;
  color: string;
  icon: string;
  description: string;
  recommendations: string[];
}

/**
 * حساب درجة الصحة المالية السريعة (من 100)
 */
export function calculateQuickHealthScore(data: QuickAssessmentData): HealthScoreResult {
  let score = 0;

  // 1. الدخل والالتزامات (40 نقطة)
  const obligationsScore = calculateObligationsScore(data.fixedObligationsPercentage);
  score += obligationsScore;

  // 2. عادات الادخار (30 نقطة)
  const savingsScore = calculateSavingsHabitsScore(data.savingHabits);
  score += savingsScore;

  // 3. التخطيط (15 نقطة)
  score += data.hasClearGoals ? 15 : 0;

  // 4. المعرفة المالية (15 نقطة)
  const knowledgeScore = calculateKnowledgeScore(data.financialKnowledge);
  score += knowledgeScore;

  const level = getHealthScoreLevel(score);
  const recommendations = generateQuickRecommendations(data, score);

  return {
    score: Math.round(score),
    level,
    ...HEALTH_SCORE_LEVELS[level],
    recommendations,
  };
}

/**
 * حساب درجة الصحة المالية المتقدمة (من 100)
 */
export function calculateAdvancedHealthScore(data: AdvancedAssessmentData): HealthScoreResult {
  let score = 0;

  // 1. نسبة الدين للدخل (25 نقطة)
  const debtRatio = data.totalDebts / (data.monthlyIncome * 12);
  score += calculateDebtScore(debtRatio);

  // 2. صندوق الطوارئ (20 نقطة)
  score += calculateEmergencyFundScore(data);

  // 3. معدل الادخار (20 نقطة)
  const savingsRate = (data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome;
  score += calculateSavingsRateScore(savingsRate);

  // 4. نسبة الثروة الصافية (15 نقطة)
  const netWorth = data.totalSavings - data.totalDebts;
  score += calculateNetWorthScore(netWorth, data.monthlyIncome);

  // 5. التنوع المالي (10 نقطة)
  score += calculateDiversificationScore(data);

  // 6. المعرفة والخبرة (10 نقطة)
  score += calculateKnowledgeScore(data.financialKnowledge);

  const level = getHealthScoreLevel(score);
  const recommendations = generateAdvancedRecommendations(data, score);

  return {
    score: Math.round(score),
    level,
    ...HEALTH_SCORE_LEVELS[level],
    recommendations,
  };
}

/**
 * حساب نقاط الالتزامات الثابتة
 */
function calculateObligationsScore(percentage: number): number {
  if (percentage <= 30) return 40;
  if (percentage <= 40) return 30;
  if (percentage <= 50) return 20;
  if (percentage <= 60) return 10;
  return 0;
}

/**
 * حساب نقاط عادات الادخار
 */
function calculateSavingsHabitsScore(habits: QuickAssessmentData['savingHabits']): number {
  const scores = {
    none: 0,
    irregular: 10,
    regular: 20,
    percentage: 30,
  };
  return scores[habits];
}

/**
 * حساب نقاط المعرفة المالية
 */
function calculateKnowledgeScore(knowledge: string): number {
  const scores = {
    beginner: 5,
    intermediate: 10,
    advanced: 15,
  };
  return scores[knowledge as keyof typeof scores] || 0;
}

/**
 * حساب نقاط الديون
 */
function calculateDebtScore(debtRatio: number): number {
  if (debtRatio <= DEBT_TO_INCOME_RATIOS.EXCELLENT) return 25;
  if (debtRatio <= DEBT_TO_INCOME_RATIOS.GOOD) return 20;
  if (debtRatio <= DEBT_TO_INCOME_RATIOS.ACCEPTABLE) return 15;
  if (debtRatio <= DEBT_TO_INCOME_RATIOS.WARNING) return 10;
  return 5;
}

/**
 * حساب نقاط صندوق الطوارئ
 */
function calculateEmergencyFundScore(data: AdvancedAssessmentData): number {
  if (!data.hasEmergencyFund) return 0;

  const months = data.emergencyFundMonths;
  if (months >= EMERGENCY_FUND_CRITERIA.IDEAL_MONTHS) return 20;
  if (months >= EMERGENCY_FUND_CRITERIA.MIN_MONTHS) return 15;
  if (months >= 1) return 10;
  return 0;
}

/**
 * حساب نقاط معدل الادخار
 */
function calculateSavingsRateScore(savingsRate: number): number {
  if (savingsRate >= 0.3) return 20; // 30%+
  if (savingsRate >= 0.2) return 15; // 20-30%
  if (savingsRate >= 0.1) return 10; // 10-20%
  if (savingsRate >= 0.05) return 5; // 5-10%
  return 0;
}

/**
 * حساب نقاط صافي الثروة
 */
function calculateNetWorthScore(netWorth: number, monthlyIncome: number): number {
  const netWorthMonths = netWorth / monthlyIncome;

  if (netWorthMonths >= 24) return 15; // سنتان+
  if (netWorthMonths >= 12) return 12; // سنة
  if (netWorthMonths >= 6) return 9; // 6 أشهر
  if (netWorthMonths >= 3) return 6; // 3 أشهر
  if (netWorthMonths >= 0) return 3; // إيجابي
  return 0; // سلبي
}

/**
 * حساب نقاط التنوع المالي
 */
function calculateDiversificationScore(data: AdvancedAssessmentData): number {
  let score = 0;

  // لديه مدخرات
  if (data.totalSavings > 0) score += 3;

  // لديه صندوق طوارئ
  if (data.hasEmergencyFund) score += 3;

  // لديه خبرة استثمارية
  if (data.investmentExperience !== 'none') score += 4;

  return score;
}

/**
 * تحديد مستوى الصحة المالية
 */
function getHealthScoreLevel(score: number): keyof typeof HEALTH_SCORE_LEVELS {
  if (score >= HEALTH_SCORE_LEVELS.EXCELLENT.min) return 'EXCELLENT';
  if (score >= HEALTH_SCORE_LEVELS.GOOD.min) return 'GOOD';
  if (score >= HEALTH_SCORE_LEVELS.NEEDS_IMPROVEMENT.min) return 'NEEDS_IMPROVEMENT';
  return 'AT_RISK';
}

/**
 * توليد التوصيات السريعة
 */
function generateQuickRecommendations(data: QuickAssessmentData, score: number): string[] {
  const recommendations: string[] = [];

  // توصيات الالتزامات
  if (data.fixedObligationsPercentage > 50) {
    recommendations.push('قلل التزاماتك الثابتة - تتجاوز 50% من دخلك');
  }

  // توصيات الادخار
  if (data.savingHabits === 'none' || data.savingHabits === 'irregular') {
    recommendations.push('ابدأ بادخار نسبة ثابتة من دخلك (على الأقل 10%)');
  }

  // توصيات التخطيط
  if (!data.hasClearGoals) {
    recommendations.push('حدد أهدافك المالية بوضوح لتتمكن من التخطيط لها');
  }

  // التوصية بالتشخيص المتقدم
  recommendations.push('أكمل التشخيص المتقدم للحصول على خطة عمل مفصلة');

  return recommendations.slice(0, 3); // أول 3 توصيات
}

/**
 * توليد التوصيات المتقدمة
 */
function generateAdvancedRecommendations(data: AdvancedAssessmentData, score: number): string[] {
  const recommendations: string[] = [];

  // 1. أولوية الديون
  const debtRatio = data.totalDebts / (data.monthlyIncome * 12);
  if (debtRatio > DEBT_TO_INCOME_RATIOS.ACCEPTABLE) {
    recommendations.push({
      priority: 'high',
      text: 'استخدم أداة إدارة الديون لوضع خطة سداد فعالة',
      tool: 'debt-management',
    });
  }

  // 2. أولوية صندوق الطوارئ
  if (!data.hasEmergencyFund || data.emergencyFundMonths < EMERGENCY_FUND_CRITERIA.MIN_MONTHS) {
    recommendations.push({
      priority: 'high',
      text: `ابني صندوق طوارئ يكفي ${EMERGENCY_FUND_CRITERIA.MIN_MONTHS} أشهر على الأقل`,
      tool: 'emergency-fund',
    });
  }

  // 3. تحسين الميزانية
  const savingsRate = (data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome;
  if (savingsRate < IDEAL_BUDGET_RATIOS.SAVINGS) {
    recommendations.push({
      priority: 'medium',
      text: 'راجع ميزانيتك لزيادة معدل الادخار إلى 20%',
      tool: 'smart-budget',
    });
  }

  // 4. بناء الثروة
  if (data.investmentExperience === 'none' && data.totalSavings > data.monthlyIncome * 6) {
    recommendations.push({
      priority: 'medium',
      text: 'ابدأ رحلة الاستثمار لتنمية ثروتك',
      tool: 'investment-planner',
    });
  }

  // 5. التخطيط للحرية المالية
  if (score >= HEALTH_SCORE_LEVELS.GOOD.min) {
    recommendations.push({
      priority: 'low',
      text: 'خطط للحرية المالية والاستقلال',
      tool: 'financial-freedom',
    });
  }

  return recommendations as any;
}

/**
 * حساب مقاييس إضافية
 */
export function calculateFinancialMetrics(data: AdvancedAssessmentData) {
  const monthlyIncome = data.monthlyIncome;
  const monthlyExpenses = data.monthlyExpenses;
  const totalSavings = data.totalSavings;
  const totalDebts = data.totalDebts;

  return {
    // النسب المالية
    debtToIncome: totalDebts / (monthlyIncome * 12),
    savingsRate: (monthlyIncome - monthlyExpenses) / monthlyIncome,
    expenseRatio: monthlyExpenses / monthlyIncome,

    // القيم المالية
    netIncome: monthlyIncome - monthlyExpenses,
    netWorth: totalSavings - totalDebts,

    // الأهداف
    emergencyFundTarget: monthlyExpenses * EMERGENCY_FUND_CRITERIA.IDEAL_MONTHS,
    emergencyFundCurrent: data.hasEmergencyFund ? data.emergencyFundMonths * monthlyExpenses : 0,
    emergencyFundProgress: data.hasEmergencyFund
      ? (data.emergencyFundMonths / EMERGENCY_FUND_CRITERIA.IDEAL_MONTHS) * 100
      : 0,
  };
}
