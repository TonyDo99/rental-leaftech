'use client';

import { useState } from 'react';
import { SearchFilters } from '@/components/room/search-filters';
import { RoomGrid } from '@/components/room/room-grid';

interface FilterState {
  location: string;
  priceRange: [number, number];
  propertyType: string | null;
  roomSize: string | null;
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    priceRange: [0, 10000],
    propertyType: null,
    roomSize: null,
  });

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto">
          <SearchFilters onFiltersChange={setFilters} />
        </div>
      </div>

      <div className="container mx-auto py-8">
        <RoomGrid filters={filters} />
      </div>
    </main>
  );
}
