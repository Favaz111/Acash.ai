/**
 * Smart Notification System
 * Intelligent notifications for financial events
 */

import { User, DebtItem, FinancialGoal, BudgetCategory } from '@/types/database';

export type NotificationType =
  | 'payment_due'
  | 'goal_milestone'
  | 'budget_warning'
  | 'budget_exceeded'
  | 'debt_payoff'
  | 'savings_achievement'
  | 'financial_tip'
  | 'system_update'
  | 'security_alert';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  actionUrl?: string;
  actionLabel?: string;
  actionLabelAr?: string;
  icon: string;
  color: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface NotificationRule {
  type: NotificationType;
  condition: (data: any) => boolean;
  priority: NotificationPriority;
  template: (data: any) => Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>;
}

class NotificationService {
  private rules: NotificationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  // Initialize notification rules
  private initializeRules() {
    // Payment Due (3 days before)
    this.rules.push({
      type: 'payment_due',
      condition: (debt: DebtItem) => {
        if (!debt.nextPaymentDate) return false;
        const daysUntil = Math.ceil(
          (new Date(debt.nextPaymentDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysUntil <= 3 && daysUntil > 0;
      },
      priority: 'high',
      template: (debt: DebtItem) => ({
        type: 'payment_due',
        priority: 'high',
        title: `Payment Due: ${debt.name}`,
        titleAr: `دفعة مستحقة: ${debt.nameAr || debt.name}`,
        message: `Your payment of ${debt.minimumPayment?.toLocaleString() || '0'} SAR is due soon.`,
        messageAr: `دفعتك بمبلغ ${debt.minimumPayment?.toLocaleString() || '0'} ر.س مستحقة قريباً.`,
        actionUrl: `/dashboard/debts/${debt.id}`,
        actionLabel: 'View Debt',
        actionLabelAr: 'عرض الدين',
        icon: '💳',
        color: '#ef4444',
        metadata: { debtId: debt.id, amount: debt.minimumPayment || 0 },
      }),
    });

    // Budget Warning (80% spent)
    this.rules.push({
      type: 'budget_warning',
      condition: (budget: BudgetCategory) => {
        const percentage = ((budget.spent || 0) / budget.allocated) * 100;
        return percentage >= 80 && percentage < 100;
      },
      priority: 'medium',
      template: (budget: BudgetCategory) => {
        const percentage = Math.round(((budget.spent || 0) / budget.allocated) * 100);
        return {
          type: 'budget_warning',
          priority: 'medium',
          title: `Budget Warning: ${budget.name}`,
          titleAr: `تحذير ميزانية: ${budget.nameAr || budget.name}`,
          message: `You've used ${percentage}% of your ${budget.name} budget.`,
          messageAr: `استخدمت ${percentage}% من ميزانية ${budget.nameAr || budget.name}.`,
          actionUrl: `/dashboard/budget`,
          actionLabel: 'View Budget',
          actionLabelAr: 'عرض الميزانية',
          icon: '⚠️',
          color: '#f59e0b',
          metadata: { budgetId: budget.id, percentage },
        };
      },
    });

    // Budget Exceeded (100%+)
    this.rules.push({
      type: 'budget_exceeded',
      condition: (budget: BudgetCategory) => {
        return (budget.spent || 0) > budget.allocated;
      },
      priority: 'high',
      template: (budget: BudgetCategory) => {
        const overspent = (budget.spent || 0) - budget.allocated;
        return {
          type: 'budget_exceeded',
          priority: 'high',
          title: `Budget Exceeded: ${budget.name}`,
          titleAr: `تجاوز الميزانية: ${budget.nameAr || budget.name}`,
          message: `You've exceeded your budget by ${overspent.toLocaleString()} SAR.`,
          messageAr: `تجاوزت ميزانيتك بمبلغ ${overspent.toLocaleString()} ر.س.`,
          actionUrl: `/dashboard/budget`,
          actionLabel: 'Review Budget',
          actionLabelAr: 'مراجعة الميزانية',
          icon: '🚨',
          color: '#ef4444',
          metadata: { budgetId: budget.id, overspent },
        };
      },
    });

    // Goal Milestone (25%, 50%, 75%, 100%)
    this.rules.push({
      type: 'goal_milestone',
      condition: (goal: FinancialGoal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        const milestones = [25, 50, 75, 100];
        return milestones.some((m) => Math.abs(percentage - m) < 1);
      },
      priority: 'medium',
      template: (goal: FinancialGoal) => {
        const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
        const milestone =
          percentage >= 100 ? 100 : percentage >= 75 ? 75 : percentage >= 50 ? 50 : 25;
        const emoji =
          milestone === 100 ? '🎉' : milestone >= 75 ? '🎯' : milestone >= 50 ? '📈' : '🌟';

        return {
          type: 'goal_milestone',
          priority: milestone === 100 ? 'high' : 'medium',
          title: `${milestone}% Goal Achieved: ${goal.name}`,
          titleAr: `${milestone}% من الهدف تحقق: ${goal.nameAr || goal.name}`,
          message: `Congratulations! You've reached ${milestone}% of your goal.`,
          messageAr: `تهانينا! وصلت إلى ${milestone}% من هدفك.`,
          actionUrl: `/dashboard/goals/${goal.id}`,
          actionLabel: 'View Goal',
          actionLabelAr: 'عرض الهدف',
          icon: emoji,
          color: milestone === 100 ? '#10b981' : '#3b82f6',
          metadata: { goalId: goal.id, milestone, percentage },
        };
      },
    });

    // Debt Payoff Complete
    this.rules.push({
      type: 'debt_payoff',
      condition: (debt: DebtItem) => {
        return debt.currentBalance === 0;
      },
      priority: 'high',
      template: (debt: DebtItem) => ({
        type: 'debt_payoff',
        priority: 'high',
        title: `Debt Paid Off: ${debt.name}! 🎉`,
        titleAr: `تم سداد الدين: ${debt.nameAr || debt.name}! 🎉`,
        message: `Congratulations! You've completely paid off this debt!`,
        messageAr: `تهانينا! لقد سددت هذا الدين بالكامل!`,
        actionUrl: `/dashboard/debts`,
        actionLabel: 'View All Debts',
        actionLabelAr: 'عرض كل الديون',
        icon: '🎊',
        color: '#10b981',
        metadata: { debtId: debt.id },
      }),
    });

    // Financial Tips (daily)
    this.rules.push({
      type: 'financial_tip',
      condition: () => true, // Always show tips
      priority: 'low',
      template: (tip: { title: string; titleAr: string; message: string; messageAr: string }) => ({
        type: 'financial_tip',
        priority: 'low',
        title: tip.title,
        titleAr: tip.titleAr,
        message: tip.message,
        messageAr: tip.messageAr,
        actionUrl: '/tools',
        actionLabel: 'Explore Tools',
        actionLabelAr: 'استكشف الأدوات',
        icon: '💡',
        color: '#8b5cf6',
      }),
    });
  }

  // Generate notifications based on user data
  generateNotifications(
    userId: string,
    data: {
      debts?: DebtItem[];
      goals?: FinancialGoal[];
      budgets?: BudgetCategory[];
    }
  ): Notification[] {
    const notifications: Notification[] = [];

    // Check debts
    if (data.debts) {
      data.debts.forEach((debt) => {
        this.rules
          .filter((rule) => rule.type === 'payment_due' || rule.type === 'debt_payoff')
          .forEach((rule) => {
            if (rule.condition(debt)) {
              const notification = rule.template(debt);
              notifications.push({
                ...notification,
                id: this.generateId(),
                userId,
                read: false,
                createdAt: new Date(),
              });
            }
          });
      });
    }

    // Check budgets
    if (data.budgets) {
      data.budgets.forEach((budget) => {
        this.rules
          .filter((rule) => rule.type === 'budget_warning' || rule.type === 'budget_exceeded')
          .forEach((rule) => {
            if (rule.condition(budget)) {
              const notification = rule.template(budget);
              notifications.push({
                ...notification,
                id: this.generateId(),
                userId,
                read: false,
                createdAt: new Date(),
              });
            }
          });
      });
    }

    // Check goals
    if (data.goals) {
      data.goals.forEach((goal) => {
        this.rules
          .filter((rule) => rule.type === 'goal_milestone')
          .forEach((rule) => {
            if (rule.condition(goal)) {
              const notification = rule.template(goal);
              notifications.push({
                ...notification,
                id: this.generateId(),
                userId,
                read: false,
                createdAt: new Date(),
              });
            }
          });
      });
    }

    return notifications;
  }

  // Get daily financial tip
  getDailyTip(): {
    title: string;
    titleAr: string;
    message: string;
    messageAr: string;
  } {
    const tips = [
      {
        title: 'Pay Yourself First',
        titleAr: 'ادفع لنفسك أولاً',
        message: 'Set aside 10-20% of your income for savings before paying any bills.',
        messageAr: 'خصص 10-20% من دخلك للادخار قبل دفع أي فواتير.',
      },
      {
        title: 'Track Every Expense',
        titleAr: 'تتبع كل نفقة',
        message: 'Small purchases add up. Track everything to understand your spending patterns.',
        messageAr: 'المشتريات الصغيرة تتراكم. تتبع كل شيء لفهم أنماط إنفاقك.',
      },
      {
        title: 'Emergency Fund First',
        titleAr: 'صندوق الطوارئ أولاً',
        message: 'Before investing, build an emergency fund covering 6 months of expenses.',
        messageAr: 'قبل الاستثمار، ابنِ صندوق طوارئ يغطي 6 أشهر من النفقات.',
      },
      {
        title: 'Avoid Lifestyle Inflation',
        titleAr: 'تجنب تضخم نمط الحياة',
        message: 'When your income increases, save the difference instead of spending more.',
        messageAr: 'عندما يزيد دخلك، وفر الفرق بدلاً من الإنفاق أكثر.',
      },
      {
        title: '50/30/20 Rule',
        titleAr: 'قاعدة 50/30/20',
        message: '50% needs, 30% wants, 20% savings. A simple budgeting framework.',
        messageAr: '50% احتياجات، 30% رغبات، 20% مدخرات. إطار ميزانية بسيط.',
      },
    ];

    const today = new Date().getDate();
    return tips[today % tips.length];
  }

  // Create custom notification
  createNotification(
    userId: string,
    type: NotificationType,
    data: Partial<Notification>
  ): Notification {
    return {
      id: this.generateId(),
      userId,
      type,
      priority: data.priority || 'medium',
      title: data.title || '',
      titleAr: data.titleAr || '',
      message: data.message || '',
      messageAr: data.messageAr || '',
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      actionLabelAr: data.actionLabelAr,
      icon: data.icon || '📢',
      color: data.color || '#3b82f6',
      read: false,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
      metadata: data.metadata,
    };
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    // Implementation would update in Firestore
    console.log(`Notification ${notificationId} marked as read`);
  }

  // Mark all as read
  markAllAsRead(userId: string): void {
    // Implementation would update all user notifications in Firestore
    console.log(`All notifications for user ${userId} marked as read`);
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    // Implementation would delete from Firestore
    console.log(`Notification ${notificationId} deleted`);
  }

  // Get unread count
  getUnreadCount(notifications: Notification[]): number {
    return notifications.filter((n) => !n.read).length;
  }

  // Filter notifications
  filterNotifications(
    notifications: Notification[],
    filters: {
      type?: NotificationType;
      priority?: NotificationPriority;
      read?: boolean;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): Notification[] {
    return notifications.filter((n) => {
      if (filters.type && n.type !== filters.type) return false;
      if (filters.priority && n.priority !== filters.priority) return false;
      if (filters.read !== undefined && n.read !== filters.read) return false;
      if (filters.dateFrom && n.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && n.createdAt > filters.dateTo) return false;
      return true;
    });
  }

  // Sort notifications
  sortNotifications(
    notifications: Notification[],
    sortBy: 'date' | 'priority' | 'type' = 'date'
  ): Notification[] {
    return [...notifications].sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.type.localeCompare(b.type);
    });
  }

  // Generate unique ID
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper functions
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    payment_due: '💳',
    goal_milestone: '🎯',
    budget_warning: '⚠️',
    budget_exceeded: '🚨',
    debt_payoff: '🎉',
    savings_achievement: '💰',
    financial_tip: '💡',
    system_update: '📢',
    security_alert: '🔒',
  };
  return icons[type] || '📬';
}

export function getNotificationColor(priority: NotificationPriority): string {
  const colors: Record<NotificationPriority, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#3b82f6',
  };
  return colors[priority];
}

export function formatNotificationTime(date: Date): { en: string; ar: string } {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return { en: 'Just now', ar: 'الآن' };
  } else if (diffMins < 60) {
    return { en: `${diffMins}m ago`, ar: `منذ ${diffMins} د` };
  } else if (diffHours < 24) {
    return { en: `${diffHours}h ago`, ar: `منذ ${diffHours} س` };
  } else if (diffDays < 7) {
    return { en: `${diffDays}d ago`, ar: `منذ ${diffDays} ي` };
  } else {
    return {
      en: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ar: date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    };
  }
}
