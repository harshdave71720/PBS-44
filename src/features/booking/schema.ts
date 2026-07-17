import { z } from "zod"
import { BhavanType } from "@/types/availability"

const EVENT_TYPE_VALUES = [
  "sooraj_pooja",
  "vivah",
  "sagai",
  "dharmik_karyakram",
  "samaj_karyakram",
  "anya",
] as const

export const applicantBookingFormSchema = z.object({
  applicantName: z
    .string()
    .trim()
    .min(1, "आवेदक का नाम आवश्यक है"),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "मोबाइल नंबर 10 अंकों का होना चाहिए"),
  bhavanType: z.nativeEnum(BhavanType, {
    message: "धर्मशाला चुनना आवश्यक है",
  }),
  memberType: z
    .enum(["member", "non_member"])
    .refine((value) => Boolean(value), "सदस्य प्रकार चुनना आवश्यक है"),
  membershipNumber: z
    .string()
    .trim()
    .max(50, "सदस्यता क्रमांक 50 अक्षरों तक रखें")
    .optional(),
  eventCode: z.enum(EVENT_TYPE_VALUES, {
    message: "कार्यक्रम प्रकार चुनना आवश्यक है",
  }),
  eventDate: z
    .string()
    .trim()
    .min(1, "तिथि आवश्यक है")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "मान्य तिथि चुनें",
    })
    .refine((value) => {
      const selectedDate = new Date(`${value}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, "पिछली तिथि चयनित नहीं कर सकते"),
  foodRequired: z
    .enum(["yes", "no"])
    .refine((value) => Boolean(value), "भोजन आवश्यक विकल्प चुनें"),
  expectedGuests: z.coerce
    .number()
    .int()
    .gt(0, "अपेक्षित अतिथि 0 से अधिक होने चाहिए"),
  remarks: z
    .string()
    .trim()
    .max(500, "टिप्पणी 500 अक्षरों तक रखें")
    .optional(),
}).superRefine((values, ctx) => {
  if (values.memberType === "member" && !values.membershipNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["membershipNumber"],
      message: "सदस्य के लिए सदस्यता क्रमांक आवश्यक है",
    })
  }
})

export type ApplicantBookingFormValues = z.infer<typeof applicantBookingFormSchema>
