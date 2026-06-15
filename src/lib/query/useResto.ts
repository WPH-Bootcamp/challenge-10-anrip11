'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios';
import { Restaurant } from '@/types/resto';

// Struktur response API dibentuk secara strict tanpa keyword 'any'
interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    filters: Record<string, unknown> | null; // Menggunakan unknown jauh lebih aman daripada any
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    restaurants: Restaurant[]; // Target array restoran kita
  };
}

export const useResto = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        // Berikan generic type <ApiResponse> pada pemanggilan axios
        const response = await api.get<ApiResponse>('/api/resto');

        // Ekstraksi data yang aman dari pengecekan null/undefined
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.restaurants)
        ) {
          return response.data.data.restaurants;
        }

        return [] as Restaurant[];
      } catch (err) {
        console.error('Gagal mengambil data restoran:', err);
        throw err;
      }
    },
  });
};
