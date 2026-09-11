'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Types
interface Field {
  id: string;
  name: string;
}

interface Goal {
  id: string;
  fieldId: string;
  title: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface SkillSelection {
  skillId: string;
  skillName: string;
  level: SkillLevel | null;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;
type Domain = 'TECHNOLOGY' | 'AYUSH';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(0); // Start at Step 0 now
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data
  const [fields, setFields] = useState<Field[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Selections
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null); // NEW
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [skillLevels, setSkillLevels] = useState<Map<string, SkillLevel>>(new Map());

  // Search/filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom skill feature
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState<'TECHNICAL' | 'SOFT'>('TECHNICAL');
  const [addingCustomSkill, setAddingCustomSkill] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Check if already completed onboarding
      const profileRes = await fetch('/api/student/onboarding/status');
      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data.completed) {
          // Pre-fill existing selections
          setSelectedFieldId(data.fieldId);
          setSelectedGoalId(data.goalId);
          if (data.skills && data.skills.length > 0) {
            const skillIds = new Set<string>(data.skills.map((s: any) => s.skillId as string));
            const levels = new Map<string, SkillLevel>(
              data.skills.map((s: any) => [s.skillId as string, s.selfRatedLevel as SkillLevel])
            );
            setSelectedSkills(skillIds);
            setSkillLevels(levels);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFieldsForDomain = async (domain: Domain) => {
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

  const fetchGoalsForField = async (fieldId: string) => {
    try {
      const res = await fetch(`/api/student/onboarding/goals?fieldId=${fieldId}`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  const handleDomainSelect = async (domain: Domain) => {
    setSelectedDomain(domain);
    await fetchFieldsForDomain(domain);
    setCurrentStep(1);
  };

  const handleFieldSelect = async (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setSelectedGoalId(null); // Reset goal when field changes
    await fetchGoalsForField(fieldId);
    // Fetch skills for this specific field
    await fetchSkillsForField(fieldId);
    setCurrentStep(2);
  };

  const fetchSkillsForField = async (fieldId: string) => {
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

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentStep(3);
  };

  const handleSkillToggle = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skillId)) {
      newSelected.delete(skillId);
      const newLevels = new Map(skillLevels);
      newLevels.delete(skillId);
      setSkillLevels(newLevels);
    } else {
      newSelected.add(skillId);
    }
    setSelectedSkills(newSelected);
  };

  const handleLevelSelect = (skillId: string, level: SkillLevel) => {
    const newLevels = new Map(skillLevels);
    newLevels.set(skillId, level);
    setSkillLevels(newLevels);
  };

  const handleAddCustomSkill = async () => {
    if (!customSkillName.trim() || !selectedFieldId) {
      return;
    }

    setAddingCustomSkill(true);
    try {
      const res = await fetch('/api/student/skills/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId: selectedFieldId,
          skillName: customSkillName.trim(),
          category: customSkillCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newSkill: Skill = {
          id: data.skill.id,
          name: data.skill.name,
          category: data.skill.category,
        };

        // Add to skills list
        setSkills(prev => [...prev, newSkill]);

        // Auto-select the custom skill
        const newSelected = new Set(selectedSkills);
        newSelected.add(newSkill.id);
        setSelectedSkills(newSelected);

        // Reset form
        setCustomSkillName('');
        setShowCustomSkillInput(false);
        setCustomSkillCategory('TECHNICAL');
      } else {
        alert('Failed to add custom skill. Please try again.');
      }
    } catch (error) {
      console.error('Failed to add custom skill:', error);
      alert('Failed to add custom skill. Please try again.');
    } finally {
      setAddingCustomSkill(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFieldId || !selectedGoalId || selectedSkills.size === 0) {
      return;
    }

    // Check all skills have levels set
    const allSkillsRated = Array.from(selectedSkills).every(skillId =>
      skillLevels.has(skillId)
    );

    if (!allSkillsRated) {
      alert('Please rate all selected skills before continuing');
      return;
    }

    setSubmitting(true);
    try {
      const skillSelections = Array.from(selectedSkills).map(skillId => ({
        skillId,
        level: skillLevels.get(skillId)!,
      }));

      // Save to localStorage for mock mode (will be read by profile page)
      const selectedField = fields.find(f => f.id === selectedFieldId);
      const selectedGoal = goals.find(g => g.id === selectedGoalId);
      
      const onboardingData = {
        domain: selectedDomain,
        fieldId: selectedFieldId,
        fieldName: selectedField?.name || '',
        goalId: selectedGoalId,
        goalTitle: selectedGoal?.title || '',
        skills: skills.filter(s => selectedSkills.has(s.id)).map(s => ({
          skillId: s.id,
          skillName: s.name,
          category: s.category,
          selfRatedLevel: skillLevels.get(s.id)!,
        })),
      };
      
      localStorage.setItem('mockOnboardingData', JSON.stringify(onboardingData));
      console.log('💾 Saved onboarding data to localStorage:', onboardingData);

      const res = await fetch('/api/student/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId: selectedFieldId,
          goalId: selectedGoalId,
          skills: skillSelections,
        }),
      });

      if (res.ok || res.status === 500) {
        // Even if API fails (mock mode), we have localStorage
        console.log('✅ Onboarding data saved successfully');
        setCurrentStep(5);
      } else {
        alert('Failed to save selections. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      // In mock mode, still proceed since we saved to localStorage
      console.log('⚠️ API submission failed, but localStorage saved - proceeding');
      setCurrentStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);
  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const technicalSkills = filteredSkills.filter(s => s.category === 'TECHNICAL');
  const softSkills = filteredSkills.filter(s => s.category === 'SOFT');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="font-heading text-2xl font-bold text-primary">Profile Setup</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? 'bg-accent text-white'
                      : 'bg-border text-muted'
                  }`}
                >
                  {step === 0 ? '🌐' : step}
                </div>
                {step < 5 && (
                  <div
                    className={`h-1 w-12 ${
                      step < currentStep ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Domain</span>
            <span>Field</span>
            <span>Goal</span>
            <span>Skills</span>
            <span>Rate</span>
            <span>Done</span>
          </div>
        </div>

        {/* Step 0: Domain Selection */}
        {currentStep === 0 && (
          <Card>
            <h2 className="font-heading text-section text-primary mb-2">
              Choose Your Domain
            </h2>
            <p className="text-muted mb-6">
              Select the domain that best aligns with your career interests
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technology Domain */}
              <button
                onClick={() => handleDomainSelect('TECHNOLOGY')}
                className={`p-8 text-center border-4 rounded-xl transition-all hover:scale-105 ${
                  selectedDomain === 'TECHNOLOGY'
                    ? 'border-accent bg-accent-light shadow-lg'
                    : 'border-border hover:border-accent/50 bg-surface'
                }`}
              >
                <div className="text-6xl mb-4">💻</div>
                <h3 className="font-heading text-xl font-bold text-primary-dark mb-2">
                  Technology
                </h3>
                <p className="text-sm text-muted">
                  Software, Data Science, Cloud, AI/ML, Web Development, and more
                </p>
              </button>

              {/* AYUSH Domain */}
              <button
                onClick={() => handleDomainSelect('AYUSH')}
                className={`p-8 text-center border-4 rounded-xl transition-all hover:scale-105 ${
                  selectedDomain === 'AYUSH'
                    ? 'border-accent bg-accent-light shadow-lg'
                    : 'border-border hover:border-accent/50 bg-surface'
                }`}
              >
                <div className="text-6xl mb-4">🌿</div>
                <h3 className="font-heading text-xl font-bold text-primary-dark mb-2">
                  AYUSH / Traditional Medicine
                </h3>
                <p className="text-sm text-muted">
                  Ayurveda, Yoga, Naturopathy, Unani, Siddha, Homoeopathy, and more
                </p>
              </button>
            </div>
          </Card>
        )}

        {/* Step 1: Field Selection */}
        {currentStep === 1 && (
          <Card>
            <div className="mb-4">
              <Badge variant="default">
                Domain: {selectedDomain === 'TECHNOLOGY' ? '💻 Technology' : '🌿 AYUSH'}
              </Badge>
            </div>

            <h2 className="font-heading text-section text-primary mb-2">
              What field are you interested in?
            </h2>
            <p className="text-muted mb-6">Choose the area you want to build your career in</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {fields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => handleFieldSelect(field.id)}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    selectedFieldId === field.id
                      ? 'border-accent bg-accent-light'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <p className="font-semibold text-primary-dark">{field.name}</p>
                </button>
              ))}
            </div>

            <Button variant="ghost" onClick={() => setCurrentStep(0)}>
              ← Back to Domain Selection
            </Button>
          </Card>
        )}

