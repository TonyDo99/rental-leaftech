'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Category, EAmenities, EStatus, Room, RoomFormData } from './types';
import RoomDialog from './dialog';
import { roomService } from '@/services/room.service';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

// Mock data - replace with actual data from your backend
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Apartment',
    description: 'Self-contained residential unit',
  },
  {
    id: 2,
    name: 'Studio',
    description: 'Single room with combined living and sleeping space',
  },
  {
    id: 3,
    name: 'House',
    description: 'Standalone residential building',
  },
  {
    id: 4,
    name: 'Villa',
    description: 'Luxury standalone residence',
  },
  {
    id: 5,
    name: 'Condo',
    description: 'Private unit in a shared building',
  },
  {
    id: 6,
    name: 'Townhouse',
    description: 'Multi-floor home sharing walls with neighbors',
  },
];

const formAddRoomSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  amenities: z.array(z.nativeEnum(EAmenities)),
  price: z.number().min(0, {
    message: 'Price must be at least 0',
  }),
  // location: z.string().refine((val) => {
  //   try {
  //     const location = JSON.parse(val);
  //     return location.address && location.lat && location.lng;
  //   } catch {
  //     return false;
  //   }
  // }, 'Please select a valid location'),
  location: z.string(),
  images: z.array(z.string()),
  bed: z.number().min(1, {
    message: 'Bed count must be at least 1',
  }),
  status: z.nativeEnum(EStatus),
});

// Utility to map string[] to EAmenities[] safely
function mapToEAmenities(arr: string[]): EAmenities[] {
  return arr.filter((a): a is EAmenities =>
    Object.values(EAmenities).includes(a as EAmenities)
  );
}

async function uploadRoomImages(
  files: File[],
  roomId: string
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const filePath = `rooms/${roomId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('rooms')
      .upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('rooms').getPublicUrl(filePath);
    urls.push(data.publicUrl);
  }
  return urls;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories] = useState<Category[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(formAddRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      amenities: [],
      price: 0,
      location: '',
      images: [],
      bed: 1,
      status: EStatus.AVAILABLE,
    },
  });

  const fetchRooms = async () => {
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
    fetchRooms();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: RoomFormData) => {
    setIsSubmitting(true);
    try {
      let imageUrls = values.images;
      if (selectedImages.length > 0) {
        // Upload new images to Supabase
        imageUrls = await uploadRoomImages(
          selectedImages,
          selectedRoom?.id || 'new'
        );
      }
      // Save room with imageUrls
      const payload = {
        ...values,
        images: imageUrls,
        location:
          typeof values.location === 'string'
            ? values.location
            : JSON.stringify(values.location),
      };
      if (selectedRoom) {
        console.log('Updating existing room:', selectedRoom.id);
        const updatedRoom = await roomService.updateRoom(
          selectedRoom.id,
          payload
        );
        setRooms((prev) =>
          prev.map((room) => (room.id === selectedRoom.id ? updatedRoom : room))
        );
        toast.success('Room updated successfully!');
      } else {
        console.log('Creating new room with values:', payload);
        const newRoom = await roomService.createRoom(payload);
        console.log('New room created:', newRoom);
        setRooms((prev) => [...prev, newRoom]);
        toast.success('Room created successfully!');
      }
      setIsDialogOpen(false);
      setPreviewUrls([]);
      setSelectedRoom(null);
      form.reset();
    } catch (error) {
      console.error('Error saving room:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(
        `Failed to ${selectedRoom ? 'update' : 'create'} room: ${errorMessage}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    form.reset({
      name: room.name,
      description: room.description || '',
      price: room.price,
      location: room.location,
      images: room.images,
      bed: room.bed,
      status: room.status as EStatus,
      amenities: mapToEAmenities(room.amenities),
    });
    setPreviewUrls(room.images);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    const toastId = toast.loading('Deleting room...');
    try {
      await roomService.deleteRoom(id);
      setRooms((prev) => prev.filter((room) => room.id !== id));
      toast.success('Room deleted successfully!', { id: toastId });
    } catch (error) {
      console.error('Error deleting room:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(`Failed to delete room: ${errorMessage}`, { id: toastId });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
        <RoomDialog
          form={form}
          previewUrls={previewUrls}
          categories={categories}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSubmit={handleSubmit}
          handleImageChange={handleImageChange}
          removeImage={removeImage}
          isSubmitting={isSubmitting}
          mode={selectedRoom ? 'edit' : 'create'}
          selectedRoom={
            selectedRoom
              ? {
                  name: selectedRoom.name,
                  description: selectedRoom.description || '',
                  price: selectedRoom.price,
                  location: selectedRoom.location,
                  images: selectedRoom.images,
                  bed: selectedRoom.bed,
                  status: selectedRoom.status as EStatus,
                  amenities: mapToEAmenities(selectedRoom.amenities),
                }
              : null
          }
        />
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Room Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <p className="text-lg text-muted-foreground">No rooms found</p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Description</TableHead>
                    <TableHead className="text-gray-700">Amenities</TableHead>
                    <TableHead className="text-gray-700">Price</TableHead>
                    <TableHead className="text-gray-700">Location</TableHead>
                    <TableHead className="text-gray-700">Beds</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-right text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium text-gray-900">
                        {room.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {room.description}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {room.amenities.join(', ')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        ${room.price}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {room.location}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {room.bed}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            room.status === EStatus.AVAILABLE
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {room.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(room)}
                          className="text-emerald-600 hover:bg-emerald-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
