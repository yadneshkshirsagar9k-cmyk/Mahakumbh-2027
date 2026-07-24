'use client';

/**
 * @file Forgot Password Page
 * @description Official Forgot Password page for Nashik Mahakumbh Portal.
 * Frontend-only OTP trigger simulation.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/utils/cn';

const schema = z.object({
  mobile: z
    .string()
    .length(10, 'Mobile number must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />
      <main className="flex-grow pt-[80px] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-[#DFDFDF] shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#022B5D] px-6 py-4">
            <h1 className="text-base font-bold text-white font-[var(--font-heading)]">Forgot Password</h1>
            <p className="text-[11px] text-white/65 mt-0.5">Nashik Mahakumbh Portal — Account Recovery</p>
          </div>

          <div className="p-6 space-y-5">
            {!submitted ? (
              <>
                <p className="text-sm text-[#525252] leading-relaxed">
                  Enter your registered mobile number. An OTP will be sent via SMS to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fp-mobile" className="block text-xs font-semibold text-[#363636]">
                      Registered Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-sm">🇮🇳</span>
                        <span className="text-[11px] font-bold text-[#525252]">+91</span>
                      </div>
                      <input
                        id="fp-mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        autoComplete="tel"
                        aria-invalid={!!errors.mobile}
                        className={cn(
                          'w-full pl-14 pr-3 py-2.5 text-sm rounded border outline-none transition-all duration-150',
                          'bg-white text-[#1A1A1A] placeholder:text-[#B0B0B0]',
                          'focus:ring-2 focus:border-[#022B5D]',
                          errors.mobile
                            ? 'border-red-400 focus:ring-red-100'
                            : 'border-[#DFDFDF] hover:border-[#B0B0B0] focus:ring-[#022B5D]/20'
                        )}
                        {...register('mobile')}
                      />
                    </div>
                    {errors.mobile && (
                      <p className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                        <AlertCircle size={11} />
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded text-sm font-bold uppercase tracking-wider text-white bg-[#022B5D] hover:bg-[#011732] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-[#022B5D]">OTP Sent Successfully</h3>
                <p className="text-sm text-[#525252] leading-relaxed">
                  An OTP has been sent to <strong>+91-{getValues('mobile')}</strong>. Please check your SMS and follow the instructions to reset your password.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-[#EFEFEF]">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#022B5D] hover:text-[#F26F21] transition-colors"
              >
                <ArrowLeft size={13} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
