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
      className="relative overflow-hidden bg-hero-gradient text-primary-foreground"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern-mandala opacity-40" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
            <span className="text-sm font-medium text-accent">{hero.badge}</span>
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {hero.heading.split("\n").map((line, i) => (
              <span key={i} className={i === 1 ? "text-accent block" : "block"}>
                {line}
              </span>
            ))}
          </h1>

          {/* Ornamental divider */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="h-px w-16 bg-accent/40" />
            <span className="text-accent/80 text-lg">✦</span>
            <span className="h-px w-16 bg-accent/40" />
          </div>

          {/* Subheading */}
          <p className="mb-10 text-base text-primary-foreground/80 sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {hero.subheading}
          </p>
          {hero.registration ? (
            <p className="mb-4 text-sm text-accent font-medium">{hero.registration}</p>
          ) : null}
          {hero.description ? (
            <p className="mb-10 text-base text-primary-foreground/80 sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {hero.description}
            </p>
          ) : null}

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/booking"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8 shadow-lg shadow-accent/25"
              )}
            >
              {hero.ctaPrimary}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/40 bg-white/5 text-primary-foreground hover:bg-white/15 hover:border-white/60 text-base px-8 backdrop-blur-sm"
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
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-accent">{value}</p>
                <p className="text-xs text-primary-foreground/70 mt-0.5">{label}</p>
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
