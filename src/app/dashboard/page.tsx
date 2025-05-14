'use client';

import { PropertyList } from '@/components/dashboard/property-list';
import { OccupancyStatus } from '@/components/dashboard/occupancy-status';
import { MaintenanceLog } from '@/components/dashboard/maintenance-log';

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-8 text-3xl font-bold">Landlord Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PropertyList />
        <OccupancyStatus />
        <MaintenanceLog />
      </div>
    </main>
  );
}
