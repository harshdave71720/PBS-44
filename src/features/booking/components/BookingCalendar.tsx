'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addMonths, format, parseISO, startOfMonth } from 'date-fns';
import type { DayButton } from 'react-day-picker';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UIStatus,
  PublicBookingInfo,
  getBookingDateBoundaries,
} from '@/features/booking/utils/availability';

const RESOURCE_TYPE_LABELS: Record<PublicBookingInfo['resourceType'], string> = {
  FULL_BHAVAN: 'Full Bhavan (पूर्ण भवन)',
  HALF_BHAVAN: 'Half Bhavan (अर्ध भवन)',
  HALL_ONLY: 'Hall Only (केवल हॉल)',
};

const BOOKING_STATUS_LABELS: Record<PublicBookingInfo['bookingStatus'], string> = {
  CONFIRMED: 'Confirmed',
  SOCIETY_EVENT: 'Society Event',
  MAINTENANCE: 'Maintenance',
};

interface BookingCalendarProps {
  statusMap: Record<string, UIStatus>;
  publicBookingsMap: Record<string, PublicBookingInfo[]>;
  bhavanLabel: string;
}

function DayStatusIndicator({ status }: { status: UIStatus | undefined }) {
  if (status === 'FULLY_BOOKED') return <span>❌</span>;
  if (status === 'PARTIALLY_AVAILABLE') return <span>⚠️</span>;
  if (status === 'SOCIETY_EVENT') return <span>卐</span>;
  return <span className="mt-1 text-[10px] text-green-600">उपलब्ध</span>;
}

function BookingDetailPanel({
  date,
  bookings,
  isAvailable,
  bhavanLabel,
}: {
  date: string;
  bookings: PublicBookingInfo[];
  isAvailable: boolean;
  bhavanLabel: string;
}) {
  const displayDate = format(parseISO(date), 'd MMMM yyyy');

  return (
    <div className="flex flex-col items-start rounded-lg border border-border bg-[#FFFDF7] p-3 text-left text-sm">
      <div className="mb-3">
        <p className="font-semibold text-primary">
          {displayDate} — {bhavanLabel} बुकिंग विवरण
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="space-y-3">
          <p className="text-left text-muted-foreground">
            इस दिन कोई बुकिंग नहीं है। यह तारीख उपलब्ध है।
          </p>
          {isAvailable ? (
            <Link
              href={`/booking-form?selectedDate=${encodeURIComponent(date)}`}
              className="inline-flex rounded-md bg-[#dcd0a6] px-4 py-2 text-sm font-semibold text-[#7A1C1C] transition-colors hover:bg-[#d1c18f]"
            >
              आवेदन पत्र भरें →
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="grid w-full gap-1.5 text-left">
          {bookings.map((booking, index) => (
            <div key={`${booking.bookingDate}-${index}`} className="space-y-1 text-left">
              <p>
                <strong>Venue:</strong>{' '}
                {RESOURCE_TYPE_LABELS[booking.resourceType] ?? booking.resourceType}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {BOOKING_STATUS_LABELS[booking.bookingStatus] ?? booking.bookingStatus}
              </p>
              {booking.eventName && (
                <p>
                  <strong>Event:</strong> {booking.eventName}
                </p>
              )}
              {booking.gaonName && (
                <p>
                  <strong>Village:</strong> {booking.gaonName}
                </p>
              )}
              {booking.foodRequired && (
                <p>
                  <strong>Food:</strong> {booking.foodRequired}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BookingCalendar({ statusMap, publicBookingsMap, bhavanLabel }: BookingCalendarProps) {
  const router = useRouter();
  const { minDate, maxDate } = getBookingDateBoundaries();
  const currentMonth = startOfMonth(new Date());
  const lastNavigableMonth = startOfMonth(addMonths(currentMonth, 11));
  const [currentViewMonth, setCurrentViewMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10_000);

    return () => clearInterval(interval);
  }, [router]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const handleMonthChange = (newMonth: Date) => {
    const normalizedMonth = startOfMonth(newMonth);

    if (normalizedMonth < currentMonth || normalizedMonth > lastNavigableMonth) {
      return;
    }

    setCurrentViewMonth(normalizedMonth);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="w-full lg:col-span-2">
        <CardHeader>
          <CardTitle>{bhavanLabel}</CardTitle>
          <CardDescription>
            तारीख पर क्लिक करें — उस दिन की बुकिंग जानकारी दाईं तरफ दिखेगी।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            month={currentViewMonth}
            onMonthChange={handleMonthChange}
            startMonth={currentMonth}
            endMonth={lastNavigableMonth}
            disabled={[{ before: minDate }, { after: maxDate }]}
            onSelect={handleSelect}
            components={{
              DayButton: ({
                children,
                day,
                modifiers,
                ...props
              }: React.ComponentProps<typeof DayButton>) => {
                const key = format(day.date, 'yyyy-MM-dd');

                return (
                  <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                    {children}
                    <DayStatusIndicator status={statusMap[key]} />
                  </CalendarDayButton>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 self-start lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>बुकिंग विवरण</CardTitle>
            <CardDescription>
              {selectedDate
                ? 'चयनित तारीख की बुकिंग जानकारी नीचे दिखाई गई है।'
                : 'कैलेंडर से कोई तारीख चुनें।'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {selectedDate !== null ? (
              <BookingDetailPanel
                date={selectedDate}
                bookings={publicBookingsMap[selectedDate] ?? []}
                isAvailable={(statusMap[selectedDate] ?? 'AVAILABLE') === 'AVAILABLE'}
                bhavanLabel={bhavanLabel}
              />
            ) : (
              <p className="rounded-lg border border-border bg-[#FFFDF7] px-3 py-3 text-center text-muted-foreground">
                कोई तारीख नहीं चुनी गई।
              </p>
            )}

            <div className="rounded-lg border border-border bg-[#FFFDF7] p-3">
              <h4 className="mb-2 text-sm font-semibold text-primary">स्थिति संकेत (Legend)</h4>
              <div className="grid gap-1.5 text-center">
                <p>
                  <span className="mr-1">❌</span>
                  Fully Booked
                </p>
                <p>
                  <span className="mr-1">⚠️</span>
                  Partially Booked (Half-Bhavan)
                </p>
                <p>
                  <span className="mr-1 text-[10px] font-medium text-green-600">उपलब्ध</span>
                  Available for Booking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>महत्वपूर्ण जानकारी</CardTitle>
            <CardDescription>बुकिंग से संबंधित मुख्य नियम।</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              <li>All bookings are subject to final committee approval.</li>
              <li>Full payment is required to confirm a &lsquo;Fully Booked&rsquo; status.</li>
              <li>
                For any modifications to your booking, please contact the office during business
                hours (10 AM &ndash; 6 PM).
              </li>
              <li>केवल वर्तमान महीने से अगले 11 महीने तक की बुकिंग ही संभव है।</li>
              <li>पिछली तारीखों का चयन नहीं किया जा सकता है।</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
