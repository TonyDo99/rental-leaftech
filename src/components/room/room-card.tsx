'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface RoomCardProps {
  id?: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
}

export function RoomCard({
  id = '1',
  title,
  price,
  location,
  images,
  amenities,
}: RoomCardProps) {
  return (
    <Link href={`/rooms/${id}`} className="block">
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={images[0] || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-white px-3 py-1">
              ${price}/mo
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                {title}
              </h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">2 Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">2 Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">1200 sqft</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {amenities.slice(0, 3).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  +{amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
