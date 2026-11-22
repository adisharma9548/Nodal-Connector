import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose' | 'clay' | 'orange' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'orange'
}) => {
  const getIconClasses = (c: string) => {
    switch (c) {
      case 'blue':
        return 'bg-[var(--blue-tint-80)] text-[var(--blue-text)] dark:bg-[rgba(106,155,204,0.18)] dark:text-[var(--blue)]';
      case 'emerald':
      case 'green':
        return 'bg-[var(--green-tint-80)] text-[var(--green-text)] dark:bg-[rgba(120,140,93,0.18)] dark:text-[var(--green)]';
      case 'rose':
        return 'bg-[var(--color-error-tint)] text-[var(--color-error)] dark:bg-[rgba(168,61,49,0.2)] dark:text-[var(--orange-lighter)]';
      case 'orange':
      case 'clay':
      case 'amber':
      default:
        return 'bg-[var(--orange-tint-80)] text-[var(--orange-text)] dark:bg-[rgba(217,119,87,0.18)] dark:text-[var(--orange-lighter)]';
    }
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-[14px] p-5 border border-[var(--border-default)] shadow-xs hover:border-[var(--border-strong)] transition-all duration-180 group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-[var(--text-secondary)]">{title}</span>
        <div className={`p-2 rounded-[10px] ${getIconClasses(color)} transition-transform group-hover:scale-105`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-heading font-bold text-[var(--text-primary)] tracking-tight">{value}</div>
        <div className="mt-1 flex items-center justify-between text-xs">
          {subtitle && <span className="text-[var(--text-secondary)] font-body text-[13px]">{subtitle}</span>}
          {trend && (
            <span className={`font-heading font-semibold text-xs ml-auto inline-flex items-center gap-1 ${trend.isPositive ? 'text-[var(--green-text)] dark:text-[var(--green)]' : 'text-[var(--color-error)]'}`}>
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
