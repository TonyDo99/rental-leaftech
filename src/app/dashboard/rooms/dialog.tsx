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
import { Plus, X } from 'lucide-react';
import { Category, EAmenities, EStatus, RoomFormData } from './types';
import { UseFormReturn } from 'react-hook-form';
// import { LocationInput } from '@/components/ui/location-input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

interface RoomDialogProps {
  form: UseFormReturn<RoomFormData>;
  previewUrls: string[];
  categories: Category[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: RoomFormData) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  selectedRoom: RoomFormData | null;
}

function RoomDialog({
  form,
  previewUrls,
  // categories,
  isOpen,
  setIsOpen,
  onSubmit,
  handleImageChange,
  removeImage,
  isSubmitting,
  mode,
}: // selectedRoom,
RoomDialogProps) {
  const isEdit = mode === 'edit';
  // const title = isEdit ? "Edit Room" : "Add New Room";
  const buttonText = isEdit ? 'Save Changes' : 'Add Room';
  const loadingText = isEdit ? 'Saving...' : 'Creating...';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Add New Room' : 'Edit Room'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Room Name
              </Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Enter room name"
                className="border-gray-200"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                {...form.register('price', { valueAsNumber: true })}
                placeholder="Enter price"
                className="border-gray-200"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.price.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Enter room description"
              className="border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bed" className="text-gray-700">
                Number of Beds
              </Label>
              <Input
                id="bed"
                type="number"
                {...form.register('bed', { valueAsNumber: true })}
                placeholder="Enter number of beds"
                className="border-gray-200"
              />
              {form.formState.errors.bed && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bed.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                Status
              </Label>
              <Select
                onValueChange={(value) =>
                  form.setValue('status', value as EStatus)
                }
                defaultValue={form.getValues('status')}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(EAmenities).map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={form.watch('amenities')?.includes(amenity)}
                    onCheckedChange={(checked: boolean) => {
                      const amenities = form.getValues('amenities') || [];
                      if (checked) {
                        form.setValue('amenities', [...amenities, amenity]);
                      } else {
                        form.setValue(
                          'amenities',
                          amenities.filter((a) => a !== amenity)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={amenity}
                    className="text-sm font-medium text-gray-700"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label className="text-gray-700">Location</Label>
            <LocationInput
              name="location"
              register={form.register}
              setValue={form.setValue}
              defaultValue={form.getValues('location')}
              required
              error={form.formState.errors.location?.message as string}
            />
          </div> */}

          <div className="space-y-2">
            <Label className="text-gray-700">Room Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 rounded-lg object-cover"
                    width={40}
                    height={40}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Plus className="h-8 w-8 text-gray-400" />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? loadingText : buttonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoomDialog;
