# 🚀 خطة العمل التنفيذية - Acash.ai

**هدف:** الوصول لـ MVP قابل للإطلاق
**المدة:** 10-12 أسبوع
**البداية:** 2025-10-05

---

## 📅 الجدول الزمني

### الأسبوع 1-2: الأساسيات الحرجة 🔴

#### المهام

- [ ] **صفحة Reset Password** (4-6 ساعات)
  - إنشاء `/app/auth/reset-password/page.tsx`
  - نموذج إدخال البريد الإلكتروني
  - استخدام `resetPassword()` من `lib/firebase/auth.ts`
  - رسائل نجاح/خطأ
  - اختبار التدفق الكامل

- [ ] **Privacy Policy + Terms of Service** (8-10 ساعات)
  - إنشاء `/app/privacy-policy/page.tsx`
  - إنشاء `/app/terms-of-service/page.tsx`
  - كتابة المحتوى القانوني (استعن بـ templates)
  - Cookie Consent Banner
  - روابط في Footer

- [ ] **Profile Page** (6-8 ساعات)
  - إنشاء `/app/profile/page.tsx`
  - عرض بيانات المستخدم من Firestore
  - تحديث الاسم والصورة
  - عرض الاشتراك الحالي
  - روابط للإعدادات

- [ ] **Settings Page** (10-12 ساعات)
  - إنشاء `/app/settings/page.tsx`
  - تغيير كلمة المرور
  - تغيير البريد الإلكتروني
  - تفضيلات اللغة
  - حذف الحساب (مع تأكيد)

- [ ] **Session Management** (6-8 ساعات)
  - تحسين Middleware للتعامل مع Sessions
  - استخدام Firebase Admin SDK أو API routes
  - إنشاء session cookie
  - تحديث `middleware.ts`

- [ ] **ربط Firestore - Dashboard** (8-10 ساعات)
  - إنشاء دوال في `lib/firebase/db.ts`:
    - `getAssessmentResults(userId)`
    - `getActiveGoals(userId)`
    - `getActiveTools(userId)`
  - تحديث Dashboard لاستخدام البيانات الحقيقية
  - Loading states
  - Error handling

- [ ] **حفظ نتائج التشخيص** (4-6 ساعات)
  - حفظ Quick Assessment في Firestore
  - حفظ Advanced Assessment في Firestore
  - تحديث `useAssessmentStore` لمزامنة مع Firestore

**الإجمالي:** 46-60 ساعة (~2 أسابيع)

---

### الأسبوع 3-4: الأدوات والتنظيف 🟠

#### المهام

- [ ] **دمج الصفحات المكررة** (6-8 ساعات)
  - دمج `/tools/debt` مع `/tools/debt-calculator`
  - توحيد `/tools/emergency` و `/tools/emergency-fund`
  - حذف الصفحات المكررة
  - اختبار جميع الروابط

- [ ] **إكمال Debt Management** (10-12 ساعات)
  - فحص `/tools/debt-management/page.tsx`
  - ربط بدوال Snowball/Avalanche من `debt-calculator.ts`
  - UI لإضافة ديون متعددة
  - مقارنة الاستراتيجيات
  - جدول سداد 24 شهر
  - تصدير PDF

- [ ] **إكمال Smart Budget** (8-10 ساعات)
  - فحص `/tools/smart-budget/page.tsx`
  - تطبيق قاعدة 50/30/20
  - Charts بصرية (Pie chart)
  - توصيات تلقائية
  - حفظ في Firestore

- [ ] **Goal Tracker** (12-14 ساعات)
  - إنشاء `/app/tools/goal-tracker/page.tsx`
  - إضافة/تحرير/حذف أهداف
  - تتبع التقدم
  - Progress bars
  - حفظ في Firestore
  - مزامنة مع Dashboard

- [ ] **حفظ حسابات الأدوات** (8-10 ساعات)
  - Debt calculations → Firestore
  - Budget calculations → Firestore
  - Emergency fund → Firestore
  - دوال في `lib/firebase/db.ts`:
    - `saveCalculation(userId, toolId, data)`
    - `getCalculations(userId, toolId)`

- [ ] **إرسال Email فعلي** (6-8 ساعات)
  - تكامل Resend أو SendGrid
  - إنشاء `lib/email/` folder
  - دالة `sendDebtReport(email, pdfData)`
  - Email templates
  - اختبار الإرسال

**الإجمالي:** 50-62 ساعة (~2 أسابيع)

---

### الأسبوع 5-6: الاشتراكات والتحسينات 🟡

