import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-accent-light text-accent',
    warning: 'bg-warning/10 text-warning',
    default: 'bg-border text-muted',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-small font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
