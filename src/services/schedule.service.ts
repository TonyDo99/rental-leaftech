import axios from 'axios';
import {
  ServiceConfig,
  ServiceSchedule,
  CreateServiceConfigInput,
} from '@/app/dashboard/services/types';
import { api } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const serviceService = {
  // Service Configurations
  getServiceConfigs: async (): Promise<ServiceConfig[]> => {
    const response = await api.get('/services/configs');
    return response.data;
  },

  createServiceConfig: async (
    input: CreateServiceConfigInput
  ): Promise<ServiceConfig> => {
    const response = await api.post('/services/configs', {
      ...input,
      isActive: input.isActive ?? true,
    });
    return response.data;
  },

  updateServiceConfig: async (
    id: number,
    config: Partial<ServiceConfig>
  ): Promise<ServiceConfig> => {
    const response = await axios.patch(
      `${API_URL}/services/configs/${id}`,
      config
    );
    return response.data;
  },

  deleteServiceConfig: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/services/configs/${id}`);
  },

  // Service Schedules
  getServiceSchedules: async (): Promise<ServiceSchedule[]> => {
    const response = await api.get('/services/schedules');
    return response.data;
  },

  createServiceSchedule: async (
    schedule: Omit<ServiceSchedule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ServiceSchedule> => {
    const response = await axios.post(
      `${API_URL}/services/schedules`,
      schedule
    );
    return response.data;
  },

  updateServiceSchedule: async (
    id: number,
    schedule: Partial<ServiceSchedule>
  ): Promise<ServiceSchedule> => {
    const response = await axios.patch(
      `${API_URL}/services/schedules/${id}`,
      schedule
    );
    return response.data;
  },

  deleteServiceSchedule: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/services/schedules/${id}`);
  },

  // Notifications
  getUpcomingServices: async (): Promise<ServiceSchedule[]> => {
    const response = await axios.get(`${API_URL}/services/upcoming`);
    return response.data;
  },

  markServiceAsCompleted: async (id: number): Promise<ServiceSchedule> => {
    const response = await api.post(`/services/schedules/${id}/complete`);
    return response.data;
  },
};
