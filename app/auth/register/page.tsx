'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleSelector } from '@/components/ui/RoleSelector';

type Role = 'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT' as Role,
    institutionName: '',
    course: '',
    yearOfStudy: '',
    bio: '',
    companyName: '',
    industryType: '',
    website: '',
    description: '',
    department: '',
    designation: '',
  });

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam && ['STUDENT', 'INDUSTRY', 'ACADEMICIAN'].includes(roleParam)) {
      setFormData(prev => ({ ...prev, role: roleParam as Role }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let roleSpecificData = {};
      
      if (formData.role === 'STUDENT') {
        roleSpecificData = {
          institutionName: formData.institutionName,
          course: formData.course,
          yearOfStudy: formData.yearOfStudy,
          bio: formData.bio,
        };
      } else if (formData.role === 'INDUSTRY') {
        roleSpecificData = {
          companyName: formData.companyName,
          industryType: formData.industryType,
          website: formData.website,
          description: formData.description,
        };
      } else if (formData.role === 'ACADEMICIAN') {
        roleSpecificData = {
          institutionName: formData.institutionName,
          department: formData.department,
          designation: formData.designation,
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          ...roleSpecificData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const roleRoutes: Record<Role, string> = {
        STUDENT: '/student',
        INDUSTRY: '/industry',
        ACADEMICIAN: '/academician',
      };
      
      window.location.href = roleRoutes[formData.role];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { 
      value: 'STUDENT', 
      label: 'Student', 
      description: 'Build skills, apply to opportunities'
    },
    { 
      value: 'INDUSTRY', 
      label: 'Industry Partner', 
      description: 'Post opportunities, hire talent'
    },
    { 
      value: 'ACADEMICIAN', 
      label: 'Academic Mentor', 
      description: 'Guide students, facilitate connections'
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-heading text-3xl font-bold text-primary">
              Academia<span className="text-accent">Bridge</span>
            </span>
          </Link>
          <h1 className="font-heading text-section text-primary mb-2">
            Create Your Account
          </h1>
          <p className="text-muted">Join the academia-industry collaboration platform</p>
        </div>
        
        <div className="bg-surface border-2 border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-warning/10 border-2 border-warning text-warning px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />

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
              placeholder="Create a strong password"
            />

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-3">
                I am a:
              </label>
              <RoleSelector
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value as Role })}
                options={roleOptions}
              />
            </div>

            {formData.role === 'STUDENT' && (
              <div className="space-y-4 pt-4 border-t-2 border-border">
                <Input
                  label="Institution Name"
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="MIT, Stanford, etc."
                />

                <Input
                  label="Course/Program"
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="Computer Science, Engineering, etc."
                />

                <Input
                  label="Year of Study"
                  type="number"
                  required
                  min="1"
                  max="10"
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  placeholder="1, 2, 3, etc."
                />
              </div>
            )}

            {formData.role === 'INDUSTRY' && (
              <div className="space-y-4 pt-4 border-t-2 border-border">
                <Input
                  label="Company Name"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Your Company Inc."
                />

                <Input
                  label="Industry Type"
                  type="text"
                  required
                  value={formData.industryType}
                  onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                  placeholder="Technology, Manufacturing, etc."
                />

                <Input
                  label="Website (Optional)"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </div>
            )}

            {formData.role === 'ACADEMICIAN' && (
              <div className="space-y-4 pt-4 border-t-2 border-border">
                <Input
                  label="Institution Name"
                  type="text"
                  required
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  placeholder="University/College Name"
                />

                <Input
                  label="Department"
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science, Physics, etc."
                />

                <Input
                  label="Designation"
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Professor, Assistant Professor, etc."
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <div className="text-center pt-4 border-t-2 border-border">
              <p className="text-muted text-sm">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
