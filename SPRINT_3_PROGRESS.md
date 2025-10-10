# 📋 Sprint 3 Progress - Advanced Tools & Optimization

**التاريخ**: يناير 2025
**الحالة**: 🔄 قيد التنفيذ
**المرحلة**: الأسبوع 3-4 من ACTION_PLAN.md

---

## 🎯 الهدف الرئيسي

إكمال الأدوات المتقدمة (Debt Management, Smart Budget, Goal Tracker) وربطها بـ Firestore، مع تكامل Email وتحسين الجودة.

---

## ✅ المهام المنجزة

### 1. **فحص الصفحات المكررة** ✅

**النتيجة**: لا يوجد تكرار فعلي - الصفحات منفصلة حسب المستوى:

- `/tools/debt/` = أداة **مجانية** لدين واحد (Single Debt Calculator)
- `/tools/debt-management/` = أداة **Premium** لديون متعددة (Multiple Debts + Strategies)
- `/tools/budget/` = أداة **مجانية** أساسية
- `/tools/smart-budget/` = أداة **Premium** متقدمة مع قاعدة 50/30/20
- `/tools/emergency/` = أداة **مجانية** لصندوق الطوارئ

**القرار**: الإبقاء على جميع الصفحات كما هي - لا حاجة للدمج.

---

### 2. **مراجعة Debt Management Tool** ✅

**الملف**: [app/tools/debt-management/page.tsx](./app/tools/debt-management/page.tsx)

**الميزات الموجودة**:

- ✅ إدارة ديون متعددة (Add/Edit/Delete)
- ✅ استراتيجية كرة الثلج (Snowball) - البدء بأصغر دين
- ✅ استراتيجية الانهيار الجليدي (Avalanche) - البدء بأعلى فائدة
- ✅ مقارنة بين الاستراتيجيتين
- ✅ حساب مدة السداد والفوائد
- ✅ ترتيب الديون حسب الاستراتيجية
- ✅ UI احترافي مع Summary Cards

**استخدام الدوال من `lib/utils/debt-calculator.ts`**:

- `compareStrategies(debts, extraPayment)` ✅
- `calculateSnowballStrategy(debts, extraPayment)` ✅
- `calculateAvalancheStrategy(debts, extraPayment)` ✅

---

## 🔄 المهام قيد التنفيذ

### 1. **إضافة Payment Schedule (جدول السداد)** 🔄

**الهدف**: عرض جدول تفصيلي لـ 24 شهر الأولى من السداد

**المتطلبات**:

- عرض Month-by-Month breakdown
- عرض المبلغ المدفوع والرصيد المتبقي لكل دين
- Progress bar لكل دين
- Export to CSV option

**الحالة**: Pending

---

### 2. **إضافة PDF Export** 🔄

**الهدف**: تصدير تقرير PDF شامل لخطة السداد

**المتطلبات**:

- ملخص الديون والاستراتيجية المختارة
- جدول السداد
- رسوم بيانية (Charts)
- توصيات مخصصة

**التقنية المقترحة**:

- استخدام المكتبة الموجودة: `lib/utils/pdf-generator.ts`
- أو `jsPDF` / `react-pdf`

**الحالة**: Pending

---

## ⏳ المهام المخططة

### 3. **إكمال Smart Budget** (قاعدة 50/30/20)

**الملف**: [app/tools/smart-budget/page.tsx](./app/tools/smart-budget/page.tsx)

**المتطلبات**:

- تطبيق قاعدة 50/30/20 (احتياجات/رغبات/ادخار)
- Pie Chart لعرض توزيع الميزانية
- توصيات تلقائية عند تجاوز النسب
- حفظ الميزانية في Firestore
- ربط مع Dashboard

**الحالة**: Pending

---

### 4. **إنشاء Goal Tracker**

**الملف الجديد**: `app/tools/goal-tracker/page.tsx`

**المتطلبات**:

- إضافة/تحرير/حذف أهداف مالية
- أنواع الأهداف: (طوارئ، دين، منزل، سيارة، تقاعد، حج، حرية مالية)
- Progress bars
- Target date calculations
- تتبع المساهمات الشهرية
- حفظ في Firestore (`goals` collection)
- مزامنة مع Dashboard

**الحالة**: Pending

---

### 5. **حفظ حسابات الأدوات في Firestore**

