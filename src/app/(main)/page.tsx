'use client';

import * as React from 'react';
import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/query/useAuth';
import { useResto } from '@/lib/query/useResto';
import { useAuthStore } from '@/store/authStore';
import { Restaurant } from '@/types/resto';
import { LogOut, MapPin, ShoppingBag, Star, Search } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

// Import Assets Utama Navbar & Hero
import bannerHero from '@/assets/banner-dashboard.png';
import logoPutih from '@/assets/logo-putih.png';
import logoWarna from '@/assets/logo.png';

// DATA ASSET SHOPPING BAG SEPARATE
import bagIconPutih from '@/assets/Bag-putih.png';
import bagIconHitam from '@/assets/Bag-hitam.png';

// Import Assets Kategori Bagian A (Figma Token)
import catIcon1 from '@/assets/Category-1.png';
import catIcon2 from '@/assets/Category-2.png';
import catIcon3 from '@/assets/Category-3.png';
import catIcon4 from '@/assets/Category-4.png';

// DATA ASSET SOSIAL MEDIA FOOTER
import socialIcon1 from '@/assets/social-media1.png';
import socialIcon2 from '@/assets/social-media2.png';
import socialIcon3 from '@/assets/social-media3.png';
import socialIcon4 from '@/assets/social-media4.png';

// 1. MAIN ENTRY POINT (Wrapped in Suspense)
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className='w-full min-h-screen bg-neutral-900 flex items-center justify-center text-white font-mono'>
          Memuat Dashboard Foody...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

