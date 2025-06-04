import { RoomFormData } from '@/app/dashboard/rooms/types';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const roomService = {
  createRoom: async (data: RoomFormData) => {
    try {
      console.log('Creating room with data:', data);
      const response = await axios.post(`${API_URL}/room/create`, data);
      console.log('Create room response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error creating room:',
          error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  getRooms: async () => {
    try {
      console.log('Fetching rooms from:', `${API_URL}/room`);
      const response = await axios.get(`${API_URL}/room`);
      console.log('Get rooms response status:', response.status);
      console.log('Get rooms response data:', response.data);
      console.log('Get rooms response data type:', typeof response.data);
      console.log(
        'Get rooms response data length:',
        Array.isArray(response.data) ? response.data.length : 'not an array'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error getting rooms:',
          error.response?.data || error.message
        );
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  updateRoom: async (id: string, data: RoomFormData) => {
    try {
      console.log('Updating room with data:', { id, ...data });
      const response = await axios.patch(`${API_URL}/room/update`, {
        id,
        ...data,
      });
      console.log('Update room response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error updating room:',
          error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  deleteRoom: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/room/${id}`);
      console.log('Delete room response:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error deleting room:',
          error.response?.data || error.message
        );
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};
