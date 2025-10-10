# 🔥 دليل نشر Firebase - Acash.ai

## 📋 المتطلبات الأساسية

- [x] حساب Firebase (مجاني)
- [x] Firebase CLI installed: `npm install -g firebase-tools`
- [x] Node.js 18+

---

## 🚀 الخطوات التفصيلية

### 1. إنشاء مشروع Firebase

#### أ. انتقل إلى Firebase Console

🔗 https://console.firebase.google.com

#### ب. إنشاء مشروع جديد

1. اضغط "Add project"
2. اسم المشروع: `acash-ai` (أو أي اسم تختاره)
3. فعّل Google Analytics (اختياري)
4. انتظر إنشاء المشروع (1-2 دقيقة)

---

### 2. تفعيل الخدمات المطلوبة

#### أ. Authentication

```
1. من القائمة اليسرى: Build → Authentication
2. اضغط "Get started"
3. Sign-in method → فعّل "Email/Password"
4. احفظ التغييرات
```

#### ب. Firestore Database

```
1. من القائمة اليسرى: Build → Firestore Database
2. اضغط "Create database"
3. اختر Mode:
   - Start in production mode (نستخدم rules مخصصة)
4. Location: اختر أقرب موقع (مثل: asia-south1)
5. Enable
```

#### ج. Storage (اختياري)

```
1. من القائمة اليسرى: Build → Storage
2. اضغط "Get started"
3. Start in production mode
4. اختر نفس Location
5. Done
```

---

### 3. الحصول على مفاتيح التكوين

#### أ. إعدادات المشروع

```
1. اضغط على أيقونة الإعدادات ⚙️ → Project settings
2. انزل لأسفل إلى "Your apps"
3. اضغط على أيقونة Web "</>"
4. سجّل اسم التطبيق: "Acash.ai Web"
5. لا تختر Firebase Hosting الآن
6. Register app
```

#### ب. انسخ المفاتيح

ستظهر لك مفاتيح مثل:

```javascript
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

### 4. تكوين التطبيق المحلي

#### أ. إنشاء ملف `.env.local`

```bash
# في المجلد الرئيسي للمشروع
cp .env.example .env.local
```

#### ب. ملء المفاتيح في `.env.local`

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=acash-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=acash-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=acash-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **مهم**: لا ترفع `.env.local` إلى Git أبداً!

---

### 5. نشر Security Rules

#### أ. تسجيل الدخول إلى Firebase

```bash
firebase login
```

#### ب. تهيئة المشروع

```bash
# في مجلد المشروع
firebase init

# اختر:
☑ Firestore
☑ Storage (إذا فعّلته)

# Project Setup:
? Select a default Firebase project → اختر acash-ai

# Firestore Setup:
? What file should be used for Firestore Rules? → firestore.rules
? What file should be used for Firestore indexes? → firestore.indexes.json

# Storage Setup (إذا اخترته):
? What file should be used for Storage Rules? → storage.rules
```

#### ج. نشر Rules

```bash
# نشر Firestore Rules
firebase deploy --only firestore:rules

# نشر Storage Rules (إذا استخدمته)
firebase deploy --only storage:rules
```

✅ **تأكد من الرسالة**:

```
✔  Deploy complete!
```

---

### 6. التحقق من التكوين

#### أ. اختبار محلي

```bash
# شغّل التطبيق
npm run dev

# افتح المتصفح
http://localhost:3000

# جرّب:
1. إنشاء حساب جديد
2. تسجيل الدخول
3. إكمال Assessment
```

#### ب. تحقق من Firestore Console

```
1. اذهب إلى Firestore Database في Console
2. يجب أن ترى:
   - مجموعة users
   - مجموعة assessments
```

---

### 7. نشر التطبيق (Production)

#### الخيار 1: Vercel (موصى به لـ Next.js)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. أضف Environment Variables في Vercel Dashboard
# Settings → Environment Variables
# أضف جميع متغيرات .env.local

# 4. Redeploy
vercel --prod
```

#### الخيار 2: Firebase Hosting

