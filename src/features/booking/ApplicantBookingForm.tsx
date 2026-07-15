"use client"

import { useMemo, useState, type FormEvent } from "react"

import { getAllEvents, getEventByCode } from "@/lib/events-master"
import { getAreaByCode } from "@/lib/areas-master"
import { checkAvailability } from "@/lib/availability-engine"
import {
  AreaCode,
  AreaCodeLabel,
  BookingStatus,
  type IBooking,
  MemberType,
  TimeSlot,
  EventType,
} from "@/types/booking"
import type { BookingForAvailability } from "@/types/availability"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  applicantBookingFormSchema,
  type ApplicantBookingFormValues,
} from "@/features/booking/schema"

type FieldErrors = Partial<Record<keyof ApplicantBookingFormValues, string>>

interface BookingDraft {
  booking: IBooking
  availabilityStatus: string
  suggestedAreas: string[]
}

const DEFAULT_FORM_VALUES: ApplicantBookingFormValues = {
  applicantName: "",
  mobile: "",
  memberType: "member",
  eventCode: "",
  eventDate: "",
  timeSlot: "MORNING",
  foodRequired: "no",
  expectedGuests: 1,
  remarks: "",
}

function mapEventCodeToDomainEventType(eventCode: string): EventType {
  switch (eventCode) {
    case "marriage":
      return EventType.WEDDING
    case "birthday_party":
      return EventType.BIRTHDAY
    case "other":
      return EventType.OTHER
    case "sooraj_pooja":
    case "uttara_kary":
    case "barsi":
    case "shraddha_paksh":
      return EventType.RELIGIOUS_CEREMONY
    case "mahila_sangeet":
      return EventType.COMMUNITY_EVENT
    default:
      return EventType.OTHER
  }
}

function mapEventAreaToDomainArea(area: string): AreaCode | null {
  switch (area) {
    case "MAIN_HALL":
      return AreaCode.MAIN_HALL
    case "DRAWING_ROOM":
      return AreaCode.DRAWING_ROOM
    case "CONFERENCE_ROOM":
      return AreaCode.CONFERENCE_ROOM
    case "TERRACE":
      return AreaCode.TERRACE
    case "GARDEN":
      return AreaCode.GARDEN
    case "KITCHEN_AREA":
      return AreaCode.KITCHEN_AREA
    case "PARKING":
      return AreaCode.PARKING
    default:
      return null
  }
}

function mapEngineAreaToDomainArea(area: string): AreaCode | null {
  switch (area) {
    case "GF":
      return AreaCode.MAIN_HALL
    case "SPH":
      return AreaCode.CONFERENCE_ROOM
    case "FLW":
    case "FRW":
      return AreaCode.DRAWING_ROOM
    case "RT":
      return AreaCode.TERRACE
    default:
      return null
  }
}

function mapBookingToAvailability(booking: IBooking): BookingForAvailability {
  const statusMap: BookingForAvailability["status"] =
    booking.status === BookingStatus.APPROVED
      ? "approved"
      : booking.status === BookingStatus.CONFIRMED
        ? "confirmed"
        : booking.status === BookingStatus.REJECTED
          ? "rejected"
          : booking.status === BookingStatus.CANCELLED
            ? "cancelled"
            : "pending"

  return {
    id: booking.id,
    eventType: booking.eventType,
    date: booking.date,
    timeSlot: booking.timeSlot.toUpperCase(),
    requestedArea: booking.requestedArea.map((area) => area.toUpperCase()),
    allocatedArea: booking.allocatedArea?.map((area) => area.toUpperCase()),
    foodRequired: booking.foodRequired,
    kitchenRequired: booking.kitchenRequired,
    status: statusMap,
  }
}

function buildBookingId(timestamp: Date): string {
  const year = timestamp.getFullYear()
  const serial = timestamp.getTime().toString().slice(-6)
  return `BOOK-${year}-${serial}`
}

