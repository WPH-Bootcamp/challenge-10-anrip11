import { useQuery } from '@tanstack/react-query';
import { api } from '../api/axios'; // Menyinkronkan dengan instance axios proyekmu
import { RestaurantDetail } from '@/types/resto';

// 1. Interface pembungkus response JSON dari API Railway
interface RestoDetailResponse {
  success: boolean;
  message: string;
  data: RestaurantDetail;
}

export const useRestoDetail = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      // Menembak endpoint GET /api/resto/{id} sesuai spesifikasi tugas
      const response = await api.get<RestoDetailResponse>(`/api/resto/${id}`);
      return response.data.data;
    },
    // Hook hanya akan mengeksekusi fetch jika id tidak kosong/undefined
    enabled: !!id,
  });
};
