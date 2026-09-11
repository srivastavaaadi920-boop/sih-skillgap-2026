import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = '', interactive = false }: CardProps) {
  return (
    <div 
      className={`bg-surface border-2 border-border rounded-lg p-6 ${
        interactive ? 'hover:-translate-y-1 transition-transform duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
