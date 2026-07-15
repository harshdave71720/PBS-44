import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/SectionHeading"
import type { Dictionary } from "@/types"

interface AboutSectionProps {
  about: Dictionary["home"]["about"]
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text content */}
          <div className="space-y-6">
            <SectionHeading
              badge={about.badge}
              heading={about.heading}
              align="left"
            />

            <div className="space-y-4">
              {about.description.map((para, i) => (
                <p key={i} className="text-foreground leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Feature list */}
            <ul className="space-y-2">
              {[
                "इवेंट मास्टर आधारित कार्यक्रम चयन",
                "क्षेत्र मास्टर आधारित क्षेत्र सुझाव",
                "उपलब्धता इंजन द्वारा स्लॉट जांच",
                "समिति अनुमोदन और भुगतान सत्यापन प्रवाह",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className={cn(buttonVariants(), "mt-2")}
            >
              {about.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
          {about.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-secondary/75 bg-[#F8F3E8] p-8 text-center shadow-[0_8px_20px_rgba(60,42,33,0.08)]"
            >
              <span className="text-4xl font-bold text-primary">{stat.value}</span>
              <span className="mt-2 text-sm font-medium text-foreground">{stat.label}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
