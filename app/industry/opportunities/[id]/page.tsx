'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface OpportunityDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  location: string | null;
  isRemote: boolean;
  postedAt: string;
  deadline: string | null;
  applicantCount: number;
  requiredSkills: Array<{
    skillId: string;
    skillName: string;
    minProficiency: number;
  }>;
}

interface Candidate {
  applicationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  field: string;
  goal: string;
  matchPercentage: number;
  matchedSkills: Array<{
    skillName: string;
    studentProficiency: number;
    requiredProficiency: number;
    status: string;
    credit: number;
  }>;
  gapSkills: Array<{
    skillName: string;
    studentProficiency: number;
    requiredProficiency: number;
    status: string;
    credit: number;
  }>;
  applicationStatus: string;
  appliedAt: string;
}

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'candidates'>('details');
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [opportunityId]);

  useEffect(() => {
    if (activeTab === 'candidates' && candidates.length === 0) {
      fetchCandidates();
    }
  }, [activeTab]);

  const fetchOpportunity = async () => {
    try {
      const res = await fetch(`/api/industry/opportunities/${opportunityId}`);
      if (res.ok) {
        const data = await res.json();
        
        // MOCK MODE - Load from localStorage
        if (data.useMockStorage) {
          console.log('🔧 MOCK MODE: Loading opportunity from localStorage');
          console.log('   Opportunity ID:', opportunityId);
          
          const stored = localStorage.getItem('industry_opportunities');
          if (stored) {
            const opportunities = JSON.parse(stored);
            const found = opportunities.find((opp: any) => opp.id === opportunityId);
            
            if (found) {
              console.log('   Found opportunity:', found.title);
              setOpportunity({
                id: found.id,
                title: found.title,
                description: found.description,
                type: found.type,
                status: found.status,
                location: found.location,
                isRemote: found.isRemote,
                postedAt: found.postedAt,
                deadline: found.deadline,
                applicantCount: 0, // No applications in mock mode yet
                requiredSkills: found.requiredSkills || [],
              });
            } else {
              console.log('   Opportunity not found in localStorage');
              setOpportunity(null);
            }
          } else {
            console.log('   No opportunities in localStorage');
            setOpportunity(null);
          }
        } else {
          setOpportunity(data.opportunity);
        }
      }
    } catch (error) {
      console.error('Failed to fetch opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await fetch(`/api/industry/opportunities/${opportunityId}/candidates`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/industry/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh candidates list
        fetchCandidates();
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    }
  };

  const toggleOpportunityStatus = async () => {
    if (!opportunity) return;

    const newStatus = opportunity.status === 'OPEN' ? 'CLOSED' : 'OPEN';

    try {
      const res = await fetch(`/api/industry/opportunities/${opportunityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // MOCK MODE - Update localStorage
        if (data.useMockStorage) {
          console.log('🔧 MOCK MODE: Updating opportunity status in localStorage');
          const stored = localStorage.getItem('industry_opportunities');
          if (stored) {
            const opportunities = JSON.parse(stored);
            const index = opportunities.findIndex((opp: any) => opp.id === opportunityId);
            if (index !== -1) {
              opportunities[index].status = newStatus;
              localStorage.setItem('industry_opportunities', JSON.stringify(opportunities));
              console.log('   Updated status to:', newStatus);
            }
          }
        }
        
        setOpportunity({ ...opportunity, status: newStatus });
      } else {
        alert('Failed to update opportunity status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update opportunity status');
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getProficiencyLabel = (level: number) => {
    if (level === 2) return '🌱 Beginner';
    if (level === 3) return '📈 Intermediate';
    if (level === 4) return '🏆 Advanced';
    if (level === 0) return '❌ Missing';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading opportunity...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="text-center">
          <p className="text-4xl mb-4">❌</p>
          <p className="text-primary-dark font-semibold mb-4">Opportunity not found</p>
          <Button variant="primary" onClick={() => router.push('/industry/opportunities')}>
            Back to Opportunities
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/industry/opportunities')}
                className="text-muted hover:text-primary"
              >
                ← Back to Opportunities
              </button>
              <h1 className="font-heading text-2xl font-bold text-primary">
                {opportunity.title}
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                variant={opportunity.status === 'OPEN' ? 'secondary' : 'primary'}
                onClick={toggleOpportunityStatus}
              >
                {opportunity.status === 'OPEN' ? 'Close Applications' : 'Reopen Applications'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(`/industry/opportunities/${opportunityId}/edit`)}
              >
                ✏️ Edit
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-border">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'details'
                ? 'text-accent border-b-4 border-accent'
                : 'text-muted hover:text-primary'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'candidates'
                ? 'text-accent border-b-4 border-accent'
                : 'text-muted hover:text-primary'
            }`}
          >
            Candidates ({opportunity.applicantCount})
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <h2 className="font-heading text-section text-primary mb-4">Description</h2>
                <p className="text-primary-dark whitespace-pre-wrap">{opportunity.description}</p>
              </Card>

              <Card>
                <h2 className="font-heading text-section text-primary mb-4">
                  Required Skills ({opportunity.requiredSkills.length})
                </h2>
                <div className="space-y-3">
                  {opportunity.requiredSkills.map((skill) => (
                    <div
                      key={skill.skillId}
                      className="flex items-center justify-between p-3 bg-surface rounded-lg border-2 border-border"
                    >
                      <span className="font-medium text-primary-dark">{skill.skillName}</span>
                      <span className="text-sm font-medium text-muted">
                        Min: {getProficiencyLabel(skill.minProficiency)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <h3 className="font-semibold text-primary-dark mb-4">Overview</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted mb-1">Type</p>
                    <Badge variant="default">{opportunity.type}</Badge>
                  </div>
                  <div>
                    <p className="text-muted mb-1">Status</p>
                    <Badge
                      variant={opportunity.status === 'OPEN' ? 'success' : 'default'}
                    >
                      {opportunity.status}
                    </Badge>
                  </div>
                  {opportunity.location && (
                    <div>
                      <p className="text-muted mb-1">Location</p>
                      <p className="text-primary-dark">📍 {opportunity.location}</p>
                    </div>
                  )}
                  {opportunity.isRemote && (
                    <div>
                      <p className="text-primary-dark">🌐 Remote work available</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted mb-1">Posted</p>
                    <p className="text-primary-dark">
                      {new Date(opportunity.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {opportunity.deadline && (
                    <div>
                      <p className="text-muted mb-1">Deadline</p>
                      <p className="text-primary-dark">
                        ⏰ {new Date(opportunity.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-primary-dark mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-accent mb-1">
                      {opportunity.applicantCount}
                    </p>
                    <p className="text-sm text-muted">Total Applicants</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {opportunity.requiredSkills.length}
                    </p>
                    <p className="text-sm text-muted">Skills Required</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div>
            {loadingCandidates ? (
              <Card className="text-center py-12">
                <p className="text-muted">Loading candidates...</p>
              </Card>
            ) : candidates.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="font-heading text-lg font-bold text-primary-dark mb-2">
                  No applications yet
                </h3>
                <p className="text-muted">
                  Candidates will appear here once they apply to this opportunity.
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {candidates.map((candidate) => (
                  <Card key={candidate.applicationId} className="relative">
                    {/* Candidate Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-primary-dark mb-1">
                          {candidate.studentName}
                        </h3>
                        <p className="text-sm text-muted mb-2">{candidate.studentEmail}</p>
                        <div className="flex gap-2">
                          <Badge variant="default" className="text-xs">
                            {candidate.field}
                          </Badge>
                          <Badge variant="success" className="text-xs">
                            {candidate.goal}
                          </Badge>
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold px-6 py-3 rounded-lg border-2 ${getMatchColor(
                            candidate.matchPercentage
                          )}`}
                        >
                          {candidate.matchPercentage}%
                        </div>
                        <p className="text-xs text-muted mt-1">Match Score</p>
                      </div>
                    </div>

                    {/* Skills Match Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Matched Skills */}
                      {candidate.matchedSkills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-green-700 mb-2">
                            ✓ Matched Skills ({candidate.matchedSkills.length})
                          </h4>
                          <div className="space-y-2">
                            {candidate.matchedSkills.slice(0, 3).map((skill, idx) => (
                              <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                                <p className="font-medium text-green-900">
                                  {skill.skillName}
                                </p>
                                <p className="text-green-700">
                                  Has: {getProficiencyLabel(skill.studentProficiency)} ≥ Required:{' '}
                                  {getProficiencyLabel(skill.requiredProficiency)}
                                </p>
                              </div>
                            ))}
                            {candidate.matchedSkills.length > 3 && (
                              <p className="text-xs text-muted">
                                +{candidate.matchedSkills.length - 3} more matched
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Gap Skills */}
                      {candidate.gapSkills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-700 mb-2">
                            ⚠ Gap Skills ({candidate.gapSkills.length})
                          </h4>
                          <div className="space-y-2">
                            {candidate.gapSkills.slice(0, 3).map((skill, idx) => (
                              <div key={idx} className="text-xs bg-red-50 p-2 rounded">
                                <p className="font-medium text-red-900">{skill.skillName}</p>
                                <p className="text-red-700">
                                  {skill.studentProficiency === 0
                                    ? 'Missing skill'
                                    : `Has: ${getProficiencyLabel(
                                        skill.studentProficiency
                                      )} < Required: ${getProficiencyLabel(
                                        skill.requiredProficiency
                                      )}`}
                                </p>
                              </div>
                            ))}
                            {candidate.gapSkills.length > 3 && (
                              <p className="text-xs text-muted">
                                +{candidate.gapSkills.length - 3} more gaps
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Application Actions */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-border">
                      <div>
                        <p className="text-xs text-muted">
                          Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-medium text-primary-dark mt-1">
                          Status:{' '}
                          <span
                            className={
                              candidate.applicationStatus === 'SELECTED'
                                ? 'text-green-600'
                                : candidate.applicationStatus === 'SHORTLISTED'
                                ? 'text-blue-600'
                                : candidate.applicationStatus === 'REJECTED'
                                ? 'text-red-600'
                                : 'text-muted'
                            }
                          >
                            {candidate.applicationStatus}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {candidate.applicationStatus === 'APPLIED' && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleStatusChange(candidate.applicationId, 'SHORTLISTED')
                              }
                            >
                              📋 Shortlist
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleStatusChange(candidate.applicationId, 'REJECTED')
                              }
                            >
                              ❌ Reject
                            </Button>
                          </>
                        )}
                        {candidate.applicationStatus === 'SHORTLISTED' && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleStatusChange(candidate.applicationId, 'SELECTED')
                              }
                            >
                              ✓ Select
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleStatusChange(candidate.applicationId, 'REJECTED')
                              }
                            >
                              ❌ Reject
                            </Button>
                          </>
                        )}
                        {candidate.applicationStatus === 'SELECTED' && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              handleStatusChange(candidate.applicationId, 'COMPLETED')
                            }
                          >
                            ✓ Mark as Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
