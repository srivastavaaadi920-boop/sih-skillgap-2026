'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// Types
type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface ProfileData {
  domain: 'TECHNOLOGY' | 'AYUSH';
  fieldName: string;
  goalTitle: string;
  skills: {
    technical: Array<{
      skillId: string;
      skillName: string;
      category: string;
      selfRatedLevel: SkillLevel;
      isVerified: boolean;
    }>;
    soft: Array<{
      skillId: string;
      skillName: string;
      category: string;
      selfRatedLevel: SkillLevel;
      isVerified: boolean;
    }>;
  };
}

interface SkillGap {
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
  isFallback?: boolean;
  fallbackMessage?: string;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchSkillGap();
    }
  }, [profile]);

  const fetchProfile = async () => {
    console.log('🔍 fetchProfile called');
    
    try {
      const res = await fetch('/api/student/profile/data');
      console.log('🔍 API response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('🔍 API response data:', data);
        
        // If API says to use mock storage, read from localStorage
        if (data.useMockStorage === true) {
          console.log('📂 API says: Use localStorage');
          const stored = localStorage.getItem('mockOnboardingData');
          console.log('🔍 localStorage raw data:', stored);
          
          if (stored) {
            const mockData = JSON.parse(stored);
            console.log('✅ Parsed localStorage data:', mockData);
            setProfile({
              domain: mockData.domain,
              fieldName: mockData.fieldName,
              goalTitle: mockData.goalTitle,
              skills: {
                technical: mockData.skills.filter((s: any) => s.category === 'TECHNICAL'),
                soft: mockData.skills.filter((s: any) => s.category === 'SOFT'),
              },
            });
          } else {
            console.log('⚠️ No mock data in localStorage - onboarding not completed');
            setProfile(null);
          }
        } else {
          // Real data from API
          console.log('✅ Using real data from API');
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      // Try localStorage as fallback
      console.log('🔍 Trying localStorage fallback...');
      const stored = localStorage.getItem('mockOnboardingData');
      if (stored) {
        const mockData = JSON.parse(stored);
        console.log('⚠️ API failed, using localStorage fallback:', mockData);
        setProfile({
          domain: mockData.domain,
          fieldName: mockData.fieldName,
          goalTitle: mockData.goalTitle,
          skills: {
            technical: mockData.skills.filter((s: any) => s.category === 'TECHNICAL'),
            soft: mockData.skills.filter((s: any) => s.category === 'SOFT'),
          },
        });
      } else {
        console.log('❌ No localStorage fallback available');
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillGap = async () => {
    try {
      // Check if we're in mock mode by checking localStorage first
      const stored = localStorage.getItem('mockOnboardingData');
      
      if (stored && profile) {
        console.log('📊 Mock mode detected - calculating skill gap client-side');
        const mockData = JSON.parse(stored);
        
        // Import and use mock calculator
        const { calculateMockSkillGap } = await import('@/lib/mock-skill-gap');
        const gapData = calculateMockSkillGap(mockData.goalTitle, mockData.skills);
        
        console.log('✅ Mock skill gap calculated:', gapData);
        setSkillGap(gapData);
        return;
      }

      // Try API call for real mode
      const res = await fetch('/api/student/profile/skill-gap');
      if (res.ok) {
        const data = await res.json();
        console.log('📊 Skill gap API response:', data);
        setSkillGap(data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch skill gap:', error);
      // For mock mode or error, show empty skill gap
      setSkillGap({
        onTrack: [],
        needsImprovement: [],
        missing: [],
      });
    }
  };

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ADVANCED':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getLevelIcon = (level: SkillLevel) => {
    switch (level) {
      case 'BEGINNER':
        return '🌱';
      case 'INTERMEDIATE':
        return '📈';
      case 'ADVANCED':
        return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Card className="text-center max-w-md">
          <h2 className="font-heading text-section text-primary mb-4">
            Complete Your Profile
          </h2>
          <p className="text-muted mb-6">
            You haven't completed onboarding yet. Let's set up your profile to get personalized opportunities.
          </p>
          <Button variant="primary" onClick={() => router.push('/student/onboarding')}>
            Start Onboarding
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-primary">My Profile</h1>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.push('/student/opportunities')}>
                Browse Opportunities
              </Button>
              <Button variant="secondary" onClick={() => router.push('/student/onboarding')}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Career Path Section */}
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading text-section text-primary mb-2">Your Career Path</h2>
              <p className="text-muted text-sm">Your selected domain, field, and career goal</p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              {profile.domain === 'TECHNOLOGY' ? '💻 Technology' : '🌿 AYUSH'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
              <p className="text-xs text-muted mb-1">Field of Interest</p>
              <p className="font-semibold text-primary-dark text-lg">{profile.fieldName}</p>
            </div>
            <div className="p-4 bg-accent/5 border-2 border-accent/20 rounded-lg">
              <p className="text-xs text-muted mb-1">Career Goal</p>
              <p className="font-semibold text-primary-dark text-lg">{profile.goalTitle}</p>
            </div>
          </div>
        </Card>

        {/* My Skills Section */}
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-heading text-section text-primary mb-2">My Skills</h2>
              <p className="text-muted text-sm">
                Skills you've self-rated during onboarding • Take verification tests to earn verified badges
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {profile.skills.technical.length + profile.skills.soft.length}
              </p>
              <p className="text-xs text-muted">Total Skills</p>
            </div>
          </div>

          {/* Technical Skills */}
          {profile.skills.technical.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span> Technical Skills
                <Badge variant="default" className="ml-2">{profile.skills.technical.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.technical.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="p-4 bg-surface border-2 border-border rounded-lg hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-primary-dark">{skill.skillName}</p>
                      {skill.isVerified ? (
                        <Badge variant="success" className="text-xs">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-xs flex items-center gap-1">
                          <span className="text-base">👤</span> Self-Rated
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getLevelColor(skill.selfRatedLevel)}`}>
                        {getLevelIcon(skill.selfRatedLevel)} {skill.selfRatedLevel}
                      </span>
                    </div>
                    {!skill.isVerified && (
                      <button
                        onClick={() => router.push(`/student/test/${skill.skillId}`)}
                        className="mt-3 text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1"
                      >
                        → Take verification test
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {profile.skills.soft.length > 0 && (
            <div>
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <span className="text-xl">🤝</span> Soft Skills
                <Badge variant="default" className="ml-2">{profile.skills.soft.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.soft.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="p-4 bg-surface border-2 border-border rounded-lg hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-primary-dark">{skill.skillName}</p>
                      {skill.isVerified ? (
                        <Badge variant="success" className="text-xs">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-xs flex items-center gap-1">
                          <span className="text-base">👤</span> Self-Rated
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getLevelColor(skill.selfRatedLevel)}`}>
                        {getLevelIcon(skill.selfRatedLevel)} {skill.selfRatedLevel}
                      </span>
                    </div>
                    {!skill.isVerified && (
                      <button
                        onClick={() => router.push(`/student/test/${skill.skillId}`)}
                        className="mt-3 text-xs text-accent hover:text-accent-dark font-medium flex items-center gap-1"
                      >
                        → Take verification test
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.skills.technical.length === 0 && profile.skills.soft.length === 0 && (
            <div className="text-center py-8 text-muted">
              <p>No skills added yet. Complete your onboarding to add skills.</p>
            </div>
          )}
        </Card>

        {/* Skill Gap Analysis Section */}
        {skillGap && (
          <Card className="mb-8">
            <div className="mb-6">
              <h2 className="font-heading text-section text-primary mb-2">
                Skills for Your Goal: {profile.goalTitle}
              </h2>
              <p className="text-muted text-sm">
                Compare your current skills with what's required for your career goal
              </p>
              {skillGap.isFallback && skillGap.fallbackMessage && (
                <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <span className="text-lg">ℹ️</span>
                    {skillGap.fallbackMessage} (goal-specific requirements being finalized)
                  </p>
                </div>
              )}
            </div>

            {/* On Track */}
            {skillGap.onTrack.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark">You're On Track</h3>
                    <p className="text-sm text-muted">
                      Skills where you meet or exceed requirements
                    </p>
                  </div>
                  <Badge variant="success" className="ml-auto">{skillGap.onTrack.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillGap.onTrack.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 border-2 border-green-200 rounded-lg"
                    >
                      <p className="font-medium text-primary-dark text-sm mb-1">
                        {item.skillName}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted">Your level:</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${getLevelColor(item.currentLevel)}`}>
                          {getLevelIcon(item.currentLevel)} {item.currentLevel}
                        </span>
                        <span className="text-muted">≥</span>
                        <span className="text-muted">Required:</span>
                        <span className="font-medium text-green-700">
                          {getLevelIcon(item.requiredLevel)} {item.requiredLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Needs Improvement */}
            {skillGap.needsImprovement.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark">Skills to Strengthen</h3>
                    <p className="text-sm text-muted">
                      You have these skills but need to reach a higher level
                    </p>
                  </div>
                  <Badge variant="warning" className="ml-auto">{skillGap.needsImprovement.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillGap.needsImprovement.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
                    >
                      <p className="font-medium text-primary-dark text-sm mb-1">
                        {item.skillName}
                      </p>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="text-muted">Your level:</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${getLevelColor(item.currentLevel)}`}>
                          {getLevelIcon(item.currentLevel)} {item.currentLevel}
                        </span>
                        <span className="text-muted">→</span>
                        <span className="text-muted">Target:</span>
                        <span className="font-medium text-yellow-700">
                          {getLevelIcon(item.requiredLevel)} {item.requiredLevel}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        💡 Consider courses, practice projects, or mentorship to level up
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {skillGap.missing.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-dark">Skills to Learn</h3>
                    <p className="text-sm text-muted">
                      Required skills you haven't added to your profile yet
                    </p>
                  </div>
                  <Badge variant="warning" className="ml-auto">{skillGap.missing.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillGap.missing.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border-2 border-red-200 rounded-lg"
                    >
                      <p className="font-medium text-primary-dark text-sm mb-1">
                        {item.skillName}
                      </p>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="text-muted">Required level:</span>
                        <span className="font-medium text-red-700">
                          {getLevelIcon(item.requiredLevel)} {item.requiredLevel}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        💡 Start learning this skill to improve your match with opportunities
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Gap Data */}
            {skillGap.onTrack.length === 0 &&
              skillGap.needsImprovement.length === 0 &&
              skillGap.missing.length === 0 && (
                <div className="text-center py-8 text-muted">
                  <p className="text-4xl mb-4">🎯</p>
                  <p className="font-medium text-primary-dark mb-2">
                    No skill requirements defined yet
                  </p>
                  <p className="text-sm">
                    Skill requirements for your goal are being set up. Check back soon!
                  </p>
                </div>
              )}
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => router.push('/student/assessment')}
          >
            Take Skill Assessment
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push('/student/opportunities')}
          >
            Find Matching Opportunities →
          </Button>
        </div>
      </div>
    </div>
  );
}
