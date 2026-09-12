'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type OpportunityType = 'INTERNSHIP' | 'JOB' | 'TRAINING' | 'APPRENTICESHIP';
type Domain = 'TECHNOLOGY' | 'AYUSH';
type Step = 1 | 2 | 3;

interface Field {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface RequiredSkill {
  skillId: string;
  skillName: string;
  minProficiency: number; // 2=BEGINNER, 3=INTERMEDIATE, 4=ADVANCED
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Basic Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<OpportunityType>('INTERNSHIP');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [deadline, setDeadline] = useState('');

  // Step 2: Domain & Field
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Step 3: Required Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillProficiencies, setSkillProficiencies] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  const handleDomainSelect = async (domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedFieldId(null);
    // Fetch fields for domain
    try {
      const res = await fetch(`/api/student/onboarding/fields?domain=${domain}`);
      if (res.ok) {
        const data = await res.json();
        setFields(data.fields || []);
      }
    } catch (error) {
      console.error('Failed to fetch fields:', error);
    }
  };

  const handleFieldSelect = async (fieldId: string) => {
    setSelectedFieldId(fieldId);
    // Fetch skills for field
    try {
      const res = await fetch(`/api/student/assessment/skills?fieldId=${fieldId}`);
      if (res.ok) {
        const data = await res.json();
        const allSkills = [
          ...(data.technical || []).map((s: any) => ({ ...s, category: 'TECHNICAL' })),
          ...(data.soft || []).map((s: any) => ({ ...s, category: 'SOFT' })),
        ];
        setSkills(allSkills);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skillId)) {
      newSelected.delete(skillId);
      const newProf = new Map(skillProficiencies);
      newProf.delete(skillId);
      setSkillProficiencies(newProf);
    } else {
      newSelected.add(skillId);
      // Default to INTERMEDIATE (3)
      const newProf = new Map(skillProficiencies);
      newProf.set(skillId, 3);
      setSkillProficiencies(newProf);
    }
    setSelectedSkills(newSelected);
  };

