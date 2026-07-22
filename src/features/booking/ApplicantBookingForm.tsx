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
  getBookingTypeLabel,
  getEventLabel,
  getSheetEventName,
} from "@/features/booking/utils/submission"
import type { PublicBookingInfo } from "@/features/booking/utils/availability"

type FieldErrors = Partial<Record<keyof ApplicantBookingFormValues, string>>
type AvailabilityViewStatus = "not_selected" | "available" | "partial" | "unavailable"

const BHAVAN_OPTIONS: Array<{ value: BhavanType; label: string }> = [
  { value: BhavanType.MAIN_BHAVAN, label: "मुख्य धर्मशाला" },
  { value: BhavanType.DEVPURI_BHAVAN, label: "देवपुरी धर्मशाला" },
  { value: BhavanType.GOVIND_COLONY_BHAVAN, label: "गोविंद कॉलोनी धर्मशाला" },
]

const EVENT_OPTIONS: Array<{ value: ApplicantBookingFormValues["eventName"]; label: string }> = [
  { value: "manglik_karyakram", label: "मांगलिक कार्यक्रम" },
  { value: "shok_uttarkaryakram", label: "शोक / उत्तरकार्य कार्यक्रम" },
  { value: "dharmik_karyakram", label: "धार्मिक कार्यक्रम" },
  { value: "samaj_karyakram", label: "सामाजिक कार्यक्रम" },
  { value: "anya", label: "अन्य" },
]

