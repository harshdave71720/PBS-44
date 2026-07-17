import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function BookingActionsSection() {
  return (
    <section className="bg-background py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary/80 bg-[#FFF7E8] p-5 shadow-[0_8px_24px_rgba(60,42,33,0.08)] sm:p-6">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">भवन उपलब्धता</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">
            चयनित तिथि पर भवन की उपलब्धता तुरंत देखने के लिए नीचे दिए गए बटन पर क्लिक करें।
          </p>
          <div className="mt-4">
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              उपलब्धता देखें
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-5 shadow-[0_8px_24px_rgba(60,42,33,0.08)] sm:p-6">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">भवन बुकिंग आवेदन पत्र</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">
            भवन बुकिंग हेतु आवेदन पत्र भरने के लिए नीचे दिए गए बटन पर क्लिक करें।
          </p>
          <div className="mt-4">
            <Link
              href="/booking-form"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
              )}
            >
              आवेदन पत्र भरें
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
