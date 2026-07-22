import type { ApplicantBookingFormValues } from "@/features/booking/schema"

type EventName = Exclude<ApplicantBookingFormValues["eventName"], "">

export const EVENT_LABELS: Record<EventName, string> = {
  manglik_karyakram: "मांगलिक कार्यक्रम",
  shok_uttarkaryakram: "शोक / उत्तरकार्य कार्यक्रम",
  dharmik_karyakram: "धार्मिक कार्यक्रम",
  samaj_karyakram: "समाज कार्यक्रम",
  anya: "अन्य",
}

export const EVENT_NAME_MAP: Record<EventName, string> = {
  manglik_karyakram: "Manglik Event",
  shok_uttarkaryakram: "Shok / Uttarkary Event",
  dharmik_karyakram: "Religious Event",
  samaj_karyakram: "Social Event",
  anya: "Other",
}

export const SHEET_TO_EVENT_MAP: Record<string, EventName> = {
  "Manglik Event": "manglik_karyakram",
  "Shok / Uttarkary Event": "shok_uttarkaryakram",
  "Religious Event": "dharmik_karyakram",
  "Social Event": "samaj_karyakram",
  "Other": "anya",
}

export const BOOKING_TYPE_LABELS: Record<
  Exclude<ApplicantBookingFormValues["bookingType"], "">,
  string
> = {
  FULL_BHAVAN: "पूरा भवन",
  HALF_BHAVAN: "आधा भवन",
  HALL_ONLY: "व्यक्तिगत हॉल",
}

export function getEventLabel(eventName: ApplicantBookingFormValues["eventName"]): string {
  return eventName ? EVENT_LABELS[eventName] : "चयनित नहीं"
}

export function getSheetEventName(eventName: ApplicantBookingFormValues["eventName"]): string {
  return eventName ? EVENT_NAME_MAP[eventName] : "Other"
}

export function getBookingTypeLabel(bookingType: ApplicantBookingFormValues["bookingType"]): string {
  return bookingType ? BOOKING_TYPE_LABELS[bookingType] : "चयनित नहीं"
}

export function getTimeSlotDisplay(eventName: ApplicantBookingFormValues["eventName"]): string {
  return eventName === "manglik_karyakram" || eventName === "samaj_karyakram" ? "पूरा दिन" : "सुबह / शाम"
}
