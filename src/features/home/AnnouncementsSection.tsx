import Link from "next/link"
import { ArrowRight, Bell, Calendar, Megaphone, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SectionHeading } from "@/components/shared/SectionHeading"
import type { Announcement, Dictionary } from "@/types"

const categoryConfig: Record<
  Announcement["category"],
  { icon: React.ElementType; variant: "default" | "secondary" | "outline" | "destructive"; label: string }
> = {
  notice: { icon: Bell, variant: "outline", label: "सूचना" },
  event: { icon: Calendar, variant: "default", label: "आयोजन" },
  news: { icon: Megaphone, variant: "secondary", label: "समाचार" },
  alert: { icon: AlertTriangle, variant: "destructive", label: "अलर्ट" },
}

interface AnnouncementsSectionProps {
  announcements: Dictionary["home"]["announcements"]
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading={announcements.heading}
          subheading={announcements.subheading}
          className="mb-10"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {announcements.items.map((item) => {
            const config = categoryConfig[item.category]
            const Icon = config.icon
            return (
              <Card
                key={item.id}
                className="card-hover group border-border/60 bg-card overflow-hidden"
              >
                {/* Top color accent based on category */}
                <div
                  className={`h-1 w-full ${
                    item.category === "alert"
                      ? "bg-destructive"
                      : item.category === "event"
                      ? "bg-primary"
                      : item.category === "news"
                      ? "bg-secondary"
                      : "bg-accent"
                  }`}
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <Badge variant={config.variant} className="text-xs shrink-0">
                      {config.label}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm leading-snug text-foreground mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                    {item.href && (
                      <Link
                        href={item.href}
                        className="text-xs font-medium text-primary hover:text-accent transition-colors flex items-center gap-0.5"
                      >
                        और पढ़ें
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/announcements"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {announcements.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
