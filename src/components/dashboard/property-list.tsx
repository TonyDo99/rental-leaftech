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
const properties = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    address: '123 Main St, New York, NY',
    status: 'occupied',
    rent: 2500,
  },
  {
    id: '2',
    title: 'Cozy Studio Near Park',
    address: '456 Park Ave, New York, NY',
    status: 'vacant',
    rent: 1800,
  },
  {
    id: '3',
    title: 'Luxury 2BR Condo',
    address: '789 5th Ave, New York, NY',
    status: 'occupied',
    rent: 3500,
  },
];

export function PropertyList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>Manage your rental properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {property.address}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    property.status === 'occupied' ? 'default' : 'secondary'
                  }
                >
                  {property.status}
                </Badge>
                <p className="font-semibold">${property.rent}/mo</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
