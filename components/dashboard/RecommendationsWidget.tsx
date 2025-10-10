import { Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecommendationsWidgetProps {
  recommendations: string[];
  showAll?: boolean;
}

export function RecommendationsWidget({
  recommendations,
  showAll = false,
}: RecommendationsWidgetProps) {
  const displayedRecs = showAll ? recommendations : recommendations.slice(0, 3);

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            التوصيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">أكمل التشخيص المالي للحصول على توصيات مخصصة</p>
            <Link href="/assessment/quick">
              <Button className="mt-4">
                ابدأ التشخيص السريع
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          التوصيات المالية
        </CardTitle>
        <CardDescription>نصائح مخصصة لتحسين وضعك المالي</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedRecs.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-r-4 border-primary-trust"
            >
              <div className="w-6 h-6 rounded-full bg-primary-trust text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
            </div>
          ))}

          {!showAll && recommendations.length > 3 && (
            <Link href="/assessment">
              <Button variant="outline" className="w-full mt-4">
                عرض جميع التوصيات ({recommendations.length})
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
