# إعداد Firebase Admin SDK

## المشكلة

عند تشغيل التطبيق، قد تظهر رسالة خطأ:

```
FirebaseError: Missing or insufficient permissions
```

هذا يحدث لأن Firebase Admin SDK يحتاج إلى **Service Account credentials** للعمل بشكل كامل.

## الحل

### للتطوير المحلي (Development)

#### الخيار 1: تنزيل Service Account Key (موصى به)

1. **افتح Firebase Console**
   - اذهب إلى: https://console.firebase.google.com
   - اختر مشروعك: `acash111-be3fb`

2. **اذهب إلى Project Settings**
   - انقر على أيقونة الترس ⚙️ بجانب "Project Overview"
   - اختر "Project settings"

3. **انتقل إلى Service Accounts**
   - اختر تبويب "Service accounts"
   - انقر على "Generate new private key"
   - سيتم تنزيلملف JSON

4. **احفظ الملف بشكل آمن**
   - **لا تشارك هذا الملف أبداً** - يحتوي على مفاتيح سرية
   - **لا ترفعه على Git** - الملف `.gitignore` يجب أن يتضمنه

5. **أضف المفتاح لملف `.env.local`**

   ```bash
   # افتح الملف الذي تم تنزيله وانسخ محتوياته
   # ثم ألصقها في سطر واحد في .env.local

   FIREBASE_ADMIN_SERVICE_ACCOUNT={"type":"service_account","project_id":"acash111-be3fb",...}
   ```

   **مهم جداً:** المحتوى كله يجب أن يكون في سطر واحد بدون فواصل أسطر.

#### الخيار 2: استخدام ملف منفصل

1. **احفظ الملف المنزل في مجلد آمن**

   ```
   Acash.ai/firebase-admin-key.json
   ```

2. **تأكد من إضافته لـ `.gitignore`**

   ```
   firebase-admin-key.json
   *.json
   ```

3. **أضف المسار في `.env.local`**
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-key.json
   ```

### للإنتاج (Production)

#### على Vercel:

1. **اذهب إلى Vercel Dashboard**
   - اختر مشروعك
   - اذهب إلى Settings → Environment Variables

2. **أضف متغير البيئة**
   - Name: `FIREBASE_ADMIN_SERVICE_ACCOUNT`
   - Value: المحتوى الكامل لملف Service Account JSON (في سطر واحد)
   - Environment: Production, Preview, Development

#### على منصات أخرى:

استخدم نفس الطريقة - أضف `FIREBASE_ADMIN_SERVICE_ACCOUNT` كمتغير بيئة.

## التحقق من التثبيت

بعد إعداد Service Account، أعد تشغيل السيرفر:

```bash
npm run dev
```

يجب أن ترى في Console:

```
✅ Firebase Admin initialized with service account
```

## الميزات التي تحتاج Firebase Admin

- **Stripe Webhooks** - حفظ بيانات الاشتراكات
- **User Management** - إدارة المستخدمين من الـ API
- **Server-side Authentication** - التحقق من التوكنات
- **Firestore من Server** - الكتابة والقراءة مع صلاحيات كاملة

## البدائل في التطوير

إذا كنت لا تحتاج لميزات Stripe/Admin في الوقت الحالي، يمكنك:

1. استخدام Firebase Client SDK فقط (موجود بالفعل)
2. تعطيل/تخطي الـ API routes التي تحتاج Admin
3. العمل على الميزات الأخرى أولاً

## الأمان

⚠️ **تحذيرات مهمة:**

1. **لا تشارك Service Account Key** - يمنح صلاحيات كاملة للمشروع
2. **لا ترفعه على Git** - استخدم `.gitignore`
3. **استخدم Environment Variables** - خاصة في Production
4. **قم بتدوير المفاتيح بشكل دوري** - للأمان
5. **راقب الاستخدام** - في Firebase Console

## المساعدة

إذا واجهت مشاكل:

- تحقق من صحة تنسيق JSON
- تأكد من عدم وجود فواصل أسطر في Environment Variable
- راجع Firebase Console للأخطاء
- تحقق من Firestore Rules

## الوثائق الرسمية

- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Service Account Keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
