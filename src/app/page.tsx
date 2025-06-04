'use client';

import { useEffect, useState } from 'react';
import { SearchFilters } from '@/components/room/search-filters';
import { RoomGrid } from '@/components/room/room-grid';
import { roomService } from '@/services/room.service';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRooms = async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    location: '',
    priceRange: [0, 10000],
    propertyType: null,
    roomSize: null,
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Find Your Dream Home</h1>
            <p className="text-xl mb-8">
              Discover the perfect property that matches your lifestyle
            </p>

            <div className="bg-white rounded-lg p-6 shadow-xl">
              <SearchFilters onFiltersChange={setFilters} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600">
              Discover our handpicked selection of premium properties
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No properties found matching your criteria
              </p>
            </div>
          ) : (
            <RoomGrid filters={filters} rooms={rooms} />
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600">
              We provide comprehensive real estate services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Property Management',
                description:
                  'Professional property management services for landlords',
                icon: '🏠',
              },
              {
                title: 'Rental Services',
                description:
                  'Find your perfect rental property with our expert guidance',
                icon: '🔑',
              },
              {
                title: 'Consultation',
                description: 'Get expert advice on real estate investments',
                icon: '💡',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600">
              Read testimonials from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'John Doe',
                role: 'Property Owner',
                content:
                  'Excellent service! They helped me find the perfect tenant for my property.',
                image: '/images/testimonial-1.jpg',
              },
              {
                name: 'Jane Smith',
                role: 'Tenant',
                content:
                  'The team made my house hunting experience smooth and stress-free.',
                image: '/images/testimonial-2.jpg',
              },
              {
                name: 'Mike Johnson',
                role: 'Investor',
                content:
                  'Professional and reliable service. Highly recommended!',
                image: '/images/testimonial-3.jpg',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
