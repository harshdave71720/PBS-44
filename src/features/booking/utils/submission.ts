import type { ApplicantBookingFormValues } from "@/features/booking/schema"
import type { BhavanBooking } from "@/features/booking/utils/availability"

export const EVENT_LABELS: Record<
  Exclude<ApplicantBookingFormValues["eventCode"], "">,
  string
> = {
  sooraj_pooja: "सूरज पूजा",
  vivah: "विवाह",
  sagai: "सगाई",
  dharmik_karyakram: "धार्मिक कार्यक्रम",
  samaj_karyakram: "समाज कार्यक्रम",
  anya: "अन्य",
}

const SHEET_EVENT_NAMES: Record<
  Exclude<ApplicantBookingFormValues["eventCode"], "">,
  string
> = {
  sooraj_pooja: "Sooraj Pooja",
  vivah: "Vivah",
  sagai: "Sagai",
  dharmik_karyakram: "Religious Event",
  samaj_karyakram: "Social Event",
  anya: "Other",
}

export function getEventLabel(
  eventCode: ApplicantBookingFormValues["eventCode"]
): string {
  if (!eventCode) {
    return "चयनित नहीं"
  }

  return EVENT_LABELS[eventCode]
}

export function getSheetEventName(
  eventCode: ApplicantBookingFormValues["eventCode"]
): string {
  if (!eventCode) {
    return "Other"
  }

  return SHEET_EVENT_NAMES[eventCode]
}

export function getResourceType(
  eventCode: ApplicantBookingFormValues["eventCode"],
  foodRequired: ApplicantBookingFormValues["foodRequired"]
): BhavanBooking["resourceType"] {
  switch (eventCode) {
    case "vivah":
    case "samaj_karyakram":
      return "FULL_BHAVAN"
    case "sooraj_pooja":
      return foodRequired === "yes" ? "HALF_BHAVAN" : "HALL_ONLY"
    default:
      return foodRequired === "yes" ? "HALF_BHAVAN" : "HALL_ONLY"
  }
}

export function getResourceRequirement(
  eventCode: ApplicantBookingFormValues["eventCode"],
  foodRequired: ApplicantBookingFormValues["foodRequired"]
): string {
  const resourceType = getResourceType(eventCode, foodRequired)

  switch (resourceType) {
    case "FULL_BHAVAN":
      return "पूर्ण भवन"
    case "HALF_BHAVAN":
      return "आधा भवन"
    case "HALL_ONLY":
      return "व्यक्तिगत हॉल"
  }
}

export function getDuration(eventCode: ApplicantBookingFormValues["eventCode"]): string {
  if (eventCode === "vivah" || eventCode === "samaj_karyakram") {
    return "पूरा दिन"
  }

  return "आधा दिन"
}

export function getTimeSlotDisplay(
  eventCode: ApplicantBookingFormValues["eventCode"]
): string {
  if (eventCode === "vivah" || eventCode === "samaj_karyakram") {
    return "पूरा दिन"
  }

  return "सुबह / शाम"
}
