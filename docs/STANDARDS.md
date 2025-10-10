# 🏗️ معايير البناء والسلامة - Acash.ai

## 📋 جدول المحتويات

1. [معايير الأمان (Security)](#security)
2. [معايير الكود (Code Quality)](#code-quality)
3. [معايير الأداء (Performance)](#performance)
4. [معايير إمكانية الوصول (A11y)](#accessibility)
5. [معايير الاختبار (Testing)](#testing)
6. [معايير DevOps](#devops)
7. [قائمة التحقق (Checklist)](#checklist)

---

## 🔒 1. معايير الأمان (Security) {#security}

### أ. حماية البيانات الحساسة

- [ ] **Environment Variables**: جميع المفاتيح في `.env.local` فقط
- [ ] **`.gitignore` محدّث**: لا نرفع `.env*` أبداً
- [ ] **No hardcoded secrets**: فحص الكود من API keys مخفية
- [ ] **Firebase Security Rules**: قواعد صارمة في Firestore

#### مثال قواعد Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المستخدم يصل لبياناته فقط
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // بيانات Assessment خاصة بالمستخدم
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null &&
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

### ب. حماية من الهجمات

- [ ] **XSS Protection**: تعقيم input المستخدم
- [ ] **CSRF Protection**: Next.js يوفرها بشكل افتراضي
- [ ] **SQL Injection**: نستخدم Firestore (NoSQL) + معالجة آمنة
- [ ] **Rate Limiting**: حد أقصى للطلبات (API Routes)

#### مثال Rate Limiting:

```typescript
// lib/rateLimit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 طلبات
  duration: 60, // كل دقيقة
});

export async function checkRateLimit(ip: string) {
  try {
    await rateLimiter.consume(ip);
    return true;
  } catch {
    return false;
  }
}
```

### ج. المصادقة (Authentication)

- [ ] **Strong Passwords**: 8+ أحرف، أحرف كبيرة/صغيرة، أرقام
- [ ] **Email Verification**: تفعيل الإيميل قبل الاستخدام
- [ ] **MFA (اختياري)**: Two-Factor Authentication
- [ ] **Session Management**: JWT tokens آمنة
- [ ] **Logout على جميع الأجهزة**: خاصية مهمة

---

## 💎 2. معايير الكود (Code Quality) {#code-quality}

### أ. TypeScript صارم

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // ✅ موجود
    "noImplicitAny": true, // ✅ ضمن strict
    "strictNullChecks": true, // ✅ ضمن strict
    "noUnusedLocals": true, // ⚠️ يُفضل إضافته
    "noUnusedParameters": true, // ⚠️ يُفضل إضافته
    "noImplicitReturns": true, // ⚠️ يُفضل إضافته
    "forceConsistentCasingInFileNames": true
  }
}
```

**الحالة**: ✅ `strict: true` موجود - جيد!

### ب. ESLint متقدم

```json
// .eslintrc.json (مُحسّن)
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

**الحالة**: ⚠️ بسيط جداً - يحتاج تحسين

### ج. هيكلة الملفات

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route Groups
│   ├── (dashboard)/
│   └── api/               # API Routes
├── components/
│   ├── ui/                # مكونات UI عامة
│   ├── forms/             # نماذج
│   ├── layout/            # Header, Footer
│   └── features/          # مكونات خاصة بميزة
├── lib/
│   ├── firebase/          # ✅ موجود
│   ├── utils/             # دوال مساعدة
│   ├── validations/       # ⚠️ مفقود - مهم!
│   └── constants.ts       # ⚠️ مفقود
├── store/                 # ✅ Zustand
├── types/                 # ⚠️ مفقود - مهم!
│   ├── models.ts
│   └── api.ts
├── hooks/                 # ⚠️ مفقود
│   ├── useAuth.ts
│   └── useFinancial.ts
└── styles/               # ✅ globals.css
```

**الحالة**: ⚠️ يحتاج تنظيم

### د. Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase + `use` (`useAuth.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase + `I` prefix (`IUserProfile`)

---

## ⚡ 3. معايير الأداء (Performance) {#performance}

### أ. Optimization Checklist

- [ ] **next/image**: استخدام Image component بدلاً من `<img>`
- [ ] **Dynamic Imports**: تحميل lazy للصفحات الثقيلة
- [ ] **Font Optimization**: استخدام `next/font`
- [ ] **Bundle Size**: مراقبة حجم الـ bundles

#### مثال Font Optimization:

```typescript
// app/layout.tsx
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

const arabicFont = IBM_Plex_Sans_Arabic({
  weight: ['400', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html className={arabicFont.className}>
      {children}
    </html>
  );
}
```

**الحالة**: ⚠️ نستخدم CDN في CSS - يُفضل next/font

### ب. Code Splitting

```typescript
// استخدام dynamic import للمكونات الثقيلة
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // إذا كان المكون client-only
});
```

**الحالة**: ❌ غير مطبق بعد

### ج. Caching Strategy

- **TanStack Query**: ✅ موجود - staleTime: 60s
- **Next.js Cache**: استخدام `revalidate` في fetch
- **Service Worker**: للـ PWA (اختياري)

---

## ♿ 4. معايير إمكانية الوصول (A11y) {#accessibility}

### Checklist

- [ ] **Semantic HTML**: `<button>` بدلاً من `<div onClick>`
- [ ] **ARIA Labels**: لكل عنصر تفاعلي
- [ ] **Keyboard Navigation**: Tab/Enter/Escape تعمل
- [ ] **Color Contrast**: WCAG AA (4.5:1 للنصوص)
- [ ] **Screen Reader**: اختبار مع NVDA/JAWS
- [ ] **Focus Indicators**: واضحة للـ keyboard users

#### مثال:

```tsx
// ❌ سيء
<div onClick={handleClick}>اضغط هنا</div>

// ✅ جيد
<button
  onClick={handleClick}
  aria-label="حفظ البيانات المالية"
  className="focus:ring-2 focus:ring-primary"
>
  اضغط هنا
</button>
```

**الحالة**: ⚠️ بحاجة لفحص شامل

---

## 🧪 5. معايير الاختبار (Testing) {#testing}

### هيكل الاختبارات

```
tests/
├── unit/              # Vitest
│   ├── utils.test.ts
│   └── stores.test.ts
├── integration/       # Testing Library
│   └── auth.test.tsx
├── e2e/              # Playwright
│   └── assessment.spec.ts
└── setup.ts
```

### أ. Unit Tests (Vitest)

```typescript
// tests/unit/formatCurrency.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats SAR correctly', () => {
    expect(formatCurrency(1000)).toBe('١٬٠٠٠٫٠٠ ر.س.');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('٠٫٠٠ ر.س.');
  });
});
```

**الحالة**: ❌ غير موجود - **أولوية عالية**

### ب. Integration Tests

```typescript
// tests/integration/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';

test('shows error on invalid credentials', async () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText('البريد'), {
    target: { value: 'invalid@email.com' }
  });

  fireEvent.click(screen.getByText('تسجيل الدخول'));

  expect(await screen.findByText(/خطأ/)).toBeInTheDocument();
});
```

**الحالة**: ❌ غير موجود

### ج. Coverage Target

- **Minimum**: 70% coverage
- **Critical paths**: 90%+ (auth, payment)

---

## 🚀 6. معايير DevOps {#devops}

### أ. Git Workflow

```bash
# Branch Naming
feature/add-debt-calculator
fix/firebase-auth-error
hotfix/security-patch

# Commit Messages (Conventional Commits)
feat: add debt calculator tool
fix: handle undefined Firebase config
docs: update README with setup steps
test: add unit tests for formatCurrency
```

**الحالة**: ⚠️ يحتاج تنظيم

### ب. Pre-commit Hooks (Husky)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "pre-commit": "lint-staged"
  }
}

// .husky/pre-commit
#!/bin/sh
npm run lint
npm run test
npx tsc --noEmit
```

**الحالة**: ❌ غير موجود - **مُوصى به بشدة**

### ج. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**الحالة**: ❌ غير موجود بعد

---

## ✅ 7. قائمة التحقق الشاملة {#checklist}

### 🔴 أولوية حرجة (Must Have)

- [x] TypeScript strict mode
- [x] ESLint setup
- [x] Environment variables في .env.local
- [ ] **Input Validation** (Zod/Yup) - **مفقود!**
- [ ] **Error Boundaries** - **مفقود!**
- [ ] **Loading States** - **جزئي**
- [ ] **Firebase Security Rules** - **مفقود!**

### 🟡 أولوية عالية (Should Have)

- [ ] Unit Tests (70%+ coverage)
- [ ] Pre-commit hooks (Husky)
- [ ] next/font optimization
- [ ] ARIA labels شاملة
- [ ] Error logging (Sentry)
- [ ] Analytics (GA4/Mixpanel)

### 🟢 أولوية متوسطة (Nice to Have)

- [ ] E2E tests (Playwright)
- [ ] Storybook للمكونات
- [ ] PWA support
- [ ] i18n (دعم عدة لغات)
- [ ] Dark mode

---

## 📊 التقييم الحالي لـ Acash.ai

| الفئة          | النسبة | الحالة         |
| -------------- | ------ | -------------- |
| **الأمان**     | 60%    | ⚠️ يحتاج تحسين |
| **جودة الكود** | 75%    | ✅ جيد         |
| **الأداء**     | 70%    | ⚠️ يحتاج تحسين |
| **A11y**       | 50%    | ⚠️ ضعيف        |
| **الاختبار**   | 0%     | ❌ مفقود       |
| **DevOps**     | 40%    | ⚠️ بسيط        |

**المعدل الإجمالي**: **49%** (Below Production Standard)

---

## 🎯 خطة التحسين المقترحة

### المرحلة 1 (أسبوع 1) - الأساسيات الحرجة

1. ✅ إضافة Input Validation (Zod)
2. ✅ إضافة Error Boundaries
3. ✅ تحسين Loading States
4. ✅ Firebase Security Rules

### المرحلة 2 (أسبوع 2) - الاختبارات

1. ⚡ Setup Vitest
2. ⚡ Unit tests للـ utils
3. ⚡ Integration tests للـ auth

### المرحلة 3 (أسبوع 3) - الأداء وA11y

1. 🎨 Font optimization
2. 🎨 ARIA labels شاملة
3. 🎨 Dynamic imports

### المرحلة 4 (أسبوع 4) - DevOps

1. 🚀 Husky + lint-staged
2. 🚀 GitHub Actions CI/CD
3. 🚀 Error monitoring (Sentry)

---

## 📚 مراجع

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Firebase Security](https://firebase.google.com/docs/rules)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**آخر تحديث**: 2025-10-02
**الإصدار**: 1.0
**المسؤول**: فريق Acash.ai
