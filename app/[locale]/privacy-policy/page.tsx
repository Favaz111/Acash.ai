import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'سياسة الخصوصية - Acash.ai',
  description: 'سياسة الخصوصية وحماية البيانات في Acash.ai',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'يناير 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Shield className="w-8 h-8 text-primary-trust" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-600">
            آخر تحديث: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              في <strong>Acash.ai</strong>، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة
              توضح كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Data Collection */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="w-6 h-6 text-primary-trust" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">البيانات التي نجمعها</h2>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. المعلومات الشخصية:</h3>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>الاسم الكامل</li>
                    <li>البريد الإلكتروني</li>
                    <li>رقم الهاتف (اختياري)</li>
                    <li>تاريخ الميلاد (للتخطيط المالي)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">2. المعلومات المالية:</h3>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>الدخل الشهري والمصروفات</li>
                    <li>معلومات الديون (الأنواع والمبالغ)</li>
                    <li>الأهداف المالية</li>
                    <li>عادات الادخار والإنفاق</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>ملاحظة:</strong> لا نطلب أبداً أرقام حسابات بنكية أو كلمات مرور مصرفية
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">3. البيانات التقنية:</h3>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>عنوان IP</li>
                    <li>نوع المتصفح والجهاز</li>
                    <li>سجلات الاستخدام</li>
                    <li>ملفات تعريف الارتباط (Cookies)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">كيف نستخدم بياناتك</h2>
                </div>
              </div>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">•</span>
                  <span>
                    <strong>تقديم الخدمة:</strong> تحليل وضعك المالي وتقديم توصيات مخصصة
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">•</span>
                  <span>
                    <strong>التحسين المستمر:</strong> تطوير وتحسين خدماتنا وميزاتنا
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">•</span>
                  <span>
                    <strong>التواصل:</strong> إرسال تحديثات ونصائح مالية (بموافقتك)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">•</span>
                  <span>
                    <strong>الأمان:</strong> منع الاحتيال وحماية حسابك
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">•</span>
                  <span>
                    <strong>الامتثال القانوني:</strong> الالتزام بالقوانين واللوائح
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">كيف نحمي بياناتك</h2>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>نستخدم أفضل الممارسات الأمنية لحماية معلوماتك:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">🔐 تشفير البيانات</h3>
                    <p className="text-sm">
                      جميع البيانات مشفرة أثناء النقل والتخزين باستخدام SSL/TLS
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">🛡️ جدران حماية</h3>
                    <p className="text-sm">خوادم محمية بجدران حماية متقدمة</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">👥 وصول محدود</h3>
                    <p className="text-sm">فقط الموظفون المصرح لهم يمكنهم الوصول للبيانات</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">📊 مراقبة مستمرة</h3>
                    <p className="text-sm">مراقبة الأنظمة على مدار الساعة للكشف عن التهديدات</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Eye className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">حقوقك</h2>
                </div>
              </div>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">✓</span>
                  <span>
                    <strong>الوصول:</strong> يمكنك طلب نسخة من بياناتك الشخصية
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">✓</span>
                  <span>
                    <strong>التصحيح:</strong> يمكنك تحديث أو تصحيح بياناتك
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">✓</span>
                  <span>
                    <strong>الحذف:</strong> يمكنك طلب حذف حسابك وبياناتك
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">✓</span>
                  <span>
                    <strong>الاعتراض:</strong> يمكنك الاعتراض على معالجة معينة لبياناتك
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-trust font-bold mt-1">✓</span>
                  <span>
                    <strong>النقل:</strong> يمكنك طلب نقل بياناتك لمزود آخر
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ملفات تعريف الارتباط (Cookies)
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <p>نستخدم ملفات تعريف الارتباط لتحسين تجربتك:</p>

                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>
                    <strong>ملفات ضرورية:</strong> لتشغيل الموقع بشكل صحيح
                  </li>
                  <li>
                    <strong>ملفات وظيفية:</strong> لحفظ تفضيلاتك
                  </li>
                  <li>
                    <strong>ملفات تحليلية:</strong> لفهم كيفية استخدام الموقع
                  </li>
                </ul>

                <p className="text-sm text-gray-600">
                  يمكنك التحكم في ملفات تعريف الارتباط من إعدادات متصفحك.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gradient-to-r from-primary-trust to-primary-innovation text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">هل لديك أسئلة؟</h2>
              <p className="mb-4">
                إذا كان لديك أي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا:
              </p>
              <div className="space-y-2">
                <p>📧 البريد الإلكتروني: privacy@acash.ai</p>
                <p>📞 الهاتف: +966 XX XXX XXXX</p>
                <p>📍 العنوان: الرياض، المملكة العربية السعودية</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>نحتفظ بالحق في تحديث هذه السياسة. سنقوم بإخطارك بأي تغييرات جوهرية.</p>
        </div>
      </div>
    </div>
  );
}
