/**
 * ثوابت التطبيق (Constants)
 * جميع القيم الثابتة في مكان واحد لسهولة الصيانة
 */

// ==================== App Info ====================
export const APP_NAME = 'Acash.ai';
export const APP_DESCRIPTION = 'مساعدك المالي الذكي';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ==================== API & Services ====================
export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second

// ==================== Authentication ====================
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
export const TOKEN_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

// ==================== Financial Limits ====================
export const MIN_AGE = 18;
export const MAX_AGE = 100;

export const MIN_INCOME = 0;
export const MAX_INCOME = 10_000_000; // 10 million SAR

export const MIN_SAVINGS = 0;
export const MAX_SAVINGS = 1_000_000_000; // 1 billion SAR

export const MIN_DEBT = 0;
export const MAX_DEBT = 1_000_000_000;

export const MIN_DEPENDENTS = 0;
export const MAX_DEPENDENTS = 20;

// ==================== Financial Health Scoring ====================
export const HEALTH_SCORE = {
  MIN: 0,
  MAX: 100,
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0,
} as const;

export const SAVINGS_RATE_TARGET = 20; // 20% of income
export const DEBT_RATIO_THRESHOLD = 30; // 30% of annual income
export const EMERGENCY_FUND_MONTHS = 6; // 6 months of expenses

// ==================== Currency ====================
export const DEFAULT_CURRENCY = 'SAR';
export const DEFAULT_LOCALE = 'ar-SA';
export const CURRENCY_SYMBOL = 'ر.س.';

// ==================== Date & Time ====================
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'dd MMMM yyyy';

// ==================== UI ====================
export const TOAST_DURATION = 5000; // 5 seconds
export const DEBOUNCE_DELAY = 300; // 300ms
export const ANIMATION_DURATION = 200; // 200ms

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ==================== Cache ====================
export const CACHE_KEYS = {
  USER_PROFILE: 'user-profile',
  ASSESSMENT_DATA: 'assessment-data',
  FINANCIAL_TOOLS: 'financial-tools',
} as const;

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// ==================== Routes ====================
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ASSESSMENT: '/assessment',
  TOOLS: {
    INDEX: '/tools',
    DEBT_CALCULATOR: '/tools/debt-calculator',
    SAVINGS_CALCULATOR: '/tools/savings-calculator',
    INVESTMENT_CALCULATOR: '/tools/investment-calculator',
    MORTGAGE_CALCULATOR: '/tools/mortgage-calculator',
    CAR_LOAN_CALCULATOR: '/tools/car-loan-calculator',
    BUDGET_PLANNER: '/tools/budget-planner',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

// ==================== Firebase Collections ====================
export const COLLECTIONS = {
  USERS: 'users',
  ASSESSMENTS: 'assessments',
  TOOLS_DATA: 'tools_data',
  NOTIFICATIONS: 'notifications',
} as const;

// ==================== Error Codes ====================
export const ERROR_CODES = {
  // Auth errors
  AUTH_INVALID_EMAIL: 'auth/invalid-email',
  AUTH_USER_NOT_FOUND: 'auth/user-not-found',
  AUTH_WRONG_PASSWORD: 'auth/wrong-password',
  AUTH_EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_TOO_MANY_REQUESTS: 'auth/too-many-requests',

  // App errors
  VALIDATION_ERROR: 'validation-error',
  NETWORK_ERROR: 'network-error',
  UNKNOWN_ERROR: 'unknown-error',
  NOT_FOUND: 'not-found',
  FORBIDDEN: 'forbidden',
} as const;

// ==================== Feature Flags ====================
export const FEATURES = {
  ENABLE_DARK_MODE: false,
  ENABLE_PWA: false,
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_MULTI_LANGUAGE: false,
} as const;

// ==================== Environment ====================
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// ==================== External Links ====================
export const EXTERNAL_LINKS = {
  FIREBASE_CONSOLE: 'https://console.firebase.google.com',
  SUPPORT_EMAIL: 'support@acash.ai',
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
} as const;
