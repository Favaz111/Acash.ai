'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Calculator, ArrowLeft, HandCoins, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// @ts-ignore - imported for future validation
import { ZakatCalculatorSchema } from '@/lib/validations/calculators';
import { generateZakatPDF } from '@/lib/utils/pdf-generator';
// @ts-ignore - used in PDF generation
import { formatCurrency } from '@/lib/utils';

export default function ZakatCalculatorPage() {
  const [cash, setCash] = useState('');
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [stocks, setStocks] = useState('');
  const [business, setBusiness] = useState('');
  const [zakatAmount, setZakatAmount] = useState(0);

  const calculateZakat = () => {
    const totalWealth =
      parseFloat(cash || '0') +
      parseFloat(gold || '0') * 2000 + // Assuming gold price per gram
      parseFloat(silver || '0') * 25 + // Assuming silver price per gram
      parseFloat(stocks || '0') +
      parseFloat(business || '0');

    const nisab = 85 * 2000; // 85 grams of gold * gold price
    if (totalWealth >= nisab) {
      setZakatAmount(totalWealth * 0.025); // 2.5% zakat
    } else {
      setZakatAmount(0);
    }
  };

  
  const handleDownloadPDF = () => {
    if (zakatAmount === 0) return;
    const totalWealth =
      parseFloat(cash || '0') +
      parseFloat(gold || '0') * 2000 +
      parseFloat(silver || '0') * 25 +
      parseFloat(stocks || '0') +
      parseFloat(business || '0');

    try {
      generateZakatPDF({
        cash: parseFloat(cash || '0'),
        gold: parseFloat(gold || '0') * 2000,
        silver: parseFloat(silver || '0') * 25,
        investments: parseFloat(stocks || '0'),
        businessAssets: parseFloat(business || '0'),
        liabilities: 0,
        totalWealth,
        zakatAmount,
        nisab: 85 * 2000,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/tools" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            العودة للأدوات
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HandCoins className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🤲 حاسبة الزكاة الشرعية
            </h1>
            <p className="text-xl text-gray-600">
              احسب زكاة أموالك بدقة وفقاً للشريعة الإسلامية
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  أدخل بياناتك المالية
                </CardTitle>
                <CardDescription>
                  أدخل قيمة أموالك النقدية والمعادن الثمينة والأصول
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">النقود والسندات (ريال)</div>
                  <Input
                    type="number"
                    placeholder="مثال: 50000"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">الذهب (جرام)</div>
                  <Input
                    type="number"
                    placeholder="مثال: 100"
                    value={gold}
                    onChange={(e) => setGold(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">سعر الجرام: 2000 ريال</p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">الفضة (جرام)</div>
                  <Input
                    type="number"
                    placeholder="مثال: 500"
                    value={silver}
                    onChange={(e) => setSilver(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">سعر الجرام: 25 ريال</p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">الأسهم والاستثمارات (ريال)</div>
                  <Input
                    type="number"
                    placeholder="مثال: 100000"
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                  />
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">الأصول التجارية (ريال)</div>
                  <Input
                    type="number"
                    placeholder="مثال: 200000"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                  />
                </div>

                <Button onClick={calculateZakat} className="w-full">
                  احسب الزكاة
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>نتيجة حساب الزكاة</CardTitle>
                <CardDescription>
                  بناءً على البيانات المدخلة وحسب الشريعة الإسلامية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {zakatAmount > 0 ? (
                  <>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {zakatAmount.toLocaleString()} ريال
                      </div>
                      <p className="text-green-700">قيمة الزكاة الواجبة</p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">تفاصيل الحساب:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">نصاب الزكاة:</div>
                        <div className="font-medium">170,000 ريال</div>
                        
                        <div className="text-gray-600">نسبة الزكاة:</div>
                        <div className="font-medium">2.5%</div>
                        
                        <div className="text-gray-600">حالة الزكاة:</div>
                        <div className="font-medium text-green-600">واجبة</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold mb-2">💡 نصيحة:</h4>
                      <p className="text-sm text-blue-700">
                        يمكنك توزيع الزكاة على الفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم 
                        وفي الرقاب والغارمين وفي سبيل الله وابن السبيل.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <Button onClick={handleDownloadPDF} disabled={zakatAmount === 0} className="w-full mt-4">
                      <Download className="w-4 h-4 ml-2" />
                      تحميل تقرير PDF
                    </Button>
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>أدخل بياناتك المالية ثم اضغط على "احسب الزكاة"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>معلومات مهمة عن الزكاة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">📋 شروط وجوب الزكاة:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>أن يبلغ المال النصاب (85 جرام ذهب أو ما يعادله)</li>
                    <li>أن يحول عليه الحول (سنة قمرية كاملة)</li>
                    <li>أن يكون المال نامياً أو قابلاً للنماء</li>
                    <li>أن يكون المال مملوكاً ملكاً تاماً</li>
                    <li>أن يكون المال فاضلاً عن الحوائج الأصلية</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🎯 مصارف الزكاة:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>الفقراء والمساكين</li>
                    <li>العاملين عليها</li>
                    <li>المؤلفة قلوبهم</li>
                    <li>في الرقاب (تحرير العبيد)</li>
                    <li>الغارمين (المدينين)</li>
                    <li>في سبيل الله</li>
                    <li>ابن السبيل (المسافر المحتاج)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
