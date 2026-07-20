import { startOfDay, addDays, addMonths, endOfMonth } from 'date-fns';

export interface BhavanBooking {
  bookingDate: string;
  bookedFor?: string;
  membershipNumber: number;
  applicantName: string;
  gaonName: string;
  mobileNumber: string;
  eventName: string;
  foodRequired: string;
  resourceType: 'FULL_BHAVAN' | 'HALF_BHAVAN' | 'HALL_ONLY';
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
  resourceType: BhavanBooking['resourceType'];
  bookingStatus: BhavanBooking['bookingStatus'];
  foodRequired: string;
}

export type UIStatus =
  | 'AVAILABLE'
  | 'TENTATIVE'
  | 'PARTIALLY_AVAILABLE'
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

    if (
      booking.bookingStatus === 'MAINTENANCE' ||
      booking.resourceType === 'FULL_BHAVAN'
    ) {
      result[key] = 'FULLY_BOOKED';
      continue;
    }

    if (
      booking.resourceType === 'HALF_BHAVAN' ||
      booking.resourceType === 'HALL_ONLY'
    ) {
      // A second partial booking on the same day fills the venue
      result[key] =
        current === 'PARTIALLY_AVAILABLE' ? 'FULLY_BOOKED' : 'PARTIALLY_AVAILABLE';
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
    // Destructure only the safe fields — applicantName, mobileNumber, and
    // membershipNumber are intentionally left out.
    const publicInfo: PublicBookingInfo = {
      bookingDate: booking.bookingDate,
      gaonName: booking.gaonName,
      eventName: booking.eventName,
      resourceType: booking.resourceType,
      bookingStatus: booking.bookingStatus,
      foodRequired: booking.foodRequired,
    };

    result[key] = [...(result[key] ?? []), publicInfo];
  }

  return result;
}
