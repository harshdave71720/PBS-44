import { revalidateTag } from 'next/cache';
import { BOOKING_CACHE_TAG } from '@/features/booking/constants';
import { createBookingRequest } from '@/features/booking/repositories/googleSheetsRepository';

export async function POST(request: Request) {
  try {
    const bookingRequest = await request.json();

    await createBookingRequest(bookingRequest);
    revalidateTag(BOOKING_CACHE_TAG, 'max');

    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to create booking request:', error);

    return Response.json({ success: false }, { status: 500 });
  }
}
