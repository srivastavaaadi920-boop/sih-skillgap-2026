'use client';

import React from 'react';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description: string }[];
}

export function RoleSelector({ value, onChange, options }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
            value === option.value
              ? 'border-accent bg-accent-light'
              : 'border-border bg-surface hover:border-primary/30'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              value === option.value ? 'border-accent' : 'border-border'
            }`}>
              {value === option.value && (
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              )}
            </div>
            <div>
              <div className="font-semibold text-primary-dark">{option.label}</div>
              <div className="text-small text-muted">{option.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
