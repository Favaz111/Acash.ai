'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { createGoal, getGoals, updateGoal, deleteGoal } from '@/lib/firebase/db';
import type { FinancialGoal } from '@/types/database';
import { showSuccess, showError } from '@/components/ui/toast';
import { SkeletonCard } from '@/components/ui/skeleton';

// أنواع الأهداف المتاحة
const GOAL_TYPES = [
  { id: 'emergency_fund', label: 'صندوق الطوارئ', icon: '🏥', color: 'red' },
  { id: 'debt_free', label: 'التخلص من الديون', icon: '🏦', color: 'orange' },
  { id: 'save_home', label: 'شراء منزل', icon: '🏠', color: 'blue' },
  { id: 'save_car', label: 'شراء سيارة', icon: '🚗', color: 'green' },
  { id: 'investment', label: 'بناء محفظة استثمارية', icon: '📈', color: 'purple' },
  { id: 'retirement', label: 'التخطيط للتقاعد', icon: '🌴', color: 'teal' },
  { id: 'education', label: 'تعليم الأبناء', icon: '🎓', color: 'indigo' },
  { id: 'hajj', label: 'الحج', icon: '🕋', color: 'yellow' },
  { id: 'financial_freedom', label: 'الحرية المالية', icon: '🎯', color: 'pink' },
  { id: 'other', label: 'أخرى', icon: '⭐', color: 'gray' },
];

interface GoalFormData {
  name: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const INITIAL_FORM_DATA: GoalFormData = {
  name: '',
  type: 'emergency_fund',
  targetAmount: 0,
  currentAmount: 0,
  targetDate: '',
  monthlyContribution: 0,
  priority: 'medium',
  description: '',
};

export default function GoalTrackerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState<GoalFormData>(INITIAL_FORM_DATA);

  // Fetch Goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userGoals = await getGoals(user.uid);
        setGoals(userGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        showError('فشل تحميل الأهداف');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGoals();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/tools/goal-tracker');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) return;

    try {
      if (editingGoal) {
        // Update existing goal
        await updateGoal(user.uid, editingGoal.id, {
          name: formData.name,
          type: formData.type as FinancialGoal['type'],
          targetAmount: formData.targetAmount,
          currentAmount: formData.currentAmount,
          targetDate: new Date(formData.targetDate),
          monthlyContribution: formData.monthlyContribution,
          priority: formData.priority,
          description: formData.description,
          status: calculateStatus(formData.currentAmount, formData.targetAmount),
          updatedAt: new Date(),
        });
        showSuccess('تم تحديث الهدف بنجاح');
      } else {
        // Create new goal
        await createGoal(user.uid, {
          name: formData.name,
          type: formData.type as FinancialGoal['type'],
          targetAmount: formData.targetAmount,
          currentAmount: formData.currentAmount,
          targetDate: new Date(formData.targetDate),
          monthlyContribution: formData.monthlyContribution,
          priority: formData.priority,
          description: formData.description,
          status: 'in_progress',
          icon: GOAL_TYPES.find((t) => t.id === formData.type)?.icon || '🎯',
        });
        showSuccess('تم إضافة الهدف بنجاح');
      }

      // Refresh goals
      const updatedGoals = await getGoals(user.uid);
      setGoals(updatedGoals);

      // Reset form
      setShowForm(false);
      setEditingGoal(null);
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error('Error saving goal:', error);
      showError('فشل حفظ الهدف');
    }
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      type: goal.type,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate.toISOString().split('T')[0] || '',
      monthlyContribution: goal.monthlyContribution || 0,
      priority: goal.priority,
      description: goal.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId: string) => {
    if (!user?.uid) return;
    if (!confirm('هل أنت متأكد من حذف هذا الهدف؟')) return;

    try {
      await deleteGoal(user.uid, goalId);
      setGoals(goals.filter((g) => g.id !== goalId));
      showSuccess('تم حذف الهدف');
    } catch (error) {
      console.error('Error deleting goal:', error);
      showError('فشل حذف الهدف');
    }
  };

  const calculateStatus = (
    current: number,
    target: number
  ): 'in_progress' | 'completed' | 'paused' => {
    if (current >= target) return 'completed';
    return 'in_progress';
  };

