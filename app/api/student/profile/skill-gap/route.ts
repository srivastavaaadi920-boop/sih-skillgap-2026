import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SkillLevel } from '@prisma/client';

// Helper to compare skill levels
const skillLevelRank = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized - Students only' },
        { status: 403 }
      );
    }

    // Check if this is a mock user - tell frontend to use localStorage
    if (authUser.userId.startsWith('mock_')) {
      console.log('🔧 MOCK USER DETECTED: Skill gap should use localStorage');
      return NextResponse.json({
        onTrack: [],
        needsImprovement: [],
        missing: [],
      });
    }

    // REAL MODE - Get student profile with goal
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: authUser.userId },
      include: {
        goal: {
          include: {
            goalSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
        field: true,
        studentSkillSelections: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!studentProfile || !studentProfile.goal) {
      return NextResponse.json({
        onTrack: [],
        needsImprovement: [],
        missing: [],
      });
    }

    // Build a map of student's current skills
    const studentSkillMap = new Map<string, SkillLevel>();
    studentProfile.studentSkillSelections.forEach((selection) => {
      studentSkillMap.set(selection.skillId, selection.selfRatedLevel);
    });

    const onTrack: Array<{
      skillName: string;
      currentLevel: SkillLevel;
      requiredLevel: SkillLevel;
    }> = [];

    const needsImprovement: Array<{
      skillName: string;
      currentLevel: SkillLevel;
      requiredLevel: SkillLevel;
    }> = [];

    const missing: Array<{
      skillName: string;
      requiredLevel: SkillLevel;
    }> = [];

    // Check if this goal has skill requirements defined
    if (studentProfile.goal.goalSkills.length === 0) {
      console.log(
        `⚠️  Goal "${studentProfile.goal.title}" has NO GoalSkill entries - using fallback`
      );

      // FALLBACK: Use most commonly required skills from other goals in the same field
      const fallbackSkills = await prisma.goalSkill.findMany({
        where: {
          goal: {
            fieldId: studentProfile.fieldId || undefined,
          },
        },
        include: {
          skill: true,
        },
        take: 50, // Get up to 50 skill requirements from field goals
      });

      // Count frequency of each skill
      const skillFrequency = new Map<string, { count: number; levels: SkillLevel[] }>();
      fallbackSkills.forEach((gs) => {
        const existing = skillFrequency.get(gs.skillId);
        if (existing) {
          existing.count++;
          existing.levels.push(gs.requiredLevel);
        } else {
          skillFrequency.set(gs.skillId, {
            count: 1,
            levels: [gs.requiredLevel],
          });
        }
      });

      // Get top 5 most common skills
      const sortedSkills = Array.from(skillFrequency.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5);

      // Compare student's skills against these common field requirements
      for (const [skillId, { levels }] of sortedSkills) {
        const skillData = fallbackSkills.find((gs) => gs.skillId === skillId);
        if (!skillData) continue;

        // Use the most common level, or INTERMEDIATE as default
        const mostCommonLevel =
          levels.reduce(
            (acc, level) => {
              acc[level] = (acc[level] || 0) + 1;
              return acc;
            },
            {} as Record<SkillLevel, number>
          ) || {};
        const requiredLevel =
          (Object.keys(mostCommonLevel).sort(
            (a, b) =>
              mostCommonLevel[b as SkillLevel] - mostCommonLevel[a as SkillLevel]
          )[0] as SkillLevel) || 'INTERMEDIATE';

        const currentLevel = studentSkillMap.get(skillId);

        if (!currentLevel) {
          missing.push({
            skillName: skillData.skill.name,
            requiredLevel,
          });
        } else {
          const currentRank = skillLevelRank[currentLevel];
          const requiredRank = skillLevelRank[requiredLevel];

          if (currentRank >= requiredRank) {
            onTrack.push({
              skillName: skillData.skill.name,
              currentLevel,
              requiredLevel,
            });
          } else {
            needsImprovement.push({
              skillName: skillData.skill.name,
              currentLevel,
              requiredLevel,
            });
          }
        }
      }

      return NextResponse.json({
        onTrack,
        needsImprovement,
        missing,
        isFallback: true,
        fallbackMessage: `Showing general requirements for ${studentProfile.field?.name} field`,
      });
    }

    // NORMAL MODE: Goal has skill requirements defined
    // Analyze each required skill for the goal
    for (const goalSkill of studentProfile.goal.goalSkills) {
      const requiredLevel = goalSkill.requiredLevel;
      const currentLevel = studentSkillMap.get(goalSkill.skillId);

      if (!currentLevel) {
        // Student doesn't have this skill at all
        missing.push({
          skillName: goalSkill.skill.name,
          requiredLevel,
        });
      } else {
        // Student has the skill - compare levels
        const currentRank = skillLevelRank[currentLevel];
        const requiredRank = skillLevelRank[requiredLevel];

        if (currentRank >= requiredRank) {
          // On track - meets or exceeds requirement
          onTrack.push({
            skillName: goalSkill.skill.name,
            currentLevel,
            requiredLevel,
          });
        } else {
          // Has skill but below required level
          needsImprovement.push({
            skillName: goalSkill.skill.name,
            currentLevel,
            requiredLevel,
          });
        }
      }
    }

    return NextResponse.json({
      onTrack,
      needsImprovement,
      missing,
      isFallback: false,
    });
  } catch (error) {
    console.error('Failed to fetch skill gap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill gap analysis' },
      { status: 500 }
    );
  }
}
