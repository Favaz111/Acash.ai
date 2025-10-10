import Link from 'next/link';
import { Home, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-2 border-blue-200">
        <CardHeader className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-7xl">🔍</span>
          </div>
          <CardTitle className="text-3xl text-blue-900 mb-2">404</CardTitle>
          <p className="text-xl text-gray-700 font-semibold">الصفحة غير موجودة</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600" dir="rtl">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
          </p>

          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link href="/">
                <Home className="w-5 h-5 ml-2" />
                العودة للصفحة الرئيسية
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard">
                <ArrowRight className="w-5 h-5 ml-2" />
                لوحة التحكم
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/tools">
                <Search className="w-5 h-5 ml-2" />
                تصفح الأدوات المالية
              </Link>
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" dir="rtl">
            <p className="text-sm text-blue-800 mb-2">
              <strong>💡 اقتراحات مفيدة:</strong>
            </p>
            <ul className="text-sm text-blue-700 mr-6 list-disc space-y-1">
              <li>تحقق من رابط الصفحة (URL)</li>
              <li>ابدأ التشخيص السريع لوضعك المالي</li>
              <li>استكشف أدواتنا المالية الذكية</li>
              <li>راجع لوحة التحكم الخاصة بك</li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Link
              href="/assessment/quick"
              className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all border border-green-200"
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs font-medium text-gray-700">التشخيص</div>
            </Link>
            <Link
              href="/tools/debt"
              className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg hover:shadow-md transition-all border border-orange-200"
            >
              <div className="text-2xl mb-1">💳</div>
              <div className="text-xs font-medium text-gray-700">إدارة الديون</div>
            </Link>
            <Link
              href="/tools"
              className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all border border-purple-200"
            >
              <div className="text-2xl mb-1">🛠️</div>
              <div className="text-xs font-medium text-gray-700">الأدوات</div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
