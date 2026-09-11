'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...', { email: formData.email });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('Login error:', data);
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data.user);

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        STUDENT: '/student',
        INDUSTRY: '/industry',
        ACADEMICIAN: '/academician',
        INSTITUTION_ADMIN: '/student',
      };
      
      const targetRoute = roleRoutes[data.user.role] || '/';
      console.log('Redirecting to:', targetRoute);
      
      // Force a hard redirect to ensure middleware picks up the cookie
      window.location.href = targetRoute;
    } catch (err) {
      console.error('Login exception:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading text-3xl font-bold text-primary">
              Academia<span className="text-accent">Bridge</span>
            </span>
          </Link>
          <h1 className="font-heading text-section text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-muted">Sign in to access your account</p>
        </div>
        
        <div className="bg-surface border-2 border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-warning/10 border-2 border-warning text-warning px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-4 border-t-2 border-border">
              <p className="text-muted text-sm">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-accent hover:text-accent/80 font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
