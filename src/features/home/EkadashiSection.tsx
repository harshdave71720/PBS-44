'use client';

import { useState } from 'react';
import type { EkadashiBooking } from '@/features/booking/repositories/googleSheetsRepository';
import { SectionHeading } from '@/components/shared/SectionHeading';

const CARDS_PER_PAGE = 4;

export function EkadashiSection({ ekadashis }: { ekadashis: EkadashiBooking[] }) {
  const [page, setPage] = useState(0);

  if (ekadashis.length === 0) return null;

  const totalPages = Math.ceil(ekadashis.length / CARDS_PER_PAGE);
  const visible = ekadashis.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section className="py-16 sm:py-24 bg-[#FFF7E8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading="आगामी एकादशी एवं बुकिंग"
          subheading="आने वाली एकादशी तिथियाँ एवं भवन बुकिंग की स्थिति"
          className="mb-4"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item) => (
            <div
              key={`${item.date}-${item.ekadashiNaam}`}
              className="flex flex-col rounded-xl border border-[#E8D5B0] bg-[#FFFDF7] shadow-sm overflow-hidden"
            >
              <div className="h-1 w-full bg-[#7A1C1C]" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <span className="inline-block self-start rounded-full bg-[#F7EAD3] px-2.5 py-0.5 text-xs font-medium text-[#7A1C1C]">
                  {item.maahAndPaksh}
                </span>
                <h3 className="text-base font-bold text-[#3B1A1A] leading-snug">{item.ekadashiNaam}</h3>
                <p className="text-sm text-muted-foreground">{item.date} ({item.day})</p>
                <div className="mt-auto pt-3 border-t border-[#E8D5B0]">
                  {item.whoBooked ? (
                    <p className="text-xs font-medium text-[#7A1C1C]">
                      बुक किया गया: {item.whoBooked}{item.village ? ` (${item.village})` : ''}
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-green-700">बुकिंग स्थिति: उपलब्ध</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7A1C1C] text-[#7A1C1C] transition-colors hover:bg-[#7A1C1C] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous"
            >
              ←
            </button>
            <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7A1C1C] text-[#7A1C1C] transition-colors hover:bg-[#7A1C1C] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
