export interface Room {
  id: string;
  name: string;
  description?: string;
  amenities: string[];
  price: number;
  location: string;
  images: string[];
  bed: number;
  status: EStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export enum EStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum EAmenities {
  WIFI = 'WiFi',
  TV = 'TV',
  PARKING = 'Parking',
  KITCHEN = 'Kitchen',
  POOL = 'Pool',
  GYM = 'Gym',
}
