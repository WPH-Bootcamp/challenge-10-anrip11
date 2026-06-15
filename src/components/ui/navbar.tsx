'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // ✅ Hooks ditaruh di atas, tidak terhalang oleh conditional return apa pun
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      document.cookie =
        'token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      useAuthStore.setState({ user: null, token: null });
      toast.success('Berhasil keluar dari akun.');
      setIsOpen(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Gagal melakukan logout.');
    }
  };

  const getInitial = (name?: string | null) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  // ✅ SOLUSI: Pengecekan pathname ditaruh di sini agar mematuhi Rules of Hooks
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav className='w-full bg-white border-b border-slate-100 sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
        {/* Sisi Kiri */}
        <Link href='/' className='flex flex-col group'>
          <span className='text-base font-extrabold tracking-tight text-slate-900 group-hover:text-primary transition-colors'>
            Bites & Co
          </span>
          <span className='text-[10px] text-muted-foreground font-medium -mt-1'>
            Assignment Dashboard
          </span>
        </Link>

        {/* Sisi Kanan */}
        <div className='flex items-center gap-4'>
          {user ? (
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all focus:outline-none'
              >
                <div className='w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-xs font-bold text-orange-600 shadow-sm'>
                  <span>{getInitial(user.name)}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50'>
                  <div className='px-3.5 py-2 border-b border-slate-100'>
                    <p className='text-xs font-bold text-slate-800 truncate'>
                      {user.name || 'User Bites & Co'}
                    </p>
                    <p className='text-[11px] text-slate-400 truncate mt-0.5'>
                      {user.email || 'user@email.com'}
                    </p>
                  </div>

                  <div className='p-1'>
                    <Link
                      href='/profile'
                      onClick={() => setIsOpen(false)}
                      className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left'
                    >
                      <User className='w-4 h-4 text-slate-400' />
                      Profil
                    </Link>
                  </div>

                  <div className='border-t border-slate-100 my-1' />

                  <div className='p-1'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left'
                    >
                      <LogOut className='w-4 h-4 text-rose-500' />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login'>
              <button className='text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors'>
                Masuk Akun
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
