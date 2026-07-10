/** Decorative divider inspired by traditional Indian textile motifs */
export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-2 py-2 ${className ?? ""}`}
    >
      <span className="h-px flex-1 bg-border" />
      <span className="flex items-center gap-1 text-accent/60 select-none">
        <span className="text-xs">✦</span>
        <span className="text-sm">ॐ</span>
        <span className="text-xs">✦</span>
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
