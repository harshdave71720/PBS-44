import Link from "next/link"
import {
  Baby, Scroll, Home, Heart, Map, MessageCircle, ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/SectionHeading"
import type { Dictionary } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  baby: Baby,
  scroll: Scroll,
  home: Home,
  heart: Heart,
  map: Map,
  "message-circle": MessageCircle,
}

const iconColors = [
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/10 text-accent",
  "bg-primary/10 text-primary",
  "bg-secondary/10 text-secondary",
  "bg-accent/10 text-accent",
]

interface ServicesSectionProps {
  services: Dictionary["home"]["services"]
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={services.heading}
          subheading={services.subheading}
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service, idx) => {
            const Icon = iconMap[service.icon] ?? Scroll
            const colorClass = iconColors[idx % iconColors.length]
            return (
              <Card
                key={service.id}
                className="card-hover group border-border/60 bg-card overflow-hidden"
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors"
                  >
                    बुकिंग करें
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className={cn(buttonVariants(), "bg-primary text-primary-foreground hover:bg-primary/90")}
          >
            सभी बुकिंग विकल्प देखें
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
