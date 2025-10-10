'use client';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import PersonalInfoStep from '@/components/assessment/PersonalInfoStep';
import FinancialStatusStep from '@/components/assessment/FinancialStatusStep';
import FinancialGoalsStep from '@/components/assessment/FinancialGoalsStep';
import ResultsStep from '@/components/assessment/ResultsStep';

const steps = [
  { id: 0, title: 'المعلومات الشخصية', component: PersonalInfoStep },
  { id: 1, title: 'الوضع المالي', component: FinancialStatusStep },
  { id: 2, title: 'الأهداف المالية', component: FinancialGoalsStep },
  { id: 3, title: 'النتائج والتوصيات', component: ResultsStep },
];

export default function AssessmentPage() {
  const { currentStep, setCurrentStep } = useAssessmentStore();
  const CurrentStepComponent = steps[currentStep]?.component || (() => <div>Loading...</div>);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.slice(0, -1).map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'gradient-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      currentStep >= step.id ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.id ? 'gradient-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep]?.title}</CardTitle>
            {currentStep < 3 && (
              <CardDescription>
                {currentStep === 0 && 'أخبرنا عن نفسك لنتمكن من تقديم توصيات مخصصة'}
                {currentStep === 1 && 'دعنا نفهم وضعك المالي الحالي'}
                {currentStep === 2 && 'ما هي أهدافك المالية؟'}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <CurrentStepComponent />

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                  <ArrowRight className="w-4 h-4 ml-2" />
                  السابق
                </Button>

                <Button onClick={handleNext}>
                  {currentStep === steps.length - 2 ? 'عرض النتائج' : 'التالي'}
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
