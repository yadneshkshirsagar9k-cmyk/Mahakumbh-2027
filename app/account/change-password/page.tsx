'use client';

/**
 * @file Change Password Page
 * @description Secure changing of password with validation.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { UserService } from '@/services/user.service';

const schema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const ok = await UserService.changePassword(data.oldPassword, data.newPassword);
      if (ok) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-md">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[#022B5D] dark:text-stone-grey-200 font-[var(--font-heading)]">
          Change Account Password
        </h1>
        <p className="text-xs text-[#6E6E6E] dark:text-stone-grey-400">
          Update your secure passcode regularly to ensure account integrity.
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-bold">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Password changed successfully.</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#011D40] border border-[#DFDFDF] dark:border-white/5 rounded-xl p-5 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 text-xs">
          
          {/* Old Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#363636] block">Old Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type={showOld ? 'text' : 'password'}
                placeholder="Enter current password"
                className={cn(
                  'w-full pl-9 pr-9 py-2.5 rounded border outline-none transition-all',
                  errors.oldPassword ? 'border-red-400 focus:ring-red-100' : 'border-[#DFDFDF] dark:border-white/10'
                )}
                {...register('oldPassword')}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
              >
                {showOld ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#363636] block">New Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Create new password"
                className={cn(
                  'w-full pl-9 pr-9 py-2.5 rounded border outline-none transition-all',
                  errors.newPassword ? 'border-red-400 focus:ring-red-100' : 'border-[#DFDFDF] dark:border-white/10'
                )}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
              >
                {showNew ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#363636] block">Confirm New Password</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                className={cn(
                  'w-full pl-9 pr-9 py-2.5 rounded border outline-none transition-all',
                  errors.confirmPassword ? 'border-red-400 focus:ring-red-100' : 'border-[#DFDFDF] dark:border-white/10'
                )}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
              >
                {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#022B5D] hover:bg-[#011732] text-white font-bold rounded uppercase tracking-wider transition-all select-none cursor-pointer"
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
