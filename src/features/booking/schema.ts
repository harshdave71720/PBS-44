import { z } from "zod"
import { BhavanType } from "@/types/availability"

const EVENT_TYPE_VALUES = [
  "manglik_karyakram",
  "shok_uttarkaryakram",
  "dharmik_karyakram",
  "samaj_karyakram",
  "anya",
] as const

const BOOKING_TYPE_VALUES = ["FULL_BHAVAN", "HALF_BHAVAN", "HALL_ONLY"] as const

export const applicantBookingFormSchema = z.object({
  memberType: z.enum(["member", "non_member"]),
  membershipNumber: z.string().trim().max(50, "सदस्यता क्रमांक 50 अक्षरों तक रखें").optional(),
  memberName: z.string().trim().max(100, "सदस्य का नाम 100 अक्षरों तक रखें"),
  memberMobileNumber: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{10}$/.test(value), "मोबाइल नंबर 10 अंकों का होना चाहिए"),
  gaonName: z.string().trim().min(1, "गाँव का नाम आवश्यक है"),
  applicantName: z.string().trim().min(1, "आवेदक का नाम आवश्यक है"),
  applicantMobileNumber: z.string().trim().regex(/^\d{10}$/, "मोबाइल नंबर 10 अंकों का होना चाहिए"),
  bookedFor: z
    .string()
    .trim()
    .min(1, "तिथि आवश्यक है")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), { message: "मान्य तिथि चुनें" })
    .refine((value) => {
      const selectedDate = new Date(`${value}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, "पिछली तिथि चयनित नहीं कर सकते"),
  eventName: z
    .union([z.enum(EVENT_TYPE_VALUES), z.literal("")])
    .refine((value) => value !== "", "कृपया कार्यक्रम प्रकार चुनें।"),
  bookingType: z
    .union([z.enum(BOOKING_TYPE_VALUES), z.literal("")])
    .refine((value) => value !== "", "कृपया बुकिंग प्रकार चुनें।"),
  remarks: z.string().trim().max(500, "टिप्पणी 500 अक्षरों तक रखें").optional(),
  bhavanType: z.nativeEnum(BhavanType, { message: "धर्मशाला चुनना आवश्यक है" }),
}).superRefine((values, ctx) => {
  if (values.memberType !== "member") return

  if (!values.membershipNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["membershipNumber"],
      message: "सदस्य के लिए सदस्यता क्रमांक आवश्यक है",
    })
  }
  if (!values.memberName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["memberName"],
      message: "सदस्य का नाम आवश्यक है",
    })
  }
  if (!values.memberMobileNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["memberMobileNumber"],
      message: "सदस्य का मोबाइल नंबर आवश्यक है",
    })
  }
})

export type ApplicantBookingFormValues = z.infer<typeof applicantBookingFormSchema>
