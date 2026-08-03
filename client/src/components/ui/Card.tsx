import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-xl p-6 border border-dark-700/60',
        hoverEffect && 'glass-card-hover',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
