'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">RentalPlatform</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant={pathname === '/' ? 'default' : 'ghost'}
                className="text-sm font-medium transition-colors"
              >
                Browse
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant={pathname === '/dashboard' ? 'default' : 'ghost'}
                className="text-sm font-medium transition-colors"
              >
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" className="text-sm font-medium">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
