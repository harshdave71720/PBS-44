import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowRight, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/SectionHeading"
import type { Dictionary } from "@/types"

interface EventsSectionProps {
  events: Dictionary["home"]["events"]
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={events.heading}
          subheading={events.subheading}
          className="mb-12"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.items.map((event, idx) => {
            const accentBg = ["bg-primary", "bg-secondary", "bg-accent"][idx % 3]
            return (
              <Card
                key={event.id}
                className="card-hover group overflow-hidden border-border/60"
              >
                {/* Date header */}
                <div className={`${accentBg} px-5 py-4 text-white`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 opacity-80" />
                    <span className="text-sm font-semibold">{event.date}</span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  {/* Category badge */}
                  <Badge variant="outline" className="text-xs border-accent/30 text-accent gap-1">
                    <Tag className="h-3 w-3" />
                    {event.category}
                  </Badge>

                  <h3 className="font-semibold text-foreground leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 pt-1 border-t border-border/40">
                    {event.time && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-accent transition-colors pt-1"
                  >
                    विवरण देखें
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {events.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
