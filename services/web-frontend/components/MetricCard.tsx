// Reusable metric display component
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  status?: 'normal' | 'warning' | 'danger';
  trend?: number;
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  unit,
  status = 'normal',
  trend,
  icon
}: MetricCardProps) {
  const statusStyles = {
    normal: 'bg-white/20',
    warning: 'bg-signal',
    danger: 'bg-red-500'
  }

  const trendColor = trend && trend > 0 ? 'text-red-400' : 'text-signal'

  return (
    <Card className="group relative gap-8 overflow-hidden transition-colors duration-300 hover:bg-[#202020]">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[2px] ${statusStyles[status]}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="eyebrow text-[13px] font-normal text-slate-400">{title}</CardTitle>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-slate-400 transition-colors duration-300 group-hover:bg-white group-hover:text-neutral-950 [&_svg]:size-[18px]">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-[42px] font-normal leading-none tracking-[-0.04em] tabular-nums text-white">{value.toFixed(2)}</span>
          <span className="text-base text-slate-500">{unit}</span>
        </div>
        {trend !== undefined && (
          <div className={`mt-2 text-sm ${trendColor}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% from average
          </div>
        )}
      </CardContent>
    </Card>
  )
}
