/**
 * Skill Matching Engine
 * 
 * Calculates how well a student's skill profile matches an opportunity's requirements.
 * 
 * Formula:
 * - Each required skill is worth 100% / totalRequiredSkills points
 * - Full match (proficiency >= minRequired): 100% credit
 * - Close match (proficiency = minRequired - 1): 50% credit (partial credit for being close)
 * - No match (proficiency < minRequired - 1 or skill missing): 0% credit
 * 
 * Example: If 3 out of 5 skills fully match, 1 skill is close, and 1 skill is missing:
 * Score = (3 * 100% + 1 * 50% + 1 * 0%) / 5 = 70%
 */

export interface StudentSkill {
  skillId: string;
  skillName: string;
  proficiencyLevel: number;
}

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  minProficiency: number;
}

export interface SkillMatchDetail {
  skillName: string;
  studentProficiency: number;
  requiredProficiency: number;
  status: 'matched' | 'close' | 'missing';
  credit: number; // 0-1 (0%, 50%, or 100% as decimal)
}

export interface MatchResult {
  overallScore: number; // 0-100 percentage
  matchedSkills: SkillMatchDetail[];
  gapSkills: SkillMatchDetail[];
}

export function calculateMatch(
  studentSkills: StudentSkill[],
  requiredSkills: RequiredSkill[]
): MatchResult {
  if (requiredSkills.length === 0) {
    return {
      overallScore: 0,
      matchedSkills: [],
      gapSkills: [],
    };
  }

  // Create a map for quick student skill lookup
  const studentSkillMap = new Map(
    studentSkills.map((s) => [s.skillId, s])
  );

  const matchDetails: SkillMatchDetail[] = [];
  let totalCredit = 0;

  // Evaluate each required skill
  for (const required of requiredSkills) {
    const studentSkill = studentSkillMap.get(required.skillId);

    if (!studentSkill) {
      // Skill missing - 0% credit
      matchDetails.push({
        skillName: required.skillName,
        studentProficiency: 0,
        requiredProficiency: required.minProficiency,
        status: 'missing',
        credit: 0,
      });
    } else if (studentSkill.proficiencyLevel >= required.minProficiency) {
      // Full match - 100% credit
      matchDetails.push({
        skillName: required.skillName,
        studentProficiency: studentSkill.proficiencyLevel,
        requiredProficiency: required.minProficiency,
        status: 'matched',
        credit: 1.0,
      });
      totalCredit += 1.0;
    } else if (
      studentSkill.proficiencyLevel === required.minProficiency - 1
    ) {
      // Close match (within 1 level) - 50% credit
      matchDetails.push({
        skillName: required.skillName,
        studentProficiency: studentSkill.proficiencyLevel,
        requiredProficiency: required.minProficiency,
        status: 'close',
        credit: 0.5,
      });
      totalCredit += 0.5;
    } else {
      // Too far below requirement - 0% credit
      matchDetails.push({
        skillName: required.skillName,
        studentProficiency: studentSkill.proficiencyLevel,
        requiredProficiency: required.minProficiency,
        status: 'missing',
        credit: 0,
      });
    }
  }

  // Calculate overall score as percentage
  const overallScore = (totalCredit / requiredSkills.length) * 100;

  // Separate matched and gap skills
  const matchedSkills = matchDetails.filter(
    (d) => d.status === 'matched' || d.status === 'close'
  );
  const gapSkills = matchDetails.filter((d) => d.status === 'missing');

  return {
    overallScore: Math.round(overallScore), // Round to nearest integer
    matchedSkills,
    gapSkills,
  };
}
