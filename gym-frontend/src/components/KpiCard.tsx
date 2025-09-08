import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Card to display a KPI with optional hint and trend indicator.
 */
export default function KpiCard({
  title,
  value,
  hint,
  trend,
  trendValue,
  icon: Icon,
  gradient = 'gradient-primary'
}: {
  title: string;
  value: string | number;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
  gradient?: string;
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`card-glass glass ${gradient} relative overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-white/90 uppercase tracking-wide">
            {title}
          </div>
          {Icon && (
            <div className="rounded-full bg-white/20 p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl font-bold text-white">
            {value}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {hint && (
          <div className="mt-2 text-sm text-white/80">
            {hint}
          </div>
        )}
      </div>
    </motion.div>
  );
}