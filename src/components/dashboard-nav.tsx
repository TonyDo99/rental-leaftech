import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

const routes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    color: 'text-emerald-500',
  },
  {
    label: 'Rooms',
    icon: Building2,
    href: '/dashboard/rooms',
    color: 'text-emerald-500',
  },
  {
    label: 'Services',
    icon: Calendar,
    href: '/dashboard/services',
    color: 'text-emerald-500',
  },
  {
    label: 'Tenants',
    icon: Users,
    href: '/dashboard/tenants',
    color: 'text-emerald-500',
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
    color: 'text-emerald-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-emerald-500',
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative flex h-full flex-col space-y-4 bg-white py-4">
      <div className="flex items-center justify-between px-3">
        <div
          className={cn('flex items-center space-x-2', isCollapsed && 'hidden')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Leaves</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      <div className="space-y-1 px-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100',
              pathname === route.href
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-600',
              isCollapsed && 'justify-center'
            )}
          >
            <route.icon
              className={cn(
                'mr-3 h-5 w-5',
                pathname === route.href ? route.color : 'text-gray-400',
                isCollapsed && 'mr-0'
              )}
            />
            {!isCollapsed && <span>{route.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
