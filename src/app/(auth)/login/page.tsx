'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/authSchema';
import { useAuth } from '@/lib/query/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import bannerLogin from '@/assets/banner-login.png';
import logoApp from '@/assets/logo.png';

export default function LoginPage() {
  const { login, isLoginLoading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <main className='w-full min-h-screen bg-white flex flex-col md:flex-row font-sans'>
      {/* SISI KIRI: BANNER IMAGE */}
      <section className='hidden md:block md:w-1/2 relative h-screen sticky top-0 select-none'>
        <Image
          src={bannerLogin}
          alt='Delicious Food Banner'
          fill
          priority
          sizes='50vw'
          className='object-cover object-center'
        />
      </section>

      {/* SISI KANAN: FORM CONTAINER */}
      <section className='w-full md:w-1/2 min-h-screen flex items-center justify-center bg-white p-spacing-4xl'>
        <div className='w-full max-w-[374px] flex flex-col'>
          <header className='flex flex-col gap-spacing-2xl'>
            <div className='flex items-center gap-[15px] mb-[20px]'>
              <Image
                src={logoApp}
                alt='Foody Logo'
                width={42}
                height={42}
                className='object-contain'
              />
              <span className='text-display-md font-extrabold text-neutral-900 tracking-tight'>
                Foody
              </span>
            </div>
            <div className='flex flex-col gap-1'>
              <h1 className='text-display-sm font-bold text-neutral-950'>
                Welcome Back
              </h1>
              <p className='text-text-sm font-regular text-neutral-500 mb-[20px]'>
                Good to see you again! Let’s eat
              </p>
            </div>
          </header>

          {/* TAB NAVIGATION: Sign in aktif, Sign up berupa link navigasi */}
          <div className='mt-spacing-2xl bg-neutral-100 p-1 rounded-lg flex w-full mb-[20px]'>
            <button
              type='button'
              className='flex-1 text-center py-2 text-text-sm font-semibold text-neutral-900 bg-white rounded-md shadow-sm transition-all'
            >
              Sign in
            </button>
            <Link
              href='/register'
              className='flex-1 text-center py-2 text-text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors'
            >
              Sign up
            </Link>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col w-full gap-[20px]'
            >
              {/* INPUT EMAIL */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <div className='mt-spacing-2xl relative w-full'>
                      <FormControl>
                        <input
                          type='email'
                          placeholder='Email'
                          disabled={isLoginLoading}
                          {...field}
                          className='w-full h-12 pl-[12px] pr-[12px] py-[13px] border border-neutral-300 rounded-md text-text-md font-regular text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60'
                        />
                      </FormControl>
                    </div>
                    <FormMessage className='text-xs text-primary mt-1 font-medium' />
                  </FormItem>
                )}
              />

              {/* INPUT PASSWORD */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='space-y-0'>
                    <div className='mt-spacing-2xl relative w-full'>
                      <FormControl>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder='Password'
                          disabled={isLoginLoading}
                          {...field}
                          className='w-full h-12 pl-[12px] pr-11 py-[13px] border border-neutral-300 rounded-md text-text-md font-regular text-neutral-950 placeholder:text-neutral-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-60'
                        />
                      </FormControl>
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoginLoading}
                        className='absolute right-[12px] top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 transition-colors disabled:opacity-50'
                      >
                        {showPassword ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                            />
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 1-4.243-4.243m4.243 4.243L9.878 9.878'
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <FormMessage className='text-xs text-primary mt-1 font-medium' />
                  </FormItem>
                )}
              />

              {/* CHECKBOX REMEMBER ME */}
              <div className='mt-spacing-2xl flex items-center gap-spacing-xs py-0.5 w-full'>
                <input
                  type='checkbox'
                  id='rememberMe'
                  checked={rememberMe}
                  disabled={isLoginLoading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary disabled:opacity-50'
                />
                <label
                  htmlFor='rememberMe'
                  className='text-text-sm font-medium text-neutral-950 cursor-pointer select-none'
                >
                  Remember Me
                </label>
              </div>

              {/* TOMBOL LOGIN */}
              <button
                type='submit'
                disabled={isLoginLoading}
                className='mt-spacing-2xl w-full h-12 bg-primary hover:bg-primary/95 text-white text-text-md font-semibold rounded-full shadow-sm transition-colors active:scale-[0.99] disabled:opacity-70 flex items-center justify-center'
              >
                {isLoginLoading ? 'Processing...' : 'Login'}
              </button>
            </form>
          </Form>
        </div>
      </section>
    </main>
  );
}
