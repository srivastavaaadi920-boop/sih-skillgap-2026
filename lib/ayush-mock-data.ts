// Mock data for AYUSH domain - used when MOCK_MODE=true
export type Domain = 'TECHNOLOGY' | 'AYUSH';

export interface MockField {
  id: string;
  name: string;
  domain: Domain;
}

export interface MockGoal {
  id: string;
  fieldId: string;
  title: string;
}

export interface MockSkill {
  id: string;
  name: string;
  category: 'TECHNICAL' | 'SOFT';
}

// Technology Fields
export const MOCK_TECH_FIELDS: MockField[] = [
  { id: 'tech-field-1', name: 'Software Development', domain: 'TECHNOLOGY' },
  { id: 'tech-field-2', name: 'Data Science', domain: 'TECHNOLOGY' },
  { id: 'tech-field-3', name: 'Web Development', domain: 'TECHNOLOGY' },
  { id: 'tech-field-4', name: 'Cloud Computing', domain: 'TECHNOLOGY' },
  { id: 'tech-field-5', name: 'AI/Machine Learning', domain: 'TECHNOLOGY' },
];

// AYUSH Fields - ALL 20 as specified
export const MOCK_AYUSH_FIELDS: MockField[] = [
  { id: 'ayush-field-1', name: 'Ayurveda Clinical Practice', domain: 'AYUSH' },
  { id: 'ayush-field-2', name: 'Panchakarma Therapy', domain: 'AYUSH' },
  { id: 'ayush-field-3', name: 'Yoga Therapy & Instruction', domain: 'AYUSH' },
  { id: 'ayush-field-4', name: 'Naturopathy', domain: 'AYUSH' },
  { id: 'ayush-field-5', name: 'Unani Medicine', domain: 'AYUSH' },
  { id: 'ayush-field-6', name: 'Siddha Medicine', domain: 'AYUSH' },
  { id: 'ayush-field-7', name: 'Homoeopathy Practice', domain: 'AYUSH' },
  { id: 'ayush-field-8', name: 'AYUSH Pharmaceutical Manufacturing', domain: 'AYUSH' },
  { id: 'ayush-field-9', name: 'Herbal Drug Quality Control & Testing', domain: 'AYUSH' },
  { id: 'ayush-field-10', name: 'AYUSH Regulatory Affairs', domain: 'AYUSH' },
  { id: 'ayush-field-11', name: 'AYUSH Clinical Research', domain: 'AYUSH' },
  { id: 'ayush-field-12', name: 'Ayurvedic Nutrition & Dietetics', domain: 'AYUSH' },
  { id: 'ayush-field-13', name: 'AYUSH Wellness Tourism & Spa Management', domain: 'AYUSH' },
  { id: 'ayush-field-14', name: 'AYUSH Digital Health & Informatics', domain: 'AYUSH' },
  { id: 'ayush-field-15', name: 'Medicinal Plant Cultivation', domain: 'AYUSH' },
  { id: 'ayush-field-16', name: 'AYUSH Hospital & Clinic Administration', domain: 'AYUSH' },
  { id: 'ayush-field-17', name: 'AYUSH Public Health & Community Outreach', domain: 'AYUSH' },
  { id: 'ayush-field-18', name: 'Ayurvedic Cosmetology & Beauty Therapy', domain: 'AYUSH' },
  { id: 'ayush-field-19', name: 'Yoga for Sports & Fitness', domain: 'AYUSH' },
  { id: 'ayush-field-20', name: 'AYUSH Education & Academic Training', domain: 'AYUSH' },
];

