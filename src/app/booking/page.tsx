import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { getBhavanBookings } from '@/features/booking/repositories/googleSheetsRepository';
import {
  calculateDailyAvailability,
  buildPublicBookingsMap,
} from '@/features/booking/utils/availability';
import { BookingCalendar } from '@/features/booking/components/BookingCalendar';
import { BhavanSelector } from '@/features/booking/components/BhavanSelector';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BHAVAN_SHEET_MAP: Record<string, string> = {
  MAIN_BHAVAN: 'मुख्य धर्मशाला',
  DEVPURI_BHAVAN: 'देवपुरी धर्मशाला',
  GOVIND_COLONY_BHAVAN: 'गोविंद कॉलोनी धर्मशाला',
};

const getCachedBhavanBookings = unstable_cache(
  (sheetName: string) => getBhavanBookings(sheetName),
  ['bhavan-bookings'],
  { revalidate: 10 },
);

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ bhavan?: string }>;
}) {
  const { bhavan: bhavanParam } = await searchParams;
  const bhavanKey =
    bhavanParam && BHAVAN_SHEET_MAP[bhavanParam] ? bhavanParam : 'MAIN_BHAVAN';
  const sheetName = BHAVAN_SHEET_MAP[bhavanKey];

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
      />
    </section>
  );
}

