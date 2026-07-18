import { unstable_cache } from 'next/cache';
import { getBhavanBookings } from '@/features/booking/repositories/googleSheetsRepository';
import { calculateDailyAvailability } from '@/features/booking/utils/availability';
import { BookingCalendar } from '@/features/booking/components/BookingCalendar';

const getCachedBhavanBookings = unstable_cache(
  () => getBhavanBookings('मुख्य धर्मशाला'),
  ['bhavan-bookings-mukhya-dharamshala'],
  { revalidate: 60 },
);

export default async function BookingPage() {
  const bookings = await getCachedBhavanBookings();
  const statusMap = calculateDailyAvailability(bookings);

  return <BookingCalendar statusMap={statusMap} />;
}
