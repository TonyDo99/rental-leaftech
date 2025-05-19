'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Room {
  id: number;
  name: string;
  number: string;
  type: string;
  category: string;
  size: number;
  price: number;
  status: string;
  owner: string;
  images: string[];
}

const roomCategories = [
  'Apartment',
  'Studio',
  'House',
  'Villa',
  'Condo',
  'Townhouse',
];

// Mock data - replace with actual data from your backend
const mockRooms: Room[] = [
  {
    id: 1,
    name: 'Luxury Studio',
    number: '101',
    type: 'Single',
    category: 'Studio',
    size: 45,
    price: 500,
    status: 'Available',
    owner: 'John Smith',
    images: ['/room1.jpg', '/room2.jpg'],
  },
  {
    id: 2,
    name: 'Family Apartment',
    number: '102',
    type: 'Double',
    category: 'Apartment',
    size: 85,
    price: 800,
    status: 'Occupied',
    owner: 'Jane Doe',
    images: ['/room3.jpg', '/room4.jpg'],
  },
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      // Create preview URLs
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // Add room logic here
    setIsAddDialogOpen(false);
    setSelectedImages([]);
    setPreviewUrls([]);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // Edit room logic here
    setIsEditDialogOpen(false);
  };

  const handleDeleteRoom = (id: number) => {
    // Delete room logic here
    setRooms(rooms.filter((room) => room.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">Manage your rental rooms</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Room Number</Label>
                  <Input id="number" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Room Size (m²)</Label>
                  <Input id="size" type="number" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Input id="type" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input id="owner" required />
              </div>

              <div className="space-y-2">
                <Label>Room Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <label
                    htmlFor="images"
                    className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                  >
                    <Upload className="mb-2 h-8 w-8 text-gray-500" />
                    <span className="text-sm text-gray-500">Upload images</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Add Room
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.number}</TableCell>
                <TableCell>{room.category}</TableCell>
                <TableCell>{room.size}m²</TableCell>
                <TableCell>${room.price}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>{room.owner}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <form onSubmit={handleEditRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Room Name</Label>
                  <Input
                    id="edit-name"
                    defaultValue={selectedRoom.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-number">Room Number</Label>
                  <Input
                    id="edit-number"
                    defaultValue={selectedRoom.number}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select defaultValue={selectedRoom.category} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size">Room Size (m²)</Label>
                  <Input
                    id="edit-size"
                    type="number"
                    defaultValue={selectedRoom.size}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Room Type</Label>
                  <Input
                    id="edit-type"
                    defaultValue={selectedRoom.type}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    defaultValue={selectedRoom.price}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input
                  id="edit-owner"
                  defaultValue={selectedRoom.owner}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Room Images</Label>
                <div className="grid grid-cols-4 gap-4">
                  {selectedRoom.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Room ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
