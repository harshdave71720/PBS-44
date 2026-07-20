"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"
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
import {
  getDuration,
  getEventLabel,
  getResourceRequirement,
  getResourceType,
  getSheetEventName,
  getTimeSlotDisplay,
} from "@/features/booking/utils/submission"

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
  gaonName: "",
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

function getDateInputValue(selectedDate: string | null): string {
  if (!selectedDate || !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    return ""
  }

  const [year, month, day] = selectedDate.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? selectedDate
    : ""
}

export function ApplicantBookingForm() {
  const searchParams = useSearchParams()
  const selectedDate = getDateInputValue(searchParams?.get("selectedDate") ?? null)
  const [formValues, setFormValues] = useState<ApplicantBookingFormValues>(() => ({
    ...DEFAULT_FORM_VALUES,
    eventDate: selectedDate,
  }))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [monthRecords, setMonthRecords] = useState<AvailabilityRecord[]>([])
  const [submitError, setSubmitError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

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

  const hasSelectedEvent = Boolean(formValues.eventCode)
  const availabilityDisplay = getAvailabilityDisplay(availabilityStatus)
  const resourceRequired = hasSelectedEvent
    ? getResourceRequirement(formValues.eventCode, formValues.foodRequired)
    : "—"
  const duration = hasSelectedEvent ? getDuration(formValues.eventCode) : "—"
  const timeSlotDisplay = hasSelectedEvent ? getTimeSlotDisplay(formValues.eventCode) : "—"
  const selectedBhavanLabel =
    BHAVAN_OPTIONS.find((option) => option.value === formValues.bhavanType)?.label ?? "मुख्य धर्मशाला"
  const selectedEventLabel = getEventLabel(formValues.eventCode)
  const hasAnyPrimaryDetail = Boolean(
    formValues.applicantName.trim() ||
    formValues.mobile.trim() ||
    formValues.eventDate.trim() ||
    (formValues.memberType === "member" && (formValues.membershipNumber ?? "").trim())
  )

  const handleFieldChange = <K extends keyof ApplicantBookingFormValues>(
    key: K,
    value: ApplicantBookingFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setSubmitError("")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      setSubmitError("")
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSubmitError("")
    setShowSuccessModal(false)

    try {
      const formData = {
        membershipNumber: parsed.data.membershipNumber ?? "",
        applicantName: parsed.data.applicantName,
        gaonName: parsed.data.gaonName,
        mobileNumber: parsed.data.mobile,
        bookedFor: parsed.data.eventDate,
        eventName: getSheetEventName(parsed.data.eventCode),
        foodRequired: parsed.data.foodRequired,
        resourceType: getResourceType(parsed.data.eventCode, parsed.data.foodRequired),
        bhavanName: selectedBhavanLabel,
      }
      const res = await fetch("/api/booking/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const result = (await res.json()) as
        | {
          error?: string
        }
        | undefined

      if (!res.ok) {
        throw new Error(result?.error ?? "बुकिंग अनुरोध जमा नहीं हो सका।")
      }

      setShowSuccessModal(true)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "बुकिंग अनुरोध जमा करते समय अनपेक्षित त्रुटि हुई।"
      )
    } finally {
      setIsSubmitting(false)
    }
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
              <label htmlFor="gaonName">गाँव का नाम</label>
              <Input
                id="gaonName"
                value={formValues.gaonName}
                onChange={(event) => handleFieldChange("gaonName", event.target.value)}
              />
              {errors.gaonName ? <p className="text-sm text-destructive">{errors.gaonName}</p> : null}
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
                <label htmlFor="membershipNumber">सदस्य क्रमांक</label>
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
                value={formValues.eventCode || undefined}
                onValueChange={(value) =>
                  handleFieldChange("eventCode", (value ?? "") as ApplicantBookingFormValues["eventCode"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="कार्यक्रम चुनें" />
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "जमा हो रहा है..." : "आवेदन जमा करें"}
            </Button>
            {submitError ? <p className="text-sm font-medium text-destructive">{submitError}</p> : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>लाइव बुकिंग इंटेलिजेंस</CardTitle>
            <CardDescription>यह पैनल फॉर्म बदलते ही तुरंत अपडेट होता है।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {!hasAnyPrimaryDetail ? (
              <p className="rounded-lg border border-border bg-[#FFFDF7] px-3 py-3 text-muted-foreground">
                कृपया विवरण भरें।
              </p>
            ) : null}

            <div className="rounded-lg border border-border bg-[#FFFDF7] p-3">
              <h4 className="mb-2 text-sm font-semibold text-primary">मुख्य विवरण</h4>
              <div className="grid gap-1.5">
                <p>
                  <strong>धर्मशाला:</strong> {selectedBhavanLabel}
                </p>
                <p>
                  <strong>सदस्य प्रकार:</strong> {formValues.memberType === "member" ? "सदस्य" : "गैर सदस्य"}
                </p>
                <p>
                  <strong>सदस्य क्रमांक:</strong>{" "}
                  {formValues.memberType === "member" ? formValues.membershipNumber || "—" : "लागू नहीं"}
                </p>
                <p>
                  <strong>कार्यक्रम:</strong> {selectedEventLabel}
                </p>
                <p>
                  <strong>भोजन:</strong> {formValues.foodRequired === "yes" ? "हाँ" : "नहीं"}
                </p>
                <p>
                  <strong>तिथि:</strong> {formValues.eventDate || "—"}
                </p>
                <p>
                  <strong>समय स्लॉट:</strong> {timeSlotDisplay}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#FFFDF7] p-3">
              <h4 className="mb-2 text-sm font-semibold text-primary">संसाधन एवं उपलब्धता</h4>
              <div className="grid gap-1.5">
                <p>
                  <strong>अवधि:</strong> {duration}
                </p>
                <p>
                  <strong>आवश्यक संसाधन:</strong> {resourceRequired}
                </p>
                <p className={cn("font-semibold", availabilityDisplay.className)}>
                  <strong className="text-foreground">उपलब्धता स्थिति:</strong> {availabilityDisplay.label}
                </p>
                {selectedDateRecord ? (
                  <>
                    <p>
                      <strong>रिकॉर्ड कार्यक्रम:</strong> {selectedDateRecord.eventName}
                    </p>
                    <p>
                      <strong>रिकॉर्ड टिप्पणी:</strong> {selectedDateRecord.remarks}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>महत्वपूर्ण निर्देश</CardTitle>
            <CardDescription>समाज की बुकिंग प्रक्रिया के मुख्य नियम।</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
              <li>सूरज पूजा बिना भोजन केवल हॉल हेतु मान्य है।</li>
              <li>सूरज पूजा भोजन सहित होने पर न्यूनतम आधा भवन आवश्यक है।</li>
              <li>बजरंग वाटिका की बुकिंग हेतु भवन मंत्री / कोष मंत्री से संपर्क करें</li>
              <li>बिजली, बर्तन और साफ़-सफ़ाई का चार्ज अलग से लगेगा।</li>
              <li>समाज कार्यक्रमों हेतु प्राथमिकता समाज को दी जाएगी।</li>
              <li>अंतिम स्वीकृति प्रबंधन समिति द्वारा की जाएगी।</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {showSuccessModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle id="booking-success-title">जय चारभूजा री</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p>आपका अनुरोध सफलतापूर्वक जमा हो गया है।</p>
              <p>अब आपको आगे की प्रक्रिया के लिए भवन मंत्री से संपर्क करना होगा।</p>
              <p>धन्यवाद!</p>
              <Button type="button" onClick={() => setShowSuccessModal(false)}>
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
