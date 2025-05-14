'use client';

import { useState } from 'react';
import { RoomCard } from './room-card';
import { Pagination } from '@/components/ui/pagination';

interface Room {
  id: string;
  title: string;
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

// This would typically come from your API/database
const mockRooms: Room[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Modern Studio ${i + 1}`,
  price: 1500 + i * 100,
  location: 'San Francisco, CA',
  images: [
    'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg',
  ],
  amenities: ['WiFi', 'TV', 'Parking', 'Kitchen'],
  roomSize: ['studio', '1', '2', '3', '4+'][Math.floor(Math.random() * 5)],
  propertyType: ['apartment', 'house', 'condo', 'studio'][
    Math.floor(Math.random() * 4)
  ],
}));

const ITEMS_PER_PAGE = 12;

interface RoomGridProps {
  filters: FilterState;
}

export function RoomGrid({ filters }: RoomGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters to rooms
  const filteredRooms = mockRooms.filter((room) => {
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
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentRooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            title={room.title}
            price={room.price}
            location={room.location}
            images={room.images}
            amenities={room.amenities}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
