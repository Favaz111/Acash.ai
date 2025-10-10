import { FileText, Scale, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'شروط الخدمة - Acash.ai',
  description: 'شروط وأحكام استخدام منصة Acash.ai',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'يناير 2025';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Scale className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">شروط الخدمة</h1>
          <p className="text-gray-600">
            آخر تحديث: <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              مرحباً بك في <strong>Acash.ai</strong>. باستخدامك لمنصتنا، فإنك توافق على الالتزام
              بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل الاستخدام.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Acceptance of Terms */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary-trust" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">1. قبول الشروط</h2>
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <p>من خلال الوصول إلى واستخدام Acash.ai، فإنك تقر وتوافق على:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>أنك قرأت وفهمت هذه الشروط</li>
                  <li>أنك توافق على الالتزام بجميع الشروط والأحكام</li>
                  <li>أنك تبلغ من العمر 18 عاماً على الأقل</li>
                  <li>أن المعلومات التي تقدمها صحيحة ودقيقة</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Services Description */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">2. وصف الخدمات</h2>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>Acash.ai منصة مالية ذكية تقدم:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      تشخيص مالي
                    </h3>
                    <p className="text-sm">تحليل شامل لوضعك المالي الحالي</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      أدوات مالية
                    </h3>
                    <p className="text-sm">حاسبات ومخططات مالية متقدمة</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      توصيات ذكية
                    </h3>
                    <p className="text-sm">نصائح مخصصة بالذكاء الاصطناعي</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      تقارير مفصلة
                    </h3>
                    <p className="text-sm">تقارير قابلة للتحميل والمشاركة</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">3. مسؤوليات المستخدم</h2>
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <p className="font-semibold">أنت توافق على:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>استخدام المنصة للأغراض القانونية فقط</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>تقديم معلومات صحيحة ودقيقة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>الحفاظ على سرية كلمة المرور</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>عدم مشاركة حسابك مع الآخرين</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>إخطارنا فوراً بأي استخدام غير مصرح به</span>
                  </li>
                </ul>

                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-900 mb-2">محظور عليك:</p>
                  <ul className="space-y-2 text-red-800">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>محاولة اختراق أو إلحاق الضرر بالمنصة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>استخدام برامج آلية أو روبوتات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>إعادة بيع أو توزيع خدماتنا</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>انتهاك حقوق الملكية الفكرية</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">4. إخلاء المسؤولية</h2>
                </div>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="p-4 bg-yellow-50 border-r-4 border-yellow-500">
                  <p className="font-semibold mb-2">⚠️ مهم:</p>
                  <p>
                    Acash.ai يقدم معلومات مالية عامة وتعليمية فقط. نحن <strong>لسنا</strong>:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 mr-4">
                    <li>مستشارين ماليين مرخصين</li>
                    <li>محاسبين قانونيين</li>
                    <li>مؤسسة مالية أو بنك</li>
                    <li>مقدمي نصائح استثمارية</li>
                  </ul>
                </div>

                <p>التوصيات والمعلومات المقدمة هي لأغراض تعليمية فقط. يجب عليك:</p>

                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>استشارة مستشار مالي مؤهل قبل اتخاذ قرارات مالية مهمة</li>
                  <li>إجراء بحثك الخاص والعناية الواجبة</li>
                  <li>فهم المخاطر المرتبطة بأي قرار مالي</li>
                  <li>عدم الاعتماد بشكل كامل على توصياتنا</li>
                </ul>

                <p className="text-sm font-semibold text-red-600">
                  نحن غير مسؤولين عن أي خسائر أو أضرار ناتجة عن استخدام خدماتنا.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Payment */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. الاشتراكات والدفع</h2>

              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">الخطة المجانية:</h3>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>وصول محدود للميزات الأساسية</li>
                    <li>تشخيص مالي سريع</li>
                    <li>أدوات أساسية</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">الخطة المميزة:</h3>
                  <ul className="list-disc list-inside space-y-1 mr-4">
                    <li>وصول كامل لجميع الميزات</li>
                    <li>دعم أولوية</li>
                    <li>تقارير متقدمة</li>
                    <li>قابلة للإلغاء في أي وقت</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600">
                  جميع المدفوعات آمنة ومشفرة. لا نحفظ معلومات بطاقاتك الائتمانية.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. إنهاء الخدمة</h2>

              <div className="space-y-3 text-gray-700">
                <p>نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة:</p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>انتهاك هذه الشروط</li>
                  <li>نشاط احتيالي أو غير قانوني</li>
                  <li>عدم الدفع (للحسابات المدفوعة)</li>
                  <li>سوء استخدام المنصة</li>
                </ul>

                <p>يمكنك إلغاء حسابك في أي وقت من صفحة الإعدادات.</p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. تعديل الشروط</h2>

              <p className="text-gray-700">
                نحتفظ بالحق في تحديث هذه الشروط في أي وقت. سنقوم بإخطارك بأي تغييرات جوهرية عبر
                البريد الإلكتروني أو من خلال المنصة. استمرارك في استخدام الخدمة بعد التعديلات يعني
                موافقتك عليها.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">اتصل بنا</h2>
              <p className="mb-4">لأي استفسارات حول شروط الخدمة:</p>
              <div className="space-y-2">
                <p>📧 legal@acash.ai</p>
                <p>📞 +966 XX XXX XXXX</p>
                <p>📍 الرياض، المملكة العربية السعودية</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center text-sm text-gray-700">
          <p>باستخدامك لـ Acash.ai، فإنك توافق على هذه الشروط والأحكام بالكامل.</p>
        </div>
      </div>
    </div>
  );
}