const DEFAULT_FORM_VALUES: ApplicantBookingFormValues = {
  memberType: "member",
  membershipNumber: "",
  memberName: "",
  memberMobileNumber: "",
  gaonName: "",
  applicantName: "",
  applicantMobileNumber: "",
  bookedFor: "",
  eventName: "manglik_karyakram",
  bookingType: "FULL_BHAVAN",
  remarks: "",
  bhavanType: BhavanType.MAIN_BHAVAN,
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

function getMonthKey(bookedFor: string): string {
  if (bookedFor) {
    const [year, month] = bookedFor.split("-").map(Number)
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

function getBhavanTypeValue(bhavan: string | null): BhavanType | undefined {
  return Object.values(BhavanType).includes(bhavan as BhavanType)
    ? (bhavan as BhavanType)
    : undefined
}

export function ApplicantBookingForm() {
  const searchParams = useSearchParams()
  const selectedDate = getDateInputValue(searchParams?.get("selectedDate") ?? null)
  const requestedBhavanType = getBhavanTypeValue(searchParams?.get("bhavan") ?? null)
  const [formValues, setFormValues] = useState<ApplicantBookingFormValues>(() => ({
    ...DEFAULT_FORM_VALUES,
    bookedFor: selectedDate,
    bhavanType: requestedBhavanType ?? DEFAULT_FORM_VALUES.bhavanType,
  }))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [monthRecords, setMonthRecords] = useState<AvailabilityRecord[]>([])
  const [dateBookings, setDateBookings] = useState<PublicBookingInfo[]>([])
  const [submitError, setSubmitError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  useEffect(() => {
    if (requestedBhavanType) {
      setFormValues((previous) => ({ ...previous, bhavanType: requestedBhavanType }))
    }
  }, [requestedBhavanType])

  const selectedMonthKey = getMonthKey(formValues.bookedFor)
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
    if (!formValues.bookedFor) {
      return undefined
    }
    return monthRecords.find((record) => record.date === formValues.bookedFor)
  }, [formValues.bookedFor, monthRecords])

  // Fetch confirmed bookings for the selected date + bhavan to compute real capacity
  useEffect(() => {
    if (!formValues.bookedFor) {
      setDateBookings([])
      return
    }
    let isMounted = true
    fetch(
      `/api/bookings?date=${encodeURIComponent(formValues.bookedFor)}&bhavan=${encodeURIComponent(formValues.bhavanType)}`
    )
      .then((res) => res.json())
      .then((data: { bookings?: PublicBookingInfo[] }) => {
        if (isMounted) setDateBookings(data.bookings ?? [])
      })
      .catch(() => { if (isMounted) setDateBookings([]) })
    return () => { isMounted = false }
  }, [formValues.bookedFor, formValues.bhavanType])

  // Weight-based capacity: FULL_BHAVAN=1.0, HALF_BHAVAN/HALL_ONLY=0.5
  const bookedWeight = useMemo(
    () => dateBookings.reduce((sum, b) => sum + (b.bookingType === "FULL_BHAVAN" ? 1.0 : 0.5), 0),
    [dateBookings]
  )
  const remainingCapacity = Math.max(0, 1.0 - bookedWeight)
  const isPartiallyBooked = remainingCapacity === 0.5

  const availabilityStatus: AvailabilityViewStatus = formValues.bookedFor
    ? selectedDateRecord
      ? toAvailabilityViewStatus(selectedDateRecord.status)
      : "available"
    : "not_selected"

  // When the date is partially booked, FULL_BHAVAN is not allowed — force to HALF_BHAVAN
  useEffect(() => {
    if (isPartiallyBooked && formValues.bookingType === "FULL_BHAVAN") {
      setFormValues((prev) => ({ ...prev, bookingType: "HALF_BHAVAN" }))
    }
  }, [isPartiallyBooked, formValues.bookingType])

  const availabilityDisplay = isPartiallyBooked
    ? { label: "⚠️ आंशिक उपलब्ध", className: "text-amber-700" }
    : remainingCapacity === 0
    ? { label: "❌ उपलब्ध नहीं", className: "text-red-700" }
    : getAvailabilityDisplay(availabilityStatus)
  const resourceRequired = isPartiallyBooked
    ? "आधा भवन (शेष भाग)"
    : getBookingTypeLabel(formValues.bookingType)
  const selectedBhavanLabel =
    BHAVAN_OPTIONS.find((option) => option.value === formValues.bhavanType)?.label ?? "मुख्य धर्मशाला"
  const selectedEventLabel = getEventLabel(formValues.eventName)
  const hasAnyPrimaryDetail = Boolean(
    formValues.applicantName.trim() ||
    formValues.applicantMobileNumber.trim() ||
    formValues.bookedFor.trim() ||
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
        memberName: parsed.data.memberName,
        memberMobileNumber: parsed.data.memberMobileNumber,
        applicantName: parsed.data.applicantName,
        gaonName: parsed.data.gaonName,
        applicantMobileNumber: parsed.data.applicantMobileNumber,
        bookedFor: parsed.data.bookedFor,
        eventName: getSheetEventName(parsed.data.eventName),
        bookingType: parsed.data.bookingType,
        bhavanName: selectedBhavanLabel,
        remarks: parsed.data.remarks,
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

            <div className="grid gap-2">
              <label htmlFor="membershipNumber">सदस्य क्रमांक</label>
              <Input
                id="membershipNumber"
                value={formValues.membershipNumber ?? ""}
                onChange={(event) => handleFieldChange("membershipNumber", event.target.value)}
              />
              {errors.membershipNumber ? <p className="text-sm text-destructive">{errors.membershipNumber}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="memberName">सदस्य नाम</label>
              <Input
                id="memberName"
                value={formValues.memberName}
                onChange={(event) => handleFieldChange("memberName", event.target.value)}
              />
              {errors.memberName ? <p className="text-sm text-destructive">{errors.memberName}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="memberMobileNumber">सदस्य का मोबाइल नंबर</label>
              <Input
                id="memberMobileNumber"
                inputMode="numeric"
                maxLength={10}
                value={formValues.memberMobileNumber}
                onChange={(event) => handleFieldChange("memberMobileNumber", event.target.value.replace(/\D/g, ""))}
              />
              {errors.memberMobileNumber ? <p className="text-sm text-destructive">{errors.memberMobileNumber}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="gaonName">गाँव का नाम</label>
              <Input id="gaonName" value={formValues.gaonName} onChange={(event) => handleFieldChange("gaonName", event.target.value)} />
              {errors.gaonName ? <p className="text-sm text-destructive">{errors.gaonName}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="applicantName">आवेदक का नाम</label>
              <Input id="applicantName" value={formValues.applicantName} onChange={(event) => handleFieldChange("applicantName", event.target.value)} />
              {errors.applicantName ? <p className="text-sm text-destructive">{errors.applicantName}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="applicantMobileNumber">आवेदक का मोबाइल नंबर</label>
              <Input
                id="applicantMobileNumber"
                inputMode="numeric"
                maxLength={10}
                value={formValues.applicantMobileNumber}
                onChange={(event) => handleFieldChange("applicantMobileNumber", event.target.value.replace(/\D/g, ""))}
              />
              {errors.applicantMobileNumber ? <p className="text-sm text-destructive">{errors.applicantMobileNumber}</p> : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="bookedFor">तिथि</label>
              <Input
                id="bookedFor"
                type="date"
                value={formValues.bookedFor}
                onChange={(event) => handleFieldChange("bookedFor", event.target.value)}
              />
              {errors.bookedFor ? <p className="text-sm text-destructive">{errors.bookedFor}</p> : null}
            </div>

            <div className="grid gap-2">
              <label>कार्यक्रम प्रकार</label>
              <Select
                value={formValues.eventName || undefined}
                onValueChange={(value) =>
                  handleFieldChange("eventName", (value ?? "") as ApplicantBookingFormValues["eventName"])
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
              {errors.eventName ? <p className="text-sm text-destructive">{errors.eventName}</p> : null}
            </div>

            <div className="grid gap-2">
              <label>बुकिंग प्रकार</label>
              <Select
                value={formValues.bookingType}
                onValueChange={(value) =>
                  handleFieldChange(
                    "bookingType",
                    (value ?? "FULL_BHAVAN") as ApplicantBookingFormValues["bookingType"]
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="बुकिंग प्रकार चुनें" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_BHAVAN" disabled={isPartiallyBooked}>पूरा भवन</SelectItem>
                  <SelectItem value="HALF_BHAVAN">आधा भवन</SelectItem>
                  <SelectItem value="HALL_ONLY">व्यक्तिगत हॉल</SelectItem>
                </SelectContent>
              </Select>
              {isPartiallyBooked && formValues.bookedFor ? (
                <p className="text-sm font-medium text-amber-700">
                  {new Date(formValues.bookedFor).toLocaleDateString("hi-IN", { day: "numeric", month: "long" })}{" "}
                  को आधा भवन पूर्व में बुक हो चुका है। आप केवल शेष आधा भवन बुक कर सकते हैं।
                </p>
              ) : null}
              {errors.bookingType ? <p className="text-sm text-destructive">{errors.bookingType}</p> : null}
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
                  <strong>तिथि:</strong> {formValues.bookedFor || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#FFFDF7] p-3">
              <h4 className="mb-2 text-sm font-semibold text-primary">संसाधन एवं उपलब्धता</h4>
              <div className="grid gap-1.5">
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
