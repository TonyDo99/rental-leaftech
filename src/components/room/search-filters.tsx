'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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
    <div className="bg-background py-4">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:items-end md:space-x-6">
        {/* Location Filter */}
        <div className="flex-1">
          <Label
            htmlFor="location"
            className="text-sm font-medium text-muted-foreground mb-2 block"
          >
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={cn(
                'pl-9 h-10 bg-background',
                'border-muted-foreground/20 hover:border-muted-foreground/30',
                'focus:border-muted-foreground/40 focus:ring-0'
              )}
            />
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Price Range
          </Label>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="text"
                  value={formatPrice(priceRange[0])}
                  onChange={(e) => handlePriceInput(0, e.target.value)}
                  onFocus={() => setIsEditingPrice(true)}
                  onBlur={() => setIsEditingPrice(false)}
                  className={cn(
                    'pl-7 h-10 bg-background',
                    'border-muted-foreground/20 hover:border-muted-foreground/30',
                    'focus:border-muted-foreground/40 focus:ring-0'
                  )}
                />
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="text"
                  value={formatPrice(priceRange[1])}
                  onChange={(e) => handlePriceInput(1, e.target.value)}
                  onFocus={() => setIsEditingPrice(true)}
                  onBlur={() => setIsEditingPrice(false)}
                  className={cn(
                    'pl-7 h-10 bg-background',
                    'border-muted-foreground/20 hover:border-muted-foreground/30',
                    'focus:border-muted-foreground/40 focus:ring-0'
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

        {/* Property Type Filter */}
        <div className="flex-1">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Property Type
          </Label>
          <Select
            value={propertyType || undefined}
            onValueChange={setPropertyType}
          >
            <SelectTrigger
              className={cn(
                'cursor-pointer w-full h-10 bg-background',
                'border-muted-foreground/20 hover:border-muted-foreground/30',
                'focus:border-muted-foreground/40 focus:ring-0'
              )}
            >
              <SelectValue placeholder="Any type" />
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
        <div className="flex-1">
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Bedrooms
          </Label>
          <Select value={roomSize || undefined} onValueChange={setRoomSize}>
            <SelectTrigger
              className={cn(
                'cursor-pointer w-full h-10 bg-background',
                'border-muted-foreground/20 hover:border-muted-foreground/30',
                'focus:border-muted-foreground/40 focus:ring-0'
              )}
            >
              <SelectValue placeholder="Any size" />
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
      </div>
    </div>
  );
}
