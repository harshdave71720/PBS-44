import { VARSHIK_UTSAV_SECTIONS } from "@/data/varshik-utsav"
import { UtsavSection } from "@/features/varshik-utsav/UtsavSection"
import { UtsavTableOfContents } from "@/features/varshik-utsav/UtsavTableOfContents"

export function VarshikUtsavPage() {
  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-6 shadow-[0_10px_30px_rgba(60,42,33,0.10)] sm:p-8">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">वार्षिक उत्सव</h1>
          <p className="mt-3 text-base font-medium text-foreground sm:text-lg">
            श्री पालीवाल ब्राह्मण समाज पंचायत 44 श्रेणी ( रजि. ), इंदौर
          </p>
          <p className="mt-2 text-sm text-primary">
            पंजीयन क्रमांक : <span className="font-semibold">03/27/03/08161/31-12-04</span>
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <UtsavTableOfContents sections={VARSHIK_UTSAV_SECTIONS} />

          <div className="space-y-5 sm:space-y-6">
            {VARSHIK_UTSAV_SECTIONS.map((section) => (
              <UtsavSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

