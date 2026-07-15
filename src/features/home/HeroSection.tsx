import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { Dictionary } from "@/types"

interface HeroSectionProps {
  hero: Dictionary["home"]["hero"]
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden border-y border-border bg-hero-gradient text-foreground"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern-mandala opacity-70" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/50 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/70 bg-secondary/35 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">{hero.badge}</span>
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
            {hero.heading.split("\n").map((line, i) => (
              <span key={i} className={i === 1 ? "text-primary block" : "block"}>
                {line}
              </span>
            ))}
          </h1>

          {/* Ornamental divider */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-accent/40" />
            <span className="text-primary/80 text-lg">✦</span>
            <span className="h-px w-16 bg-accent/40" />
          </div>

          {/* Subheading */}
          <p className="mb-8 text-base text-foreground sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {hero.subheading}
          </p>
          {hero.registration ? (
            <p className="mb-4 text-sm text-primary font-semibold">{hero.registration}</p>
          ) : null}
          {hero.description ? (
            <p className="mb-10 text-base text-foreground sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {hero.description}
            </p>
          ) : null}

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "lg" }),
                "font-semibold text-base px-8 shadow-lg shadow-primary/20"
              )}
            >
              {hero.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-base px-8"
              )}
            >
              {hero.ctaSecondary}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "44", label: "श्रेणी समाज" },
              { value: "2", label: "मुख्य स्लॉट" },
              { value: "समिति", label: "अनुमोदन प्रक्रिया" },
              { value: "100%", label: "बुकिंग ट्रैकिंग" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-secondary/70 bg-[#F8F3E8] px-4 py-3 shadow-[0_6px_16px_rgba(60,42,33,0.08)]"
              >
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-xs text-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-background"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  )
}
