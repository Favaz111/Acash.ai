'use client';

import { Input } from '@/components/ui/input';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function PersonalInfoStep() {
  const { assessmentData, updatePersonalInfo } = useAssessmentStore();
  const { personalInfo } = assessmentData;

  return (
    <div className="space-y-6">
      <Input
        label="العمر"
        type="number"
        placeholder="25"
        value={personalInfo.age || ''}
        onChange={(e) => updatePersonalInfo({ age: parseInt(e.target.value) })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">الحالة الاجتماعية</label>
        <div className="grid grid-cols-2 gap-4">
          {['أعزب', 'متزوج', 'مطلق', 'أرمل'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => updatePersonalInfo({ maritalStatus: status })}
              className={`p-4 rounded-lg border-2 transition-all ${
                personalInfo.maritalStatus === status
                  ? 'border-primary bg-blue-50 text-primary font-semibold'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="عدد الأشخاص المعالين"
        type="number"
        placeholder="0"
        value={personalInfo.dependents || ''}
        onChange={(e) => updatePersonalInfo({ dependents: parseInt(e.target.value) })}
        helperText="عدد الأشخاص الذين تعيلهم مالياً"
      />
    </div>
  );
}