// Goals by Field - ALL 20 AYUSH fields with 3 goals each
export const MOCK_GOALS: Record<string, MockGoal[]> = {
  'ayush-field-1': [
    { id: 'goal-1', fieldId: 'ayush-field-1', title: 'Ayurvedic Physician' },
    { id: 'goal-2', fieldId: 'ayush-field-1', title: 'Clinical Consultant' },
    { id: 'goal-3', fieldId: 'ayush-field-1', title: 'Wellness Practitioner' },
  ],
  'ayush-field-2': [
    { id: 'goal-4', fieldId: 'ayush-field-2', title: 'Panchakarma Specialist' },
    { id: 'goal-5', fieldId: 'ayush-field-2', title: 'Detox Therapist' },
    { id: 'goal-6', fieldId: 'ayush-field-2', title: 'Ayurvedic Therapy Consultant' },
  ],
  'ayush-field-3': [
    { id: 'goal-7', fieldId: 'ayush-field-3', title: 'Yoga Therapist' },
    { id: 'goal-8', fieldId: 'ayush-field-3', title: 'Yoga Instructor' },
    { id: 'goal-9', fieldId: 'ayush-field-3', title: 'Wellness Coach' },
  ],
  'ayush-field-4': [
    { id: 'goal-10', fieldId: 'ayush-field-4', title: 'Naturopathic Doctor' },
    { id: 'goal-11', fieldId: 'ayush-field-4', title: 'Natural Healing Practitioner' },
    { id: 'goal-12', fieldId: 'ayush-field-4', title: 'Lifestyle Medicine Consultant' },
  ],
  'ayush-field-5': [
    { id: 'goal-13', fieldId: 'ayush-field-5', title: 'Unani Physician' },
    { id: 'goal-14', fieldId: 'ayush-field-5', title: 'Traditional Medicine Practitioner' },
    { id: 'goal-15', fieldId: 'ayush-field-5', title: 'Integrative Health Consultant' },
  ],
  'ayush-field-6': [
    { id: 'goal-16', fieldId: 'ayush-field-6', title: 'Siddha Physician' },
    { id: 'goal-17', fieldId: 'ayush-field-6', title: 'Traditional Healer' },
    { id: 'goal-18', fieldId: 'ayush-field-6', title: 'Holistic Medicine Practitioner' },
  ],
  'ayush-field-7': [
    { id: 'goal-19', fieldId: 'ayush-field-7', title: 'Homoeopathic Physician' },
    { id: 'goal-20', fieldId: 'ayush-field-7', title: 'Classical Homoeopath' },
    { id: 'goal-21', fieldId: 'ayush-field-7', title: 'Alternative Medicine Consultant' },
  ],
  'ayush-field-8': [
    { id: 'goal-22', fieldId: 'ayush-field-8', title: 'AYUSH Formulation Scientist' },
    { id: 'goal-23', fieldId: 'ayush-field-8', title: 'Production Manager' },
    { id: 'goal-24', fieldId: 'ayush-field-8', title: 'Quality Assurance Lead' },
  ],
  'ayush-field-9': [
    { id: 'goal-25', fieldId: 'ayush-field-9', title: 'Quality Control Analyst' },
    { id: 'goal-26', fieldId: 'ayush-field-9', title: 'Herbal Testing Specialist' },
    { id: 'goal-27', fieldId: 'ayush-field-9', title: 'Laboratory Manager' },
  ],
  'ayush-field-10': [
    { id: 'goal-28', fieldId: 'ayush-field-10', title: 'Regulatory Affairs Specialist' },
    { id: 'goal-29', fieldId: 'ayush-field-10', title: 'Compliance Manager' },
    { id: 'goal-30', fieldId: 'ayush-field-10', title: 'Policy Advisor' },
  ],
  'ayush-field-11': [
    { id: 'goal-31', fieldId: 'ayush-field-11', title: 'Clinical Research Associate' },
    { id: 'goal-32', fieldId: 'ayush-field-11', title: 'Research Scientist' },
    { id: 'goal-33', fieldId: 'ayush-field-11', title: 'Evidence-Based Medicine Specialist' },
  ],
  'ayush-field-12': [
    { id: 'goal-34', fieldId: 'ayush-field-12', title: 'Ayurvedic Nutritionist' },
    { id: 'goal-35', fieldId: 'ayush-field-12', title: 'Diet Consultant' },
    { id: 'goal-36', fieldId: 'ayush-field-12', title: 'Wellness Nutrition Coach' },
  ],
  'ayush-field-13': [
    { id: 'goal-37', fieldId: 'ayush-field-13', title: 'Wellness Retreat Manager' },
    { id: 'goal-38', fieldId: 'ayush-field-13', title: 'Spa Director' },
    { id: 'goal-39', fieldId: 'ayush-field-13', title: 'Wellness Tourism Consultant' },
  ],
  'ayush-field-14': [
    { id: 'goal-40', fieldId: 'ayush-field-14', title: 'AYUSH Health IT Specialist' },
    { id: 'goal-41', fieldId: 'ayush-field-14', title: 'Digital Health Coordinator' },
    { id: 'goal-42', fieldId: 'ayush-field-14', title: 'Health Informatics Analyst' },
  ],
  'ayush-field-15': [
    { id: 'goal-43', fieldId: 'ayush-field-15', title: 'Medicinal Plant Farmer' },
    { id: 'goal-44', fieldId: 'ayush-field-15', title: 'Herbal Agriculture Specialist' },
    { id: 'goal-45', fieldId: 'ayush-field-15', title: 'GACP Consultant' },
  ],
  'ayush-field-16': [
    { id: 'goal-46', fieldId: 'ayush-field-16', title: 'AYUSH Hospital Administrator' },
    { id: 'goal-47', fieldId: 'ayush-field-16', title: 'Clinic Manager' },
    { id: 'goal-48', fieldId: 'ayush-field-16', title: 'Healthcare Operations Manager' },
  ],
  'ayush-field-17': [
    { id: 'goal-49', fieldId: 'ayush-field-17', title: 'Public Health Officer' },
    { id: 'goal-50', fieldId: 'ayush-field-17', title: 'Community Health Worker' },
    { id: 'goal-51', fieldId: 'ayush-field-17', title: 'AYUSH Program Coordinator' },
  ],
  'ayush-field-18': [
    { id: 'goal-52', fieldId: 'ayush-field-18', title: 'Ayurvedic Cosmetologist' },
    { id: 'goal-53', fieldId: 'ayush-field-18', title: 'Beauty Therapist' },
    { id: 'goal-54', fieldId: 'ayush-field-18', title: 'Natural Skincare Consultant' },
  ],
  'ayush-field-19': [
    { id: 'goal-55', fieldId: 'ayush-field-19', title: 'Sports Yoga Therapist' },
    { id: 'goal-56', fieldId: 'ayush-field-19', title: 'Athletic Trainer' },
    { id: 'goal-57', fieldId: 'ayush-field-19', title: 'Performance Coach' },
  ],
  'ayush-field-20': [
    { id: 'goal-58', fieldId: 'ayush-field-20', title: 'AYUSH Faculty Member' },
    { id: 'goal-59', fieldId: 'ayush-field-20', title: 'Clinical Training Supervisor' },
    { id: 'goal-60', fieldId: 'ayush-field-20', title: 'Academic Researcher' },
  ],
  // Technology fields
  'tech-field-1': [
    { id: 'goal-61', fieldId: 'tech-field-1', title: 'Full Stack Developer' },
    { id: 'goal-62', fieldId: 'tech-field-1', title: 'Frontend Developer' },
    { id: 'goal-63', fieldId: 'tech-field-1', title: 'Backend Developer' },
  ],
  'tech-field-2': [
    { id: 'goal-64', fieldId: 'tech-field-2', title: 'Data Scientist' },
    { id: 'goal-65', fieldId: 'tech-field-2', title: 'Data Analyst' },
    { id: 'goal-66', fieldId: 'tech-field-2', title: 'ML Engineer' },
  ],
};

