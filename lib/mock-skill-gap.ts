// Mock skill gap calculator for when database is not available
// This reads from localStorage and calculates gap based on predefined goal-skill mappings

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface SkillGapResult {
  onTrack: Array<{
    skillName: string;
    currentLevel: SkillLevel;
    requiredLevel: SkillLevel;
  }>;
  needsImprovement: Array<{
    skillName: string;
    currentLevel: SkillLevel;
    requiredLevel: SkillLevel;
  }>;
  missing: Array<{
    skillName: string;
    requiredLevel: SkillLevel;
  }>;
}

const skillLevelRank = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
};

// Goal-specific skill requirements (based on seed file and CSV)
const GOAL_REQUIREMENTS: Record<string, Record<string, SkillLevel>> = {
  // Ayurveda Clinical Practice
  'Ayurvedic Physician': {
    'Nadi Pariksha': 'ADVANCED',
    'Dravyaguna': 'ADVANCED',
    'Roga Nidana': 'ADVANCED',
    'Prakriti Assessment': 'INTERMEDIATE',
    'Kaya Chikitsa': 'ADVANCED',
    'Patient Counseling': 'INTERMEDIATE',
  },
  'Clinical Consultant': {
    'Ashtavidha Pariksha': 'ADVANCED',
    'Ayurvedic Case Documentation': 'INTERMEDIATE',
    'Cross-system Medical Communication': 'ADVANCED',
    'Patient Counseling': 'ADVANCED',
    'Prakriti Assessment': 'INTERMEDIATE',
  },
  'Wellness Practitioner': {
    'Prakriti Assessment': 'INTERMEDIATE',
    'Patient Counseling': 'ADVANCED',
    'Dravyaguna': 'INTERMEDIATE',
    'Ayurvedic Case Documentation': 'BEGINNER',
  },

  // Panchakarma Therapy
  'Panchakarma Specialist': {
    'Vamana & Virechana Techniques': 'ADVANCED',
    'Basti Therapy': 'ADVANCED',
    'Abhyanga': 'ADVANCED',
    'Snehana & Swedana': 'INTERMEDIATE',
    'Detox Protocol Planning': 'ADVANCED',
    'Patient Safety Monitoring': 'ADVANCED',
  },
  'Detox Therapist': {
    'Detox Protocol Planning': 'ADVANCED',
    'Snehana & Swedana': 'INTERMEDIATE',
    'Nasya Therapy': 'INTERMEDIATE',
    'Pre/Post Procedure Care': 'ADVANCED',
    'Patient Safety Monitoring': 'INTERMEDIATE',
  },
  'Ayurvedic Therapy Consultant': {
    'Detox Protocol Planning': 'ADVANCED',
    'Abhyanga': 'INTERMEDIATE',
    'Pre/Post Procedure Care': 'INTERMEDIATE',
    'Patient Safety Monitoring': 'INTERMEDIATE',
  },

  // Yoga Therapy & Instruction
  'Yoga Therapist': {
    'Asana Sequencing': 'ADVANCED',
    'Pranayama Techniques': 'ADVANCED',
    'Yoga Chikitsa': 'ADVANCED',
    'Anatomy for Yoga': 'INTERMEDIATE',
    'Meditation Facilitation': 'INTERMEDIATE',
    'Motivational Coaching': 'INTERMEDIATE',
  },
  'Yoga Instructor': {
    'Asana Sequencing': 'INTERMEDIATE',
    'Pranayama Techniques': 'INTERMEDIATE',
    'Group Class Management': 'ADVANCED',
    'Mudra & Bandha Practice': 'INTERMEDIATE',
    'Motivational Coaching': 'INTERMEDIATE',
  },
  'Wellness Coach': {
    'Motivational Coaching': 'ADVANCED',
    'Meditation Facilitation': 'INTERMEDIATE',
    'Yoga Nidra Instruction': 'INTERMEDIATE',
    'Group Class Management': 'INTERMEDIATE',
  },

  // Naturopathy
  'Naturopathic Doctor': {
    'Naturopathic Diagnosis': 'ADVANCED',
    'Hydrotherapy': 'ADVANCED',
    'Fasting Therapy': 'ADVANCED',
    'Lifestyle & Diet Prescription': 'ADVANCED',
    'Holistic Wellness Planning': 'INTERMEDIATE',
  },
  'Natural Healing Practitioner': {
    'Mud Therapy': 'INTERMEDIATE',
    'Hydrotherapy': 'INTERMEDIATE',
    'Acupressure': 'INTERMEDIATE',
    'Chromotherapy': 'BEGINNER',
    'Holistic Wellness Planning': 'INTERMEDIATE',
  },
  'Lifestyle Medicine Consultant': {
    'Lifestyle & Diet Prescription': 'ADVANCED',
    'Holistic Wellness Planning': 'ADVANCED',
    'Naturopathic Diagnosis': 'INTERMEDIATE',
    'Fasting Therapy': 'INTERMEDIATE',
  },

  // Unani Medicine
  'Unani Physician': {
    'Mizaj Assessment': 'ADVANCED',
    'Unani Pharmacology': 'ADVANCED',
    'Ilaj-bil-Dawa': 'ADVANCED',
    'Ilaj-bil-Tadbeer': 'INTERMEDIATE',
    'Patient History Taking': 'INTERMEDIATE',
  },
  'Traditional Medicine Practitioner': {
    'Mizaj Assessment': 'INTERMEDIATE',
    'Ilaj-bil-Ghiza': 'INTERMEDIATE',
    'Hijama': 'INTERMEDIATE',
    'Documentation & Case Recording': 'INTERMEDIATE',
  },
  'Integrative Health Consultant': {
    'Mizaj Assessment': 'INTERMEDIATE',
    'Ilaj-bil-Ghiza': 'ADVANCED',
    'Patient History Taking': 'ADVANCED',
    'Documentation & Case Recording': 'INTERMEDIATE',
  },

  // Siddha Medicine
  'Siddha Physician': {
    'Varmam Therapy': 'ADVANCED',
    'Gunapadam': 'ADVANCED',
    'Naadi Pariksha': 'ADVANCED',
    'Siddha Toxicology': 'INTERMEDIATE',
    'Traditional Knowledge Documentation': 'INTERMEDIATE',
  },
  'Traditional Healer': {
    'Varmam Therapy': 'INTERMEDIATE',
    'Thokkanam': 'INTERMEDIATE',
    'Herbo-mineral Formulation': 'BEGINNER',
    'Community Health Outreach': 'INTERMEDIATE',
  },
  'Holistic Medicine Practitioner': {
    'Naadi Pariksha': 'INTERMEDIATE',
    'Kaya Kalpa': 'INTERMEDIATE',
    'Traditional Knowledge Documentation': 'INTERMEDIATE',
    'Community Health Outreach': 'INTERMEDIATE',
  },

  // Homoeopathy Practice
  'Homoeopathic Physician': {
    'Repertorization': 'ADVANCED',
    'Materia Medica Knowledge': 'ADVANCED',
    'Miasmatic Analysis': 'ADVANCED',
    'Homoeopathic Case Taking': 'INTERMEDIATE',
    'Constitutional Prescribing': 'ADVANCED',
    'Detailed Patient Interviewing': 'INTERMEDIATE',
  },
  'Classical Homoeopath': {
    'Repertorization': 'ADVANCED',
    'Materia Medica Knowledge': 'ADVANCED',
    'Organon of Medicine Application': 'ADVANCED',
    'Constitutional Prescribing': 'ADVANCED',
    'Analytical Case Reasoning': 'ADVANCED',
  },
  'Alternative Medicine Consultant': {
    'Homoeopathic Case Taking': 'INTERMEDIATE',
    'Materia Medica Knowledge': 'INTERMEDIATE',
    'Detailed Patient Interviewing': 'ADVANCED',
    'Analytical Case Reasoning': 'INTERMEDIATE',
  },

  // Add more goals as needed from the CSV...
  // For Technology domain:
  'Frontend Developer': {
    'JavaScript': 'ADVANCED',
    'React': 'ADVANCED',
    'HTML/CSS': 'INTERMEDIATE',
    'TypeScript': 'INTERMEDIATE',
    'Git Version Control': 'INTERMEDIATE',
  },
  'Backend Developer': {
    'Node.js': 'ADVANCED',
    'Python': 'INTERMEDIATE',
    'SQL': 'ADVANCED',
    'REST APIs': 'ADVANCED',
    'Git Version Control': 'INTERMEDIATE',
  },
  'Full Stack Developer': {
    'JavaScript': 'ADVANCED',
    'React': 'INTERMEDIATE',
    'Node.js': 'ADVANCED',
    'SQL': 'INTERMEDIATE',
    'REST APIs': 'INTERMEDIATE',
    'Git Version Control': 'INTERMEDIATE',
  },
  'Data Analyst': {
    'Python': 'INTERMEDIATE',
    'SQL': 'ADVANCED',
    'Data Analysis': 'ADVANCED',
    'Data Visualization': 'INTERMEDIATE',
    'Excel/Spreadsheets': 'INTERMEDIATE',
  },
  'Data Scientist': {
    'Python': 'ADVANCED',
    'Machine Learning': 'ADVANCED',
    'Data Analysis': 'ADVANCED',
    'Statistics': 'INTERMEDIATE',
    'SQL': 'INTERMEDIATE',
  },
};

