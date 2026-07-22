import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { BOOKING_CACHE_TAG } from '@/features/booking/constants';
import {
  createBookingRequest,
  type CreateBookingRequestParams,
} from '@/features/booking/repositories/googleSheetsRepository';

const BOOKING_TYPES = new Set<CreateBookingRequestParams['bookingType']>([
  'FULL_BHAVAN',
  'HALF_BHAVAN',
  'HALL_ONLY',
]);

function isBookingRequestBody(value: unknown): value is CreateBookingRequestParams {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const request = value as Record<string, unknown>;
  return (
    (typeof request.membershipNumber === 'string' || typeof request.membershipNumber === 'number') &&
    typeof request.applicantName === 'string' &&
    typeof request.gaonName === 'string' &&
    typeof request.applicantMobileNumber === 'string' &&
    typeof request.bookedFor === 'string' &&
    typeof request.eventName === 'string' &&
    typeof request.bhavanName === 'string' &&
    typeof request.bookingType === 'string' &&
    BOOKING_TYPES.has(request.bookingType as CreateBookingRequestParams['bookingType']) &&
    (request.memberName === undefined || typeof request.memberName === 'string') &&
    (request.memberMobileNumber === undefined || typeof request.memberMobileNumber === 'string') &&
    (request.remarks === undefined || typeof request.remarks === 'string')
  );
}

export async function POST(request: Request) {
  try {
    const bookingRequest: unknown = await request.json();
    if (!isBookingRequestBody(bookingRequest)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking request payload.' },
        { status: 400 },
      );
    }

    await createBookingRequest(bookingRequest);
    revalidateTag(BOOKING_CACHE_TAG, 'max');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create booking request:', error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
