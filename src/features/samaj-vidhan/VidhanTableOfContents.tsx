import Link from "next/link"
import type { SamajVidhanSection } from "@/data/samaj-vidhan"

interface VidhanTableOfContentsProps {
  sections: SamajVidhanSection[]
}

export function VidhanTableOfContents({ sections }: VidhanTableOfContentsProps) {
  return (
    <nav
      aria-label="विषय सूची"
      className="rounded-2xl border border-secondary/70 bg-[#FFFAF0] p-5 shadow-[0_8px_24px_rgba(60,42,33,0.08)] sm:p-6 print:hidden"
    >
      <h2 className="text-xl font-bold text-primary sm:text-2xl">विषय सूची</h2>
      <ol className="mt-4 grid list-decimal gap-2 pl-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <li key={section.id} className="text-sm leading-relaxed text-foreground sm:text-base">
            <Link
              href={`#section-${section.id}`}
              className="transition-colors hover:text-primary hover:underline"
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

