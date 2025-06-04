'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Calendar, Check, Leaf } from 'lucide-react';
import {
  EServiceType,
  EServiceFrequency,
  ServiceSchedule,
  // CreateServiceScheduleInput,
} from './types';
import { serviceService } from '@/services/schedule.service';
import { ServiceCalendar } from '@/components/ui/service-calendar';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const serviceScheduleSchema = z.object({
  type: z.nativeEnum(EServiceType),
  frequency: z.nativeEnum(EServiceFrequency),
  roomId: z.number(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type ServiceScheduleFormData = z.infer<typeof serviceScheduleSchema>;

export default function ServicesPage() {
  const [serviceSchedules, setServiceSchedules] = useState<ServiceSchedule[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');

  const form = useForm<ServiceScheduleFormData>({
    resolver: zodResolver(serviceScheduleSchema),
    defaultValues: {
      type: EServiceType.CLEANING,
      frequency: EServiceFrequency.MONTHLY,
      roomId: 0,
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const schedules = await serviceService.getServiceSchedules();
      setServiceSchedules(schedules);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load service schedules');
    }
  };

  const handleSubmit = async (values: ServiceScheduleFormData) => {
    setIsSubmitting(true);
    try {
      const newSchedule = await serviceService.createServiceSchedule({
        ...values,
        roomName: `Room ${values.roomId}`, // This should be replaced with actual room name from your room service
        lastPerformed: new Date(),
        nextDue: new Date(), // This will be calculated by the backend
        isActive: values.isActive ?? true, // Ensure isActive is always a boolean
      });
      setServiceSchedules([...serviceSchedules, newSchedule]);
      toast.success('Service schedule created successfully!');
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create service schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsCompleted = async (id: number) => {
    try {
      const updatedSchedule = await serviceService.markServiceAsCompleted(id);
      setServiceSchedules((schedules) =>
        schedules.map((schedule) =>
          schedule.id === id ? updatedSchedule : schedule
        )
      );
      toast.success('Service marked as completed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark service as completed');
    }
  };

  const getFrequencyLabel = (frequency: EServiceFrequency) => {
    switch (frequency) {
      case EServiceFrequency.MONTHLY:
        return 'Monthly';
      case EServiceFrequency.QUARTERLY:
        return 'Every 3 months';
      case EServiceFrequency.BIANNUALLY:
        return 'Every 6 months';
      case EServiceFrequency.ANNUALLY:
        return 'Annually';
      default:
        return frequency;
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Service Schedules
            </h1>
          </div>
          <p className="text-gray-500">
            Manage recurring services for your properties
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Service Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add New Service Schedule
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700">
                    Service Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue('type', value as EServiceType)
                    }
                    defaultValue={form.getValues('type')}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EServiceType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-gray-700">
                    Frequency
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue('frequency', value as EServiceFrequency)
                    }
                    defaultValue={form.getValues('frequency')}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EServiceFrequency).map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {getFrequencyLabel(frequency)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomId" className="text-gray-700">
                    Room ID
                  </Label>
                  <Input
                    id="roomId"
                    type="number"
                    {...form.register('roomId', { valueAsNumber: true })}
                    placeholder="Enter room ID"
                    className="border-gray-200"
                  />
                  {form.formState.errors.roomId && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.roomId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Description
                  </Label>
                  <Input
                    id="description"
                    {...form.register('description')}
                    placeholder="Enter service description"
                    className="border-gray-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Service Schedule'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Service Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-gray-50">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600"
              >
                List View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-0">
              <ServiceCalendar
                services={serviceSchedules}
                onEventClick={(service) => {
                  console.log('Service clicked:', service);
                }}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="rounded-lg border border-gray-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700">
                        Service Type
                      </TableHead>
                      <TableHead className="text-gray-700">Room</TableHead>
                      <TableHead className="text-gray-700">Frequency</TableHead>
                      <TableHead className="text-gray-700">Next Due</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-right text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium text-gray-900">
                          {schedule.type}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {schedule.roomName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {getFrequencyLabel(schedule.frequency)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(schedule.nextDue).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              schedule.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {schedule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsCompleted(schedule.id)}
                            className="text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
