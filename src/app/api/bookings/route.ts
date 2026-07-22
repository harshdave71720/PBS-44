import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getBhavanBookings } from '@/features/booking/repositories/googleSheetsRepository';
import { buildPublicBookingsMap } from '@/features/booking/utils/availability';
import { BHAVAN_QUERY_MAP, BHAVAN_SHEET_TAB_MAP, BOOKING_CACHE_TAG } from '@/features/booking/constants';

const getCachedBhavanBookings = unstable_cache(
  (sheetName: string) => getBhavanBookings(sheetName),
  [BOOKING_CACHE_TAG],
  { revalidate: 10, tags: [BOOKING_CACHE_TAG] },
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const bhavanParam = searchParams.get('bhavan');

  if (!date || !bhavanParam) {
    return NextResponse.json({ error: 'Missing date or bhavan param.' }, { status: 400 });
  }

  const bhavanType = BHAVAN_QUERY_MAP[bhavanParam];
  if (!bhavanType) {
    return NextResponse.json({ error: 'Invalid bhavan param.' }, { status: 400 });
  }

  const sheetName = BHAVAN_SHEET_TAB_MAP[bhavanType];
  const bookings = await getCachedBhavanBookings(sheetName);
  const publicMap = buildPublicBookingsMap(bookings);
  const dateBookings = (publicMap[date] ?? []).filter((b) => b.bookingStatus === 'CONFIRMED');

  return NextResponse.json({ bookings: dateBookings });
}
