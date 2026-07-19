import { unstable_cache } from 'next/cache';
import { getBhavanBookings } from '@/features/booking/repositories/googleSheetsRepository';
import { calculateDailyAvailability } from '@/features/booking/utils/availability';
import { BookingCalendar } from '@/features/booking/components/BookingCalendar';

// Replace your existing 'revalidate' export with these
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getCachedBhavanBookings = unstable_cache(
  () => getBhavanBookings('मुख्य धर्मशाला'),
  ['bhavan-bookings-mukhya-dharamshala'],
  { revalidate: 10 },
);

export default async function BookingPage() {
  const bookings = await getCachedBhavanBookings();
  const statusMap = calculateDailyAvailability(bookings);

  return <BookingCalendar statusMap={statusMap} />;
}