**الدوال المطلوبة في `lib/firebase/db.ts`**:

```typescript
// حفظ حساب أداة
export async function saveCalculation(
  userId: string,
  toolId: string,
  data: CalculationData
): Promise<string>;

// جلب حسابات أداة معينة
export async function getCalculations(userId: string, toolId: string): Promise<CalculationData[]>;

// جلب آخر حساب لأداة
export async function getLatestCalculation(
  userId: string,
  toolId: string
): Promise<CalculationData | null>;
```

**الأدوات المستهدفة**:

- ✅ Debt Calculator → `calculations/debt/{calculationId}`
- ✅ Budget Planner → `calculations/budget/{calculationId}`
- ✅ Emergency Fund → `calculations/emergency/{calculationId}`
- ✅ Zakat Calculator → `calculations/zakat/{calculationId}`

**الحالة**: Pending

---

### 6. **تكامل Email (Resend/SendGrid)**

**الهدف**: إرسال تقارير PDF عبر البريد الإلكتروني

**الخطوات**:

1. إنشاء حساب Resend أو SendGrid
2. إنشاء `lib/email/` folder
3. دالة `sendDebtReport(email, pdfData, userName)`
4. Email templates (HTML)
5. API Route: `/app/api/send-report/route.ts`
6. اختبار الإرسال

**الحالة**: Pending

---

## 📊 الإحصائيات

| المهمة                 | الحالة           | التقدم   |
| ---------------------- | ---------------- | -------- |
| فحص الصفحات المكررة    | ✅ مكتمل         | 100%     |
| مراجعة Debt Management | ✅ مكتمل         | 100%     |
| Payment Schedule       | 🔄 قيد التخطيط   | 0%       |
| PDF Export             | 🔄 قيد التخطيط   | 0%       |
| Smart Budget           | ⏳ معلق          | 0%       |
| Goal Tracker           | ⏳ معلق          | 0%       |
| حفظ حسابات Firestore   | ⏳ معلق          | 0%       |
| Email Integration      | ⏳ معلق          | 0%       |
| **الإجمالي**           | **🔄 قيد العمل** | **~25%** |

---

## 🎯 الأولويات التالية

بناءً على ACTION_PLAN.md والتقدم الحالي، الأولويات هي:

1. **إكمال Debt Management** (Payment Schedule + PDF)
2. **إكمال Smart Budget** (50/30/20 + Charts)
3. **إنشاء Goal Tracker** (CRUD + Firestore)
4. **حفظ حسابات الأدوات** (Firestore integration)
5. **تكامل Email** (Resend + Templates)

---

## 💡 ملاحظات فنية

### الأدوات الموجودة والحالة

| الأداة           | المسار                   | النوع   | الحالة           |
| ---------------- | ------------------------ | ------- | ---------------- |
| Debt Calculator  | `/tools/debt`            | Free    | ✅ جاهز          |
| Debt Management  | `/tools/debt-management` | Premium | 🔄 يحتاج تحسينات |
| Budget Planner   | `/tools/budget`          | Free    | ✅ جاهز          |
| Smart Budget     | `/tools/smart-budget`    | Premium | ⏳ يحتاج إكمال   |
| Emergency Fund   | `/tools/emergency`       | Free    | ✅ جاهز          |
| Zakat Calculator | `/tools/zakat`           | Free    | ✅ جاهز          |
| Goal Tracker     | `/tools/goal-tracker`    | -       | ❌ غير موجود     |

---

## 📚 الموارد المطلوبة

### Libraries قد نحتاجها:

- [ ] `jspdf` - لتوليد PDF (بديل للموجود)
- [ ] `recharts` - للرسوم البيانية (Charts)
- [ ] `resend` أو `@sendgrid/mail` - لإرسال Email
- [ ] `csv-parser` - لتصدير CSV

### الخدمات الخارجية:

- [ ] Resend/SendGrid Account
- [ ] Email Templates Design

---

## 🚀 الخطة للجلسة القادمة

1. إضافة Payment Schedule لـ Debt Management
2. إضافة PDF Export لـ Debt Management
3. إكمال Smart Budget بـ Charts
4. بداية Goal Tracker

---

**آخر تحديث**: يناير 2025
**الحالة**: Sprint 3 في التقدم - 25% مكتمل
