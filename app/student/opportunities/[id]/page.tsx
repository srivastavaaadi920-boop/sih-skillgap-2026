'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchScore } from '@/components/ui/MatchScore';

interface ExactMatchSkill {
  type: 'exact';
  requiredSkillName: string;
  studentSkillName: string;
  studentProficiency: number;
  requiredProficiency: number;
  proficiencyRatio: number;
}

interface SemanticMatchSkill {
  type: 'semantic';
  requiredSkillName: string;
  matchedStudentSkillName: string;
  similarityScore: number;
  studentProficiency: number;
  requiredProficiency: number;
}

interface GapSkill {
  type: 'gap';
  requiredSkillName: string;
  requiredProficiency: number;
}

interface MatchBreakdown {
  exactMatchCount: number;
  semanticMatchCount: number;
  gapCount: number;
  totalRequired: number;
}

interface OpportunityDetail {
  id: string;
  title: string;
  description: string;
  companyName: string;
  type: string;
  location: string;
  isRemote: boolean;
  postedAt: string;
  deadline: string;
}

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [matchScore, setMatchScore] = useState(0);
  const [exactMatches, setExactMatches] = useState<ExactMatchSkill[]>([]);
  const [semanticMatches, setSemanticMatches] = useState<SemanticMatchSkill[]>([]);
  const [gapSkills, setGapSkills] = useState<GapSkill[]>([]);
  const [breakdown, setBreakdown] = useState<MatchBreakdown | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchOpportunityDetail(params.id as string);
    }
  }, [params.id]);

  const fetchOpportunityDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/student/opportunities/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunity(data.opportunity);
        setMatchScore(data.match.overallScore);
        setExactMatches(data.match.exactMatches || []);
        setSemanticMatches(data.match.semanticMatches || []);
        setGapSkills(data.match.gapSkills || []);
        setBreakdown(data.match.breakdown);
      }
    } catch (error) {
      console.error('Failed to fetch opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelLabel = (level: number) => {
    const labels: Record<number, string> = {
      0: 'None',
      1: 'Beginner',
      2: 'Basic',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
    };
    return labels[level] || level.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <p className="text-muted mb-4">Opportunity not found</p>
          <Button onClick={() => router.push('/student/opportunities')} variant="secondary">
            Back to Opportunities
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Opportunity Details</h1>
          <Button onClick={() => router.push('/student/opportunities')} variant="ghost">
            Back
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header Card */}
        <Card>
          <div className="flex items-start justify-between gap-6 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-heading text-2xl font-bold text-primary">{opportunity.title}</h2>
                <Badge
                  variant={
                    opportunity.type === 'INTERNSHIP'
                      ? 'success'
                      : opportunity.type === 'JOB'
                      ? 'default'
                      : 'warning'
                  }
                >
                  {opportunity.type}
                </Badge>
              </div>
              <p className="text-lg text-primary-dark mb-2">{opportunity.companyName}</p>
            </div>
            <MatchScore score={matchScore} size="large" />
          </div>

          <div className="flex items-center gap-6 text-sm text-muted mb-4 pb-4 border-b-2 border-border">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{opportunity.location}</span>
              {opportunity.isRemote && <Badge variant="success">Remote</Badge>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-card-title text-primary-dark mb-2">Description</h3>
            <p className="text-muted">{opportunity.description}</p>
          </div>
        </Card>

        {/* Skills You Have */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-primary">Skills You Have</h3>
              <p className="text-sm text-muted">
                {breakdown
                  ? `${breakdown.exactMatchCount + breakdown.semanticMatchCount} skills match this opportunity`
                  : 'Loading...'}
              </p>
            </div>
          </div>

          {exactMatches.length === 0 && semanticMatches.length === 0 ? (
            <p className="text-muted text-sm">No matching skills yet</p>
          ) : (
            <div className="space-y-3">
              {/* Exact Matches */}
              {exactMatches.map((skill, idx) => (
                <div key={`exact-${idx}`} className="flex items-center justify-between p-3 bg-accent-light rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-primary-dark">{skill.requiredSkillName}</p>
                      <Badge variant="success">Exact Match</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      Your level: {getLevelLabel(skill.studentProficiency)} | Required: {getLevelLabel(skill.requiredProficiency)}
                    </p>
                    {skill.proficiencyRatio >= 1.0 && (
                      <p className="text-sm text-accent font-medium mt-1">✓ Meets requirement fully</p>
                    )}
                    {skill.proficiencyRatio < 1.0 && (
                      <p className="text-sm text-warning font-medium mt-1">
                        ⚠ {Math.round(skill.proficiencyRatio * 100)}% of required level
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Semantic Matches */}
              {semanticMatches.map((skill, idx) => (
                <div key={`semantic-${idx}`} className="flex items-center justify-between p-3 bg-primary/5 border-2 border-primary/20 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-primary-dark">{skill.requiredSkillName}</p>
                      <Badge variant="default">Similar Skill</Badge>
                    </div>
                    <p className="text-sm text-muted mb-1">
                      Your skill: <span className="font-medium text-primary">{skill.matchedStudentSkillName}</span> ({Math.round(skill.similarityScore * 100)}% similar)
                    </p>
                    <p className="text-sm text-muted">
                      Your level: {getLevelLabel(skill.studentProficiency)} | Required: {getLevelLabel(skill.requiredProficiency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Skills to Develop */}
        {gapSkills.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-primary">Skills to Develop</h3>
                <p className="text-sm text-muted">Improve these skills to increase your match score</p>
              </div>
            </div>

            <div className="space-y-3">
              {gapSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface border-2 border-border rounded-lg">
                  <div>
                    <p className="font-medium text-primary-dark">{skill.requiredSkillName}</p>
                    <p className="text-sm text-muted">
                      Required: {getLevelLabel(skill.requiredProficiency)} • Not yet in your profile
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={() => router.push('/student/assessment')}>
            Update Skills
          </Button>
          <Button variant="primary" className="flex-1" disabled>
            Apply (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
}
