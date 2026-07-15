import { z } from "zod"

export const applicantBookingFormSchema = z.object({
  applicantName: z
    .string()
    .trim()
    .min(1, "आवेदक का नाम आवश्यक है"),
  mobile: z
    .string()
    .trim()
    .min(1, "मोबाइल नंबर आवश्यक है"),
  memberType: z
    .enum(["member", "non_member"])
    .refine((value) => Boolean(value), "सदस्य प्रकार चुनना आवश्यक है"),
  eventCode: z
    .string()
    .trim()
    .min(1, "कार्यक्रम प्रकार चुनना आवश्यक है"),
  eventDate: z
    .string()
    .trim()
    .min(1, "तिथि आवश्यक है")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "मान्य तिथि चुनें",
    }),
  timeSlot: z
    .enum(["MORNING", "EVENING"])
    .refine((value) => Boolean(value), "समय स्लॉट चुनना आवश्यक है"),
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
})

export type ApplicantBookingFormValues = z.infer<typeof applicantBookingFormSchema>
