import { PrismaClient, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

// GoalSkill mappings - defines required skills and levels for each goal
const GOAL_SKILL_REQUIREMENTS = {
  // AYUSH DOMAIN GOALS
  
  // Ayurveda Clinical Practice
  'Ayurvedic Physician': [
    { skill: 'Nadi Pariksha', level: 'ADVANCED' as SkillLevel },
    { skill: 'Dravyaguna', level: 'ADVANCED' as SkillLevel },
    { skill: 'Roga Nidana', level: 'ADVANCED' as SkillLevel },
    { skill: 'Prakriti Assessment', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Kaya Chikitsa', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient Counseling', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Clinical Consultant': [
    { skill: 'Ashtavidha Pariksha', level: 'ADVANCED' as SkillLevel },
    { skill: 'Ayurvedic Case Documentation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Cross-system Medical Communication', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient Counseling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Prakriti Assessment', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Wellness Practitioner': [
    { skill: 'Prakriti Assessment', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Patient Counseling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Dravyaguna', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Ayurvedic Case Documentation', level: 'BEGINNER' as SkillLevel },
  ],
  
  // Panchakarma Therapy
  'Panchakarma Specialist': [
    { skill: 'Vamana & Virechana Techniques', level: 'ADVANCED' as SkillLevel },
    { skill: 'Basti Therapy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Abhyanga', level: 'ADVANCED' as SkillLevel },
    { skill: 'Snehana & Swedana', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Detox Protocol Planning', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient Safety Monitoring', level: 'ADVANCED' as SkillLevel },
  ],
  'Detox Therapist': [
    { skill: 'Detox Protocol Planning', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Snehana & Swedana', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Nasya Therapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Pre/Post Procedure Care', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient Safety Monitoring', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Ayurvedic Therapy Consultant': [
    { skill: 'Detox Protocol Planning', level: 'ADVANCED' as SkillLevel },
    { skill: 'Abhyanga', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Pre/Post Procedure Care', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Patient Safety Monitoring', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Yoga Therapy & Instruction
  'Yoga Therapist': [
    { skill: 'Asana Sequencing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Pranayama Techniques', level: 'ADVANCED' as SkillLevel },
    { skill: 'Yoga Chikitsa', level: 'ADVANCED' as SkillLevel },
    { skill: 'Anatomy for Yoga', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Meditation Facilitation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Motivational Coaching', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Yoga Instructor': [
    { skill: 'Asana Sequencing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Pranayama Techniques', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Group Class Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'Mudra & Bandha Practice', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Motivational Coaching', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Wellness Coach': [
    { skill: 'Motivational Coaching', level: 'ADVANCED' as SkillLevel },
    { skill: 'Meditation Facilitation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Yoga Nidra Instruction', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Group Class Management', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Naturopathy
  'Naturopathic Doctor': [
    { skill: 'Naturopathic Diagnosis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Hydrotherapy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Fasting Therapy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Lifestyle & Diet Prescription', level: 'ADVANCED' as SkillLevel },
    { skill: 'Holistic Wellness Planning', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Natural Healing Practitioner': [
    { skill: 'Mud Therapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Hydrotherapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Acupressure', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Chromotherapy', level: 'BEGINNER' as SkillLevel },
    { skill: 'Holistic Wellness Planning', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Lifestyle Medicine Consultant': [
    { skill: 'Lifestyle & Diet Prescription', level: 'ADVANCED' as SkillLevel },
    { skill: 'Holistic Wellness Planning', level: 'ADVANCED' as SkillLevel },
    { skill: 'Naturopathic Diagnosis', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Fasting Therapy', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Unani Medicine
  'Unani Physician': [
    { skill: 'Mizaj Assessment', level: 'ADVANCED' as SkillLevel },
    { skill: 'Unani Pharmacology', level: 'ADVANCED' as SkillLevel },
    { skill: 'Ilaj-bil-Dawa', level: 'ADVANCED' as SkillLevel },
    { skill: 'Ilaj-bil-Tadbeer', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Patient History Taking', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Traditional Medicine Practitioner': [
    { skill: 'Mizaj Assessment', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Ilaj-bil-Ghiza', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Hijama', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Documentation & Case Recording', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Integrative Health Consultant': [
    { skill: 'Mizaj Assessment', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Ilaj-bil-Ghiza', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient History Taking', level: 'ADVANCED' as SkillLevel },
    { skill: 'Documentation & Case Recording', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Siddha Medicine
  'Siddha Physician': [
    { skill: 'Varmam Therapy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Gunapadam', level: 'ADVANCED' as SkillLevel },
    { skill: 'Naadi Pariksha', level: 'ADVANCED' as SkillLevel },
    { skill: 'Siddha Toxicology', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Traditional Knowledge Documentation', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Traditional Healer': [
    { skill: 'Varmam Therapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Thokkanam', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Herbo-mineral Formulation', level: 'BEGINNER' as SkillLevel },
    { skill: 'Community Health Outreach', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Holistic Medicine Practitioner': [
    { skill: 'Naadi Pariksha', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Kaya Kalpa', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Traditional Knowledge Documentation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Community Health Outreach', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Homoeopathy Practice
  'Homoeopathic Physician': [
    { skill: 'Repertorization', level: 'ADVANCED' as SkillLevel },
    { skill: 'Materia Medica Knowledge', level: 'ADVANCED' as SkillLevel },
    { skill: 'Miasmatic Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Homoeopathic Case Taking', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Constitutional Prescribing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Detailed Patient Interviewing', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Classical Homoeopath': [
    { skill: 'Repertorization', level: 'ADVANCED' as SkillLevel },
    { skill: 'Materia Medica Knowledge', level: 'ADVANCED' as SkillLevel },
    { skill: 'Organon of Medicine Application', level: 'ADVANCED' as SkillLevel },
    { skill: 'Constitutional Prescribing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Analytical Case Reasoning', level: 'ADVANCED' as SkillLevel },
  ],
  'Alternative Medicine Consultant': [
    { skill: 'Homoeopathic Case Taking', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Materia Medica Knowledge', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Detailed Patient Interviewing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Analytical Case Reasoning', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Pharmaceutical Manufacturing
  'AYUSH Formulation Scientist': [
    { skill: 'Herbal Formulation Development', level: 'ADVANCED' as SkillLevel },
    { skill: 'Rasashastra', level: 'ADVANCED' as SkillLevel },
    { skill: 'GMP Compliance', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Quality Assurance Protocols', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Production Manager': [
    { skill: 'Batch Production Planning', level: 'ADVANCED' as SkillLevel },
    { skill: 'GMP Compliance', level: 'ADVANCED' as SkillLevel },
    { skill: 'Raw Material Sourcing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Packaging & Labeling Standards', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Cross-functional QA Coordination', level: 'ADVANCED' as SkillLevel },
  ],
  'Quality Assurance Lead': [
    { skill: 'Quality Assurance Protocols', level: 'ADVANCED' as SkillLevel },
    { skill: 'GMP Compliance', level: 'ADVANCED' as SkillLevel },
    { skill: 'Cross-functional QA Coordination', level: 'ADVANCED' as SkillLevel },
    { skill: 'Packaging & Labeling Standards', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Herbal Drug Quality Control & Testing
  'Quality Control Analyst': [
    { skill: 'Pharmacognosy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Phytochemical Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'HPLC/Analytical Testing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Standardization Techniques', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Lab Documentation', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Herbal Testing Specialist': [
    { skill: 'Adulteration Detection', level: 'ADVANCED' as SkillLevel },
    { skill: 'Phytochemical Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Microbial Load Testing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Heavy Metal Screening', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Laboratory Manager': [
    { skill: 'Lab Documentation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Stability Testing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'HPLC/Analytical Testing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Standardization Techniques', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Regulatory Affairs
  'Regulatory Affairs Specialist': [
    { skill: 'AYUSH Licensing Procedures', level: 'ADVANCED' as SkillLevel },
    { skill: 'Drug Regulatory Documentation', level: 'ADVANCED' as SkillLevel },
    { skill: 'GMP/GLP Compliance', level: 'ADVANCED' as SkillLevel },
    { skill: 'Labeling Compliance', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Policy Interpretation', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Compliance Manager': [
    { skill: 'GMP/GLP Compliance', level: 'ADVANCED' as SkillLevel },
    { skill: 'Regulatory Audit Preparation', level: 'ADVANCED' as SkillLevel },
    { skill: 'AYUSH Premium Mark Certification', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Policy Interpretation', level: 'ADVANCED' as SkillLevel },
  ],
  'Policy Advisor': [
    { skill: 'Policy Interpretation', level: 'ADVANCED' as SkillLevel },
    { skill: 'AYUSH Licensing Procedures', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Drug Regulatory Documentation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Pharmacovigilance for AYUSH Drugs', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Clinical Research
  'Clinical Research Associate': [
    { skill: 'Clinical Trial Design', level: 'ADVANCED' as SkillLevel },
    { skill: 'Good Clinical Practice', level: 'ADVANCED' as SkillLevel },
    { skill: 'Research Ethics & Protocols', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Biostatistics', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Scientific Writing', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Research Scientist': [
    { skill: 'Evidence-Based Traditional Medicine', level: 'ADVANCED' as SkillLevel },
    { skill: 'Reverse Pharmacology Methods', level: 'ADVANCED' as SkillLevel },
    { skill: 'Systematic Review & Meta-analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Scientific Writing', level: 'ADVANCED' as SkillLevel },
  ],
  'Evidence-Based Medicine Specialist': [
    { skill: 'Evidence-Based Traditional Medicine', level: 'ADVANCED' as SkillLevel },
    { skill: 'Systematic Review & Meta-analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Biostatistics', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Grant Proposal Writing', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Ayurvedic Nutrition & Dietetics
  'Ayurvedic Nutritionist': [
    { skill: 'Ahara Vidhi', level: 'ADVANCED' as SkillLevel },
    { skill: 'Prakriti-based Diet Planning', level: 'ADVANCED' as SkillLevel },
    { skill: 'Rasa-Guna-Virya Analysis', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Client Diet Counseling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Dietary Compliance Coaching', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Diet Consultant': [
    { skill: 'Prakriti-based Diet Planning', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Therapeutic Food Formulation', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Client Diet Counseling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Weight Management Protocols', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Wellness Nutrition Coach': [
    { skill: 'Client Diet Counseling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Dietary Compliance Coaching', level: 'ADVANCED' as SkillLevel },
    { skill: 'Ritucharya (Seasonal Diet)', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Nutraceutical Knowledge', level: 'BEGINNER' as SkillLevel },
  ],
  
  // AYUSH Wellness Tourism & Spa Management
  'Wellness Retreat Manager': [
    { skill: 'Wellness Retreat Program Design', level: 'ADVANCED' as SkillLevel },
    { skill: 'Hospitality Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'Facility Operations Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'International Client Handling', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Spa Director': [
    { skill: 'Spa Therapy Protocols', level: 'ADVANCED' as SkillLevel },
    { skill: 'Hospitality Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'Client Service & Sales', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Facility Operations Management', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Wellness Tourism Consultant': [
    { skill: 'Wellness Package Curation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Wellness Tourism Marketing', level: 'ADVANCED' as SkillLevel },
    { skill: 'International Client Handling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Wellness Product Knowledge', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Digital Health & Informatics
  'AYUSH Health IT Specialist': [
    { skill: 'AYUSH EHR Systems', level: 'ADVANCED' as SkillLevel },
    { skill: 'NAMASTE Terminology Coding', level: 'ADVANCED' as SkillLevel },
    { skill: 'Health Data Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Data Privacy in Healthcare', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Digital Health Coordinator': [
    { skill: 'Telemedicine Platforms', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'AYUSH Grid Portal Usage', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Digital Literacy Training', level: 'ADVANCED' as SkillLevel },
    { skill: 'Tech-enabled Patient Communication', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Health Informatics Analyst': [
    { skill: 'Health Data Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'AYUSH EHR Systems', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Data Privacy in Healthcare', level: 'ADVANCED' as SkillLevel },
    { skill: 'Mobile Health App Familiarity', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Medicinal Plant Cultivation
  'Medicinal Plant Farmer': [
    { skill: 'Herbal Farming Techniques', level: 'ADVANCED' as SkillLevel },
    { skill: 'GACP', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Organic Cultivation Methods', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Post-Harvest Processing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Crop Yield Optimization', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Herbal Agriculture Specialist': [
    { skill: 'Medicinal Plant Identification', level: 'ADVANCED' as SkillLevel },
    { skill: 'Herbal Farming Techniques', level: 'ADVANCED' as SkillLevel },
    { skill: 'Soil & Water Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Pest Management (Organic)', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'GACP Consultant': [
    { skill: 'GACP', level: 'ADVANCED' as SkillLevel },
    { skill: 'Medicinal Plant Identification', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Seed Bank Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Post-Harvest Processing', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Hospital & Clinic Administration
  'AYUSH Hospital Administrator': [
    { skill: 'Healthcare Facility Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'AYUSH Hospital Accreditation Standards', level: 'ADVANCED' as SkillLevel },
    { skill: 'Staff Scheduling', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Facility Compliance Audits', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Crisis/Emergency Coordination', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Clinic Manager': [
    { skill: 'Healthcare Facility Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Inventory & Supply Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'Patient Records Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Billing & Insurance Coordination', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Healthcare Operations Manager': [
    { skill: 'Healthcare Facility Management', level: 'ADVANCED' as SkillLevel },
    { skill: 'Staff Scheduling', level: 'ADVANCED' as SkillLevel },
    { skill: 'Vendor Management', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Facility Compliance Audits', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Public Health & Community Outreach
  'Public Health Officer': [
    { skill: 'AYUSH Program Implementation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Community Health Education', level: 'ADVANCED' as SkillLevel },
    { skill: 'Government Scheme Awareness', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Data Collection for Health Surveys', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Stakeholder Coordination', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Community Health Worker': [
    { skill: 'Community Health Education', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Health Camp Organization', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Rural Healthcare Delivery', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Public Health Messaging', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'AYUSH Program Coordinator': [
    { skill: 'AYUSH Program Implementation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Stakeholder Coordination', level: 'ADVANCED' as SkillLevel },
    { skill: 'Health Camp Organization', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Traditional Knowledge Documentation', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // Ayurvedic Cosmetology & Beauty Therapy
  'Ayurvedic Cosmetologist': [
    { skill: 'Herbal Skincare Formulation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Ayurvedic Beauty Treatments', level: 'ADVANCED' as SkillLevel },
    { skill: 'Skin Type Analysis', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Client Consultation', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Beauty Therapist': [
    { skill: 'Ayurvedic Beauty Treatments', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Facial Marma Therapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Hair & Scalp Therapy', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Client Consultation', level: 'ADVANCED' as SkillLevel },
    { skill: 'Retail & Upselling', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Natural Skincare Consultant': [
    { skill: 'Product Knowledge (Natural Cosmetics)', level: 'ADVANCED' as SkillLevel },
    { skill: 'Skin Type Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Treatment Protocol Design', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Client Consultation', level: 'ADVANCED' as SkillLevel },
  ],
  
  // Yoga for Sports & Fitness
  'Sports Yoga Therapist': [
    { skill: 'Sports-specific Yoga Therapy', level: 'ADVANCED' as SkillLevel },
    { skill: 'Injury Prevention Techniques', level: 'ADVANCED' as SkillLevel },
    { skill: 'Athlete Assessment', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Rehabilitation Yoga', level: 'ADVANCED' as SkillLevel },
    { skill: 'Athlete Communication', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Athletic Trainer': [
    { skill: 'Flexibility & Recovery Training', level: 'ADVANCED' as SkillLevel },
    { skill: 'Injury Prevention Techniques', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Strength & Conditioning Integration', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Sports Nutrition Basics', level: 'BEGINNER' as SkillLevel },
  ],
  'Performance Coach': [
    { skill: 'Performance-focused Pranayama', level: 'ADVANCED' as SkillLevel },
    { skill: 'Athlete Assessment', level: 'ADVANCED' as SkillLevel },
    { skill: 'Athlete Communication', level: 'ADVANCED' as SkillLevel },
    { skill: 'Sports-specific Yoga Therapy', level: 'INTERMEDIATE' as SkillLevel },
  ],
  
  // AYUSH Education & Academic Training
  'AYUSH Faculty Member': [
    { skill: 'Curriculum Development', level: 'ADVANCED' as SkillLevel },
    { skill: 'Classical Text Teaching', level: 'ADVANCED' as SkillLevel },
    { skill: 'Clinical Training Supervision', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Academic Research Writing', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Mentorship & Guidance', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Clinical Training Supervisor': [
    { skill: 'Clinical Training Supervision', level: 'ADVANCED' as SkillLevel },
    { skill: 'Student Assessment Design', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Mentorship & Guidance', level: 'ADVANCED' as SkillLevel },
    { skill: 'Classical Text Teaching', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Academic Researcher': [
    { skill: 'Academic Research Writing', level: 'ADVANCED' as SkillLevel },
    { skill: 'Academic Publication', level: 'ADVANCED' as SkillLevel },
    { skill: 'Sanskrit/Classical Language Instruction', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'E-learning Content Creation', level: 'BEGINNER' as SkillLevel },
  ],
  
  // TECHNOLOGY DOMAIN GOALS (sample - add all your existing ones)
  'Frontend Developer': [
    { skill: 'JavaScript', level: 'ADVANCED' as SkillLevel },
    { skill: 'React', level: 'ADVANCED' as SkillLevel },
    { skill: 'HTML/CSS', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'TypeScript', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Git Version Control', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Backend Developer': [
    { skill: 'Node.js', level: 'ADVANCED' as SkillLevel },
    { skill: 'Python', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'SQL', level: 'ADVANCED' as SkillLevel },
    { skill: 'REST APIs', level: 'ADVANCED' as SkillLevel },
    { skill: 'Git Version Control', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript', level: 'ADVANCED' as SkillLevel },
    { skill: 'React', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Node.js', level: 'ADVANCED' as SkillLevel },
    { skill: 'SQL', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'REST APIs', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Git Version Control', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Data Analyst': [
    { skill: 'Python', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'SQL', level: 'ADVANCED' as SkillLevel },
    { skill: 'Data Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Data Visualization', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'Excel/Spreadsheets', level: 'INTERMEDIATE' as SkillLevel },
  ],
  'Data Scientist': [
    { skill: 'Python', level: 'ADVANCED' as SkillLevel },
    { skill: 'Machine Learning', level: 'ADVANCED' as SkillLevel },
    { skill: 'Data Analysis', level: 'ADVANCED' as SkillLevel },
    { skill: 'Statistics', level: 'INTERMEDIATE' as SkillLevel },
    { skill: 'SQL', level: 'INTERMEDIATE' as SkillLevel },
  ],
};

async function seedGoalSkills() {
  console.log('🎯 Starting GoalSkill seeding...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const goalSkillCounts: Record<string, number> = {};
  
  try {
    // Get all goals with their associated fields
    const goals = await prisma.goal.findMany({
      include: {
        field: {
          include: {
            fieldSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    });
    
    console.log(`Found ${goals.length} goals to process\n`);
    
    for (const goal of goals) {
      const requirements = GOAL_SKILL_REQUIREMENTS[goal.title as keyof typeof GOAL_SKILL_REQUIREMENTS];
      
      if (!requirements) {
        console.log(`⚠️  No skill requirements defined for goal: "${goal.title}" (${goal.field.name})`);
        errorCount++;
        continue;
      }
      
      console.log(`📌 Processing: ${goal.title} (${goal.field.name})`);
      let linkedCount = 0;
      
      for (const req of requirements) {
        // Find the skill by name
        const skill = await prisma.skill.findFirst({
          where: {
            name: {
              equals: req.skill,
              mode: 'insensitive',
            },
          },
        });
        
        if (!skill) {
          console.log(`   ⚠️  Skill not found: "${req.skill}"`);
          continue;
        }
        
        // Create GoalSkill mapping
        try {
          await prisma.goalSkill.upsert({
            where: {
              goalId_skillId: {
                goalId: goal.id,
                skillId: skill.id,
              },
            },
            update: {
              requiredLevel: req.level,
            },
            create: {
              goalId: goal.id,
              skillId: skill.id,
              requiredLevel: req.level,
            },
          });
          linkedCount++;
        } catch (e) {
          console.log(`   ❌ Error linking skill "${req.skill}":`, e);
        }
      }
      
      console.log(`   ✅ Linked ${linkedCount} skills\n`);
      goalSkillCounts[goal.title] = linkedCount;
      
      if (linkedCount >= 4) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 GOALSKILL SEEDING SUMMARY\n');
    console.log(`Total Goals Processed: ${goals.length}`);
    console.log(`Goals with 4+ skills: ${successCount} ✅`);
    console.log(`Goals with <4 skills: ${errorCount} ⚠️`);
    console.log('\n' + '='.repeat(80));
    
    // Verify counts
    console.log('\n🔍 Verification - Goals with skill counts:\n');
    const goalSkillStats = await prisma.goal.findMany({
      include: {
        _count: {
          select: { goalSkills: true },
        },
        field: {
          select: { name: true },
        },
      },
      orderBy: {
        field: {
          name: 'asc',
        },
      },
    });
    
    for (const goal of goalSkillStats) {
      const status = goal._count.goalSkills >= 4 ? '✅' : '❌';
      console.log(`   ${status} ${goal.title} (${goal.field.name}): ${goal._count.goalSkills} skills`);
    }
    
    console.log('\n✅ GoalSkill seeding complete!\n');
    
  } catch (error) {
    console.error('❌ Error seeding GoalSkills:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedGoalSkills();
