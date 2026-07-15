import type { VarshikUtsavSection as VarshikUtsavSectionType } from "@/data/varshik-utsav"

interface UtsavSectionProps {
  section: VarshikUtsavSectionType
}

export function UtsavSection({ section }: UtsavSectionProps) {
  return (
    <section
      id={`section-${section.id}`}
      className="scroll-mt-28 rounded-xl border border-border bg-[#FFFDF7] p-5 shadow-[0_6px_20px_rgba(60,42,33,0.07)] sm:p-6"
    >
      <h2 className="text-xl font-bold text-primary sm:text-2xl">
        {section.id}. {section.title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-foreground">{section.content}</p>
    </section>
  )
}

