'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SkillAssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new onboarding system
    router.replace('/student/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted">Redirecting to onboarding...</p>
    </div>
  );
}
