import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <nav className="bg-surface border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="font-heading text-2xl font-bold text-primary">
              Academia<span className="text-accent">Bridge</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-primary-dark hover:text-accent transition-colors">
              Log in
            </Link>
            <Link href="/auth/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
