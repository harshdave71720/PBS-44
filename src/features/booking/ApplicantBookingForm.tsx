"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { availabilityRepository } from "@/data/availability"
import {
  AvailabilityStatus,
  BhavanType,
  type AvailabilityRecord,
} from "@/types/availability"
import { cn } from "@/lib/utils"
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
type AvailabilityViewStatus = "not_selected" | "available" | "partial" | "unavailable"

const BHAVAN_OPTIONS: Array<{ value: BhavanType; label: string }> = [
  { value: BhavanType.MAIN_BHAVAN, label: "मुख्य धर्मशाला" },
  { value: BhavanType.DEVPURI_BHAVAN, label: "देवपुरी धर्मशाला" },
  { value: BhavanType.GOVIND_COLONY_BHAVAN, label: "गोविंद कॉलोनी धर्मशाला" },
]

const EVENT_OPTIONS: Array<{ value: ApplicantBookingFormValues["eventCode"]; label: string }> = [
  { value: "sooraj_pooja", label: "सूरज पूजा" },
  { value: "vivah", label: "विवाह" },
  { value: "sagai", label: "सगाई" },
  { value: "dharmik_karyakram", label: "धार्मिक कार्यक्रम" },
  { value: "samaj_karyakram", label: "समाज कार्यक्रम" },
  { value: "anya", label: "अन्य" },
]

const DEFAULT_FORM_VALUES: ApplicantBookingFormValues = {
  applicantName: "",
  mobile: "",
  bhavanType: BhavanType.MAIN_BHAVAN,
  memberType: "member",
  membershipNumber: "",
  eventCode: "sooraj_pooja",
  eventDate: "",
  foodRequired: "no",
  expectedGuests: 1,
  remarks: "",
}

function getResourceRequirement(
  eventType: ApplicantBookingFormValues["eventCode"],
  foodRequired: ApplicantBookingFormValues["foodRequired"]
): string {
  if (eventType === "sooraj_pooja") {
    return foodRequired === "yes" ? "आधा भवन" : "व्यक्तिगत हॉल"
  }
  if (eventType === "vivah") {
    return "पूर्ण भवन"
  }
  if (eventType === "samaj_karyakram") {
    return "सम्पूर्ण भवन"
  }
  if (eventType === "sagai") {
    return "आधा भवन"
  }
  return foodRequired === "yes" ? "आधा भवन" : "व्यक्तिगत हॉल"
}

function getDuration(eventType: ApplicantBookingFormValues["eventCode"]): string {
  if (eventType === "vivah" || eventType === "samaj_karyakram") {
    return "पूरा दिन"
  }
  return "आधा दिन"
}

function toAvailabilityViewStatus(status: AvailabilityStatus): AvailabilityViewStatus {
  if (status === AvailabilityStatus.AVAILABLE) {
    return "available"
  }
  if (
    status === AvailabilityStatus.PHONE_RESERVATION ||
    status === AvailabilityStatus.HALF_BHAVAN ||
    status === AvailabilityStatus.PARTIALLY_AVAILABLE ||
    status === AvailabilityStatus.KITCHEN_COORDINATION_REQUIRED ||
    status === AvailabilityStatus.CONFLICT_REVIEW_REQUIRED
  ) {
    return "partial"
  }
  return "unavailable"
}

function getAvailabilityDisplay(status: AvailabilityViewStatus): {
  label: string
  className: string
} {
  if (status === "available") {
    return { label: "✅ उपलब्ध", className: "text-emerald-700" }
  }
  if (status === "partial") {
    return { label: "⚠️ आंशिक उपलब्ध", className: "text-amber-700" }
  }
  if (status === "unavailable") {
    return { label: "❌ उपलब्ध नहीं", className: "text-red-700" }
  }
  return { label: "— तिथि चुनें", className: "text-muted-foreground" }
}

function getMonthKey(eventDate: string): string {
  if (eventDate) {
    const [year, month] = eventDate.split("-").map(Number)
    if (year && month) {
      return `${year}-${String(month).padStart(2, "0")}`
    }
  }
  const currentDate = new Date()
  return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
}

