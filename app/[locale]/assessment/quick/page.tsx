'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QUICK_ASSESSMENT_QUESTIONS } from '@/lib/constants/assessment';
import { calculateQuickHealthScore, QuickAssessmentData } from '@/lib/utils/assessment-calculator';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveAssessmentResult } from '@/lib/firebase/db';

export default function QuickAssessmentPage() {
  const router = useRouter();
  const { setQuickAssessmentResult } = useAssessmentStore();
  const { user } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuickAssessmentData>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof calculateQuickHealthScore> | null>(null);

  const question = QUICK_ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUICK_ASSESSMENT_QUESTIONS.length) * 100;

  const handleAnswer = async (value: any) => {
    const updatedAnswers = { ...answers };

    switch (question?.id) {
      case 'monthly_income':
        updatedAnswers.monthlyIncome = parseFloat(value);
        break;
      case 'fixed_obligations':
        updatedAnswers.fixedObligationsPercentage = parseFloat(value);
        break;
      case 'has_clear_goals':
        updatedAnswers.hasClearGoals = value === 'yes';
        break;
      case 'saving_habits':
        updatedAnswers.savingHabits = value;
        break;
      case 'financial_knowledge':
        updatedAnswers.financialKnowledge = value;
        break;
    }

    setAnswers(updatedAnswers);

    // الانتقال للسؤال التالي أو عرض النتائج
    if (currentQuestion < QUICK_ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      // حساب النتائج
      const score = calculateQuickHealthScore(updatedAnswers as QuickAssessmentData);
      setResults(score);
      setQuickAssessmentResult(score);
      setShowResults(true);

      // حفظ في Firestore إذا كان المستخدم مسجلاً
      if (user?.uid) {
        try {
          await saveAssessmentResult(user.uid, {
            type: 'quick',
            answers: updatedAnswers as Record<string, unknown>,
            scores: {
              overall: score.score,
              income: (score as any).breakdown?.income || 0,
              expenses: (score as any).breakdown?.expenses || 0,
              savings: (score as any).breakdown?.savings || 0,
              debts: (score as any).breakdown?.debts || 0,
              goals: (score as any).breakdown?.goals || 0,
            },
            recommendations: score.recommendations,
          });
        } catch (error) {
          console.error('Failed to save assessment:', error);
        }
      }
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl bg-${results.color}-50 border-4 border-${results.color}-500`}
                >
                  {results.icon}
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">درجة صحتك المالية</CardTitle>
              <div className="text-6xl font-bold my-4" style={{ color: results.color }}>
                {results.score}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div
                className={`inline-block px-6 py-2 rounded-full bg-${results.color}-100 text-${results.color}-800 font-semibold text-lg`}
              >
                {results.label}
              </div>
              <CardDescription className="text-base mt-4">{results.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* التوصيات السريعة */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  التوصيات الفورية
                </h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* دعوة للتشخيص المتقدم */}
              <div className="bg-gradient-to-r from-primary-trust to-primary-innovation p-6 rounded-xl text-white text-center">
                <h3 className="font-bold text-xl mb-2">هل تريد تحليل أعمق؟</h3>
                <p className="mb-4 opacity-90">أكمل التشخيص المتقدم للحصول على:</p>
                <ul className="text-right space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <span>تقرير مفصل 10 صفحات PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    <span>خطة عمل مخصصة 6 أشهر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">🛠️</span>
                    <span>توصيات أدوات ذكية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <span>مقارنة مع أقرانك</span>
                  </li>
                </ul>
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => router.push('/assessment/advanced')}
                >
                  ابدأ التشخيص المتقدم (10 دقائق)
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>

              {/* أو الذهاب للوحة التحكم */}
              <div className="text-center">
                <Button variant="outline" size="lg" onClick={() => router.push('/dashboard')}>
                  الذهاب إلى لوحة التحكم
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
            Acash.ai
          </span>
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              السؤال {currentQuestion + 1} من {QUICK_ASSESSMENT_QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-2 animate-fade-in">
          <CardHeader>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">{question?.icon}</div>
              <CardTitle className="text-2xl">{question?.question}</CardTitle>
              {(question as any)?.helperText && (
                <CardDescription className="mt-2">{(question as any).helperText}</CardDescription>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Number Input */}
            {question?.type === 'number' && (
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="أدخل المبلغ"
                  className="text-center text-2xl h-16"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleAnswer(e.currentTarget.value);
                    }
                  }}
                />
                <Button
                  className="w-full"
                  size="lg"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) handleAnswer(input.value);
                  }}
                >
                  التالي
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            )}

            {/* Percentage Input */}
            {question && question.type === 'percentage' && (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="text-center text-2xl h-16 pr-12"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAnswer(e.currentTarget.value);
                      }
                    }}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
                    %
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling?.querySelector(
                      'input'
                    ) as HTMLInputElement;
                    if (input.value) handleAnswer(input.value);
                  }}
                >
                  التالي
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            )}

            {/* Boolean (Yes/No) */}
            {question && question.type === 'boolean' && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-lg font-semibold"
                >
                  نعم ✓
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className="p-6 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-lg font-semibold"
                >
                  لا ✗
                </button>
              </div>
            )}

            {/* Select Options */}
            {question &&
              question.type === 'select' &&
              'options' in question &&
              question.options && (
                <div className="space-y-3">
                  {question.options.map((option: { value: string; label: string }) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-right"
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
