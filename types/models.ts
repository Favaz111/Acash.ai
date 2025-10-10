/**
 * تعريفات الأنواع (Types) الرئيسية للتطبيق
 * جميع الـ interfaces والأنواع المشتركة في مكان واحد
 */

// ==================== User & Auth ====================

export interface IUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  city?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Assessment ====================

export type MaritalStatus = 'أعزب' | 'متزوج' | 'مطلق' | 'أرمل';

export interface IPersonalInfo {
  age?: number;
  maritalStatus?: MaritalStatus;
  dependents?: number;
}

export interface IFinancialStatus {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  totalSavings?: number;
  totalDebts?: number;
}

export type FinancialGoal = 'emergency' | 'debt' | 'house' | 'car' | 'education' | 'investment';

export interface IFinancialGoals {
  goals?: FinancialGoal[];
  targetAmount?: number;
  timeframe?: number;
}

export interface IAssessmentResults {
  healthScore: number;
  recommendations: string[];
  actionPlan: IActionItem[];
  calculatedAt: Date;
}

export interface IActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'savings' | 'debt' | 'investment' | 'emergency';
  completed: boolean;
}

export interface IAssessment {
  id: string;
  userId: string;
  personalInfo: IPersonalInfo;
  financialStatus: IFinancialStatus;
  financialGoals: IFinancialGoals;
  results?: IAssessmentResults;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Financial Tools ====================

export interface IDebtCalculation {
  totalDebt: number;
  interestRate: number;
  monthlyPayment: number;
  months: number;
  years: number;
  remainingMonths: number;
  totalPaid: number;
  totalInterest: number;
}

export interface ISavingsCalculation {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  interestRate: number;
  months: number;
  totalContributed: number;
  totalInterestEarned: number;
}

export interface IInvestmentCalculation {
  principal: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  futureValue: number;
  totalContributed: number;
  totalGain: number;
}

// ==================== UI State ====================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface IApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface INotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: Date;
}

// ==================== Constants ====================

export const MARITAL_STATUS_OPTIONS: MaritalStatus[] = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

export const FINANCIAL_GOAL_OPTIONS: Array<{
  id: FinancialGoal;
  label: string;
}> = [
  { id: 'emergency', label: 'بناء صندوق طوارئ' },
  { id: 'debt', label: 'سداد الديون' },
  { id: 'house', label: 'شراء منزل' },
  { id: 'car', label: 'شراء سيارة' },
  { id: 'education', label: 'التعليم' },
  { id: 'investment', label: 'بدء الاستثمار' },
];
