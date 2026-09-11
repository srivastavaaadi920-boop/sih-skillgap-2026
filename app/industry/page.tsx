'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
  totalOpportunities: number;
  totalApplicants: number;
  openOpportunities: number;
  closedOpportunities: number;
}

export default function IndustryDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOpportunities: 0,
    totalApplicants: 0,
    openOpportunities: 0,
    closedOpportunities: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/industry/opportunities');
      if (res.ok) {
        const data = await res.json();
        const opportunities = data.opportunities || [];

        const totalApplicants = opportunities.reduce(
          (sum: number, opp: any) => sum + opp.applicantCount,
          0
        );
        const openCount = opportunities.filter((opp: any) => opp.status === 'OPEN').length;
        const closedCount = opportunities.filter((opp: any) => opp.status === 'CLOSED').length;

        setStats({
          totalOpportunities: opportunities.length,
          totalApplicants,
          openOpportunities: openCount,
          closedOpportunities: closedCount,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-surface border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-primary">Industry Dashboard</h1>
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <p className="text-4xl font-bold text-accent mb-2">{stats.totalOpportunities}</p>
            <p className="text-sm text-muted">Total Opportunities</p>
          </Card>

          <Card className="text-center">
            <p className="text-4xl font-bold text-primary mb-2">{stats.totalApplicants}</p>
            <p className="text-sm text-muted">Total Applicants</p>
          </Card>

          <Card className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">{stats.openOpportunities}</p>
            <p className="text-sm text-muted">Open Opportunities</p>
          </Card>

          <Card className="text-center">
            <p className="text-4xl font-bold text-muted mb-2">{stats.closedOpportunities}</p>
            <p className="text-sm text-muted">Closed Opportunities</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <h2 className="font-heading text-section text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/industry/opportunities/new')}
              className="p-6 text-left border-2 border-border hover:border-accent rounded-lg transition-all"
            >
              <div className="text-3xl mb-3">📝</div>
              <p className="font-semibold text-primary-dark mb-1">Post New Opportunity</p>
              <p className="text-sm text-muted">Create internship, job, or training posting</p>
            </button>

            <button
              onClick={() => router.push('/industry/opportunities')}
              className="p-6 text-left border-2 border-border hover:border-accent rounded-lg transition-all"
            >
              <div className="text-3xl mb-3">📋</div>
              <p className="font-semibold text-primary-dark mb-1">Manage Opportunities</p>
              <p className="text-sm text-muted">View and edit your postings</p>
            </button>

            <button
              onClick={() => router.push('/industry/opportunities')}
              className="p-6 text-left border-2 border-border hover:border-accent rounded-lg transition-all"
            >
              <div className="text-3xl mb-3">👥</div>
              <p className="font-semibold text-primary-dark mb-1">View Applicants</p>
              <p className="text-sm text-muted">Review skill-matched candidates</p>
            </button>
          </div>
        </Card>

        {/* Getting Started */}
        {stats.totalOpportunities === 0 && (
          <Card className="bg-accent-light border-2 border-accent">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚀</div>
              <div>
                <h3 className="font-heading text-lg font-bold text-primary-dark mb-2">
                  Welcome to Academia Bridge!
                </h3>
                <p className="text-sm text-muted mb-4">
                  Start by posting your first opportunity. Our platform will automatically match you
                  with qualified candidates based on their verified skill profiles.
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/industry/opportunities/new')}
                >
                  Post Your First Opportunity
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
