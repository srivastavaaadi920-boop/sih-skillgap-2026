'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hasOnboarding, setHasOnboarding] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndProfile();
  }, []);

  const fetchUserAndProfile = async () => {
    try {
      // Fetch user data
      const userResponse = await fetch('/api/auth/me');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }

      // Check onboarding status
      const onboardingResponse = await fetch('/api/student/onboarding/status');
      if (onboardingResponse.ok) {
        const onboardingData = await onboardingResponse.json();
        setHasOnboarding(onboardingData.completed);
      }

      // Check if skill profile exists
      const profileResponse = await fetch('/api/student/profile/skills');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setHasProfile(profileData.hasProfile);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-heading text-2xl font-bold text-primary">Student Dashboard</h1>
          <Button onClick={handleLogout} variant="ghost">
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="font-heading text-section text-primary mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-muted">Manage your skills and explore opportunities</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Setup / Onboarding Card */}
          <Card>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-card-title text-primary-dark mb-2">
                  {hasOnboarding ? 'Profile Setup Complete' : 'Complete Your Profile'}
                </h3>
                <p className="text-muted text-sm mb-4">
                  {hasOnboarding
                    ? 'Your career goals and skills have been set up. View or edit your profile anytime.'
                    : 'Set up your field of interest, career goals, and skills to get started'}
                </p>
              </div>
              <Link href={hasOnboarding ? '/student/profile' : '/student/onboarding'}>
                <Button variant="primary" className="w-full">
                  {hasOnboarding ? 'View Profile' : 'Complete Profile Setup'}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Skill Assessment Card (Old - kept for legacy) */}
          {hasOnboarding && !hasProfile && (
            <Card>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-card-title text-primary-dark mb-2">
                    Skill Verification
                  </h3>
                  <p className="text-muted text-sm mb-4">
                    Take skill tests to verify your abilities and earn verified badges
                  </p>
                </div>
                <Button variant="secondary" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>
            </Card>
          )}

          {/* Opportunities Card */}
          <Card>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-card-title text-primary-dark mb-2">
                  Opportunities
                </h3>
                <p className="text-muted text-sm mb-4">
                  {hasOnboarding
                    ? 'Browse and apply to matched opportunities based on your skills'
                    : 'Complete profile setup first to unlock personalized opportunities'}
                </p>
              </div>
              <Link href="/student/opportunities">
                <Button variant={hasOnboarding ? "primary" : "secondary"} className="w-full" disabled={!hasOnboarding}>
                  {hasOnboarding ? 'Browse Opportunities' : 'Complete Profile Setup First'}
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {hasOnboarding && (
          <div className="mt-8">
            <Link href="/student/onboarding">
              <Button variant="ghost">
                Update Profile Setup →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

