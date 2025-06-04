import { useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import {
  UseFormRegister,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';

interface GooglePlace {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  formatted_address: string;
}

interface GoogleAutocomplete {
  getPlace: () => GooglePlace;
  addListener: (event: string, callback: () => void) => void;
}

interface Location {
  address: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: {
              types: string[];
              componentRestrictions: { country: string };
            }
          ) => GoogleAutocomplete;
        };
      };
    };
  }
}

interface LocationInputProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  defaultValue?: string;
  required?: boolean;
  error?: string;
}

export function LocationInput<T extends FieldValues>({
  label,
  name,
  register,
  setValue,
  defaultValue,
  required,
  error,
}: LocationInputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Google Places API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeAutocomplete;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeAutocomplete = () => {
    if (inputRef.current && window.google) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'VN' }, // Restrict to Vietnam
        }
      );

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry) {
          const location: Location = {
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setValue(name, JSON.stringify(location) as PathValue<T, Path<T>>);
        }
      });
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        ref={(e) => {
          register(name).ref(e);
          inputRef.current = e;
        }}
        defaultValue={defaultValue}
        required={required}
        placeholder="Enter location"
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
