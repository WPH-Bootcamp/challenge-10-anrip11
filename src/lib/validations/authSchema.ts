import { z } from 'zod';

// Schema untuk form Login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }) // Menangani jika password dikosongkan saat login
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// Schema untuk form Register
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name cannot exceed 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    phone: z
      .string()
      .min(1, { message: 'Phone number is required' })
      .transform((val) => {
        const cleaned = val.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
          return '62' + cleaned.slice(1);
        }
        if (cleaned.startsWith('8')) {
          return '62' + cleaned;
        }
        return cleaned;
      })
      .refine((val) => val.length >= 11 && val.length <= 16, {
        message: 'Phone number must be a valid length (e.g. 10-15 digits)',
      }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Pesan error akan muncul di input confirmPassword
  });

// Infer tipe data TypeScript dari schema Zod agar tipe data form kita super aman (Strictly Typed)
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
