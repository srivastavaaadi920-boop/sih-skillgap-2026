import { PrismaClient, Domain, SkillCategory } from '@prisma/client';

const prisma = new PrismaClient();

// AYUSH Fields with their skills and goals
const AYUSH_FIELDS_DATA = [
  {
    name: 'Ayurveda Clinical Practice',
    goals: [
      'Ayurvedic Physician',
      'Clinical Consultant',
      'Wellness Practitioner'
    ],
    skills: [
      { name: 'Nadi Pariksha', category: 'TECHNICAL' as SkillCategory },
      { name: 'Dravyaguna', category: 'TECHNICAL' as SkillCategory },
      { name: 'Roga Nidana', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ayurvedic Case Documentation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ashtavidha Pariksha', category: 'TECHNICAL' as SkillCategory },
      { name: 'Prakriti Assessment', category: 'TECHNICAL' as SkillCategory },
      { name: 'Kaya Chikitsa', category: 'TECHNICAL' as SkillCategory },
      { name: 'Patient Counseling', category: 'SOFT' as SkillCategory },
      { name: 'Cross-system Medical Communication', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Panchakarma Therapy',
    goals: [
      'Panchakarma Specialist',
      'Detox Therapist',
      'Ayurvedic Therapy Consultant'
    ],
    skills: [
      { name: 'Vamana & Virechana Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'Basti Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Abhyanga', category: 'TECHNICAL' as SkillCategory },
      { name: 'Snehana & Swedana', category: 'TECHNICAL' as SkillCategory },
      { name: 'Detox Protocol Planning', category: 'TECHNICAL' as SkillCategory },
      { name: 'Nasya Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Raktamokshana', category: 'TECHNICAL' as SkillCategory },
      { name: 'Pre/Post Procedure Care', category: 'SOFT' as SkillCategory },
      { name: 'Patient Safety Monitoring', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Yoga Therapy & Instruction',
    goals: [
      'Yoga Therapist',
      'Yoga Instructor',
      'Wellness Coach'
    ],
    skills: [
      { name: 'Asana Sequencing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Pranayama Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'Yoga Chikitsa', category: 'TECHNICAL' as SkillCategory },
      { name: 'Meditation Facilitation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Group Class Management', category: 'SOFT' as SkillCategory },
      { name: 'Anatomy for Yoga', category: 'TECHNICAL' as SkillCategory },
      { name: 'Mudra & Bandha Practice', category: 'TECHNICAL' as SkillCategory },
      { name: 'Yoga Nidra Instruction', category: 'TECHNICAL' as SkillCategory },
      { name: 'Motivational Coaching', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Naturopathy',
    goals: [
      'Naturopathic Doctor',
      'Natural Healing Practitioner',
      'Lifestyle Medicine Consultant'
    ],
    skills: [
      { name: 'Hydrotherapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Mud Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Fasting Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Naturopathic Diagnosis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Lifestyle & Diet Prescription', category: 'TECHNICAL' as SkillCategory },
      { name: 'Acupressure', category: 'TECHNICAL' as SkillCategory },
      { name: 'Chromotherapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Magnet Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Holistic Wellness Planning', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Unani Medicine',
    goals: [
      'Unani Physician',
      'Traditional Medicine Practitioner',
      'Integrative Health Consultant'
    ],
    skills: [
      { name: 'Ilaj-bil-Tadbeer', category: 'TECHNICAL' as SkillCategory },
      { name: 'Mizaj Assessment', category: 'TECHNICAL' as SkillCategory },
      { name: 'Unani Pharmacology', category: 'TECHNICAL' as SkillCategory },
      { name: 'Hijama', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ilaj-bil-Ghiza', category: 'TECHNICAL' as SkillCategory },
      { name: 'Munafeh-e-Aza', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ilaj-bil-Dawa', category: 'TECHNICAL' as SkillCategory },
      { name: 'Patient History Taking', category: 'SOFT' as SkillCategory },
      { name: 'Documentation & Case Recording', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Siddha Medicine',
    goals: [
      'Siddha Physician',
      'Traditional Healer',
      'Holistic Medicine Practitioner'
    ],
    skills: [
      { name: 'Varmam Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Gunapadam', category: 'TECHNICAL' as SkillCategory },
      { name: 'Thokkanam', category: 'TECHNICAL' as SkillCategory },
      { name: 'Naadi Pariksha', category: 'TECHNICAL' as SkillCategory },
      { name: 'Siddha Toxicology', category: 'TECHNICAL' as SkillCategory },
      { name: 'Kaya Kalpa', category: 'TECHNICAL' as SkillCategory },
      { name: 'Herbo-mineral Formulation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Traditional Knowledge Documentation', category: 'SOFT' as SkillCategory },
      { name: 'Community Health Outreach', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Homoeopathy Practice',
    goals: [
      'Homoeopathic Physician',
      'Classical Homoeopath',
      'Alternative Medicine Consultant'
    ],
    skills: [
      { name: 'Repertorization', category: 'TECHNICAL' as SkillCategory },
      { name: 'Materia Medica Knowledge', category: 'TECHNICAL' as SkillCategory },
      { name: 'Miasmatic Analysis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Homoeopathic Case Taking', category: 'TECHNICAL' as SkillCategory },
      { name: 'Potentization Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'Organon of Medicine Application', category: 'TECHNICAL' as SkillCategory },
      { name: 'Constitutional Prescribing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Detailed Patient Interviewing', category: 'SOFT' as SkillCategory },
      { name: 'Analytical Case Reasoning', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Pharmaceutical Manufacturing',
    goals: [
      'AYUSH Formulation Scientist',
      'Production Manager',
      'Quality Assurance Lead'
    ],
    skills: [
      { name: 'GMP Compliance', category: 'TECHNICAL' as SkillCategory },
      { name: 'Herbal Formulation Development', category: 'TECHNICAL' as SkillCategory },
      { name: 'Rasashastra', category: 'TECHNICAL' as SkillCategory },
      { name: 'Batch Production Planning', category: 'TECHNICAL' as SkillCategory },
      { name: 'Raw Material Sourcing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Bhasma Preparation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Quality Assurance Protocols', category: 'TECHNICAL' as SkillCategory },
      { name: 'Packaging & Labeling Standards', category: 'TECHNICAL' as SkillCategory },
      { name: 'Cross-functional QA Coordination', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Herbal Drug Quality Control & Testing',
    goals: [
      'Quality Control Analyst',
      'Herbal Testing Specialist',
      'Laboratory Manager'
    ],
    skills: [
      { name: 'Pharmacognosy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Phytochemical Analysis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Standardization Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'HPLC/Analytical Testing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Adulteration Detection', category: 'TECHNICAL' as SkillCategory },
      { name: 'Microbial Load Testing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Heavy Metal Screening', category: 'TECHNICAL' as SkillCategory },
      { name: 'Stability Testing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Lab Documentation', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Regulatory Affairs',
    goals: [
      'Regulatory Affairs Specialist',
      'Compliance Manager',
      'Policy Advisor'
    ],
    skills: [
      { name: 'AYUSH Licensing Procedures', category: 'TECHNICAL' as SkillCategory },
      { name: 'Drug Regulatory Documentation', category: 'TECHNICAL' as SkillCategory },
      { name: 'GMP/GLP Compliance', category: 'TECHNICAL' as SkillCategory },
      { name: 'Import-Export Regulations', category: 'TECHNICAL' as SkillCategory },
      { name: 'Labeling Compliance', category: 'TECHNICAL' as SkillCategory },
      { name: 'AYUSH Premium Mark Certification', category: 'TECHNICAL' as SkillCategory },
      { name: 'Pharmacovigilance for AYUSH Drugs', category: 'TECHNICAL' as SkillCategory },
      { name: 'Regulatory Audit Preparation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Policy Interpretation', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Clinical Research',
    goals: [
      'Clinical Research Associate',
      'Research Scientist',
      'Evidence-Based Medicine Specialist'
    ],
    skills: [
      { name: 'Clinical Trial Design', category: 'TECHNICAL' as SkillCategory },
      { name: 'Evidence-Based Traditional Medicine', category: 'TECHNICAL' as SkillCategory },
      { name: 'Good Clinical Practice', category: 'TECHNICAL' as SkillCategory },
      { name: 'Biostatistics', category: 'TECHNICAL' as SkillCategory },
      { name: 'Research Ethics & Protocols', category: 'TECHNICAL' as SkillCategory },
      { name: 'Reverse Pharmacology Methods', category: 'TECHNICAL' as SkillCategory },
      { name: 'Systematic Review & Meta-analysis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Grant Proposal Writing', category: 'SOFT' as SkillCategory },
      { name: 'Scientific Writing', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Ayurvedic Nutrition & Dietetics',
    goals: [
      'Ayurvedic Nutritionist',
      'Diet Consultant',
      'Wellness Nutrition Coach'
    ],
    skills: [
      { name: 'Ahara Vidhi', category: 'TECHNICAL' as SkillCategory },
      { name: 'Prakriti-based Diet Planning', category: 'TECHNICAL' as SkillCategory },
      { name: 'Therapeutic Food Formulation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Nutraceutical Knowledge', category: 'TECHNICAL' as SkillCategory },
      { name: 'Client Diet Counseling', category: 'SOFT' as SkillCategory },
      { name: 'Rasa-Guna-Virya Analysis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ritucharya (Seasonal Diet)', category: 'TECHNICAL' as SkillCategory },
      { name: 'Weight Management Protocols', category: 'TECHNICAL' as SkillCategory },
      { name: 'Dietary Compliance Coaching', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Wellness Tourism & Spa Management',
    goals: [
      'Wellness Retreat Manager',
      'Spa Director',
      'Wellness Tourism Consultant'
    ],
    skills: [
      { name: 'Wellness Retreat Program Design', category: 'TECHNICAL' as SkillCategory },
      { name: 'Spa Therapy Protocols', category: 'TECHNICAL' as SkillCategory },
      { name: 'Hospitality Management', category: 'SOFT' as SkillCategory },
      { name: 'Wellness Product Knowledge', category: 'TECHNICAL' as SkillCategory },
      { name: 'Client Service & Sales', category: 'SOFT' as SkillCategory },
      { name: 'Wellness Package Curation', category: 'TECHNICAL' as SkillCategory },
      { name: 'International Client Handling', category: 'SOFT' as SkillCategory },
      { name: 'Facility Operations Management', category: 'SOFT' as SkillCategory },
      { name: 'Wellness Tourism Marketing', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Digital Health & Informatics',
    goals: [
      'AYUSH Health IT Specialist',
      'Digital Health Coordinator',
      'Health Informatics Analyst'
    ],
    skills: [
      { name: 'AYUSH EHR Systems', category: 'TECHNICAL' as SkillCategory },
      { name: 'NAMASTE Terminology Coding', category: 'TECHNICAL' as SkillCategory },
      { name: 'Telemedicine Platforms', category: 'TECHNICAL' as SkillCategory },
      { name: 'Health Data Management', category: 'TECHNICAL' as SkillCategory },
      { name: 'Digital Literacy Training', category: 'SOFT' as SkillCategory },
      { name: 'AYUSH Grid Portal Usage', category: 'TECHNICAL' as SkillCategory },
      { name: 'Data Privacy in Healthcare', category: 'TECHNICAL' as SkillCategory },
      { name: 'Mobile Health App Familiarity', category: 'TECHNICAL' as SkillCategory },
      { name: 'Tech-enabled Patient Communication', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Medicinal Plant Cultivation',
    goals: [
      'Medicinal Plant Farmer',
      'Herbal Agriculture Specialist',
      'GACP Consultant'
    ],
    skills: [
      { name: 'Herbal Farming Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'GACP', category: 'TECHNICAL' as SkillCategory },
      { name: 'Medicinal Plant Identification', category: 'TECHNICAL' as SkillCategory },
      { name: 'Post-Harvest Processing', category: 'TECHNICAL' as SkillCategory },
      { name: 'Organic Cultivation Methods', category: 'TECHNICAL' as SkillCategory },
      { name: 'Seed Bank Management', category: 'TECHNICAL' as SkillCategory },
      { name: 'Soil & Water Management', category: 'TECHNICAL' as SkillCategory },
      { name: 'Pest Management (Organic)', category: 'TECHNICAL' as SkillCategory },
      { name: 'Crop Yield Optimization', category: 'TECHNICAL' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Hospital & Clinic Administration',
    goals: [
      'AYUSH Hospital Administrator',
      'Clinic Manager',
      'Healthcare Operations Manager'
    ],
    skills: [
      { name: 'Healthcare Facility Management', category: 'SOFT' as SkillCategory },
      { name: 'AYUSH Hospital Accreditation Standards', category: 'TECHNICAL' as SkillCategory },
      { name: 'Inventory & Supply Management', category: 'TECHNICAL' as SkillCategory },
      { name: 'Staff Scheduling', category: 'SOFT' as SkillCategory },
      { name: 'Patient Records Management', category: 'TECHNICAL' as SkillCategory },
      { name: 'Billing & Insurance Coordination', category: 'TECHNICAL' as SkillCategory },
      { name: 'Facility Compliance Audits', category: 'TECHNICAL' as SkillCategory },
      { name: 'Vendor Management', category: 'SOFT' as SkillCategory },
      { name: 'Crisis/Emergency Coordination', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Public Health & Community Outreach',
    goals: [
      'Public Health Officer',
      'Community Health Worker',
      'AYUSH Program Coordinator'
    ],
    skills: [
      { name: 'Community Health Education', category: 'SOFT' as SkillCategory },
      { name: 'AYUSH Program Implementation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Health Camp Organization', category: 'SOFT' as SkillCategory },
      { name: 'Traditional Knowledge Documentation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Public Health Messaging', category: 'SOFT' as SkillCategory },
      { name: 'Rural Healthcare Delivery', category: 'SOFT' as SkillCategory },
      { name: 'Government Scheme Awareness', category: 'TECHNICAL' as SkillCategory },
      { name: 'Data Collection for Health Surveys', category: 'TECHNICAL' as SkillCategory },
      { name: 'Stakeholder Coordination', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Ayurvedic Cosmetology & Beauty Therapy',
    goals: [
      'Ayurvedic Cosmetologist',
      'Beauty Therapist',
      'Natural Skincare Consultant'
    ],
    skills: [
      { name: 'Herbal Skincare Formulation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Ayurvedic Beauty Treatments', category: 'TECHNICAL' as SkillCategory },
      { name: 'Product Knowledge (Natural Cosmetics)', category: 'TECHNICAL' as SkillCategory },
      { name: 'Client Consultation', category: 'SOFT' as SkillCategory },
      { name: 'Treatment Protocol Design', category: 'TECHNICAL' as SkillCategory },
      { name: 'Hair & Scalp Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Facial Marma Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Skin Type Analysis', category: 'TECHNICAL' as SkillCategory },
      { name: 'Retail & Upselling', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'Yoga for Sports & Fitness',
    goals: [
      'Sports Yoga Therapist',
      'Athletic Trainer',
      'Performance Coach'
    ],
    skills: [
      { name: 'Sports-specific Yoga Therapy', category: 'TECHNICAL' as SkillCategory },
      { name: 'Injury Prevention Techniques', category: 'TECHNICAL' as SkillCategory },
      { name: 'Flexibility & Recovery Training', category: 'TECHNICAL' as SkillCategory },
      { name: 'Athlete Assessment', category: 'TECHNICAL' as SkillCategory },
      { name: 'Performance-focused Pranayama', category: 'TECHNICAL' as SkillCategory },
      { name: 'Sports Nutrition Basics', category: 'TECHNICAL' as SkillCategory },
      { name: 'Rehabilitation Yoga', category: 'TECHNICAL' as SkillCategory },
      { name: 'Strength & Conditioning Integration', category: 'TECHNICAL' as SkillCategory },
      { name: 'Athlete Communication', category: 'SOFT' as SkillCategory },
    ]
  },
  {
    name: 'AYUSH Education & Academic Training',
    goals: [
      'AYUSH Faculty Member',
      'Clinical Training Supervisor',
      'Academic Researcher'
    ],
    skills: [
      { name: 'Curriculum Development', category: 'TECHNICAL' as SkillCategory },
      { name: 'Classical Text Teaching', category: 'TECHNICAL' as SkillCategory },
      { name: 'Clinical Training Supervision', category: 'SOFT' as SkillCategory },
      { name: 'Academic Research Writing', category: 'SOFT' as SkillCategory },
      { name: 'Student Assessment Design', category: 'TECHNICAL' as SkillCategory },
      { name: 'E-learning Content Creation', category: 'TECHNICAL' as SkillCategory },
      { name: 'Sanskrit/Classical Language Instruction', category: 'TECHNICAL' as SkillCategory },
      { name: 'Mentorship & Guidance', category: 'SOFT' as SkillCategory },
      { name: 'Academic Publication', category: 'SOFT' as SkillCategory },
    ]
  },
];

async function seedAYUSH() {
  console.log('🌿 Starting AYUSH domain seeding...\n');

  try {
    // 1. Create/upsert all AYUSH fields
    console.log('📋 Creating AYUSH fields...');
    for (const fieldData of AYUSH_FIELDS_DATA) {
      const field = await prisma.field.upsert({
        where: { name: fieldData.name },
        update: { domain: 'AYUSH' },
        create: {
          name: fieldData.name,
          domain: 'AYUSH',
        },
      });
      console.log(`  ✅ ${field.name}`);

      // 2. Create goals for this field
      console.log(`  📌 Creating goals for ${field.name}...`);
      for (const goalTitle of fieldData.goals) {
        const goal = await prisma.goal.upsert({
          where: {
            fieldId_title: {
              fieldId: field.id,
              title: goalTitle,
            },
          },
          update: {},
          create: {
            fieldId: field.id,
            title: goalTitle,
          },
        });
        console.log(`     • ${goal.title}`);
      }

      // 3. Create/upsert skills and link them to field via FieldSkill
      console.log(`  🎯 Creating skills for ${field.name}...`);
      for (const skillData of fieldData.skills) {
        const skill = await prisma.skill.upsert({
          where: { name: skillData.name },
          update: {},
          create: {
            name: skillData.name,
            category: skillData.category,
          },
        });

        // Link skill to field via FieldSkill
        await prisma.fieldSkill.upsert({
          where: {
            fieldId_skillId: {
              fieldId: field.id,
              skillId: skill.id,
            },
          },
          update: {},
          create: {
            fieldId: field.id,
            skillId: skill.id,
          },
        });
      }
      console.log(`     ✅ ${fieldData.skills.length} skills linked\n`);
    }

    console.log('\n✅ AYUSH domain seeding complete!\n');
    
    // Print summary
    const ayushFieldCount = await prisma.field.count({ where: { domain: 'AYUSH' } });
    const ayushGoalCount = await prisma.goal.count({
      where: {
        field: {
          domain: 'AYUSH',
        },
      },
    });
    const totalFieldSkills = await prisma.fieldSkill.count({
      where: {
        field: {
          domain: 'AYUSH',
        },
      },
    });

    console.log('📊 AYUSH Domain Summary:');
    console.log(`   Fields: ${ayushFieldCount}`);
    console.log(`   Goals: ${ayushGoalCount}`);
    console.log(`   Field-Skill Mappings: ${totalFieldSkills}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding AYUSH domain:', error);
    throw error;
  }
}

async function linkExistingTechnologySkills() {
  console.log('🔗 Creating FieldSkill mappings for existing Technology fields...\n');

  try {
    // Get all Technology fields
    const techFields = await prisma.field.findMany({
      where: { domain: 'TECHNOLOGY' },
      include: {
        goals: true,
      },
    });

    console.log(`Found ${techFields.length} Technology fields\n`);

    // For each Technology field, we need to map appropriate skills
    // This is based on the field name and common sense mapping
    const TECH_FIELD_SKILL_MAPPINGS: Record<string, string[]> = {
      'Software Development': [
        'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'TypeScript',
        'Angular', 'Vue.js', 'Git', 'REST APIs', 'GraphQL', 'MongoDB', 'PostgreSQL',
        'Problem-solving', 'Teamwork', 'Communication'
      ],
      'Data Science': [
        'Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Data Visualization',
        'Statistics', 'R', 'Problem-solving', 'Critical Thinking', 'Communication'
      ],
      'Web Development': [
        'JavaScript', 'HTML/CSS', 'React', 'Node.js', 'TypeScript', 'REST APIs',
        'MongoDB', 'Git', 'UI/UX Design', 'Teamwork', 'Problem-solving'
      ],
      'Mobile Development': [
        'Java', 'Kotlin', 'Swift', 'React Native', 'Flutter', 'Git',
        'REST APIs', 'Problem-solving', 'Communication'
      ],
      'Cloud Computing': [
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Python',
        'Linux', 'Terraform', 'CI/CD', 'Problem-solving', 'Teamwork'
      ],
      'Cybersecurity': [
        'Network Security', 'Ethical Hacking', 'Cryptography', 'Linux',
        'Python', 'Risk Assessment', 'Problem-solving', 'Critical Thinking'
      ],
      'AI/Machine Learning': [
        'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
        'Data Analysis', 'Statistics', 'Problem-solving', 'Critical Thinking'
      ],
      'DevOps': [
        'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git',
        'Terraform', 'Python', 'Problem-solving', 'Teamwork'
      ],
      'Database Administration': [
        'SQL', 'PostgreSQL', 'MongoDB', 'MySQL', 'Database Design',
        'Performance Tuning', 'Problem-solving', 'Critical Thinking'
      ],
    };

    for (const field of techFields) {
      const skillNames = TECH_FIELD_SKILL_MAPPINGS[field.name] || [];
      
      if (skillNames.length === 0) {
        console.log(`  ⚠️  No skill mapping defined for "${field.name}" - skipping`);
        continue;
      }

      console.log(`  🔗 Mapping skills for "${field.name}"...`);
      let linkedCount = 0;

      for (const skillName of skillNames) {
        const skill = await prisma.skill.findUnique({
          where: { name: skillName },
        });

        if (!skill) {
          console.log(`     ⚠️  Skill "${skillName}" not found - skipping`);
          continue;
        }

        await prisma.fieldSkill.upsert({
          where: {
            fieldId_skillId: {
              fieldId: field.id,
              skillId: skill.id,
            },
          },
          update: {},
          create: {
            fieldId: field.id,
            skillId: skill.id,
          },
        });
        linkedCount++;
      }

      console.log(`     ✅ Linked ${linkedCount} skills\n`);
    }

    console.log('✅ Technology field-skill mappings complete!\n');
  } catch (error) {
    console.error('❌ Error linking Technology skills:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting comprehensive AYUSH + Technology field-skill seeding\n');
  console.log('=' .repeat(60) + '\n');

  // Note: Existing fields should already be set to TECHNOLOGY domain via migration
  console.log('✅ Assuming existing fields are already set to TECHNOLOGY domain\n');

  // Seed AYUSH domain
  await seedAYUSH();

  // Link Technology skills
  await linkExistingTechnologySkills();

  console.log('=' .repeat(60));
  console.log('🎉 All seeding complete!\n');

  // Final summary
  const totalFields = await prisma.field.count();
  const totalGoals = await prisma.goal.count();
  const totalSkills = await prisma.skill.count();
  const totalFieldSkills = await prisma.fieldSkill.count();

  console.log('📊 FINAL SUMMARY:');
  console.log(`   Total Fields: ${totalFields}`);
  console.log(`   Total Goals: ${totalGoals}`);
  console.log(`   Total Skills: ${totalSkills}`);
  console.log(`   Total Field-Skill Mappings: ${totalFieldSkills}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
