'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const BHAVAN_OPTIONS = [
  { value: 'MAIN_BHAVAN', label: 'मुख्य धर्मशाला' },
  { value: 'DEVPURI_BHAVAN', label: 'देवपुरी धर्मशाला' },
  { value: 'GOVIND_COLONY_BHAVAN', label: 'गोविंद कॉलोनी धर्मशाला' },
] as const;

type BhavanValue = (typeof BHAVAN_OPTIONS)[number]['value'];

export function BhavanSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBhavan = (searchParams.get('bhavan') ?? 'MAIN_BHAVAN') as BhavanValue;

  const handleSelect = (value: BhavanValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('bhavan', value);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <label className="mb-2 block font-medium text-foreground">धर्मशाला चयन</label>
      <div className="grid gap-2 sm:grid-cols-3">
        {BHAVAN_OPTIONS.map((option) => {
          const isSelected = selectedBhavan === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'rounded-md border px-3 py-2 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-primary bg-[#FFF7E8] text-primary'
                  : 'border-border bg-[#FFFDF7] text-foreground hover:bg-[#F7EAD3]',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
