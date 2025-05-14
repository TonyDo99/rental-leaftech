'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Mock data - replace with real data from your backend
const occupancyData = {
  totalUnits: 10,
  occupied: 7,
  vacant: 3,
  upcomingMoveOuts: 1,
};

export function OccupancyStatus() {
  const occupancyRate = Math.round(
    (occupancyData.occupied / occupancyData.totalUnits) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Status</CardTitle>
        <CardDescription>Current occupancy overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-40">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="stroke-muted"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="10"
                />
                <circle
                  className="stroke-primary"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="10"
                  strokeDasharray={`${occupancyRate * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="0.3em"
                  className="fill-foreground text-2xl font-bold"
                >
                  {occupancyRate}%
                </text>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Occupied Units</p>
              <p className="text-2xl font-bold">{occupancyData.occupied}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium">Vacant Units</p>
              <p className="text-2xl font-bold">{occupancyData.vacant}</p>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-sm font-medium">Upcoming Move-outs</p>
            <p className="text-2xl font-bold">
              {occupancyData.upcomingMoveOuts}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