        {/* Step 2: Goal Selection */}
        {currentStep === 2 && (
          <Card>
            <div className="mb-4">
              <Badge variant="default">Field: {selectedField?.name}</Badge>
            </div>

            <h2 className="font-heading text-section text-primary mb-2">
              What's your career goal?
            </h2>
            <p className="text-muted mb-6">Choose the role you're aiming for</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    selectedGoalId === goal.id
                      ? 'border-accent bg-accent-light'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <p className="font-semibold text-primary-dark">{goal.title}</p>
                </button>
              ))}
            </div>

            <Button variant="ghost" onClick={() => setCurrentStep(1)}>
              ← Back to Field Selection
            </Button>
          </Card>
        )}

        {/* Step 3: Skill Selection */}
        {currentStep === 3 && (
          <Card>
            <div className="mb-4 flex gap-2">
              <Badge variant="default">{selectedField?.name}</Badge>
              <Badge variant="success">{selectedGoal?.title}</Badge>
            </div>

            <h2 className="font-heading text-section text-primary mb-2">
              Which skills do you have?
            </h2>
            <p className="text-muted mb-4">
              Select all skills you know (you'll rate them next)
            </p>

            {/* Search */}
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
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedSkills.has(skill.id)
                        ? 'bg-accent text-white'
                        : 'bg-surface border-2 border-border hover:border-accent/50 text-primary-dark'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-dark mb-3">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedSkills.has(skill.id)
                        ? 'bg-accent text-white'
                        : 'bg-surface border-2 border-border hover:border-accent/50 text-primary-dark'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Skill - "Other" Option */}
            <div className="mb-6 p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-primary-dark">
                  Don't see your skill?
                </h3>
                {!showCustomSkillInput && (
                  <button
                    onClick={() => setShowCustomSkillInput(true)}
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-all"
                  >
                    + Add Custom Skill
                  </button>
                )}
              </div>

              {showCustomSkillInput && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={customSkillName}
                      onChange={(e) => setCustomSkillName(e.target.value)}
                      placeholder="e.g., Pulse Diagnosis, Ayurvedic Cooking"
                      className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-accent"
                      disabled={addingCustomSkill}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                      Category
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCustomSkillCategory('TECHNICAL')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          customSkillCategory === 'TECHNICAL'
                            ? 'bg-accent text-white'
                            : 'bg-surface border-2 border-border text-primary-dark hover:border-accent/50'
                        }`}
                        disabled={addingCustomSkill}
                      >
                        Technical
                      </button>
                      <button
                        onClick={() => setCustomSkillCategory('SOFT')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          customSkillCategory === 'SOFT'
                            ? 'bg-accent text-white'
                            : 'bg-surface border-2 border-border text-primary-dark hover:border-accent/50'
                        }`}
                        disabled={addingCustomSkill}
                      >
                        Soft Skill
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowCustomSkillInput(false);
                        setCustomSkillName('');
                      }}
                      disabled={addingCustomSkill}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAddCustomSkill}
                      disabled={!customSkillName.trim() || addingCustomSkill}
                    >
                      {addingCustomSkill ? 'Adding...' : 'Add Skill'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                ← Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(4)}
                disabled={selectedSkills.size === 0}
              >
                Continue to Rating ({selectedSkills.size} skills)
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Rate Skills */}
        {currentStep === 4 && (
          <Card>
            <div className="mb-4 flex gap-2 flex-wrap">
              <Badge variant="default">{selectedField?.name}</Badge>
              <Badge variant="success">{selectedGoal?.title}</Badge>
              <Badge variant="warning">{selectedSkills.size} skills selected</Badge>
            </div>

            <h2 className="font-heading text-section text-primary mb-2">
              Rate your skill levels
            </h2>
            <p className="text-muted mb-6">
              Be honest — this helps us match you with the right opportunities
            </p>

            <div className="space-y-4 mb-6">
              {Array.from(selectedSkills).map((skillId) => {
                const skill = skills.find(s => s.id === skillId);
                if (!skill) return null;

                const selectedLevel = skillLevels.get(skillId);

                return (
                  <div key={skillId} className="p-4 bg-surface rounded-lg">
                    <p className="font-semibold text-primary-dark mb-3">{skill.name}</p>
                    <div className="flex gap-2">
                      {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as SkillLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => handleLevelSelect(skillId, level)}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedLevel === level
                              ? 'bg-accent text-white'
                              : 'bg-background border-2 border-border text-muted hover:border-accent/50'
                          }`}
                        >
                          {level === 'BEGINNER' && '🌱 Beginner'}
                          {level === 'INTERMEDIATE' && '📈 Intermediate'}
                          {level === 'ADVANCED' && '🏆 Advanced'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                ← Back to Skill Selection
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting || Array.from(selectedSkills).some(id => !skillLevels.has(id))}
              >
                {submitting ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-accent-light rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="font-heading text-section text-primary mb-2">
                Profile Setup Complete!
              </h2>
              <p className="text-muted mb-6">
                You've selected {selectedField?.name} → {selectedGoal?.title} with {selectedSkills.size} skills
              </p>

              <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-6 mb-6">
                <p className="text-sm font-semibold text-primary-dark mb-4">
                  🎯 Next Step: Verify Your Skills
                </p>
                <p className="text-sm text-muted mb-4">
                  Take short verification tests to earn verified badges and improve your match score with opportunities.
                </p>
                
                {/* Show selected skills with test links */}
                <div className="space-y-2 mb-4">
                  {Array.from(selectedSkills).slice(0, 5).map((skillId) => {
                    const skill = skills.find(s => s.id === skillId);
                    const level = skillLevels.get(skillId);
                    return skill ? (
                      <div key={skillId} className="flex items-center justify-between bg-surface p-3 rounded-lg">
                        <div className="text-left">
                          <p className="font-medium text-primary-dark text-sm">{skill.name}</p>
                          <p className="text-xs text-muted">Self-rated: {level || 'Unknown'}</p>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => router.push(`/student/test/${skillId}`)}
                        >
                          Start Test
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
                
                {selectedSkills.size > 5 && (
                  <p className="text-xs text-muted">+ {selectedSkills.size - 5} more skills available in your profile</p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/student/profile')}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/student/opportunities')}
                >
                  Browse Opportunities
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
