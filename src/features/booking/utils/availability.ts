import { startOfDay, addDays, addMonths, endOfMonth } from 'date-fns';

export interface BhavanBooking {
  bookingDate: string;
  bookedFor?: string;
  membershipNumber: string;
  memberName: string;
  memberMobileNumber: string;
  applicantName: string;
  gaonName: string;
  applicantMobileNumber: string;
  eventName: string;
  bookingType: 'FULL_BHAVAN' | 'HALF_BHAVAN' | 'HALL_ONLY';
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'SOCIETY_EVENT' | 'MAINTENANCE';
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  remarks: string;
}

/**
 * Safe subset of BhavanBooking for the client.
 * Sensitive fields (applicantName, mobileNumber, membershipNumber) are
 * intentionally absent and must never be added here.
 */
export interface PublicBookingInfo {
  bookingDate: string;
  gaonName: string;
  eventName: string;
  bookingType: BhavanBooking['bookingType'];
  bookingStatus: BhavanBooking['bookingStatus'];
}

export type UIStatus =
  | 'AVAILABLE'
  | 'TENTATIVE'
  | 'PARTIALLY_AVAILABLE'
  | 'PARTIALLY_BOOKED'
  | 'FULLY_BOOKED'
  | 'SOCIETY_EVENT';

export function getBookingDateBoundaries(): { minDate: Date; maxDate: Date } {
  const today = startOfDay(new Date());
  const minDate = addDays(today, 1);
  const maxDate = endOfMonth(addMonths(today, 11));
  return { minDate, maxDate };
}

export function calculateDailyAvailability(
  bookings: BhavanBooking[],
): Record<string, UIStatus> {
  const { minDate, maxDate } = getBookingDateBoundaries();
  const result: Record<string, UIStatus> = {};
  const weightMap: Record<string, number> = {};

  for (const booking of bookings) {
    // bookedFor is the actual reservation date; fall back to bookingDate for
    // legacy rows that pre-date the BookedFor column.
    const effectiveDate = booking.bookedFor ?? booking.bookingDate;
    const date = startOfDay(new Date(effectiveDate));

    if (date < minDate || date > maxDate) continue;

    const key = effectiveDate;
    const current = result[key] ?? 'AVAILABLE';

    // SOCIETY_EVENT locks the entire day — nothing can override it
    if (current === 'SOCIETY_EVENT') continue;

    if (booking.bookingStatus === 'SOCIETY_EVENT') {
      result[key] = 'SOCIETY_EVENT';
      continue;
    }

    // FULLY_BOOKED is a terminal state (below SOCIETY_EVENT)
    if (current === 'FULLY_BOOKED') continue;

    if (booking.bookingStatus === 'PENDING') {
      if (current === 'AVAILABLE') {
        result[key] = 'TENTATIVE';
      }
      continue;
    }

    if (booking.bookingStatus === 'MAINTENANCE') {
      result[key] = 'FULLY_BOOKED';
      continue;
    }

    if (booking.bookingStatus !== 'CONFIRMED') continue;

    // Weight-based aggregation: FULL_BHAVAN = 1.0, HALF_BHAVAN / HALL_ONLY = 0.5
    const addedWeight = booking.bookingType === 'FULL_BHAVAN' ? 1.0 : 0.5;
    const newWeight = (weightMap[key] ?? 0) + addedWeight;
    weightMap[key] = newWeight;

    if (newWeight >= 1.0) {
      result[key] = 'FULLY_BOOKED';
    } else {
      result[key] = 'PARTIALLY_BOOKED';
    }
  }

  return result;
}

/**
 * Builds a per-date map of public-safe booking details for the client.
 * Sensitive fields are stripped at the server boundary — only
 * PublicBookingInfo fields are included.
 */
export function buildPublicBookingsMap(
  bookings: BhavanBooking[],
): Record<string, PublicBookingInfo[]> {
  const { minDate, maxDate } = getBookingDateBoundaries();
  const result: Record<string, PublicBookingInfo[]> = {};

  for (const booking of bookings) {
    // bookedFor is the actual reservation date; fall back to bookingDate for
    // legacy rows that pre-date the BookedFor column.
    const effectiveDate = booking.bookedFor ?? booking.bookingDate;
    const date = startOfDay(new Date(effectiveDate));
    if (date < minDate || date > maxDate) continue;

    const key = effectiveDate;
    const publicInfo: PublicBookingInfo = {
      bookingDate: booking.bookingDate,
      gaonName: booking.gaonName,
      eventName: booking.eventName,
      bookingType: booking.bookingType,
      bookingStatus: booking.bookingStatus,
    };

    result[key] = [...(result[key] ?? []), publicInfo];
  }

  return result;
}
