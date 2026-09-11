'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Opportunity {
  id: string;
  title: string;
  type: string;
  status: string;
  location: string | null;
  isRemote: boolean;
  postedAt: string;
  deadline: string | null;
  applicantCount: number;
  requiredSkillsCount: number;
}

export default function OpportunitiesListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/industry/opportunities');
      if (res.ok) {
        const data = await res.json();
        
        // MOCK MODE - Load from localStorage
        if (data.useMockStorage) {
          console.log('🔧 MOCK MODE: Loading opportunities from localStorage');
          const stored = localStorage.getItem('industry_opportunities');
          if (stored) {
            const opportunities = JSON.parse(stored);
            console.log('   Loaded opportunities:', opportunities.length);
            
            // Format for display
            const formatted = opportunities.map((opp: any) => ({
              id: opp.id,
              title: opp.title,
              type: opp.type,
              status: opp.status,
              location: opp.location,
              isRemote: opp.isRemote,
              postedAt: opp.postedAt,
              deadline: opp.deadline,
              applicantCount: 0, // No applications in mock mode yet
              requiredSkillsCount: opp.requiredSkills?.length || 0,
            }));
            
            setOpportunities(formatted);
          } else {
            console.log('   No opportunities in localStorage');
            setOpportunities([]);
          }
        } else {
          setOpportunities(data.opportunities || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterStatus === 'ALL') return true;
    return opp.status === filterStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INTERNSHIP':
        return 'bg-blue-100 text-blue-800';
      case 'JOB':
        return 'bg-green-100 text-green-800';
      case 'TRAINING':
        return 'bg-purple-100 text-purple-800';
      case 'APPRENTICESHIP':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/industry')}
                className="text-muted hover:text-primary"
              >
                ← Back to Dashboard
              </button>
              <h1 className="font-heading text-2xl font-bold text-primary">My Opportunities</h1>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/industry/opportunities/new')}
            >
              + Post New Opportunity
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === 'ALL'
                ? 'bg-accent text-white'
                : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
            }`}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterStatus('OPEN')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === 'OPEN'
                ? 'bg-accent text-white'
                : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
            }`}
          >
            Open ({opportunities.filter((o) => o.status === 'OPEN').length})
          </button>
          <button
            onClick={() => setFilterStatus('CLOSED')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filterStatus === 'CLOSED'
                ? 'bg-accent text-white'
                : 'bg-surface border-2 border-border text-muted hover:border-accent/50'
            }`}
          >
            Closed ({opportunities.filter((o) => o.status === 'CLOSED').length})
          </button>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="font-heading text-lg font-bold text-primary-dark mb-2">
              No {filterStatus.toLowerCase()} opportunities yet
            </h3>
            <p className="text-muted mb-6">
              {filterStatus === 'ALL'
                ? 'Post your first opportunity to start receiving applications.'
                : `You don't have any ${filterStatus.toLowerCase()} opportunities.`}
            </p>
            {filterStatus === 'ALL' && (
              <Button
                variant="primary"
                onClick={() => router.push('/industry/opportunities/new')}
              >
                Post Your First Opportunity
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="cursor-pointer"
                onClick={() => router.push(`/industry/opportunities/${opp.id}`)}
              >
                <Card className="hover:border-accent/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading text-lg font-bold text-primary-dark">
                    {opp.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      opp.status
                    )}`}
                  >
                    {opp.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      opp.type
                    )}`}
                  >
                    {opp.type}
                  </span>
                  {opp.isRemote && (
                    <Badge variant="default" className="text-xs">
                      🌐 Remote
                    </Badge>
                  )}
                  {opp.location && (
                    <Badge variant="default" className="text-xs">
                      📍 {opp.location}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t-2 border-border">
                  <div>
                    <p className="text-2xl font-bold text-primary">{opp.applicantCount}</p>
                    <p className="text-xs text-muted">Applicants</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{opp.requiredSkillsCount}</p>
                    <p className="text-xs text-muted">Skills Required</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted">
                      {new Date(opp.postedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted">Posted</p>
                  </div>
                </div>

                {opp.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span>⏰</span>
                    <span>
                      Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
