import { startOfDay, addDays, addMonths, endOfMonth } from 'date-fns';

export interface BhavanBooking {
  bookingDate: string;
  membershipNumber: number;
  applicantName: string;
  gaonName: string;
  mobileNumber: string;
  eventName: string;
  foodRequired: string;
  resourceType: 'FULL_BHAVAN' | 'HALF_BHAVAN' | 'HALL_ONLY';
  bookingStatus: 'CONFIRMED' | 'SOCIETY_EVENT' | 'MAINTENANCE';
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  remarks: string;
}

export type UIStatus =
  | 'AVAILABLE'
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
    const date = startOfDay(new Date(booking.bookingDate));

    if (date < minDate || date > maxDate) continue;

    const key = booking.bookingDate;
    const current = result[key] ?? 'AVAILABLE';

    // SOCIETY_EVENT locks the entire day — nothing can override it
    if (current === 'SOCIETY_EVENT') continue;

    if (booking.bookingStatus === 'SOCIETY_EVENT') {
      result[key] = 'SOCIETY_EVENT';
      continue;
    }

    // FULLY_BOOKED is a terminal state (below SOCIETY_EVENT)
    if (current === 'FULLY_BOOKED') continue;

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
