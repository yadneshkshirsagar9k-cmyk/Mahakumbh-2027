'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Optional badge text shown to the right of the title */
  badge?: string;
  /** Optional badge color class */
  badgeColor?: string;
  /** Card wrapper styling — set false to render borderless */
  card?: boolean;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
  badge,
  badgeColor = 'bg-[#F26F21]/10 text-[#F26F21] border-[#F26F21]/25',
  card = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        card &&
          'bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden'
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 text-left cursor-pointer transition-colors select-none',
          card ? 'px-5 py-4 hover:bg-[#FAFBFC]' : 'py-3'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="shrink-0">{icon}</span>}
          <h3 className="text-sm font-extrabold text-[#111827] truncate">
            {title}
          </h3>
          {badge && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider shrink-0',
                badgeColor
              )}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 text-[#6B7280] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'transition-all duration-200 ease-in-out overflow-hidden',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className={cn(card ? 'px-5 pb-5 pt-0' : 'pb-3')}>
          {children}
        </div>
      </div>
    </div>
  );
}
