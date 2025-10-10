import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthScoreWidgetProps {
  score: number;
  label: string;
  color: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function HealthScoreWidget({ score, label, color, icon, trend }: HealthScoreWidgetProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
          <div className="text-2xl">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-lg text-gray-500">/100</span>
          </div>

          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : trend.value === 0 ? (
                <Minus className="w-4 h-4 text-gray-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm ${
                  trend.isPositive
                    ? 'text-green-600'
                    : trend.value === 0
                      ? 'text-gray-400'
                      : 'text-red-600'
                }`}
              >
                {trend.value > 0 && '+'}
                {trend.value}%
              </span>
              <span className="text-xs text-gray-500">من الشهر الماضي</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