#### المهام

- [ ] **Pricing Page** (8-10 ساعات)
  - إنشاء `/app/pricing/page.tsx`
  - عرض خطط الاشتراك (Free, Premium, Enterprise)
  - Comparison table
  - FAQ section
  - CTA buttons

- [ ] **Stripe Integration** (12-16 ساعات)
  - تثبيت `@stripe/stripe-js`
  - إنشاء Stripe account
  - Checkout session
  - Webhook handler في `/app/api/stripe/webhook`
  - حفظ الاشتراك في Firestore
  - Billing portal

- [ ] **Premium Gating** (6-8 ساعات)
  - تحديث Middleware لفحص الاشتراك
  - حماية الأدوات المميزة
  - Upgrade prompts
  - Free tier limits

- [ ] **Navbar موحد** (4-6 ساعات)
  - إنشاء `components/layout/Navbar.tsx`
  - Logo + Navigation links
  - User menu (Profile, Settings, Logout)
  - Language switcher
  - Mobile responsive

- [ ] **Footer موحد** (3-4 ساعات)
  - إنشاء `components/layout/Footer.tsx`
  - روابط (About, Contact, Privacy, Terms)
  - Social media links
  - Copyright

- [ ] **Charts للـ Dashboard** (10-12 ساعات)
  - تثبيت Chart library (recharts)
  - Health Score radial chart
  - Income/Expenses bar chart
  - Net worth line chart
  - Goals progress chart

- [ ] **Modal/Dialog Component** (4-6 ساعات)
  - إنشاء `components/ui/modal.tsx`
  - Backdrop + Close button
  - Accessibility (ESC key, focus trap)
  - استخدامه في الحذف/التأكيد

- [ ] **Toast Notifications** (4-6 ساعات)
  - تثبيت `react-hot-toast` أو بناء custom
  - إنشاء `components/ui/toast.tsx`
  - Success/Error/Warning variants
  - استخدامه في جميع الأدوات

**الإجمالي:** 51-68 ساعة (~2 أسابيع)

---

### الأسبوع 7-8: الجودة والترجمة 🟢

#### المهام

- [ ] **استبدال النصوص بـ i18n** (12-16 ساعات)
  - استبدال جميع النصوص الثابتة في الصفحات
  - استخدام `useTranslations()` من next-intl
  - إضافة مفاتيح جديدة لـ `messages/ar.json` و `en.json`
  - اختبار جميع الصفحات بكلا اللغتين

- [ ] **ترجمة الأدوات** (8-10 ساعات)
  - ترجمة Debt Calculator
  - ترجمة Budget Planner
  - ترجمة Goal Tracker
  - ترجمة جميع الرسائل والتوصيات

- [ ] **Mobile Responsiveness** (8-10 ساعات)
  - اختبار جميع الصفحات على Mobile
  - تصحيح المشاكل البصرية
  - تحسين Navigation على Mobile
  - اختبار Charts على شاشات صغيرة

- [ ] **Unit Tests للدوال** (12-16 ساعات)
  - Tests لـ `debt-calculator.ts`
  - Tests لـ `assessment-calculator.ts`
  - Tests لـ `currency.ts`
  - Tests لـ Firebase functions
  - استهداف coverage >70%

- [ ] **Component Tests** (8-10 ساعات)
  - Tests لـ Button, Card, Input
  - Tests لـ Assessment steps
  - Tests لـ Modal, Toast
  - React Testing Library

- [ ] **E2E Tests (Critical Paths)** (10-12 ساعات)
  - Test: تسجيل دخول → Dashboard → Debt tool → PDF
  - Test: التشخيص السريع → النتائج → Dashboard
  - Test: التسجيل → Email verification
  - استخدام Playwright أو Cypress

**الإجمالي:** 58-74 ساعة (~2 أسابيع)

---

### الأسبوع 9-10: SEO والمحتوى 🌟

#### المهام

- [ ] **About Page** (4-6 ساعات)
  - إنشاء `/app/about/page.tsx`
  - من نحن - القصة والرؤية
  - الفريق (إذا كان ينطبق)
  - القيم والمبادئ
  - SEO metadata

- [ ] **Contact Page** (4-6 ساعات)
  - إنشاء `/app/contact/page.tsx`
  - نموذج اتصال
  - حفظ في Firestore أو إرسال email
  - معلومات التواصل
  - Social links

- [ ] **Structured Data** (6-8 ساعات)
  - Schema.org لجميع الصفحات
  - WebApplication schema
  - FinancialProduct schema للأدوات
  - FAQPage schema
  - BreadcrumbList

