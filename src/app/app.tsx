'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useResto } from '@/lib/query/useResto';
import { Restaurant } from '@/types/resto';
import {
  Star,
  Clock,
  MapPin,
  Utensils,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { data: restaurants = [], isLoading, isError, refetch } = useResto();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  // Daftar kategori statis untuk filter UI
  const categories = [
    'All',
    'Fast Food',
    'Asian',
    'Bakery',
    'Beverages',
    'Healthy',
  ];

  // Filter data berdasarkan seksi figma
  const recommendedRestos = restaurants.filter((r) => r.isRecommended);
  const bestSellerRestos = restaurants.filter((r) => r.isBestSeller);

  const filteredByCategory =
    selectedCategory === 'All'
      ? restaurants
      : restaurants.filter(
          (r) => r.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // --- 1. LOADING STATE (SKELETON UI) ---
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-6 space-y-8 max-w-6xl'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
        </div>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className='h-10 w-24 rounded-full flex-shrink-0'
            />
          ))}
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-36' />
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-64 w-full rounded-xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ERROR STATE / EMPTY STATE UTAMA ---
  if (isError || restaurants.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center max-w-md'>
        <div className='p-4 bg-muted rounded-full text-muted-foreground mb-4'>
          <AlertCircle className='w-12 h-12' />
        </div>
        <h2 className='text-xl font-bold tracking-tight'>
          Gagal Memuat Restoran
        </h2>
        <p className='text-sm text-muted-foreground mt-2 mb-6'>
          {isError
            ? 'Terjadi kesalahan koneksi saat mengambil data dari server.'
            : 'Belum ada restoran yang tersedia di aplikasi saat ini.'}
        </p>
        <Button onClick={() => refetch()}>Coba Muat Ulang</Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-6 space-y-10 max-w-6xl'>
      {/* Header Welcome */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>
            Bites & Co
          </h1>
          <p className='text-muted-foreground mt-1'>
            Temukan kuliner dan restoran terbaik di sekitarmu
          </p>
        </div>
      </div>

      {/* Kategori Berdasarkan Figma */}
      <div className='space-y-3'>
        <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
          Kategori Kuliner
        </h3>
        <div className='flex gap-2 overflow-x-auto pb-2 no-scrollbar'>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className='rounded-full flex-shrink-0'
              onClick={() => setSelectedCategory(category)}
            >
              <Utensils className='w-4 h-4 mr-1.5' />
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* --- SECTION 1: RECOMMENDED RESTAURANTS --- */}
      {recommendedRestos.length > 0 && selectedCategory === 'All' && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
              Rekomendasi Untukmu
            </h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {recommendedRestos.map((resto) => (
              <RestoCard key={resto.id} resto={resto} />
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 2: BEST SELLERS --- */}
      {bestSellerRestos.length > 0 && selectedCategory === 'All' && (
        <div className='space-y-4 pt-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
              Paling Laris (Best Seller)
            </h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {bestSellerRestos.map((resto) => (
              <RestoCard key={resto.id} resto={resto} />
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 3: ALL / DYNAMIC CATEGORY VIEW --- */}
      <div className='space-y-4 pt-4'>
        <h2 className='text-2xl font-bold tracking-tight text-foreground'>
          {selectedCategory === 'All'
            ? 'Semua Restoran'
            : `Restoran dengan Kategori "${selectedCategory}"`}
        </h2>

        {/* Empty State Khusus Filter Kategori */}
        {filteredByCategory.length === 0 ? (
          <div className='p-12 text-center border-2 border-dashed rounded-xl bg-muted/20'>
            <Search className='w-8 h-8 text-muted-foreground mx-auto mb-2' />
            <p className='text-sm font-medium text-muted-foreground'>
              Tidak ada restoran di kategori ini.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {filteredByCategory.map((resto) => (
              <RestoCard key={resto.id} resto={resto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-KOMPONEN REUSABLE RESTO CARD ---
function RestoCard({ resto }: { resto: Restaurant }) {
  return (
    <Link
      href={`/resto/${resto.id}`}
      className='group block transition-transform duration-200 hover:-translate-y-1'
    >
      <Card className='overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow'>
        <div className='relative aspect-video w-full bg-muted'>
          <Image
            src={resto.image}
            alt={resto.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority={resto.isRecommended}
          />
          {resto.isBestSeller && (
            <span className='absolute top-2 left-2 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow'>
              🔥 POPULER
            </span>
          )}
        </div>
        <CardContent className='p-4 space-y-3'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='font-bold text-lg leading-tight text-foreground line-clamp-1'>
              {resto.name}
            </h3>
            <div className='flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold flex-shrink-0'>
              <Star className='w-3.5 h-3.5 fill-amber-500' />
              {resto.rating.toFixed(1)}
            </div>
          </div>

          <p className='text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 w-max px-2 py-0.5 rounded'>
            {resto.category}
          </p>

          <div className='flex items-center gap-4 pt-1 text-xs text-muted-foreground font-medium'>
            <div className='flex items-center gap-1'>
              <MapPin className='w-3.5 h-3.5' />
              {resto.distance} km
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5' />
              {resto.deliveryTime} mnt
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
