import React from 'react';
import { cn } from '../../utils/cn';

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'degraded' | 'loading';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className }) => {
  const statusStyles = {
    online: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    offline: 'bg-red-400 shadow-[0_0_8px_#f87171]',
    degraded: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    loading: 'bg-web-400 shadow-[0_0_8px_#38bdf8] animate-pulse',
  };

  const ringStyles = {
    online: 'bg-emerald-400/30',
    offline: 'bg-red-400/30',
    degraded: 'bg-amber-400/30',
    loading: 'bg-web-400/30',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cn(
            'animate-ping-slow absolute inline-flex h-full w-full rounded-full opacity-75',
            ringStyles[status],
          )}
        />
        <span
          className={cn('relative inline-flex rounded-full h-2.5 w-2.5', statusStyles[status])}
        />
      </span>
      {label && <span className="text-xs font-mono font-medium text-slate-300">{label}</span>}
    </div>
  );
};
