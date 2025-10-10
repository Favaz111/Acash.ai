'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  HandCoins,
  CheckCircle,
  // Zap,
  Download,
  Mail,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
// @ts-ignore
import { ZakatCalculatorSchema } from '@/lib/validations/calculators';

interface ZakatResult {
  totalZakat: number;
  cashZakat: number;
  goldZakat: number;
  silverZakat: number;
  stocksZakat: number;
  realEstateZakat: number;
  nisab: number;
  isAboveNisab: boolean;
}

export default function ZakatCalculatorPage() {
  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [stocks, setStocks] = useState<number>(0);
  const [realEstate, setRealEstate] = useState<number>(0);
  const [results, setResults] = useState<ZakatResult | null>(null);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // نصاب الزكاة بالريال السعودي (تقريبي - يتغير حسب سعر الذهب)
  const NISAB_AMOUNT = 20000; // تقريباً 85 جرام ذهب
  const ZAKAT_RATE = 0.025; // 2.5%

  const calculateZakat = () => {
    // Validate inputs first
    const validation = ZakatCalculatorSchema.safeParse({
      cash,
      gold,
      silver,
      investments: stocks + realEstate,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    // حساب الزكاة لكل نوع من الأموال
    const cashZakat = cash * ZAKAT_RATE;
    const goldZakat = gold * ZAKAT_RATE;
    const silverZakat = silver * ZAKAT_RATE;
    const stocksZakat = stocks * ZAKAT_RATE;
    const realEstateZakat = realEstate * ZAKAT_RATE;

    const totalAssets = cash + gold + silver + stocks + realEstate;
    const totalZakat = cashZakat + goldZakat + silverZakat + stocksZakat + realEstateZakat;
    const isAboveNisab = totalAssets >= NISAB_AMOUNT;

    const result: ZakatResult = {
      totalZakat,
      cashZakat,
      goldZakat,
      silverZakat,
      stocksZakat,
      realEstateZakat,
      nisab: NISAB_AMOUNT,
      isAboveNisab,
    };

    setResults(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>

          <Link
            href="/tools"
            className="flex items-center gap-2 text-gray-700 hover:text-primary-trust transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الأدوات المالية</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-success rounded-2xl mb-4">
            <HandCoins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">حاسبة الزكاة</h1>
          <p className="text-xl text-gray-600">احسب زكاة أموالك وأصولك بدقة شرعية</p>
        </div>

        {/* Nisab Info Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">معلومة مهمة عن النصاب</h3>
                <p className="text-sm text-blue-800 mb-2">
                  النصاب هو الحد الأدنى للمال الذي تجب فيه الزكاة. النصاب الحالي تقريباً{' '}
                  <strong>{formatCurrency(NISAB_AMOUNT)}</strong> (قيمة 85 جرام ذهب).
                </p>
                <p className="text-sm text-blue-800">
                  إذا بلغت أموالك النصاب ومضى عليها الحول (سنة قمرية)، تجب عليك الزكاة بنسبة 2.5%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>أدخل قيمة أموالك وأصولك</CardTitle>
              <CardDescription>املأ الحقول التي تنطبق عليك (بالريال السعودي)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="النقد والأموال السائلة (ريال)"
                  type="number"
                  placeholder="50000"
                  value={cash || ''}
                  onChange={(e) => {
                    setCash(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, cash: '' }));
                  }}
                  helperText="الأموال في البنوك والمحفظة"
                />
                {errors['cash'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['cash']}</p>
                )}
              </div>

              <div>
                <Input
                  label="قيمة الذهب (ريال)"
                  type="number"
                  placeholder="30000"
                  value={gold || ''}
                  onChange={(e) => {
                    setGold(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, gold: '' }));
                  }}
                  helperText="قيمة الذهب المدخر (ليس الحلي المستخدم)"
                />
                {errors['gold'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['gold']}</p>
                )}
              </div>

              <div>
                <Input
                  label="قيمة الفضة (ريال)"
                  type="number"
                  placeholder="5000"
                  value={silver || ''}
                  onChange={(e) => {
                    setSilver(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, silver: '' }));
                  }}
                  helperText="قيمة الفضة المدخرة"
                />
                {errors['silver'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['silver']}</p>
                )}
              </div>

              <div>
                <Input
                  label="الأسهم والاستثمارات (ريال)"
                  type="number"
                  placeholder="100000"
                  value={stocks || ''}
                  onChange={(e) => {
                    setStocks(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, investments: '' }));
                  }}
                  helperText="قيمة الأسهم والصناديق الاستثمارية"
                />
                {errors['investments'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['investments']}</p>
                )}
              </div>

              <div>
                <Input
                  label="العقارات الاستثمارية (ريال)"
                  type="number"
                  placeholder="500000"
                  value={realEstate || ''}
                  onChange={(e) => {
                    setRealEstate(parseFloat(e.target.value));
                    setErrors((prev) => ({ ...prev, investments: '' }));
                  }}
                  helperText="قيمة العقارات المخصصة للاستثمار (ليس السكن الخاص)"
                />
                {errors['investments'] && (
                  <p className="text-sm text-red-600 mt-1">{errors['investments']}</p>
                )}
              </div>

              <Button onClick={calculateZakat} className="w-full" size="lg">
                احسب الزكاة
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>نتائج حساب الزكاة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Nisab Status */}
                  {results.isAboveNisab ? (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <p className="font-bold text-green-900 mb-1">أموالك بلغت النصاب</p>
                      <p className="text-sm text-green-700">الزكاة واجبة عليك (2.5%)</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                      <Info className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <p className="font-bold text-blue-900 mb-1">أموالك لم تبلغ النصاب</p>
                      <p className="text-sm text-blue-700">
                        الزكاة غير واجبة (أموالك أقل من {formatCurrency(NISAB_AMOUNT)})
                      </p>
                    </div>
                  )}

                  {/* Total Zakat */}
                  {results.isAboveNisab && (
                    <>
                      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-center text-white">
                        <p className="text-sm opacity-90 mb-2">إجمالي الزكاة الواجبة</p>
                        <p className="text-5xl font-bold mb-1">
                          {formatCurrency(results.totalZakat)}
                        </p>
                        <p className="text-sm opacity-90">2.5% من مجموع أموالك</p>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">تفصيل الزكاة:</h4>

                        {results.cashZakat > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-600">زكاة النقد</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(results.cashZakat)}
                            </span>
                          </div>
                        )}

                        {results.goldZakat > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-600">زكاة الذهب</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(results.goldZakat)}
                            </span>
                          </div>
                        )}

                        {results.silverZakat > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-600">زكاة الفضة</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(results.silverZakat)}
                            </span>
                          </div>
                        )}

                        {results.stocksZakat > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-600">زكاة الأسهم</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(results.stocksZakat)}
                            </span>
                          </div>
                        )}

                        {results.realEstateZakat > 0 && (
                          <div className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                            <span className="text-sm text-gray-600">زكاة العقارات</span>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(results.realEstateZakat)}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Zakat Tips */}
        {results && results.isAboveNisab && (
          <Card className="mt-8 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">💡 نصائح مهمة عن الزكاة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">شرط الحول</p>
                    <p className="text-sm text-green-800">
                      يجب أن يمر عام هجري (354 يوم) على امتلاك المال
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">الديون</p>
                    <p className="text-sm text-green-800">يُخصم الدين من المال قبل حساب الزكاة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">العقار السكني</p>
                    <p className="text-sm text-green-800">
                      لا زكاة على السكن الخاص، فقط العقارات الاستثمارية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">الذهب المستعمل</p>
                    <p className="text-sm text-green-800">
                      لا زكاة على الحلي المستخدم للزينة (على الراجح)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">التعجيل</p>
                    <p className="text-sm text-green-800">يجوز إخراج الزكاة قبل موعدها</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">مصارف الزكاة</p>
                    <p className="text-sm text-green-800">
                      الفقراء والمساكين وابن السبيل والغارمين وغيرهم
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eligible Recipients */}
        {results && results.isAboveNisab && (
          <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">🎯 مصارف الزكاة الثمانية</CardTitle>
              <CardDescription>الجهات المستحقة للزكاة كما ذكرها الله في القرآن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: 'الفقراء', desc: 'من لا يملكون شيئاً أو قليلاً لا يكفيهم' },
                  { title: 'المساكين', desc: 'من لديهم بعض المال لكنه لا يكفيهم' },
                  { title: 'العاملون عليها', desc: 'من يجمعون الزكاة ويوزعونها' },
                  { title: 'المؤلفة قلوبهم', desc: 'المسلمون الجدد أو من يُرجى إسلامهم' },
                  { title: 'في الرقاب', desc: 'تحرير العبيد والأسرى' },
                  { title: 'الغارمون', desc: 'المدينون العاجزون عن السداد' },
                  { title: 'في سبيل الله', desc: 'المجاهدون والمشاريع الخيرية' },
                  { title: 'ابن السبيل', desc: 'المسافر المنقطع عن ماله' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-lg">
                    <p className="font-semibold text-blue-900 mb-1">
                      {i + 1}. {item.title}
                    </p>
                    <p className="text-sm text-blue-700">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Export Section */}
        {results && results.isAboveNisab && (
          <Card className="mt-8 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-6 h-6 text-green-600" />
                احصل على تقرير الزكاة المفصل
              </CardTitle>
              <CardDescription>تقرير PDF شرعي (3 صفحات) يحتوي على:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    'حساب الزكاة المفصل',
                    'توزيع الزكاة حسب نوع المال',
                    'شرح النصاب وشروط الزكاة',
                    'مصارف الزكاة الثمانية',
                    'نصائح شرعية مهمة',
                    'تذكير بموعد الزكاة القادم',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Mail className="w-4 h-4 ml-2" />
                    إرسال بالبريد
                  </Button>
                  <Button className="sm:w-auto bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 ml-2" />
                    تحميل PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Notice */}
        <Card className="mt-8 border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2">ملاحظة مهمة</h3>
                <p className="text-sm text-orange-800">
                  هذه الحاسبة تقدم تقديراً أولياً للزكاة. للحصول على فتوى دقيقة تناسب حالتك الخاصة،
                  يُنصح بمراجعة عالم دين متخصص أو هيئة الزكاة والدخل في بلدك.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
