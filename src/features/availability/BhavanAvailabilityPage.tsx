"use client"

import { useEffect, useMemo, useState } from "react"
import { availabilityRepository } from "@/data/availability"
import {
  AvailabilityStatus,
  BhavanType,
  type AvailabilityRecord,
} from "@/types/availability"
import { cn } from "@/lib/utils"

interface StatusPresentation {
  indicator: string
  label: string
}

const STATUS_META: Record<AvailabilityStatus, StatusPresentation> = {
  [AvailabilityStatus.AVAILABLE]: {
    indicator: "✅",
    label: "उपलब्ध",
  },
  [AvailabilityStatus.PHONE_RESERVATION]: {
    indicator: "⚠️",
    label: "फोन द्वारा आरक्षण",
  },
  [AvailabilityStatus.HALF_BHAVAN]: {
    indicator: "x̄",
    label: "आधा भवन",
  },
  [AvailabilityStatus.FULL_BHAVAN]: {
    indicator: "❌",
    label: "पूर्ण भवन",
  },
  [AvailabilityStatus.SOCIETY_EVENT]: {
    indicator: "卐",
    label: "समाज कार्यक्रम",
  },
  [AvailabilityStatus.PARTIALLY_AVAILABLE]: {
    indicator: "x̄",
    label: "आधा भवन",
  },
  [AvailabilityStatus.KITCHEN_COORDINATION_REQUIRED]: {
    indicator: "⚠️",
    label: "फोन द्वारा आरक्षण",
  },
  [AvailabilityStatus.CONFLICT_REVIEW_REQUIRED]: {
    indicator: "⚠️",
    label: "फोन द्वारा आरक्षण",
  },
  [AvailabilityStatus.FULLY_OCCUPIED]: {
    indicator: "❌",
    label: "पूर्ण भवन",
  },
}

const LEGEND_ITEMS: Array<{ indicator: string; label: string }> = [
  { indicator: "✅", label: "उपलब्ध" },
  { indicator: "⚠️", label: "फोन द्वारा आरक्षण" },
  { indicator: "x̄", label: "आधा भवन" },
  { indicator: "❌", label: "पूर्ण भवन" },
  { indicator: "卐", label: "समाज कार्यक्रम" },
]

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAY_LABELS = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
const BHAVAN_OPTIONS: Array<{ type: BhavanType; label: string }> = [
  { type: BhavanType.MAIN_BHAVAN, label: "मुख्य धर्मशाला" },
  { type: BhavanType.DEVPURI_BHAVAN, label: "देवपुरी धर्मशाला" },
  { type: BhavanType.GOVIND_COLONY_BHAVAN, label: "गोविंद कॉलोनी धर्मशाला" },
]

function toMonthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`
}

function toIsoDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function getDefaultRecord(date: string, bhavanType: BhavanType): AvailabilityRecord {
  return {
    id: `default-${date}`,
    bhavanType,
    date,
    status: AvailabilityStatus.AVAILABLE,
    eventName: "कोई कार्यक्रम नहीं",
    remarks: "इस तिथि पर भवन उपलब्ध है।",
  }
}

export function BhavanAvailabilityPage() {
  const [currentYear] = useState(() => new Date().getFullYear())
  const [selectedBhavanType, setSelectedBhavanType] = useState<BhavanType>(BhavanType.MAIN_BHAVAN)
  const [selectedMonthKey, setSelectedMonthKey] = useState(() => {
    const currentDate = new Date()
    return toMonthKey(currentDate.getFullYear(), currentDate.getMonth())
  })
  const [monthRecords, setMonthRecords] = useState<AvailabilityRecord[]>([])
  const [selectedDateByMonth, setSelectedDateByMonth] = useState<Record<string, string>>({})

  const [selectedYear, selectedMonthIndex] = useMemo(() => {
    const [year, month] = selectedMonthKey.split("-").map(Number)
    return [year, month - 1]
  }, [selectedMonthKey])

  const monthOptions = useMemo(() => {
    const years = [currentYear, currentYear + 1]
    return years.flatMap((year) =>
      MONTH_LABELS.map((monthLabel, monthIndex) => ({
        value: toMonthKey(year, monthIndex),
        label: `${monthLabel} ${year}`,
      }))
    )
  }, [currentYear])

  useEffect(() => {
    let isMounted = true

    availabilityRepository
      .getMonthAvailability({
        bhavanType: selectedBhavanType,
        year: selectedYear,
        month: selectedMonthIndex + 1,
      })
      .then((records) => {
        if (!isMounted) {
          return
        }
        setMonthRecords(records)
      })

    return () => {
      isMounted = false
    }
  }, [selectedBhavanType, selectedYear, selectedMonthIndex])

  const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate()
  const firstWeekday = new Date(selectedYear, selectedMonthIndex, 1).getDay()

  const recordMap = useMemo(() => {
    const map = new Map<string, AvailabilityRecord>()
    monthRecords.forEach((record) => {
      map.set(record.date, record)
    })
    return map
  }, [monthRecords])

  const calendarCells = useMemo(() => {
    const placeholders = Array.from({ length: firstWeekday }, (_, idx) => ({
      key: `empty-${idx}`,
      day: null as number | null,
    }))
    const dayCells = Array.from({ length: daysInMonth }, (_, idx) => ({
      key: `day-${idx + 1}`,
      day: idx + 1,
    }))
    return [...placeholders, ...dayCells]
  }, [daysInMonth, firstWeekday])

  const selectedDate = useMemo(() => {
    const selectedFromState = selectedDateByMonth[selectedMonthKey]
    if (selectedFromState) {
      return selectedFromState
    }
    const today = new Date()
    const initialDay =
      today.getFullYear() === selectedYear && today.getMonth() === selectedMonthIndex
        ? today.getDate()
        : 1
    return toIsoDate(selectedYear, selectedMonthIndex, initialDay)
  }, [selectedDateByMonth, selectedMonthKey, selectedYear, selectedMonthIndex])

  const selectedRecord = useMemo(() => {
    if (!selectedDate) {
      return null
    }
    return recordMap.get(selectedDate) ?? getDefaultRecord(selectedDate, selectedBhavanType)
  }, [recordMap, selectedDate, selectedBhavanType])

  const selectedRecordMeta = selectedRecord ? STATUS_META[selectedRecord.status] : null
  const selectedBhavanLabel = useMemo(
    () => BHAVAN_OPTIONS.find((option) => option.type === selectedBhavanType)?.label ?? "मुख्य धर्मशाला",
    [selectedBhavanType]
  )

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-6 shadow-[0_10px_30px_rgba(60,42,33,0.10)] sm:p-8">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">भवन उपलब्धता</h1>
          <p className="mt-3 text-base font-medium text-foreground sm:text-lg">
            श्री पालीवाल ब्राह्मण समाज पंचायत 44 श्रेणी ( रजि. ), इंदौर
          </p>
          <p className="mt-2 text-sm text-primary">
            पंजीयन क्रमांक : <span className="font-semibold">03/27/03/08161/31-12-04</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-secondary/70 bg-[#FFF7E8] p-4 shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
            <h2 className="text-lg font-bold text-primary">धर्मशाला चुनें</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BHAVAN_OPTIONS.map((option) => {
                const isSelected = option.type === selectedBhavanType
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setSelectedBhavanType(option.type)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm font-semibold transition-colors sm:text-base",
                      isSelected
                        ? "border-primary bg-[#FFF7E8] text-primary"
                        : "border-border bg-[#FFFDF7] text-foreground hover:bg-[#F7EAD3]"
                    )}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-secondary/70 bg-[#FFF7E8] p-4 shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
            <h2 className="text-lg font-bold text-primary">स्थिति संकेतक</h2>
            <ul className="mt-3 grid gap-2 text-sm text-foreground sm:grid-cols-2 lg:grid-cols-5">
              {LEGEND_ITEMS.map((item) => (
                <li
                  key={`${item.indicator}-${item.label}`}
                  className="rounded-lg border border-border/70 bg-[#FFFDF7] px-3 py-2 font-medium"
                >
                  {item.indicator} {item.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-primary">मासिक उपलब्धता कैलेंडर</h2>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <span>माह चुनें:</span>
              <select
                value={selectedMonthKey}
                onChange={(event) => setSelectedMonthKey(event.target.value)}
                className="rounded-md border border-border bg-[#FFFDF7] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="माह चुनें"
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-xl border border-border bg-[#FFFDF7] p-4 shadow-[0_6px_20px_rgba(60,42,33,0.07)] sm:p-5">
            <div className="mb-4 grid grid-cols-7 gap-2">
              {WEEKDAY_LABELS.map((weekday) => (
                <div
                  key={weekday}
                  className="rounded-md bg-[#F2E6CF] px-2 py-2 text-center text-xs font-semibold text-primary sm:text-sm"
                >
                  {weekday}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell) => {
                if (!cell.day) {
                  return <div key={cell.key} className="h-20 rounded-md bg-transparent sm:h-24" />
                }

                const date = toIsoDate(selectedYear, selectedMonthIndex, cell.day)
                const record = recordMap.get(date) ?? getDefaultRecord(date, selectedBhavanType)
                const statusMeta = STATUS_META[record.status]
                const isSelected = selectedDate === date

                return (
                  <button
                    type="button"
                    key={cell.key}
                    onClick={() =>
                      setSelectedDateByMonth((prev) => ({
                        ...prev,
                        [selectedMonthKey]: date,
                      }))
                    }
                    className={cn(
                      "flex h-20 flex-col items-center justify-center rounded-md border text-center transition-colors sm:h-24",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-[#FFFAF0] hover:bg-[#F7EAD3]"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground sm:text-base">{cell.day}</span>
                    <span className="mt-1 text-xl leading-none sm:text-2xl">{statusMeta.indicator}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedRecord && selectedRecordMeta ? (
            <div className="rounded-xl border border-secondary/70 bg-[#FFF7E8] p-5 shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
              <h3 className="text-xl font-bold text-primary">तिथि विवरण</h3>
              <p className="mt-3 text-base font-semibold text-foreground">
                {new Date(selectedRecord.date).toLocaleDateString("hi-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-semibold">धर्मशाला:</span> {selectedBhavanLabel}
              </p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-semibold">स्थिति:</span> {selectedRecordMeta.indicator}{" "}
                {selectedRecordMeta.label}
              </p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-semibold">कार्यक्रम:</span> {selectedRecord.eventName}
              </p>
              <p className="mt-2 text-sm text-foreground">
                <span className="font-semibold">टिप्पणी:</span> {selectedRecord.remarks}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
