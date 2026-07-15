import type { ExecutiveCommitteePerson } from "@/data/executive-committee"
import { ExecutiveCommitteeImage } from "@/features/executive-committee/ExecutiveCommitteeImage"

interface ExecutiveCommitteeCardProps {
  member: ExecutiveCommitteePerson
  highlighted?: boolean
  index?: number
}

export function ExecutiveCommitteeCard({
  member,
  highlighted = false,
  index = 0,
}: ExecutiveCommitteeCardProps) {
  return (
    <article
      className={[
        "group rounded-2xl border bg-[#FFFAF0] transition-all duration-200",
        "shadow-[0_8px_24px_rgba(60,42,33,0.10)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(60,42,33,0.16)]",
        highlighted
          ? "border-[#DEC484]/80 p-6"
          : "border-[#D7C6A0] p-4",
      ].join(" ")}
    >
      <ExecutiveCommitteeImage
        imageKey={member.imageKey}
        name={member.name}
        priority={index < 3}
      />

      <div className="mt-4 space-y-2 text-center">
        <span
          className={[
            "inline-flex items-center rounded-full border border-[#D7C6A0] bg-[#DEC484] px-3 py-1 text-xs font-semibold tracking-wide text-[#7F0000]",
          ].join(" ")}
        >
          {member.designation}
        </span>

        <h3
          className={[
            "font-semibold leading-snug",
            highlighted ? "text-base text-[#7F0000]" : "text-sm text-[#5A1010]",
          ].join(" ")}
        >
          {member.name}
        </h3>
      </div>
    </article>
  )
}