export function ApplicantBookingForm() {
  const events = useMemo(() => getAllEvents(), [])
  const [formValues, setFormValues] = useState<ApplicantBookingFormValues>(
    DEFAULT_FORM_VALUES
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [draft, setDraft] = useState<BookingDraft | null>(null)
  const [createdBooking, setCreatedBooking] = useState<IBooking | null>(null)
  const [localBookings, setLocalBookings] = useState<IBooking[]>([])

  const handleFieldChange = <K extends keyof ApplicantBookingFormValues>(
    key: K,
    value: ApplicantBookingFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreatedBooking(null)

    const parsed = applicantBookingFormSchema.safeParse(formValues)
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === "string" && !fieldErrors[key as keyof FieldErrors]) {
          fieldErrors[key as keyof FieldErrors] = issue.message
        }
      }
      setErrors(fieldErrors)
      setDraft(null)
      return
    }

    const availability = checkAvailability({
      eventType: parsed.data.eventCode,
      date: new Date(parsed.data.eventDate),
      timeSlot: parsed.data.timeSlot,
      foodRequired: parsed.data.foodRequired === "yes",
      existingBookings: localBookings.map(mapBookingToAvailability),
    })

    const selectedEvent = getEventByCode(parsed.data.eventCode)
    const suggestedAreas = (availability.suggestedAreas ?? [])
      .map((areaCode) => getAreaByCode(areaCode)?.displayNameHindi ?? areaCode)
      .filter(Boolean)

    const requestedAreasFromAvailability = (availability.suggestedAreas ?? [])
      .map(mapEngineAreaToDomainArea)
      .filter((value): value is AreaCode => value !== null)

    const defaultEventArea = mapEventAreaToDomainArea(selectedEvent?.defaultArea ?? "")
    const fallbackEventArea =
      selectedEvent?.allowedAreas
        .map(mapEventAreaToDomainArea)
        .find((value): value is AreaCode => value !== null) ?? AreaCode.MAIN_HALL

    const requestedArea =
      requestedAreasFromAvailability.length > 0
        ? requestedAreasFromAvailability
        : [defaultEventArea ?? fallbackEventArea]

    const now = new Date()
    const booking: IBooking = {
      id: crypto.randomUUID(),
      bookingId: buildBookingId(now),
      applicantName: parsed.data.applicantName.trim(),
      mobile: parsed.data.mobile.trim(),
      memberType:
        parsed.data.memberType === "member"
          ? MemberType.OWNER
          : MemberType.NON_MEMBER,
      eventType: mapEventCodeToDomainEventType(parsed.data.eventCode),
      eventName:
        selectedEvent?.nameHindi ??
        selectedEvent?.nameEnglish ??
        parsed.data.eventCode,
      noOfGuests: parsed.data.expectedGuests,
      date: new Date(parsed.data.eventDate),
      timeSlot:
        parsed.data.timeSlot === "MORNING" ? TimeSlot.MORNING : TimeSlot.EVENING,
      requestedArea,
      foodRequired: parsed.data.foodRequired === "yes",
      kitchenRequired: parsed.data.foodRequired === "yes",
      remarks: parsed.data.remarks?.trim() || undefined,
      notes: `availability_status:${availability.status}`,
      status: BookingStatus.REQUEST_RECEIVED,
      createdAt: now,
      updatedAt: now,
    }

    setErrors({})
    setDraft({
      booking,
      availabilityStatus: availability.status,
      suggestedAreas,
    })
  }

  const handleConfirm = () => {
    if (!draft) {
      return
    }
    setCreatedBooking(draft.booking)
    setLocalBookings((prev) => [...prev, draft.booking])
    setDraft(null)
    setFormValues(DEFAULT_FORM_VALUES)
    setErrors({})
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>आवेदक बुकिंग फॉर्म</CardTitle>
          <CardDescription>
            सभी जानकारी भरें। सबमिट के बाद पुष्टि करके स्थानीय बुकिंग ऑब्जेक्ट बनाया जाएगा।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="applicantName">आवेदक का नाम</label>
              <Input
                id="applicantName"
                value={formValues.applicantName}
                onChange={(event) =>
                  handleFieldChange("applicantName", event.target.value)
                }
              />
              {errors.applicantName ? (
                <p className="text-sm text-destructive">{errors.applicantName}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="mobile">मोबाइल नंबर</label>
              <Input
                id="mobile"
                value={formValues.mobile}
                onChange={(event) => handleFieldChange("mobile", event.target.value)}
              />
              {errors.mobile ? (
                <p className="text-sm text-destructive">{errors.mobile}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label>सदस्य प्रकार</label>
              <Select
                value={formValues.memberType}
                onValueChange={(value) =>
                  handleFieldChange("memberType", (value ?? "member") as ApplicantBookingFormValues["memberType"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="सदस्य प्रकार चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">सदस्य</SelectItem>
                  <SelectItem value="non_member">गैर सदस्य</SelectItem>
                </SelectContent>
              </Select>
              {errors.memberType ? (
                <p className="text-sm text-destructive">{errors.memberType}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label>कार्यक्रम प्रकार</label>
              <Select
                value={formValues.eventCode}
                onValueChange={(value) => handleFieldChange("eventCode", value ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="कार्यक्रम प्रकार चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.code}>
                      {event.nameHindi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventCode ? (
                <p className="text-sm text-destructive">{errors.eventCode}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="eventDate">तिथि</label>
              <Input
                id="eventDate"
                type="date"
                value={formValues.eventDate}
                onChange={(event) =>
                  handleFieldChange("eventDate", event.target.value)
                }
              />
              {errors.eventDate ? (
                <p className="text-sm text-destructive">{errors.eventDate}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label>समय स्लॉट</label>
              <Select
                value={formValues.timeSlot}
                onValueChange={(value) =>
                  handleFieldChange(
                    "timeSlot",
                    (value ?? "MORNING") as ApplicantBookingFormValues["timeSlot"]
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="समय स्लॉट चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING">सुबह</SelectItem>
                  <SelectItem value="EVENING">शाम</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeSlot ? (
                <p className="text-sm text-destructive">{errors.timeSlot}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label>भोजन आवश्यक</label>
              <Select
                value={formValues.foodRequired}
                onValueChange={(value) =>
                  handleFieldChange(
                    "foodRequired",
                    (value ?? "no") as ApplicantBookingFormValues["foodRequired"]
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="भोजन विकल्प चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">हाँ</SelectItem>
                  <SelectItem value="no">नहीं</SelectItem>
                </SelectContent>
              </Select>
              {errors.foodRequired ? (
                <p className="text-sm text-destructive">{errors.foodRequired}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="expectedGuests">अपेक्षित अतिथि</label>
              <Input
                id="expectedGuests"
                type="number"
                min={1}
                value={formValues.expectedGuests}
                onChange={(event) =>
                  handleFieldChange(
                    "expectedGuests",
                    Number(event.target.value || 0)
                  )
                }
              />
              {errors.expectedGuests ? (
                <p className="text-sm text-destructive">{errors.expectedGuests}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="remarks">टिप्पणी</label>
              <Textarea
                id="remarks"
                value={formValues.remarks}
                onChange={(event) => handleFieldChange("remarks", event.target.value)}
              />
              {errors.remarks ? (
                <p className="text-sm text-destructive">{errors.remarks}</p>
              ) : null}
            </div>

            <Button type="submit">सारांश देखें</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>बुकिंग सारांश</CardTitle>
            <CardDescription>
              सत्यापन के बाद यहाँ बुकिंग का सारांश दिखेगा।
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {draft ? (
              <>
                <p>
                  <strong>बुकिंग आईडी:</strong> {draft.booking.bookingId}
                </p>
                <p>
                  <strong>आवेदक:</strong> {draft.booking.applicantName}
                </p>
                <p>
                  <strong>मोबाइल:</strong> {draft.booking.mobile}
                </p>
                <p>
                  <strong>कार्यक्रम:</strong> {draft.booking.eventName}
                </p>
                <p>
                  <strong>तिथि:</strong> {draft.booking.date.toLocaleDateString("hi-IN")}
                </p>
                <p>
                  <strong>समय स्लॉट:</strong>{" "}
                  {draft.booking.timeSlot === TimeSlot.MORNING ? "सुबह" : "शाम"}
                </p>
                <p>
                  <strong>भोजन आवश्यक:</strong>{" "}
                  {draft.booking.foodRequired ? "हाँ" : "नहीं"}
                </p>
                <p>
                  <strong>अपेक्षित अतिथि:</strong> {draft.booking.noOfGuests}
                </p>
                <p>
                  <strong>उपलब्धता स्थिति:</strong> {draft.availabilityStatus}
                </p>
                <p>
                  <strong>क्षेत्र सुझाव:</strong>{" "}
                  {draft.suggestedAreas.length > 0
                    ? draft.suggestedAreas.join(", ")
                    : "कोई विशिष्ट सुझाव नहीं"}
                </p>
                <p>
                  <strong>रिक्वेस्ट स्थिति:</strong> {draft.booking.status}
                </p>
                <p>
                  <strong>अनुरोधित क्षेत्र:</strong>{" "}
                  {draft.booking.requestedArea
                    .map((area) => AreaCodeLabel[area])
                    .join(", ")}
                </p>
                <Button onClick={handleConfirm}>पुष्टि करें और ऑब्जेक्ट बनाएं</Button>
              </>
            ) : (
              <p className="text-muted-foreground">अभी कोई सारांश उपलब्ध नहीं है।</p>
            )}
          </CardContent>
        </Card>

        {createdBooking ? (
          <Card>
            <CardHeader>
              <CardTitle>स्थानीय बुकिंग ऑब्जेक्ट तैयार</CardTitle>
              <CardDescription>
                डेटा सेव नहीं किया गया है। यह केवल लोकल ऑब्जेक्ट है।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(createdBooking, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
