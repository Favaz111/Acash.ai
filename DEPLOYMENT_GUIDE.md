# 🚀 دليل النشر - Acash.ai

## 📋 المحتويات

1. [نشر على Vercel](#نشر-على-vercel)
2. [إعداد Firebase](#إعداد-firebase)
3. [متغيرات البيئة](#متغيرات-البيئة)
4. [التشغيل المحلي](#التشغيل-المحلي)

---

## 🌐 نشر على Vercel

### الطريقة 1: من GitHub (موصى بها)

1. **اذهب إلى [Vercel](https://vercel.com)**
2. **سجل دخول** باستخدام حساب GitHub
3. **انقر على "New Project"**
4. **استورد المشروع**:
   - اختر repository: `Favaz111/Acash.ai`
   - اختر branch: `cursor/share-application-documentation-and-roadmap-e357`
5. **اضغط Deploy**

### الطريقة 2: من سطر الأوامر

```bash
# 1. ثبت Vercel CLI
npm install -g vercel

# 2. سجل دخول
vercel login

# 3. انشر المشروع
vercel --prod
```

---

## 🔥 إعداد Firebase

### الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. انقر "Add Project"
3. أدخل اسم المشروع: `acash-ai`
4. فعّل Google Analytics (اختياري)
5. اضغط "Create Project"

### الخطوة 2: إعداد Authentication

```
Firebase Console → Build → Authentication → Get Started
→ Sign-in method → Enable:
   ✅ Email/Password
   ✅ Google
```

### الخطوة 3: إعداد Firestore Database

```
Firebase Console → Build → Firestore Database → Create Database
→ اختر:
   - Location: (اختر أقرب منطقة)
   - Rules: Start in production mode
```

### الخطوة 4: إعداد Storage

```
Firebase Console → Build → Storage → Get Started
→ اختر نفس location السابق
```

### الخطوة 5: الحصول على معلومات المشروع

```javascript
// Firebase Console → Project Settings → General → Your apps
// اضغط على أيقونة </> (Web)
// سجل التطبيق ثم انسخ المعلومات

const firebaseConfig = {
  apiKey: 'AIzaSy...',
  authDomain: 'acash-ai.firebaseapp.com',
  projectId: 'acash-ai',
  storageBucket: 'acash-ai.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123',
};
```

---

## 🔐 متغيرات البيئة

### إنشاء ملف `.env.local`

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=acash-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=acash-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=acash-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# AI Configuration (Optional - للمرحلة التالية)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://acash.ai
```

### إضافة المتغيرات في Vercel

```
Vercel Dashboard → Project Settings → Environment Variables
→ أضف كل متغير من الأعلى
```

---

## 💻 التشغيل المحلي

### المتطلبات

- Node.js 18+
- npm أو yarn
- Git

### التثبيت والتشغيل

```bash
# 1. استنسخ المشروع
git clone https://github.com/Favaz111/Acash.ai.git
cd Acash.ai

# 2. ثبت الحزم
npm install

# 3. أنشئ ملف .env.local
cp .env.example .env.local
# ثم عدّل القيم

# 4. شغّل الخادم
npm run dev

# 5. افتح المتصفح
# http://localhost:3000
```

---

## 🔧 النشر المتقدم

### تحديث تلقائي عند الـ Push

```bash
# كل push للـ main branch سيُنشر تلقائياً على Vercel

git add .
git commit -m "feat: new feature"
git push origin main
```

### Preview Deployments

```bash
# كل PR سيحصل على preview deployment خاص

git checkout -b feature/new-feature
git push origin feature/new-feature
# افتح PR على GitHub
# سيظهر رابط Preview في التعليقات
```

---

## 📊 المراقبة والتحليلات

### Vercel Analytics

```
Vercel Dashboard → Analytics
→ ستجد:
   - الزوار
   - سرعة الموقع
   - Core Web Vitals
```

### Firebase Analytics

```javascript
// سيتم إعداده في المرحلة القادمة
// Firebase Console → Analytics Dashboard
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة: Build Failed

```bash
# تأكد من:
1. جميع الـ dependencies مثبتة
2. لا توجد أخطاء TypeScript
3. ملف .env.local موجود (محلياً فقط)
4. Environment Variables مضافة في Vercel
```

### مشكلة: Firebase لا يعمل

```bash
# تأكد من:
1. Firebase config صحيح
2. Authentication مفعّل
3. Firestore Rules مضبوطة
4. المتغيرات البيئية صحيحة
```

---

## ✅ قائمة التحقق قبل الإطلاق

- [ ] Firebase Project جاهز
- [ ] Authentication مفعّل
- [ ] Firestore Database جاهز
- [ ] Environment Variables مضافة
- [ ] التطبيق يعمل محلياً
- [ ] اختبار جميع الصفحات
- [ ] نشر على Vercel
- [ ] اختبار النسخة المنشورة
- [ ] تفعيل Domain مخصص (اختياري)

---

## 🌟 خطوات إضافية (اختيارية)

### ربط Domain مخصص

```
Vercel Dashboard → Project → Settings → Domains
→ Add Domain: acash.ai
→ اتبع التعليمات لتحديث DNS
```

### تفعيل HTTPS (تلقائي)

```
Vercel يوفر SSL مجاناً لكل النطاقات
```

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. راجع [Vercel Docs](https://vercel.com/docs)
2. راجع [Firebase Docs](https://firebase.google.com/docs)
3. افتح Issue على GitHub

---

**آخر تحديث:** 2025-10-01  
**الإصدار:** 1.0.0 (MVP)
