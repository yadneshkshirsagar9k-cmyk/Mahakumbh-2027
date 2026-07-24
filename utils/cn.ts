/**
 * @file Utility function for merging Tailwind CSS class names
 * @description Combines clsx and tailwind-merge for conditional,
 * conflict-free class name composition. Use this everywhere instead
 * of manual string concatenation.
 *
 * @example
 * import { cn } from '@/utils/cn';
 * <div className={cn('text-lg', isActive && 'text-primary-500', className)} />
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
