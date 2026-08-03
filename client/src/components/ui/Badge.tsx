import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'cyber';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-spider-500/15 text-spider-400 border-spider-500/30',
    secondary: 'bg-dark-800 text-slate-300 border-dark-600',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    cyber: 'bg-web-500/15 text-web-400 border-web-500/30 shadow-[0_0_10px_rgba(0,210,255,0.2)]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
