/**
 * ثوابت التشخيص المالي
 */

// مراحل التشخيص
export const ASSESSMENT_PHASES = {
  QUICK: 'quick',
  ADVANCED: 'advanced',
} as const;

// أسئلة التشخيص السريع (5-10 أسئلة)
export const QUICK_ASSESSMENT_QUESTIONS = [
  {
    id: 'monthly_income',
    type: 'number',
    question: 'ما هو معدل دخلك الشهري؟',
    icon: '💰',
    category: 'income',
  },
  {
    id: 'fixed_obligations',
    type: 'percentage',
    question: 'ما نسبة الالتزامات الثابتة من دخلك؟',
    icon: '🏠',
    category: 'obligations',
    helperText: 'إيجار، أقساط، فواتير ثابتة',
  },
  {
    id: 'has_clear_goals',
    type: 'boolean',
    question: 'هل لديك أهداف مالية واضحة؟',
    icon: '🎯',
    category: 'planning',
  },
  {
    id: 'saving_habits',
    type: 'select',
    question: 'ما هي عادات الادخار الحالية؟',
    icon: '📊',
    category: 'savings',
    options: [
      { value: 'none', label: 'لا أدخر' },
      { value: 'irregular', label: 'أدخر بشكل غير منتظم' },
      { value: 'regular', label: 'أدخر مبلغ ثابت شهرياً' },
      { value: 'percentage', label: 'أدخر نسبة من الدخل' },
    ],
  },
  {
    id: 'financial_knowledge',
    type: 'select',
    question: 'ما مستوى معرفتك المالية؟',
    icon: '🚀',
    category: 'knowledge',
    options: [
      { value: 'beginner', label: 'مبتدئ - أتعلم الأساسيات' },
      { value: 'intermediate', label: 'متوسط - أفهم المفاهيم الأساسية' },
      { value: 'advanced', label: 'متقدم - أدير شؤوني المالية بخبرة' },
    ],
  },
] as const;

// محاور التشخيص المتقدم (25 سؤال)
export const ADVANCED_ASSESSMENT_AXES = [
  {
    id: 'current_health',
    title: 'الصحة المالية الحالية',
    icon: '🏥',
    questions: 5,
    topics: ['السيولة والنقدية', 'نسبة الدين للدخل', 'صندوق الطوارئ', 'التنوع المالي'],
  },
  {
    id: 'future_planning',
    title: 'التخطيط المستقبلي',
    icon: '🎯',
    questions: 5,
    topics: ['الأهداف قصيرة المدى', 'الأهداف طويلة المدى', 'خطط التقاعد', 'استراتيجية الاستثمار'],
  },
  {
    id: 'awareness_skills',
    title: 'الوعي والمهارات',
    icon: '🧠',
    questions: 5,
    topics: ['المعرفة المالية', 'العادات المالية', 'إدارة المخاطر', 'التخطيط الضريبي والزكاة'],
  },
  {
    id: 'financial_flexibility',
    title: 'المرونة المالية',
    icon: '🌊',
    questions: 5,
    topics: ['مقاومة الصدمات', 'مصادر الدخل المتعددة', 'المهارات القابلة للتحويل', 'شبكة الأمان'],
  },
  {
    id: 'innovation_growth',
    title: 'الابتكار والنمو',
    icon: '💡',
    questions: 5,
    topics: ['فرص زيادة الدخل', 'استغلال الأصول', 'الابتكار المالي', 'النمو المستقبلي'],
  },
] as const;

// مستويات الصحة المالية
export const HEALTH_SCORE_LEVELS = {
  EXCELLENT: {
    min: 80,
    max: 100,
    label: 'ممتاز',
    color: 'green',
    icon: '🌟',
    description: 'صحة مالية ممتازة! استمر في هذا الأداء الرائع',
  },
  GOOD: {
    min: 60,
    max: 79,
    label: 'جيد',
    color: 'blue',
    icon: '👍',
    description: 'صحة مالية جيدة مع فرص للتحسين',
  },
  NEEDS_IMPROVEMENT: {
    min: 40,
    max: 59,
    label: 'يحتاج تحسين',
    color: 'yellow',
    icon: '⚠️',
    description: 'وضع مالي مقبول لكن يحتاج عمل جاد',
  },
  AT_RISK: {
    min: 0,
    max: 39,
    label: 'خطر',
    color: 'red',
    icon: '🚨',
    description: 'تحذير: وضع مالي يحتاج تدخل فوري',
  },
} as const;

// الأهداف المالية المتاحة
export const FINANCIAL_GOALS = [
  { id: 'emergency_fund', label: 'بناء صندوق طوارئ', icon: '🏥', priority: 'high' },
  { id: 'debt_free', label: 'التخلص من الديون', icon: '🏦', priority: 'high' },
  { id: 'save_home', label: 'شراء منزل', icon: '🏠', priority: 'medium' },
  { id: 'save_car', label: 'شراء سيارة', icon: '🚗', priority: 'medium' },
  { id: 'investment', label: 'بناء محفظة استثمارية', icon: '📈', priority: 'medium' },
  { id: 'retirement', label: 'التخطيط للتقاعد', icon: '🌴', priority: 'low' },
  { id: 'education', label: 'تعليم الأبناء', icon: '🎓', priority: 'medium' },
  { id: 'hajj', label: 'الحج', icon: '🕋', priority: 'medium' },
  { id: 'financial_freedom', label: 'الحرية المالية', icon: '🎯', priority: 'low' },
] as const;

// نسب المصروفات المثالية (50/30/20)
export const IDEAL_BUDGET_RATIOS = {
  NEEDS: 0.5, // 50% - الاحتياجات الأساسية
  WANTS: 0.3, // 30% - الرغبات
  SAVINGS: 0.2, // 20% - الادخار والاستثمار
} as const;

// معايير صندوق الطوارئ
export const EMERGENCY_FUND_CRITERIA = {
  MIN_MONTHS: 3,
  IDEAL_MONTHS: 6,
  MAX_MONTHS: 12,
} as const;

// نسب الدين للدخل
export const DEBT_TO_INCOME_RATIOS = {
  EXCELLENT: 0.15, // أقل من 15%
  GOOD: 0.28, // 15-28%
  ACCEPTABLE: 0.36, // 28-36%
  WARNING: 0.43, // 36-43%
  DANGER: 0.5, // أكثر من 43%
} as const;
