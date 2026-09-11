'use client';

import React from 'react';

interface RatingSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  skillName: string;
}

const levels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Basic' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' },
];

export function RatingSelector({ value, onChange, skillName }: RatingSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
              value === level.value
                ? 'bg-accent border-accent text-white'
                : 'bg-surface border-border text-primary-dark hover:border-accent/50'
            }`}
            aria-label={`Rate ${skillName} as ${level.label}`}
          >
            {level.value}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted px-1">
        <span>Beginner</span>
        <span>Expert</span>
      </div>
    </div>
  );
}