- [ ] **Dynamic Sitemap** (4-6 ساعات)
  - تحسين `app/sitemap.ts`
  - إضافة جميع الصفحات
  - Priority و changefreq
  - اختبار في Google Search Console

- [ ] **Blog System (Basic)** (12-16 ساعات)
  - إنشاء `/app/blog/` folder
  - MDX support
  - Blog post page
  - Blog listing page
  - Categories/Tags
  - SEO optimization

- [ ] **3-5 Blog Posts** (16-20 ساعات)
  - "كيف تتخلص من الديون في 5 خطوات"
  - "قاعدة 50/30/20 للميزانية"
  - "صندوق الطوارئ: لماذا تحتاجه؟"
  - "الحرية المالية: دليل المبتدئين"
  - SEO optimized (keywords, meta)

- [ ] **Internal Linking** (4-6 ساعات)
  - ربط الصفحات ببعضها
  - Related tools في كل أداة
  - Related posts في Blog
  - Breadcrumbs

**الإجمالي:** 50-68 ساعة (~2 أسابيع)

---

### الأسبوع 11-12: الإطلاق 🚀

#### المهام

- [ ] **Security Audit** (6-8 ساعات)
  - مراجعة Firestore Rules
  - اختبار Auth vulnerabilities
  - فحص XSS, CSRF
  - Rate limiting test
  - OWASP Top 10 checklist

- [ ] **Performance Optimization** (8-10 ساعات)
  - Image optimization (WebP, sizes)
  - Code splitting
  - Bundle analysis
  - Lazy loading
  - Caching strategy
  - CDN setup (Vercel Edge)

- [ ] **Lighthouse Audit** (4-6 ساعات)
  - تشغيل Lighthouse
  - تصحيح المشاكل
  - استهداف >90 في جميع الفئات
  - Mobile + Desktop

- [ ] **Accessibility Audit** (6-8 ساعات)
  - ARIA labels
  - Keyboard navigation
  - Screen reader test
  - Color contrast
  - WCAG 2.1 AA compliance

- [ ] **SEO Audit** (4-6 ساعات)
  - Google Search Console setup
  - Submit sitemap
  - Meta tags review
  - Structured data test
  - Mobile-friendly test

- [ ] **Analytics Setup** (4-6 ساعات)
  - Google Analytics 4
  - Conversion tracking
  - Event tracking (tool usage, signups)
  - Custom dashboards

- [ ] **Error Tracking** (3-4 ساعات)
  - Sentry setup
  - Error alerts
  - Source maps upload

- [ ] **Monitoring** (3-4 ساعات)
  - Uptime monitoring (UptimeRobot)
  - Performance monitoring
  - Firebase quota alerts

- [ ] **Beta Testing** (16-20 ساعات)
  - Recruit 10-20 beta testers
  - Feedback form
  - Bug tracking
  - Iteration based on feedback

- [ ] **Pre-launch Checklist** (4-6 ساعات)
  - [ ] All tests passing
  - [ ] Performance >90
  - [ ] Security audit done
  - [ ] Legal pages live
  - [ ] Analytics working
  - [ ] Error tracking working
  - [ ] Backups configured
  - [ ] Domain configured
  - [ ] SSL configured
  - [ ] Email working
  - [ ] Stripe working

- [ ] **Soft Launch** (يوم 1)
  - Deploy to production
  - Announce to beta testers
  - Monitor closely
  - Fix critical bugs

- [ ] **Public Launch** (يوم 7-14 بعد soft launch)
  - Marketing campaign
  - Social media announcement
  - Product Hunt launch
  - Email newsletter
  - Monitor metrics

**الإجمالي:** 58-78 ساعة (~2 أسابيع)

---

## 📊 الملخص الزمني

| المرحلة           | المدة        | الساعات          | الحالة     |
| ----------------- | ------------ | ---------------- | ---------- |
| **الأسبوع 1-2**   | أسبوعان      | 46-60            | ⏳ Pending |
| **الأسبوع 3-4**   | أسبوعان      | 50-62            | ⏳ Pending |
| **الأسبوع 5-6**   | أسبوعان      | 51-68            | ⏳ Pending |
| **الأسبوع 7-8**   | أسبوعان      | 58-74            | ⏳ Pending |
| **الأسبوع 9-10**  | أسبوعان      | 50-68            | ⏳ Pending |
| **الأسبوع 11-12** | أسبوعان      | 58-78            | ⏳ Pending |
| **الإجمالي**      | **12 أسبوع** | **313-410 ساعة** | -          |

