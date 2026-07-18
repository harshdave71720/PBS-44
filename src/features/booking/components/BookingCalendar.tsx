'use client';

import React from 'react';
import { format } from 'date-fns';
import type { DayButton } from 'react-day-picker';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import {
  UIStatus,
  getBookingDateBoundaries,
} from '@/features/booking/utils/availability';

interface BookingCalendarProps {
  statusMap: Record<string, UIStatus>;
}

function DayStatusIndicator({ status }: { status: UIStatus | undefined }) {
  if (status === 'FULLY_BOOKED') return <span>❌</span>;
  if (status === 'PARTIALLY_AVAILABLE') return <span>⚠️</span>;
  if (status === 'SOCIETY_EVENT') return <span>卐</span>;
  // AVAILABLE or absent — default
  return <span className="text-[10px] text-green-600 mt-1">उपलब्ध</span>;
}

export function BookingCalendar({ statusMap }: BookingCalendarProps) {
  const { minDate, maxDate } = getBookingDateBoundaries();

  return (
    <div>
      <h2 className="text-maroon-800 font-bold text-xl mb-4">भवन उपलब्धता</h2>
      <Calendar
        mode="single"
        disabled={[{ before: minDate }, { after: maxDate }]}
        components={{
          // react-day-picker v10 uses DayButton (not DayContent from v8).
          // We wrap CalendarDayButton so all built-in styles are preserved.
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
    </div>
  );
}
