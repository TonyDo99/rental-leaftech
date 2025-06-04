'use client';

import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FilterState {
  location: string;
  priceRange: [number, number];
  propertyType: string | null;
  roomSize: string | null;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([500, 2500]);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [roomSize, setRoomSize] = useState<string | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceInput = (index: number, value: string) => {
    const numericValue = parseInt(value.replace(/,/g, ''), 10);
    if (!isNaN(numericValue)) {
      const newPriceRange = [...priceRange];
      newPriceRange[index] = Math.min(Math.max(numericValue, 0), 10000);

      if (index === 0 && numericValue > priceRange[1]) {
        newPriceRange[0] = priceRange[1];
      } else if (index === 1 && numericValue < priceRange[0]) {
        newPriceRange[1] = priceRange[0];
      }

      setPriceRange(newPriceRange as [number, number]);
    }
  };

  useEffect(() => {
    onFiltersChange({
      location,
      priceRange: [priceRange[0], priceRange[1]],
      propertyType,
      roomSize,
    });
  }, [location, priceRange, propertyType, roomSize, onFiltersChange]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={cn(
              'pl-10 h-12 bg-white',
              'border-gray-200 hover:border-gray-300',
              'focus:border-primary focus:ring-0',
              'text-gray-700 placeholder:text-gray-400'
            )}
          />
        </div>

        {/* Property Type Filter */}
        <div>
          <Select
            value={propertyType || undefined}
            onValueChange={setPropertyType}
          >
            <SelectTrigger
              className={cn(
                'h-12 bg-white',
                'border-gray-200 hover:border-gray-300',
                'focus:border-primary focus:ring-0',
                'text-gray-700'
              )}
            >
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Size Filter */}
        <div>
          <Select value={roomSize || undefined} onValueChange={setRoomSize}>
            <SelectTrigger
              className={cn(
                'h-12 bg-white',
                'border-gray-200 hover:border-gray-300',
                'focus:border-primary focus:ring-0',
                'text-gray-700'
              )}
            >
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          className="h-12 bg-primary hover:bg-primary/90 text-white"
          onClick={() =>
            onFiltersChange({
              location,
              priceRange: [priceRange[0], priceRange[1]],
              propertyType,
              roomSize,
            })
          }
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>

      {/* Price Range Filter */}
      <div className="mt-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Price Range
        </Label>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <Input
                type="text"
                value={formatPrice(priceRange[0])}
                onChange={(e) => handlePriceInput(0, e.target.value)}
                onFocus={() => setIsEditingPrice(true)}
                onBlur={() => setIsEditingPrice(false)}
                className={cn(
                  'pl-7 h-12 bg-white',
                  'border-gray-200 hover:border-gray-300',
                  'focus:border-primary focus:ring-0',
                  'text-gray-700'
                )}
              />
            </div>
            <span className="text-gray-500">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                $
              </span>
              <Input
                type="text"
                value={formatPrice(priceRange[1])}
                onChange={(e) => handlePriceInput(1, e.target.value)}
                onFocus={() => setIsEditingPrice(true)}
                onBlur={() => setIsEditingPrice(false)}
                className={cn(
                  'pl-7 h-12 bg-white',
                  'border-gray-200 hover:border-gray-300',
                  'focus:border-primary focus:ring-0',
                  'text-gray-700'
                )}
              />
            </div>
          </div>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              if (!isEditingPrice) {
                setPriceRange(value as [number, number]);
              }
            }}
            max={10000}
            min={0}
            step={100}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
