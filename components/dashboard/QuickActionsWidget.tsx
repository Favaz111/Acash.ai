import { Link } from '@/i18n/navigation';
import { Calculator, Target, PiggyBank, TrendingUp, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const quickActions = [
  {
    icon: Calculator,
    title: 'حاسبة الديون',
    description: 'خطط لسداد ديونك بأذكى الطرق',
    href: '/tools/debt',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: PiggyBank,
    title: 'الميزانية الذكية',
    description: 'نظّم مصروفاتك وادخر أكثر',
    href: '/tools/budget',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Target,
    title: 'صندوق الطوارئ',
    description: 'احسب الاحتياطي المناسب لك',
    href: '/tools/emergency',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'الزكاة',
    description: 'احسب زكاة أموالك بدقة',
    href: '/tools/zakat',
    gradient: 'from-purple-500 to-pink-500',
  },
];

export function QuickActionsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r p-[1px] hover:scale-105 transition-transform"
              style={{
                backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative bg-white rounded-xl p-4 h-full">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} flex-shrink-0`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-trust transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-primary-trust group-hover:translate-x-[-4px] transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
