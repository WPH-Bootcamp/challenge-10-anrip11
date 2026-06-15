import { useMutation } from '@tanstack/react-query';
import { api } from '../api/axios';
import { LoginInput, RegisterInput } from '../validations/authSchema';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// 1. Interface Response Sukses dari Backend
interface AuthSuccessPayload {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
  token: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthSuccessPayload; // Data dibungkus di dalam properti 'data'
}

// 2. Interface Error Response dari Server Railway (Bebas dari keyword 'any')
interface ApiErrorResponse {
  message?: string | string[]; // Kadang berupa array pesan validasi dari server
  error?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Mutation untuk Register
  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterInput, 'confirmPassword'>) => {
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan masuk ke akun Anda.');
      router.push('/login');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      // Ekstraksi pesan secara aman (Safe Extract) jika error berupa array atau string
      const serverMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || 'Registrasi gagal. Silakan coba lagi.';

      toast.error(errorMessage);
    },
  });

  // Mutation untuk Login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post<AuthResponse>('/api/auth/login', data);
      return response.data;
    },
    onSuccess: (responsePayload) => {
      // Mengambil token & user dari dalam nested object 'data' sesuai respon asli server
      const { token, user } = responsePayload.data;

      // Simpan ke Zustand Store (Client State)
      setAuth(token, user);

      // Simpan ke Cookies agar terbaca oleh Server Side Runtime
      const maxAge = 7 * 24 * 60 * 60; // 7 hari
      const isProd = process.env.NODE_ENV === 'production';
      document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax; ${isProd ? 'Secure' : ''}`;

      toast.success(`Selamat datang kembali, ${user.name}!`);

      // Pindah ke Home dan sinkronisasikan state halaman utama
      router.push('/');
      router.refresh();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      // Ambil pesan error eksklusif 'Invalid email or password' langsung dari body server
      const serverMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage ||
          'Login gagal. Periksa kembali email & password Anda.';

      toast.error(errorMessage);
    },
  });

  return {
    register: registerMutation.mutate,
    isRegisterLoading: registerMutation.isPending,
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
  };
};
