'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    <Link href={`/rooms/${id}`}>
      <Card className="group overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={images[0] || '/placeholder.jpg'}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <p className="font-semibold">${price}/mo</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 flex-wrap">
            {amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
