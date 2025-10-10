'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { Target, AlertCircle, MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { HEALTH_SCORE_LEVELS } from '@/lib/constants/assessment';
import { getAuthInstance } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getLatestAssessment, getDebts, getGoals, type AssessmentResult } from '@/lib/firebase/db';
import { SkeletonDashboardCard, SkeletonCard, SkeletonStatsGrid } from '@/components/ui/skeleton';
import { HealthScoreWidget } from '@/components/dashboard/HealthScoreWidget';
import { FinancialOverviewWidget } from '@/components/dashboard/FinancialOverviewWidget';
import { RecommendationsWidget } from '@/components/dashboard/RecommendationsWidget';
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget';
import { DebtProgressChart, GoalsProgressChart } from '@/components/dashboard/FinancialChart';
import { showError } from '@/components/ui/toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
// Phase One: Subscription removed

// Types for UI state
interface DashboardData {
  assessment: AssessmentResult | null;
  debts: any[];
  goals: any[];
}

function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    assessment: null,
    debts: [],
    goals: [],
  });
  const [isPremium, setIsPremium] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication & Data Fetching
  useEffect(() => {
    if (!mounted) return undefined;

    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
        setLoading(false);
        return;
      }

      try {
        // Fetch all dashboard data in parallel with individual error handling (Phase One: Free tier only)
        const [assessmentResult, debtsResult, goalsResult] = await Promise.allSettled([
          getLatestAssessment(currentUser.uid),
          getDebts(currentUser.uid),
          getGoals(currentUser.uid),
        ]);

        setDashboardData({
          assessment: assessmentResult.status === 'fulfilled' ? assessmentResult.value : null,
          debts: debtsResult.status === 'fulfilled' ? debtsResult.value : [],
          goals: goalsResult.status === 'fulfilled' ? goalsResult.value : [],
        });

        // Phase One: All users are free tier
        setIsPremium(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('حدث خطأ في تحميل البيانات');
        showError('فشل تحميل بيانات لوحة التحكم');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, mounted]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonDashboardCard />
              <SkeletonStatsGrid />
              <SkeletonCard />
            </div>
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              حدث خطأ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { assessment, debts, goals } = dashboardData;

  // Empty State - No Assessment
  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <main className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="mb-8">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">مرحباً بك في لوحة التحكم</h1>
            <p className="text-lg text-gray-600 mb-8">
              ابدأ رحلتك المالية بإجراء التشخيص السريع أولاً
            </p>
            <Button size="lg" asChild>
              <Link href="/assessment/quick">
                ابدأ التشخيص السريع (دقيقتان)
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Extract financial data from assessment
  const financialData = {
    monthlyIncome: (assessment.answers as any)?.monthlyIncome || 0,
    monthlyExpenses: (assessment.answers as any)?.monthlyExpenses || 0,
    totalSavings: (assessment.answers as any)?.totalSavings || 0,
    totalDebts: debts.reduce((total, debt) => total + debt.currentBalance, 0),
  };

  // Prepare active goals data
  const activeGoals = goals
    .filter((goal) => goal.status === 'in_progress')
    .slice(0, 3)
    .map((goal) => ({
      id: goal.id,
      name: goal.name,
      target: goal.targetAmount,
      current: goal.currentAmount,
      icon: goal.icon || '🎯',
    }));

  // Calculate health score and level
  const healthScore = assessment.scores.overall;
  const getScoreLevel = (score: number) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    if (score >= 40) return 'NEEDS_IMPROVEMENT';
    return 'AT_RISK';
  };
  const scoreLevel = getScoreLevel(healthScore);
  const levelConfig = HEALTH_SCORE_LEVELS[scoreLevel as keyof typeof HEALTH_SCORE_LEVELS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">نظرة شاملة على وضعك المالي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column - Main Widgets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Score Widget */}
            <HealthScoreWidget
              score={healthScore}
              label="درجة الصحة المالية"
              color={levelConfig.color}
              icon={levelConfig.icon}
            />

            {/* Financial Overview Widget */}
            <FinancialOverviewWidget data={financialData} />

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>🎯 الأهداف النشطة</span>
                    <Link href="/tools" className="text-sm text-primary-trust hover:underline">
                      إدارة الأهداف
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeGoals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    return (
                      <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm flex items-center gap-1">
                            <span>{goal.icon}</span>
                            <span>{goal.name}</span>
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {formatCurrency(goal.current)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatCurrency(goal.target)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة هدف جديد
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Debts Summary */}
            {debts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>💳 ملخص الديون</span>
                    <Link href="/tools/debt" className="text-sm text-primary-trust hover:underline">
                      إدارة الديون
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {debts.slice(0, 3).map((debt) => (
                      <div
                        key={debt.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{debt.name}</p>
                          <p className="text-xs text-gray-600">
                            معدل الفائدة: {debt.interestRate}%
                          </p>
                        </div>
                        <p className="font-bold text-red-700">
                          {formatCurrency(debt.currentBalance)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Premium Charts */}
            {isPremium && debts.length > 0 && (
              <DebtProgressChart
                data={debts.map((debt) => ({
                  name: debt.name,
                  remaining: debt.currentBalance,
                }))}
              />
            )}

            {isPremium && activeGoals.length > 0 && (
              <GoalsProgressChart
                data={activeGoals.map((goal) => ({
                  name: goal.name,
                  current: goal.current,
                  target: goal.target,
                }))}
              />
            )}
          </div>

          {/* Left Column - Recommendations & Quick Actions */}
          <div className="space-y-6">
            {/* Recommendations Widget */}
            <RecommendationsWidget recommendations={assessment.recommendations} />

            {/* Quick Actions Widget */}
            <QuickActionsWidget />

            {/* AI Advisor - Coming Soon */}
            <Card className="border-2 border-primary-trust">
              <CardHeader className="gradient-primary text-white">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>المستشار المالي الذكي</span>
                </CardTitle>
                <CardDescription className="text-white/90 text-sm">
                  مساعدك الشخصي في رحلتك المالية
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    قريباً: احصل على نصائح مالية ذكية مخصصة لك بالذكاء الاصطناعي
                  </p>
                </div>
                <Button className="w-full" disabled>
                  <MessageSquare className="w-4 h-4 ml-2" />
                  متاح قريباً
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap with ErrorBoundary
export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
