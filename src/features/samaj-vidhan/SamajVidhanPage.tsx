import { SAMAJ_VIDHAN_SECTIONS } from "@/data/samaj-vidhan"
import { VidhanSection } from "@/features/samaj-vidhan/VidhanSection"
import { VidhanTableOfContents } from "@/features/samaj-vidhan/VidhanTableOfContents"

export function SamajVidhanPage() {
  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-6 shadow-[0_10px_30px_rgba(60,42,33,0.10)] sm:p-8">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">समाज का विधान</h1>
          <p className="mt-3 text-base font-medium text-foreground sm:text-lg">
            श्री पालीवाल ब्राह्मण समाज पंचायत 44 श्रेणी ( रजि. ), इंदौर
          </p>
          <p className="mt-2 text-sm text-primary">
            पंजीयन क्रमांक : <span className="font-semibold">03/27/03/08161/31-12-04</span>
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-foreground">
            पता :{"\n"}42, जूना तुकोगंज,{"\n"}महाराणा प्रताप मार्ग,{"\n"}इंदौर (म.प्र.)
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <VidhanTableOfContents sections={SAMAJ_VIDHAN_SECTIONS} />

          <div className="space-y-5 sm:space-y-6">
            {SAMAJ_VIDHAN_SECTIONS.map((section) => (
              <VidhanSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