// 2. MAIN DASHBOARD CONTENT IMPLEMENTATION
function DashboardContent() {
  const router = useRouter();
  const auth = useAuth();

  // Ambil data array restoran langsung dari custom hook React Query kamu
  const { data: restoData, isLoading: isRestoLoading } = useResto();

  // State Autentikasi Zustand Store
  const storeUser = useAuthStore((state) => state.user);
  const storeToken = useAuthStore((state) => state.token);
  const storeLogout = useAuthStore((state) => state.logout);

  const isLoggedIn =
    typeof window !== 'undefined' && !!storeToken && !!storeUser;
  const userName = storeUser?.name || 'User Foody';
  const avatarLetter = userName.trim().charAt(0).toUpperCase() || 'U';

  // --- LOCAL STATE NAVBAR, DROPDOWN & SEARCH ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // DATA STATIC BAGIAN A (Sesuai Rincian Figma)
  const categoryCards = [
    { id: 'all', title: 'All Restaurant', img: catIcon1 },
    { id: 'nearby', title: 'Nearby', img: catIcon2 },
    { id: 'bestseller', title: 'Best Seller', img: catIcon3 },
    { id: 'lunch', title: 'Lunch', img: catIcon4 },
  ];

  // TYPE-SAFE PARSING RESTORAN
  const displayedRestaurants = React.useMemo<Restaurant[]>(() => {
    if (!restoData) return [];

    if (Array.isArray(restoData)) {
      return restoData.slice(0, 12) as Restaurant[];
    }

    if (typeof restoData === 'object') {
      const secureObj = restoData as Record<string, unknown>;
      if ('data' in secureObj && Array.isArray(secureObj.data)) {
        return secureObj.data.slice(0, 12) as Restaurant[];
      }
    }

    return [];
  }, [restoData]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 747) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutSubmit = () => {
    setIsDropdownOpen(false);
    storeLogout();
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className='w-full min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col items-center relative overflow-x-hidden'>
      {/* ─── NAVBAR SECTION (Responsif Mobiles Px-4) ─── */}
      <nav
        className={`w-full h-20 fixed top-0 left-0 z-50 transition-all duration-300 flex justify-center px-4 md:px-[120px] ${
          isScrolled
            ? 'bg-white shadow-md border-b border-neutral-100'
            : 'bg-transparent'
        }`}
      >
        <div className='w-full max-w-[1200px] h-full flex items-center justify-between relative'>
          <Link
            href='/'
            className='flex items-center gap-[10px] md:gap-[15px] select-none'
          >
            <Image
              src={isScrolled ? logoWarna : logoPutih}
              alt='Foody Logo'
              width={36}
              height={36}
              className='object-contain transition-all duration-300 md:w-[42px] md:h-[42px]'
            />
            <span
              className={`text-[20px] md:text-[24px] font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-neutral-900' : 'text-white'}`}
            >
              Foody
            </span>
          </Link>

          {isLoggedIn ? (
            <div
              className='flex items-center gap-4 md:gap-6 relative'
              ref={dropdownRef}
            >
              {/* ✅ OPTIMASI BAG LOGO SIZE UNTUK MOBILE */}
              <button
                type='button'
                className='w-7 h-7 md:w-8 md:h-8 flex items-center justify-center relative hover:scale-105 transition-transform focus:outline-none'
              >
                <Image
                  src={isScrolled ? bagIconHitam : bagIconPutih}
                  alt='Shopping Bag'
                  width={28}
                  height={28}
                  className='object-contain transition-all duration-300 md:w-[32px] md:h-[32px]'
                />
              </button>

              {/* ✅ OPTIMASI AVATAR SIZE UNTUK MOBILE */}
              <button
                type='button'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/80 overflow-hidden bg-neutral-200 shadow-inner hover:scale-105 transition-all relative focus:outline-none'
              >
                <div className='w-full h-full bg-neutral-300 flex items-center justify-center text-neutral-600 font-bold text-sm md:text-base'>
                  {avatarLetter}
                </div>
              </button>

              {/* ✅ REVISI: USERNAME DI-HIDE DI MOBILE (`hidden md:block`) */}
              <span
                className={`hidden md:block text-base font-semibold tracking-wide transition-colors duration-300 cursor-pointer select-none ${isScrolled ? 'text-neutral-950' : 'text-white'}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userName}
              </span>

              {isDropdownOpen && (
                <div className='absolute right-0 top-14 md:top-16 w-[240px] bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200'>
                  <div className='px-4 py-3 flex items-center gap-3 select-none'>
                    <div className='w-10 h-10 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-600 font-bold text-sm shrink-0'>
                      {avatarLetter}
                    </div>
                    <span className='text-sm font-bold text-neutral-950 truncate'>
                      {userName}
                    </span>
                  </div>
                  <div className='w-full h-[1px] bg-neutral-100 my-1' />
                  <Link
                    href='/delivery-address'
                    onClick={() => setIsDropdownOpen(false)}
                    className='w-full px-4 h-11 flex items-center gap-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors'
                  >
                    <MapPin className='w-4 h-4 text-neutral-500 stroke-[2.5]' />
                    <span>Delivery address</span>
                  </Link>
                  <Link
                    href='/my-order'
                    onClick={() => setIsDropdownOpen(false)}
                    className='w-full px-4 h-11 flex items-center gap-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors'
                  >
                    <ShoppingBag className='w-4 h-4 text-neutral-500 stroke-[2.5]' />
                    <span>My Order</span>
                  </Link>
                  <button
                    type='button'
                    onClick={handleLogoutSubmit}
                    className='w-full px-4 h-11 flex items-center gap-2.5 text-sm font-semibold text-red-600 hover:bg-red-50/60 transition-colors focus:outline-none'
                  >
                    <LogOut className='w-4 h-4 stroke-[2.5]' />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-2 md:gap-4 select-none'>
              <Link
                href='/login'
                className={`px-4 md:px-6 h-9 md:h-10 flex items-center justify-center text-xs md:text-sm font-bold rounded-full border transition-all ${isScrolled ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-50' : 'border-white/40 text-white hover:bg-white/10'}`}
              >
                Sign In
              </Link>
              <Link
                href='/register'
                className={`px-4 md:px-6 h-9 md:h-10 flex items-center justify-center text-xs md:text-sm font-bold rounded-full transition-all shadow-sm ${isScrolled ? 'bg-primary text-white hover:bg-primary/95' : 'bg-white text-neutral-950 hover:bg-white/10'}`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ─── HERO BANNER SECTION ─── */}
      <header className='w-full h-[827px] relative flex items-center justify-center bg-neutral-900 overflow-hidden shrink-0'>
        <Image
          src={bannerHero}
          alt='Foody Dashboard Banner'
          fill
          priority
          sizes='100vw'
          className='object-cover object-center brightness-[0.85]'
        />
        <div className='absolute bottom-0 left-0 w-full h-[80%] bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none' />

        <div className='relative z-10 w-full max-w-[800px] text-center px-4 flex flex-col items-center'>
          <h1 className='text-white text-4xl md:text-[56px] font-extrabold tracking-tight leading-tight drop-shadow-md'>
            Explore Culinary Experiences
          </h1>
          <p className='text-neutral-200 text-lg md:text-xl font-medium max-w-[800px] drop-shadow-sm mt-6'>
            Search and refine your choice to discover the perfect restaurant.
          </p>

          {/* MENU SEARCH BAR (604x56px) */}
          <div className='w-full max-w-[604px] h-14 mt-10 bg-white rounded-full shadow-lg flex items-center px-[22px] relative group border border-neutral-100 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10'>
            <Search className='w-6 h-6 text-neutral-400 shrink-0 stroke-[2.5]' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search restaurants, food and drink'
              className='w-full h-full bg-transparent pl-[14px] pr-2 text-md font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none'
            />
          </div>
        </div>
      </header>

      {/* ─── MAIN INTERFACE (Responsif Padding) ─── */}
      <main className='w-full max-w-[1440px] px-4 md:px-[120px] pt-12 pb-24 flex flex-col items-center relative z-20 bg-neutral-50 mx-auto'>
        {/* 🟩 REVISI MAIN A: BUAT JADI 2 BARIS DI MOBILE (grid-cols-2) & HORIZONTAL DI DESKTOP */}
        <section className='w-full max-w-[1200px] pb-16 md:pb-[120px] flex items-center justify-center select-none'>
          <div className='grid grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap lg:justify-between justify-items-center w-full gap-y-8 gap-x-4 md:gap-x-[185.33px] items-center'>
            {categoryCards.map((card) => (
              <div
                key={card.id}
                className='flex flex-col items-center justify-center shrink-0 cursor-pointer group space-y-[6px]'
              >
                <div className='w-[150px] sm:w-[161px] h-[100px] rounded-[16px] bg-white border border-neutral-100 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02]'>
                  <div className='w-[65px] h-[65px] relative'>
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      sizes='65px'
                      className='object-contain'
                    />
                  </div>
                </div>
                <div className='w-[150px] sm:w-[161px] h-8 flex items-center justify-center bg-transparent'>
                  <span className='text-center text-base sm:text-lg font-bold leading-none text-neutral-950 tracking-tight'>
                    {card.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🟨 REVISI MAIN B: BUAT 1 BANJAR KEBAWAH RATA TENGAH DI MOBILE (grid-cols-1) */}
        <section className='w-full max-w-[1200px] flex flex-col relative'>
          <div className='w-full flex items-center justify-between select-none px-1'>
            <h2 className='text-2xl md:text-4xl font-extrabold leading-tight text-neutral-950 tracking-tight'>
              Recommended
            </h2>
            <Link
              href='/all-restaurants'
              className='text-sm md:text-lg font-extrabold leading-none text-primary transition-opacity hover:opacity-90'
            >
              See All
            </Link>
          </div>

          <div className='mt-8 w-full flex justify-center'>
            {isRestoLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-center w-full justify-items-center items-center'>
                {[...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className='w-full max-w-[370px] h-[152px] rounded-2xl bg-neutral-200'
                  />
                ))}
              </div>
            ) : displayedRestaurants.length > 0 ? (
              /* ✅ RESPONSIVE ENGINE: grid-cols-1 di mobile, otomatis rata tengah dengan justify-items-center */
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full justify-items-center items-center'>
                {displayedRestaurants.map((resto: Restaurant) => {
                  const currentImage =
                    Array.isArray(resto.images) && resto.images.length > 0
                      ? resto.images[0]
                      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=60';

                  const currentPlace =
                    resto.place || 'Location Address, Indonesia';
                  const currentStar =
                    typeof resto.star === 'number'
                      ? resto.star.toFixed(1)
                      : '4.5';

                  return (
                    <Link
                      key={resto.id?.toString()}
                      href={`/restaurant/${resto.id}`}
                      className='w-full max-w-[370px] h-[152px] bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex flex-row justify-between items-center gap-3 hover:shadow-md transition-all duration-300 group shrink-0'
                    >
                      <div className='flex-1 h-full flex flex-col justify-between overflow-hidden py-1'>
                        <h3 className='text-lg font-extrabold leading-tight text-neutral-950 truncate group-hover:text-primary transition-colors'>
                          {resto.name}
                        </h3>

                        <div className='flex items-center gap-1 text-amber-500 my-1'>
                          <Star className='w-4 h-4 fill-amber-500 stroke-amber-500' />
                          <span className='text-sm font-bold text-neutral-800'>
                            {currentStar}
                          </span>
                        </div>

                        <p className='text-md font-normal leading-normal text-neutral-500 line-clamp-2'>
                          {currentPlace}
                        </p>
                      </div>

                      <div className='w-[120px] h-[120px] rounded-xl relative overflow-hidden bg-neutral-100 shrink-0 shadow-sm'>
                        <Image
                          src={currentImage}
                          alt={resto.name || 'Restaurant Image'}
                          fill
                          sizes='120px'
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className='w-full py-12 text-center bg-white rounded-2xl border border-dashed text-neutral-400 text-sm'>
                Tidak ada data rekomendasi restoran saat ini.
              </div>
            )}
          </div>

          <div className='w-full flex justify-center mt-12'>
            <button
              type='button'
              className='px-6 py-2 bg-neutral-50 border border-neutral-300 hover:bg-neutral-100 text-neutral-950 font-bold text-md rounded-full shadow-sm transition-all active:scale-[0.98]'
            >
              Show More
            </button>
          </div>
        </section>
      </main>

      {/* ─── FOOTER SECTION ─── */}
      <footer className='w-full bg-[#0B0D17] text-white px-6 md:px-[120px] py-20 flex justify-center select-none shrink-0 border-t border-neutral-900'>
        <div className='w-full max-w-[1200px] flex flex-col lg:flex-row justify-between items-start gap-y-12 lg:gap-x-12'>
          {/* KOLOM 1: BRAND LOGO */}
          <div className='w-full lg:w-[380px] flex flex-col items-start gap-6'>
            <div className='flex items-center gap-[15px]'>
              <Image
                src={logoWarna}
                alt='Foody Logo Footer'
                width={42}
                height={42}
                className='object-contain'
              />
              <span className='text-[24px] font-extrabold tracking-tight text-white'>
                Foody
              </span>
            </div>

            <p className='text-neutral-400 text-base font-medium leading-relaxed'>
              Enjoy homemade flavors & chef’s signature dishes, freshly prepared
              every day. Order online or visit our nearest branch.
            </p>

            <div className='flex flex-col gap-3 mt-2'>
              <span className='text-sm font-bold tracking-wider uppercase text-neutral-300'>
                Follow on Social Media
              </span>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full bg-neutral-800/60 hover:bg-neutral-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative'>
                  <Image
                    src={socialIcon1}
                    alt='Social Media 1'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </div>
                <div className='w-10 h-10 rounded-full bg-neutral-800/60 hover:bg-neutral-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative'>
                  <Image
                    src={socialIcon2}
                    alt='Social Media 2'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </div>
                <div className='w-10 h-10 rounded-full bg-neutral-800/60 hover:bg-neutral-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative'>
                  <Image
                    src={socialIcon3}
                    alt='Social Media 3'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </div>
                <div className='w-10 h-10 rounded-full bg-neutral-800/60 hover:bg-neutral-700 flex items-center justify-center transition-all hover:scale-105 cursor-pointer relative'>
                  <Image
                    src={socialIcon4}
                    alt='Social Media 4'
                    width={20}
                    height={20}
                    className='object-contain'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM 2: EXPLORE LINKS */}
          <div className='w-full lg:w-[200px] flex flex-col items-start gap-5'>
            <h4 className='text-base font-bold tracking-wider text-white uppercase'>
              Explore
            </h4>
            <ul className='flex flex-col gap-4 text-neutral-400 text-base font-medium'>
              <li>
                <Link
                  href='/all-food'
                  className='hover:text-white transition-colors'
                >
                  All Food
                </Link>
              </li>
              <li>
                <Link
                  href='/nearby'
                  className='hover:text-white transition-colors'
                >
                  Nearby
                </Link>
              </li>
              <li>
                <Link
                  href='/discount'
                  className='hover:text-white transition-colors'
                >
                  Discount
                </Link>
              </li>
              <li>
                <Link
                  href='/best-seller'
                  className='hover:text-white transition-colors'
                >
                  Best Seller
                </Link>
              </li>
              <li>
                <Link
                  href='/delivery'
                  className='hover:text-white transition-colors'
                >
                  Delivery
                </Link>
              </li>
              <li>
                <Link
                  href='/lunch'
                  className='hover:text-white transition-colors'
                >
                  Lunch
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: HELP LINKS */}
          <div className='w-full lg:w-[200px] flex flex-col items-start gap-5'>
            <h4 className='text-base font-bold tracking-wider text-white uppercase'>
              Help
            </h4>
            <ul className='flex flex-col gap-4 text-neutral-400 text-base font-medium'>
              <li>
                <Link
                  href='/how-to-order'
                  className='hover:text-white transition-colors'
                >
                  How to Order
                </Link>
              </li>
              <li>
                <Link
                  href='/payment-methods'
                  className='hover:text-white transition-colors'
                >
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link
                  href='/track-order'
                  className='hover:text-white transition-colors'
                >
                  Track My Order
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='hover:text-white transition-colors'
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='hover:text-white transition-colors'
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