```bash
# 1. إعداد Hosting
firebase init hosting

# Build command: npm run build
# Public directory: .next
# Single-page app: No
# GitHub auto-deploy: اختياري

# 2. Build
npm run build

# 3. Deploy
firebase deploy --only hosting
```

---

## 🔒 Security Checklist

### قبل Production:

- [ ] ✅ Firebase Rules منشورة
- [ ] ✅ Environment variables في Production
- [ ] ✅ `.env.local` في `.gitignore`
- [ ] ✅ Email verification مفعّل
- [ ] ✅ Rate limiting (اختياري)
- [ ] ✅ CORS configured إذا لزم
- [ ] ✅ Custom domain + SSL (إذا كان لديك)

---

## 🧪 اختبار Security Rules

### اختبار يدوي:

```javascript
// في Console المتصفح
// 1. جرّب قراءة user آخر (يجب أن يفشل)
const otherUserDoc = await getDoc(doc(db, 'users', 'other-user-id'));
// ❌ Error: Missing or insufficient permissions

// 2. جرّب قراءة بياناتك (يجب أن ينجح)
const myDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
// ✅ Success
```

### Firestore Rules Testing Tool:

```
1. Firebase Console → Firestore Database → Rules tab
2. اضغط "Simulator"
3. اختبر scenarios مختلفة
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة 1: "Firebase: Error (auth/invalid-api-key)"

**الحل**:

```bash
# تحقق من .env.local
# تأكد أن جميع المفاتيح صحيحة
# أعد تشغيل dev server
npm run dev
```

### المشكلة 2: "Missing or insufficient permissions"

**الحل**:

```bash
# تحقق من نشر Rules
firebase deploy --only firestore:rules

# تحقق من تسجيل الدخول
# user يجب أن يكون authenticated
```

### المشكلة 3: "Network request failed"

**الحل**:

```bash
# تحقق من:
1. الاتصال بالإنترنت
2. Firebase project مفعّل
3. Firestore Database موجود
```

### المشكلة 4: "Quota exceeded"

**الحل**:

```
Firebase Free Plan Limits:
- Firestore: 50K reads/day, 20K writes/day
- Storage: 1GB, 10GB/month transfer
- Authentication: Unlimited

Upgrade to Blaze Plan إذا تجاوزت
```

---

## 📊 مراقبة الاستخدام

### Firebase Console Monitoring:

```
1. Project Overview → Usage and billing
2. راقب:
   - Authentication users
   - Firestore operations
   - Storage usage
```

### تنبيهات:

```
1. اذهب إلى Budget & alerts
2. ضع حد أقصى (مثلاً $10/month)
3. فعّل Email notifications
```

---

## 🔐 Best Practices

### 1. Environment Variables

```bash
# Production
NEXT_PUBLIC_APP_URL=https://acash.ai

# Staging
NEXT_PUBLIC_APP_URL=https://staging.acash.ai

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Backup Strategy

```bash
# Automated backup (Firestore)
gcloud firestore export gs://acash-ai-backups

# أو استخدم Firebase Extensions
# Firestore Backup → Schedule daily
```

### 3. Security Headers (Next.js)

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 📚 موارد إضافية

- 📖 [Firebase Docs](https://firebase.google.com/docs)
- 📖 [Next.js Deployment](https://nextjs.org/docs/deployment)
- 📖 [Vercel Platform](https://vercel.com/docs)
- 📖 [Security Rules Reference](https://firebase.google.com/docs/rules)

---

## ✅ Deployment Checklist

### Pre-deployment:

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript check passes (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Firebase Rules deployed
- [ ] Security audit done

### Post-deployment:

- [ ] Test authentication flow
- [ ] Test assessment flow
- [ ] Check Firestore data
- [ ] Verify all pages load
- [ ] Test on mobile
- [ ] Check performance (Lighthouse)
- [ ] Setup monitoring
- [ ] Configure backups

---

**آخر تحديث**: 2025-10-02
**الإصدار**: 1.0
**الحالة**: Production-Ready ✅
