interface MatchScoreProps {
  score: number;
  size?: 'small' | 'large';
}

export function MatchScore({ score, size = 'small' }: MatchScoreProps) {
  const getColor = () => {
    if (score >= 80) return 'text-accent bg-accent-light';
    if (score >= 50) return 'text-warning bg-warning/10';
    return 'text-muted bg-border';
  };

  const sizeClasses = size === 'large' ? 'text-2xl w-20 h-20' : 'text-base w-14 h-14';

  return (
    <div className={`${sizeClasses} rounded-full ${getColor()} flex flex-col items-center justify-center font-bold`}>
      <span className="text-xs font-normal">Match</span>
      <span>{score}%</span>
    </div>
  );
}
