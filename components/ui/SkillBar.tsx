interface SkillBarProps {
  skillName: string;
  proficiencyLevel: number;
  maxLevel?: number;
}

const levelLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Basic',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

export function SkillBar({ skillName, proficiencyLevel, maxLevel = 5 }: SkillBarProps) {
  const percentage = (proficiencyLevel / maxLevel) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="font-medium text-primary-dark">{skillName}</span>
        <span className="text-sm text-accent font-semibold">
          {levelLabels[proficiencyLevel] || proficiencyLevel}
        </span>
      </div>
      <div className="h-3 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
