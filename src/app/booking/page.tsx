import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { getBhavanBookings } from '@/features/booking/repositories/googleSheetsRepository';
import {
  calculateDailyAvailability,
  buildPublicBookingsMap,
} from '@/features/booking/utils/availability';
import { BookingCalendar } from '@/features/booking/components/BookingCalendar';
import { BhavanSelector } from '@/features/booking/components/BhavanSelector';
import {
  BHAVAN_QUERY_MAP,
  BHAVAN_SHEET_TAB_MAP,
  BOOKING_CACHE_TAG,
} from '@/features/booking/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getCachedBhavanBookings = unstable_cache(
  (sheetName: string) => getBhavanBookings(sheetName),
  [BOOKING_CACHE_TAG],
  { revalidate: 10, tags: [BOOKING_CACHE_TAG] },
);

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ bhavan?: string }>;
}) {
  const { bhavan: bhavanParam } = await searchParams;
  const bhavanType =
    bhavanParam && BHAVAN_QUERY_MAP[bhavanParam]
      ? BHAVAN_QUERY_MAP[bhavanParam]
      : BHAVAN_QUERY_MAP.MAIN_BHAVAN;
  const sheetName = BHAVAN_SHEET_TAB_MAP[bhavanType];

  const bookings = await getCachedBhavanBookings(sheetName);
  const statusMap = calculateDailyAvailability(bookings);
  const publicBookingsMap = buildPublicBookingsMap(bookings);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#7A1C1C]">भवन उपलब्धता</h1>
        <p className="text-sm text-muted-foreground">
          कैलेंडर में तारीख चुनें और उस दिन की बुकिंग स्थिति देखें।
        </p>
      </div>
      <Suspense fallback={<div className="mb-6 h-12 animate-pulse rounded-md bg-muted" />}>
        <BhavanSelector />
      </Suspense>
      <BookingCalendar
        statusMap={statusMap}
        publicBookingsMap={publicBookingsMap}
        bhavanLabel={sheetName}
        bhavanType={bhavanType}
      />
    </section>
  );
}
