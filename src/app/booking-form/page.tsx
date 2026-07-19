import { ApplicantBookingForm } from "@/features/booking/ApplicantBookingForm"

export default function BookingFormPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#7A1C1C]">पीबीएस-44 आवेदक बुकिंग</h1>
        <p className="text-sm text-muted-foreground">
          फॉर्म भरें, उपलब्धता जांचें, सारांश देखें और बुकिंग ऑब्जेक्ट की पुष्टि करें।
        </p>
      </div>
      <ApplicantBookingForm />
    </section>
  )
}


