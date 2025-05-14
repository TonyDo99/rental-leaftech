import { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RoomMap } from '@/components/room/room-map';

export const metadata: Metadata = {
  title: 'Room Details',
  description: 'View detailed information about this rental property',
};

// This would typically come from your database
const mockRoom = {
  id: '1',
  title: 'Modern Studio in Downtown',
  description:
    'A beautiful and spacious studio apartment located in the heart of downtown. Perfect for professionals or couples looking for a central location with all amenities nearby.',
  price: 2500,
  location: '123 Main St, San Francisco, CA',
  coordinates: { lat: 37.7749, lng: -122.4194 },
  images: [
    'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg',
    'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg',
    'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg',
  ],
  amenities: ['WiFi', 'TV', 'Parking', 'Kitchen'],
  bedrooms: 1,
  bathrooms: 1,
  size: '600 sqft',
};

export default function RoomDetail() {
  // In a real app, you would fetch the room data here based on the ID
  const room = mockRoom;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src={
              room.images[0] ||
              'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg'
            }
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {room.images.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={
                  image ||
                  'https://naviday.vn/wp-content/uploads/2024/07/1.forest-homestay-cho-2-nguoi-o-da-lat.jpg'
                }
                alt={`${room.title} ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{room.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{room.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <Home className="h-5 w-5 mb-2" />
                <p className="font-semibold">{room.size}</p>
                <p className="text-sm text-muted-foreground">Size</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold">{room.bedrooms}</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold">{room.bathrooms}</p>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </CardContent>
            </Card>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p>{room.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <p className="text-2xl font-bold mb-4">${room.price}/mo</p>
              <Button className="w-full mb-4">Book Now</Button>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <RoomMap location={room.coordinates} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
