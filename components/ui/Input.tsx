import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-primary-dark mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 border-2 ${
          error ? 'border-warning' : 'border-border'
        } rounded-lg bg-surface text-primary-dark focus:outline-none focus:border-accent transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-warning">{error}</p>
      )}
    </div>
  );
}