export function ApplicantBookingForm() {
  const [formValues, setFormValues] = useState<ApplicantBookingFormValues>(DEFAULT_FORM_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [monthRecords, setMonthRecords] = useState<AvailabilityRecord[]>([])
  const [submitMessage, setSubmitMessage] = useState<string>("")

  const selectedMonthKey = getMonthKey(formValues.eventDate)
  const [selectedYear, selectedMonth] = selectedMonthKey.split("-").map(Number)

  useEffect(() => {
    let isMounted = true

    availabilityRepository
      .getMonthAvailability({
        bhavanType: formValues.bhavanType,
        year: selectedYear,
        month: selectedMonth,
      })
      .then((records) => {
        if (isMounted) {
          setMonthRecords(records)
        }
      })

    return () => {
      isMounted = false
    }
  }, [formValues.bhavanType, selectedYear, selectedMonth])

  const selectedDateRecord = useMemo(() => {
    if (!formValues.eventDate) {
      return undefined
    }
    return monthRecords.find((record) => record.date === formValues.eventDate)
  }, [formValues.eventDate, monthRecords])

  const availabilityStatus: AvailabilityViewStatus = formValues.eventDate
    ? selectedDateRecord
      ? toAvailabilityViewStatus(selectedDateRecord.status)
      : "available"
    : "not_selected"

  const availabilityDisplay = getAvailabilityDisplay(availabilityStatus)
  const resourceRequired = getResourceRequirement(formValues.eventCode, formValues.foodRequired)
  const duration = getDuration(formValues.eventCode)
  const selectedBhavanLabel =
    BHAVAN_OPTIONS.find((option) => option.value === formValues.bhavanType)?.label ?? "मुख्य धर्मशाला"
  const selectedEventLabel =
    EVENT_OPTIONS.find((option) => option.value === formValues.eventCode)?.label ?? "—"

  const handleFieldChange = <K extends keyof ApplicantBookingFormValues>(
    key: K,
    value: ApplicantBookingFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSubmitMessage("")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
      setSubmitMessage("")
      return
    }

    setErrors({})
    setSubmitMessage("जानकारी सफलतापूर्वक सत्यापित हो गई है। समिति समीक्षा हेतु आवेदन तैयार है।")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>बुद्धिमान भवन बुकिंग सहायक</CardTitle>
          <CardDescription>
            आवश्यक जानकारी भरें। संसाधन आवश्यकता और उपलब्धता स्थिति स्वतः प्रदर्शित होगी।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="font-medium">धर्मशाला चयन</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {BHAVAN_OPTIONS.map((option) => {
                  const isSelected = formValues.bhavanType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFieldChange("bhavanType", option.value)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
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
              {errors.bhavanType ? <p className="text-sm text-destructive">{errors.bhavanType}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="applicantName">आवेदक का नाम</label>
              <Input
                id="applicantName"
                value={formValues.applicantName}
                onChange={(event) => handleFieldChange("applicantName", event.target.value)}
              />
              {errors.applicantName ? <p className="text-sm text-destructive">{errors.applicantName}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="mobile">मोबाइल नंबर</label>
              <Input
                id="mobile"
                inputMode="numeric"
                maxLength={10}
                value={formValues.mobile}
                onChange={(event) => handleFieldChange("mobile", event.target.value.replace(/\D/g, ""))}
              />
              {errors.mobile ? <p className="text-sm text-destructive">{errors.mobile}</p> : null}
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
              {errors.memberType ? <p className="text-sm text-destructive">{errors.memberType}</p> : null}
            </div>

            {formValues.memberType === "member" ? (
              <div className="grid gap-2">
                <label htmlFor="membershipNumber">सदस्यता क्रमांक</label>
                <Input
                  id="membershipNumber"
                  value={formValues.membershipNumber ?? ""}
                  onChange={(event) => handleFieldChange("membershipNumber", event.target.value)}
                />
                {errors.membershipNumber ? (
                  <p className="text-sm text-destructive">{errors.membershipNumber}</p>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-2">
              <label>कार्यक्रम प्रकार</label>
              <Select
                value={formValues.eventCode}
                onValueChange={(value) =>
                  handleFieldChange("eventCode", (value ?? "sooraj_pooja") as ApplicantBookingFormValues["eventCode"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="कार्यक्रम प्रकार चुनें" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_OPTIONS.map((eventOption) => (
                    <SelectItem key={eventOption.value} value={eventOption.value}>
                      {eventOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.eventCode ? <p className="text-sm text-destructive">{errors.eventCode}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="eventDate">तिथि</label>
              <Input
                id="eventDate"
                type="date"
                value={formValues.eventDate}
                onChange={(event) => handleFieldChange("eventDate", event.target.value)}
              />
              {errors.eventDate ? <p className="text-sm text-destructive">{errors.eventDate}</p> : null}
            </div>

            <div className="grid gap-2">
              <label>भोजन आवश्यक</label>
              <Select
                value={formValues.foodRequired}
                onValueChange={(value) =>
                  handleFieldChange("foodRequired", (value ?? "no") as ApplicantBookingFormValues["foodRequired"])
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
              {errors.foodRequired ? <p className="text-sm text-destructive">{errors.foodRequired}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="expectedGuests">अपेक्षित अतिथि</label>
              <Input
                id="expectedGuests"
                type="number"
                min={1}
                value={formValues.expectedGuests}
                onChange={(event) =>
                  handleFieldChange("expectedGuests", Number(event.target.value || 0))
                }
              />
              {errors.expectedGuests ? <p className="text-sm text-destructive">{errors.expectedGuests}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="remarks">टिप्पणी</label>
              <Textarea
                id="remarks"
                value={formValues.remarks ?? ""}
                onChange={(event) => handleFieldChange("remarks", event.target.value)}
              />
              {errors.remarks ? <p className="text-sm text-destructive">{errors.remarks}</p> : null}
            </div>

            <Button type="submit">आवेदन सत्यापित करें</Button>
            {submitMessage ? <p className="text-sm font-medium text-emerald-700">{submitMessage}</p> : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>इंटेलिजेंट सारांश</CardTitle>
            <CardDescription>फॉर्म बदलते ही सारांश स्वतः अपडेट होता है।</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>
              <strong>धर्मशाला:</strong> {selectedBhavanLabel}
            </p>
            <p>
              <strong>सदस्य प्रकार:</strong> {formValues.memberType === "member" ? "सदस्य" : "गैर सदस्य"}
            </p>
            <p>
              <strong>कार्यक्रम प्रकार:</strong> {selectedEventLabel}
            </p>
            <p>
              <strong>भोजन आवश्यक:</strong> {formValues.foodRequired === "yes" ? "हाँ" : "नहीं"}
            </p>
            <p>
              <strong>संसाधन आवश्यकता:</strong> {resourceRequired}
            </p>
            <p>
              <strong>अवधि:</strong> {duration}
            </p>
            <p className={cn("font-semibold", availabilityDisplay.className)}>
              <strong className="text-foreground">उपलब्धता स्थिति:</strong> {availabilityDisplay.label}
            </p>
            {selectedDateRecord ? (
              <>
                <p>
                  <strong>उपलब्धता रिकॉर्ड:</strong> {selectedDateRecord.eventName}
                </p>
                <p>
                  <strong>टिप्पणी:</strong> {selectedDateRecord.remarks}
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>महत्वपूर्ण निर्देश</CardTitle>
            <CardDescription>समाज की बुकिंग प्रक्रिया के मुख्य नियम।</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              <li>सूरज पूजा में भोजन नहीं होने पर व्यक्तिगत हॉल आवंटित किया जाता है।</li>
              <li>सूरज पूजा में भोजन होने पर आधा भवन आवश्यक माना जाता है।</li>
              <li>विवाह हेतु पूर्ण भवन तथा समाज कार्यक्रम हेतु सम्पूर्ण भवन आवश्यक है।</li>
              <li>सदस्य आवेदक के लिए सदस्यता क्रमांक देना अनिवार्य है।</li>
              <li>बुकिंग हेतु पिछली तिथि चयनित नहीं की जा सकती।</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

