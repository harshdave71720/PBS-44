import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  badge?: string
  heading: string
  subheading?: string
  align?: "left" | "center"
  className?: string
  headingClassName?: string
}

export function SectionHeading({
  badge,
  heading,
  subheading,
  align = "center",
  className,
  headingClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-primary sm:text-4xl",
          headingClassName
        )}
      >
        {heading}
      </h2>
      {subheading && (
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
          {subheading}
        </p>
      )}
      {/* Ornamental underline */}
      <div
        className={cn(
          "flex gap-1",
          align === "center" ? "justify-center" : "justify-start"
        )}
      >
        <span className="h-1 w-12 rounded-full bg-accent" />
        <span className="h-1 w-4 rounded-full bg-secondary" />
        <span className="h-1 w-2 rounded-full bg-primary/40" />
      </div>
    </div>
  )
}
