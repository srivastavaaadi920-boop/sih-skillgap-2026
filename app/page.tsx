import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Asymmetric Split */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline + CTA */}
          <div className="animate-fade-in">
            <h1 className="font-heading text-hero text-primary mb-6">
              Bridge Academia and Industry Through Skills
            </h1>
            <p className="text-xl text-muted mb-8 leading-relaxed">
              A platform that connects students, academic institutions, and industry partners through skill-based matching, verified assessments, and real opportunities.
            </p>
            <Link href="/auth/register">
              <Button variant="primary" className="text-lg px-8 py-4">
                Get Started Today
              </Button>
            </Link>
          </div>

          {/* Right: Three-Path Interactive Selector */}
          <div className="space-y-4 animate-slide-up">
            <h3 className="font-heading text-2xl text-primary mb-6">Choose Your Path</h3>
            
            <Link href="/auth/register?role=student">
              <Card interactive className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-title text-primary-dark mb-2">Students</h4>
                    <p className="text-muted">Assess skills, build portfolios, apply to opportunities</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/auth/register?role=industry">
              <Card interactive className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-title text-primary-dark mb-2">Industry</h4>
                    <p className="text-muted">Post opportunities, find skill-matched candidates</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/auth/register?role=academician">
              <Card interactive className="group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
                    <svg className="w-6 h-6 text-accent group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-title text-primary-dark mb-2">Academicians</h4>
                    <p className="text-muted">Guide students, facilitate industry connections</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Horizontal Flow */}
      <section className="bg-surface py-20 border-y-2 border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-heading text-section text-primary text-center mb-4">How It Works</h2>
          <p className="text-center text-muted mb-16 max-w-2xl mx-auto">
            A streamlined process connecting skills with opportunities
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-light text-accent font-heading text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-card-title text-primary-dark mb-2">Assess Skills</h3>
              <p className="text-muted text-small">Students complete skill assessments to build verified profiles</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-light text-accent font-heading text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-card-title text-primary-dark mb-2">Match Opportunities</h3>
              <p className="text-muted text-small">Industry posts opportunities with required skill criteria</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-light text-accent font-heading text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-card-title text-primary-dark mb-2">Apply & Connect</h3>
              <p className="text-muted text-small">Students apply to matched opportunities seamlessly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-light text-accent font-heading text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-card-title text-primary-dark mb-2">Build Portfolio</h3>
              <p className="text-muted text-small">Track achievements and verified experiences over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted">Smart India Hackathon 2026 - Problem Statement: SIH26044</p>
          <p className="text-sm text-muted mt-2">Academia-Industry Collaboration Portal</p>
        </div>
      </footer>
    </div>
  );
}