  const handleProficiencyChange = (skillId: string, level: number) => {
    const newProf = new Map(skillProficiencies);
    newProf.set(skillId, level);
    setSkillProficiencies(newProf);
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedFieldId || selectedSkills.size === 0) {
      alert('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const requiredSkills = Array.from(selectedSkills).map((skillId) => ({
        skillId,
        minProficiency: skillProficiencies.get(skillId) || 3,
      }));

      const res = await fetch('/api/industry/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          location: location || null,
          isRemote,
          deadline: deadline || null,
          domain: selectedDomain,
          fieldId: selectedFieldId,
          requiredSkills,
        }),
      });

      console.log('📤 POST /api/industry/opportunities - Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('✅ Opportunity created successfully:', data);
        
        // MOCK MODE - Store in localStorage
        if (data.useMockStorage) {
          console.log('🔧 MOCK MODE: Storing opportunity in localStorage');
          const opportunities = JSON.parse(localStorage.getItem('industry_opportunities') || '[]');
          
          // Add skill names to the opportunity
          const opportunityWithSkills = {
            ...data.opportunity,
            requiredSkills: data.opportunity.requiredSkills.map((rs: any) => {
              const skill = skills.find((s) => s.id === rs.skillId);
              return {
                skillId: rs.skillId,
                skillName: skill?.name || 'Unknown Skill',
                minProficiency: rs.minProficiency,
              };
            }),
          };
          
          opportunities.push(opportunityWithSkills);
          localStorage.setItem('industry_opportunities', JSON.stringify(opportunities));
          console.log('   Stored opportunity:', opportunityWithSkills.id);
          console.log('   Total opportunities:', opportunities.length);
        }
        
        router.push(`/industry/opportunities/${data.opportunity.id}`);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Failed to create opportunity:', res.status, errorData);
        alert(`Failed to create opportunity: ${errorData.error || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('❌ Network or unexpected error:', error);
      alert('Failed to create opportunity. Network error - please check console.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const technicalSkills = filteredSkills.filter((s) => s.category === 'TECHNICAL');
  const softSkills = filteredSkills.filter((s) => s.category === 'SOFT');

  const getProficiencyLabel = (level: number) => {
    if (level === 2) return '🌱 Beginner';
    if (level === 3) return '📈 Intermediate';
    if (level === 4) return '🏆 Advanced';
    return 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/industry/opportunities')}
              className="text-muted hover:text-primary"
            >
              ← Back
            </button>
            <h1 className="font-heading text-2xl font-bold text-primary">Post New Opportunity</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep ? 'bg-accent text-white' : 'bg-border text-muted'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-24 ${step < currentStep ? 'bg-accent' : 'bg-border'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Basic Info</span>
            <span>Domain & Field</span>
            <span>Required Skills</span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <Card>
            <h2 className="font-heading text-section text-primary mb-6">Basic Information</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Full Stack Developer Internship"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  rows={6}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Opportunity Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['INTERNSHIP', 'JOB', 'TRAINING', 'APPRENTICESHIP'] as OpportunityType[]).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          type === t
                            ? 'bg-accent text-white'
                            : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Mumbai, India"
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="isRemote" className="text-sm font-medium text-primary-dark">
                  Remote work available
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                disabled={!title || !description}
              >
                Continue to Domain & Field
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Domain & Field */}
        {currentStep === 2 && (
          <Card>
            <h2 className="font-heading text-section text-primary mb-2">
              Select Domain & Field
            </h2>
            <p className="text-muted mb-6">
              Choose the domain and field to scope the right skill taxonomy for this opportunity
            </p>

            {!selectedDomain && (
              <div className="mb-6">
                <h3 className="font-semibold text-primary-dark mb-4">Choose Domain *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={() => handleDomainSelect('TECHNOLOGY')}
                    className="p-8 text-center border-4 border-border hover:border-accent rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-6xl mb-4">💻</div>
                    <h4 className="font-heading text-xl font-bold text-primary-dark mb-2">
                      Technology
                    </h4>
                    <p className="text-sm text-muted">
                      Software, Data Science, Cloud, AI/ML, Web Development
                    </p>
                  </button>

                  <button
                    onClick={() => handleDomainSelect('AYUSH')}
                    className="p-8 text-center border-4 border-border hover:border-accent rounded-xl transition-all hover:scale-105"
                  >
                    <div className="text-6xl mb-4">🌿</div>
                    <h4 className="font-heading text-xl font-bold text-primary-dark mb-2">
                      AYUSH / Traditional Medicine
                    </h4>
                    <p className="text-sm text-muted">
                      Ayurveda, Yoga, Naturopathy, Unani, Siddha, Homoeopathy
                    </p>
                  </button>
                </div>
              </div>
            )}

            {selectedDomain && !selectedFieldId && (
              <div>
                <div className="mb-4">
                  <Badge variant="default">
                    Domain: {selectedDomain === 'TECHNOLOGY' ? '💻 Technology' : '🌿 AYUSH'}
                  </Badge>
                </div>

                <h3 className="font-semibold text-primary-dark mb-4">Select Field *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {fields.map((field) => (
                    <button
                      key={field.id}
                      onClick={() => handleFieldSelect(field.id)}
                      className="p-4 text-left border-2 border-border hover:border-accent rounded-lg transition-all"
                    >
                      <p className="font-semibold text-primary-dark">{field.name}</p>
                    </button>
                  ))}
                </div>

                <Button variant="ghost" onClick={() => setSelectedDomain(null)}>
                  ← Change Domain
                </Button>
              </div>
            )}

            {selectedFieldId && (
              <div>
                <div className="mb-6">
                  <Badge variant="default" className="mr-2">
                    Domain: {selectedDomain === 'TECHNOLOGY' ? '💻 Technology' : '🌿 AYUSH'}
                  </Badge>
                  <Badge variant="success">Field: {selectedField?.name}</Badge>
                </div>

                <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                    ← Back to Basic Info
                  </Button>
                  <Button variant="primary" onClick={() => setCurrentStep(3)}>
                    Continue to Skills
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Required Skills */}
        {currentStep === 3 && (
          <Card>
            <h2 className="font-heading text-section text-primary mb-2">Required Skills</h2>
            <p className="text-muted mb-4">
              Select skills required for this opportunity and set minimum proficiency levels
            </p>

            <div className="mb-4">
              <Badge variant="default" className="mr-2">
                {selectedDomain === 'TECHNOLOGY' ? '💻 Technology' : '🌿 AYUSH'}
              </Badge>
              <Badge variant="success">{selectedField?.name}</Badge>
            </div>

            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border-2 border-border rounded-lg mb-6 focus:outline-none focus:border-accent"
            />

            <p className="text-sm text-muted mb-4">
              Selected: {selectedSkills.size} skills
            </p>

            {/* Technical Skills */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-dark mb-3">Technical Skills</h3>
              <div className="space-y-3">
                {technicalSkills.map((skill) => {
                  const isSelected = selectedSkills.has(skill.id);
                  const proficiency = skillProficiencies.get(skill.id) || 3;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-accent bg-accent-light' : 'border-border bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => handleSkillToggle(skill.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-primary-dark">{skill.name}</span>
                        </button>
                      </div>

                      {isSelected && (
                        <div className="ml-8 flex gap-2">
                          {[2, 3, 4].map((level) => (
                            <button
                              key={level}
                              onClick={() => handleProficiencyChange(skill.id, level)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                proficiency === level
                                  ? 'bg-accent text-white'
                                  : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
                              }`}
                            >
                              {getProficiencyLabel(level)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-dark mb-3">Soft Skills</h3>
              <div className="space-y-3">
                {softSkills.map((skill) => {
                  const isSelected = selectedSkills.has(skill.id);
                  const proficiency = skillProficiencies.get(skill.id) || 3;

                  return (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected ? 'border-accent bg-accent-light' : 'border-border bg-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => handleSkillToggle(skill.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-primary-dark">{skill.name}</span>
                        </button>
                      </div>

                      {isSelected && (
                        <div className="ml-8 flex gap-2">
                          {[2, 3, 4].map((level) => (
                            <button
                              key={level}
                              onClick={() => handleProficiencyChange(skill.id, level)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                proficiency === level
                                  ? 'bg-accent text-white'
                                  : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
                              }`}
                            >
                              {getProficiencyLabel(level)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                ← Back to Domain & Field
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting || selectedSkills.size === 0}
              >
                {submitting ? 'Creating...' : 'Create Opportunity'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