export function calculateMockSkillGap(goalTitle: string, studentSkills: Array<{
  skillName: string;
  selfRatedLevel: SkillLevel;
}>): SkillGapResult {
  const requirements = GOAL_REQUIREMENTS[goalTitle];

  if (!requirements) {
    console.warn(`No mock requirements found for goal: "${goalTitle}"`);
    return {
      onTrack: [],
      needsImprovement: [],
      missing: [],
    };
  }

  // Build a map of student's skills
  const studentSkillMap = new Map<string, SkillLevel>();
  studentSkills.forEach((skill) => {
    studentSkillMap.set(skill.skillName, skill.selfRatedLevel);
  });

  const result: SkillGapResult = {
    onTrack: [],
    needsImprovement: [],
    missing: [],
  };

  // Analyze each required skill
  for (const [skillName, requiredLevel] of Object.entries(requirements)) {
    const currentLevel = studentSkillMap.get(skillName);

    if (!currentLevel) {
      // Missing skill
      result.missing.push({
        skillName,
        requiredLevel,
      });
    } else {
      // Compare levels
      const currentRank = skillLevelRank[currentLevel];
      const requiredRank = skillLevelRank[requiredLevel];

      if (currentRank >= requiredRank) {
        // On track
        result.onTrack.push({
          skillName,
          currentLevel,
          requiredLevel,
        });
      } else {
        // Needs improvement
        result.needsImprovement.push({
          skillName,
          currentLevel,
          requiredLevel,
        });
      }
    }
  }

  return result;
}