  const calculateMonthsToGoal = (current: number, target: number, monthly: number): number => {
    if (monthly <= 0) return 999;
    const remaining = target - current;
    return Math.ceil(remaining / monthly);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <SkeletonCard />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => g.status === 'in_progress');
  const completedGoals = goals.filter((g) => g.status === 'completed');

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

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary-trust transition-colors"
            >
              لوحة التحكم
            </Link>
            <Link
              href="/tools"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-trust transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              الأدوات
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 متابع الأهداف المالية</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            حدد أهدافك المالية وتابع تقدمك نحو تحقيقها
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الأهداف النشطة</p>
                  <p className="text-3xl font-bold text-primary-trust">{activeGoals.length}</p>
                </div>
                <Target className="w-12 h-12 text-primary-trust opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الأهداف المكتملة</p>
                  <p className="text-3xl font-bold text-green-600">{completedGoals.length}</p>
                </div>
                <Check className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">إجمالي الأهداف</p>
                  <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-gray-900 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Button */}
        {!showForm && (
          <div className="mb-8">
            <Button onClick={() => setShowForm(true)} size="lg" className="w-full md:w-auto">
              <Plus className="w-5 h-5 ml-2" />
              إضافة هدف جديد
            </Button>
          </div>
        )}

        {/* Goal Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-primary-trust">
            <CardHeader>
              <CardTitle>{editingGoal ? 'تعديل الهدف' : 'هدف جديد'}</CardTitle>
              <CardDescription>املأ البيانات لإضافة هدف مالي جديد</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Goal Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الهدف
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => {
                        const selectedType = GOAL_TYPES.find((t) => t.id === e.target.value);
                        setFormData({
                          ...formData,
                          type: e.target.value,
                          name: formData.name || selectedType?.label || '',
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-trust focus:border-transparent outline-none"
                    >
                      {GOAL_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Goal Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الهدف
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: صندوق طوارئ 6 أشهر"
                      required
                    />
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ المستهدف
                    </label>
                    <Input
                      type="number"
                      value={formData.targetAmount || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="30000"
                      required
                      min="0"
                    />
                  </div>

                  {/* Current Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ الحالي
                    </label>
                    <Input
                      type="number"
                      value={formData.currentAmount || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="5000"
                      min="0"
                    />
                  </div>

                  {/* Monthly Contribution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المساهمة الشهرية
                    </label>
                    <Input
                      type="number"
                      value={formData.monthlyContribution || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyContribution: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="1000"
                      min="0"
                    />
                  </div>

                  {/* Target Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ المستهدف
                    </label>
                    <Input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="لماذا هذا الهدف مهم بالنسبة لك؟"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-trust focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    <Check className="w-5 h-5 ml-2" />
                    {editingGoal ? 'حفظ التعديلات' : 'إضافة الهدف'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingGoal(null);
                      setFormData(INITIAL_FORM_DATA);
                    }}
                    className="flex-1"
                  >
                    <X className="w-5 h-5 ml-2" />
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-16 text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد أهداف بعد</h3>
              <p className="text-gray-600 mb-6">ابدأ بإضافة هدفك المالي الأول!</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5 ml-2" />
                إضافة هدف
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const monthsToGoal = calculateMonthsToGoal(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyContribution || 0
              );
              const goalType = GOAL_TYPES.find((t) => t.id === goal.type);

              return (
                <Card
                  key={goal.id}
                  className={`relative overflow-hidden ${
                    goal.status === 'completed' ? 'border-2 border-green-500' : ''
                  }`}
                >
                  {goal.status === 'completed' && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold">
                      ✓ مكتمل
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{goal.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          <CardDescription className="text-xs">{goalType?.label}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">التقدم</span>
                        <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">الحالي</span>
                        <span className="font-bold text-primary-trust">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">الهدف</span>
                        <span className="font-bold">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                      {(goal.monthlyContribution || 0) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">شهرياً</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(goal.monthlyContribution || 0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Time to Goal */}
                    {(goal.monthlyContribution || 0) > 0 && monthsToGoal < 999 && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-900">
                          {monthsToGoal} شهر للوصول للهدف
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        className="flex-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tips Section */}
        <Card className="mt-12 border-2 border-primary-innovation bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-innovation" />
              نصائح لتحقيق أهدافك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-innovation text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                1
              </div>
              <p className="text-sm text-gray-700">
                كن واقعياً: حدد أهدافاً قابلة للتحقيق بناءً على دخلك الحالي
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-innovation text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                2
              </div>
              <p className="text-sm text-gray-700">
                أتمت المساهمات: اجعل التحويل للهدف تلقائياً كل شهر
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary-innovation text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                3
              </div>
              <p className="text-sm text-gray-700">
                راجع بانتظام: حدّث تقدمك شهرياً وعدّل المساهمات حسب الحاجة
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
