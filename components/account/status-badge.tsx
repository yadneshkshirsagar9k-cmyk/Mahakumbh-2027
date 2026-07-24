/**
 * @file Status Badge
 * @description Renders consistent, government-grade badges for registration & tour statuses.
 */

import { cn } from '@/utils/cn';

export type TourStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

interface StatusBadgeProps {
  status: TourStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_');

  const config: Record<string, { label: string; bg: string; text: string; border: string }> = {
    draft: {
      label: 'Draft',
      bg: 'bg-stone-grey-100 dark:bg-stone-grey-800',
      text: 'text-stone-grey-700 dark:text-stone-grey-300',
      border: 'border-stone-grey-300 dark:border-stone-grey-700',
    },
    submitted: {
      label: 'Submitted',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-500/20',
    },
    pending: {
      label: 'Pending',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-500/20',
    },
    under_verification: {
      label: 'Under Verification',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-500/20',
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-500/20',
    },
    qr_generated: {
      label: 'QR Generated',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-500/20',
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-500/20',
    },
    completed: {
      label: 'Completed',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-500/20',
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-stone-grey-100 dark:bg-stone-grey-800/40',
      text: 'text-stone-grey-600 dark:text-stone-grey-400',
      border: 'border-stone-grey-300 dark:border-white/5',
    },
  };

  const current = config[normalized] || {
    label: status,
    bg: 'bg-stone-grey-50',
    text: 'text-stone-grey-600',
    border: 'border-stone-grey-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border',
        current.bg,
        current.text,
        current.border,
        className
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {current.label}
    </span>
  );
}
