import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HealthScoreResult } from '@/lib/utils/assessment-calculator';

export interface AssessmentData {
  // المعلومات الشخصية
  personalInfo: {
    age?: number;
    maritalStatus?: string;
    dependents?: number;
  };

  // الوضع المالي
  financialStatus: {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    totalSavings?: number;
    totalDebts?: number;
  };

  // الأهداف المالية
  financialGoals: {
    goals?: string[];
    targetAmount?: number;
    timeframe?: number;
  };

  // النتائج
  results?: {
    healthScore: number;
    recommendations: string[];
    actionPlan: any[];
  };
}

interface AssessmentState {
  assessmentData: AssessmentData;
  currentStep: number;
  assessmentPhase: 'quick' | 'advanced' | null;
  quickAssessmentResult: HealthScoreResult | null;
  advancedAssessmentResult: HealthScoreResult | null;
  updatePersonalInfo: (info: Partial<AssessmentData['personalInfo']>) => void;
  updateFinancialStatus: (status: Partial<AssessmentData['financialStatus']>) => void;
  updateFinancialGoals: (goals: Partial<AssessmentData['financialGoals']>) => void;
  setResults: (results: AssessmentData['results']) => void;
  setCurrentStep: (step: number) => void;
  setAssessmentPhase: (phase: 'quick' | 'advanced') => void;
  setQuickAssessmentResult: (result: HealthScoreResult) => void;
  setAdvancedAssessmentResult: (result: HealthScoreResult) => void;
  resetAssessment: () => void;
}

const initialState: AssessmentData = {
  personalInfo: {},
  financialStatus: {},
  financialGoals: {},
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      assessmentData: initialState,
      currentStep: 0,
      assessmentPhase: null,
      quickAssessmentResult: null,
      advancedAssessmentResult: null,

      updatePersonalInfo: (info) =>
        set((state) => ({
          assessmentData: {
            ...state.assessmentData,
            personalInfo: { ...state.assessmentData.personalInfo, ...info },
          },
        })),

      updateFinancialStatus: (status) =>
        set((state) => ({
          assessmentData: {
            ...state.assessmentData,
            financialStatus: { ...state.assessmentData.financialStatus, ...status },
          },
        })),

      updateFinancialGoals: (goals) =>
        set((state) => ({
          assessmentData: {
            ...state.assessmentData,
            financialGoals: { ...state.assessmentData.financialGoals, ...goals },
          },
        })),

      setResults: (results) =>
        set((state) => ({
          assessmentData: {
            ...state.assessmentData,
            results: results || undefined,
          },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setAssessmentPhase: (phase) => set({ assessmentPhase: phase }),

      setQuickAssessmentResult: (result) => set({ quickAssessmentResult: result }),

      setAdvancedAssessmentResult: (result) => set({ advancedAssessmentResult: result }),

      resetAssessment: () =>
        set({
          assessmentData: initialState,
          currentStep: 0,
          assessmentPhase: null,
          quickAssessmentResult: null,
          advancedAssessmentResult: null,
        }),
    }),
    {
      name: 'acash-assessment-storage',
    }
  )
);
