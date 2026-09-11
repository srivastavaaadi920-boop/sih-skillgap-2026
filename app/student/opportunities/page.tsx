'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchScore } from '@/components/ui/MatchScore';
import Link from 'next/link';

interface Opportunity {
  id: string;
  title: string;
  companyName: string;
  type: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/student/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Opportunities</h1>
          <Button onClick={() => router.push('/student')} variant="ghost">
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading text-section text-primary mb-2">
            Matched Opportunities
          </h2>
          <p className="text-muted">
            Opportunities ranked by how well your skills match the requirements
          </p>
        </div>

        {opportunities.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-muted mb-4">No opportunities available at the moment</p>
              <Button onClick={() => router.push('/student')} variant="secondary">
                Return to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <Link key={opp.id} href={`/student/opportunities/${opp.id}`}>
                <Card interactive>
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-card-title text-primary-dark">
                          {opp.title}
                        </h3>
                        <Badge
                          variant={
                            opp.type === 'INTERNSHIP'
                              ? 'success'
                              : opp.type === 'JOB'
                              ? 'default'
                              : 'warning'
                          }
                        >
                          {opp.type}
                        </Badge>
                      </div>

                      <p className="text-sm text-primary-dark mb-2">{opp.companyName}</p>

                      <div className="flex items-center gap-4 text-sm text-muted">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{opp.location}</span>
                        </div>
                        {opp.isRemote && (
                          <Badge variant="success">Remote</Badge>
                        )}
                      </div>
                    </div>

                    <MatchScore score={opp.matchScore} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
