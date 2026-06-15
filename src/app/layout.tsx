import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from './Provider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/ui/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Assignment 10',
  description: 'Restoran App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bungkus children menggunakan QueryProvider yang baru kita buat */}
        <QueryProvider>
          {/* <Navbar /> */}
          {/* Konten utama dari page.tsx akan otomatis mengalir di bawah navbar */}
          {children}
          <Toaster position='top-center' richColors />{' '}
          {/* Pemicu alert toast pop-up */}
        </QueryProvider>
      </body>
    </html>
  );
}
