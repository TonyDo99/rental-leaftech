'use client';

import { useState } from 'react';
import { RoomCard } from './room-card';
import { Pagination } from '@/components/ui/pagination';

interface Room {
  id: string;
  name: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  roomSize?: string;
  propertyType?: string;
}

interface FilterState {
  location: string;
  priceRange: [number, number];
  propertyType: string | null;
  roomSize: string | null;
}

const ITEMS_PER_PAGE = 9;

interface RoomGridProps {
  filters: FilterState;
  rooms: Room[];
}

export function RoomGrid({ filters, rooms }: RoomGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters to rooms
  const filteredRooms = rooms.filter((room) => {
    // Filter by price range
    if (
      room.price < filters.priceRange[0] ||
      room.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Filter by room size
    if (filters.roomSize && room.roomSize !== filters.roomSize) {
      return false;
    }

    // Filter by property type
    if (filters.propertyType && room.propertyType !== filters.propertyType) {
      return false;
    }

    // Filter by location (case-insensitive partial match)
    if (
      filters.location &&
      !room.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentRooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            title={room.name}
            price={room.price}
            location={room.location}
            images={room.images}
            amenities={room.amenities}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {currentRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No properties found matching your criteria. Try adjusting your
            filters.
          </p>
        </div>
      )}
    </div>
  );
}
