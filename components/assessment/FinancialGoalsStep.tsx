'use client';

import { Input } from '@/components/ui/input';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { Home, Car, GraduationCap, PiggyBank, Building, TrendingUp } from 'lucide-react';

const goalOptions = [
  { id: 'emergency', label: 'بناء صندوق طوارئ', icon: PiggyBank },
  { id: 'debt', label: 'سداد الديون', icon: TrendingUp },
  { id: 'house', label: 'شراء منزل', icon: Home },
  { id: 'car', label: 'شراء سيارة', icon: Car },
  { id: 'education', label: 'التعليم', icon: GraduationCap },
  { id: 'investment', label: 'بدء الاستثمار', icon: Building },
];

export default function FinancialGoalsStep() {
  const { assessmentData, updateFinancialGoals } = useAssessmentStore();
  const { financialGoals } = assessmentData;

  const toggleGoal = (goalId: string) => {
    const currentGoals = financialGoals.goals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((g) => g !== goalId)
      : [...currentGoals, goalId];
    updateFinancialGoals({ goals: newGoals });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          اختر أهدافك المالية (يمكنك اختيار أكثر من هدف)
        </label>
        <div className="grid grid-cols-2 gap-4">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = financialGoals.goals?.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all text-right ${
                  isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                <p
                  className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}
                >
                  {goal.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label="المبلغ المستهدف (ريال)"
        type="number"
        placeholder="100000"
        value={financialGoals.targetAmount || ''}
        onChange={(e) => updateFinancialGoals({ targetAmount: parseFloat(e.target.value) })}
        helperText="كم تحتاج لتحقيق أهدافك؟"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">الإطار الزمني</label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { value: 1, label: 'سنة' },
            { value: 3, label: '3 سنوات' },
            { value: 5, label: '5 سنوات' },
            { value: 10, label: '10+ سنوات' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFinancialGoals({ timeframe: option.value })}
              className={`p-3 rounded-lg border-2 transition-all ${
                financialGoals.timeframe === option.value
                  ? 'border-primary bg-blue-50 text-primary font-semibold'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