**معدل العمل المطلوب:** 26-34 ساعة/أسبوع (full-time)

---

## 🎯 المعالم الرئيسية (Milestones)

### Milestone 1: الأساسيات (نهاية الأسبوع 2) ✅

- [ ] جميع صفحات Auth كاملة
- [ ] Profile + Settings جاهزة
- [ ] Privacy + Terms منشورة
- [ ] Firestore متصل ويحفظ البيانات

### Milestone 2: الأدوات (نهاية الأسبوع 4) ✅

- [ ] جميع الأدوات الموجودة مكتملة
- [ ] Goal Tracker جاهز
- [ ] Email sending يعمل
- [ ] لا توجد صفحات مكررة

### Milestone 3: Premium (نهاية الأسبوع 6) ✅

- [ ] Stripe integration كامل
- [ ] Pricing page منشورة
- [ ] Premium gating يعمل
- [ ] Dashboard بـ Charts

### Milestone 4: الجودة (نهاية الأسبوع 8) ✅

- [ ] جميع النصوص مترجمة
- [ ] Tests coverage >70%
- [ ] Mobile responsive 100%
- [ ] E2E tests للمسارات الحرجة

### Milestone 5: SEO (نهاية الأسبوع 10) ✅

- [ ] Blog system جاهز
- [ ] 5 blog posts منشورة
- [ ] Structured data كامل
- [ ] About + Contact جاهزة

### Milestone 6: الإطلاق (نهاية الأسبوع 12) 🚀

- [ ] Soft launch نجح
- [ ] Beta feedback معالج
- [ ] Public launch تم
- [ ] Marketing campaign بدأت

---

## 🛠️ الأدوات والموارد المطلوبة

### الخدمات الخارجية

- [ ] Stripe account (Payment)
- [ ] Resend/SendGrid account (Email)
- [ ] Sentry account (Error tracking)
- [ ] UptimeRobot account (Monitoring)
- [ ] Google Analytics account
- [ ] Google Search Console
- [ ] Domain name
- [ ] Vercel account (Deployment)

### الـ Libraries الإضافية

- [ ] `@stripe/stripe-js`
- [ ] `recharts` (Charts)
- [ ] `react-hot-toast` (Toasts)
- [ ] `@sentry/nextjs` (Error tracking)
- [ ] `@testing-library/react` (Tests)
- [ ] `@playwright/test` (E2E tests)
- [ ] `resend` أو `@sendgrid/mail` (Email)

---

## 📈 مقاييس النجاح

### Technical

- ✅ Test Coverage: >70%
- ✅ Lighthouse Score: >90
- ✅ First Contentful Paint: <1.5s
- ✅ Time to Interactive: <3.5s
- ✅ 0 critical bugs

### Business

- ✅ 10 beta users في الأسبوع الأول
- ✅ 100 signups في الشهر الأول
- ✅ 5% conversion rate (free to paid)
- ✅ 0 downtime في أول أسبوع

### User

- ✅ Tool completion rate: >80%
- ✅ Average session: >5 minutes
- ✅ Return rate: >30%
- ✅ NPS: >40

---

## 💡 نصائح للنجاح

1. **ركز على MVP**
   لا تحاول بناء كل شيء - ركز على 5 أدوات فقط.

2. **اختبر مبكراً وباستمرار**
   كل feature جديدة = test جديد.

3. **استمع للمستخدمين**
   Beta feedback = ذهب.

4. **لا تؤجل الـ Legal pages**
   Privacy + Terms = ضرورية للإطلاق.

5. **SEO من اليوم الأول**
   كل صفحة جديدة = SEO optimization.

6. **Performance matters**
   المستخدمون يكرهون البطء.

7. **Mobile first**
   60%+ من المستخدمين على Mobile.

8. **Document everything**
   README + Code comments = حياة أسهل.

---

## 📞 الدعم والمساعدة

**للأسئلة التقنية:**

- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs
- Tailwind Docs: https://tailwindcss.com/docs

**للأسئلة القانونية:**

- Privacy Policy Generator: https://www.privacypolicygenerator.info/
- Terms Generator: https://www.termsandconditionsgenerator.com/

**للتصميم:**

- Tailwind UI: https://tailwindui.com/
- shadcn/ui: https://ui.shadcn.com/

---

**أعدت بواسطة:** Claude AI
**التاريخ:** 2025-10-05
**النسخة:** 1.0

**للتفاصيل الكاملة:** انظر `COMPREHENSIVE_PROJECT_ANALYSIS.md`