// Skills by Field (Field-specific mapping) - ALL 20 AYUSH fields
export const MOCK_FIELD_SKILLS: Record<string, MockSkill[]> = {
  'ayush-field-1': [
    { id: 'ayush-skill-1', name: 'Nadi Pariksha', category: 'TECHNICAL' },
    { id: 'ayush-skill-2', name: 'Dravyaguna', category: 'TECHNICAL' },
    { id: 'ayush-skill-3', name: 'Roga Nidana', category: 'TECHNICAL' },
    { id: 'ayush-skill-4', name: 'Ayurvedic Case Documentation', category: 'TECHNICAL' },
    { id: 'ayush-skill-5', name: 'Ashtavidha Pariksha', category: 'TECHNICAL' },
    { id: 'ayush-skill-6', name: 'Prakriti Assessment', category: 'TECHNICAL' },
    { id: 'ayush-skill-7', name: 'Kaya Chikitsa', category: 'TECHNICAL' },
    { id: 'ayush-skill-8', name: 'Patient Counseling', category: 'SOFT' },
    { id: 'ayush-skill-9', name: 'Cross-system Medical Communication', category: 'SOFT' },
  ],
  'ayush-field-2': [
    { id: 'ayush-skill-10', name: 'Vamana & Virechana Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-11', name: 'Basti Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-12', name: 'Abhyanga', category: 'TECHNICAL' },
    { id: 'ayush-skill-13', name: 'Snehana & Swedana', category: 'TECHNICAL' },
    { id: 'ayush-skill-14', name: 'Detox Protocol Planning', category: 'TECHNICAL' },
    { id: 'ayush-skill-15', name: 'Nasya Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-16', name: 'Raktamokshana', category: 'TECHNICAL' },
    { id: 'ayush-skill-17', name: 'Pre/Post Procedure Care', category: 'SOFT' },
    { id: 'ayush-skill-18', name: 'Patient Safety Monitoring', category: 'SOFT' },
  ],
  'ayush-field-3': [
    { id: 'ayush-skill-19', name: 'Asana Sequencing', category: 'TECHNICAL' },
    { id: 'ayush-skill-20', name: 'Pranayama Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-21', name: 'Yoga Chikitsa', category: 'TECHNICAL' },
    { id: 'ayush-skill-22', name: 'Meditation Facilitation', category: 'TECHNICAL' },
    { id: 'ayush-skill-23', name: 'Group Class Management', category: 'SOFT' },
    { id: 'ayush-skill-24', name: 'Anatomy for Yoga', category: 'TECHNICAL' },
    { id: 'ayush-skill-25', name: 'Mudra & Bandha Practice', category: 'TECHNICAL' },
    { id: 'ayush-skill-26', name: 'Yoga Nidra Instruction', category: 'TECHNICAL' },
    { id: 'ayush-skill-27', name: 'Motivational Coaching', category: 'SOFT' },
  ],
  'ayush-field-4': [
    { id: 'ayush-skill-28', name: 'Hydrotherapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-29', name: 'Mud Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-30', name: 'Fasting Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-31', name: 'Naturopathic Diagnosis', category: 'TECHNICAL' },
    { id: 'ayush-skill-32', name: 'Lifestyle & Diet Prescription', category: 'TECHNICAL' },
    { id: 'ayush-skill-33', name: 'Acupressure', category: 'TECHNICAL' },
    { id: 'ayush-skill-34', name: 'Chromotherapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-35', name: 'Magnet Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-36', name: 'Holistic Wellness Planning', category: 'SOFT' },
  ],
  'ayush-field-5': [
    { id: 'ayush-skill-37', name: 'Ilaj-bil-Tadbeer', category: 'TECHNICAL' },
    { id: 'ayush-skill-38', name: 'Mizaj Assessment', category: 'TECHNICAL' },
    { id: 'ayush-skill-39', name: 'Unani Pharmacology', category: 'TECHNICAL' },
    { id: 'ayush-skill-40', name: 'Hijama', category: 'TECHNICAL' },
    { id: 'ayush-skill-41', name: 'Ilaj-bil-Ghiza', category: 'TECHNICAL' },
    { id: 'ayush-skill-42', name: 'Munafeh-e-Aza', category: 'TECHNICAL' },
    { id: 'ayush-skill-43', name: 'Ilaj-bil-Dawa', category: 'TECHNICAL' },
    { id: 'ayush-skill-44', name: 'Patient History Taking', category: 'SOFT' },
    { id: 'ayush-skill-45', name: 'Documentation & Case Recording', category: 'SOFT' },
  ],
  'ayush-field-6': [
    { id: 'ayush-skill-46', name: 'Varmam Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-47', name: 'Gunapadam', category: 'TECHNICAL' },
    { id: 'ayush-skill-48', name: 'Thokkanam', category: 'TECHNICAL' },
    { id: 'ayush-skill-49', name: 'Naadi Pariksha', category: 'TECHNICAL' },
    { id: 'ayush-skill-50', name: 'Siddha Toxicology', category: 'TECHNICAL' },
    { id: 'ayush-skill-51', name: 'Kaya Kalpa', category: 'TECHNICAL' },
    { id: 'ayush-skill-52', name: 'Herbo-mineral Formulation', category: 'TECHNICAL' },
    { id: 'ayush-skill-53', name: 'Traditional Knowledge Documentation', category: 'SOFT' },
    { id: 'ayush-skill-54', name: 'Community Health Outreach', category: 'SOFT' },
  ],
  'ayush-field-7': [
    { id: 'ayush-skill-55', name: 'Repertorization', category: 'TECHNICAL' },
    { id: 'ayush-skill-56', name: 'Materia Medica Knowledge', category: 'TECHNICAL' },
    { id: 'ayush-skill-57', name: 'Miasmatic Analysis', category: 'TECHNICAL' },
    { id: 'ayush-skill-58', name: 'Homoeopathic Case Taking', category: 'TECHNICAL' },
    { id: 'ayush-skill-59', name: 'Potentization Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-60', name: 'Organon of Medicine Application', category: 'TECHNICAL' },
    { id: 'ayush-skill-61', name: 'Constitutional Prescribing', category: 'TECHNICAL' },
    { id: 'ayush-skill-62', name: 'Detailed Patient Interviewing', category: 'SOFT' },
    { id: 'ayush-skill-63', name: 'Analytical Case Reasoning', category: 'SOFT' },
  ],
  'ayush-field-8': [
    { id: 'ayush-skill-64', name: 'GMP Compliance', category: 'TECHNICAL' },
    { id: 'ayush-skill-65', name: 'Herbal Formulation Development', category: 'TECHNICAL' },
    { id: 'ayush-skill-66', name: 'Rasashastra', category: 'TECHNICAL' },
    { id: 'ayush-skill-67', name: 'Batch Production Planning', category: 'TECHNICAL' },
    { id: 'ayush-skill-68', name: 'Raw Material Sourcing', category: 'TECHNICAL' },
    { id: 'ayush-skill-69', name: 'Bhasma Preparation', category: 'TECHNICAL' },
    { id: 'ayush-skill-70', name: 'Quality Assurance Protocols', category: 'TECHNICAL' },
    { id: 'ayush-skill-71', name: 'Packaging & Labeling Standards', category: 'TECHNICAL' },
    { id: 'ayush-skill-72', name: 'Cross-functional QA Coordination', category: 'SOFT' },
  ],
  'ayush-field-9': [
    { id: 'ayush-skill-73', name: 'Pharmacognosy', category: 'TECHNICAL' },
    { id: 'ayush-skill-74', name: 'Phytochemical Analysis', category: 'TECHNICAL' },
    { id: 'ayush-skill-75', name: 'Standardization Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-76', name: 'HPLC/Analytical Testing', category: 'TECHNICAL' },
    { id: 'ayush-skill-77', name: 'Adulteration Detection', category: 'TECHNICAL' },
    { id: 'ayush-skill-78', name: 'Microbial Load Testing', category: 'TECHNICAL' },
    { id: 'ayush-skill-79', name: 'Heavy Metal Screening', category: 'TECHNICAL' },
    { id: 'ayush-skill-80', name: 'Stability Testing', category: 'TECHNICAL' },
    { id: 'ayush-skill-81', name: 'Lab Documentation', category: 'SOFT' },
  ],
  'ayush-field-10': [
    { id: 'ayush-skill-82', name: 'AYUSH Licensing Procedures', category: 'TECHNICAL' },
    { id: 'ayush-skill-83', name: 'Drug Regulatory Documentation', category: 'TECHNICAL' },
    { id: 'ayush-skill-84', name: 'GMP/GLP Compliance', category: 'TECHNICAL' },
    { id: 'ayush-skill-85', name: 'Import-Export Regulations', category: 'TECHNICAL' },
    { id: 'ayush-skill-86', name: 'Labeling Compliance', category: 'TECHNICAL' },
    { id: 'ayush-skill-87', name: 'AYUSH Premium Mark Certification', category: 'TECHNICAL' },
    { id: 'ayush-skill-88', name: 'Pharmacovigilance for AYUSH Drugs', category: 'TECHNICAL' },
    { id: 'ayush-skill-89', name: 'Regulatory Audit Preparation', category: 'TECHNICAL' },
    { id: 'ayush-skill-90', name: 'Policy Interpretation', category: 'SOFT' },
  ],
  'ayush-field-11': [
    { id: 'ayush-skill-91', name: 'Clinical Trial Design', category: 'TECHNICAL' },
    { id: 'ayush-skill-92', name: 'Evidence-Based Traditional Medicine', category: 'TECHNICAL' },
    { id: 'ayush-skill-93', name: 'Good Clinical Practice', category: 'TECHNICAL' },
    { id: 'ayush-skill-94', name: 'Biostatistics', category: 'TECHNICAL' },
    { id: 'ayush-skill-95', name: 'Research Ethics & Protocols', category: 'TECHNICAL' },
    { id: 'ayush-skill-96', name: 'Reverse Pharmacology Methods', category: 'TECHNICAL' },
    { id: 'ayush-skill-97', name: 'Systematic Review & Meta-analysis', category: 'TECHNICAL' },
    { id: 'ayush-skill-98', name: 'Grant Proposal Writing', category: 'SOFT' },
    { id: 'ayush-skill-99', name: 'Scientific Writing', category: 'SOFT' },
  ],
  'ayush-field-12': [
    { id: 'ayush-skill-100', name: 'Ahara Vidhi', category: 'TECHNICAL' },
    { id: 'ayush-skill-101', name: 'Prakriti-based Diet Planning', category: 'TECHNICAL' },
    { id: 'ayush-skill-102', name: 'Therapeutic Food Formulation', category: 'TECHNICAL' },
    { id: 'ayush-skill-103', name: 'Nutraceutical Knowledge', category: 'TECHNICAL' },
    { id: 'ayush-skill-104', name: 'Client Diet Counseling', category: 'SOFT' },
    { id: 'ayush-skill-105', name: 'Rasa-Guna-Virya Analysis', category: 'TECHNICAL' },
    { id: 'ayush-skill-106', name: 'Ritucharya (Seasonal Diet)', category: 'TECHNICAL' },
    { id: 'ayush-skill-107', name: 'Weight Management Protocols', category: 'TECHNICAL' },
    { id: 'ayush-skill-108', name: 'Dietary Compliance Coaching', category: 'SOFT' },
  ],
  'ayush-field-13': [
    { id: 'ayush-skill-109', name: 'Wellness Retreat Program Design', category: 'TECHNICAL' },
    { id: 'ayush-skill-110', name: 'Spa Therapy Protocols', category: 'TECHNICAL' },
    { id: 'ayush-skill-111', name: 'Hospitality Management', category: 'SOFT' },
    { id: 'ayush-skill-112', name: 'Wellness Product Knowledge', category: 'TECHNICAL' },
    { id: 'ayush-skill-113', name: 'Client Service & Sales', category: 'SOFT' },
    { id: 'ayush-skill-114', name: 'Wellness Package Curation', category: 'TECHNICAL' },
    { id: 'ayush-skill-115', name: 'International Client Handling', category: 'SOFT' },
    { id: 'ayush-skill-116', name: 'Facility Operations Management', category: 'SOFT' },
    { id: 'ayush-skill-117', name: 'Wellness Tourism Marketing', category: 'SOFT' },
  ],
  'ayush-field-14': [
    { id: 'ayush-skill-118', name: 'AYUSH EHR Systems', category: 'TECHNICAL' },
    { id: 'ayush-skill-119', name: 'NAMASTE Terminology Coding', category: 'TECHNICAL' },
    { id: 'ayush-skill-120', name: 'Telemedicine Platforms', category: 'TECHNICAL' },
    { id: 'ayush-skill-121', name: 'Health Data Management', category: 'TECHNICAL' },
    { id: 'ayush-skill-122', name: 'Digital Literacy Training', category: 'SOFT' },
    { id: 'ayush-skill-123', name: 'AYUSH Grid Portal Usage', category: 'TECHNICAL' },
    { id: 'ayush-skill-124', name: 'Data Privacy in Healthcare', category: 'TECHNICAL' },
    { id: 'ayush-skill-125', name: 'Mobile Health App Familiarity', category: 'TECHNICAL' },
    { id: 'ayush-skill-126', name: 'Tech-enabled Patient Communication', category: 'SOFT' },
  ],
  'ayush-field-15': [
    { id: 'ayush-skill-127', name: 'Herbal Farming Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-128', name: 'GACP', category: 'TECHNICAL' },
    { id: 'ayush-skill-129', name: 'Medicinal Plant Identification', category: 'TECHNICAL' },
    { id: 'ayush-skill-130', name: 'Post-Harvest Processing', category: 'TECHNICAL' },
    { id: 'ayush-skill-131', name: 'Organic Cultivation Methods', category: 'TECHNICAL' },
    { id: 'ayush-skill-132', name: 'Seed Bank Management', category: 'TECHNICAL' },
    { id: 'ayush-skill-133', name: 'Soil & Water Management', category: 'TECHNICAL' },
    { id: 'ayush-skill-134', name: 'Pest Management (Organic)', category: 'TECHNICAL' },
    { id: 'ayush-skill-135', name: 'Crop Yield Optimization', category: 'TECHNICAL' },
  ],
  'ayush-field-16': [
    { id: 'ayush-skill-136', name: 'Healthcare Facility Management', category: 'SOFT' },
    { id: 'ayush-skill-137', name: 'AYUSH Hospital Accreditation Standards', category: 'TECHNICAL' },
    { id: 'ayush-skill-138', name: 'Inventory & Supply Management', category: 'TECHNICAL' },
    { id: 'ayush-skill-139', name: 'Staff Scheduling', category: 'SOFT' },
    { id: 'ayush-skill-140', name: 'Patient Records Management', category: 'TECHNICAL' },
    { id: 'ayush-skill-141', name: 'Billing & Insurance Coordination', category: 'TECHNICAL' },
    { id: 'ayush-skill-142', name: 'Facility Compliance Audits', category: 'TECHNICAL' },
    { id: 'ayush-skill-143', name: 'Vendor Management', category: 'SOFT' },
    { id: 'ayush-skill-144', name: 'Crisis/Emergency Coordination', category: 'SOFT' },
  ],
  'ayush-field-17': [
    { id: 'ayush-skill-145', name: 'Community Health Education', category: 'SOFT' },
    { id: 'ayush-skill-146', name: 'AYUSH Program Implementation', category: 'TECHNICAL' },
    { id: 'ayush-skill-147', name: 'Health Camp Organization', category: 'SOFT' },
    { id: 'ayush-skill-148', name: 'Traditional Knowledge Documentation', category: 'TECHNICAL' },
    { id: 'ayush-skill-149', name: 'Public Health Messaging', category: 'SOFT' },
    { id: 'ayush-skill-150', name: 'Rural Healthcare Delivery', category: 'SOFT' },
    { id: 'ayush-skill-151', name: 'Government Scheme Awareness', category: 'TECHNICAL' },
    { id: 'ayush-skill-152', name: 'Data Collection for Health Surveys', category: 'TECHNICAL' },
    { id: 'ayush-skill-153', name: 'Stakeholder Coordination', category: 'SOFT' },
  ],
  'ayush-field-18': [
    { id: 'ayush-skill-154', name: 'Herbal Skincare Formulation', category: 'TECHNICAL' },
    { id: 'ayush-skill-155', name: 'Ayurvedic Beauty Treatments', category: 'TECHNICAL' },
    { id: 'ayush-skill-156', name: 'Product Knowledge (Natural Cosmetics)', category: 'TECHNICAL' },
    { id: 'ayush-skill-157', name: 'Client Consultation', category: 'SOFT' },
    { id: 'ayush-skill-158', name: 'Treatment Protocol Design', category: 'TECHNICAL' },
    { id: 'ayush-skill-159', name: 'Hair & Scalp Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-160', name: 'Facial Marma Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-161', name: 'Skin Type Analysis', category: 'TECHNICAL' },
    { id: 'ayush-skill-162', name: 'Retail & Upselling', category: 'SOFT' },
  ],
  'ayush-field-19': [
    { id: 'ayush-skill-163', name: 'Sports-specific Yoga Therapy', category: 'TECHNICAL' },
    { id: 'ayush-skill-164', name: 'Injury Prevention Techniques', category: 'TECHNICAL' },
    { id: 'ayush-skill-165', name: 'Flexibility & Recovery Training', category: 'TECHNICAL' },
    { id: 'ayush-skill-166', name: 'Athlete Assessment', category: 'TECHNICAL' },
    { id: 'ayush-skill-167', name: 'Performance-focused Pranayama', category: 'TECHNICAL' },
    { id: 'ayush-skill-168', name: 'Sports Nutrition Basics', category: 'TECHNICAL' },
    { id: 'ayush-skill-169', name: 'Rehabilitation Yoga', category: 'TECHNICAL' },
    { id: 'ayush-skill-170', name: 'Strength & Conditioning Integration', category: 'TECHNICAL' },
    { id: 'ayush-skill-171', name: 'Athlete Communication', category: 'SOFT' },
  ],
  'ayush-field-20': [
    { id: 'ayush-skill-172', name: 'Curriculum Development', category: 'TECHNICAL' },
    { id: 'ayush-skill-173', name: 'Classical Text Teaching', category: 'TECHNICAL' },
    { id: 'ayush-skill-174', name: 'Clinical Training Supervision', category: 'SOFT' },
    { id: 'ayush-skill-175', name: 'Academic Research Writing', category: 'SOFT' },
    { id: 'ayush-skill-176', name: 'Student Assessment Design', category: 'TECHNICAL' },
    { id: 'ayush-skill-177', name: 'E-learning Content Creation', category: 'TECHNICAL' },
    { id: 'ayush-skill-178', name: 'Sanskrit/Classical Language Instruction', category: 'TECHNICAL' },
    { id: 'ayush-skill-179', name: 'Mentorship & Guidance', category: 'SOFT' },
    { id: 'ayush-skill-180', name: 'Academic Publication', category: 'SOFT' },
  ],
  // Technology fields
  'tech-field-1': [
    { id: 'tech-skill-1', name: 'JavaScript', category: 'TECHNICAL' },
    { id: 'tech-skill-2', name: 'Python', category: 'TECHNICAL' },
    { id: 'tech-skill-3', name: 'React', category: 'TECHNICAL' },
    { id: 'tech-skill-4', name: 'Node.js', category: 'TECHNICAL' },
    { id: 'tech-skill-5', name: 'SQL', category: 'TECHNICAL' },
    { id: 'tech-skill-6', name: 'Git', category: 'TECHNICAL' },
    { id: 'tech-skill-7', name: 'Problem-solving', category: 'SOFT' },
    { id: 'tech-skill-8', name: 'Teamwork', category: 'SOFT' },
  ],
  'tech-field-2': [
    { id: 'tech-skill-9', name: 'Python', category: 'TECHNICAL' },
    { id: 'tech-skill-10', name: 'SQL', category: 'TECHNICAL' },
    { id: 'tech-skill-11', name: 'Machine Learning', category: 'TECHNICAL' },
    { id: 'tech-skill-12', name: 'Data Analysis', category: 'TECHNICAL' },
    { id: 'tech-skill-13', name: 'Data Visualization', category: 'TECHNICAL' },
    { id: 'tech-skill-14', name: 'Statistics', category: 'TECHNICAL' },
    { id: 'tech-skill-15', name: 'Critical Thinking', category: 'SOFT' },
    { id: 'tech-skill-16', name: 'Communication', category: 'SOFT' },
  ],
};

export function getFieldsByDomain(domain: Domain): MockField[] {
  return domain === 'TECHNOLOGY' ? MOCK_TECH_FIELDS : MOCK_AYUSH_FIELDS;
}

export function getGoalsByFieldId(fieldId: string): MockGoal[] {
  return MOCK_GOALS[fieldId] || [];
}

export function getSkillsByFieldId(fieldId: string): MockSkill[] {
  return MOCK_FIELD_SKILLS[fieldId] || [];
}
