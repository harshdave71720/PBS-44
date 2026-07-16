import Image from "next/image"
import type { Dictionary } from "@/types"

interface HeroSectionProps {
  hero: Dictionary["home"]["hero"]
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section aria-label="मुख्य बैनर" className="border-y border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-4 shadow-[0_10px_30px_rgba(60,42,33,0.10)] sm:p-6 md:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded-xl border border-secondary/70 bg-[#F8F3E8]">
            <Image
              src="/images/charbhuja-ji.jpg"
              alt="श्री चारभुजा जी"
              width={720}
              height={720}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="rounded-xl border border-secondary/70 bg-[#FFF7E8] p-5 sm:p-6">
            <h1 className="text-2xl font-bold leading-tight text-primary sm:text-3xl">
              श्री पालीवाल ब्राह्मण समाज पंचायत
              <span className="mt-1 block">44 श्रेणी ( रजि. ), इंदौर</span>
            </h1>
            <p className="mt-4 text-base font-semibold text-primary sm:text-lg">
              पंजीयन क्रमांक :
              <span className="ml-2">{hero.registration ?? "03/27/03/08161/31-12-04"}</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground sm:text-base">
              समाज की परंपरा, श्रद्धा और सेवा भाव के साथ धर्मशाला उपलब्धता की जानकारी यहाँ सरल रूप में
              प्रस्तुत की जाती है।
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
