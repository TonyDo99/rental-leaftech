'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with real data from your backend
const maintenanceRequests = [
  {
    id: '1',
    property: 'Modern Downtown Apartment',
    issue: 'Leaking faucet',
    status: 'pending',
    date: '2024-03-15',
  },
  {
    id: '2',
    property: 'Cozy Studio Near Park',
    issue: 'AC not working',
    status: 'in-progress',
    date: '2024-03-14',
  },
  {
    id: '3',
    property: 'Luxury 2BR Condo',
    issue: 'Broken window',
    status: 'completed',
    date: '2024-03-13',
  },
];

const statusColors = {
  pending: 'default',
  'in-progress': 'secondary',
  completed: 'outline',
} as const;

export function MaintenanceLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Log</CardTitle>
        <CardDescription>Recent maintenance requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col space-y-2 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{request.property}</h3>
                <Badge
                  variant={
                    statusColors[request.status as keyof typeof statusColors]
                  }
                >
                  {request.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{request.issue}</p>
              <p className="text-xs text-muted-foreground">
                Reported: {new Date(request.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
